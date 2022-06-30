const { Schema, model, mongoose } = require("mongoose");

const userSchema = new Schema(
  {
    username: { type: String },
    email: { type: String, required: true },
    password: { type: String },
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
  introduction: { type: String, maxlength: 250, minlength: 100 },
  githubId: { type: String },
});

const Candidate = User.discriminator("Candidate", candidateSchema);

module.exports = { User, Candidate, HR };
