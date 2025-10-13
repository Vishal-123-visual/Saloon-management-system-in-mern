import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Register Admin or Staff
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name ||  !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        error: true,
      });
    }

    // if (!["admin", "staff"].includes(role)) {
    //   return res.status(400).json({
    //     message: "This role is not allowed",
    //     success: false,
    //     error: true,
    //   });
    // }

    const exists = await User.findOne({ phone });
    if (exists) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
        error: true,
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, phone, password: hashed, role });
    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      error: false,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false, error: true });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        error: true,
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false, error: true });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false, error: true });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES  }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_EXPIRES || "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      error: false,
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false, error: true });
  }
};

// Current user
export const getCurrentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: true, message: err.message });
  }
};

// Get user by id
export const getUserDetails = async (req, res) => {
  try {
    const {id} = req.params
    const users = await User.findById(id).select("-password -refreshToken");
    if (!users) {
      return res.status(404).json({
        message: "Users not found",
        success: false,
        error: true,
      });
    }
    return res.status(200).json({
      message: "All users",
      success: true,
      error: false,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};
// Get all users
export const allUser = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    if (!users) {
      return res.status(404).json({
        message: "Users not found",
        success: false,
        error: true,
      });
    }
    return res.status(200).json({
      message: "All users",
      success: true,
      error: false,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};


// update user by id
export const updateUser = async (req, res) => {
  try {
    const {id}= req.params;

    const users = await User.findByIdAndUpdate(id,req.body,{new : true}).select("-password -refreshToken");
    if (!users) {
      return res.status(404).json({
        message: "Users not found",
        success: false,
        error: true,
      });
    }
    return res.status(200).json({
      message: " user updated",
      success: true,
      error: false,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};
// delete user by id
export const deleteUser = async (req, res) => {
  try {
    const {id}= req.params;

    const users = await User.findByIdAndDelete(id);
    if (!users) {
      return res.status(404).json({
        message: "Users not found",
        success: false,
        error: true,
      });
    }
    return res.status(200).json({
      message: " user deleted",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

// Refresh token
export const refreshTokenController = async (req, res) => {
  try {
    const { token: incomingRefreshToken } = req.body;

    if (!incomingRefreshToken) {
      return res
        .status(401)
        .json({ message: "Your are not loged In  ,Refresh token required", success: false });
    }

    jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_SECRET,
      async (err, decoded) => {
        if (err)
          return res
            .status(403)
            .json({ message: "Invalid refresh token", success: false });

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== incomingRefreshToken) {
          return res
            .status(403)
            .json({ message: "Refresh token not valid", success: false });
        }

        const newAccessToken = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES  }
        );

        res.json({
          success: true,
          token: newAccessToken,
          refreshToken: user.refreshToken, // keep same refresh token
        });
      }
    );
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: err.message, success: false });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.json({ message: "Logged out successfully", success: true });
  } catch (err) {
    res
      .status(500)
      .json({ message:err.message, error:true , success: false });
  }
};
