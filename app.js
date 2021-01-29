const express =require('express')
const bodyParser = require('body-parser')
const { getEvents, postEvent } = require('./src/events')
const { getPeople, postPerson } = require('./src/users')
const { getSingleEvent, deleteEvent, updateEvent } = require('./src/events/eventId')
const { getSinglePerson, deletePerson, updatePerson } = require('./src/users/userId')

const app = express()
app.use(bodyParser.json())
const port = 3005

app.get('/', (req, res) => {
    res.status(200).send('Hello there!')
})
app.get('/events', getEvents)
app.get('/events/:eventId', getSingleEvent)
app.post('/events',postEvent)
app.delete('/events/:eventId', deleteEvent)
app.patch('/events/:eventId', updateEvent)

app.get('/people', getPeople)
app.get('/people/:personId', getSinglePerson)
app.post('/people',postPerson)
app.delete('/people/:personId', deletePerson)
app.patch('/people/:personId', updatePerson)


app.listen(port,() => {
    console.log(`Listening on http://localhost: ${port}`)
})