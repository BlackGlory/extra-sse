import { isntUndefined } from '@blackglory/prelude'
import { IEvent } from './types.js'

export function* stringifyEvent(
  { comment, data, event, id, retry }: IEvent
): IterableIterator<string> {
  let sent = false

  if (isntUndefined(comment)) {
    for (const line of comment.split('\n')) {
      yield `: ${line}\n`
      sent = true
    }
  }

  if (isntUndefined(event)) {
    yield `event: ${event}\n`
    sent = true
  }

  if (isntUndefined(data)) {
    for (const line of data.split('\n')) {
      yield `data: ${line}\n`
      sent = true
    }
  }

  if (isntUndefined(id)) {
    yield `id: ${id}\n`
    sent = true
  }
  if (isntUndefined(retry)) {
    yield `retry: ${retry}\n`
    sent = true
  }

  if (sent) {
    yield '\n'
  } else {
    yield '\n\n'
  }
}
