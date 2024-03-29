import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import mongoosePaginate from 'mongoose-paginate-v2'

const DriverSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    flag: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    drivervehicletype: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DriverVehicleType',
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number] },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userImage: { type: String },
    license: { type: String },
    rejectreason: { type: String },
    adminApproval: { type: String, default: 'Pending' },
    status: { type: Boolean },
    soa_id: { type: String },
    soa_token: { type: String },
  },
  {
    timestamps: true,
  }
)

DriverSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

DriverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
})

DriverSchema.plugin(mongoosePaginate)
DriverSchema.index({ '$**': 'text' })

DriverSchema.index({ location: '2dsphere' })

const Driver = mongoose.model('Driver', DriverSchema)

export default Driver
