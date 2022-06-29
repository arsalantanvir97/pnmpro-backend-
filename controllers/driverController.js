import asyncHandler from "express-async-handler";

import Driver from "../models/DriverModel";
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
import session from "../models/SessionModel";

const registerDriver = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmpassword, phone } =
    req.body;
  let userlicense =
    req.files && req.files.doc_schedule
      ? req.files.doc_schedule[0].path
      : req.files.user_image[0].path;

  if (!comparePassword(password, confirmpassword))
    return res.status(400).json({ message: "Password Not Equal" });
  const DriverExists = await Driver.findOne({ email });

  if (DriverExists) {
    res.status(400);
    throw new Error("Driver already exists");
  }

  const driver = await Driver.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    license: userlicense
  });

  if (driver) {
    res.status(201).json({
      _id: driver._id,
      phone: driver.phone,
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      license: driver.license,
      token: generateToken(driver._id)
    });
  } else {
    res.status(400);
    throw new Error("Invalid driver data");
  }
});
const login = asyncHandler(async (req, res) => {
  console.log("authAdmin");
  const { email, password, deviceId, device_type } = req.body;

  const driver = await Driver.findOne({ email });

  if (driver && (await driver.matchPassword(password))) {
    if (
      driver.adminApproval == "Rejected" ||
      driver.adminApproval == "Pending"
    ) {
      console.log("hiii");
      res.status(201).json({
        message: "You haven't been approved by admin"
      });
    } else {
      console.log("hiii2");

      const createdataofdriver = await session.findOneAndUpdate(
        { user: driver._id },
        { deviceId: deviceId, deviceType: device_type },
        { new: true, upsert: true, returnNewDocument: true }
      );
      console.log("createdataofdriver", createdataofdriver);
      const abc = await createdataofdriver.save();
      res.json({
        _id: driver._id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        email: driver.email,
        phone: driver.phone,
        userImage: driver.userImage,
        token: generateToken(driver._id)
      });
    }
  } else {
    console.log("error");
    res.status(201).json({
      message: "Invalid Email or Password"
    });
  }
});
const driverlogs = async (req, res) => {
  try {
    console.log(
      "req.query.searchString",
      req.query.searchString,
      req.query.adminApproval
    );
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
    const adminApproval_filter = req.query.adminApproval
      ? { adminApproval: req.query.adminApproval }
      : {};

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

    const driver = await Driver.paginate(
      {
        ...adminApproval_filter,
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
      driver
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
    const driver = await Driver.findById(req.params.id);
    console.log("driver", driver);
    driver.status = driver.status == true ? false : true;
    await driver.save();
    await res.status(201).json({
      message: driver.status ? "Driver Activated" : "Driver Inactivated"
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getDriverDetails = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .lean()
      .select("-password");
    await res.status(201).json({
      driver
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const updateStatus = async (req, res) => {
  const { status, rejectreason } = req.body;
  console.log("req", req.body);
  try {
    const driver = await Driver.findById(req.params.id);
    console.log("driver", driver);
    if (status == "Rejected") {
      driver.adminApproval = status;
      driver.rejectreason = rejectreason;
    } else {
      driver.adminApproval = status;
      driver.status = true;
    }
    await driver.save();
    await res.status(201).json({
      message: "Status Updated"
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  registerDriver,
  driverlogs,
  toggleActiveStatus,
  getDriverDetails,
  updateStatus,
  login
};
