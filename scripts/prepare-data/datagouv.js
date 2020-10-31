const got = require('got')
const FormData = require('form-data')

async function replaceResourceFile(datasetId, resourceId, fileName, fileBuffer) {
  const url = `https://www.data.gouv.fr/api/1/datasets/${datasetId}/resources/${resourceId}/upload/`

  const form = new FormData()
  form.append('file', fileBuffer, {filename: fileName})

  const gotOptions = {
    headers: {
      'X-API-Key': process.env.DATAGOUV_API_KEY
    },
    body: form,
    responseType: 'json'
  }

  await got.post(url, gotOptions)
}

module.exports = {replaceResourceFile}
