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

const resetPassword = async (req, res) => {
  try {
    console.log("reset");

    const { password, confirm_password, code, email } = req.body;
    console.log("req.body", req.body);
    if (!comparePassword(password, confirm_password))
      return res.status(400).json({ message: "Password does not match" });
    const reset = await Reset.findOne({ email, code });
    console.log("reset", reset);
    if (!reset)
      return res.status(400).json({ message: "Invalid Recovery status" });
    else {
      console.log("resetexist");
      const updateddriver = await Driver.findOne({ email });
      updateddriver.password = password;
      await updateddriver.save();
      console.log("updateddriver", updateddriver);
      res.status(201).json({
       message:'Password Reset Successfully'
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
    const driver = await Driver.findOne({ _id: req.id });

    if (driver && (await driver.matchPassword(existingpassword))) {
      console.log("block1");
      if (!comparePassword(newpassword, confirm_password)) {
        console.log("block2");
        return res.status(400).json({ message: "Password does not match" });
      } else {
        console.log("block3");
        driver.password = newpassword;
        await driver.save();
        console.log("driver", driver);
        res.status(201).json({
        message:'Password Updated Successfully'
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

const recoverPassword = asyncHandler(async (req, res) => {
  console.log("recoverPassword");
  const { email } = req.body;
  console.log("req.body", req.body);
  const driver = await Driver.findOne({ email });
  if (!driver) {
    console.log("!driver");
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
  const reset = await Reset.findOne({ email, code });

  if (reset)
    return res.status(200).json({ message: "Recovery status Accepted" });
  else {
    return res.status(400).json({ message: "Invalid Code" });
  }
  // console.log("reset", reset);
};

const editProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;

  const driver = await Driver.findOne({ _id: req.id });
  driver.firstName = firstName ? firstName : driver.firstName;
  driver.lastName = lastName ? lastName : driver.lastName;
  driver.phone = phone ? phone : driver.phone;

  driver.userImage = user_image ? user_image : driver.userImage;
  await driver.save();
  // await res.status(201).json({
  //   message: "Admin Update",
  //   admin,
  // });
  await res.status(201).json({
    driver
  });
});

export {
  registerDriver,
  driverlogs,
  toggleActiveStatus,
  getDriverDetails,
  updateStatus,
  login,
  resetPassword,
  changepassword,
  recoverPassword,
  verifyRecoverCode,
  editProfile
};
