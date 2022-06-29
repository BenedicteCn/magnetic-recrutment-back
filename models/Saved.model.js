const { Schema, SchemaTypes, model } = require("mongoose");

const savedSchema = new Schema(
  {
    HR: {
      type: SchemaTypes.ObjectId,
      ref: "HR",
    },
    Profile: {
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
