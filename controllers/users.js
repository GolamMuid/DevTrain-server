const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const User = require("../models/User");

//@desc    Get users
//@route   GET /api/v1/auth/users
//@access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;
	res.status(200).json(res.advancedResults);
});

//@desc    Get single user
//@route   GET /api/v1/auth/users/:id
//@access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	res.status(200).json({
		success: true,
		data: user,
	});
});

//@desc    Create user
//@route   POST /api/v1/auth/users
//@access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);

	res.status(201).json({
		success: true,
		data: user,
	});
});

//@desc    Update user
//@route   PUT /api/v1/auth/users/:id
//@access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
});

//@desc    Delete user
//@route   DELETE /api/v1/auth/users/:id
//@access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
	await User.findByIdAndDelete(req.params.id);

	res.status(200).json({
		success: true,
		data: {},
	});
});

//@desc    Add bootcamp in profile
//@route   POST /api/v1/auth/users/:id/bootcamps
//@access  Private/Admin

exports.addBootcamp = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	// Check if the user is a publisher
	if (user.role === "publisher") {
		return next(
			new ErrorResponse(`Publisher cannot enroll in a bootcamp`, 403)
		);
	}

	// Check if the user is already enrolled in the bootcamp
	if (user.bootcamps.includes(bootcamp._id)) {
		return next(
			new ErrorResponse(`User already enrolled in this bootcamp`, 403)
		);
	}
	user.bootcamps.push(bootcamp._id);
	await user.save();

	res.status(200).json({
		success: true,
		data: user,
	});
});
