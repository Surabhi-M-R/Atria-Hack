const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '..', '.env') });
const express = require("express");
const cors = require("cors");
const app = express();
const authRoute = require("./router/auth-router");
const contactRoute = require("./router/contact-router");
const serviceRoute = require("./router/service-router");
const adminRoute = require("./router/admin-router");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const apicache = require("apicache");
const User = require("./models/user-model");

// Configure Cross-Origin Resource Sharing (CORS) to allow requests from specific origins.
const corsOptions = {
  // origin: "http://localhost:5173",
  origin: (origin, callback) => {
    // Check if the origin is allowed
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://thapatechnical.site",
      "https://www.thapatechnical.site",
    ];
    const isAllowed = allowedOrigins.includes(origin);
    callback(null, isAllowed ? origin : false);
  },
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));
// app.use(cors());

// --- Performance and Security Middleware ---

// Use compression middleware to gzip responses, reducing their size and improving performance.
app.use(compression());

// Set up rate limiting to prevent brute-force and denial-of-service attacks.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Initialize caching middleware.
let cache = apicache.middleware;


// Middleware to parse incoming JSON requests.
app.use(express.json());

// --- API Routes ---

// Mount the Router: To use the router in your main Express app, you can "mount" it at a specific URL prefix
app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);
// Cache the service data for 10 minutes to reduce database load.
app.use("/api/data", cache("10 minutes"), serviceRoute);

// Mount the admin router for administrative tasks.
app.use("/api/admin", adminRoute);


// --- Error Handling ---

// Use custom error handling middleware to catch and process errors.
app.use(errorMiddleware);


// --- Server Initialization ---

const PORT = process.env.PORT || 5001;
const ensureDefaultAdmin = async () => {
  const {
    ADMIN_DEFAULT_EMAIL,
    ADMIN_DEFAULT_PASSWORD,
    ADMIN_DEFAULT_USERNAME,
    ADMIN_DEFAULT_PHONE,
  } = process.env;

  if (!ADMIN_DEFAULT_EMAIL || !ADMIN_DEFAULT_PASSWORD) {
    console.warn(
      "Skipping default admin creation. ADMIN_DEFAULT_EMAIL or ADMIN_DEFAULT_PASSWORD env vars are missing."
    );
    return;
  }

  const existingAdmin = await User.findOne({ email: ADMIN_DEFAULT_EMAIL });

  if (existingAdmin) {
    if (!existingAdmin.isAdmin) {
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.info("Updated existing admin privileges for", ADMIN_DEFAULT_EMAIL);
    }
    return;
  }

  await User.create({
    username: ADMIN_DEFAULT_USERNAME || "Administrator",
    email: ADMIN_DEFAULT_EMAIL,
    phone: ADMIN_DEFAULT_PHONE || "0000000000",
    password: ADMIN_DEFAULT_PASSWORD,
    isAdmin: true,
  });

  console.info("Default admin account created for", ADMIN_DEFAULT_EMAIL);
};

// Connect to the database and start the server.
connectDb()
  .then(async () => {
    try {
      await ensureDefaultAdmin();
    } catch (error) {
      console.error("Failed to ensure default admin user", error);
    }

    app.listen(PORT, () => {
      console.log(`server is running at port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to start server", error);
  });
