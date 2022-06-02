import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const AdminSchema = mongoose.Schema(
    {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
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
      userImage:{type:String} 

    },
    {
      timestamps: true,
    }
  )

  AdminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
  }
  
  AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next()
    }
  
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
  })

  const Admin = mongoose.model('Admin', AdminSchema)

  export default Admin