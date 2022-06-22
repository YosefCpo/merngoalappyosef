const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const protect = async (req, res, next) => {
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// Get token from headers
			const token = req.headers.authorization.split(" ")[1];

			// Verify Token
			const decoded = jwt.verify(token, process.env.SECRET_KEY);

			// Get user from the token
			req.user = await userModel.findById(decoded).select("-password");

			next();
		} catch (err) {
			res.status(401).json({error: "Not Authorized"});
		}
	} else {
		res.status(401).json({error: "There is no token"});
	}
};

module.exports = {protect};
