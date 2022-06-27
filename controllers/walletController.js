import Wallet from "../models/WalletModel";

const addWallet = async (req, res) => {
  const { cardholdername, cardnumber, cvvcode, expiryDate, amount } = req.body;

  try {
    await Wallet.findOneAndUpdate(
      { user: req.id },
      {
        cardholdername,
        cardnumber,
        cvvcode,
        expiryDate,
        $inc: { amount: amount }
      },
      { new: true, upsert: true, returnNewDocument: true }
    );
    await res.status(201).json({
      message: "Wallet Price Set"
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getWallet = async (req, res) => {
  try {
    const userWallet = await Wallet.findOne({
      user: req.id
    })
      .populate("user")
      .select("-password");
    await res.status(201).json({
      userWallet
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export { addWallet, getWallet };
