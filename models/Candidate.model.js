const User = require("./user"); // we have to make sure our Book schema is aware of the Base schema

const Candidate = User.discriminator(
  "Candidate",
  new mongoose.Schema({
    remote: {
      type: SchemaTypes.String,
      enum: ["Full", "Hybride", "On-site"],
      required: true,
    },
    salary: {
      type: SchemaTypes.String,
      enum: [
        "[<30 000]",
        "[30 000 - 40 000]",
        "[40 000 - 55 000]",
        "[55 000-70 000]",
        "[70 000 - 85 000]",
        "[>85 000[",
      ],
      required: true,
    },
    contract: {
      type: SchemaTypes.String,
      enum: ["Internship", "Freelance", "Full-time", "Part-time"],
      required: true,
    },
    position: {
      type: SchemaTypes.String,
      enum: [
        "Full-stack Developer",
        "Front-end Developer",
        "Back-end Developer",
        "Software Engineer",
      ],
      required: true,
    },
    technologies: {
      type: SchemaTypes.String,
      enum: [
        "HTML",
        "CSS",
        "Ruby",
        "Javascript",
        "React",
        "Java",
        "Python",
        "PHP",
        "Angular",
        "Swift",
        "C++, C or C#",
        "Rust",
        "Scala",
        "Swift",
        "MongoDB",
        "SQL",
        "Other",
      ],
      required: true,
    },
    experience: {
      type: SchemaTypes.String,
      enum: ["< 2 years", "2-5 years", "5-10 years", "> 10 years"],
      required: true,
    },
    extra: { type: String, required: true },
  })
);

module.exports = mongoose.model("Candidate");
