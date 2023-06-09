import { go, assert, isntUndefined, isntNull, Getter, isFunction } from '@blackglory/prelude'
import { TextDecoderStream, isNodeJSReadableStream, toReadableStream, toAsyncIterableIterator } from 'extra-stream'
import { fetch, Request } from 'extra-fetch'
import { fromCode, HTTPError, HTTPClientError } from '@blackglory/http-status'
import { delay } from 'extra-promise'
import { IEvent } from './types.js'

const NULL = '\u0000'

/**
 * @throws {HTTPClientError}
 * @throws {AbortError}
 */
export async function* fetchEvents(
  input: URL | string | Getter<Request>
, {
    lastEventId
  , autoReconnect = true
  , retry = 0
  }: {
    lastEventId?: string

    autoReconnect?: boolean
    retry?: number
  } = {}
): AsyncIterableIterator<IEvent> {
  while (true) {
    try {
      const req = go(() => {
        const req = new Request(isFunction(input) ? input() : input)
        if (lastEventId) {
          req.headers.set('Last-Event-ID', lastEventId)
        }
        return req
      })
      const res = await fetch(req)
      if (res.status === 204) break
      if (res.status >= 400) throw fromCode(res.status)
      assert(
        res.headers.get('content-type') === 'text/event-stream'
      , 'The response is not a SSE stream'
      )

      const stream: ReadableStream<Uint8Array> = go(() => {
        assert(isntNull(res.body), 'The response has no body')

        if (isNodeJSReadableStream(res.body)) {
          return toReadableStream(go(
            async function* (): AsyncIterableIterator<Uint8Array> {
              for await (const chunk of res.body as unknown as NodeJS.ReadableStream) {
                yield new Uint8Array(Buffer.from(chunk))
              }
            }
          ))
        } else {
          return res.body
        }
      })

      const decoder = new TextDecoderStream('utf-8')
      const decodedStream = stream.pipeThrough(decoder)

      let remainingText = ''
      for await (const newText of toAsyncIterableIterator(decodedStream)) {
        remainingText += newText

        // 此处使用的正则表达式会将`foo\r\nbar`里的`\r\n`视作两个换行符, 这可能会违反标准.
        const eventTexts = remainingText.split(/[\r\n|\r|\n]{2}/)
        while (eventTexts.length > 1) {
          const eventText = eventTexts.shift()!
          const event = parseEventText(eventText)

          if (isntUndefined(event.id)) {
            lastEventId = event.id
          }
          if (isntUndefined(event.retry)) {
            retry = event.retry
          }

          yield event
        }
        remainingText = eventTexts[0]
      }

      if (autoReconnect) {
        await delay(retry)
      } else {
        break
      }
    } catch (e) {
      if (e instanceof HTTPError) {
        if (e instanceof HTTPClientError) {
          throw e
        } else {
          if (autoReconnect) {
            await delay(retry)
          } else {
            throw e
          }
        }
      } else {
        throw e
      }
    }
  }
}

function parseEventText(eventText: string): IEvent {
  const comment: string[] = []
  let event: string | undefined = undefined
  const data: string[] = []
  let id: string | undefined = undefined
  let retry: number | undefined = undefined

  const lines = eventText.split(/\r\n|\r|\n/)
  for (const line of lines) {
    const { field, value } = go((): {
      field: string
      value: string
    } => {
      const result = line.match(/^(?<field>.*?):(?<value>.*)$/)
      if (result) {
        return {
          field: result.groups!.field
        , value: trimFirstSpace(result.groups!.value)
        }
      } else {
        return { field: line, value: '' }
      }
    })

    switch (field) {
      case '': {
        comment.push(value)
        break
      }
      case 'event': {
        event = value
        break
      }
      case 'data': {
        data.push(value)
        break
      }
      case 'id': {
        if (!value.includes(NULL)) {
          id = value
        }
        break
      }
      case 'retry': {
        if (/^\d+$/.test(value)) {
          retry = Number.parseInt(value, 10)
        }
        break
      }
    }
  }

  return {
    comment: comment.length
             ? comment.join('\n')
             : undefined
  , event
  , data: data.length
          ? data.join('\n')
          : undefined
  , id
  , retry
  }
}

function trimFirstSpace(text: string): string {
  return text.startsWith(' ')
       ? text.slice(1)
       : text
}
