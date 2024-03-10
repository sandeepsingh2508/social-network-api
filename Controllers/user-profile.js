const profileDB = require("../Models/user-profile");
const response = require("../Middlewares/response");
const cloudinary = require("../Utils/cloudinary");
const tempDir = require("os").tmpdir();
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

//create new profile
const create = async (req, res) => {
  const { username, bio } = req.body;
  try {
    if (!username) {
      return response.validationError(
        res,
        "Cannot create a profile without username"
      );
    }
    const findUsername = await profileDB.findOne({ username: username });
    if (findUsername) {
      return response.validationError(res, "This username already exists");
    }
    //upload profile image
    const uploadedImage = await Promise.all(
      req.files.map(async (file) => {
        const changedFileName = `${uuidv4()}-${file.originalname
          .split(" ")
          .join("-")}`;
        const filePath = path.join(tempDir, changedFileName);

        await sharp(file.buffer).resize(1024, 1024).toFile(filePath);
        const cloudinaryResult = await cloudinary.uploader.upload(filePath, {
          folder: "Social",
        });

        // Delete the local image
        fs.unlinkSync(filePath);

        return {
          public_id: cloudinaryResult.public_id,
          url: cloudinaryResult.secure_url,
        };
      })
    );

    const [displayImage] = uploadedImage;
    const profileData = await new profileDB({
      userId: `user-${uuidv4()}`,
      username: username,
      bio: bio,
      profileImage: displayImage,
    }).save();
    if (!profileData) {
      return response.internalServerError(res, "Error creating user profile");
    }
    response.successResponse(
      res,
      profileData,
      "Successfully created user profile"
    );
  } catch (error) {
    console.log(error);
    return response.internalServerError(
      res,
      error.message || "Internal Server Error"
    );
  }
};

//update profile details
const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { username, bio } = req.body;
  try {
    if (!userId || userId === ":userId") {
      return response.validationError(
        res,
        "Cannot update details without user ID"
      );
    }
    const findUser = await profileDB.findOne({ userId: userId });
    if (!findUser) {
      return response.notFoundError(
        res,
        "Cannot find the specific user profile"
      );
    }
    const newData = {
      ...(username && { username: username }),
      ...(bio && { bio: bio }),
    };
    const updatedProfile = await profileDB.findByIdAndUpdate(
      { _id: findUser._id },
      newData,
      { new: true }
    );
    if (!updatedProfile) {
      return response.internalServerError(
        res,
        "Error updating profile details"
      );
    }
    response.successResponse(
      res,
      updatedProfile,
      "Successfully updated profile details"
    );
  } catch (error) {
    return response.internalServerError(
      res,
      error.message || "Internal Server Error"
    );
  }
};

const viewProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId || userId === ":userId") {
      return response.validationError(
        res,
        "Cannot find details without user ID"
      );
    }
    const findUser = await profileDB.findOne({ userId: userId });
    if (!findUser) {
      return response.notFoundError(
        res,
        "Cannot find the specific user profile"
      );
    }
    if (!findUser) {
      return response.internalServerError(
        res,
        "Error finding the profile details"
      );
    }
    response.successResponse(
      res,
      findUser,
      "Successfully find profile details"
    );
  } catch (error) {
    return response.internalServerError(
      res,
      error.message || "Internal Server Error"
    );
  }
};

//delete the user profile
const deleteProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId || userId === ":userId") {
      return response.validationError(
        res,
        "Cannot delete user profile without user ID"
      );
    }
    const findUser = await profileDB.findOne({ userId: userId });
    if (!findUser) {
      return response.notFoundError(
        res,
        "Cannot find the specific user profile"
      );
    }
    const deletedUser = await profileDB.findByIdAndDelete({
      _id: findUser._id,
    });
    if (!deletedUser) {
      return response.internalServerError(res, "Error deleteing user profile");
    }
    response.successResponse(
      res,
      deletedUser,
      "Successfully deleted the specific user profile"
    );
  } catch (error) {
    return response.internalServerError(
      res,
      error.message || "Internal Server Error"
    );
  }
};

//when one user follows another user
const followUser = async (req, res) => {
  const { followStatus } = req.body;
  const { currentDeviceUserId } = req.params;
  const { showingUserId } = req.query;
  try {
    if (!currentDeviceUserId || !showingUserId) {
      return response.validationError(
        res,
        "Cannot follow user without both users Id"
      );
    }
    const findCurrentDeviceUser = await profileDB.findById({
      _id: currentDeviceUserId,
    });
    if (!findCurrentDeviceUser) {
      return response.validationError(res, "User not found");
    }

    const findShowingUser = await profileDB.findById({ _id: showingUserId });
    if (!findShowingUser) {
      return response.validationError(res, "User not found");
    }
    if (followStatus === "following") {
      findCurrentDeviceUser.following.push({
        userId: showingUserId,
        followStatus: "following",
      });
      findShowingUser.followers.push({
        userId: currentDeviceUserId,
        followStatus: "follow",
      });
      await findCurrentDeviceUser.save();
      await findShowingUser.save();
    }
    response.successResponse(res, "", "Successfully follow user");
  } catch (error) {
    response.internalServerError(res, error.message);
  }
};

const currentDeviceUserfollowers = async (req, res) => {
  const { currentDeviceUserId } = req.query;
  try {
    if (!currentDeviceUserId) {
      return response.validationError(
        res,
        "Cannot follow user without both users Id"
      );
    }
    const findFollowers = await profileDB
      .findById({
        _id: currentDeviceUserId,
      })
      .populate("followers.userId")
      .select("followers");
    if (!findFollowers) {
      return response.validationError(res, "Cannot not found user");
    }

    response.successResponse(res, findFollowers, "Successfully find followers");
  } catch (error) {
    response.internalServerError(res, error.message);
  }
};

const currentDeviceUserfollowing = async (req, res) => {
  const { currentDeviceUserId } = req.query;
  try {
    if (!currentDeviceUserId) {
      return response.validationError(
        res,
        "Cannot follow user without both users Id"
      );
    }
    const findFollowers = await profileDB
      .findById({
        _id: currentDeviceUserId,
      })
      .populate("following.userId")
      .select("following");
    if (!findFollowers) {
      return response.validationError(res, "Cannot not found user");
    }

    response.successResponse(res, findFollowers, "Successfully find following");
  } catch (error) {
    response.internalServerError(res, error.message);
  }
};


module.exports = {
  create,
  updateProfile,
  viewProfile,
  deleteProfile,
  followUser,
  currentDeviceUserfollowers,
  currentDeviceUserfollowing
};
