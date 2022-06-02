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

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

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

      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
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
        select:'-password'
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
export { registerUser,userlogs,toggleActiveStatus ,getUserDetails};
