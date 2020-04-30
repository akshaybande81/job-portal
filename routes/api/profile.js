const express = require("express");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const router = express.Router();
const config = require("config");
const request = require("request");
const { check, validationResult } = require("express-validator");

//@route    GET /api/profile/me
//@desc     Test Route
//@access   Public

router.get("/me", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "email", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (e) {
    res.status(500).json({ errors: [{ msg: e.message }] });
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("skills", "skills are required")
        .not()
        .isEmpty(),
      check("status", "status is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }
      let profileFields = {};
      profileFields.user = req.user.id;

      const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
      } = req.body;

      if (company) profileFields.company = company;
      if (location) profileFields.location = location;
      if (website) profileFields.website = website;
      if (bio) profileFields.bio = bio;
      if (status) profileFields.status = status;
      if (githubusername) profileFields.githubusername = githubusername;
      if (skills) {
        profileFields.skills = skills.split(",").map(val => val.trim());
      }

      profileFields.social = {};

      if (youtube) profileFields.social.youtube = youtube;
      if (instagram) profileFields.social.instagram = instagram;
      if (linkedin) profileFields.social.linkedin = linkedin;
      if (facebook) profileFields.social.facebook = facebook;
      if (twitter) profileFields.social.twitter = twitter;

      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (e) {
      res.status(500).json({ errors: [{ msg: e.message }] });
    }
  }
);

/**
 * @route GET /api/profile
 * @description get all profiles
 * @access public
 */
router.get("/", async (req, res) => {
  try {
    let profiles = await Profile.find().populate("user", ["name", "avatar"]);
    return res.json(profiles);
  } catch (error) {
    return res.status(500).json([{ errors: [{ msg: error.message }] }]);
  }
});

/**
 * @route GET /api/profile/:user_id
 * @description get user profile
 * @access public
 */
router.get(
  "/user/:user_id",
  [
    check("user_id")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    try {
      let user_id = req.params.user_id;

      let profile = await Profile.findOne({ user: user_id }).populate("user", [
        "name",
        "avatar"
      ]);

      if (!profile) {
        return res.json({ msg: "Profile not found." });
      }
      return res.json(profile);
    } catch (error) {
      if (error.kind == "ObjectId") {
        return res.json({ msg: "Profile not found." });
      }
      return res.status(500).json([{ errors: [{ msg: error.message }] }]);
    }
  }
);

/**
 * @route DELETE /api/profile
 * @description delete profile
 * @access private
 */
router.delete("/", auth, async (req, res) => {
  try {
    // remove user posts
    await Post.deleteMany({ user: req.user.id });
    // remove profile
    let profile = await Profile.findOneAndRemove({ user: req.user.id });
    if (!profile) {
      return res.status(400).json({ msg: "User does not exists" });
    }
    // remove user
    let user = await User.findOneAndRemove({ _id: req.user.id });

    return res.json(profile);
  } catch (error) {
    return res.status(500).json([{ errors: [{ msg: error.message }] }]);
  }
});

/**
 * @route PUT /api/profile/experience
 * @description add profile experience
 * @access private
 */

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "title is required")
        .not()
        .isEmpty(),
      check("company", "company is required")
        .not()
        .isEmpty(),
      check("from", "from is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.status(400).json({
          msg:
            "Profile doesn not exists for the user please create one to add the experience"
        });
      }

      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;

      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      };
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      res.status(500).json([{ errors: [{ msg: error.message }] }]);
    }
  }
);
/**
 * @route DELETE /api/profile/experience/:exp_id
 * @description remove experience from profile using id
 * @access private
 */

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found for user" });
    }
    let experiences = profile.experience;
    console.log(experiences, "before");
    if (experiences.length == 0) {
      return res
        .status(400)
        .json({ msg: "Experience not found with profile", profile });
    }
    console.log(req.params.exp_id, "experience id");
    experiences = experiences.filter(
      val => val._id.toString() !== req.params.exp_id
    );
    console.log(experiences, "after");

    if (profile.experience.length == experiences.length) {
      return res.status(400).json({
        msg: `Can't find experience to delete with ${req.params.exp_id}`,
        profile
      });
    }
    profile.experience = experiences;
    await profile.save();
    res.json(profile);
  } catch (e) {
    res.status(500).json({ errors: [{ msg: e.message }] });
  }
});

/**
 * @route PUT /api/profile/education
 * @description add profile education
 * @access private
 */

router.put(
  "/education",
  [
    auth,
    [
      check("school", "school is required")
        .not()
        .isEmpty(),
      check("degree", "degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "fieldofstudy is required")
        .not()
        .isEmpty(),
      check("from", "from is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.status(400).json({
          msg:
            "Profile doesn not exists for the user please create one to add the experience"
        });
      }

      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;

      const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };
      profile.education.unshift(newEducation);
      await profile.save();
      res.json(profile);
    } catch (error) {
      res.status(500).json([{ errors: [{ msg: error.message }] }]);
    }
  }
);

/**
 * @route DELETE /api/profile/education/:edu_id
 * @description remove education from profile using id
 * @access private
 */
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found for user" });
    }
    let educations = profile.education;
    console.log(educations, "before");
    if (educations.length == 0) {
      return res
        .status(400)
        .json({ msg: "Education not found with profile", profile });
    }
    console.log(req.params.edu_id, "education id");
    educations = educations.filter(
      val => val._id.toString() !== req.params.edu_id
    );
    console.log(educations, "after");

    if (profile.education.length == educations.length) {
      return res.status(400).json({
        msg: `Can't find education to delete with ${req.params.edu_id}`,
        profile
      });
    }
    profile.education = educations;
    await profile.save();
    res.json(profile);
  } catch (e) {
    res.status(500).json({ errors: [{ msg: e.message }] });
  }
});

/**
 * @route GET /api/profile/github/:username
 * @description get github repositories
 * @access public
 */

router.get("/github/:username", async (req, res) => {
  try {
    /**call github api to get repositories */
    let api = {
      url: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secred=${config.get("githubSecret")}`,
      method: "GET",
      headers: {
        "User-Agent": "node.js"
      }
    };

    request(api, (err, resp, body) => {
      if (err) console.error(err);
      if (resp.statusCode !== 200) {
        return res.status(404).json({ msg: "Github user not found" });
      }
      return res.json(JSON.parse(body));
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
