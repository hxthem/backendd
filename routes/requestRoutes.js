const express = require("express");
const router = express.Router();
const { sendRequest } = require("../controllers/requestController");
const isAuthenticated = require("../middleware/authMiddleware");

router.post("/", isAuthenticated, sendRequest);

module.exports = router;
