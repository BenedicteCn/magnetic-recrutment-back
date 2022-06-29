const User = require("./user"); // we have to make sure our Book schema is aware of the Base schema

const Candidate = User.discriminator(
  "Candidate",
  new mongoose.Schema({
    remote: {
      type: SchemaTypes.String,
      enum: ["Full", "Hybride", "On-site"],
      required: true,
    },
  })
);

module.exports = mongoose.model("Candidate");
