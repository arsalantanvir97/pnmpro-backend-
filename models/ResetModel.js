import mongoose from 'mongoose'

const ResetSchema = mongoose.Schema(
    {
      
      email: {
        type: String,
        required: true,
        unique: true,
      },
      code: {
        type: String,
        required: true,
      },

    },
    {
      timestamps: true,
    }
  )
  const Reset = mongoose.model('Reset', ResetSchema)

  export default Reset