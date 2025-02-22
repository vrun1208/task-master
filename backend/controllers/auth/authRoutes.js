// const cookieParser = require("cookie-parser");

const express = require("express");
const server = express();
// server.use(cookieParser());
const bcrypt = require("bcrypt");
const User = require("../../models/userSchema");

// register
const registerUser = async (req, res, next) => {
  try {
    const { email, password, confirmPassword, timeZone } = req.body;

    // check if any field is missing or not
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      throw new Error("Missing email or password");
    }

    // check if user have enterd the correct password or not
    if (password !== confirmPassword) {
      throw new Error("Password and confirm password does not match");
    }

    /**
     * check if email is already present to not
     */

    const isAlreadyPresentEmail = await User.find({ email });
    if (isAlreadyPresentEmail.email) {
      throw new Error("Email is already exists");
    }

    // generate hash password with round 10
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email: email,
      password: hashPassword,
      timeZone: timeZone,
    });

    // before saving the user create the toke
    const token = await user.generateAuthToken();

    // setting token as a cookie
    // res.cookie("Todo", token, { httpOnly: true });

    // create user
    await user.save();
    res.status(200).json({ user, token });
  } catch (error) {
    if (error.message.includes("email already exists.")) {
      error.message = "Email already exists";
    }

    next(error);
  }
};

// login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check if user already register or not because only register user can log in
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid login detail");
    }
    // check if provided password by user is same as stored in data
    const getPassword = user.password;

    // verify password first pass user created password and then pass stored password
    const verifyPassword = await bcrypt.compare(password, getPassword);

    if (!verifyPassword) {
      throw new Error("Invalid login detail");
    }

    // generate token once user have correct credentials
    const token = await user.generateAuthToken();

    // setting token as a cookie
    // res.cookie("Todo", token, { httpOnly: true, secure: true });

    // is all okay send user back data
    if (user) {
      res.status(201).json({ user, token });
    }
  } catch (error) {
    next(error);
  }
};

// logout page
const logout = async (req, res, next) => {
  try {
    const userId = req?.body?.userId;
    const getUserFromDB = await User.findOne({ _id: userId });
    // updating token
    getUserFromDB.token = "";

    // saving user to database after updatig the token
    await getUserFromDB.save();
    res.status(202).json({ message: "successfully logged out" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logout,
};
