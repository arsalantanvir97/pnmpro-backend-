import express from "express";
const router = express.Router();
import { createDriverVehicle ,getVehicleDetail,editVehicle,deleteVehicle} from "../controllers/driverVehicleController";
import { protect } from "../middlewares/authMIddleware.js";

router.post("/registerDriverVehicle", protect, createDriverVehicle);
router.get("/getVehicleDetail/:id", protect, getVehicleDetail);
router.post("/editVehicle", protect, editVehicle);
router.get("/deleteVehicle/:id", protect, deleteVehicle);

export default router;
