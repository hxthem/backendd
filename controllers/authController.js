const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../config/mailer");
const generateToken = require("../utils/generateToken");
const generateCode = require("../utils/generateCode");

exports.register = async (req, res) => {
  console.log("Register endpoint hit");
  const { email, password } = req.body;
  console.log("Request body:", req.body);

  try {
    const exist = await User.findOne({ where: { email } });
    if (exist) {
      console.log("Email already in use");
      return res.status(400).json({ msg: "This email is already in use." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const verificationCode = generateCode();

    await User.create({ email, password: hashed, verificationCode });
    await sendMail(email, "Verification Code", `Your code is: ${verificationCode}`);

    console.log("User registered successfully");
    res.status(200).json({ msg: "Check your email for the verification code." });
  } catch (err) {
    console.error("Error in register function:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.verificationCode !== code) return res.status(400).json({ msg: "Invalid verification code." });

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.status(200).json({ msg: "Email successfully verified." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !user.isVerified) return res.status(400).json({ msg: "Invalid email or password." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid email or password." });

    const token = generateToken(user.id);
    res.status(200).json({ token });
  } catch (err) {
    console.error("Register Error:", error);

    res.status(500).json({ msg: "Server error" });
  }
};

exports.recoverPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: "User not found." });

    const code = generateCode();
    user.resetCode = code;
    await user.save();

    await sendMail(email, "Password Reset Code", `Your code is: ${code}`);
    res.status(200).json({ msg: "Password recovery email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.resetCode !== code) return res.status(400).json({ msg: "Invalid reset code." });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetCode = null;
    await user.save();

    res.status(200).json({ msg: "Password successfully updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.oauthSuccess = (req, res) => {
  try {
    const token = generateToken(req.user.id);
    res.redirect(`/auth-success?token=${token}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "OAuth success handling failed." });
  }
};