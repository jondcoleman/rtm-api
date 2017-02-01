require('dotenv').config()
const axios = require('axios')
const opn = require('opn')
const jsonfile = require('jsonfile')

const createSignedUrl = require('./createSignedUrl')
const	stdin = process.stdin

const baseUrl = 'https://api.rememberthemilk.com/services/rest/'

api_key = process.env.API_KEY

function getFrob() {
  const params = [
    `method=rtm.auth.getFrob`
  ]
  const url = createSignedUrl(baseUrl, params)
  return axios.get(url)
    .then(res => res.data.rsp.frob)
}

function authenticate(frob, perms) {
  const authBaseUrl = 'https://www.rememberthemilk.com/services/auth/'
  const params = [
    `perms=${perms}`,
    `frob=${frob}`
  ]
  const authUrl = createSignedUrl(authBaseUrl, params)
  console.log(authUrl)
  opn(authUrl)

 	console.log('After authenticating, press any key to resume...');

 	stdin.resume();

  stdin.on('data', () => {
  const params = [
    `method=rtm.auth.getToken`,
    `frob=${frob}`,
  ]
  const url = createSignedUrl(baseUrl, params)
  axios.get(url)
    .then(res => {
      const token = res.data.rsp.auth.token
      jsonfile.writeFile('./authStore.json', { token }, (err) => {
        console.log(err || 'token saved')
        process.exit();
      })
    })
  })
}

function getToken() {
  getFrob()
    .then(frob => authenticate(frob, 'delete'))
}

getToken()
