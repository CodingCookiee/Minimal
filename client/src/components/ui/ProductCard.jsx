import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Loading } from "../../components/ui";
import axiosInstance from "../../utils/axios.js";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../utils/UserContext";
import { toast } from "react-toastify";
import { useCart } from "../../utils/CartContext";

const ProductCard = ({ product, viewType }) => {
  const { cartItems, updateCart } = useCart();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [imageLoading, setImageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const hasDiscount =
    product.discountedPrice && product.discountedPrice < product.price;

  const handleAddToCart = async () => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }

    try {
      const response = await axiosInstance.post("/cart", {
        productId: product._id,
        quantity: 1,
        price: product.discountedPrice || product.price,
      });
      updateCart(response.data.items || []);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const images = (
    (product.imagePath?.length ? product.imagePath : [product.image]) || []
  )
    .filter(Boolean)
    .map((url) => url.trim())
    .sort((a, b) => {
      const isProdA = a?.toLowerCase().includes("prod") || false;
      const isProdB = b?.toLowerCase().includes("prod") || false;
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
        {hasDiscount && (
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
            className={`aspect-[3/4] rounded-none overflow-hidden group/swiper 
      
        [&_.swiper-button-next]:text-white [&_.swiper-button-prev]:text-white 
        [&_.swiper-button-next]:bg-neutral-700 [&_.swiper-button-prev]:bg-neutral-700 
        [&_.swiper-button-next]:w-3 [&_.swiper-button-prev]:w-3 
        [&_.swiper-button-next]:h-12 [&_.swiper-button-prev]:h-12 
        [&_.swiper-button-next]:rounded-full [&_.swiper-button-prev]:rounded-full 
        [&_.swiper-button-next]:transition-opacity [&_.swiper-button-prev]:transition-opacity 
        [&_.swiper-button-next:after]:text-sm [&_.swiper-button-prev:after]:text-sm`}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <Loading  width="w-8"/>
                  </div>
                )}
                <Link to={`/product/${product._id}`}>
                  <img
                    src={image}
                    alt={`${product.title} - View ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onLoad={() => setImageLoading(false)}
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Product Info */}
      <div className={viewType === "grid" ? "mt-4" : "w-full"}>
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/product/${product._id}`}>
              <h3 className="font-sf-heavy text-md font-semibold text-dark-secondary dark:text-light-secondary">
                {product.name}
              </h3>
            </Link>
            <p className="font-sf-light text-sm text-gray-700 dark:text-gray-400">
              {product.subtitle}
            </p>
          </div>
          <div className="relative">
            {/* Price display logic */}
            <div className="flex items-center gap-2 font-sf-regular">
              {hasDiscount ? (
                <div className="flex flex-col">
                  <p className="text-gray-400 line-through">${product.price}</p>
                  <p className="font-sf-regular font-semibold">
                    ${product.discountedPrice}
                  </p>
                </div>
              ) : (
                <p className="font-sf-regular font-semibold">
                  ${product.price}
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="mt-2 font-sf-light text-sm text-gray-700 dark:text-gray-400">
          {product.description}
        </p>

        {/* Color Selection */}

        <div className="flex gap-2">
          {product.colors?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-sf-semibold font-semibold mb-2">
                COLORS
              </p>
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
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          className="mt-4 w-full bg-dark-secondary dark:bg-light-secondary text-light-secondary dark:text-dark-secondary py-2 font-sf-medium text-sm tracking-wider"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center"
            >
              <div className="h-5 w-5 border-2 border-white dark:border-black-200 border-t-transparent rounded-full animate-spin mr-2" />
              Adding to Cart ...
            </motion.div>
          ) : (
            <span className="flex items-center justify-center">
              Add to Cart
            </span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
