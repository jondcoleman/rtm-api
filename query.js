const fs = require('fs');
const axios = require('axios')
const jsonfile = require('jsonfile')
const createSignedUrl = require('./createSignedUrl')
const dir = './tmp';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

jsonfile.spaces = 2

const baseUrl = 'https://api.rememberthemilk.com/services/rest/'
const fileName = `${dir}/tasks.json`

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
        // const tasks = rsp.tasks.list[0].taskseries
        const tasks = rsp.tasks
        jsonfile.writeFile(fileName, tasks, (err) => console.log(err || `Saved to ${fileName}`))
      }
    })
    .catch(err => console.error(err))
}

retrieveToken(getTasks)
