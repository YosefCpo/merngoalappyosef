const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
	{
		user: {type: mongoose.Types.ObjectId, required: true},
		text: {type: String, required: true},
	},
	{
		timestamps: true,
	}
);

const goalModel = mongoose.model("goals", goalSchema);

module.exports = goalModel;
