import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    // 🔐 Role
    isAdmin: {
      type: Boolean,
      default: false,
    },

    // 🖼 Profile Image (Cloudinary)
    profileImage: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    // ❤️ Wishlist (Product IDs)
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // 🟢 Account status
    isBlocked: {
      type: Boolean,
      default: false,
    },

    // ⏱ Last login time
    lastLogin: {
      type: Date,
    },

 // ===============================
    // 🔐 OTP VERIFICATION (NEW)
    // ===============================
    isVerified: {
      type: Boolean,
      default: false,
    },
    
    otp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },

resetPasswordToken: {
  type: String,
},

resetPasswordExpires: {
  type: Date,
},
isResetVerified: {
  type: Boolean,
  default: false,
},


  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
