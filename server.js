const express = require('express')
const next = require('next')
const compression = require('compression')

const {buildDataset} = require('./build-dataset')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  const server = express()
  const {datasets} = await buildDataset()

  if (!dev) {
    server.use(compression())
  }

  server.get('*', (request, response) => {
    return handle(request, response)
  })

  server.get('/data', (request, response) => {
    response.send(datasets)
  })

  server.listen(port, err => {
    if (err) {
      throw err
    }

    console.log(`> Ready on http://localhost:${port}`)
  })
})
