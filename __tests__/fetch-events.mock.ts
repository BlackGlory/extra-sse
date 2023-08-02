import { setupServer } from 'msw/node'
import { rest } from 'msw'

export const server = setupServer(
  rest.get('http://localhost/200', (req, res, ctx) => {
    return res(
      ctx.status(200)
    , ctx.set('Connection', 'keep-alive')
    , ctx.set('Content-Type', 'text/event-stream')
    , ctx.body(
        ': foo' + '\n'
      + '\n'
      )
    )
  })

, rest.get('http://localhost/200-pending', (req, res, ctx) => {
    return res(
      ctx.status(200)
    , ctx.set('Connection', 'keep-alive')
    , ctx.set('Content-Type', 'text/event-stream')
    )
  })

, rest.get('http://localhost/204', (req, res, ctx) => {
    return res(ctx.status(204))
  })

, rest.get('http://localhost/302', (req, res, ctx) => {
    return res(
      ctx.status(302)
    , ctx.set('Location', 'http://localhost/200')
    )
  })

, rest.get('http://localhost/404', (req, res, ctx) => {
    return res(ctx.status(404))
  })

, rest.get('http://localhost/500', (req, res, ctx) => {
    return res(ctx.status(500))
  })

, rest.get('http://localhost/last-event-id', (req, res, ctx) => {
    const lastEventId = req.headers.get('Last-Event-ID')

    return res(
      ctx.status(200)
    , ctx.set('Connection', 'keep-alive')
    , ctx.set('Content-Type', 'text/event-stream')
    , ctx.body(
        `data: ${lastEventId}` + '\n'
      + `id: ${lastEventId ? Number.parseInt(lastEventId, 10) + 1 : 0}` + '\n'
      + '\n'
      )
    )
  })

, rest.get('http://localhost/timestamp-without-retry', (req, res, ctx) => {
    const lastEventId = req.headers.get('Last-Event-ID')

    return res(
      ctx.status(200)
    , ctx.set('Connection', 'keep-alive')
    , ctx.set('Content-Type', 'text/event-stream')
    , ctx.body(
        `data: ${Date.now()}` + '\n'
      + `id: ${lastEventId ? Number.parseInt(lastEventId, 10) + 1 : 0}` + '\n'
      + '\n'
      )
    )
  })

, rest.get('http://localhost/timestamp-with-retry', (req, res, ctx) => {
    const lastEventId = req.headers.get('Last-Event-ID')

    return res(
      ctx.status(200)
    , ctx.set('Connection', 'keep-alive')
    , ctx.set('Content-Type', 'text/event-stream')
    , ctx.body(
        `data: ${Date.now()}` + '\n'
      + `id: ${lastEventId ? Number.parseInt(lastEventId, 10) + 1 : 0}` + '\n'
      + `retry: ${lastEventId ? 1000 : 500}` + '\n'
      + '\n'
      )
    )
  })

, rest.get('http://localhost/incorrect-content-type', (req, res, ctx) => {
    return res(
      ctx.status(200)
    , ctx.body(
        ': foo' + '\n'
      + '\n'
      )
    )
  })

, rest.get(
    'http://localhost/single-event'
  , (req, res, ctx) => {
      return res(
        ctx.status(200)
      , ctx.set('Connection', 'keep-alive')
      , ctx.set('Content-Type', 'text/event-stream')
      , ctx.body(
          ': foo' + '\n'
        + 'event: bar' + '\n'
        + 'data: baz' + '\n'
        + 'id: qux' + '\n'
        + 'retry: 1' + '\n'
        + '\n'
        )
      )
    }
  )

, rest.get(
    'http://localhost/multiple-events'
  , (req, res, ctx) => {
      return res(
        ctx.status(200)
      , ctx.set('Connection', 'keep-alive')
      , ctx.set('Content-Type', 'text/event-stream')
      , ctx.body(
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
        )
      )
    }
  )

, rest.get(
    'http://localhost/single-comment-field'
  , (req, res, ctx) => {
      return res(
        ctx.status(200)
      , ctx.set('Connection', 'keep-alive')
      , ctx.set('Content-Type', 'text/event-stream')
      , ctx.body(
          ': foo' + '\n'
        + '\n'
        )
      )
    }
  )

, rest.get(
    'http://localhost/multiple-comment-fields'
  , (req, res, ctx) => {
      return res(
        ctx.status(200)
      , ctx.set('Connection', 'keep-alive')
      , ctx.set('Content-Type', 'text/event-stream')
      , ctx.body(
          ': foo' + '\n'
        + ': bar' + '\n'
        + '\n'
        )
      )
    }
  )

, rest.get(
    'http://localhost/single-event-field'
  , (req, res, ctx) => {
      return res(
        ctx.status(200)
      , ctx.set('Connection', 'keep-alive')
      , ctx.set('Content-Type', 'text/event-stream')
      , ctx.body(
          'event: foo' + '\n'
        + '\n'
        )
      )
    }
  )

, rest.get(
    'http://localhost/multiple-event-fields'
  , (req, res, ctx) => {
      return res(
        ctx.status(200)
      , ctx.set('Connection', 'keep-alive')
      , ctx.set('Content-Type', 'text/event-stream')
      , ctx.body(
          'event: foo' + '\n'
        + 'event: bar' + '\n'
        + '\n'
        )
      )
    }
  )

, rest.get(
    'http://localhost/single-data-field'
  , (req, res, ctx) => {
      return res(
        ctx.status(200)
      , ctx.set('Connection', 'keep-alive')
      , ctx.set('Content-Type', 'text/event-stream')
      , ctx.body(
          'data: foo' + '\n'
        + '\n'
        )
      )
    }
  )

, rest.get(
    'http://localhost/multiple-data-fields'
  , (req, res, ctx) => {
      return res(
        ctx.status(200)
      , ctx.set('Connection', 'keep-alive')
      , ctx.set('Content-Type', 'text/event-stream')
      , ctx.body(
          'data: foo' + '\n'
        + 'data: bar' + '\n'
        + '\n'
        )
      )
    }
  )

, rest.get(
    'http://localhost/single-id-field'
  , (req, res, ctx) => {
      return res(
        ctx.status(200)
      , ctx.set('Connection', 'keep-alive')
      , ctx.set('Content-Type', 'text/event-stream')
      , ctx.body(
          'id: foo' + '\n'
        + '\n'
        )
      )
    }
  )

, rest.get(
    'http://localhost/multiple-id-fields'
  , (req, res, ctx) => {
      return res(
        ctx.status(200)
      , ctx.set('Connection', 'keep-alive')
      , ctx.set('Content-Type', 'text/event-stream')
      , ctx.body(
          'id: foo' + '\n'
        + 'id: bar' + '\n'
        + '\n'
        )
      )
    }
  )

, rest.get(
    'http://localhost/single-retry-field'
  , (req, res, ctx) => {
      return res(
        ctx.status(200)
      , ctx.set('Connection', 'keep-alive')
      , ctx.set('Content-Type', 'text/event-stream')
      , ctx.body(
          'retry: 1' + '\n'
        + '\n'
        )
      )
    }
  )

, rest.get(
    'http://localhost/multiple-retry-fields'
  , (req, res, ctx) => {
      return res(
        ctx.status(200)
      , ctx.set('Connection', 'keep-alive')
      , ctx.set('Content-Type', 'text/event-stream')
      , ctx.body(
          'retry: 1' + '\n'
        + 'retry: 2' + '\n'
        + '\n'
        )
      )
    }
  )

, rest.get(
    'http://localhost/edge-json'
  , (req, res, ctx) => {
      return res(
        ctx.status(200)
      , ctx.set('Connection', 'keep-alive')
      , ctx.set('Content-Type', 'text/event-stream')
      , ctx.body(
          'data: { "foo": "bar" }' + '\n'
        + '\n'
        )
      )
    }
  )
)
