const admin = require("firebase-admin")
const serviceAccount = require("../../credentials.json")
const personKeys=['last_name','verified', 'age', 'first_name']

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
}
const firestore = admin.firestore()
const peopleRef = firestore.collection('people')

exports.getSinglePerson = (req, res) => {
  if(!firestore) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
    firestore = admin.firestore()
  }
  const { personId } = req.params
  peopleRef.doc(personId).get()
    .then(doc => {
      let person = doc.data()
      person.id = doc.id
      res.status(200).json({
        status: 'success',
        data: person,
        message: 'person loaded successfully',
        statusCode: 200
      })
    })
    .catch(err => {
      res.status(500).send({
        status: 'error',
        data: err,
        message: 'Error getting person',
        statusCode: 500
      })
    })
}
exports.deletePerson = (req, res) => {
  if(!firestore) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
    firestore = admin.firestore()
  }
  const { personId } = req.params
  peopleRef.doc(personId).delete()
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: 'Person deleted successfully',
        statusCode: 204
      })
    })
    .catch(err => {
      res.status(500).json({
        status: 'error',
        data: err,
        message: 'Error deleting person',
        statusCode: 500
      })
    })
}
exports.updatePerson = (req, res) => {
  if(!firestore) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
    firestore = admin.firestore()
  }
  if (Object.keys(req.body).length ===0 || req.body === undefined){
    res.send({
        message: "no person defined"
    })
    return
  }
  if (req.body.first_name === null || req.body.last_name === null){
    res.send({
        message: 'Person name required'
    })
    return
  }
  if (typeof req.body.first_name !== 'string' || typeof req.body.last_name !== 'string'){
    res.send({
        message: 'invalid person name'
    })
    return
  }
  objKeys = Object.keys(req.body)
  const invalid = personKeys.some(key => !objKeys.includes(key))
  if (invalid) {
    res.send({
     message: 'Please fill out all required fields'
    })
    return
  }
  const { personId } = req.params
  peopleRef.doc(personId).update(req.body)
  .then(() => {
    let now = admin.firestore.FieldValue.serverTimestamp()
    let person = req.body
    person.updated_on = now
    res.status(200).json({
      status: 'success',
      message: 'Person updated successfully',
      statusCode: 204
    })
  })
  .catch(err => {
    res.status(500).json({
      status: 'error',
      data: err,
      message: 'Error updating person',
      statusCode: 500
    })
  })
}