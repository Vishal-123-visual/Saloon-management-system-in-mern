// controllers/categoryController.js

import categoryModel from "../models/category.js";


// ✅ Get all categories
export const listCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({ active: true }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};


// ✅ Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

// ✅ Create category
export const createCategory = async (req, res) => {
  try {
    // console.log(req.body)
    // console.log(req.file)
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
        success: false,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
        success: false,
      });
    }


    const image = req.file.path;

   
    // check duplicate
    const existing = await categoryModel.findOne({ name: name.trim(), active : true });
    if (existing) {
      return res.status(409).json({
        message: "Category with this name already exists",
        success: false,
      });
    }

    const category = await categoryModel.create({ name, image });

    res.status(201).json({
      message: "Category created successfully",
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

// ✅ Update category
export const updateCategory = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file?.path) {
      data.image = req.file.path;
    }

    const category = await categoryModel.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Category updated successfully",
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};


// ✅ Soft Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Category deleted successfully (soft delete)",
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

