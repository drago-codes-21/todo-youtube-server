// text, isComplete, id, + userId
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    require: true,
    max: 300,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Todo", todoSchema);
