const path = require("path");
const express = require("express");
const cors = require("cors");
const goalRoute = require("./routes/goalRoutes");
const userRoute = require("./routes/userRoutes");
const {connectDB} = require("./config/db");
const colors = require("colors");

require("dotenv").config();

// Creating App
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// App Routes
app.use("/api/goals", goalRoute);
app.use("/api/user", userRoute);

const port = process.env.PORT || 5000;

// Serve frontend
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.reslove(__dirname, "../frontend/build")));

	app.get("*", (req, res) =>
		res.sendFile(path.resolve(__dirname, "../", "frontend/build", "index.html"))
	);
} else {
	app.get("/", (req, res) => {
		res.send("Please set to production");
	});
}

// Listening app
app.listen(port, () => {
	console.log(`Listning in port ${port}`);
});
