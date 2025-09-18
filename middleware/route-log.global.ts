export default function (to: any, from: any) {
  // Log every route navigation on both server and client
  const where = typeof window === 'undefined' ? 'server' : 'client'
  const fromPath = from && from.fullPath ? from.fullPath : '(initial)'
  const toPath = to && to.fullPath ? to.fullPath : '(unknown)'
  // eslint-disable-next-line no-console
  console.log(`[route:${where}]`, `${fromPath} -> ${toPath}`)

  // Highlight any navigation to /login
  if (to && to.path === '/login') {
    // eslint-disable-next-line no-console
    console.warn('[route] Navigation to /login detected')
    // Provide a short stack for client navigations to help trace initiator (no-op on server)
    if (typeof window !== 'undefined') {
      try {
        throw new Error('Trace: navigation to /login')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e)
      }
    }
  }
}
