const router = require("express").Router();
const isHr = require("../middleware/isHr");
const isCandidate = require("../middleware/isCandidate");
const isAuthenticated = require("../middleware/isAuthenticated");
const upload = require("../config/cloudinary.config.js");
const User = require("../models/User.model");
const Profile = require("../models/Profile.model");

//Get all candidate profile
router.get("/", isAuthenticated, isHr, async (req, res, next) => {
  try {
    const allProfile = await Profile.find();
    res.status(200).json(allProfile);
  } catch (err) {
    next(err);
  }
});

// Get profile by job field
// router.get('/:name', async (req, res, next) => {
//   try {
//     const jobField = req.params.name;

//     const OneProfile = await Profile.find({
//       name: { $regex: jobField, $options: 'i' },
//     });
//     res.status(200).json(OneProfile);
//   } catch (err) {
//     next(err);
//   }
// });
// Get profile by job field name
router.get("/field/:name", async (req, res, next) => {
  try {
    const profileField = req.params.name;
    const allProfile = await Profile.find({ field: profileField });
    res.status(200).json(allProfile);
  } catch (err) {
    next(err);
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

router.patch("/create", isAuthenticated, async (req, res, next) => {
  // const { remote, salary, contract, position, experience } = req.body;
  console.log(req.user);
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
});

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

module.exports = router;
