const userAuthDB = require("../Models/user-auth");
const bcrypt = require("bcryptjs");
const response = require("../Middlewares/response");
const jwt = require("../Utils/jwt");

const signUp = async (req, res) => {
  const {email, password } = req.body;
  try {
    if (!email || !password) {
      return response.validationError(
        res,
        "Cannot create an account without proper information"
      );
    }
    const findUser = await userAuthDB.findOne({ email: email.toLowerCase() });

    if (findUser) {
      return response.errorResponse(
        res,
        "User Already exists.please login",
        400
      );
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await new userAuthDB({
      password: hashPassword,
      email: email.toLowerCase(),
    }).save();
    response.successResponse(res, newUser, "Successfully saved the user");
  } catch (error) {
    console.error(error);
    response.internalServerError(res, error.message || "Internal server error");
  }
};

const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return response.validationError(
        res,
        "Cannot login without proper information"
      );
    }
    const findUser = await userAuthDB.findOne({ email: email.toLowerCase() });
    if (!findUser) {
      response.notFoundError(res, "Cannot find the user");
    }
    const comparePassword = await bcrypt.compare(password, findUser.password);
    if (comparePassword) {
      const token = jwt(findUser._id);
      const result = {
        user: findUser,
        token: token,
      };
      response.successResponse(res, result, "Login successful");
    } else {
      response.errorResponse(res, "Password incorrect", 400);
    }
  } catch (error) {
    console.log(error);
    response.internalServerError(res, error.message || "Internal server error");
  }
};

module.exports = { signUp, logIn };
