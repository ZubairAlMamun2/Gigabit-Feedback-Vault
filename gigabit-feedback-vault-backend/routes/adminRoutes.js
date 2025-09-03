const express = require("express");
const { Parser } = require("json2csv");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");
const Feedback = require("../models/Feedback");

const router = express.Router();

// Get all feedbacks
router.get("/feedbacks", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
});

// Export to CSV
router.get(
  "/export-feedback",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const feedbacks = await Feedback.find();
      const fields = [
        { label: "From", value: "submitedByName" },
        { label: "To", value: "submitedToName" },
        { label: "Communication", value: "communication" },
        { label: "Skill", value: "skill" },
        { label: "Initiative", value: "initiative" },
        { label: "Comment", value: "comment" },
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(feedbacks);

      res.header("Content-Type", "text/csv");
      res.attachment("feedbacks.csv");
      return res.send(csv);
    } catch (err) {
      res.status(500).json({ error: "Failed to export CSV" });
    }
  }
);

// Summary of strengths/weaknesses
router.get("/summary", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const summary = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgCommunication: { $avg: "$communication" },
          avgSkill: { $avg: "$skill" },
          avgInitiative: { $avg: "$initiative" },
          comments: { $push: "$comment" },
        },
      },
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: "Failed to get summary" });
  }
});

module.exports = router;
