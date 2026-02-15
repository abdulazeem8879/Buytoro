
import crypto from 'crypto'
import User from "../models/user.js";
import { hashPasword, comparePassword } from "../auth/bcrypt.js";
import { generateToken } from "../auth/jwt.js";
import cloudinary from "../config/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";

import  dotenv  from "dotenv";

dotenv.config();

/* ===========================
   REGISTER USER (NO OTP)
   =========================== */



export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists && userExists.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    let user = userExists;

    if (!user) {
      const hashedPassword = await hashPasword(password);
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
      });
    }

    // 🔐 OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 2 * 60 * 1000;
    await user.save();

    // 📧 SEND OTP EMAIL
    await sendEmail({
      to: email,
      subject: "Your BuyToro OTP",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 2 minutes.</p>
      `,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    next(error);
  }
};





export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (hashedOtp !== user.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ VERIFY USER
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    /* 📧 WELCOME EMAIL (NON-BLOCKING) */
    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to BuyToro 🎉",
        html: `
          <h2>Welcome ${user.name} 👋</h2>
          <p>Your BuyToro account has been successfully verified.</p>
          <p>You can now login and start shopping.</p>
        `,
      });
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
      // ❗ ignore error
    }

    res.status(200).json({
      message: "Account verified successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "Account already verified" });
    }

    // 🔐 Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // ⏳ Overwrite OTP
    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 2 * 60 * 1000;
    await user.save();

    // 📧 Send OTP email
    await sendEmail({
      to: email,
      subject: "Your BuyToro OTP (Resent)",
      html: `
        <h2>OTP Verification</h2>
        <p>Your new OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 2 minutes.</p>
      `,
    });

    res.status(200).json({
      message: "OTP resent successfully",
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

    if (!user.isVerified) {
  return res
    .status(403)
    .json({ message: "Please verify your email first" });
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






export const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 📩 Email to Admin
    await sendEmail({
      to: process.env.EMAIL_USER, // your support email
      subject: "New Contact Message - BuyToro",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // 📩 Confirmation email to user
    await sendEmail({
      to: email,
      subject: "We received your message - BuyToro",
      html: `
        <h2>Thank you for contacting BuyToro</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and our team will get back to you soon.</p>
        <br/>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({
      message: "Message sent successfully",
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


// ===========================
// FORGOT PASSWORD (OTP)
// ===========================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3️⃣ Hash OTP
    const hashedOtp = await hashPasword(otp);

    // 4️⃣ Save hashed OTP + expiry (10 minutes)
    user.resetPasswordToken = hashedOtp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // 5️⃣ Send OTP via email
    await sendEmail({
  to: user.email,
  subject: "Password Reset OTP",
  html: `<h3>Your OTP for password reset is:</h3>
         <h2>${otp}</h2>
         <p>This OTP will expire in 10 minutes.</p>`
});


    res.status(200).json({ message: "Reset OTP sent to email" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ===========================
// VERIFY RESET OTP
// ===========================

export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.resetPasswordToken) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // 1️⃣ Check expiry
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 2️⃣ Compare OTP
    const isMatch = await comparePassword(
      otp,
      user.resetPasswordToken
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }


// ✅ Mark as verified
user.isResetVerified = true;
await user.save();

    res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ===========================
// RESET PASSWORD
// ===========================


export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

   if (
  !user ||
  !user.resetPasswordToken ||
  user.isResetVerified !== true
) {
  return res.status(400).json({ message: "Unauthorized request" });
}


    // Hash new password
    const hashedPassword = await hashPasword(newPassword);
    user.password = hashedPassword;

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.isResetVerified = false;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




/* ===========================
   DELETE ACCOUNT
   =========================== */
export const deleteAccount = async (req, res, next) => {
  try {
    const password = req.body?.password;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    if (user.profileImage?.public_id) {
      await cloudinary.uploader.destroy(user.profileImage.public_id);
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

/* ===========================
   WISHLIST
   =========================== */
export const toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const alreadyExists = user.wishlist.includes(productId);

  if (alreadyExists) {
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
  } else {
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












