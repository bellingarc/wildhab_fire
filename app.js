const express =require('express')
const bodyParser = require('body-parser')
const { getEvents, postEvent } = require('./src/events')

const app = express()
app.use(bodyParser.json())
const port = 3005

app.get('/events', (req, res) => getEvents(req, res))
//app.get('/events',getEvents)
app.get('/', (req, res) => {
    res.status(200).send('Hello there!')
})
app.post('/events',postEvent)

app.listen(port,() => {
    console.log(`Listening on http://localhost: ${port}`)
})