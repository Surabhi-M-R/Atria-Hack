const User = require("../models/user-model");
const Contact = require("../models/contact-model");
const Blog = require("../models/blog-model");
const Career = require("../models/career-model");
const { sendWelcomeEmail } = require("../utils/emailService");

// *-------------------------------
//* getAllUsers Logic 📝
// *-------------------------------
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { password: 0 });
    console.log(users);
    return res.status(200).json(users ?? []);
  } catch (error) {
    next(error);
  }
};

// *-------------------------------
//* createUser Logic 📝 (Admin creates new user)
// *-------------------------------
const createUser = async (req, res, next) => {
  try {
    const { username, email, phone, password, isAdmin } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    // Check if a user with the given email already exists
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create a new user with the provided details
    const userCreated = await User.create({
      username,
      email,
      phone: phone || "0000000000",
      password,
      isAdmin: isAdmin || false,
    });

    // Send welcome email to the newly created user
    let emailStatus = { sent: false, error: null };
    try {
      console.log(`📧 [Admin] Attempting to send welcome email to ${email}...`);
      const emailResult = await sendWelcomeEmail(email, username);
      if (!emailResult.success) {
        console.error(
          "❌ [Admin] Failed to send welcome email:",
          emailResult.error
        );
        console.error("Error code:", emailResult.code);
        console.error("Response code:", emailResult.responseCode);
        if (emailResult.details) {
          console.error("Error details:", emailResult.details);
        }
        emailStatus = {
          sent: false,
          error: emailResult.error,
          code: emailResult.code,
          missingVars: emailResult.missingVars,
        };
      } else {
        console.log("✅ [Admin] Welcome email sent successfully to:", email);
        emailStatus = { sent: true, messageId: emailResult.messageId };
      }
    } catch (emailError) {
      console.error("❌ [Admin] Error sending welcome email:", emailError);
      console.error("Error stack:", emailError.stack);
      emailStatus = {
        sent: false,
        error: emailError.message,
        code: emailError.code,
      };
    }

    // Return user data (without password) and email status
    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: userCreated._id,
        username: userCreated.username,
        email: userCreated.email,
        phone: userCreated.phone,
        isAdmin: userCreated.isAdmin,
      },
      emailStatus: emailStatus,
    });
  } catch (error) {
    next(error);
  }
};

// *-------------------------------
//* single user Logic 📝
// *-------------------------------

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await User.findOne({ _id: id }, { password: 0 });
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// *-------------------------------
//* user update Logic 📝
// *-------------------------------

const updateUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedUserData = req.body;

    const updatedData = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: updatedUserData,
      },
      { new: true, projection: { password: 0 } }
    );
    if (!updatedData) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(updatedData);
  } catch (error) {
    next(error);
  }
};

// *-------------------------------
//* user delete Logic 📝
// *-------------------------------

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (req.user && req.user._id.toString() === id) {
      return res
        .status(400)
        .json({ message: "Admins cannot delete their own account" });
    }

    const result = await User.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

// *-------------------------------
//* getAllContacts Logic 📝
// *-------------------------------
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    console.log(contacts);
    return res.status(200).json(contacts ?? []);
  } catch (error) {
    next(error);
  }
};

// *-------------------------------
//* contacts delete Logic 📝
// *-------------------------------

const deleteContactById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Contact.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.status(200).json({ message: "Contact Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

// *-------------------------------
//* Blog Management Logic 📝
// *-------------------------------

const createBlog = async (req, res, next) => {
  try {
    const payload = req.body;
    const blog = await Blog.create(payload);
    return res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
};

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json(blogs ?? []);
  } catch (error) {
    next(error);
  }
};

const deleteBlogById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Blog.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    return res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// *-------------------------------
//* Career Management Logic 📝
// *-------------------------------

const createCareer = async (req, res, next) => {
  try {
    const payload = req.body;
    const job = await Career.create(payload);
    return res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

const getAllCareers = async (req, res, next) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    return res.status(200).json(careers ?? []);
  } catch (error) {
    next(error);
  }
};

const getCareerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const job = await Career.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job posting not found" });
    }
    return res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

const deleteCareerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Career.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Job posting not found" });
    }
    return res
      .status(200)
      .json({ message: "Job posting deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getAllContacts,
  deleteUserById,
  getUserById,
  updateUserById,
  deleteContactById,
  createBlog,
  getAllBlogs,
  deleteBlogById,
  createCareer,
  getAllCareers,
  getCareerById,
  deleteCareerById,
};
