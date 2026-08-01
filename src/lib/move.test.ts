// node --test src/lib/move.test.ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { move } from './move.ts'

test('move', () => {
  const abc = ['a', 'b', 'c', 'd']
  assert.deepEqual(move(abc, 0, 2), ['b', 'c', 'a', 'd'], 'forward')
  assert.deepEqual(move(abc, 3, 1), ['a', 'd', 'b', 'c'], 'backward')
  assert.deepEqual(move(abc, 1, 1), abc, 'no-op')
  assert.deepEqual(abc, ['a', 'b', 'c', 'd'], 'input not mutated')
})
