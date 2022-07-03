const { Schema, SchemaTypes, model } = require("mongoose");

const githubProfileSchema = new Schema({
  candidate: {
    type: SchemaTypes.ObjectId,
    ref: "Candidate",
  },

  username: SchemaTypes.String,
  repos: [
    {
      name: {
        type: SchemaTypes.String,
      },
      url: {
        type: SchemaTypes.String,
      },
    },
  ],
  languages: [
    {
      language: SchemaTypes.String,
      byteCount: SchemaTypes.Number,
    },
  ],
});

const GithubProfile = model("GithubProfile", githubProfileSchema);

module.exports = GithubProfile;
