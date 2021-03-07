const express = require("express");
const userController = require("../controllers/user");
const isAuth = require("../middleware/isAuth");
const router = express.Router();

router.get("/user/:userId", isAuth, userController.getUserProfile); // Route to get user data and posts

router.put("/follow", isAuth, userController.follow); // Route to follow a user

router.put("/unfollow", isAuth, userController.unfollow); // Route to unfollow a user

router.put("/updateProfilePic", isAuth, userController.updateProfilePic); // Route to update profile pic of a user

router.post("/users/search", isAuth, userController.searchUsers); // Route to search users

module.exports = router;
