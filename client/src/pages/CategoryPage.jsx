import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BsGrid3X3GapFill, BsListUl } from "react-icons/bs";
import { menCategories, womenCategories, saleCategories } from "../constants";
import { ProductCard, Loading } from "../components/ui";
import axiosInstance from "../utils/axios";

const CategoryPage = () => {
  const { categoryname } = useParams();
  const [viewType, setViewType] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(categoryname || "men");
  const [activeSubCategory, setActiveSubCategory] = useState("");
  const normalizedCategory = categoryname === "sale" ? "sales" : categoryname;

  const categoryData = {
    men: menCategories,
    women: womenCategories,
    sales: saleCategories,
  };

  const categoryTitles = {
    men: "Men's Collection",
    women: "Women's Collection",
    sales: "Sale & Clearance",
  };

  useEffect(() => {
    setActiveCategory(categoryname || "men");
    const initialSubCategory =
      categoryname && categoryData[normalizedCategory]
        ? Object.keys(categoryData[normalizedCategory])[0]
        : "jeans";
    setActiveSubCategory(initialSubCategory);

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/product/${categoryname}/${initialSubCategory}`,
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, [categoryname]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/product/${categoryname}/${activeSubCategory}`,
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, [activeSubCategory]);

  if (isLoading) {
    return <Loading />;
  }

  const subCategories = categoryData[normalizedCategory] || {};
  const categoryTitle = categoryTitles[activeCategory] || "Collection";

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary">
      <div className="px-6 sm:px-12 lg:px-20 pt-24">
        <h1 className="mt-10 font-sf-heavy text-3xl sm:text-4xl lg:text-5xl text-dark-primary dark:text-light-primary">
          {categoryTitle}
        </h1>
      </div>

      {/* Subcategory Navigation */}
      <div className="px-6 sm:px-12 lg:px-20 py-4">
        <div className="flex gap-6">
          {Object.keys(subCategories).map((subCategory) => (
            <motion.button
              key={subCategory}
              onClick={() => setActiveSubCategory(subCategory)}
              className={`text-sm tracking-wider font-sf-medium ${
                activeSubCategory === subCategory
                  ? "text-light-primary bg-neutral-900 py-1 px-2.5"
                  : "text-gray-400 bg-neutral-900 py-1 px-2.5"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {subCategory.toUpperCase()}
            </motion.button>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div className="px-6 sm:px-12 lg:px-20 py-8">
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => setViewType("grid")}
            className={`p-2 rounded ${
              viewType === "grid"
                ? "bg-dark-primary dark:bg-light-primary text-light-primary dark:text-dark-primary"
                : "text-dark-primary dark:text-light-primary"
            }`}
          >
            <BsGrid3X3GapFill />
          </button>
          <button
            onClick={() => setViewType("list")}
            className={`p-2 rounded ${
              viewType === "list"
                ? "bg-dark-primary dark:bg-light-primary text-light-primary dark:text-dark-primary"
                : "text-dark-primary dark:text-light-primary"
            }`}
          >
            <BsListUl />
          </button>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="px-6 sm:px-12 lg:px-20 pb-20">
        <div
          className={`
          ${
            viewType === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }
        `}
        >
          {products.map((product, index) => (
            <ProductCard
              key={`${activeSubCategory}-${product.title}-${index}`}
              product={product}
              viewType={viewType}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
