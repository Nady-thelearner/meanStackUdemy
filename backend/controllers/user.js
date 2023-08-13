const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User added sucessfully",
          result: result,
        });
      })
      .catch((err) => {
        console.log("error", err._message);
        res.status(500).json({
          message: err._message,
        });
      });
  });
};

exports.loginUser = (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(401).json({
        message: "Invalid user email!",
      });
    }

    bcrypt
      .compare(req.body.password, user.password)
      .then((result) => {
        if (!result) {
          return res.status(401).json({
            message: "Invalid user password!",
          });
        }

        const token = jwt.sign(
          { email: user.email, id: user._id },
          "Some_salting_string_which_needs_to_be_even_longer",
          { expiresIn: "1h" }
        );

        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: user._id,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          message: "Internal server error!",
        });
      });
  });
};
