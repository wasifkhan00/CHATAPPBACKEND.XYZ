const bcrypt = require("bcrypt");
const otpModel = require("../model/otpModel");

const saveOtpToDB = async (email, otp) => {
  try {
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    // Remove existing OTPs for that email to avoid duplicates
    await otpModel.deleteMany({ email });

    // Save new OTP
    const newOtp = new otpModel({ email, otp: hashedOtp });
    await newOtp.save();

    return true;
  } catch (err) {
    console.error("Error saving OTP:", err);
    return false;
  }
};

module.exports = saveOtpToDB;
