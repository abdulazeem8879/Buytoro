import Product from "../models/product.js"; // 👈 CAPITAL P
import { getPublicId } from "../utils/cloudinaryHelpers.js";

// @desc   Get all watches
// @route  GET /api/watches
export const getAllProducts = async (req, res, next) => {
  try {
    const watches = await Product.find();
    res.json(watches);
  } catch (error) {
    next(error);
  }
};

// @desc   Get single watch
// @route  GET /api/watches/:id
export const getProductById = async (req, res, next) => {
  try {
    const singleWatch = await Product.findById(req.params.id);

    if (!singleWatch) {
      return res.status(404).json({ message: "Watch not found" });
    }

    res.json(singleWatch);
  } catch (error) {
    next(error);
  }
};




export const createProduct = async (req, res, next) => {
  try {
    const { name, brand, price, description, countInStock } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    if (!brand) {
      return res.status(400).json({ message: "Brand is required" });
    }

    // ✅ FIX: images as objects
    const images = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename, // cloudinary public_id
    }));

    const newProduct = await Product.create({
      name,
      brand,
      price: Number(price),
      description,
      countInStock: Number(countInStock),
      images,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};



//    Update watch
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand; // ✅ ADD THIS
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.countInStock =
      req.body.countInStock ?? product.countInStock;

  // 🔥 IF new images uploaded
if (req.files && req.files.length > 0) {

  // 1️⃣ delete old images from cloudinary
  for (const img of product.images) {
    const publicId = getPublicId(img);
    await cloudinary.uploader.destroy(publicId);
  }

  // 2️⃣ save new images
  product.images = req.files.map((file) => file.path);
}


    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};


// @desc   Delete watch

export const deleteProduct = async (req, res, next) => {
  try {
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await existingProduct.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    next(error);
  }
};
