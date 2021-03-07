const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const { JWT_SECRET } = require("../config/keys");

module.exports = async (req, res, next) => {
  try {
    const Authorization = req.get("Authorization");
    if (!Authorization) {
      return res.status(401).json({ error: "you must be logged in" });
    }
    jwt.verify(Authorization, JWT_SECRET, async (err, payload) => {
      if (err) {
        return res.status(401).json({ error: "you must be logged in" });
      }
      const foundUser = await user.findOne({ _id: payload._id });
      req.user = foundUser;
      next();
    });
  } catch (e) {
    return res.status(401).json({ error: "you must be logged in" });
  }
};
