const User = require("../models/user-model");
const Contact = require("../models/contact-model");
const Blog = require("../models/blog-model");
const Career = require("../models/career-model");

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

const deleteCareerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Career.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Job posting not found" });
    }
    return res.status(200).json({ message: "Job posting deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
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
  deleteCareerById,
};
