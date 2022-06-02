import express from "express";
const router = express.Router();
import {
  authAdmin,
  registerAdmin,
  recoverPassword,
  verifyRecoverCode,
  resetPassword,
  editProfile,
  verifyAndREsetPassword
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMIddleware.js";

router.post("/adminRegister", registerAdmin);
router.post("/adminAuth", authAdmin);
router.post("/adminRecoverPassword", recoverPassword);
router.post("/adminverifyRecoverCode", verifyRecoverCode);
router.post("/adminresetPassword", resetPassword);
router.post("/editProfile", editProfile);

router.post("/verifyAndREsetPassword", protect, verifyAndREsetPassword);
export default router;
