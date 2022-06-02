import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error = new Error("Not Authenticated");
      error.statucCode = 401;
      throw error;
    }

    const token = req.get("Authorization").split(" ")[1];
    let decodedToken = "";
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decodedToken", decodedToken);
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }

    if (!decodedToken) {
      const error = new Error("Not Authenticated");
      error.statusCode = 401;
      throw error;
    }

    req.id = decodedToken.id;
    next();
  } catch (err) {
    return res.status(405).json({
      message: "You have been logged out"
    });
  }
};

export { protect };
