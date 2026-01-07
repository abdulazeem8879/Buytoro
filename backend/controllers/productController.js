import product from "../models/product.js";

// @desc   Get all watches
// @route  GET /api/watches
export const getAllProducts = async (req, res, next) => {
  try {
    const watches = await product.find();
    res.json(watches);
  } catch (error) {
    next(error);
  }
};

// @desc   Get single watch
// @route  GET /api/watches/:id
export const getProductById = async (req, res, next) => {
  try {
    const singleWatch = await product.findById(req.params.id);

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
    console.log("FILE =>", req.file);

    const imageUrl = req.file?.path;
    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }

    const {
      name,
      brand,
      price,
      description,
      countInStock,
    } = req.body;

    const newWatch = await product.create({
      name,
      brand,
      price: Number(price),
      description,
      image: imageUrl,
      countInStock: Number(countInStock),
    });

    res.status(201).json(newWatch);
  } catch (error) {
    next(error);
  }
};


//    Update watch
export const updateProduct = async (req, res, next) => {
  try {
    const existingProduct = await product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    existingProduct.name = req.body.name || existingProduct.name;
    existingProduct.brand = req.body.brand || existingProduct.brand;
    existingProduct.price = req.body.price || existingProduct.price;
    existingProduct.description =
      req.body.description || existingProduct.description;
    existingProduct.image = req.body.image || existingProduct.image;
    existingProduct.countInStock =
      req.body.countInStock ?? existingProduct.countInStock;

    const updatedProduct = await existingProduct.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc   Delete watch

export const deleteProduct = async (req, res, next) => {
  try {
    const existingProduct = await product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await existingProduct.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    next(error);
  }
};
