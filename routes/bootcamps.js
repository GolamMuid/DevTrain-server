const express = require("express");

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  editBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const advancedResults = require("../middlewares/advancedResults");

const Bootcamp = require("../models/Bootcamp");

//Include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

const router = express.Router();

const { protect, authorize } = require("../middlewares/auth");

// Re-route into other resource routers

router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router.route("/").get(advancedResults(Bootcamp, "courses"), getBootcamps);
router
  .route("/")
  .post(protect, authorize("publisher", "admin"), createBootcamp);
router.route("/:id").get(getBootcamp);
router
  .route("/:id")
  .put(protect, authorize("publisher", "admin"), editBootcamp);
router
  .route("/:id")
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

module.exports = router;
