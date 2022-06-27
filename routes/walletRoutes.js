import express from "express";
const router = express.Router();
import { addWallet, getWallet } from "../controllers/walletController";
import { protect } from "../middlewares/authMIddleware.js";

router.post("/addWallet", protect, addWallet);
router.get("/getWallet", protect, getWallet);
export default router;
