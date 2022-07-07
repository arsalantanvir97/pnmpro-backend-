import express from "express";
const router = express.Router();
import {
    registerDriver,
    driverlogs,
    toggleActiveStatus,
    getDriverDetails,updateStatus,
    login,recoverPassword,
    verifyRecoverCode,
    resetPassword,
    changepassword,
    editProfile,
} from "../controllers/driverController";
import { protect } from "../middlewares/authMIddleware.js";

router.post("/registerDriver", registerDriver);
router.post("/login", login);
router.post("/driverRecoverPassword", recoverPassword);
router.post("/driververifyRecoverCode", verifyRecoverCode);
router.post("/driverresetPassword", resetPassword);
router.post("/changepassword", protect, changepassword);
router.post("/editProfile", protect, editProfile);
router.post("/changepassword", protect, changepassword);


router.get("/driverlogs",protect,driverlogs);
router.get("/toggle-active/:id",protect,toggleActiveStatus);
router.get("/driver-details/:id",protect,getDriverDetails);
router.post("/updateStatus/:id",updateStatus);

export default router;
