const mongoose = require("mongoose");

const ExampleSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: false,
    required: true,
  },
  otherInfo: {
    type: String,
    unique: false,
    required: true,
  },
});

const Example = mongoose.model("Example", ExampleSchema);

module.exports = Example;
