// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost/magnetic-recrutment";

//require passport
const passport = require("passport");
// const cookieSession = require("cookie-session");

//require mongo
const session = require("express-session");
const Mongostore = require("connect-mongo");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();
require("./config/passport");

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// app.use(
//   cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
// );
app.use(
  session({
    store: Mongostore.create({ mongoUrl: MONGO_URI }), // Persist session in database.
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 👇 Start handling routes here
// Contrary to the views version, all routes are controlled from the routes/index.js
const allRoutes = require("./routes/index.routes");
app.use("/", allRoutes);

const candidateRoutes = require("./routes/auth.candidates.routes");
app.use("/candidate", candidateRoutes);

const hrRoutes = require("./routes/auth.hr.routes");
app.use("/hr", hrRoutes);

const profileRoutes = require("./routes/profile.routes");
app.use("/profile", profileRoutes);

const savedRoutes = require("./routes/favourites.routes");
app.use("/favourites", savedRoutes);

// const savedRoutes = require("./routes/saved.routes");
// app.use("/saved", profileRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
