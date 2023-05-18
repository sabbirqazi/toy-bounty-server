const express = require('express');
const cors = require('cors');
require('dotenv').config();
/* const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); */
const app = express();
const port = process.env.PORT || 5000;

// edqN2BOt3KbFl9q1

//learning-toy-manager

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Coffee making server is running')
})

app.listen(port, () => {
    console.log(`Coffee Server is running on port: ${port}`)
})