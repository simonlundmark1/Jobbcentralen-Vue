export default defineEventHandler((event) => {
  setHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  setHeader(event, 'Referrer-Policy', 'no-referrer')
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  setHeader(event, 'X-Frame-Options', 'DENY')
  // Relaxed CSP for development
  if (process.env.NODE_ENV === 'development') {
    setHeader(event, 'Content-Security-Policy',
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; img-src 'self' data: https: blob:; connect-src 'self' https: ws: wss:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; object-src 'none'; frame-ancestors 'none'")
  } else {
    // Strict CSP for production
    setHeader(event, 'Content-Security-Policy',
      "default-src 'self'; img-src 'self' data: https:; connect-src 'self' https:; style-src 'self' 'unsafe-inline'; script-src 'self' https:; object-src 'none'; frame-ancestors 'none'")
  }
})
