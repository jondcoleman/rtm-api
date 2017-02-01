require('dotenv').config()
const axios = require('axios')
const crypto = require('crypto')
const opn = require('opn')
const	stdin = process.stdin

const baseUrl = 'https://api.rememberthemilk.com/services/rest/'

api_key = process.env.API_KEY
api_secret = process.env.API_SECRET

function getFrob(key, secret) {
  const params = [
    `method=rtm.auth.getFrob`,
    `api_key=${key}`,
    'format=json'
  ]
  const str = params.join('&')
  const sig = createSig(params, secret)
  const url = `${baseUrl}?${str}&api_sig=${sig}`
  console.log(url)
  return axios.get(url)
    .then(res => res.data.rsp.frob)
}

function createSig(params, secret) {
  params.sort()
  const str = secret + params.sort().join('').replace(/[&,=]/gi,'')
  const sig = crypto.createHash('md5').update(str).digest('hex')
  return sig
}

function authenticate(key, secret, frob, perms) {
  const authBaseUrl = 'https://www.rememberthemilk.com/services/auth/'
  const params = [
    `api_key=${key}`,
    `perms=${perms}`,
    `frob=${frob}`
  ]
  const sig = createSig(params, secret)
  const str = params.join('&')
  const authUrl = `${authBaseUrl}?${str}&api_sig=${sig}`
  opn(authUrl)

 	console.log('After authenticating, press any key to resume...');

 	stdin.resume();

  stdin.on('data', () => {
  const params = [
    `method=rtm.auth.getToken`,
    `api_key=${key}`,
    `frob=${frob}`,
    'format=json'
  ]
  const str = params.join('&')
  const sig = createSig(params, secret)
  const url = `${baseUrl}?${str}&api_sig=${sig}`
  console.log(url)
  axios.get(url)
    .then(res => {
      const token = res.data.rsp.auth.token
        const params = [
        `method=rtm.lists.getList`,
        `api_key=${key}`,
        'format=json',
        `auth_token=${token}`
      ]
      const str = params.join('&')
      const sig = createSig(params, secret)
      const url = `${baseUrl}?${str}&api_sig=${sig}`
      axios.get(url).then(res => console.log(JSON.stringify(res.data, null, 2)))
    })
  })
}

getFrob(api_key, api_secret)
  .then(frob => authenticate(api_key, api_secret, frob, 'delete'))
