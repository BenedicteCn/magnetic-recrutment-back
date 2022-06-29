const isAuthenticated = require('./isAuthenticated');

const isHr = async (req, res, next) => {
  const { role } = req.user;
  if (role !== 'HR') {
    res.status(403).json({
      message: 'You are not a HR',
    });
  }

  next();
};

module.exports = isHr;
