const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    submitedByEmail: { type: String, required: true },
    submitedToEmail: { type: String, required: true },
    submitedByName: { type: String, required: true },
    submitedToName: { type: String, required: true },
    communication: { type: Number, required: true },
    skill: { type: Number, required: true },
    initiative: { type: Number, required: true },
    comment: { type: String },
    sentiment: { type: String, enum: ["Positive", "Negative", "Neutral"] },
  },
  { timestamps: true, collection: "feedbacks" }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
