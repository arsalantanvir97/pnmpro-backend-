import mongoose from "mongoose";

const WalletSchema = mongoose.Schema(
  {
    cardholdername: {
      type: String
    },
    cardnumber: {
      type: String
    },
    cvvcode: {
      type: Number
    },
    expiryDate: {
      type: Date
    },
    amount: {
      type: Number
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
);

const Wallet = mongoose.model("Wallet", WalletSchema);

export default Wallet;
