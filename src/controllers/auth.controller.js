const User = require("../models/User");
const { hashPassword } = require("../services/bcrypt");
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
}

module.exports = authController;
