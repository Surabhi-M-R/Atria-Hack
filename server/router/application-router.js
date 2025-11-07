const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { submitApplication, getAllApplications, getApplicationsByJobId, getMyApplications, updateApplicationStatus } = require('../controllers/application-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const { authorizeRoles } = require('../middlewares/authorize-roles');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/resumes'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const extname = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .doc, and .docx files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Submit application (requires authentication)
router.post('/', upload.single('resume'), (req, res, next) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a resume' });
  }
  next();
}, submitApplication);

// Protected routes (admin only)
router.get('/', authorizeRoles('admin'), getAllApplications);
router.get('/job/:jobId', authorizeRoles('admin'), getApplicationsByJobId);
router.patch('/:id/status', authorizeRoles('admin'), updateApplicationStatus);

// Get applications for current user
router.get('/my-applications', getMyApplications);

module.exports = router;
