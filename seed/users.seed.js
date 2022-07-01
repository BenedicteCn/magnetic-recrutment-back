const User = require("../models/User.model");

const openConnection = require("../db/index.js");

const { default: mongoose } = require("mongoose");

const bcrypt = require("bcryptjs");

const users = [
  {
    username: "Benedicte Coulon",
    github_name: "benedicteCn",
    email: "benedicte.coulon@gmail.com",
    password: bcrypt.hashSync("bene123", 10),
    role: "Candidate",
  },
  {
    username: "Tzu Yu Chiu",
    github_name: "tzuyuchiu",
    email: "tzuyu.chiu@gmail.com",
    password: bcrypt.hashSync("tzuyu123", 10),
    role: "Candidate",
  },
  {
    username: "Stephane Deias",
    github_name: "StephaneDs",
    email: "Stephane.Deias@gmail.com",
    password: bcrypt.hashSync("stephane123", 10),
    role: "Candidate",
  },
  {
    username: "Stephane Deias",
    github_name: "StephaneDs",
    email: "Stephane.Deias@gmail.com",
    password: bcrypt.hashSync("stephane123", 10),
    role: "Candidate",
  },
];
