const { Octokit } = require("@octokit/core");

const getGithubInfoForUsername = async (username) => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
  });
  //Get user info
  // const gitHubUser = await octokit.request(`GET /users/${username}`);
  //Get all repos from a user
  const gitHubRepos = await octokit.request(`GET /users/${username}/repos`);

  const repoLanguagePromise = gitHubRepos.data.map((repo) => {
    return octokit.request(`${repo.languages_url}`);
  });

  //Get all languages used from each repos
  const repoAllLanguage = await Promise.all(repoLanguagePromise);

  const result = repoAllLanguage.reduce((previousValue, repo) => {
    for (let key in repo.data) {
      previousValue[key] ||= 0;
      previousValue[key] += repo.data[key];
    }
    return previousValue;
  }, {});
  const kvp = Object.entries(result);
  kvp.sort((a, b) => b[1] - a[1]);

  return {
    languages: kvp,
    repos: gitHubRepos.data.map(({ full_name: name }) => ({ name })),
  };
};

module.exports = { getGithubInfoForUsername };
