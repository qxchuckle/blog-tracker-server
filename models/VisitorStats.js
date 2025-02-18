const mongoose = require("mongoose");

const visitorStatsSchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  date: { type: Date, required: true },
  visitCount: { type: Number, default: 0 },
  totalDuration: { type: Number, default: 0 },
});

const VisitorStats = mongoose.model("VisitorStats", visitorStatsSchema);

module.exports = VisitorStats;
