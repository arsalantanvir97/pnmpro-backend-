import asyncHandler from 'express-async-handler'

import Admin from '../models/AdminModel.js'
import Reset from '../models/ResetModel.js'

import generateToken from '../utills/generateJWTtoken.js'
import generateEmail from '../services/generate_email.js'
import generateCode from '../services/generate_code.js'
import {
  createResetToken,
  verifyPassword,
  comparePassword,
  generateHash,
} from '../queries'
import User from '../models/UserModel.js'
import Driver from '../models/DriverModel.js'
import moment from 'moment'

const registerAdmin = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  const AdminExists = await Admin.findOne({ email })

  if (AdminExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const admin = await Admin.create({
    firstName,
    lastName,
    email,
    password,
  })

  if (admin) {
    // await AddUserSOA(
    //   admin._id,
    //   admin.firstName,
    //   'https://www.w3schools.com/w3images/avatar2.png'
    // )
    res.status(201).json({
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,

      token: generateToken(admin._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

const authAdmin = asyncHandler(async (req, res) => {
  console.log('authAdmin')
  const { email, password } = req.body

  const admin = await Admin.findOne({ email })

  if (admin && (await admin.matchPassword(password))) {
    // const { token, id } = await LoginUserSOA(admin._id)
    // admin.soa_id = id
    // admin.soa_token = token
    await admin.save()

    res.json({
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      userImage: admin.userImage,

      token: generateToken(admin._id),
    })
  } else {
    console.log('error')
    return res.status(201).json({
      message: 'Invalid Email or Password',
    })
  }
})

const recoverPassword = asyncHandler(async (req, res) => {
  console.log('recoverPassword')
  const { email } = req.body

  const admin = await Admin.findOne({ email })
  if (!admin) {
    console.log('!admin')
    return res.status(401).json({
      message: 'Invalid Email or Password',
    })
  } else {
    const status = generateCode()
    await createResetToken(email, status)

    const html = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
        \n\n Your verification status is ${status}:\n\n
        \n\n If you did not request this, please ignore this email and your password will remain unchanged.           
        </p>`
    await generateEmail(email, 'Smart Off - Password Reset', html)
    return res.status(201).json({
      message:
        'Recovery status Has Been Emailed To Your Registered Email Address',
    })
  }
})
const verifyRecoverCode = asyncHandler(async (req, res) => {
  const { code, email } = req.body

  const reset = await Reset.findOne({ email, code })
  // console.log("reset", reset);

  if (reset) {
    return res.status(200).json({ message: 'Recovery status Accepted' })
  } else {
    return res.status(401).json({
      message: 'Invalid Email or Password',
    })
  }
})

const resetPassword = asyncHandler(async (req, res) => {
  console.log('reset')

  const { password, confirm_password, code, email } = req.body

  if (!comparePassword(password, confirm_password))
    return res.status(400).json({ message: 'Password Not Equal' })
  const reset = await Reset.findOne({ email, code })
  console.log('reset', reset)
  if (!reset)
    return res.status(400).json({ message: 'Invalid Recovery status' })
  else {
    console.log('resetexist')
    const updatedadmin = await Admin.findOne({ email })
    updatedadmin.password = password
    await updatedadmin.save()
    console.log('updatedadmin', updatedadmin)
    res.status(201).json({
      _id: updatedadmin._id,
      firstName: updatedadmin.firstName,
      userImage: updatedadmin.userImage,

      lastName: updatedadmin.lastName,
      email: updatedadmin.email,

      token: generateToken(updatedadmin._id),
    })
  }
  // return updatedadmin
  // await res.status(201).json({
  //   message: "Password Updated",
  // });
})

const editProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path
  console.log('req.files.user_image', req.files.user_image)

  const admin = await Admin.findOne()
  admin.firstName = firstName ? firstName : admin.firstName
  admin.lastName = lastName ? lastName : admin.lastName
  admin.userImage = user_image ? user_image : admin.userImage
  await admin.save()
  // await res.status(201).json({
  //   message: "Admin Update",
  //   admin,
  // });
  await res.status(201).json({
    _id: admin._id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    userImage: admin.userImage,
    token: generateToken(admin._id),
  })
})

const verifyAndREsetPassword = async (req, res) => {
  try {
    console.log('reset')

    const { existingpassword, newpassword, confirm_password, email } = req.body

    console.log('req.body', req.body)
    const admin = await Admin.findOne({ email })

    if (admin && (await admin.matchPassword(existingpassword))) {
      console.log('block1')
      if (!comparePassword(newpassword, confirm_password)) {
        console.log('block2')
        return res.status(400).json({ message: 'Password does not match' })
      } else {
        console.log('block3')
        admin.password = newpassword
        await admin.save()
        console.log('admin', admin)
        res.status(201).json({
          _id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          userImage: admin.userImage,
          token: generateToken(admin._id),
        })
      }
    } else {
      console.log('block4')

      return res.status(401).json({ message: 'Wrong Password' })
    }
  } catch (error) {
    console.log('error', error)
    return res.status(400).json({ message: error.toString() })
  }

  // return updatedadmin
  // await res.status(201).json({
  //   message: "Password Updated",
  // });
}
const getCountofallCollection = async (req, res) => {
  try {
    const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const arr2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    const year = req.query.year ? req.query.year : []

    const start_date = moment(year).startOf('year').toDate()
    const end_date = moment(year).endOf('year').toDate()
    const query = [
      {
        $match: {
          createdAt: {
            $gte: start_date,
            $lte: end_date,
          },
        },
      },
      {
        $addFields: {
          date: {
            $month: '$createdAt',
          },
        },
      },
      {
        $group: {
          _id: '$date',
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
          month: 1,
          count: 1,
        },
      },
    ]
    const [user, drivercount, salesCount1, salesCount2] = await Promise.all([
      User.count(),
      Driver.count(),
      User.aggregate(query),
      Driver.aggregate(query),
    ])
    console.log('salesCount1', salesCount1)
    salesCount1.forEach((data) => {
      if (data) arr[data.month - 1] = data.count
    })
    salesCount2.forEach((data) => {
      if (data) arr2[data.month - 1] = data.count
    })
    await res.status(201).json({
      user,
      drivercount,
      graph_data1: arr,
      graph_data2: arr2,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err.toString(),
    })
  }
}
export {
  registerAdmin,
  authAdmin,
  verifyAndREsetPassword,
  recoverPassword,
  verifyRecoverCode,
  resetPassword,
  editProfile,
  getCountofallCollection,
}
