import mongoose from "mongoose";

const DriverVehicleTypeSchema = mongoose.Schema(
  {
    vehicletype: { type: mongoose.Schema.Types.ObjectId, ref: "VehicleType" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    brandname: {
      type: String,
      required: true
    },
    vehiclename: {
      type: String,
      required: true
    },
    vehiclecolor: {
      type: String,
      required: true
    },
    licenseNo: {
      type: String,
      required: true
    },
    licensePlate: {
      type: Array,
      required: true
    },
    VinNo: {
      type: Number,
      required: true
    },
    insurancedoc: {
      type: Array,
      required: true
    }
  },
  {
    timestamps: true
  }
);
const DriverVehicleType = mongoose.model(
  "DriverVehicleType",
  DriverVehicleTypeSchema
);

export default DriverVehicleType;
