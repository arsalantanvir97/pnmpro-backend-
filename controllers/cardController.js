import Card from "../models/CardModel";

const addCard = async (req, res) => {
  const { cardholdername, cardnumber, cvvcode, expiryDate } = req.body;

  try {
    await Card.findOneAndUpdate(
      { user: req.id },
      { user: req.id, cardholdername, cardnumber, cvvcode, expiryDate },
      { new: true, upsert: true, returnNewDocument: true }
    );
    await res.status(201).json({
      message: "Card Info Set"
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getCard = async (req, res) => {
  try {
    const userCard = await Card.findOne({
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

export { addCard, getCard };
