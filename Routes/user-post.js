const {
  create,
  updatePost,
  viewPost,
  deletePost,
  getPostByUserId,
} = require("../Controllers/user-post");
const isAuthorized = require("../Middlewares/auth");

const router = require("express").Router();
router.post("/create", isAuthorized, create);
router.put("/update/:postId", isAuthorized, updatePost);
router.get("/view/:postId", isAuthorized, viewPost);
router.delete("/delete/:postId", isAuthorized, deletePost);
router.get("/getall", isAuthorized, getPostByUserId);

module.exports=router
