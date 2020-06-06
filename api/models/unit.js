const mongoose = require("mongoose");

const unitSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  readonly: { type: Boolean, require: true },
  description: { type: String },
});

module.exports = mongoose.model("Unit", unitSchema);
