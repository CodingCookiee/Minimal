import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Loading } from "../../components/ui";

const ProductCard = ({ product, viewType }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const uniqueId = `swiper-${product.title.replace(/\s+/g, "-").toLowerCase()}`;

  const [showNextButton, setShowNextButton] = useState(true);
  const [showPrevButton, setShowPrevButton] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const sortedImages = [...product.imagePath].sort((a, b) => {
    const isProdA = a.includes("prod") || a.includes("hmgoepprod");
    const isProdB = b.includes("prod") || b.includes("hmgoepprod");
    return isProdB - isProdA;
  });

  const cardStyles =
    viewType === "grid"
      ? "flex flex-col"
      : "flex flex-col gap-5 lg:w-2/3 lg:mx-auto";

  return (
    <motion.div
      className={`group ${cardStyles} bg-white dark:bg-gray-900 p-4 rounded-none`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        {product.discountPercentage && (
          <span className="absolute top-2.5 right-2.5 px-4 py-1.5 text-xs font-sf-medium text-light-primary bg-red-700 rounded z-10">
            -{product.discountPercentage}
          </span>
        )}

        {/* Image Carousel */}
        <div className={viewType === "grid" ? "w-full" : "w-full "}>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            containerModifierClass={uniqueId}
            onSlideChange={(swiper) => {
              setShowPrevButton(!swiper.isBeginning);
              setShowNextButton(!swiper.isEnd);
            }}
            className={`aspect-[3/4] rounded-none overflow-hidden group/swiper 
        ${showPrevButton ? "[&_.swiper-button-prev]:!opacity-100" : "[&_.swiper-button-prev]:!opacity-0"}
        ${showNextButton ? "[&_.swiper-button-next]:!opacity-100" : "[&_.swiper-button-next]:!opacity-0"}
        [&_.swiper-button-next]:text-white [&_.swiper-button-prev]:text-white 
        [&_.swiper-button-next]:bg-neutral-700 [&_.swiper-button-prev]:bg-neutral-700 
        [&_.swiper-button-next]:w-3 [&_.swiper-button-prev]:w-3 
        [&_.swiper-button-next]:h-12 [&_.swiper-button-prev]:h-12 
        [&_.swiper-button-next]:rounded-full [&_.swiper-button-prev]:rounded-full 
        [&_.swiper-button-next]:transition-opacity [&_.swiper-button-prev]:transition-opacity 
        [&_.swiper-button-next:after]:text-sm [&_.swiper-button-prev:after]:text-sm`}
          >
            {sortedImages.map((image, index) => (
              <SwiperSlide key={index}>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <Loading />
                  </div>
                )}
                <img
                  src={image}
                  alt={`${product.title} - View ${index + 1}`}
                  className="w-full h-full object-cover"
                  onLoad={() => setImageLoading(false)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Product Info */}
      <div className={viewType === "grid" ? "mt-4" : "w-full"}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-sf-heavy text-md font-semibold text-dark-secondary dark:text-light-secondary">
              {product.title}
            </h3>
            <p className="font-sf-light text-sm text-gray-700 dark:text-gray-400">
              {product.subtitle}
            </p>
          </div>
          <div className="text-right">
            {product.discountedPrice ? (
              <>
                <span className="block text-sm line-through text-gray-500">
                  {product.price}
                </span>
                <span className="font-sf-medium text-lg text-neutral-900">
                  {product.discountedPrice}
                </span>
              </>
            ) : (
              <span className="font-sf-medium text-lg">{product.price}</span>
            )}
          </div>
        </div>

        <p className="mt-2 font-sf-light text-sm text-gray-700 dark:text-gray-400">
          {product.description}
        </p>

        {/* Color Selection */}
        <div className="mt-4">
          <p className="text-xs font-sf-semibold font-semibold mb-2">COLORS</p>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedColor === color
                    ? "border-dark-primary dark:border-light-primary"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          className="mt-4 w-full bg-dark-secondary dark:bg-light-secondary text-light-secondary dark:text-dark-secondary py-2 font-sf-medium text-sm tracking-wider"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
