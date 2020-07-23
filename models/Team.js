const { Schema, model } = require("mongoose");

const TeamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

TeamSchema.virtual("todos", {
  ref: "Todo",
  localField: "_id",
  foreignField: "team",
});

module.exports = model("Team", TeamSchema);
