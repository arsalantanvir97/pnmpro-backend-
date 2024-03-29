import mongoose from 'mongoose'

const RideSchema = mongoose.Schema(
  {
    paymentMethod: {
      type: String,
    },
    totalbill: {
      type: Number,
    },
   
    payableamount: {
      type: Number,
    },
    topupAmount: {
      type: Number,
      default: 0,
    },
    rideStatus: {
      type: String,
      default: 'Pending',
    },
    reportReason: {
      type: String,
    },
    receipt: {
      type: String,
    },
    rejectReason: {
      type: String,
    },
    rejeciontReason: {
      type: String,
    },
    pickup_address: {
      type: String,
    },
    dropoff_address: {
      type: String,
    },
    rating: {
      type: Number,
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    estimatedfare: {
      type: Number,
    },
    drivers: [
      {
        type: String,
      },
    ],

    discountedfare: {
      type: Number,
    },
    walletpriority: { type: Boolean },
    recievedAmount: {
      type: Number,
      default:0
    },
    vehicletype: { type: mongoose.Schema.Types.ObjectId, ref: 'VehicleType' },
    isPaid: {
      type: Boolean,
      default: false,
    },
    pickuplocation: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number] },
    },
    promocode: { type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode' },
    dropofflocation: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number] },
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
  },
  {
    timestamps: true,
  }
)
RideSchema.index({ location: '2dsphere' })

const Ride = mongoose.model('Ride', RideSchema)

export default Ride
