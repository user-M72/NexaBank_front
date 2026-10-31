export default {
    async fetch(request) {
      const url = new URL(request.url)
      url.protocol = 'https:'
      url.hostname = 'nexabank-26mc.onrender.com'
      url.port = ''
      return fetch(new Request(url, request))
    }
  }