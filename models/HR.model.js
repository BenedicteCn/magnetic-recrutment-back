const User = require("./base"); // we have to make sure our Book schema is aware of the Base schema

const HR = User.discriminator(
  "HR",
  new mongoose.Schema({
    company: { type: String, required: true },
    title: { type: String, required: true },
  })
);

module.exports = mongoose.model("HR");
