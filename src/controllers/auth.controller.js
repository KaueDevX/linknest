const User = require("../models/User");
const { hashPassword, comparePassword } = require("../services/bcrypt");
const jwt = require("jsonwebtoken");
class authController {
  async register(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(422).json({
        success: false,
        message: "Params empty or invalid",
      });
    }
    const result = await User.findOne({ username, password });
    if (result) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }
    try {
      const newPassword = await hashPassword(password);
      const user = new User({
        username,
        password: newPassword,
        creatorId: username,
      });
      await user.save();
      return res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    } catch (error) {
      console.log("Error creating user", error.name);
      return res.status(500).json({
        success: false,
        message: "Error creating user",
      });
    }
  }
  async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(422).json({
        success: false,
        message: "Params empty or invalid",
      });
    }
    const result = await User.findOne({ username });
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credential" });
    }
    const isValid = await comparePassword(password, result.password);
    if (isValid) {
      const token = jwt.sign(
        {
          id: result._id,
          username: result.username,
          creatorId: result.creatorId,
          createdAt: result.created_at,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      return res.status(200).json({
        success: true,
        message: "Login successfully",
        data: {
          username: result.username,
          creatorId: result.creatorId,
          createdAt: result.created_at,
          token,
        },
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid credential",
    });
  }
}

module.exports = authController;
