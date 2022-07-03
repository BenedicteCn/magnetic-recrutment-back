require("dotenv/config");

const { getGithubProfileInfo } = require("./github");

if (process.env.GITHUB_ACCESS_TOKEN) {
  getGithubProfileInfo("tzuyuchiu").then((result) => console.log(result));
} else {
  console.error(
    "Please provide a GITHUB_ACCESS_TOKEN in environment variables."
  );
}
