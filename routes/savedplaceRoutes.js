import express from "express";
const router = express.Router();

import {
    addSavedPlaces,
    userSavedPlaces,
    deleteplace
} from "../controllers/savedPlacesController";
import { protect } from "../middlewares/authMIddleware";

router.post("/addSavedPlaces",protect,addSavedPlaces);
router.get("/userSavedPlaces",protect,userSavedPlaces);
router.get("/deleteplace/:id",protect,deleteplace);


export default router;