import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET } from "../config/index.js";

class AuthController {
  static async register(req, res) {
    try {
      const { email, password } = req.body;
      const userExist = await User.findOne({ email: email });
      if (userExist) {
        return res.status(409).json({ message: "Email is already taken" });
      }
      const user = await new User({ email: email, password: password });
      const newUser = await user.save();
      if (newUser) {
        const token = await jwt.sign(
          { id: newUser._id, email: newUser.email },
          SECRET,
          {
            expiresIn: "1d",
          }
        );

        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        return res
          .status(201)
          .json({
            newUser,
            message: "Finish setting up your profile to proceed",
          });
      }
      return res
        .status(500)
        .json({ message: "User not registered successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "No user with these credientials" });
      }
      const verified = await bcrypt.compare(password, user.password);
      if (verified) {
        const token = await jwt.sign(
          { id: user._id, email: user.email },
          SECRET, { expiresIn: "1d" }
        );
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ user, message: "You are logged in" });
      }
      return res
        .status(401)
        .json({ message: "Incorrect Password. Try Again!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong, please try again later" });
    }
  }
  static async logout(req, res) {
    res
      .cookie("token", "", {
        httpOnly: true,
        secure: true,
        maxAge: 1,
      })
      .status(200)
      .json({ message: "You're logged out successfully" });
  }
}

export default AuthController;
