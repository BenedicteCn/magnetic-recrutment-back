const { Octokit } = require("@octokit/core");

const getGithubEmails = async (accessToken) => {
  const octokit = new Octokit({
    auth: accessToken,
  });

  const emails = await octokit.request("GET /user/emails", {});
  return emails.data;
};

const getGithubInfoForUsername = async (username) => {
  const octokit = new Octokit({
    auth: accessToken,
    // auth: process.env.GITHUB_ACCESS_TOKEN,
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
  kvp.map();

  return {
    languages: kvp,
    repos: gitHubRepos.data.map(({ full_name: name }) => ({ name })),
    username,
  };
};

module.exports = { getGithubInfoForUsername, getGithubEmails };
