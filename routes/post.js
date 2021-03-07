const express = require("express");
const postController = require("../controllers/post");
const isAuth = require("../middleware/isAuth");
const router = express.Router();

router.post("/create-post", isAuth, postController.createPost); // Route to create a new post

router.get("/posts", isAuth, postController.getPosts); // Route to get all posts created by all  users except logged in user

router.get("/myposts", isAuth, postController.getMyPosts); // Route to get all post created by logged in user

router.post("/updateLikes", isAuth, postController.updateLikes); // Route to update likes on a post

router.post("/comments", isAuth, postController.comments); // Route to add comment on a post

router.delete("/posts/:postId", isAuth, postController.deletePost); // Route to delete a post

router.get("/feed", isAuth, postController.getFeed); // Route all posts of following of logged in user

module.exports = router;
