const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

// route for signup
router.post("/signup", authController.signup);

// route for login
router.post("/login", authController.login);

module.exports = router;
