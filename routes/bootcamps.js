const express = require("express");

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  editBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require("../controllers/bootcamps");

const advancedResults = require("../middlewares/advancedResults")

const Bootcamp = require("../models/Bootcamp")

//Include other resource routers
const courseRouter = require('./courses')

const router = express.Router();

// Re-route into other resource routers

router.use('/:bootcampId/courses', courseRouter)

router.route('/:id/photo').put(bootcampPhotoUpload)

router.route("/").get(advancedResults(Bootcamp, 'courses'), getBootcamps);
router.route("/").post(createBootcamp);
router.route("/:id").get(getBootcamp);
router.route("/:id").put(editBootcamp);
router.route("/:id").delete(deleteBootcamp);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

module.exports = router;
