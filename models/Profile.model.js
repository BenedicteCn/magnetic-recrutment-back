const { Schema, SchemaTypes, model } = require("mongoose");

const profileSchema = new Schema(
  {
    CV: { type: String, required: true },
    Candidate: {
      type: SchemaTypes.ObjectId,
      ref: "Candidate",
    },
  },
  {
    timestamps: true,
  }
);

const Saved = model("Saved", profileSchema);

module.exports = Saved;
