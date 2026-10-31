const ALLOWED = ['content-type', 'accept', 'authorization', 'cookie', 'user-agent', 'accept-language']

export default {
  async fetch(request) {
    const url = new URL(request.url)
    url.protocol = 'https:'
    url.hostname = 'nexabank-26mc.onrender.com'
    url.port = ''

    const headers = new Headers()
    for (const name of ALLOWED) {
      const value = request.headers.get(name)
      if (value) headers.set(name, value)
    }

    const upstream = await fetch(url.toString(), {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual'
    })

    const res = new Response(upstream.body, upstream)
    res.headers.set('x-proxied-status', String(upstream.status))
    return res
  }
}