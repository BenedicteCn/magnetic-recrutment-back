const Profile = require("../models/Profile.model");

const getProfileWithGithubProfiles = async (filters) => {
  const steps = [];

  if (filters) {
    steps.push({ $match: { $and: filters } });
  }

  steps.push(
    {
      $lookup: {
        from: "githubprofiles",
        localField: "candidate",
        foreignField: "candidate",
        as: "githubProfile",
        pipeline: [
          {
            $project: {
              _id: 0,
              username: "$username",
              repos: "$repos",
              languages: "$languages",
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$githubProfile",
        preserveNullAndEmptyArrays: true,
        //if no github profile is found, can find the profile sign in without github (default = false so has to be true)
      },
    }
  );

  return await Profile.aggregate(steps);
};

module.exports = { getProfileWithGithubProfiles };
