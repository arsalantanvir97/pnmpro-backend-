import express from "express";
const router = express.Router();

import {
    addSavedPlaces,
    userSavedPlaces
} from "../controllers/savedPlacesController";
import { protect } from "../middlewares/authMIddleware";

router.post("/addSavedPlaces",protect,addSavedPlaces);
router.get("/userSavedPlaces",protect,userSavedPlaces);


export default router;