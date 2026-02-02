import User from "../models/user.js";
import { hashPasword, comparePassword } from "../auth/bcrypt.js";
import { generateToken } from "../auth/jwt.js";
import cloudinary from "../config/cloudinary.js";

/* ===========================
   REGISTER USER
   =========================== */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPasword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================
   LOGIN USER
   =========================== */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: "Account is blocked" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      message: "Login successful",
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================
   GET USER PROFILE
   =========================== */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/* ===========================
   UPDATE PROFILE
   =========================== */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.file) {
      if (user.profileImage?.public_id) {
        await cloudinary.uploader.destroy(
          user.profileImage.public_id
        );
      }

      user.profileImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      profileImage: updatedUser.profileImage,
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================
   CHANGE PASSWORD
   =========================== */
export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(
      oldPassword,
      user.password
    );
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Old password is incorrect" });
    }

    user.password = await hashPasword(newPassword);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

/* ===========================
   DELETE ACCOUNT
   =========================== */
export const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profileImage?.public_id) {
      await cloudinary.uploader.destroy(
        user.profileImage.public_id
      );
    }

    await user.deleteOne();

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/* ===========================
   ADMIN – GET ALL USERS
   =========================== */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};



export const toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const alreadyExists = user.wishlist.includes(productId);

  if (alreadyExists) {
    // remove
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
  } else {
    // add
    user.wishlist.push(productId);
  }

  await user.save();

  res.json({
    wishlist: user.wishlist,
    message: alreadyExists
      ? "Removed from wishlist"
      : "Added to wishlist",
  });
};




export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user.wishlist);
};

