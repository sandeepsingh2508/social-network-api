const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      validate: [validator.isEmail, "please enter valid email"],
    },
    password: {
      type: String,
      required: [true, "please enter your password"],
      minLength: [6, "password should be greater than 6 charecter"],
    },
  },
  { timestamps: true }
);
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
