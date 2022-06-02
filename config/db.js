import mongoose from 'mongoose'
const MONGO_URL = process.env.MONGO_URL;
const MONGO_DB = process.env.MONGO_DB;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("\u001b[" + 34 + "m" + `Connected to Database` + "\u001b[0m");
  } catch (error) {
    console.error(error.message);
    // exit process with failure
    process.exit(1);
  }
};
export default connectDB