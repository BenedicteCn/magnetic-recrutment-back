require("dotenv/config");

const { getGithubInfoForUsername } = require("./github");

if (process.env.GITHUB_ACCESS_TOKEN) {
  getGithubInfoForUsername("tzuyuchiu").then((result) => console.log(result));
} else {
  console.error(
    "Please provide a GITHUB_ACCESS_TOKEN in environment variables."
  );
}
