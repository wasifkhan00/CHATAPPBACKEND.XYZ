const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "wasifullahkhan4041@gmail.com", // replace with your Gmail
    pass: "odvy akdz jhxk uiqi", // NOT your Gmail password
  },
});

async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: '"SnapText Team" <wasifullahkhan4041@gmail.com>',
    to: to,
    subject: "Your OTP for SnapText Verification",
    html: `
      <div style="font-family:sans-serif;">
        <h2> Your Verification Code</h2>
        <p>${otp} is your one time password for email verification</p>
        <p>This code is valid for 2 minutes.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Email sent:", info.response);
    return { success: true, message: "Email sent" };
  } catch (err) {
    console.error("Email sending error:", err);
    return { success: false, message: err.message };
  }
}

module.exports = { sendOTPEmail };
