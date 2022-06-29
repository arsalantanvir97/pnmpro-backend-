import PromoCode from "../models/PromoCodeModel";

const createPromoCode = async (req, res) => {
  const { title, startingdate, endingdate, promocode, noofusers, discount } =
    req.body;

  console.log("req.bpdy", req.body);
  try {
    const promocode = await PromoCode.create(req.body);
    await promocode.save();
    await res.status(201).json({
      promocode
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const applypromocode = async (req, res) => {
  const { promocode } = req.body;

  console.log("req.bpdy", req.body);
  try {
    const ridepromocode = await PromoCode.findOne({
      promocode: promocode
    }).select("promocode discount _id");
    if (ridepromocode) {
      await res.status(201).json({
        promocode: ridepromocode,
        message: "Valid PromoCode"
      });
    } else {
      await res.status(201).json({
        message: "Invalid PromoCode"
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getAllPromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.find().lean();
    await res.status(201).json({
      promoCode
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export { createPromoCode, getAllPromoCode, applypromocode };
