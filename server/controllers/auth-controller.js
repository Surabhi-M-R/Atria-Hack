const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

// *-------------------
// Home Logic
// *-------------------

const home = async (req, res) => {
  try {
    res
      .status(200)
      .send(
        "Welcome to world best mern series by thapa technical using router "
      );
  } catch (error) {
    console.log(error);
  }
};

// *-------------------------------
//* User Registration Logic 📝
// *-------------------------------
// 1. Get Registration Data: 📤 Retrieve user data (username, email, password).
// 2. Check Email Existence: 📋 Check if the email is already registered.
// 3. Hash Password: 🔒 Securely hash the password.
// 4. Create User: 📝 Create a new user with hashed password.
// 5. Save to DB: 💾 Save user data to the database.
// 6. Respond: ✅ Respond with "Registration Successful" or handle errors.

const register = async (req, res, next) => {
  try {
    const { username, email, phone, password } = req.body;

    // Check if a user with the given email already exists.
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "email already exists" });
    }

    // Create a new user with the provided details.
    // The password will be hashed automatically by the pre-save middleware in the User model.
    const userCreated = await User.create({
      username,
      email,
      phone,
      password,
    });

    // Respond with a success message, a JWT token, and the user's ID.
    res.status(201).json({
      msg: "registration successful",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    // Pass any errors to the error handling middleware.
    next(error);
  }
};

// *-------------------------------
//* User Login Logic 📝
// *-------------------------------

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email.
    const userExist = await User.findOne({ email });

    // If the user does not exist, return an error.
    if (!userExist) {
      return res.status(400).json({ message: "Invalid Credentials " });
    }

    // Compare the provided password with the hashed password in the database.
    const isPasswordValid = await userExist.comparePassword(password);

    if (isPasswordValid) {
      // If the password is valid, respond with a success message, a JWT token, and the user's ID.
      res.status(200).json({
        msg: "Login Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      // If the password is not valid, return an error.
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    // Pass any errors to the error handling middleware.
    next(error);
  }
};

// *-------------------------------
//* to send user data - User Logic 📝
// *-------------------------------

const user = async (req, res, next) => {
  try {
    // The user data is attached to the request object by the authMiddleware.
    const userData = req.user;
    return res.status(200).json({ userData });
  } catch (error) {
    // Pass any errors to the error handling middleware.
    next(error);
  }
};

module.exports = { home, register, login, user };
