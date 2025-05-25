import { setupServer } from 'msw/node'
import { http } from 'msw'
import { delay } from 'extra-promise'
import { toReadableStream } from 'extra-stream'
import { go } from '@blackglory/prelude'

export const server = setupServer(
  http.get('http://localhost/200', () => {
    return new Response(
      ': foo' + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/204', () => {
    return new Response(null, { status: 204 })
  })

, http.get('http://localhost/302', () => {
    return new Response('', {
      status: 302
    , headers: {
        'Location': 'http://localhost/200'
      }
    })
  })

, http.get('http://localhost/404', () => {
    return new Response('', { status: 404 })
  })

, http.get('http://localhost/500', () => {
    return new Response('', { status: 500 })
  })

, http.get('http://localhost/last-event-id', ({ request }) => {
    const lastEventId = request.headers.get('Last-Event-ID')

    return new Response(
      `data: ${lastEventId}` + '\n'
    + `id: ${lastEventId ? Number.parseInt(lastEventId, 10) + 1 : 0}` + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/timestamp-without-retry', ({ request }) => {
    const lastEventId = request.headers.get('Last-Event-ID')

    return new Response(
      `data: ${Date.now()}` + '\n'
    + `id: ${lastEventId ? Number.parseInt(lastEventId, 10) + 1 : 0}` + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/timestamp-with-retry', ({ request }) => {
    const lastEventId = request.headers.get('Last-Event-ID')

    return new Response(
      `data: ${Date.now()}` + '\n'
    + `id: ${lastEventId ? Number.parseInt(lastEventId, 10) + 1 : 0}` + '\n'
    + `retry: ${lastEventId ? 1000 : 500}` + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/incorrect-content-type', () => {
    return new Response(
      ': foo' + '\n'
    + '\n'
    , { status: 200 }
    )
  })

, http.get('http://localhost/single-event', () => {
    return new Response(
      ': foo' + '\n'
    + 'event: bar' + '\n'
    + 'data: baz' + '\n'
    + 'id: qux' + '\n'
    + 'retry: 1' + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/multiple-events-single-packet', () => {
    return new Response(
      ': foo' + '\n'
    + 'event: foo' + '\n'
    + 'data: foo' + '\n'
    + 'id: foo' + '\n'
    + 'retry: 1' + '\n'
    + '\n'

    + ': bar' + '\n'
    + 'event: bar' + '\n'
    + 'data: bar' + '\n'
    + 'id: bar' + '\n'
    + 'retry: 2' + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/multiple-events-multiple-packets', () => {
    return new Response(
      toReadableStream(go(async function* () {
        yield ': foo' + '\n'
            + 'event: foo' + '\n'
            + 'data: foo' + '\n'
            + 'id: foo' + '\n'
            + 'retry: 1' + '\n'
            + '\n'

        await delay(100)

        yield ': bar' + '\n'
            + 'event: bar' + '\n'
            + 'data: bar' + '\n'
            + 'id: bar' + '\n'
            + 'retry: 2' + '\n'
            + '\n'
      }))
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/single-comment-field', () => {
    return new Response(
      ': foo' + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/multiple-comment-fields', () => {
    return new Response(
      ': foo' + '\n'
    + ': bar' + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/single-event-field', () => {
    return new Response(
      'event: foo' + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/multiple-event-fields', () => {
    return new Response(
      'event: foo' + '\n'
    + 'event: bar' + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/single-data-field', () => {
    return new Response(
      'data: foo' + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/multiple-data-fields', () => {
    return new Response(
      'data: foo' + '\n'
    + 'data: bar' + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/single-id-field', () => {
    return new Response(
      'id: foo' + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/multiple-id-fields', () => {
    return new Response(
      'id: foo' + '\n'
    + 'id: bar' + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/single-retry-field', () => {
    return new Response(
      'retry: 1' + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/multiple-retry-fields', () => {
    return new Response(
      'retry: 1' + '\n'
    + 'retry: 2' + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })

, http.get('http://localhost/edge-json', () => {
    return new Response(
      'data: { "foo": "bar" }' + '\n'
    + '\n'
    , {
        status: 200
      , headers: {
          'Connection': 'keep-alive'
        , 'Content-Type': 'text/event-stream'
        }
      }
    )
  })
)
