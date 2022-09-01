import mongoose from "mongoose";

const RideSchema = mongoose.Schema(
  {
    paymentMethod: {
      type: String
    },
    totalbill: {
      type: Number
    },
    topupAmount: {
      type: Number,
      default:0
    },
    rideStatus: {
      type: String,default:'Pending'
    },
    reportReason: {
      type: String
    },
    receipt: {
      type: String
    },
    rejectReason: {
      type: String
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
      }
    ],
    estimatedfare: {
      type: Number
    },
    discountedfare: {
      type: Number
    },
    recievedAmount: {
      type: Number
    },
    vehicletype: { type: mongoose.Schema.Types.ObjectId, ref: "VehicleType" },
    isPaid: {
      type: Boolean,
      default: false
    },
    pickuplocation: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number] }
    },
    dropofflocation: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number] }
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" }
  },
  {
    timestamps: true
  }
);
RideSchema.index({ location: "2dsphere" });

const Ride = mongoose.model("Ride", RideSchema);

export default Ride;
