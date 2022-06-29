import path from "path";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import logger from "morgan";
import https from "https";
import fs from "fs";

import connectDB from "./config/db.js";
import { fileFilter, fileStorage } from "./multer";

import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import userRoutes from "./routes/userRoutes";
import driverRoutes from "./routes/driverRoutes";
import savedplaceRoutes from "./routes/savedplaceRoutes";
import walletRoutes from "./routes/walletRoutes";
import cardRoutes from "./routes/cardRoutes";
import bookRideRoutes from "./routes/bookRideRoutes";
import promoCodeRoutes from "./routes/promoCodeRoutes";

dotenv.config();
const local = true;
let credentials = {};

if (local) {
  credentials = {
    key: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.key", "utf8"),
    cert: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.crt", "utf8"),
    ca: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.ca")
  };
} else {
  credentials = {
    key: fs.readFileSync("../certs/ssl.key"),
    cert: fs.readFileSync("../certs/ssl.crt"),
    ca: fs.readFileSync("../certs/ca-bundle")
  };
}

connectDB();
const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(logger("dev"));

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter
  }).fields([
    {
      name: "user_image",
      maxCount: 1
    },
    {
      name: "ad_video",
      maxCount: 1
    },
    {
      name: "doc_schedule",
      maxCount: 1
    }
  ])
);

app.use("/api/auth", authRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/user", userRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/savedplaces", savedplaceRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/card", cardRoutes);
app.use("/api/bookride", bookRideRoutes);
app.use("/api/promocode", promoCodeRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("/", (req, res) => {
  res.send("API is running....");
});

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.PORT, () => {
  console.log(
    "\u001b[" +
      34 +
      "m" +
      `Server started on port: ${process.env.PORT}` +
      "\u001b[0m"
  );
});
