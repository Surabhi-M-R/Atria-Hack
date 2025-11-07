const User = require("../models/user-model");
const Contact = require("../models/contact-model");

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

module.exports = {
  getAllUsers,
  getAllContacts,
  deleteUserById,
  getUserById,
  updateUserById,
  deleteContactById,
};
