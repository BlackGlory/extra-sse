import { fastify } from 'fastify'
import { delay } from 'extra-promise'
import { toReadableStream } from 'extra-stream'
import { go } from '@blackglory/prelude'

export function buildServer() {
  const server = fastify()

  server.get('/200', () => {
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

  server.get('/204', () => {
    return new Response(null, { status: 204 })
  })

  server.get('/302', () => {
    return new Response('', {
      status: 302
    , headers: {
        'Location': '/200'
      }
    })
  })

  server.get('/404', () => {
    return new Response('', { status: 404 })
  })

  server.get('/500', () => {
    return new Response('', { status: 500 })
  })

  server.get<{
    Headers: {
      'last-event-id': string
    }
  }>('/last-event-id', request => {
    const lastEventId = request.headers['last-event-id']

    return new Response(
      `data: ${lastEventId ?? 'null'}` + '\n'
    + `id: ${
        lastEventId
      ? Number.parseInt(lastEventId, 10) + 1
      : 0
      }` + '\n'
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

  server.get<{
    Headers: {
      'last-event-id': string
    }
  }>('/timestamp-without-retry', request => {
    const lastEventId = request.headers['last-event-id']

    return new Response(
      `data: ${Date.now()}` + '\n'
    + `id: ${
        lastEventId
      ? Number.parseInt(lastEventId, 10) + 1
      : 0
      }` + '\n'
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

  server.get<{
    Headers: {
      'last-event-id': string
    }
  }>('/timestamp-with-retry', request => {
    const lastEventId = request.headers['last-event-id']

    return new Response(
      `data: ${Date.now()}` + '\n'
    + `id: ${
        lastEventId
      ? Number.parseInt(lastEventId, 10) + 1
      : 0
      }` + '\n'
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

  server.get('/incorrect-content-type', () => {
    return new Response(
      ': foo' + '\n'
    + '\n'
    , { status: 200 }
    )
  })

  server.get('/single-event', () => {
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

  server.get('/multiple-events-single-packet', () => {
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

  server.get('/multiple-events-multiple-packets', () => {
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

  server.get('/single-comment-field', () => {
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

  server.get('/multiple-comment-fields', () => {
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

  server.get('/single-event-field', () => {
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

  server.get('/multiple-event-fields', () => {
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

  server.get('/single-data-field', () => {
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

  server.get('/multiple-data-fields', () => {
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

  server.get('/single-id-field', () => {
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

  server.get('/multiple-id-fields', () => {
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

  server.get('/single-retry-field', () => {
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

  server.get('/multiple-retry-fields', () => {
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

  server.get('/edge-json', () => {
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

  return server
}
