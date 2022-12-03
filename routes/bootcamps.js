const express = require("express");
const router = express.Router();

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  editBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamps");

router.route("/").get(getBootcamps);
router.route("/").post(createBootcamp);
router.route("/:id").get(getBootcamp);
router.route("/:id").put(editBootcamp);
router.route("/:id").delete(deleteBootcamp);

module.exports = router;
