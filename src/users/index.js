const admin = require("firebase-admin")
const serviceAccount = require("../../credentials.json")


if(!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
    }
const firestore = admin.firestore()
const peopleRef = firestore.collection('people')
exports.postPerson = (req, res) => {
    if(!firestore){
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        })
    }
    if (Object.keys(req.body).length ===0 || req.body === undefined){
        res.send({
            message: "no person defined"
        })
        return
    }
    if (req.body.name === null){
        res.send({
            message: 'Person name required'
        })
    }
    if (typeof req.body.name !== 'string'){
        res.send({
            message: 'invalid person name'
        })
        return
    }

    let newPerson = req.body
    let now = admin.firestore.FieldValue.serverTimestamp()
    newPerson.updated = now
    newPerson.created = now

    peopleRef.add(newPerson)
    .then(docRef => {
        console.log("person created", docRef.id)
        peopleRef.doc(docRef.id).get()
        .then(snapshot => {
            let person = snapshot.data()
                person.id = snapshot.id
                res.status(200).json({
                    status: 'success',
                    data: person,
                    message: 'People loaded successfully',
                    statusCode: 200
                })
            
        }).catch(err => {
            res.status(500).send({
                status: 'error',
                data: err,
                message: 'Error creating people',
                statusCode: 500
            })
          })
    })
}

exports.getPeople = (req, res) => {
    if(!firestore) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        })

        firestore = admin.firestore()
    }
    
    peopleRef.get()
        .then(collection => {
            const peopleResults = collection.docs.map(doc => {
                let person = doc.data()
                person.id = doc.id
                return person
            })
            res.status(200).json({
                status: 'success',
                data: peopleResults,
                message: 'People loaded successfully',
                statusCode: 200
            })
      })
      .catch(err => {
        res.status(500).send({
            status: 'error',
            data: err,
            message: 'Error getting People',
            statusCode: 500
        })
      }
      )
}
