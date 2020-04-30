const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

//@route    GET /api/users
//@desc     Test Route
//@access   Public

router.get("/", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ errors: [{ msg: e.message }] });
  }
});

router.post(
  "/",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Please enter a password of minimum length 6").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      let { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ erros: [{ msg: "Invalid Credential" }] });
      }

      //match the credentials
      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ erros: [{ msg: "Invalid Credential" }] });
      }

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
