const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // console.log("headers", req.headers.authorization)
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      "Some_salting_string_which_needs_to_be_even_longer"
    );
    req.userData = { email: decodedToken.email, userId: decodedToken.id };
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
