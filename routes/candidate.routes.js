const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const saltRounds = 10;
const jsonwebtoken = require('jsonwebtoken');
const nodemailer = require('nodemailer');

router.post('/candidate/signup', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const foundUser = await Candidate.findOne({ username });
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (foundUser) {
      res.status(401).json({
        message: 'Username already exists 😬. Try logging in instead.',
      });
      return;
    }
    if (!email.match(regex)) {
      res.status(500).json({
        message: 'Must be an email adress 🚫 (example : anna@gmail.com)',
      });
      return;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log({ hashedPassword });

    const createdUser = await Candidate.create({
      username,
      email,
      password: hashedPassword,
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailMessage = await transporter.sendMail({
      from: `<noreply@gmail.com>`,
      to: email,
      subject: 'Welcome!',
      text: 'Welcome to Maganetic',
    });

    console.log(emailMessage);

    res.status(201).json({
      message: 'Welcome to Maganetic ! ',
      createdUser,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post('/candidate/login', async (req, res, next) => {
  const { username, password } = req.body;
  const foundUser = await Candidate.findOne({ username });

  if (!foundUser) {
    res.status(404).json({ message: 'username does not exist 🤥' });
    return;
  }

  const isPasswordMatched = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordMatched) {
    res.status(401).json({ message: 'password does not match 😩' });
    return;
  }

  const payload = { username, _id: foundUser._id };

  const authToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
    algorithm: 'HS256',
    expiresIn: '800s',
  });

  res.status(200).json({ isLoggedIn: true, authToken });
});

router.get('/verify', async (req, res, next) => {
  // Verify the bearer token is still valid
  // get the bearer token from the header
  const { authorization } = req.headers;

  // isolate the jwt
  const token = authorization.replace('Bearer ', '');
  console.log({ token });

  try {
    // verify the jwt with the jsonwebtoken package
    const payload = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    console.log({ payload });

    // send the user the payload
    res.json({ token, payload });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid token' });
  }
});

// user update password:
router.patch('/updatepassword/', isAuthenticated, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      req.user.password
    );

    if (isPasswordMatched) {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const updatedUser = await Candidate.findByIdAndUpdate(req.user._id, {
        password: hashedPassword,
      });
      res.status(200).json({ updatedUser, message: 'Nice password mate' });
    } else {
      res.status(401).json({ message: 'password does not match' });
      return;
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
