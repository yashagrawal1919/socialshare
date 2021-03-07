const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const post = require("../models/post");
const { JWT_SECRET } = require("../config/keys");

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    if (!email || !password || !name) {
      return res.status(422).json({
        error: "please add all the fields",
      });
    }
    const foundUser = await user.findOne({ email: email });
    if (foundUser) {
      return res.status(422).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      name,
      password: hashedPassword,
    };
    const newCreatedUser = await user.create(newUser);
    return res.json({ message: "Account created successfully " });
  } catch (e) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({
        error: "Invalid email or passowrd",
      });
    }
    const foundUser = await user.findOne({ email: email });
    console.log("gshdghs", foundUser);
    if (!foundUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const token = jwt.sign({ _id: foundUser._id }, JWT_SECRET);
      console.log("TOKEN", token);
      console.log("foundUser", foundUser);
      const userObj = foundUser._doc;
      delete userObj["password"];
      return res.json({ token, user: userObj });
    } else {
      return res.status(422).json({ error: "Invalid email or password" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};
