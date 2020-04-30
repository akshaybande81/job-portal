const express = require("express");
const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const router = express.Router();

/**
 * @route POST /api/posts
 * @description create user post
 * @access private
 */

router.post(
  "/",
  [auth, [check("text", "title is required").not().isEmpty()]],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors);
      }
      let user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }
      let newPost = new Post();
      newPost.title = req.body.title;
      newPost.text = req.body.text;
      newPost.name = user.name;
      newPost.avatar = user.avatar;
      newPost.user = user.id;
      await newPost.save();
      return res.json(newPost);
    } catch (e) {
      console.error(e.message);
      res.status(500).json({ msg: e.message });
    }
  }
);

/**
 * @route GET /api/posts/
 * @description get all posts
 * @access private
 */

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find();
    if (!posts) {
      return res.status(404).json({ msg: "Posts not found" });
    }
    res.json(posts);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ msg: e.message });
  }
});

/**
 * @route GET /api/posts/:id
 * @description get post by id
 * @access private
 */

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (e) {
    console.error(e.message);
    if (e.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found" });

    res.status(500).json({ msg: e.message });
  }
});

/**
 * @route DELETE /api/posts/:id
 * @description delete post by id
 * @access private
 */

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    await post.remove();
    res.json(post);
  } catch (e) {
    console.error(e.message);
    if (e.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found" });

    res.status(500).json({ msg: e.message });
  }
});

/**
 * @route PUT /api/posts/like/:id
 * @description like post
 * @access private
 */

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "User already liked the post" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (e) {
    console.error(e.message);
    if (e.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found" });

    res.status(500).json({ msg: e.message });
  }
});

/**
 * @route PUT /api/posts/unlike/:id
 * @description like post
 * @access private
 */

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "User has not liked the post" });
    }
    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );

    await post.save();
    res.json(post.likes);
  } catch (e) {
    console.error(e.message);
    if (e.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found" });

    res.status(500).json({ msg: e.message });
  }
});

/**
 * @route PUT /api/posts/comment/:id
 * @description comment post
 * @access private
 */

router.post(
  "/comment/:id",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors);
      }
      const user = await User.findById(req.user.id);
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }
      const comment = {};
      comment.text = req.body.text;
      comment.user = req.user.id;
      comment.name = user.name;
      comment.avatar = user.avatar;
      comment.email = user.email;
      post.comments.unshift(comment);
      console.log(post);
      await post.save();
      res.json(post.comments);
    } catch (e) {
      console.error(e.message);
      if (e.kind === "ObjectId")
        return res.status(404).json({ msg: "Post not found" });

      res.status(500).json({ msg: e.message });
    }
  }
);

/**
 * @route DELETE /api/posts/comment/:id/:comment_id
 * @description delete comment by id
 * @access private
 */

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    let comment_id = req.params.comment_id;

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    /** check if comment id belongs to the post comments */
    /** alternative way is to use find and then check the user id of comment and req.user.id actually this is better 😅 */
    let comments = post.comments;

    comments = comments.filter(
      (comment) =>
        comment.id.toString() !== comment_id ||
        comment.user.toString() !== req.user.id
    );

    if (comments.length === post.comments.length) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    post.comments = comments;
    await post.save();
    res.json(post.comments);
  } catch (e) {
    console.error(e.message);
    if (e.kind === "ObjectId")
      return res.status(404).json({ msg: "Comment or Post not found" });

    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
