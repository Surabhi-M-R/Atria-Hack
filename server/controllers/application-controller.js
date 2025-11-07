const Application = require('../models/application-model');
const path = require('path');
const fs = require('fs');

// Create application directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const submitApplication = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume' });
    }

    const { jobId, fullName, email, phone, coverLetter } = req.body;
    const userId = req.userId; // Assuming you have user ID in the request (from auth middleware)

    // Create a unique filename for the resume
    const resumeFileName = `${Date.now()}-${req.file.originalname}`;
    const resumePath = path.join(uploadDir, resumeFileName);

    // Move the file to the uploads directory
    await fs.promises.rename(req.file.path, resumePath);

    // Create new application
    const application = new Application({
      jobId,
      userId,
      fullName,
      email,
      phone,
      resume: `/uploads/resumes/${resumeFileName}`,
      coverLetter,
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: application
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    next(error);
  }
};

// Get all applications (for admin)
const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('jobId', 'jobTitle')
      .populate('userId', 'username email');
    
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

// Get applications for a specific job
const getApplicationsByJobId = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ jobId })
      .populate('userId', 'username email');
    
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

// Get applications for current user
const getMyApplications = async (req, res, next) => {
  try {
    const userId = req.userId; // Assuming you have user ID in the request
    const applications = await Application.find({ userId })
      .populate('jobId', 'jobTitle company');
    
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

// Update application status (for admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  getApplicationsByJobId,
  getMyApplications,
  updateApplicationStatus
};
