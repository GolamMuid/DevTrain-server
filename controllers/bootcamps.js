const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");
const slugify = require("slugify");

//@desc    get all bootcamps
//@route   GET /api/v1/bootcamps
//@access  public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // let query;

  // // Copy req.query
  // const reqQuery = { ...req.query };

  // // Fields to exclude
  // const removeFields = ["select", "sort", "page", "limit"];

  // // Loop over removefields and delete them from reqQuery
  // removeFields.forEach((param) => delete reqQuery[param]);

  // // Create query string
  // let queryStr = JSON.stringify(req.query);

  // // Create operators ($gt, $gte, etc)
  // queryStr = queryStr.replace(
  //   /\b(gt|gte|lt|lte|in)\b/g,
  //   (match) => `$${match}`
  // );

  // // Finding resource
  // query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

  // // Select Fields
  // if (req.query.select) {
  //   const fields = req.query.select.split(",").join(" ");
  //   query = query.select(fields);
  // }

  // // Sort
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort("-createdAt");
  // }

  // // Pagination
  // const page = parseInt(req.query.page, 10) || 1;
  // const limit = parseInt(req.query.limit, 10) || 25;
  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  // const total = await Bootcamp.countDocuments();

  // query = query.skip(startIndex).limit(limit);

  // //Executing Query
  // const bootcamps = await query;

  // // Pagination result
  // const pagination = {};

  // if (endIndex < total) {
  //   pagination.next = {
  //     page: page + 1,
  //     limit,
  //   };
  // }

  // if (startIndex > 0) {
  //   pagination.prev = {
  //     page: page - 1,
  //     limit,
  //   };
  // }

  res.status(200).json(res.advancedResults);
});

//@desc    get single bootcamp
//@route   GET /api/v1/bootcamps/:id
//@access  public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate("courses");
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc    create bootcamp
//@route   POST /api/v1/bootcamps
//@access  Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published bootcamp

  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // If the user is not an admin, they can add only one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `the user with ID ${req.user.id} has already published a bootcamp`,
        404
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc    Edit bootcamp
//@route   PUT /api/v1/bootcamps/:id
//@access  Private

exports.editBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this bootcamp`,
        404
      )
    );
  }

  // update slug while updating name
  if (Object.keys(req.body).includes("name")) {
    req.body.slug = slugify(req.body.name, { lower: true });
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: bootcamp });
});

//@desc    Delete bootcamp
//@route   DELETE /api/v1/bootcamps/:id
//@access  Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this bootcamp`,
        404
      )
    );
  }

  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});

//@desc    Get bootcamps within a radius
//@route   GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access  Private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc Radius in radians
  // Divide distance by the radius of earth in miles
  // Earth Radius = 3963miles

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

//@desc    Upload photo for bootcamp
//@route   PUT /api/v1/bootcamps/:id/photo
//@access  Private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this bootcamp`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  console.log(file);

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return new ErrorResponse(`Please upload an image file`, 400);
  }

  //Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return new ErrorResponse(
      `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
      400
    );
  }

  //Create custom filename
  const url = req.protocol + "://" + req.get("host");
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return new ErrorResponse(`Problem with file upload`, 500);
    }

    const imageName = `${url}/uploads/${file.name}`;

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: imageName });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
