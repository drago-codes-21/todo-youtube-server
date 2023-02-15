// create, update, delete access
const express = require("express");
const router = express.Router();
const User = require("../model/user.model");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

// register route
router.post(
  "/register",
  [
    check("name", "Name is required, it should not be empty").not().isEmpty(),
    check("username", "Username is required, it should not be empty")
      .not()
      .isEmpty(),
    check("email", "Provide Valid Email Address").isEmail(),
    check(
      "password",
      "Password should contain at least 5 and at most 30 Characters"
    ).isLength({ min: 5, max: 30 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = User.findOne({ email });
      user && res.status(404).json("User already exists");

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const { username, name, email } = req.body;

      user = new User({
        username,
        name,
        email,
        password: hashedPassword,
      });

      user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// login user
router.post(
  "/login",
  [
    check("email", "Provide Valid Email Address").isEmail(),
    check(
      "password",
      "Password should contain at least 5 and at most 30 Characters"
    ).isLength({ min: 5, max: 30 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }
    try {
      const user = await User.findOne({ email: req.body });
      !user && res.status(404).json("User not found");

      const checkPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      !checkPassword && res.status(400).json("Wrond password entered");

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne(req.params.id);
    const { password, ...others } = user;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update user

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashed;
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      await User.findOneAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Information successfully updated");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can update only your information");
  }
});

// delete a user

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account Successfully Deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(404).json("You can only delete your account");
  }
});
