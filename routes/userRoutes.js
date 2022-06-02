import express from "express";
const router = express.Router();
import {
    registerUser,
    userlogs,
    toggleActiveStatus,
    getUserDetails,
} from "../controllers/userController";
import { protect } from "../middlewares/authMIddleware.js";

router.post("/userRegister", registerUser);
router.get("/userlogs",protect,userlogs);
router.get("/toggle-active/:id",toggleActiveStatus);
router.get("/user-details/:id",getUserDetails);


export default router;
