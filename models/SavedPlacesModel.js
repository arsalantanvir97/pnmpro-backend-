import mongoose from "mongoose";

const SavedPlacesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number] }
    },    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
);
SavedPlacesSchema.index({ location: "2dsphere" });
const SavedPlaces = mongoose.model("SavedPlaces", SavedPlacesSchema);

export default SavedPlaces;
