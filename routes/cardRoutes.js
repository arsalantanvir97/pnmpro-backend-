import express from "express";
const router = express.Router();
import { addCard, getCard } from "../controllers/cardController";
import { protect } from "../middlewares/authMIddleware.js";

router.post("/addCard", protect, addCard);
router.get("/getCard", protect, getCard);
export default router;
