const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user-profile",
    },
    textContent: {
      type: String,
      maxLength: [100, "Username cannot exceed 100 characters"],
      minLength: [5, "Username should have more than 5 characters"],
    },
  },
  { timestamps: true }
);
const userModel = mongoose.model("user-post", userSchema);
module.exports = userModel;
