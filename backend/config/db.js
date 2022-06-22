const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_URI, () => {
			console.log("Database started succefully".cyan);
		});
	} catch (err) {
		console.log("Error connecting to the database".red);
	}
};

module.exports = {connectDB};
