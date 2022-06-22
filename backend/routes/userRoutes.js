const express = require("express");
const router = express.Router();
const {
	registerUser,
	loginUser,
	getMe,
} = require("../controllers/userController");
const {protect} = require("../middlewares/protect");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/", protect, getMe);

module.exports = router;
