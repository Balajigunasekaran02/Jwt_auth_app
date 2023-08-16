const userModel = require("../models/userModel.js");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");

//-------------------------SIGN UP------------------------------------------------------------
const signUp = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Every Field Required",
      });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }

    let isValidEmail = emailValidator.validate(email);
    if (!isValidEmail) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid email",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password & Confirm Password Does not match",
      });
    }
    const userInfo = userModel(req.body);
    const result = await userInfo.save();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//---------------------SIGN IN ----------------------------------------------------------------

const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Every Field Required",
    });
  }

  try {
    const user = await userModel.findOne({ email }).select("+password");
    console.log(user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = user.jwtToken();
    user.password = undefined;

    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };

    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//--------------------------------GET USERS -----------------------------------------------------
const getUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await userModel.findById(userId);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//-----------------LOG OUT-----------------------------------

const logOut = (req, res) => {
  try {
    const cookieOptions = {
      expires: new Date(),
      httpOnly: true,
    };
    res.cookie("token", null, cookieOptions);
    return res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { signUp, signIn, getUser, logOut };
