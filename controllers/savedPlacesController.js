import SavedPlaces from "../models/SavedPlacesModel";

const addSavedPlaces = async (req, res) => {
  const { name, location } = req.body;

  try {
    const createSavedPlaces = await SavedPlaces.create({
      user: req.id,
      name,
      location: { type: "Point", coordinates: location }
    });
    await createSavedPlaces.save();
    await res.status(201).json({
      createSavedPlaces
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const userSavedPlaces = async (req, res) => {
  
    try {
      const savedplaces = await SavedPlaces.find({
        user: req.id,
      }).populate('user').select('-password');
      await res.status(201).json({
        savedplaces
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  const deleteplace = async (req, res) => {
  
    try {
      await SavedPlaces.findByIdAndDelete(req.params.id);
      await res.status(201).json({
        message: "Place Deleted Successfully"
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  
  
export { addSavedPlaces,userSavedPlaces,deleteplace };
