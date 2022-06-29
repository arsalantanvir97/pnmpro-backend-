import mongoose from "mongoose";

const CardSchema = mongoose.Schema(
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
  
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
);

const Card = mongoose.model("Card", CardSchema);

export default Card;
