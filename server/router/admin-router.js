const express = require("express");
const adminController = require("../controllers/admin-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");

const router = express.Router();

router
  .route("/users")
  .get(authMiddleware, adminMiddleware, adminController.getAllUsers)
  .post(authMiddleware, adminMiddleware, adminController.createUser);

router
  .route("/users/:id")
  .get(authMiddleware, adminMiddleware, adminController.getUserById);

router
  .route("/users/update/:id")
  .patch(authMiddleware, adminMiddleware, adminController.updateUserById);

router
  .route("/users/delete/:id")
  .delete(authMiddleware, adminMiddleware, adminController.deleteUserById);

router
  .route("/contacts")
  .get(authMiddleware, adminMiddleware, adminController.getAllContacts);

router
  .route("/contacts/delete/:id")
  .delete(authMiddleware, adminMiddleware, adminController.deleteContactById);

router
  .route("/blogs")
  .get(authMiddleware, adminMiddleware, adminController.getAllBlogs)
  .post(authMiddleware, adminMiddleware, adminController.createBlog);

router
  .route("/blogs/:id")
  .delete(authMiddleware, adminMiddleware, adminController.deleteBlogById);

router
  .route("/careers")
  .get(authMiddleware, adminMiddleware, adminController.getAllCareers)
  .post(authMiddleware, adminMiddleware, adminController.createCareer);

router
  .route("/careers/:id")
  .delete(authMiddleware, adminMiddleware, adminController.deleteCareerById);

module.exports = router;
