const router = require("express").Router();
const Saved = require("../models/Saved.model");
const { HR } = require("../models/User.model");

router.get("/", async (req, res, next) => {
  const profiles = await Saved.find({ user: req.user }).populate("Profile");
  res.json({ profiles });
});

/* POST /:id */
router.post("/:id", async (req, res, next) => {
  try {
    // user = req.user.id;
    const favourite = {
      Profile: req.params.id,
      HR: req.user.id,
    };

    res.status(201).json(await like(favourite));
  } catch (error) {
    next(error);
  }
});

/* DELETE /:id */
router.delete("/:id", async (req, res, next) => {
  try {
    const favourite = {
      profile: req.params.id,
      user: req.user,
    };

    await unlike(favourite);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

const like = (favourite) => {
  return Saved.findOneAndUpdate(favourite, favourite, {
    upsert: true,
    new: true,
  });
};
const unlike = (favourite) => {
  return Saved.findOneAndDelete(favourite);
};

module.exports = router;
