import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Loading } from "../components/ui";
import axiosInstance from "../utils/axios";
import { useCart } from "../utils/CartContext";
import { toast } from "react-toastify";

const ProductPage = () => {
  const { id } = useParams();
  const { updateCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const hasDiscount =
    product?.discountedPrice && product.discountedPrice < product.price;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/product/${id}`);
        setProduct(response.data);
        setSelectedColor(response.data.colors?.[0] || "");
        setSelectedSize(response.data.sizes?.[0] || "");
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch product details");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const response = await axiosInstance.post("/cart", {
        productId: product._id,
        quantity,
        price: product.discountedPrice || product.price,
      });
      updateCart(response.data.items || []);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const normalizeColors = (colors) => {
    if (!colors) return [];

    return colors
      .map((color) => {
        // If color is already in correct format
        if (typeof color === "object" && color.name && color.value) {
          return color;
        }

        // If color is a string (hex value)
        if (typeof color === "string") {
          return {
            name: color,
            value: color,
          };
        }

        // If color is an array (handle the specific case)
        if (Array.isArray(color)) {
          const hexColor = color.join("");
          return {
            name: hexColor,
            value: `#${hexColor}`,
          };
        }

        return null;
      })
      .filter(Boolean);
  };

  if (loading) return <Loading />;
  if (!product)
    return (
      <div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Product Not Found</h1>
            <p className="text-gray-500">
              The product you are looking for does not exist.
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="relative w-full md:w-[500px] lg:w-[600px] mx-auto">
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
            {product.imagePath?.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`${product.name} - View ${index + 1}`}
                  className="w-full h-full object-contain "
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Info */}
        <div className="flex flex-col px-0 sm:px-4 lg:px-6">
          <h1 className="font-sf-heavy text-2xl sm:text-3xl">{product.name}</h1>
          <p className="mt-2 font-sf-light text-base sm:text-lg text-gray-700 dark:text-gray-400">
            {product.subtitle}
          </p>

          <div className="mt-4 sm:mt-6">
            {hasDiscount ? (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-400 line-through">
                  ${product.price}
                </span>
                <span className="text-2xl font-bold">
                  ${product.discountedPrice}
                </span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                  {product.discountPercentage}% OFF
                </span>
              </div>
            ) : (
              <p className="text-2xl font-bold mt-2">${product.price}</p>
            )}
          </div>

          <p className="mt-6 sm:mt-8 font-sf-light text-sm sm:text-base text-gray-700 dark:text-gray-400">
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
          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <h3 className="text-sm font-sf-semibold mb-3 sm:mb-4">SIZE</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border transition-all ${
                      selectedSize === size
                        ? "border-dark-primary dark:border-light-primary bg-neutral-100"
                        : "border-neutral-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mt-6 sm:mt-8">
            <h3 className="text-sm font-sf-semibold mb-3 sm:mb-4">QUANTITY</h3>
            <div className="flex items-center border border-neutral-200 w-fit">
              <button
                className="px-3 sm:px-4 py-2"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-4 sm:px-6 py-2 border-x border-neutral-200">
                {quantity}
              </span>
              <button
                className="px-3 sm:px-4 py-2"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCart}
            className="mb-12  mt-8 sm:mt-12 w-full bg-dark-secondary dark:bg-light-secondary text-light-secondary dark:text-dark-secondary py-3 sm:py-4 font-sf-medium tracking-wider"
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
      </div>
    </div>
  );
};

export default ProductPage;
