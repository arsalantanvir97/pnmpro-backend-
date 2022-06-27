import mongoose from "mongoose";
// const user  =  require('../models/User.model')
//creates new instance of mongoose.schema
import mongoosePaginate from "mongoose-paginate-v2";

const NotificationSchema = mongoose.Schema(
  {
    notifiableId: {
      type: String
    },
    notificationType: {
      type: String
      // required:true
    },
    title: {
      type: String,
      required: [true, "Notfication Title"]
    },
    body: {
      type: String,
      required: [true, "Notification Message"]
    },

    date: {
      type: Date,
      default: Date.now
    },
    isread: {
      type: Boolean,
      default: false
      //TODO may have to require later when listener is added to pouchdb
    },
    payload: {
      type: {
        type: String
      },
      id: {
        type: String
      }
    }
  },
  {
    timestamps: true
  }
);

NotificationSchema.plugin(mongoosePaginate);
NotificationSchema.index({ "$**": "text" });

//export model to be used in routes/api.js

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
