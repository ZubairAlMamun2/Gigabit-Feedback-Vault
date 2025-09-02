const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");

const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ispqqvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    //accessing database
    const employeeDB = client.db("employeeDB").collection("employees");


  // creating new USER
    app.post("/createnewuser", async (req, res) => {
      const user = req.body;
      console.log("New user:", user);

      try {
        const result = await employeeDB.insertOne(user);
        res.send(result); // will include { acknowledged: true, insertedId: ... }
      } catch (err) {
        res.status(500).json({ error: "Failed to create user" });
      }
    });




     // Login USER
      app.get("/loginuser", async (req, res) => {
    const email = req.query.email;  // e.g. ?email=test@gmail.com
    try {
      const user = await employeeDB.findOne({ email: email });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });



    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Feedback Vault server is running");
});

app.listen(PORT, () => {
  console.log(`server is running at ${PORT} `);
});
