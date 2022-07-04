const { User } = require("../models/User.model");

const getPayloadForUserId = async (id) => {
  const user = await User.findById(id);

  return {
    username: user.username,
    role: user.__t,
  };
};

module.exports = { getPayloadForUserId };
