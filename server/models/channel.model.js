import { Schema, SchemaTypes, model } from "mongoose";

const ChannelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin: {
      type: SchemaTypes.ObjectId,
      ref: "Users",
      required: true,
    },
    members: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Users",
        required: true,
      },
    ],
    messages: [{
        type: SchemaTypes.ObjectId,
        ref: "Messages",
      },]
  },
  {
    timestamps: true,
  }
);

const Channel = model("Channels", ChannelSchema);

export default Channel;
