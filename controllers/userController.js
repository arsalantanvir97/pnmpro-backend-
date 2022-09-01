import asyncHandler from "express-async-handler";

import User from "../models/UserModel";
import Reset from "../models/ResetModel.js";

import generateToken from "../utills/generateJWTtoken.js";
import generateEmail from "../services/generate_email.js";
import generateCode from "../services/generate_code.js";
import {
  createResetToken,
  verifyPassword,
  comparePassword,
  generateHash
} from "../queries";
import Session from "../models/SessionModel";
import Notification from "../models/NotificationModel";

import CreateNotification from "../utills/notification.js";

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, confirmpassword } =
    req.body;
  if (!comparePassword(password, confirmpassword))
    return res.status(400).json({ message: "Password Not Equal" });

  const UserExists = await User.findOne({ email });

  if (UserExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const login = asyncHandler(async (req, res) => {
  console.log("authAdmin");
  const { email, password, deviceId, device_type } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && (await user.matchPassword(password))) {
    const createdataofusers = await Session.findOneAndUpdate(
      { user: user._id },
      { deviceId: deviceId, deviceType: device_type },
      { new: true, upsert: true, returnNewDocument: true }
    );
    console.log("createdataofusers", createdataofusers);
    const abc = await createdataofusers.save();
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      userImage: user.userImage,
      token: generateToken(user._id)
    });
  } else {
    console.log("error");
    return res.status(201).json({
      message: "Invalid Email or Password"
    });
  }
});

const recoverPassword = asyncHandler(async (req, res) => {
  console.log("recoverPassword");
  const { email } = req.body;
  console.log("req.body", req.body);
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.log("!user");
    return res.status(401).json({
      message: "Invalid Email or Password"
    });
  } else {
    const status = generateCode();
    await createResetToken(email, status);

    const html = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
        \n\n Your verification status is ${status}:\n\n
        \n\n If you did not request this, please ignore this email and your password will remain unchanged.           
        </p>`;
    await generateEmail(email, "PNMPRO - Password Reset", html);
    return res.status(201).json({
      message:
        "Recovery status Has Been Emailed To Your Registered Email Address"
    });
  }
});

const verifyRecoverCode = async (req, res) => {
  const { code, email } = req.body;
  console.log("req.body", req.body);
  const reset = await Reset.findOne({ email: email.toLowerCase() ,code});

  if (reset)
    return res.status(200).json({ message: "Recovery status Accepted" });
  else {
    return res.status(400).json({ message: "Invalid Code" });
  }
  // console.log("reset", reset);
};

const userlogs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            {
              firstName: { $regex: `${req.query.searchString}`, $options: "i" }
            },
            {
              lastName: { $regex: `${req.query.searchString}`, $options: "i" }
            },
            { email: { $regex: `${req.query.searchString}`, $options: "i" } }
          ]
        }
      : {};
    const status_filter = req.query.status ? { status: req.query.status } : {};
    const from = req.query.from;
    const to = req.query.to;
    let dateFilter = {};
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment.utc(new Date(from)).startOf("day"),
          $lte: moment.utc(new Date(to)).endOf("day")
        }
      };

    const user = await User.paginate(
      {
        ...searchParam,
        ...status_filter,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "_id",
        select: "-password"
      }
    );
    await res.status(200).json({
      user
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const toggleActiveStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log("user", user);
    user.status = user.status == true ? false : true;
    await user.save();
    await res.status(201).json({
      message: user.status ? "User Activated" : "User Inactivated"
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean().select("-password");
    await res.status(201).json({
      user
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    console.log("reset");

    const { password, confirm_password, code, email } = req.body;
    console.log("req.body", req.body);
    if (!comparePassword(password, confirm_password))
      return res.status(400).json({ message: "Password does not match" });
    const reset = await Reset.findOne({ email: email.toLowerCase() ,code});
    console.log("reset", reset);
    if (!reset)
      return res.status(400).json({ message: "Invalid Recovery status" });
    else {
      console.log("resetexist");
      const updateduser = await User.findOne({ email });
      updateduser.password = password;
      await updateduser.save();
      console.log("updatedadmin", updateduser);
      res.status(201).json({
        _id: updateduser._id,
        firstName: updateduser.firstName,
        lastName: updateduser.lastName,
        email: updateduser.email,
        userImage: updateduser.userImage,

        phone: updateduser.phone,
        token: generateToken(updateduser._id)
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error.toString() });
  }
};

const changepassword = async (req, res) => {
  try {
    console.log("reset");

    const { existingpassword, newpassword, confirm_password } = req.body;

    console.log("req.body", req.body);
    const user = await User.findOne({ _id: req.id });

    if (user && (await user.matchPassword(existingpassword))) {
      console.log("block1");
      if (!comparePassword(newpassword, confirm_password)) {
        console.log("block2");
        return res.status(400).json({ message: "Password does not match" });
      } else {
        console.log("block3");
        user.password = newpassword;
        await user.save();
        console.log("user", user);
        res.status(201).json({
          _id: user._id,
          firstName: user.firstName,
          userImage: user.userImage,

          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          token: generateToken(user._id)
        });
      }
    } else {
      console.log("block4");

      return res.status(401).json({ message: "Wrong Password" });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error.toString() });
  }

  // return updatedadmin
  // await res.status(201).json({
  //   message: "Password Updated",
  // });
};

const editProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;

  const user = await User.findOne({ _id:req.id });
  user.firstName = firstName ? firstName :user.firstName;
  user.lastName = lastName ? lastName :user.lastName;
  user.phone = phone ? phone :user.phone;

  user.userImage = user_image ? user_image : user.userImage;
  await user.save();
  // await res.status(201).json({
  //   message: "Admin Update",
  //   admin,
  // });
  await res.status(201).json({
    user
  });
});

const UserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.id).lean().select("-password");
    await res.status(201).json({
      user
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const userNotifications = async (req, res) => {
  try {
    const notification = await Notification.find({'payload.id':req.id});
    await res.status(201).json({
      notification
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  registerUser,
  changepassword,
  editProfile,
  userNotifications,
  userlogs,
  toggleActiveStatus,
  getUserDetails,
  login,
  recoverPassword,
  verifyRecoverCode,
  resetPassword,
  UserDetails,
};
