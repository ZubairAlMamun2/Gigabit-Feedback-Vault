const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require("jsonwebtoken");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();
const { Parser } = require("json2csv");

const PORT = 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ispqqvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

//middleware for authenticion
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    return;
  });
  next();
};

//middleware for admin only
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
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
    const feedbackDB = client.db("employeeDB").collection("feedback");

    // creating new USER
    app.post("/createnewuser", async (req, res) => {
      const user = req.body;

      try {
        const { email } = user;
        // Check if already exist
        const existing = await employeeDB.findOne({ email });
        if (existing) {
          return res.status(400).json({
            error: "You have already Registered.",
          });
        }
        const result = await employeeDB.insertOne(user);
        res.send(result);
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

    // accessing all employee, exclude admins
    app.get("/allemployee", authMiddleware, async (req, res) => {
      try {
        const cursor = employeeDB.find({ role: { $ne: "admin" } });
        const employeesOnly = await cursor.toArray();
        res.send(employeesOnly);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch users" });
      }
    });

    //submit-feedback
    app.post("/submit-feedback", authMiddleware, async (req, res) => {
      try {
        const {
          submitedByEmail,
          submitedToEmail,
          submitedByName,
          submitedToName,
          communication,
          skill,
          initiative,
          comment,
        } = req.body;

        if (!submitedByEmail || !submitedToEmail) {
          return res
            .status(400)
            .json({ error: "Both users must be specified" });
        }

        if (submitedByEmail === submitedToEmail) {
          return res
            .status(400)
            .json({ error: "You cannot submit feedback to yourself" });
        }

        //Check if already submitted
        const existing = await feedbackDB.findOne({
          submitedByEmail,
          submitedToEmail,
        });

        if (existing) {
          return res.status(400).json({
            error: "You have already submitted feedback for this colleague.",
          });
        }

        // Analyze sentiment
        const result = sentiment.analyze(comment || "");
        let sentimentCategory = "Neutral";
        if (result.score > 0) sentimentCategory = "Positive";
        else if (result.score < 0) sentimentCategory = "Negative";

        //  Insert feedback
        const feedback = {
          submitedByEmail,
          submitedToEmail,
          submitedByName,
          submitedToName,
          communication,
          skill,
          initiative,
          comment,
          sentiment: sentimentCategory,
          createdAt: new Date(),
        };

        await feedbackDB.insertOne(feedback);

        res.json({ message: "Feedback submitted successfully" });
      } catch (err) {
        res.status(500).json({ error: "Internal server error" });
      }
    });

    //get my feedback
    app.get("/my-feedback", authMiddleware, async (req, res) => {
      try {
        const userEmail = req.user.email;

        const feedbacks = await feedbackDB
          .find({ submitedToEmail: userEmail })
          .toArray();

        res.send(feedbacks);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch feedbacks" });
      }
    });




    app.get("/admin/feedbacks", authMiddleware,adminMiddleware, async (req, res) => {

      try {

        const feedbacks = await feedbackDB
          .find({})
          .toArray();

        res.send(feedbacks);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch feedbacks" });
      }
});



app.get("/admin/export-feedback", authMiddleware, adminMiddleware, async (req, res) => {
  const feedbacks = await feedbackDB.find({}).toArray();
  const fields = [
  { label: "From", value: "submitedByName" },
  { label: "To", value: "submitedToName" },
  { label: "Communication", value: "communication" },
  { label: "Skill", value: "skill" },
  { label: "Initiative", value: "initiative" },
  { label: "Comment", value: "comment" },
];const parser = new Parser({ fields });
  const csv = parser.parse(feedbacks);

  res.header("Content-Type", "text/csv");
  res.attachment("feedbacks.csv");
  return res.send(csv);
});




app.get("/admin/summary", authMiddleware,adminMiddleware, async (req, res) => {

  const summary = await feedbackDB.aggregate([
    {
      $group: {
        _id: "$submittedTo",
        avgCommunication: { $avg: "$communication" },
        avgSkill: { $avg: "$skill" },
        avgInitiative: { $avg: "$initiative" },
        comments: { $push: "$comment" }
      }
    }
  ]).toArray();

  res.json(summary);
});






  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Feedback Vault server is running");
});

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT} `);
});
