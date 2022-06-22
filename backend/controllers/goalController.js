const {default: mongoose} = require("mongoose");
const goalModel = require("../models/goalModel");

// @route GET api/goals
// @access Private
// @desc Get User Goals
const getGoals = async (req, res) => {
	const goals = await goalModel.find({user: req.user});

	res.status(200).json(goals);
};

// @route POST api/goals
// @access Private
// @desc Set a User Goal
const setGoal = async (req, res) => {
	// Check text field is entered
	const text = req.body.text;

	if (!text) {
		res.status(400).json({err: "Please fill the text field"});
		return;
	}

	const goal = await goalModel.create({user: req.user.id, text: req.body.text});

	res.status(200).json(goal);
};

// @route PUT api/goals/:id
// @access Private
// @desc Update a User Goal
const updateGoal = async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.status(400).json({error: "Goal not found!"});
		return;
	}

	const goal = await goalModel.findById(req.params.id);

	if (!goal) {
		res.status(400).json({error: "Goal not found!"});
		return;
	}

	if (!req.body.text) {
		res.status(400).json({error: "Please fill the text field"});
		return;
	}

	if (goal.user.toString() !== req.user.id) {
		res.status(400).json({error: "only goal creator can edit it"});
		return;
	}

	const updatedGoal = await goalModel.findByIdAndUpdate(
		req.params.id,
		{text: req.body.text},
		{
			new: true,
		}
	);

	res.status(200).json(updatedGoal);
};

// @route DELETE api/goals/:id
// @access Private
// @desc Delete a User Goal
const deleteGoal = async (req, res) => {
	// Check for Objectid
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.status(400).json({err: "Goal not found"});
		return;
	}

	// Check goal exists
	const goal = await goalModel.findById(req.params.id);

	if (!goal) {
		res.status(400).json({err: "Goal not found"});
		return;
	}

	if (req.user.id === goal.user.toString()) {
		const deletedGoal = await goalModel.findByIdAndDelete(req.params.id);

		res.status(200).json(deletedGoal);
	} else {
		res.status(400).json({err: "Only goal setter can delete it"});
		return;
	}
};

module.exports = {getGoals, setGoal, updateGoal, deleteGoal};
