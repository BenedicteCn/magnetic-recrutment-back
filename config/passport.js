const GitHubStrategy = require("passport-github2").Strategy;
const { Candidate } = require("../models/User.model");
const passport = require("passport");
const { getGithubEmails } = require("../helpers/github");

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/candidate/auth/github/callback",
      scope: "user:email",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(accessToken, refreshToken);
      try {
        const user = await Candidate.findOne({ githubId: profile.id });
        console.log("LOGIN PROFILE", profile);
        console.log(user);

        if (user) {
          done(null, user);
          return;
        }

        const emails = await getGithubEmails(accessToken);
        console.log(emails);

        await Candidate.create({
          email: emails[0].email,
          githubId: profile.id,
        });

        // TODO: Get user repo information

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
