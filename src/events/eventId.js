const admin = require("firebase-admin")
const serviceAccount = require("../../credentials.json")
const eventKeys=['desc', 'link', 'name', 'sport', 'time']

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
}
const firestore = admin.firestore()
const eventsRef = firestore.collection('events')

exports.getSingleEvent = (req, res) => {
  if(!firestore) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
    firestore = admin.firestore()
  }
  const { eventId } = req.params
  eventsRef.doc(eventId).get()
    .then(doc => {
      let event = doc.data()
      event.id = doc.id
      res.status(200).json({
        status: 'success',
        data: event,
        message: 'Events loaded successfully',
        statusCode: 200
      })
    })
    .catch(err => {
      res.status(500).send({
        status: 'error',
        data: err,
        message: 'Error getting events',
        statusCode: 500
      })
    })
}
exports.deleteEvent = (req, res) => {
  if(!firestore) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
    firestore = admin.firestore()
  }
  eventsRef.doc(req.params.eventId).delete()
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: 'Event deleted successfully',
        statusCode: 204
      })
    })
    .catch(err => {
      res.status(500).json({
        status: 'error',
        data: err,
        message: 'Error deleting event',
        statusCode: 500
      })
    })
}
exports.updateEvent = (req, res) => {
  if(!firestore) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
    firestore = admin.firestore()
  }
  if (Object.keys(req.body).length ===0 || req.body === undefined){
    res.send({
        message: "no event defined"
    })
    return
  }
  if (req.body.name === null){
    res.send({
        message: 'Event name required'
    })
  }
  if (typeof req.body.name !== 'string'){
    res.send({
        message: 'invalid event name'
    })
    return
  }
  objKeys = Object.keys(req.body)
  const invalid = eventKeys.some(key => !objKeys.includes(key))
  if (invalid) {
    res.send({
     message: 'Please fill out all required fields'
   })
   return
  }
  eventsRef.doc(req.params.eventId).update(req.body)
  .then(() => {
    let now = admin.firestore.FieldValue.serverTimestamp()
    let event = req.body
    event.updated_on = now
    res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      statusCode: 204
    })
  })
  .catch(err => {
    res.status(500).json({
      status: 'error',
      data: err,
      message: 'Error updating event',
      statusCode: 500
    })
  })
}