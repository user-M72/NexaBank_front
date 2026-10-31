export default {
  async fetch(request) {
    const url = new URL(request.url)
    url.protocol = 'https:'
    url.hostname = 'nexabank-26mc.onrender.com'
    url.port = ''

    const headers = new Headers(request.headers)
    headers.delete('Origin')
    headers.delete('Referer')

    return fetch(url.toString(), {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual'
    })
  }
}