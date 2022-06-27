import mongoose from "mongoose";
const sessionSchema = mongoose.Schema({
  token: {
    type: String
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: Boolean,
    default: false
  },
  deviceId: {
    type: String,
    default: null
  },
  deviceType: {
    type: String,
    default: null
  }
});

const session = mongoose.model("session", sessionSchema);

export default session;
