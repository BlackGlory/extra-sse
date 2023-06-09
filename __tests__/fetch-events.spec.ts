import { server } from './fetch-events.mock.js'
import { fetchEvents } from '@src/fetch-events.js'
import { Request } from 'extra-fetch'
import { takeAsync, toArrayAsync } from 'iterable-operator'
import { getErrorPromise } from 'return-style'
import { NotFound, InternalServerError } from '@blackglory/http-status'
import { AbortController, AbortError, timeoutSignal } from 'extra-abort'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

const TIME_ERROR = 100

describe('fetchEvents', () => {
  describe('parse', () => {
    test('single event', async () => {
      const iter = fetchEvents('http://localhost/single-event', { autoReconnect: false })
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([
        {
          comment: 'foo'
        , event: 'bar'
        , data: 'baz'
        , id: 'qux'
        , retry: 1
        }
      ])
    })

    test('multiple events', async () => {
      const iter = fetchEvents('http://localhost/multiple-events', { autoReconnect: false })
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([
        {
          comment: 'foo'
        , event: 'foo'
        , data: 'foo'
        , id: 'foo'
        , retry: 1
        }
      , {
          comment: 'bar'
        , event: 'bar'
        , data: 'bar'
        , id: 'bar'
        , retry: 2
        }
      ])
    })

    test('single comment field', async () => {
      const iter = fetchEvents('http://localhost/single-comment-field', { autoReconnect: false })
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([
        {
          comment: 'foo'
        , event: undefined
        , data: undefined
        , id: undefined
        , retry: undefined
        }
      ])
    })

    test('multiple comment fields', async () => {
      const iter = fetchEvents('http://localhost/multiple-comment-fields', { autoReconnect: false })
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([
        {
          comment: 'foo' + '\n'
                 + 'bar'
        , event: undefined
        , data: undefined
        , id: undefined
        , retry: undefined
        }
      ])
    })

    test('single event field', async () => {
      const iter = fetchEvents('http://localhost/single-event-field', { autoReconnect: false })
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([
        {
          comment: undefined
        , event: 'foo'
        , data: undefined
        , id: undefined
        , retry: undefined
        }
      ])
    })

    test('multiple event fields', async () => {
      const iter = fetchEvents('http://localhost/multiple-event-fields', { autoReconnect: false })
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([
        {
          comment: undefined
        , event: 'bar'
        , data: undefined
        , id: undefined
        , retry: undefined
        }
      ])
    })

    test('single data field', async () => {
      const iter = fetchEvents('http://localhost/single-data-field', {
        autoReconnect: false
      })
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([
        {
          comment: undefined
        , event: undefined
        , data: 'foo'
        , id: undefined
        , retry: undefined
        }
      ])
    })

    test('multiple data fields', async () => {
      const iter = fetchEvents('http://localhost/multiple-data-fields', {
        autoReconnect: false
      })
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([
        {
          comment: undefined
        , event: undefined
        , data: 'foo' + '\n'
              + 'bar'
        , id: undefined
        , retry: undefined
        }
      ])
    })

    test('single id field', async () => {
      const iter = fetchEvents('http://localhost/single-id-field', { autoReconnect: false })
      const result = await toArrayAsync(takeAsync(iter, 1))

      expect(result).toStrictEqual([
        {
          comment: undefined
        , event: undefined
        , data: undefined
        , id: 'foo'
        , retry: undefined
        }
      ])
    })

    test('multiple id fields', async () => {
      const iter = fetchEvents('http://localhost/multiple-id-fields', {
        autoReconnect: false
      })
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([
        {
          comment: undefined
        , event: undefined
        , data: undefined
        , id: 'bar'
        , retry: undefined
        }
      ])
    })

    test('single retry field', async () => {
      const iter = fetchEvents('http://localhost/single-retry-field', {
        autoReconnect: false
      })
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([
        {
          comment: undefined
        , event: undefined
        , data: undefined
        , id: undefined
        , retry: 1
        }
      ])
    })

    test('multiple retry fields', async () => {
      const iter = fetchEvents('http://localhost/multiple-retry-fields', {
        autoReconnect: false
      })
      const result = await toArrayAsync(takeAsync(iter, 1))

      expect(result).toStrictEqual([
        {
          comment: undefined
        , event: undefined
        , data: undefined
        , id: undefined
        , retry: 2
        }
      ])
    })

    test('edge: json', async () => {
      const iter = fetchEvents('http://localhost/edge-json', {
        autoReconnect: false
      })
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([
        {
          comment: undefined
        , event: undefined
        , data: '{ "foo": "bar" }'
        , id: undefined
        , retry: undefined
        }
      ])
    })
  })

  describe('signal', () => {
    test('signal is aborted', async () => {
      const controller = new AbortController()
      controller.abort()

      const iter = fetchEvents(
        () => new Request('http://localhost/200', { signal: controller.signal })
      , { autoReconnect: true }
      )
      const err = await getErrorPromise(toArrayAsync(iter))

      expect(err).toBeInstanceOf(AbortError)
    })

    test('signal is not aborted', async () => {
      const controller = new AbortController()

      const iter = fetchEvents(
        () => new Request('http://localhost/200', { signal: controller.signal })
      , { autoReconnect: true }
      )
      const result = await toArrayAsync(takeAsync(iter, 1))

      expect(result).toStrictEqual([
        {
          comment: 'foo'
        , event: undefined
        , data: undefined
        , id: undefined
        , retry: undefined
        }
      ])
    })

    test('abort signal', async () => {
      const signal = timeoutSignal(1000) 
      const iter = fetchEvents(
        () => new Request('http://localhost/200', { signal })
      , { autoReconnect: true }
      )
      const err = await getErrorPromise(toArrayAsync(iter))

      expect(err).toBeInstanceOf(AbortError)
    })
  })

  describe('last event id', () => {
    test('set last event id', async () => {
      const iter = fetchEvents('http://localhost/last-event-id', {
        autoReconnect: true
      , lastEventId: '0'
      })
      const result = await toArrayAsync(takeAsync(iter, 2))

      expect(result).toStrictEqual([
        {
          comment: undefined
        , event: undefined
        , data: '0'
        , id: '1'
        , retry: undefined
        }
      , {
          comment: undefined
        , event: undefined
        , data: '1'
        , id: '2'
        , retry: undefined
        }
      ])
    })

    test('no last event id', async () => {
      const iter = fetchEvents('http://localhost/last-event-id', {
        autoReconnect: true
      , lastEventId: undefined
      })
      const result = await toArrayAsync(takeAsync(iter, 2))

      expect(result).toStrictEqual([
        {
          comment: undefined
        , event: undefined
        , data: 'null'
        , id: '0'
        , retry: undefined
        }
      , {
          comment: undefined
        , event: undefined
        , data: '0'
        , id: '1'
        , retry: undefined
        }
      ])
    })
  })

  describe('auto reconnect', () => {
    describe('enabled', () => {
      describe('retry', () => {
        test('set default retry', async () => {
          const iter = fetchEvents('http://localhost/timestamp-without-retry', {
            retry: 1000
          , autoReconnect: true
          })
          const result =  await toArrayAsync(takeAsync(iter, 2))

          expect(result).toStrictEqual([
            {
              comment: undefined
            , event: undefined
            , data: expect.any(String)
            , id: '0'
            , retry: undefined
            }
          , {
              comment: undefined
            , event: undefined
            , data: expect.any(String)
            , id: '1'
            , retry: undefined
            }
          ])
          const elapsedTime = Number(result[1].data) - Number(result[0].data)
          expect(elapsedTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
          expect(elapsedTime).toBeLessThanOrEqual(1000 + TIME_ERROR)
        })

        test('event does not include retry', async () => {
          const iter = fetchEvents('http://localhost/timestamp-without-retry', {
            retry: 0
          , autoReconnect: true
          })
          const result =  await toArrayAsync(takeAsync(iter, 2))

          expect(result).toStrictEqual([
            {
              comment: undefined
            , event: undefined
            , data: expect.any(String)
            , id: '0'
            , retry: undefined
            }
          , {
              comment: undefined
            , event: undefined
            , data: expect.any(String)
            , id: '1'
            , retry: undefined
            }
          ])
          const elapsedTime = Number(result[1].data) - Number(result[0].data)
          expect(elapsedTime).toBeGreaterThanOrEqual(0 - TIME_ERROR)
          expect(elapsedTime).toBeLessThanOrEqual(0 + TIME_ERROR)
        })

        test('event includes retry', async () => {
          const iter = fetchEvents('http://localhost/timestamp-with-retry', {
            retry: undefined
          , autoReconnect: true
          })
          const result = await toArrayAsync(takeAsync(iter, 3))

          expect(result).toStrictEqual([
            {
              comment: undefined
            , event: undefined
            , data: expect.any(String)
            , id: '0'
            , retry: 500
            }
          , {
              comment: undefined
            , event: undefined
            , data: expect.any(String)
            , id: '1'
            , retry: 1000
            }
          , {
              comment: undefined
            , event: undefined
            , data: expect.any(String)
            , id: '2'
            , retry: 1000
            }
          ])
          const elapsedTime1 = Number(result[1].data) - Number(result[0].data)
          expect(elapsedTime1).toBeGreaterThanOrEqual(500 - TIME_ERROR)
          expect(elapsedTime1).toBeLessThanOrEqual(500 + TIME_ERROR)
          const elapsedTime2 = Number(result[2].data) - Number(result[1].data)
          expect(elapsedTime2).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
          expect(elapsedTime2).toBeLessThanOrEqual(1000 + TIME_ERROR)
        })
      })

      test('edge: incorrect Content-Type', async () => {
        const iter = fetchEvents('http://localhost/incorrect-content-type', {
          autoReconnect: true
        })
        const err = await getErrorPromise(toArrayAsync(iter))

        expect(err?.message).toBe('The response is not a SSE stream')
      })

      test('200', async () => {
        const iter = fetchEvents('http://localhost/200', { autoReconnect: true })
        const result =  await toArrayAsync(takeAsync(iter, 2))

        expect(result).toStrictEqual([
          {
            comment: 'foo'
          , event: undefined
          , data: undefined
          , id: undefined
          , retry: undefined
          }
        , {
            comment: 'foo'
          , event: undefined
          , data: undefined
          , id: undefined
          , retry: undefined
          }
        ])
      })

      test('204', async () => {
        const iter = fetchEvents('http://localhost/204', { autoReconnect: true })
        const result =  await toArrayAsync(iter)

        expect(result).toStrictEqual([])
      })

      test('3xx', async () => {
        const iter = fetchEvents('http://localhost/302', { autoReconnect: true })
        const result =  await toArrayAsync(takeAsync(iter, 2))

        expect(result).toStrictEqual([
          {
            comment: 'foo'
          , event: undefined
          , data: undefined
          , id: undefined
          , retry: undefined
          }
        , {
            comment: 'foo'
          , event: undefined
          , data: undefined
          , id: undefined
          , retry: undefined
          }
        ])
      })

      test('4xx', async () => {
        const iter = fetchEvents('http://localhost/404', { autoReconnect: true })
        const err = await getErrorPromise(toArrayAsync(iter))

        expect(err).toBeInstanceOf(NotFound)
      })

      test('5xx', async () => {
        const signal = timeoutSignal(1000)
        const iter = fetchEvents(
          () => new Request('http://localhost/500', { signal })
        , { autoReconnect: true }
        )
        const err = await getErrorPromise(toArrayAsync(iter))

        expect(err).toBeInstanceOf(AbortError)
      })
    })

    describe('disabled', () => {
      test('edge: incorrect Content-Type', async () => {
        const iter = fetchEvents('http://localhost/incorrect-content-type', {
          autoReconnect: false
        })
        const err = await getErrorPromise(toArrayAsync(iter))

        expect(err?.message).toBe('The response is not a SSE stream')
      })

      test('200', async () => {
        const iter = fetchEvents('http://localhost/200', { autoReconnect: false })
        const result =  await toArrayAsync(iter)

        expect(result).toStrictEqual([
          {
            comment: 'foo'
          , event: undefined
          , data: undefined
          , id: undefined
          , retry: undefined
          }
        ])
      })

      test('204', async () => {
        const iter = fetchEvents('http://localhost/204', { autoReconnect: false })
        const result =  await toArrayAsync(iter)

        expect(result).toStrictEqual([])
      })

      test('3xx', async () => {
        const iter = fetchEvents('http://localhost/302', { autoReconnect: false })
        const result =  await toArrayAsync(iter)

        expect(result).toStrictEqual([
          {
            comment: 'foo'
          , event: undefined
          , data: undefined
          , id: undefined
          , retry: undefined
          }
        ])
      })

      test('4xx', async () => {
        const iter = fetchEvents('http://localhost/404', { autoReconnect: false })
        const err = await getErrorPromise(toArrayAsync(iter))

        expect(err).toBeInstanceOf(NotFound)
      })

      test('5xx', async () => {
        const iter = fetchEvents('http://localhost/500', { autoReconnect: false })
        const err = await getErrorPromise(toArrayAsync(iter))

        expect(err).toBeInstanceOf(InternalServerError)
      })
    })
  })
})
