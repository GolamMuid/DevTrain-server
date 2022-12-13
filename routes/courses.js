const express = require("express");

const {
  getCourses,
  getCourse,
  addCourse,
  deleteCourse,
  updateCourse,
} = require("../controllers/courses");

const Course = require("../models/Course");
const advancedResults = require("../middlewares/advancedResults");

const { protect } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.route("/").get(
  advancedResults(Course, {
    path: "bootcamp",
    select: "name description",
  }),
  getCourses
);
router.route("/:id").get(getCourse);
router.route("/").post(protect, addCourse);
router.route("/:id").delete(protect, deleteCourse);
router.route("/:id").put(protect, updateCourse);

module.exports = router;
