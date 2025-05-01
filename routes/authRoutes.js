const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

// Routes for authentication
router.post("/register", authController.register);
router.post("/verify", authController.verifyCode);
router.post("/login", authController.login);
router.post("/recover", authController.recoverPassword);
router.post("/reset", authController.resetPassword);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.oauthSuccess
);

// Facebook OAuth
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  authController.oauthSuccess
);

module.exports = router  ;
