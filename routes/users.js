const express = require("express");

const User = require("../models/User");

const { protect, authorize } = require("../middlewares/auth");

const advancedResults = require("../middlewares/advancedResults");
const {
	getUsers,
	createUser,
	getUser,
	deleteUser,
	updateUser,
} = require("../controllers/users");
const router = express.Router({ mergeParams: true });

// router.use(protect);
// router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers);
router.route("/").post(createUser);
router.route("/:id").get(getUser);
router.route("/:id").put(updateUser);
router.route("/:id").delete(deleteUser);

module.exports = router;
