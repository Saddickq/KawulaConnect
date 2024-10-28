import { model, Schema, SchemaTypes } from "mongoose";

const messageSchema = Schema(
  {
    sender: {
      type: SchemaTypes.ObjectId,
      ref: "Users",
      required: true,
    },
    receiver: {
      type: SchemaTypes.ObjectId,
      ref: "Users",
    },
    messageType: {
      type: String,
      enum: ["text", "file"],
      required: true,
    },
    content: {
      type: String,
      required: function () {
        this.messageType === "text";
      },
    },
    fileURL: {
      type: String,
      required: function () {
        this.messageType === "file";
      },
    },
  },
  { timestamps: true }
);

const message = model("Messages", messageSchema);

export default message;
