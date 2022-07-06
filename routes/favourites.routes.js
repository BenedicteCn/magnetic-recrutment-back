const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const Saved = require("../models/Saved.model");

router.use(isAuthenticated);

router.get("/", async (req, res, next) => {
  const profiles = await Saved.find({ user: req.user }).populate("profile");
  res.json({ profiles });
});

const addFavToReq = (req, res, next) => {
  console.log("PARAMS", req.params);
  const favourite = {
    profile: req.params.id,
    hr: req.user,
  };
  req.favourite = favourite;
  next();
};

/* DELETE /:id */
router.delete("/:id", addFavToReq, async (req, res, next) => {
  try {
    const result = await unlike(req.favourite);

    if (!result) {
      res.status(404).json({ message: "Favourite does not exist" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/* POST /:id */
router.post("/:id", addFavToReq, async (req, res, next) => {
  try {
    const foundFavourite = await like(req.favourite);
    if (foundFavourite) {
      res.status(409).json({ message: "Favourite already exists" });
      return;
    }

    res.status(201).send();
  } catch (error) {
    next(error);
  }
});

const like = (favourite) => {
  return Saved.findOneAndUpdate(favourite, favourite, {
    upsert: true,
  });
};
const unlike = (favourite) => {
  return Saved.findOneAndDelete(favourite);
};

module.exports = router;
