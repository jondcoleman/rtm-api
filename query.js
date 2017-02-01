const axios = require('axios')
const jsonfile = require('jsonfile')
const createSignedUrl = require('./createSignedUrl')

const baseUrl = 'https://api.rememberthemilk.com/services/rest/'

function retrieveToken(callback) {
  jsonfile.readFile('./authStore.json', 'utf-8', (err, obj) => callback(obj.token))
}

function getTasks(token) {
  const params = [
    `method=rtm.tasks.getList`,
    `auth_token=${token}`,
    `filter=tag:p-conference`
  ]
  const url = createSignedUrl(baseUrl, params)
  axios.get(url)
    .then(res => {
      const rsp = res.data.rsp
      if (rsp.stat === 'fail') {
        console.error(`Error: ${JSON.stringify(rsp.err, null, 2)}`)
      } else {
        console.log(res.data.rsp.tasks.list[0].taskseries)
      }
    })
    .catch(err => console.error(err))
}

retrieveToken(getTasks)
