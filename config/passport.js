const GitHubStrategy = require("passport-github2").Strategy;
const { Candidate } = require("../models/User.model");
const passport = require("passport");
const { getGithubEmails, getGithubProfileInfo } = require("../helpers/github");
const GithubProfile = require("../models/GithubProfile.model.js");

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

const findCandidateByGithubProfileId = async (id) => {
  const candidate = await Candidate.findOne({ githubId: id });
  return candidate;
};

const createGithubProfile = async (candidate, accessToken, username) => {
  // Get user repo information
  const info = await getGithubProfileInfo(accessToken);
  console.log({ info });

  // Store github info for this new user
  await GithubProfile.create({ ...info, username, candidate });
};

const createCandidateFromGithub = async (accessToken, { id, username }) => {
  const emails = await getGithubEmails(accessToken);
  const candidate = await Candidate.create({
    email: emails[0].email,
    githubId: id,
  });

  // We don't await this because we don't need this info to continue,
  // we just store it for later.
  createGithubProfile(candidate, accessToken, username);

  return candidate;
};

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/candidate/auth/github/callback",
      scope: "user:email",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("LOGIN PROFILE", profile);
        let candidate = await findCandidateByGithubProfileId(profile.id);

        if (!candidate) {
          candidate = await createCandidateFromGithub(accessToken, profile);
        }

        done(null, candidate);
      } catch (error) {
        console.log(error);
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
