// *----------------------
//* express.Router
// *----------------------

//? In Express.js, express.Router() is a mini Express application without all the server configurations but with the ability to define routes, middleware, and even have its own set of route handlers. It allows you to modularize your routes and middleware to keep your code organized and maintainable.
//* https://expressjs.com/en/guide/routing.html
//? Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”.

const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
const { signupSchema, loginSchema } = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");
const authMiddleware = require("../middlewares/auth-middleware");
const {
  sendWelcomeEmail,
  verifyEmailConfig,
  checkEmailEnvVars,
} = require("../utils/emailService");

router.route("/").get(authControllers.home);
router
  .route("/register")
  .post(validate(signupSchema), authControllers.register);

router.route("/login").post(validate(loginSchema), authControllers.login);

router.route("/user").get(authMiddleware, authControllers.user);

// Test email endpoint (for debugging)
router.route("/test-email").post(async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // First check environment variables
    const envCheck = checkEmailEnvVars();
    if (!envCheck.isValid) {
      return res.status(500).json({
        message: "Email configuration is incomplete",
        error: "Missing required environment variables",
        missingVars: envCheck.missing,
        help: "Please set the following environment variables in your .env file",
      });
    }

    console.log("Testing email configuration...");
    const verifyResult = await verifyEmailConfig();

    if (!verifyResult) {
      return res.status(500).json({
        message:
          "Email configuration verification failed. Check server logs for details.",
        help: "Check your SMTP credentials and connection settings",
      });
    }

    const result = await sendWelcomeEmail(email, username || "Test User");

    if (result.success) {
      return res.status(200).json({
        message: "Test email sent successfully!",
        messageId: result.messageId,
        response: result.response,
        note: "If you don't see the email, check your spam folder",
      });
    } else {
      return res.status(500).json({
        message: "Failed to send test email",
        error: result.error,
        code: result.code,
        responseCode: result.responseCode,
        missingVars: result.missingVars,
        help:
          result.code === "EAUTH"
            ? "Check your SMTP username and password"
            : result.code === "ETIMEDOUT" || result.code === "ECONNREFUSED"
            ? "Check your SMTP host, port, and network connection"
            : "Check server logs for more details",
      });
    }
  } catch (error) {
    console.error("Test email error:", error);
    return res.status(500).json({
      message: "Error testing email",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

module.exports = router;
