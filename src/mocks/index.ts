export const initMocks = async () => {
  // browser
  if (typeof window !== 'undefined') {
    const { worker } = await import('@/mocks/browser')
    worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
  // node
  else {
    const { server } = await import('@/mocks/node')
    server.listen()
  }
}
