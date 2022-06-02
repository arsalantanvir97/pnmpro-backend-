import express from "express";
const router = express.Router();

import {
    createFeedback,Feedbacklogs,getFeedbackDetails
} from "../controllers/feedbackController";
import { protect } from "../middlewares/authMIddleware";

router.post("/create-feedback",createFeedback);
router.get("/Feedbacklogs",protect,Feedbacklogs);
router.get("/feedback-details/:id",protect,getFeedbackDetails);


export default router;