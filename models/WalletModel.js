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
      type: String
    },
    amount: {
      type: Number,
      default:0
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"||"Driver" }
  },
  {
    timestamps: true
  }
);

const Wallet = mongoose.model("Wallet", WalletSchema);

export default Wallet;
