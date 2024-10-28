import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Provide a unique email address"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be 6 characters or more long"],
      required: true
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    color: {
      type: Number,
      required: false,
    },
    profileSetup: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const user = model("Users", userSchema);

export default user;
