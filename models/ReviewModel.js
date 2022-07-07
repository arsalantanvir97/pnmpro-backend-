import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const ReviewSchema = mongoose.Schema(
  {
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Driver"
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
ReviewSchema.plugin(mongoosePaginate);
ReviewSchema.index({ "$**": "text" });

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
