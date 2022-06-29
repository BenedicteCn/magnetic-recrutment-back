const router = require('express').Router();
const isHr = require('../middleware/isHr');
const isCandidate = require('../middleware/isCandidate');
const isAuthenticated = require('../middleware/isAuthenticated');
const fileUploader = require('../config/cloudinary.config');
const User = require('../models/User.model');
const Profile = require('../models/Profile.model');

//Get all candidate profile
router.get('/', isAuthenticated, isHr, async (req, res, next) => {
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
router.get('/field/:name', async (req, res, next) => {
  try {
    const profileField = req.params.name;
    const allProfile = await Recipe.find({ field: profileField });
    res.status(200).json(allProfile);
  } catch (err) {
    next(err);
  }
});

//FORM

//to edit with the form
router.get('/candidate/create', isAuthenticated, isCandidate, (req, res) =>
  res.render('movie-views/movie-create')
);

router.post('/create', isAuthenticated, isCandidate, fileUploader.single('document-cv'), (req, res) => {
  const {
    remote,
    salary,
    contract,
    position,
    technologies,
    experience,
    extra,
  } = req.body;

  Profile.create({
    remote,
    salary,
    contract,
    position,
    technologies,
    experience,
    extra,
    pdfUrl: req.file.path,
  })
    .then((newlyCreatedDocumentFromDB) => {
      console.log(newlyCreatedDocumentFromDB);
    })
    .catch((error) =>
      console.log(`Error while creating a new document: ${error}`)
    );
});

module.exports = router;
