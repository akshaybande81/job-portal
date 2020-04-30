const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");

//@route    POST /api/users
//@desc     Register User
//@access   Public

router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Please enter a password of minimum length 6").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      let { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ erros: [{ msg: "User already exists" }] });
      }

      const avatar = await gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      // create user
      user = new User({
        name,
        email,
        password,
        avatar
      });

      // encrypt password

      let salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      let payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 36000
        },
        (err, token) => {
          if (err) res.status(500).json({ errors: [{ msg: err.message }] });
          return res.status(200).json({ token });
        }
      );
    } catch (e) {
      console.log(e.message, "error");
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;

/**
 *
 * duplicate suggestions
 *
 */
