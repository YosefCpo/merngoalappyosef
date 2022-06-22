const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @route POST api/user
// @access Public
// @desc Register a User
const registerUser = async (req, res) => {
	const {name, email, password} = req.body;

	// Check all data entered
	if (!name || !email || !password) {
		res.status(400).json({error: "Please fill all fields"});
		return;
	}

	// Check email not exists
	const user = await userModel.findOne({email: email});

	if (user) {
		res.status(400).json({error: "User already exists"});
		return;
	}

	// hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create the user
	const createdUser = await userModel.create({
		name,
		email,
		password: hashedPassword,
	});

	if (createdUser) {
		res.status(200).json({
			name: createdUser.name,
			email: createdUser.email,
			token: generateToken(createdUser.id),
		});
	} else {
		res.status(401).json({error: "Error creating the user"});
	}
};

// @route POST api/user/login
// @access Public
// @desc Login a User
const loginUser = async (req, res) => {
	const {email, password} = req.body;

	// Check all data entered
	if (!email || !password) {
		res.status(400).json({error: "Please fill all fields"});
		return;
	}

	// Check for user exists
	const user = await userModel.findOne({email: email});

	if (user) {
		if (await bcrypt.compare(password, user.password)) {
			res.status(200).json({
				name: user.name,
				email: user.email,
				token: generateToken(user.id),
			});
		} else {
			res.status(400).json({error: "Invalid password"});
			return;
		}
	} else {
		res.status(400).json({error: "User not found"});
		return;
	}
};

// @route GET api/user
// @access Private
// @desc Get user Data
const getMe = async (req, res) => {
	res.status(200).json({
		id: req.user._id,
		name: req.user.name,
		email: req.user.email,
	});
};

const generateToken = (id) => {
	return jwt.sign(id, process.env.SECRET_KEY);
};

module.exports = {registerUser, loginUser, getMe};
