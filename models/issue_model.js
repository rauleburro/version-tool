const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const issueSchema = new Schema({
  index: {
    type: Number,
    required: true,
  },
  hash : {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  fixVersion: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  equipo: {
    type: String,
    required: false,
  },
  created: { type: Date, default: Date.now },
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
