const router = require("express").Router();
const Saved = require("../models/Saved.model");

router.get("/", async (req, res, next) => {
  const profiles = await Saved.find({ user: req.user }).populate("Profile");
  res.json({ profiles });
});

/* POST /:id */
//Create a Favorite
router.post("/", async (req, res, next) => {
  try {
    const userId = req.user;
    const foundFavorite = await Saved.find({
      $and: [{ user: userId }, { profile: req.body.profile }],
    });
    if (foundFavorite.length !== 0) {
      res
        .status(409)
        .json({ message: "You already saved this profile as a favorite." });
      return;
    }
    const createdFavorite = await Saved.create({
      ...req.body,
      user: userId,
    });

    res.status(201).json(createdFavorite);
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
