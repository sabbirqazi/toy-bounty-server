const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y4xsfw0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toysCollection = client.db("toysDB").collection("toys");

    //get data
    app.get("/alltoys", async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


    //get the single data for details
  app.get("/alltoys/:text/:id", async (req, res) => {
      console.log(req.params.id);
      const toys = await toysCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(toys);
    }); 

//getting user specific toys 


app.get('/mytoys', async (req, res) => {
  console.log(req.query.selleremail);
  let query = {};
  if (req.query?.selleremail) {
      query = { selleremail: req.query.selleremail }
  }
  const result = await toysCollection.find(query).toArray();

  res.send(result);
})

/*     app.get("/mytoys/:email", async (req, res) => {
      
      const toys = await toysCollection
        .find({
          selleremail: req.params.email })
        .toArray();
        console.log(toys) 
      res.send(toys);
    }); */

    //search by category
    app.get("/alltoys/:text", async (req, res) => {
      console.log(req.params.text);
      if (
        req.params.text == "Science" ||
        req.params.text == "Math" ||
        req.params.text == "Engineering"
      ) {
        const result = await toysCollection
          .find({ subcategory: req.params.text })
          .toArray();
        /* console.log(result) */
        return res.send(result);
      }
      const result = await toysCollection.find({}).toArray();
      res.send(result);
    });
 

    //post the data
    app.post("/alltoys", async (req, res) => {
      const newToys = req.body;
      /* console.log(newToys); */
      const result = await toysCollection.insertOne(newToys);
      res.send(result);
    });


    app.get('/mytoys/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toysCollection.findOne(query);
      res.send(result);
  })

    //update toy
 /*   app.put("/updateToy/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      console.log(body);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title: body.title,
          salary: body.salary,
          category: body.category,
        },
      };
      const result = await toysCollection.updateOne(filter, updateDoc);
      res.send(result);
    }); */

    //delete data 
    app.delete('/mytoys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.deleteOne(query);
      res.send(result);
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    /*   await client.close(); */
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(" toys server is running");
});

app.listen(port, () => {
  console.log(`Toys Server is running on port: ${port}`);
});
