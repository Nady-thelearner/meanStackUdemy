const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const PostController = require("../controllers/post");
const docUpload = require("../middleware/file");

router.post("", checkAuth, docUpload, PostController.addPost);

router.put("/:id", checkAuth, docUpload, PostController.addOnePost);

router.get("", PostController.getAllPosts);

router.get("/:id", PostController.getOnePost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
