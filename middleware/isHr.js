const isHr = async (req, res, next) => {
  console.log("i qm in hr middleware");
  const { role } = req.user;
  if (role !== "HR") {
    res.status(403).json({
      message: "You are not a HR",
    });
    return;
  }

  next();
};

module.exports = isHr;
