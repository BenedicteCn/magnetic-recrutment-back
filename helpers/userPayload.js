const { User } = require("../models/User.model");

const getPayloadForUserId = async (id) => {
  const user = await User.findById(id);

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.__t,
  };
};

module.exports = { getPayloadForUserId };
