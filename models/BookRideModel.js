import mongoose from "mongoose";

const BookRideSchema = mongoose.Schema(
  {
    paymentMethod: {
      type: String
    },
    vehicletype: { type: mongoose.Schema.Types.ObjectId, ref: "VehicleType" },

    pickuplocation: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number] }
    },
    dropofflocation: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number] }
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
);
BookRideSchema.index({ location: "2dsphere" });

const BookRide = mongoose.model("BookRide", BookRideSchema);

export default BookRide;
