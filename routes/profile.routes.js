const router = require('express').Router();
const isHr = require('../middleware/isHr');
const isAuthenticated = require('../middleware/isAuthenticated');

//Get all candidate profile
router.get('/', isHr, isAuthenticated, async (req, res, next) => {
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

module.exports = router;
