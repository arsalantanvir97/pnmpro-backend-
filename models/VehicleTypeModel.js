import mongoose from 'mongoose'

const VehicleTypeSchema = mongoose.Schema(
    {
      
      name: {
        type: String,
        required: true,
      },
      facilities: {
        type: Array,
        required: true,
      },
      rate: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
  const VehicleType = mongoose.model('VehicleType', VehicleTypeSchema)

  export default VehicleType