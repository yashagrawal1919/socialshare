const mongoose = require("mongoose");
const post = require("../models/post");

const perPagePostCount = 4;
// api to add a new post
exports.createPost = async (req, res, next) => {
  const { title, description, image } = req.body;
  try {
    if (!title || !description || !image) {
      return res.status(422).json({ error: "Plase add all the fields" });
    }
    const newPost = {
      title,
      description,
      imageUrl: image,
      postedBy: req.user,
    };
    const savedPost = await post.create(newPost);
    return res.json({ post: savedPost, message: "Post added successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// api to get all posts created by all  users except logged in user
exports.getPosts = async (req, res, next) => {
  try {
    const pageNum = req.query.page;
    post
      .find({ postedBy: { $ne: req.user._id } })
      .skip((pageNum - 1) * perPagePostCount)
      .limit(perPagePostCount)
      .sort({ $natural: -1 })
      .populate("comments.commenter postedBy")
      .exec((err, posts) => {
        if (err) {
          throw err;
        }
        return res.json({ posts });
      });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// api to get all post created by logged in user
exports.getMyPosts = async (req, res, next) => {
  try {
    post
      .find({ postedBy: req.user._id })
      .sort({ $natural: -1 })
      .populate("PostedBy comments.commenter", "_id name")
      .exec((err, myPosts) => {
        if (err) {
          throw err;
        }
        return res.json({ myPosts });
      });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// api to update likes on a post
exports.updateLikes = async (req, res, next) => {
  try {
    const { postId, hasLiked, userId } = req.body;
    if (req.user._id.toString() === userId) {
      if (!hasLiked) {
        await post.updateOne({ _id: postId }, { $addToSet: { likes: userId } });
      } else {
        await post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      }
      post
        .findOne({ _id: postId })
        .populate("comments.commenter postedBy")
        .exec((err, updatedPost) => {
          if (err) {
            throw err;
          }
          return res.json({
            message: "Likes updated Successfully",
            updatedPost,
          });
        });
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// api to add comment on a post
exports.comments = async (req, res, next) => {
  try {
    const { text, postId } = req.body;
    const comment = {
      text,
      commenter: req.user._id,
    };
    await post.updateOne(
      { _id: postId },
      {
        $push: { comments: comment },
      }
    );
    post
      .findOne({ _id: postId })
      .populate("comments.commenter postedBy")
      .exec((err, updatedPost) => {
        if (err) {
          throw err;
        }
        return res.json({
          message: "Comment added successfully",
          updatedPost,
        });
      });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// api to delete a post
exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const foundPost = await post.findOne({ _id: postId }).populate("postedBy");
    if (foundPost.postedBy._id.toString() === req.user._id.toString()) {
      await post.deleteOne({ _id: postId });
      return res.json({ success: true });
    } else {
      return res.json({ error: "You are not allowed to delete this post" });
    }
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// get all posts of following of logged in user
exports.getFeed = async (req, res, next) => {
  try {
    const pageNum = req.query.page;
    const followingArr = [...req.user.following, req.user._id];
    post
      .find({ postedBy: { $in: followingArr } })
      .skip((pageNum - 1) * perPagePostCount)
      .limit(perPagePostCount)
      .sort({ $natural: -1 })
      .populate("comments.commenter postedBy")
      .exec((err, posts) => {
        if (err) {
          throw err;
        }
        return res.json({ posts });
      });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
