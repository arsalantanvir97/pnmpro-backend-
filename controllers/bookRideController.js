import BookRide from "../models/BookRideModel";

const bookaRide = async (req, res) => {
    try {
      const userCard = await BookRide.findOne({
        user: req.id
      })
        .populate("user")
        .select("-password");
      await res.status(201).json({
        userCard
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  

export {bookaRide}