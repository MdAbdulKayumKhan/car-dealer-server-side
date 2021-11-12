const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000

// Middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krzs8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)
// carSalesDB
// j0sXsyjS6YyZvErR

async function run() {
  try {
    await client.connect();
    const database = client.db("carDealer");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");


    // create a product to insert
    app.post('/product', async (req, res) => {
      const result = await productsCollection.insertOne(req.body);
      console.log(`added product _id: ${result.insertedId}`);
      res.json(result);
    })

    // get product
    app.get('/product', async (req, res) => {
      const sort = { _id: -1 }
      const cursor = productsCollection.find({});
      const result = await cursor.sort(sort).toArray();
      res.json(result);
    })

    // order single services: get
    app.get('/order/:id', async (req, res)=>{
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      console.log(result)
      res.json(result)
    })

    // order service : post
    app.post('/order', async (req, res)=>{
      const result = await ordersCollection.insertOne(req.body);
      console.log('order add ', result.insertedId)
      res.json(result)
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})