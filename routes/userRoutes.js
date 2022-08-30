import express from "express";
const router = express.Router();
import {
  registerUser,
  userlogs,
  toggleActiveStatus,
  getUserDetails,
  UserDetails,
  login,
  recoverPassword,
  verifyRecoverCode,
  resetPassword,
  changepassword,
  editProfile,
  userNotifications
} from "../controllers/userController";
import { protect } from "../middlewares/authMIddleware.js";

router.post("/userRegister", registerUser);
router.post("/login", login);
router.post("/userRecoverPassword", recoverPassword);
router.post("/userverifyRecoverCode", verifyRecoverCode);
router.post("/userresetPassword", resetPassword);
router.post("/changepassword", protect, changepassword);
router.post("/editProfile", protect, editProfile);
router.post("/changepassword", protect, changepassword);

router.get("/userlogs", protect, userlogs);
router.get("/toggle-active/:id", toggleActiveStatus);
router.get("/user-details/:id", protect, getUserDetails);
router.get("/userDetails", protect, UserDetails);
router.get("/userNotifications", protect, userNotifications);

export default router;
