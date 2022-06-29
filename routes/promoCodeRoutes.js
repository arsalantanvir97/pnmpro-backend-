import express from "express";
const router = express.Router();
import {
  createPromoCode,
  getAllPromoCode,
  applypromocode
} from "../controllers/promoCodeController";
import { protect } from "../middlewares/authMIddleware.js";

router.post("/createPromoCode", protect, createPromoCode);
router.get("/getAllPromoCode", protect, getAllPromoCode);
router.post("/applypromocode", protect, applypromocode);

export default router;
