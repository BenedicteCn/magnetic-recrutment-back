const { Schema, SchemaTypes, model } = require("mongoose");

const savedSchema = new Schema(
  {
    hr: {
      type: SchemaTypes.ObjectId,
      ref: "HR",
    },
    profile: {
      type: SchemaTypes.ObjectId,
      ref: "Profile",
    },
  },
  {
    timestamps: true,
  }
);

const Saved = model("Saved", savedSchema);

module.exports = Saved;
