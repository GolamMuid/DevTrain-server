const express = require("express");

const { getCourses, getCourse, addCourse } = require("../controllers/courses");

const Course = require('../models/Course')
const advancedResults = require('../middlewares/advancedResults')

const { protect } = require('../middlewares/auth')

const router = express.Router({ mergeParams: true });

router.route("/").get(advancedResults(Course, {
  path: "bootcamp",
  select: "name description",
}), getCourses);
router.route("/:id").get(getCourse);
router.route("/").post(protect, addCourse);

module.exports = router;
