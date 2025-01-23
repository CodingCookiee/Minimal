import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Button, ImageDropzone, LoadingDots } from "../ui";
import { motion } from "framer-motion";
import { X, BookType, DollarSign, ChartBarStacked, Blend } from "lucide-react";
import { isPrimaryAdmin } from "../../utils/checkAdmin.js";
import { useUser } from "../../utils/UserContext";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";

const ProductForm = ({ categoryData }) => {
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [customColor, setCustomColor] = useState({
    name: "",
    value: "#000000",
  });
  const initialFormState = {
    name: "",
    subtitle: "",
    description: "",
    price: "",
    discountedPrice: "",
    discountPercentage: "",
    category: "",
    stock: "",
    gender: "",
    colors: [],
    sizes: [],
    image: null,
    imagePath: [],
  };
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState({
    name: "",
    subtitle: "",
    description: "",
    price: "",
    stock: "",
    gender: "",
    category: "",
    image: [],
    colors: [],
    sizes: [],
  });

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleReset = () => {
    setFormData(initialFormState);
    setImages([]);
    setCustomColor({ name: "", value: "#000000" });
    setError({});
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name) {
      errors.name = "Product name is required";
    }
    if (!formData.description) {
      errors.description = "Product description is required";
    }
    if (!formData.subtitle) {
      errors.subtitle = "Product subtitle is required";
    }
    if (!formData.price || formData.price <= 0) {
      errors.price = "Invalid price value";
    }
    if (formData.discountedPrice && formData.discountedPrice <= 0) {
      errors.discountedPrice = "Invalid discounted price value";
    }
    if (!formData.category) {
      errors.category = "Product category is required";
    }
    if (!formData.gender) {
      errors.gender = "Select a gender";
    }
    if (!formData.stock || formData.stock <= 0) {
      errors.stock = "Invalid stock value";
    }
    if (!formData.gender) {
      errors.ender = "Gender is required";
    }
    if (images.length === 0) {
      errors.image = "Product image is required";
    }

    if (formData.colors.length === 0) {
      errors.colors = "At least one color must be selected";
    }

    if (formData.sizes.length === 0) {
      errors.sizes = "At least one size must be selected";
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "gender" && { category: "" }),
    }));
    if (error[name]) {
      setError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = useCallback((acceptedFiles) => {
    setImages((prevImages) => [
      ...prevImages,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          originalName: file.name.toLowerCase(),
        }),
      ),
    ]);

    if (acceptedFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: acceptedFiles[0],
        imagePath: acceptedFiles.map((file) => URL.createObjectURL(file)),
      }));
    }
  }, []);

  const handleImageRemove = useCallback((index) => {
    setImages((prevImages) => {
      const newImages = prevImages.filter((_, i) => i !== index);
      // Update formData.image if all images are removed
      if (newImages.length === 0) {
        setFormData((prev) => ({
          ...prev,
          image: null,
          imagePath: [],
        }));
      }
      return newImages;
    });
  }, []);

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleAddCustomColor = () => {
    if (customColor.name && customColor.value) {
      setFormData((prev) => ({
        ...prev,
        colors: [
          ...prev.colors,
          {
            name: customColor.name,
            value: customColor.value,
          },
        ],
      }));
      setCustomColor({ name: "", value: "#000000" });
    }
  };
  const handleRemoveColor = (colorToRemove) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter(
        (color) => color.value !== colorToRemove.value,
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const transformedData = {
        ...formData,
        colors: formData.colors.map((color) => color.value),
      };

      const imagePromises = images.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                data: reader.result,
                originalName: file.name.toLowerCase(),
                type: file.type,
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }),
      );

      const processedImages = await Promise.all(imagePromises);

      await axiosInstance.post("/product", {
        ...transformedData,
        images: processedImages,
        totalImages: processedImages.length,
      });

      toast.success("Product created successfully");
      handleReset(); // Reset form after successful submission
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-start gap-1  mb-4 ">
          <BookType className="w-4 h-4 " />
          <h3 className="text-lg font-sf-heavy ">Basic Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-sf-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                error.name ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {error.name && (
              <small className="text-red-500 text-sm mt-1">{error.name}</small>
            )}
          </div>
          <div>
            <label className="block text-sm font-sf-medium mb-2">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                error.subtitle ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {error.subtitle && (
              <small className="text-red-500 text-sm mt-1">
                {error.subtitle}
              </small>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-sf-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              name="description"
              onChange={handleChange}
              className={`w-full p-2 border rounded-md h-32 ${
                error.description ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {error.description && (
              <small className="text-red-500 text-sm mt-1">
                {error.description}
              </small>
            )}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-start gap-1 mb-4 ">
          <DollarSign className="w-4 h-4" />
          <h3 className="text-lg font-sf-heavy">Pricing</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-sf-medium mb-2">Price</label>
            <input
              type="number"
              value={formData.price}
              name="price"
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                error.price ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {error.price && (
              <small className="text-red-500 text-sm mt-1">{error.price}</small>
            )}
          </div>
          <div>
            <label className="block text-sm font-sf-medium mb-2">
              Discounted Price
            </label>
            <input
              type="number"
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                error.discountedPrice ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {error.discountedPrice && (
            <small className="text-red-500 text-sm mt-1">
              {error.discountedPrice}
            </small>
          )}
          <div>
            <label className="block text-sm font-sf-medium mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                error.stock ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {error.stock && (
              <small className="text-red-500 text-sm mt-1">{error.stock}</small>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-start gap-1 mb-4 ">
          <ChartBarStacked className="w-4 h-4" />
          <h3 className="text-lg font-sf-heavy">Categorization</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-sf-medium mb-2">
              Gender/Category
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-4"
              required
            >
              <option value="">Select Category</option>
              {Object.keys(categoryData).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {formData.gender && (
            <div>
              <label className="block text-sm font-sf-medium mb-2">
                Subcategory
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Subcategory</option>
                {Object.entries(categoryData[formData.gender] || {}).map(
                  ([key, value]) => (
                    <option key={key} value={`${formData.gender}_${key}`}>
                      {value}
                    </option>
                  ),
                )}
              </select>
            </div>
          )}
        </div>
      </div>
      {/* Colors and Sizes */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-start gap-1 mb-4 ">
          <Blend className="w-4 h-4" />
          <h3 className="text-lg font-sf-heavy">Color&Sizes</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-sm font-sf-medium mb-2 mt-2.5">
              Colors
            </label>
            {/* Color Input */}
            <div className="flex items-center gap-2 ">
              <input
                type="text"
                placeholder="Color name"
                value={customColor.name}
                onChange={(e) =>
                  setCustomColor((prev) => ({ ...prev, name: e.target.value }))
                }
                className="flex-1 p-2 border rounded-md text-sm"
              />
              <input
                type="color"
                value={customColor.value}
                onChange={(e) =>
                  setCustomColor((prev) => ({ ...prev, value: e.target.value }))
                }
                className="w-12 h-8 rounded cursor-pointer"
              />
              <button
                type="button"
                onClick={handleAddCustomColor}
                disabled={!customColor.name}
                className="px-3 py-2 bg-gray-100 rounded-md text-sm font-sf-medium hover:bg-gray-200 disabled:opacity-50"
              >
                Add
              </button>
            </div>
            {/* Selected Colors */}
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color, index) => (
                <div
                  key={index}
                  className="mt-2.5 flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                >
                  <span
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-sm">{color.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(color)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {error.colors && (
                <small className="text-red-500 text-sm mt-1">
                  {error.colors}
                </small>
              )}
            </div>
          </div>
          {/* Sizes */}
          <div className="bg-white  rounded-lg shadow-sm">
            <h3 className="text-md font-sf-medium mb-2">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 rounded-md border ${
                    formData.sizes.includes(size)
                      ? "bg-dark-primary text-white"
                      : "bg-white text-dark-primary"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {error.sizes && (
              <small className="text-red-500 text-sm mt-1">{error.sizes}</small>
            )}
          </div>

          <div></div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="">
        <ImageDropzone
          onImageUpload={handleImageUpload}
          images={images}
          onImageRemove={handleImageRemove}
        />
        {error.image && (
          <small className="text-red-500 text-sm mt-1">{error.image}</small>
        )}
      </div>
      {/* Submit Button */}

      <div className="flex justify-center items-center">
        <Button
          disabled={!isPrimaryAdmin(currentUser)}
          type="submit"
          className=" w-2/3 py-5 bg-dark-primary text-light-primary hover:bg-light-primary
           hover:text-dark-primary border border-dark-primary transition-all duration-300 font-sf-medium disabled:opacity-50"
        >
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2"
            >
              <span>Creating</span>
              <LoadingDots />
            </motion.div>
          ) : (
            <span className="flex items-center justify-center">
              Create Product
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
