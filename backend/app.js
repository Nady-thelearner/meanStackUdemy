const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const cors = require("cors");
const postsRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");

const app = express();

// app.use(cors({ origin: "http://localhost:4200" }));
// app.use(cors());
mongoose
  .connect(
    "mongodb+srv://sknadeem419:" +
      process.env.MONGO_ATLAS_PASS +
      "@meanstack.tihqs9f.mongodb.net/meanStackDB?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Set the server selection timeout to 30 seconds
    }
  )
  .then(() => console.log("connected to Database"))
  .catch((err) => console.log("connection failed", err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,OPTIONS,DELETE"
  );
  next();
});
//wnKMEnI54uRzej2u  mogodb atlas pass
app.use("/api/posts", postsRoutes);
app.use("/api/user", authRoutes);

module.exports = app;
