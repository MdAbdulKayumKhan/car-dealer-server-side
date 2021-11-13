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
    const usersCollection = database.collection("users");


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


    // users: post
    app.post('/users', async (req, res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result)
      res.json(result)
    })
  
    app.put('/users', async (req, res)=>{
      const user = req.body;
      console.log(user)
      const filter = {email: user.email};
      const options = {upsert: true};
      const updateDoc = {$set: user};
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    })

    // make admin 
    app.put('/users/admin/', async (req, res)=>{
      const user = req.body;
      console.log('put', user)
      const filter = {email: user.email};
      const updateDoc = {$set: {role: 'admin'}};
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    })
    // check admin
    app.get('/users/:email', async (req, res)=>{
      const email = req.params.email;
      const query = {email: email};
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if(user?.role === 'admin'){
        isAdmin = true;
      }
      res.json({admin: isAdmin});
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