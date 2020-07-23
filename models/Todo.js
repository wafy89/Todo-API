const { Schema, model } = require("mongoose");

const TodoSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  team: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = model("Todo", TodoSchema);
