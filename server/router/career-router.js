const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");

// Public route to get all career postings
router.get("/", adminController.getAllCareers);

// Public route to get a single career posting by ID
router.get("/:id", adminController.getCareerById);

module.exports = router;
