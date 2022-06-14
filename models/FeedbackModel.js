import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const FeedbackSchema = mongoose.Schema(
    {
      firstName: { type: String,},
      lastName: { type: String,},
      email: { type: String, },
   
      message: { type: String, },
      type: { type: String, },

      id: { type: String, },
    },
    {
      timestamps: true,
    }
  )
  FeedbackSchema.plugin(mongoosePaginate);
  FeedbackSchema.index({ "$**": "text" });

const Feedback = mongoose.model("Feedback", FeedbackSchema);

export default Feedback;