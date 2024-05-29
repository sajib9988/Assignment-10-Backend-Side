const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const corsConfig = {
  origin: '',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))

// middleware
app.use(cors());
app.use(express.json());

// MongoDB setup

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nzdhwhu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Async function to establish MongoDB connection and define routes
async function run() {
  try {
    // Connect the client to the MongoDB server
    // await client.connect();

    // Define MongoDB collections
    const craftCollection = client.db('Assignment10DB').collection('Artcraft');
    
  const userCollection = client.db('Assignment10DB').collection('user');

    //  get all crafts
    app.get('/crafts', async (req, res) => {
      const crafts = await craftCollection.find().toArray();
      res.send(crafts);
    });

app.get('/crafts/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
   const result = await craftCollection.findOne(query);
   res.send(result);
});








    //  update a craft by ID
    app.put('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const updateCraft = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateCraft.name,
          subcategory: updateCraft.subcategory,
          description: updateCraft.description,
          price: updateCraft.price,
          rating: updateCraft.rating,
          image: updateCraft.image,
          customization: updateCraft.customization,
          processingTime: updateCraft.processingTime,
          stockStatus: updateCraft.stockStatus,
        }
      };
      const result = await craftCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    //  add a new craft
    app.post('/crafts', async (req, res) => {
      const newCraft = req.body;
      const result = await craftCollection.insertOne(newCraft);
      res.json(result);
    });


// Assuming you have a route to fetch crafts by user email
app.get('/mycrafts/:email', async (req, res) => {
  const userEmail = req.params.email;
  const myCrafts = await craftCollection.find({ email: userEmail }).toArray();
  res.json(myCrafts);
});



app.delete('/delete/:id', async(req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result =  await craftCollection.deleteOne(query);
  res.json(result);
});


    // app.get('/delete/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await craftCollection.deleteOne(query);
    //   res.send(result);
    // });



    // Send a ping to confirm a successful connection to the MongoDB server
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Call the async function to start the server
run().catch(console.dir);

// Default route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Start the server
app.listen(port, () => {
  console.log(`craftArt is running on port ${port}`);
});
