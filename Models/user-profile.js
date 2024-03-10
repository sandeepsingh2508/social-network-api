const mongoose = require("mongoose");
let validator = require("validator");

const usernameValidator = [
  {
    validator: function (value) {
      // Regular expression to check if the value contains at least one letter and one digit
      return /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(value);
    },
    message: "Username must contain at least one letter and one number",
  },
  {
    validator: function (value) {
      return value.length >= 2 && value.length <= 30;
    },
    message: "Username should have between 2 and 30 characters",
  },
];
const schema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    validate: usernameValidator,
  },

  bio: {
    type: String,
    maxLength: [30, "Name cannot exceed 30 charecter"],
    minLength: [2, "Name should have more than 2 charecter"],
  },
  profileImage: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  followers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user-profile",
      },
      followStatus: {
        type: String,
        default: "follow",
      },
    },
  ],
  following: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user-profile",
      },
      followStatus: {
        type: String,
        default: "following",
      },
    },
  ],
});
const profileModel = mongoose.model("user-profile", schema);
module.exports = profileModel;
