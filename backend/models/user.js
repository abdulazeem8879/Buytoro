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

    // 🟢 Account status
    isBlocked: {
      type: Boolean,
      default: false,
    },

    // ⏱ Last login time
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

const User = mongoose.model("User", userSchema);
export default User;
