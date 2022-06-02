import Reset from '../models/ResetModel'
import bcrypt from 'bcryptjs'
const createResetToken = async (email, code) => {
    const token = await Reset.findOne({ email });
    if (token) await token.remove();
    const newToken = new Reset({
      email,
      code,
    });
    console.log('newToken',newToken)
    await newToken.save();
  };
  const verifyPassword = async (password_to_comapre, password_base) =>
  await bcrypt.compare(password_to_comapre, password_base);
  const comparePassword = (password, confirm_password) =>
  password === confirm_password;
  const generateHash = async (string) => await bcrypt.hash(string, 12);


  export{createResetToken,verifyPassword,comparePassword,generateHash}