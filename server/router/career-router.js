const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");

// Public route to get all career postings
router.get("/", adminController.getAllCareers);

module.exports = router;
