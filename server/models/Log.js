const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  operation: {
    type: String,
    enum: ["create", "update", "delete"],
    required: true,
  },
  entityType: {
    type: String, // Məsələn: "Contract", "Payment", "Repair"
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  details: {
    type: Object,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Log", logSchema);
