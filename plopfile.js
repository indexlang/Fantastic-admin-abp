const https = require('https')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const api = axios.create({
  baseURL: 'https://localhost:44339',
  timeout: 1000 * 60,
  secure: false,
  responseType: 'json',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
})

module.exports = async function (plop) {
  let rr = {}
  await api.get('swagger/v1/swagger.json', {}, {}).then((p) => {
    rr = p.data
  })
  const swaggerpath = path.resolve('apifiles/swagger.json')
  fs.writeFileSync(swaggerpath, JSON.stringify(rr))

  rr = {}
  await api.get('api/abp/api-definition', {}, {}).then((p) => {
    rr = p.data
  })
  const definitionpath = path.resolve('apifiles/definition.json')
  fs.writeFileSync(definitionpath, JSON.stringify(rr))

  rr = {}
  await api.get('api/abp/application-configuration', {}, {}).then((p) => {
    rr = p.data
  })
  const applicationpath = path.resolve('apifiles/application.json')
  fs.writeFileSync(applicationpath, JSON.stringify(rr))

  plop.setWelcomeMessage('请选择需要创建的模式：')
  plop.setGenerator('module', require('./plop-templates/module/prompt'))
  plop.setGenerator('ABPModule', require('./plop-templates/abpcrud/abpPrompt'))
  plop.setGenerator('page', require('./plop-templates/page/prompt'))
  plop.setGenerator('component', require('./plop-templates/component/prompt'))
  plop.setGenerator('store', require('./plop-templates/store/prompt'))
  plop.setGenerator('mock', require('./plop-templates/mock/prompt'))
}
