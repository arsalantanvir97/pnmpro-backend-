import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const SoundTrackSchema = mongoose.Schema(
  {
    image: { type: String,  },
    songname: { type: String, required: true },
    artistname: { type: String, required: true },
    duration: { type: String, required: true },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
      },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Ride"
    }
  },
  {
    timestamps: true
  }
);
SoundTrackSchema.plugin(mongoosePaginate);
SoundTrackSchema.index({ "$**": "text" });

const SoundTrack = mongoose.model("SoundTrack", SoundTrackSchema);

export default SoundTrack;
