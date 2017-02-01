require('dotenv').config()
const crypto = require('crypto')

api_secret = process.env.API_SECRET
api_key = process.env.API_KEY

function createSignedUrl(base, params) {
  if (base === 'https://api.rememberthemilk.com/services/rest/') {
    params.push('format=json')
  }
  params.push(`api_key=${api_key}`)

  const str = params.join('&')
  const signature = createSignature(params, api_secret)
  const url = `${base}?${str}&api_sig=${signature}`
  return url
}

function createSignature(params, secret) {
  params.sort()
  const str = secret + params.sort().join('').replace(/[&,=]/gi,'')
  const signature = crypto.createHash('md5').update(str).digest('hex')
  return signature
}

module.exports = createSignedUrl
