const { MongoClient } = require('mongodb');
const express = require("express");
const app = express();
require('dotenv').config()
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const stripe = require("stripe")(process.env.STRIPE_SECRET);

let bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: false}));

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z2qxz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();

    const database = client.db("smartEducationSystem");
    const paymentCollection = database.collection("payment");

 
    app.post("/student-payment", async (req, res)=>{
        const payment = req.body;
        const result = await paymentCollection.insertOne(payment);
        res.json(result)
    })

    // app.get("/user-train-bookings", async (req, res)=>{
    //   const cursor = userTrainBookingsCollection.find({});
    //   const bookings = await cursor.toArray();
    //   res.send(bookings);
    // })

    app.post("/user-payment-history", async (req, res)=>{
      const userData = req.body;
      const query = { class: userData.class ,email: userData.email };
      const cursor = paymentCollection.find(query);
      // console.log("cursor", cursor);
      const history = await cursor.toArray();
      // console.log(userData.class, userData.email)
      // console.log(history)
      res.send(history);
    })

    app.post("/create-payment-intent", async (req, res)=>{  
      const paymentInfo = req.body;
      const amount = paymentInfo.totalBill * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        currency : 'usd',
        amount : amount,
        payment_method_types: ['card']
      });
      res.json({clientSecret: paymentIntent.client_secret})
    })

    // // // get api
    // app.get("/product", async (req, res)=>{

    //     const cursor = productCollection.find({});
    //     const services = await cursor.toArray();
    //     res.send(services)
    // })

    // // // get api
    // app.get("/review", async (req, res)=>{

    //     const cursor = reviewCollection.find({});
    //     const services = await cursor.toArray();
    //     res.send(services)
    // })

    // // // get api
    // app.get("/orders", async (req, res)=>{

    //     const cursor = ordersCollection.find({});
    //     const services = await cursor.toArray();
    //     res.send(services)
    // })
    
    // // // single service get 
    // app.get("/product/:id", async (req, res)=>{

    //     const id = req.params.id;
    //     const query = {_id: ObjectId(id)}

    //     const result = await productCollection.findOne(query);
    //     res.json(result)
    // })

    // // //post api
    // app.post("/product", async (req, res)=>{
    //     const product = req.body;
    //     const result = await productCollection.insertOne(product);
    //     res.json(result)
    // })

    // app.post("/review", async (req, res)=>{
    //     const product = req.body;
    //     const result = await reviewCollection.insertOne(product);
    //     res.json(result)
    // })

    // app.post("/orders", async (req, res)=>{
    //     const product = req.body;
    //     const result = await ordersCollection.insertOne(product);
    //     res.json(result)
    // })

    // //delete api
    // app.delete('/orders/:id', async (req, res)=>{
    //   const userid = req.params.id;
    //   const query = {_id: ObjectId(userid)};
    //   const result = await ordersCollection.deleteOne(query);

    //   res.json(result);

    // })

    // //delete api
    // app.delete('/product/:id', async (req, res)=>{
    //   const userid = req.params.id;
    //   const query = {_id: ObjectId(userid)};
    //   const result = await productCollection.deleteOne(query);

    //   res.json(result);

    // })

    // app.put("/orders/:id", async (req, res)=>{
    //   const id = req.params.id;
    //   const newBook = req.body;
    //   const filter = {_id: ObjectId(id)};
    //    const updateDoc = {
    //       $set: {
    //         panding: newBook.newOrderSt
    //       },
    //     };

    //     const result = await ordersCollection.updateOne(filter, updateDoc);
    //     res.json(result)
    //   })

    //   //storing the users to database [brand new users]
    //     app.post('/users', async (req, res) => {
    //         const user = req.body;
    //         const result = await usersCollection.insertOne(user);
    //         res.json(result);
    //     });

    //     //update and store the users [check if the user exists] for google login
    //     app.put('/users', async (req, res) => {
    //         const user = req.body;
    //         const filter = { email: user.email };
    //         const options = { upsert: true };
    //         const updateDoc = { $set: user };
    //         const result = await usersCollection.updateOne(filter, updateDoc, options);
    //         res.json(result);
    //     });

    //     //set the admin role 
    //     app.put('/users/admin', async (req, res) => {
    //         const user = req.body;
    //         const filter = { email: user.email };
    //         const updateDoc = { $set: { role: 'admin' } };
    //         const result = await usersCollection.updateOne(filter, updateDoc);
    //         res.json(result);
    //     });

    //     //checking the admin
    //     app.get('/users/:email', async (req, res) => {
    //         const email = req.params.email;
    //         const query = { email: email };
    //         const user = await usersCollection.findOne(query);
    //         res.json(user);
    //     });
  }
  finally{
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res)=>{
    res.send("Responding from server site")
})

app.listen(port, ()=>{
    console.log(`lisiting port on ${port}`)
})