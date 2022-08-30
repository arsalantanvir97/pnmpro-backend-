import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const PaymentSchema = mongoose.Schema(
  {
    date: { type: Date,  },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
      },
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride"
    }
  },
  {
    timestamps: true
  }
);
PaymentSchema.plugin(mongoosePaginate);
PaymentSchema.index({ "$**": "text" });

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
