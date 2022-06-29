const { Schema, model, mongoose } = require("mongoose");

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

const HRSchema = new Schema({
  company: String,
  title: String,
});

const HR = User.discriminator("HR", HRSchema);

const candidateSchema = new Schema({
  introduction: String,
});

const Candidate = User.discriminator("Candidate", candidateSchema);

module.exports = { User, Candidate, HR };
