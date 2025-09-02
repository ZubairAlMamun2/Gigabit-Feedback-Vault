const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require("jsonwebtoken");

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

//creating middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
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
    app.post("/loginuser", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await employeeDB.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Include name, email, role in JWT payload
    const token = jwt.sign(
      { name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});


    //check
    // app.get("/profile", authMiddleware, (req, res) => {
    //   res.json({ message: "Welcome!", user: req.user });
    // });

    
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
