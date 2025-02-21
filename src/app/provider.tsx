'use client'

/**
 * msw 有効化
 */
async function MocksServer() {
  if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
    const { worker } = await import('@/mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}
let isEnabled = false

export default function MocksProvider() {
  if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled' && !isEnabled) {
    isEnabled = true
    throw MocksServer()
  }
  return null
}
