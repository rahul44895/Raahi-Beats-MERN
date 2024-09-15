const express = require("express");
const router = express.Router();
const UserSchema = require("../models/UserSchema");
const UserFileUpload = require("../middlewares/UserFileUpload");
const bcrpyt = require("bcryptjs");
const fs = require("fs");
const JWT = require("jsonwebtoken");
const decodeToken = require("../middlewares/decodeToken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const deleteFiles = (file) => {
  try {
    if (file && fs.existsSync(file.path)) {
      fs.rmSync(file.path, { recursive: true, force: true });
      console.log(`${file.filename} is deleted successfully`);
    }
  } catch (error) {
    console.log(`Error deleting file ${file.filename}:`, error);
  }
};

const cookieOptions = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Cookie expires in 24 hours
  httpOnly: false,
  secure:
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging", // Set secure based on the environment
  sameSite:
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging"
      ? "none"
      : "lax", // Set SameSite based on the environment
};

// POST /signup - Handles user registration by validating input
router.post(
  "/signup",
  UserFileUpload.single("userAvatar"),
  async (req, res) => {
    try {
      const { username, email, password, confirmPassword } = req.body;

      if (username.length > 200) {
        deleteFiles(req.file);
        return res.status(400).json({
          success: false,
          error:
            "We appreciate your name, but it should be less than 200 characters for our system.",
        });
      }

      if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        deleteFiles(req.file);
        return res.status(400).json({ success: false, error: "Invalid Email" });
      }

      if (
        !password.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/~\\|-]).{8,}$/
        )
      ) {
        deleteFiles(req.file);
        return res.status(400).json({
          success: false,
          error:
            "Password must be atleast 8 characters long and should contain atleast a small letter, capital letter, digits between 0-9 and atleast one special character like !@#$%^&*()_+={}[]:;\"'<>,.?/~\\|-.",
        });
      }
      if (password !== confirmPassword) {
        deleteFiles(req.file);
        return res.status(400).json({
          success: false,
          error: "Password and confirm password do not match.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error:
            "Please, give us a chance by uploading your profile picture to showcase your amazing face on our website.",
        });
      }
      const hashedPassword = bcrpyt.hashSync(password, bcrpyt.genSaltSync(10));

      let user = await UserSchema.findOne({ email: email });
      if (user) {
        deleteFiles(req.file);
        return res.status(409).json({
          success: false,
          error: "Email is already registered",
        });
      }
      user = new UserSchema({
        username,
        email,
        password: hashedPassword,
        avatar: req.file.path,
      });

      let savedUser = await user.save();
      if (!savedUser) {
        deleteFiles(req.file);
        return res.status(500).json({
          success: false,
          error: "Some error occured while registration. Please, retry.",
        });
      }

      const token = JWT.sign({ userID: user._id }, JWT_SECRET_KEY);

      res.cookie("token", token, cookieOptions);
      res.cookie(
        "user",
        JSON.stringify({ username: user.username, avatar: user.avatar }),
        cookieOptions
      );
      res.status(200).json({
        success: true,
        message: `Welcome! We are excited to welcome you, ${user.username}`,
      });
    } catch (error) {
      console.log(error);
      deleteFiles(req.file);
      res.status(500).json({
        success: false,
        error: "Some error occured while registration. Please, retry.",
      });
    }
  }
);

// POST /login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    const isPassword = bcrpyt.compareSync(password, user.password);
    if (!isPassword) {
      return res
        .status(400)
        .json({ success: false, error: "Password is incorrect." });
    }
    const token = JWT.sign({ userID: user._id }, JWT_SECRET_KEY);
    res
      .cookie("token", token, cookieOptions)
      .cookie(
        "user",
        JSON.stringify({ username: user.username, avatar: user.avatar }),
        cookieOptions
      )
      .status(200)
      .json({
        success: true,
        message: `Welcome! We are excited to welcome you, ${user.username}`,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /logout
router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("user");
  res.status(200).json({ success: true, message: "Logged out successfully." });
});

// Used to handle errors
router.use((err, req, res, next) => {
  if (err) {
    deleteFiles(req.file);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
  next();
});

module.exports = router;
