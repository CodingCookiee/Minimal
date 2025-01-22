import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  UserRound,
  ShoppingBag,
  X,
  ChevronDown,
} from "lucide-react";
import { RiAdminLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axios.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../utils/UserContext";
import { useCart } from "../../utils/CartContext";

const Header = () => {
  const { cartCount, updateCart } = useCart();
  const { currentUser, updateUser } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const isAdmin = currentUser?.role === "admin";

  const menCategories = {
    shirts: "Shirts",
    jeans: "Jeans",
  };

  const womenCategories = {
    shirts: "Shirts",
    jeans: "Jeans",
    trousers: "Trousers",
  };

  const saleCategories = {
    women: "Women",
    men: "Men",
  };

  const categories = [
    {
      name: "Men",
      subcategories: Object.keys(menCategories),
    },
    {
      name: "Women",
      subcategories: Object.keys(womenCategories),
    },
  ];

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      try {
        const response = await axiosInstance.get(`/product/search?q=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && !event.target.closest(".search-container")) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (currentUser) {
        try {
          const response = await axiosInstance.get("/cart");
          updateCart(response.data.items || []);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }
    };
    fetchCartItems();
  }, [currentUser]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!currentUser || !currentUser.expiresAt) return;

      const checkExpiration = () => {
        const currentTime = new Date().getTime();
        if (currentTime >= currentUser.expiresAt) {
          const notificationShown = localStorage.getItem(
            "expiredNotificationShown",
          );

          if (!notificationShown) {
            toast.info("Session expired. Please sign in again.");
            localStorage.setItem("expiredNotificationShown", "true");
          }

          updateUser(null);
          setIsProfileOpen(false);
          navigate("/");
        }
      };

      checkExpiration();
      const interval = setInterval(checkExpiration, 60000);

      return () => clearInterval(interval);
    };

    checkTokenExpiration();
  }, [currentUser, navigate, updateUser]);

  const handleSignOut = async () => {
    try {
      await axiosInstance.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      updateUser(null);
      setIsProfileOpen(false);
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="fixed w-full top-0 z-50 px-3 sm:px-6 py-4 bg-transparent">
      <nav className="flex items-center justify-between px mx-auto">
        <div className="flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 sm:p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link
            to="/"
            className="ml-3 flex items-center absolute left-12 top-2.5"
          >
            <img
              src="/brand-name.svg"
              alt="Logo"
              className="lg:h-20 md:h-16 h-12"
            />
          </Link>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 mt-2 w-full sm:w-96 lg:w-[20%] 
                bg-light-primary/90 backdrop-blur-md shadow-xl 
                border border-neutral-200/20 dark:border-neutral-800/20"
            >
              <div className="flex flex-col items-center justify-center w-full py-2">
                {categories.map((category) => (
                  <div key={category.name} className="relative w-full">
                    <button className="py-3 px-6 font-sf w-full text-base sm:text-lg hover:bg-light-secondary transition-colors flex items-center justify-between cursor-pointer">
                      <span>{category.name}</span>
                    </button>

                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-white/50 dark:bg-dark-primary/50 backdrop-blur-sm"
                      >
                        <Link
                          to={`/category/${category.name.toLowerCase()}`}
                          className="block px-16 py-2.5 backdrop-blur-sm text-sm font-sf-medium text-dark-primary dark:text-light-primary hover:bg-light-secondary/40 transition-colors"
                          onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                          View All
                        </Link>
                        {category.subcategories.map((subcat) => (
                          <Link
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            key={subcat}
                            to={`/category/${category.name.toLowerCase()}/${subcat}`}
                            className="block px-16 py-4 backdrop-blur-sm text-sm text-gray-700 dark:text-gray-300 hover:bg-light-secondary/40 transition-colors"
                          >
                            {subcat.charAt(0).toUpperCase() + subcat.slice(1)}
                          </Link>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ))}

                <div className="mt-2.5 mb-2.5  w-full border-t border-neutral-800"></div>

                <div className="w-full cursor-pointer">
                  <div className="py-2.5 px-6 font-sf w-full text-base sm:text-lg text-red-600 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-between group">
                    <span>Sales & Clearance</span>
                  </div>
                  <Link
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    to="/category/sale"
                    className="block px-16 py-4 backdrop-blur-sm text-sm font-sf-medium text-dark-primary dark:text-light-primary hover:bg-light-secondary/40 transition-colors"
                  >
                    View All
                  </Link>

                  {Object.keys(saleCategories).map((category) => (
                    <Link
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      key={category}
                      to={`/category/sale/${category.toLowerCase()}`}
                      className="block w-full px-16 py-4 backdrop-blur-sm text-sm text-gray-700 dark:text-gray-300 hover:bg-light-secondary/40 transition-colors"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="relative search-container">
            <button
              onClick={() => {
                if (!isSearchOpen) {
                  setIsSearchOpen(true);
                }
              }}
              className="p-1.5 sm:p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <Search size={20} />
            </button>

            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="z-50 absolute lg:right-12 lg:-top-2.5 mt-2 w-48 sm:w-72 right-5 top-5"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Search products..."
                      className="backdrop-blur-lg w-full p-2 rounded-xl bg-light-primary/80 dark:bg-dark-primary/80 border border-black-300 focus:outline-none focus:border-neutral-300 text-sm sm:text-base"
                      autoFocus
                    />

                    {searchResults.length > 0 && (
                      <div className="font-sf-light  z-50 absolute w-full mt-1 bg-white dark:bg-dark-primary shadow-lg rounded-none max-h-96 overflow-y-auto">
                        {searchResults.map((product) => {
                          const categoryParts = product.category.split("_");
                          const mainCategory =
                            categoryParts[0].charAt(0).toUpperCase() +
                            categoryParts[0].slice(1);
                          const subCategory = categoryParts[1]
                            ? ` - ${categoryParts[1].charAt(0).toUpperCase() + categoryParts[1].slice(1)}`
                            : "";

                          return (
                            <Link
                              key={product._id}
                              to={`/product/${product._id}`}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery("");
                                setSearchResults([]);
                              }}
                              className="font-sf-light flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-contain rounded"
                              />
                              <div className="ml-3 flex-1">
                                <p className="font-sf-light text-sm">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {mainCategory}
                                  {subCategory}
                                </p>
                                <p className="text-sm font-sf-light font-semibold text-gray-900 dark:text-gray-100">
                                  ${product.price}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-1.5 sm:p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              {isAdmin ? <RiAdminLine size={20} /> : <UserRound size={20} />}
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 rounded-sm bg-light-primary/80 dark:bg-dark-primary/80 backdrop-blur-lg

  shadow-lg py-2"
                >
                  {currentUser ? (
                    <>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 hover:bg-neutral-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/account"
                        className="block px-4 py-2 hover:bg-neutral-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Account
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 hover:bg-neutral-100"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/signin"
                      className="block px-4 py-2 hover:bg-neutral-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/cart"
            className="relative p-1.5 sm:p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 z-50 w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center text-xs text-neutral-950">
              {cartCount}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
