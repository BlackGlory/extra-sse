import { describe, test, expect } from 'vitest'
import { stringifyEvent } from '@src/stringify-event.js'
import { toArray } from '@blackglory/prelude'

describe('stringifyEvent', () => {
  test('general', () => {
    const comment = 'comment'
    const event = 'event'
    const data = 'data'
    const id = 'id'
    const retry = 1

    const iter = stringifyEvent({
      comment
    , event
    , data
    , id
    , retry
    })
    const result = toArray(iter)

    expect(result).toStrictEqual([
      ': comment' + '\n'
    , 'event: event' + '\n'
    , 'data: data' + '\n'
    , 'id: id' + '\n'
    , 'retry: 1' + '\n'
    , '\n'
    ])
  })

  describe('comment', () => {
    test('single line', () => {
      const comment = 'foo'

      const iter = stringifyEvent({ comment })
      const result = toArray(iter)

      expect(result).toStrictEqual([
        ': foo' + '\n'
      , '\n'
      ])
    })

    test('multiple lines', () => {
      const comment = 'foo' + '\n'
                    + 'bar'

      const iter = stringifyEvent({ comment })
      const result = toArray(iter)

      expect(result).toStrictEqual([
        ': foo' + '\n'
      , ': bar' + '\n'
      , '\n'
      ])
    })

    test('edge: empty', () => {
      const comment = ''

      const iter = stringifyEvent({ comment })
      const result = toArray(iter)

      expect(result).toStrictEqual([
        ': ' + '\n'
      , '\n'
      ])
    })

    test('edge: one space', () => {
      const comment = ' '

      const iter = stringifyEvent({ comment })
      const result = toArray(iter)

      expect(result).toStrictEqual([
        ':  ' + '\n'
      , '\n'
      ])
    })
  })

  test('event', () => {
    const event = 'foo'

    const iter = stringifyEvent({ event })
    const result = toArray(iter)

    expect(result).toStrictEqual([
      'event: foo' + '\n'
    , '\n'
    ])
  })

  describe('data', () => {
    test('single line', () => {
      const data = 'foo'

      const iter = stringifyEvent({ data })
      const result = toArray(iter)

      expect(result).toStrictEqual([
        'data: foo' + '\n'
      , '\n'
      ])
    })

    test('multiple lines', () => {
      const data = 'foo' + '\n'
                 + 'bar'

      const iter = stringifyEvent({ data })
      const result = toArray(iter)

      expect(result).toStrictEqual([
        'data: foo' + '\n'
      , 'data: bar' + '\n'
      , '\n'
      ])
    })

    test('edge: empty', () => {
      const data = ''

      const iter = stringifyEvent({ data })
      const result = toArray(iter)

      expect(result).toEqual([
        'data: ' + '\n'
      , '\n'
      ])
    })

    test('edge: one space', () => {
      const data = ' '

      const iter = stringifyEvent({ data })
      const result = toArray(iter)

      expect(result).toEqual([
        'data:  ' + '\n'
      , '\n'
      ])
    })
  })

  test('id', () => {
    const id = 'foo'

    const iter = stringifyEvent({ id })
    const result = toArray(iter)

    expect(result).toStrictEqual([
      'id: foo' + '\n'
    , '\n'
    ])
  })

  test('retry', () => {
    const retry = 1

    const iter = stringifyEvent({ retry })
    const result = toArray(iter)

    expect(result).toStrictEqual([
      'retry: 1' + '\n'
    , '\n'
    ])
  })
})
