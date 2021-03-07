const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  profilePic: {
    type: String,
    default:
      "http://res.cloudinary.com/dtqkq4oum/image/upload/v1615118316/ldvysteganxpe45kjxvl.jpg",
  },
});

module.exports = mongoose.model("User", userSchema);
