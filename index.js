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
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

//vercel related
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    /*     client.connect((error)=>{
      if(error){
        console.log(error)
        return;
      }
    }); */
    const toysCollection = client.db("toysDB").collection("toys");

    /*   const indexKeys = { name: 1 }; // Replace field1 and field2 with your actual field names
    const indexOptions = { name: "toyTitle" }; // Replace index_name with the desired index name
    const result = await toysCollection.createIndex(indexKeys, indexOptions); */

    //get data
    app.get("/alltoys", async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get the single data for details

    app.get("/alltoys/:id", async (req, res) => {
      const id = req.params.id;

      // Validate the id parameter
      if (!ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID format");
      }

      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    //getting user specific toys

    app.get("/toys/:text", async (req, res) => {
      console.log(req.params.text);
      if (req.params.text == "ascending") {
        const result = await toysCollection
          .find({})
          .sort({ price: 1 })
          .limit(20)
          .toArray();
        res.send(result);
      } else {
        const result = await toysCollection
          .find({})
          .sort({ price: -1 })
          .limit(20)
          .toArray();
        res.send(result);
      }
    });

    //user specific data
    app.get("/mytoys", async (req, res) => {
      let query = {};
      if (req.query?.selleremail) {
        query = { selleremail: req.query.selleremail };
      }
      const result = await toysCollection.find(query).toArray();

      res.send(result);
    });

    //search by category
    app.get("/alltoys1/:text", async (req, res) => {
      console.log("test");
      if (
        req.params.text == "Science" ||
        req.params.text == "Math" ||
        req.params.text == "Engineering"
      ) {
        const result = await toysCollection
          .find({ subcategory: req.params.text })
          .toArray();

        return res.send(result);
      }
      const result = await toysCollection.find({}).toArray();
      res.send(result);
    });

    //post the data
    app.post("/posttoys", async (req, res) => {
      const newToys = req.body;

      const result = await toysCollection.insertOne(newToys);
      res.send(result);
    });

    //get the single data of user
    app.get("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    //search by text
    app.get("/getToyByText/:text", async (req, res) => {
      const text = req.params.text;
      const result = await toysCollection
        .find({
          $or: [{ name: { $regex: text, $options: "i" } }],
        })
        .toArray();
      console.log(result);
      res.send(result);
    });

    //update toy
    app.put("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToy = req.body;
      const updateDoc = {
        $set: {
          price: updatedToy.price,
          quantity: updatedToy.quantity,
          details: updatedToy.details,
        },
      };
      const result = await toysCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    //delete data
    app.delete("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });

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
