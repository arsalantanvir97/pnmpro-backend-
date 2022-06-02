import VehicleType from "../models/VehicleTypeModel";

const createVehicleType = async (req, res) => {
  const { name, facilities, rate } = req.body;
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
  try {
    const vehicleCreated = await new VehicleType({
      name,
      facilities: JSON.parse(facilities),
      rate,
      image: user_image
    });
    await vehicleCreated.save();
    await res.status(201).json({ message: "VehicleType Created Successfully" });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error.toString() });
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const vehicle = await VehicleType.find().lean();
    await res.status(201).json({
      vehicle
    });
  } catch (error) {
    return res.status(400).json({ message: error.toString() });
  }
};
const getSingleVehicleType = async (req, res) => {
  try {
    const vehicle = await VehicleType.findById(req.params.id).lean();
    await res.status(201).json({
      vehicle
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error.toString() });
  }
};
const editVehicleType = async (req, res) => {
  const { name, facilities, rate, id } = req.body;
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;

  try {
    const vehicle = await VehicleType.findById(id);

    vehicle.name = name ? name : vehicle.name;
    vehicle.facilities = facilities
      ? JSON.parse(facilities)
      : vehicle.facilities;
    vehicle.rate = rate ? rate : vehicle.rate;
    vehicle.image = user_image ? user_image : vehicle.image;

    await vehicle.save();
    await res.status(201).json({
      vehicle
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error.toString() });
  }
};

export {
  createVehicleType,
  getAllVehicles,
  getSingleVehicleType,
  editVehicleType
};
