const postDB = require("../Models/user-post");
const profileDB = require("../Models/user-profile");
const response = require("../Middlewares/response");

//create new post
const create = async (req, res) => {
  const { textContent, userId } = req.body;
  try {
    if (!textContent || !userId) {
      return response.validationError(
        res,
        "Cannot create a post without proper parameters"
      );
    }
    const findUser = await profileDB.findById({ _id: userId });
    if (!findUser) {
      return response.notFoundError(res, "Cannot find user");
    }

    const postData = await new postDB({
      userId: userId,
      textContent: textContent,
    }).save();
    if (!postData) {
      return response.internalServerError(res, "Error creating the post");
    }
    response.successResponse(res, postData, "Successfully created user post");
  } catch (error) {
    console.log(error);
    return response.internalServerError(
      res,
      error.message || "Internal Server Error"
    );
  }
};

//update post
const updatePost = async (req, res) => {
  const { textContent } = req.body;
  const { postId } = req.params;
  const { userId } = req.query;
  try {
    if (!textContent || !userId || !postId) {
      return response.validationError(
        res,
        "Cannot update a post details without proper parameters"
      );
    }
    const findPost = await postDB.findOne({ _id: postId, userId: userId });
    if (!findPost) {
      return response.notFoundError(res, "Cannot find the specific post");
    }

    const updatedData = {
      ...(textContent && { textContent: textContent }),
    };
    const updatedPost = await postDB.findByIdAndUpdate(
      { _id: findPost._id },
      updatedData,
      { new: true }
    );
    if (!updatedPost) {
      return response.internalServerError(res, "Error updating the post");
    }
    response.successResponse(res, updatedPost, "Successfully update user post");
  } catch (error) {
    console.log(error);
    return response.internalServerError(
      res,
      error.message || "Internal Server Error"
    );
  }
};

//update post
const viewPost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.query;
  try {
    if (!userId || !postId) {
      return response.validationError(
        res,
        "Cannot get a post without proper parameters"
      );
    }
    const findPost = await postDB
      .findOne({ _id: postId, userId: userId })
      .populate("userId");
    if (!findPost) {
      return response.notFoundError(res, "Cannot find the specific post");
    }
    response.successResponse(res, findPost, "Successfully find user post");
  } catch (error) {
    console.log(error);
    return response.internalServerError(
      res,
      error.message || "Internal Server Error"
    );
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.query;
  try {
    if (!userId || !postId) {
      return response.validationError(
        res,
        "Cannot delete a post details without proper parameters"
      );
    }
    const findPost = await postDB.findOne({ _id: postId, userId: userId });
    if (!findPost) {
      return response.notFoundError(res, "Cannot find the specific post");
    }
    const deletedPost = await postDB.findByIdAndDelete({ _id: findPost._id });
    if (!deletedPost) {
      return response.internalServerError(
        res,
        "Error occurred while deleting the post"
      );
    }
    response.successResponse(
      res,
      deletedPost,
      "Successfully deleted the user post"
    );
  } catch (error) {
    console.log(error);
    return response.internalServerError(
      res,
      error.message || "Internal Server Error"
    );
  }
};

//get all posts by userId
const getPostByUserId = async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) {
      return response.validationError(
        res,
        "Cannot get all post without userId"
      );
    }
    const findAllPost = await postDB
      .find({ userId: userId })
      .populate("userId");
    if (!findAllPost) {
      return response.notFoundError(res, "Cannot find the all post");
    }
    response.successResponse(
      res,
      findAllPost,
      "Successfully find the all post"
    );
  } catch (error) {
    console.log(error);
    return response.internalServerError(
      res,
      error.message || "Internal Server Error"
    );
  }
};

module.exports = {
  viewPost,
  updatePost,
  create,
  deletePost,
  getPostByUserId,
};
