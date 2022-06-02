import multer from "multer";
import { v4 as uuidv4 } from "uuid";

export const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    let extension = file.originalname.split(".").pop();
    cb(null, uuidv4() + "." + extension);
  },
});

export const fileFilter = (req, file, cb) => {
  console.log("file", file);
  if (file.fieldname === "user_image" || "ad_video") {
    console.log("block1");
    if (file.mimetype.includes("image/") || file.mimetype.includes("video/")) {
      console.log("block2");

      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    cb(null, false);
  }
};
