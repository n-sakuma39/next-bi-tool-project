import { expect, afterAll, afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from '../mocks/node'
import * as matchers from '@testing-library/jest-dom/matchers'
import type { Assertion, AsymmetricMatchersContaining } from 'vitest'

type MatcherResult = { pass: boolean; message: () => string }
type HTMLElementWithValue = HTMLElement & { value?: string | string[] | number | null }

type MatcherFunction<R = HTMLElement, T extends unknown[] = unknown[]> = (
  received: R | null,
  ...args: T
) => MatcherResult

type CustomMatchers = {
  toBeInTheDocument: MatcherFunction<HTMLElement, []>
  toBeVisible: MatcherFunction<HTMLElement, []>
  toHaveTextContent: MatcherFunction<HTMLElement, [string | RegExp]>
  toHaveValue: MatcherFunction<HTMLElementWithValue, [string | string[] | number | null]>
} & {
  [key: string]: MatcherFunction
}

// Vitestのexpectを拡張
expect.extend(matchers as unknown as CustomMatchers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
