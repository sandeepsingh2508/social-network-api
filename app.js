const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const userAuthRoutes = require("./Routes/userAuth");
const profileRoutes = require("./Routes/user-profile");
const postRoutes = require("./Routes/user-post");
app.use("/api/userauth", userAuthRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/post", postRoutes);

module.exports = app;
