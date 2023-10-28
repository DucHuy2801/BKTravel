const app = require('./src/app')

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`MoBoy-Backend listen on ${PORT}`)
})

process.on('SIGINT', () => {
  server.close(() => console.log(`Exit server express`))
})