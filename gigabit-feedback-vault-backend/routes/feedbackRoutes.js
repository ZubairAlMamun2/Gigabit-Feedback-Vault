const express = require("express");
const Sentiment = require("sentiment");
const authMiddleware = require("../middleware/auth");
const Feedback = require("../models/Feedback");

const router = express.Router();
const sentiment = new Sentiment();

// Submit feedback
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    if (data.submitedByEmail === data.submitedToEmail) {
      return res
        .status(400)
        .json({ error: "You cannot submit feedback to yourself" });
    }

    const existing = await Feedback.findOne({
      submitedByEmail: data.submitedByEmail,
      submitedToEmail: data.submitedToEmail,
    });
    if (existing) {
      return res.status(400).json({ error: "Feedback already submitted" });
    }

    const result = sentiment.analyze(data.comment || "");
    let sentimentCategory = "Neutral";
    if (result.score > 0) sentimentCategory = "Positive";
    else if (result.score < 0) sentimentCategory = "Negative";

    const feedback = new Feedback({ ...data, sentiment: sentimentCategory });
    await feedback.save();

    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// Get my feedback
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ submitedToEmail: req.user.email });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
});

module.exports = router;
