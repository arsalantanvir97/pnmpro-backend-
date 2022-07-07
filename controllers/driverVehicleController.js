import DriverVehicle from "../models/DriverVehicleModel";

const createDriverVehicle = async (req, res) => {
  const {
    vehicletype,
    brandname,
    vehiclename,
    vehiclecolor,
    licenseNo,
    VinNo
  } = req.body;
  let licensePlate =
    req.files &&
    req.files.license_plate &&
    req.files.license_plate[0] &&
    req.files.license_plate[0].path;
  let insurancedoc =
    req.files &&
    req.files.doc_schedule &&
    req.files.doc_schedule[0] &&
    req.files.doc_schedule[0].path;
  try {
    const vehicleCreated = await new DriverVehicle({
      vehicletype,
      driver: req.id,
      brandname,
      vehiclename,
      vehiclecolor,
      licenseNo,
      licensePlate,
      insurancedoc,
      VinNo
    });
    await vehicleCreated.save();
    await res
      .status(201)
      .json({ message: "Driver Vehicle Created Successfully" });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error.toString() });
  }
};
const getVehicleDetail = async (req, res) => {
  try {
    const vehicle = await DriverVehicle.findById(req.params.id).lean();
    res.status(201).json({
      vehicle
    });
  } catch (error) {
    return res.status(400).json({ message: error.toString() });
  }
};
const editVehicle = async (req, res) => {
  try {
    const {
      vehicletype,
      brandname,
      vehiclename,
      vehiclecolor,
      licenseNo,
      VinNo,
      id
    } = req.body;
    let licensePlate =
      req.files &&
      req.files.license_plate &&
      req.files.license_plate[0] &&
      req.files.license_plate[0].path;
    let insurancedoc =
      req.files &&
      req.files.doc_schedule &&
      req.files.doc_schedule[0] &&
      req.files.doc_schedule[0].path;

    const vehicle = await DriverVehicle.findById(id);

    vehicle.vehicletype = vehicletype ? vehicletype : vehicle.vehicletype;
    vehicle.brandname = brandname ? brandname : vehicle.brandname;
    vehicle.vehiclename = vehiclename ? vehiclename : vehicle.vehiclename;
    vehicle.vehiclecolor = vehiclecolor ? vehiclecolor : vehicle.vehiclecolor;
    vehicle.licenseNo = licenseNo ? licenseNo : vehicle.licenseNo;
    vehicle.VinNo = VinNo ? VinNo : vehicle.VinNo;

    vehicle.licensePlate = licensePlate ? licensePlate : vehicle.licensePlate;
    vehicle.insurancedoc = insurancedoc ? insurancedoc : vehicle.insurancedoc;

    await vehicle.save();
    await res.status(201).json({
      vehicle
    });
  } catch (error) {
    return res.status(400).json({ message: error.toString() });
  }
};
const deleteVehicle = async (req, res) => {
  try {
    await DriverVehicle.findByIdAndDelete(req.params.id);
    res.status(201).json({
      message: "Vehicle Deleted Successfully"
    });
  } catch (error) {
    return res.status(400).json({ message: error.toString() });
  }
};
export { createDriverVehicle, getVehicleDetail, editVehicle, deleteVehicle };
