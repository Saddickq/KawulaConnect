import { SECRET } from "../config/index.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const user = await jwt.verify(token, SECRET);
    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
