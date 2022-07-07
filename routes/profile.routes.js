const router = require("express").Router();
const isHr = require("../middleware/isHr");
const isCandidate = require("../middleware/isCandidate");
const isAuthenticated = require("../middleware/isAuthenticated");
const fileUploader = require("../config/cloudinary.config.js");
const User = require("../models/User.model");
const Profile = require("../models/Profile.model");
const GithubProfile = require("../models/GithubProfile.model");
const { getProfileWithGithubProfiles } = require("../db/aggregations");
const { ObjectId } = require("mongoose").Types;

/* GET / */

router.get("/", isAuthenticated, isHr, async (req, res, next) => {
  try {
    //queries from frontend
    let { lang, cont, expe } = req.query;
    if (lang || cont || expe) {
      const filterArray = [];
      //put lang to array if user clicked
      if (lang && lang.length !== 0) {
        filterArray.push({
          technologies: {
            $all: lang,
          },
        });
      }
      if (cont && cont.length !== 0) {
        filterArray.push({
          contract: {
            $all: cont,
          },
        });
      }
      if (expe && expe.length !== 0) {
        filterArray.push({
          experience: {
            $all: expe,
          },
        });
      }

      if (filterArray.length > 0) {
        const relevantProfile = await getProfileWithGithubProfiles(filterArray);

        return res.status(200).json(relevantProfile);
      }
    }

    const allProfile = await getProfileWithGithubProfiles();
    return res.status(200).json(allProfile);
  } catch (err) {
    next(err);
  }
});

/* GET /:id */

router.get("/:id", async (req, res, next) => {
  try {
    const foundProfile = await Profile.aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "githubprofiles",
          localField: "candidate",
          foreignField: "candidate",
          as: "githubProfile",
        },
      },
    ]);
    res.status(200).json(foundProfile);
  } catch (error) {
    next(error);
  }
});

/* PATCH / */

router.patch(
  "/",
  isAuthenticated,
  fileUploader.single("cv"),
  async (req, res, next) => {
    if (!req.user._id) {
      // Generally we should not hit this because isAuthenticated should have given us a valid user
      res.status(401).json({ error: { message: "Could not authenticate" } });
      return;
    }

    // console.log(req.body, req.file);
    if (req.file) {
      req.body.cv = req.file.path;
    }
    try {
      const updatedUser = await Profile.findOneAndUpdate(
        { candidate: req.user._id },
        req.body,
        { new: true, upsert: true }
      );
      // console.log(updatedUser);
      res.status(200).json(updatedUser);
    } catch (e) {
      next(e);
    }
  }
);

/* DELETE / */

router.delete("/", isAuthenticated, async (req, res, next) => {
  try {
    if (!req.user._id) {
      res.status(401).json({ message: "could not authenticate" });
      return;
    }
    const deletedProfile = await Profile.findOneAndDelete({
      candidate: req.user._id,
    });
    // console.log(deletedProfile);
    res.json({ message: `I deleted your profile! 🤓` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
