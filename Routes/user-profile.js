const {
  create,
  updateProfile,
  viewProfile,
  deleteProfile,
  followUser,
  currentDeviceUserfollowers,
  currentDeviceUserfollowing,
} = require("../Controllers/user-profile");
const isAuthorized = require("../Middlewares/auth");

const { upload } = require("../Utils/multer");
const router = require("express").Router();

router.post("/create", isAuthorized, upload.array("profileImg"), create);
router.put("/update/:userId", isAuthorized, updateProfile);
router.get("/viewprofile/:userId", isAuthorized, viewProfile);
router.delete("/deleteprofile/:userId", isAuthorized, deleteProfile);
router.post("/followuser/:currentDeviceUserId", isAuthorized, followUser);
router.get("/followers", isAuthorized, currentDeviceUserfollowers);
router.get("/following", isAuthorized, currentDeviceUserfollowing);

module.exports = router;
