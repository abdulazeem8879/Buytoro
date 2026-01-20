import Product from "../models/product.js"; // 👈 CAPITAL P
import cloudinary from "../config/cloudinary.js";

// @desc   Get all products
// @route  GET /api/products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc   Get single product
// @route  GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const singleproduct = await Product.findById(req.params.id);

    if (!singleproduct) {
      return res.status(404).json({ message: "product not found" });
    }

    res.json(singleproduct);
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
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.countInStock = req.body.countInStock ?? product.countInStock;

    // 🔥 IF new images uploaded
    if (req.files && req.files.length > 0) {
      // 1️⃣ delete old images
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      // 2️⃣ save new images (OBJECTS, not strings)
      product.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
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
