import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PromoCodeSchema = mongoose.Schema(
  {
    status: {
      type: Boolean,
      default: true
    },
    title: {
      type: String
    },
    startingdate: {
      type: Date
    },
    endingdate: {
      type: Date
    },
    promocode: {
      type: String
    },
    discount: {
      type: Number
    },
    noofusers: {
      type: Number
    },
    admincommision: {
      type: Number,
      default: 0
    },
    usersavailed: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

PromoCodeSchema.plugin(mongoosePaginate);
PromoCodeSchema.index({ "$**": "text" });

const PromoCode = mongoose.model("PromoCode", PromoCodeSchema);

export default PromoCode;
