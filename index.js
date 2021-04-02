const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b3llw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));



const port = 5000;

app.get('/', (req, res) => {
    res.send("hello it's working")
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("ajkerBajar").collection("products");

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productsCollection.insertOne(product)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({ key: { $in: productKeys } })
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.delete('/deleteProduct/:id', (req, res) => {
        productsCollection.deleteOne({_id: req.params.id})
        .then(documents => {
            console.log(documents)
            // res.send(!!documents.value)
        })
    })
});


app.listen(process.env.PORT || port)