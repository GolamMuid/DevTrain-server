const path = require('path');
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const User = require('../models/User')

//@desc    Register user
//@route   GET /api/v1/auth/register
//@access  public
exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true })
})