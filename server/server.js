import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import { DB_URL, PORT } from "./config/index.js";
import AuthRoutes from "./routes/auth.route.js";
import UserRoutes from "./routes/user.route.js";
import ContactRoutes from "./routes/contact.route.js";
import MessageRoutes from "./routes/message.route.js";
import setupSocket from "./socket.js";
import { fileURLToPath } from 'url'
import { dirname } from "path";


const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

const __fileName = fileURLToPath(import.meta.url)
const __dirname = dirname(__fileName)

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"))

app.use(AuthRoutes);
app.use(UserRoutes);
app.use(ContactRoutes);
app.use(MessageRoutes);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Database connected successfully");
    const server = app.listen(PORT, () =>
      console.log(`server started on http://localhost:${PORT}`)
    );
    setupSocket(server);
  })
  .catch((error) => console.error(error));
