const Post = require("../models/post");

exports.addPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  console.log("FILENAME", req.file.filename);
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });

  // return res.status(200).json({})
  post
    .save()
    .then((singlePost) => {
      console.log("ppost data", singlePost);
      res.status(201).send({
        message: "Post added sucessfully",
        post: {
          id: singlePost._id,
          title: singlePost.title,
          content: singlePost.content,
          imagePath: singlePost.imagePath,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Failed to add post!",
      });
    });
};

exports.addOnePost = (req, res, next) => {
  console.log(req.file);
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      console.log("result ", result);
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update Succcessful" });
      } else {
        res.status(401).json({ message: "Unauthorized user!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Failed to update post!",
      });
    });
};

exports.getAllPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const query = Post.find();
  let fetchedPost;
  // console.log(req.query, "Query param");
  if (pageSize && currentPage) {
    query.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  query
    .then((documents) => {
      fetchedPost = documents;
      return Post.count();
    })
    .then((count) => {
      console.log("mirchiiiiii");
      res.status(200).json({
        message: "Fetched successfully",
        posts: fetchedPost,
        postCount: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed!",
      });
    });
};

exports.getOnePost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Posts not  found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed!",
      });
    });
};

exports.deletePost = (req, res, next) => {
  console.log("mirchiitaabhiiiiii");
  console.log("id", req.params.id);
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((resultt) => {
      console.log(resultt);
      if (resultt.deletedCount > 0) {
        res.status(200).json({ message: "Post Deleted" });
      } else {
        res.status(401).json({ message: "Unauthorized user" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deleting post failed!",
      });
    });
};
