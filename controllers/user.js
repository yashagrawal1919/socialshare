const mongoose = require("mongoose");
const { updateOne } = require("../models/post");
const post = require("../models/post");
const user = require("../models/user");

// api to get user data and posts
exports.getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const foundUser = await user.findOne({ _id: userId }, { password: 0 });
    post
      .find({ postedBy: userId })
      .sort({ $natural: -1 })
      .populate("postedBy")
      .exec((err, posts) => {
        if (err) {
          throw err;
        }
        return res.json({
          user: foundUser,
          posts,
        });
      });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// api to follow a user
exports.follow = async (req, res, next) => {
  try {
    const { followId } = req.body;
    // push to follow array;
    await user.updateOne(
      { _id: followId },
      {
        $addToSet: { followers: req.user._id },
      }
    );
    await user.updateOne(
      { _id: req.user._id },
      {
        $addToSet: { following: followId },
      }
    );
    const foundUser = await user.findOne({ _id: req.user._id });
    return res.json({ user: foundUser });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// APi to unfollow a user
exports.unfollow = async (req, res, next) => {
  try {
    const { unfollowId } = req.body;
    await user.updateOne(
      { _id: unfollowId },
      {
        $pull: { followers: req.user._id },
      }
    );
    await user.updateOne(
      { _id: req.user._id },
      {
        $pull: { following: unfollowId },
      }
    );
    const foundUser = await user.findOne({ _id: req.user._id });
    return res.json({ user: foundUser });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// API to update profile pic of a user
exports.updateProfilePic = async (req, res, next) => {
  try {
    const image = req.body.image;
    if (!image) {
      return res.status(422).json({ error: "Please add a image" });
    }
    await user.updateOne(
      { _id: req.user._id },
      { $set: { profilePic: image } }
    );
    const foundUser = await user.findOne({ _id: req.user._id });
    return res.json(foundUser);
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// API to search users
exports.searchUsers = async (req, res, next) => {
  try {
    let userPattern = new RegExp("^" + req.body.query);
    const foundUser = await user.find(
      { email: { $regex: userPattern } },
      { _id: 1, email: 1 }
    );
    return res.json({ user: foundUser });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
