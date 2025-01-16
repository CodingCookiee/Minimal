import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BsGrid3X3GapFill, BsListUl } from "react-icons/bs";
import { menCategories } from "../../../constants/menCategories";
import { ProductCard, Loading } from "../../../components/ui";

const MenJeansPage = () => {
  const [viewType, setViewType] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary">
      {/* Header Section */}
      <div className="px-6 sm:px-12 lg:px-20 pt-24">
        <h1 className="mt-10 font-sf-heavy text-3xl sm:text-4xl lg:text-5xl text-dark-primary dark:text-light-primary">
          Men&apos;s Jeans Collection
        </h1>
      </div>

      {/* View Toggle */}
      <div className="px-6 sm:px-12 lg:px-20 py-8">
        <div className="flex items-center justify-end">
          <div className="flex gap-4">
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
          {menCategories.jeans.map((product, index) => (
            <ProductCard
              key={`jeans-${product.title}-${index}`}
              product={product}
              viewType={viewType}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenJeansPage;
