// Protected route: only candidates can get access.

const isCandidate = async (req, res, next) => {
  const { role } = req.user;
  if (role !== "Candidate") {
    res.status(403).json({
      message: "You are not a Candidate",
    });
  }

  next();
};

module.exports = isCandidate;
