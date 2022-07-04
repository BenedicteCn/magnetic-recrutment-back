const router = require("express").Router();
const isHr = require("../middleware/isHr");
const isCandidate = require("../middleware/isCandidate");
const isAuthenticated = require("../middleware/isAuthenticated");
const fileUploader = require("../config/cloudinary.config.js");
const User = require("../models/User.model");
const Profile = require("../models/Profile.model");
const GithubProfile = require("../models/GithubProfile.model");

//Get all candidate profile
router.get("/", isAuthenticated, isHr, async (req, res, next) => {
  try {
    let { lang, cont, expe } = req.query;
    if (lang || cont || expe) {
      const filterArray = [];
      if (lang && lang.length != 0) {
        filterArray.push({
          technologies: {
            $all: lang,
          },
        });
      }
      if (cont && cont.length != 0) {
        filterArray.push({
          contract: {
            $all: cont,
          },
        });
      }
      if (expe && expe.length != 0) {
        filterArray.push({
          experience: {
            $all: expe,
          },
        });
      }
      console.log(filterArray);
      if (![lang?.length, cont?.length, expe?.length].includes(0)) {
        const relevantProfile = await Profile.find({
          $and: filterArray,
        }).populate("candidate githubProfile");
        return res.status(200).json(relevantProfile);
      }
    }

    const allProfile = await Profile.find().populate("candidate githubProfile");
    return res.status(200).json(allProfile);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const foundProfile = await Profile.findById(req.params.id).populate(
      "candidate githubProfile"
    );
    res.status(200).json(foundProfile);
  } catch (error) {
    next(error);
  }
});

//FORM

//to edit with the form
// router.get("/create", isAuthenticated, isCandidate, (req, res) =>
//   res.render("/")
// );

// router.post(
//   "/",
//   upload.single("url"),
//   isAuthenticated,
//   isCandidate,
//   async (req, res, next) => {
//     try {
//       if (req.file) {
//         req.body.image = req.file.path;
//       }
//       let postInput = req.body;
//       postInput.creator = req.user;
//       const createdPost = await Profile.create(postInput);
//       res.status(201).json(createdPost);
//     } catch (error) {
//       res.status(500).json(error);
//       next(error);
//     }
//   }
// );

router.patch(
  "/create",
  isAuthenticated,
  isCandidate,
  fileUploader.single("cv"),
  async (req, res, next) => {
    // const { remote, salary, contract, position, experience } = req.body;
    console.log(req.user);
    console.log(req.body, req.file);
    if (req.file) {
      req.body.cv = req.file.path;
    }
    try {
      const updatedUser = await Profile.findOneAndUpdate(
        { candidate: req.user._id },
        req.body,
        { new: true, upsert: true }
      );
      console.log(updatedUser);
      res.status(200).json(updatedUser);
    } catch (e) {
      next(e);
    }
    // .then((response) => {
    //   console.log(response);
    //   res.json(response);
    // })
    // .catch((err) => res.json(err));
  }
);

// router.post(
//   "/create",
//   isAuthenticated,
//   isCandidate,
//   fileUploader.single("document-cv"),
//   (req, res) => {
//     const { remote, salary, contract, position, technologies, experience } =
//       req.body;

//     Profile.create({
//       remote,
//       salary,
//       contract,
//       position,
//       technologies,
//       experience,
//       extra,
//       cvURL: req.file.path,
//     })
//       .then((newlyCreatedDocumentFromDB) => {
//         console.log(newlyCreatedDocumentFromDB);
//         res.redirect("/profile");
//       })
//       .catch((error) =>
//         console.log(`Error while creating a new document: ${error}`)
//       );
//   }
// );

router.delete(
  "/delete/:id",
  isAuthenticated,
  isCandidate,
  async (req, res, next) => {
    try {
      const user = req.user;
      const profile = await Profile.findById(req.params.id);
      if (profile === undefined) {
        return res.status(404).json({
          error: {
            message: `Profile doesn't exist. 😖`,
          },
        });
      }

      if (profile.user._id.toString() != profile._id.toString()) {
        return res.status(401).json({
          error: {
            message: `You can only delete your own comments. 🤭`,
          },
        });
      }
      const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
      console.log(deletedProfile);
      res.json({ message: `I deleted your profile! 🤓` });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
