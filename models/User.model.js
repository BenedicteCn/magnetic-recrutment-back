const { Schema, model } = require("mongoose");

const userOptions = {
  discriminatorKey: "usertype", // our discriminator key, could be anything
  collection: "users", // the name of our collection
};

// Our Base schema: these properties will be shared with our "real" schemas
const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
    },
    baseOptions
  )
);

module.exports = mongoose.model("User");
