import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

  images: [
  {
    type: String,
    required: true,
  },
],

    inStock: {
      type: Boolean,
      default: true,
    },

    countInStock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const product = mongoose.model("Product", productSchema);

export default product;
