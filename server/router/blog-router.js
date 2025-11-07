const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");

// Public route to get all blogs
router.get("/", adminController.getAllBlogs);

module.exports = router;
