const User = require("../models/User.model");

const openConnection = require("../db/index.js");

const { default: mongoose } = require("mongoose");

const bcrypt = require("bcryptjs");

const users = [
  {
    username: "benedicteCn",
    email: "benedicte.coulon@gmail.com",
    password: bcrypt.hashSync("bene123", 10),
    role: "Candidate",
  },
  {
    username: "tzuyuchiu",
    email: "tzuyu.chiu@gmail.com",
    password: bcrypt.hashSync("tzuyu123", 10),
    role: "Candidate",
  },
  {
    username: "StephaneDs",
    email: "Stephane.Deias@gmail.com",
    password: bcrypt.hashSync("stephane123", 10),
    role: "Candidate",
  },
];
