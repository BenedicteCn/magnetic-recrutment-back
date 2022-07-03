const { Octokit } = require("@octokit/core");

const getGithubEmails = async (accessToken) => {
  const octokit = new Octokit({
    auth: accessToken,
  });

  const emails = await octokit.request("GET /user/emails", {});
  return emails.data;
};

const getGithubProfileInfo = async (accessToken) => {
  const octokit = new Octokit({
    auth: accessToken,
  });
  //Get all repos from a user
  const gitHubRepos = await octokit.request(`GET /user/repos`);

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
  const languages = kvp.map(([key, value]) => {
    return {
      language: key,
      byteCount: value,
    };
  });
  //   kvp.map(({ language, byteCount }) => {
  //     return { language, byteCount };
  //   });

  return {
    languages: languages,
    repos: gitHubRepos.data.map(({ full_name: name, html_url: url }) => ({
      name,
      url,
    })),
  };
};

module.exports = { getGithubProfileInfo, getGithubEmails };
