
const express = require('express')
const app = express();
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('database is working !')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@test.0kqsr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventCollection = client.db("volunteer").collection("events");
    

    app.get('/events', (req, res) => {
        eventCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    })

    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        eventCollection.insertOne(newEvent)
        .then(result => {
            console.log('inserted count', result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })

    app.delete('/deleteEvent/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        eventCollection.findOneAndDelete({_id: id})
        .then(deletedItem => {
            res.send(deletedItem !== null)
        })
    })

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})