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
import { fetchHMCategories } from "../../utils/H&MAPI.js";

const Header = () => {
  const { currentUser, updateUser } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState({});

  const toggleDropdown = (categoryName) => {
    setIsOpen((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!currentUser || !currentUser.expiresAt) return;

      const checkExpiration = () => {
        const currentTime = new Date().getTime();
        if (currentTime >= currentUser.expiresAt) {
          updateUser(null);
          setIsProfileOpen(false);
          navigate("/");
          toast.info("Session expired. Please sign in again.");
        }
      };

      checkExpiration(); // Check immediately
      const interval = setInterval(checkExpiration, 60000); // Check every minute

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
        }
      );
      updateUser(null);
      setIsProfileOpen(false);
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchHMCategories();
        // Filter to get only the relevant categories
        const relevantCategories = data.data.filter((category) =>
          ["men", "ladies", "kids/girls", "kids/boys"].includes(
            category.departmentName
          )
        );
        setCategories(relevantCategories);
      } catch (err) {
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

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

          <Link to="/" className="flex items-center absolute left-12 top-2.5">
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
              className="lg:w-[20%] absolute top-full left-0 mt-5 flex flex-col bg-light-primary/90 backdrop-blur-md shadow-xl border border-neutral-200/20 dark:border-neutral-800/20 w-72 sm:w-96"
            >
              <div className="flex flex-col items-center justify-center w-full py-2">
                {categories.map((category) => (
                  <div
                    key={category.departmentName}
                    className="relative w-full"
                  >
                    <button
                      onClick={() => toggleDropdown(category.departmentName)}
                      className="py-3 px-6 font-sf w-full text-base sm:text-lg hover:bg-light-secondary transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>
                        {category.departmentName.charAt(0).toUpperCase() +
                          category.departmentName.slice(1)}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isOpen[category.departmentName] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden  bg-white/50 dark:bg-dark-primary/50 backdrop-blur-sm"
                        >
                          {category.subcategory.map((subcat) => (
                            <Link
                              key={subcat.title}
                              to={subcat.path}
                              className="block px-8 py-2.5 backdrop-blur-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-light-secondary/50 dark:hover:bg-dark-secondary/50 transition-colors"
                            >
                              {subcat.title}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <div className="mx-4 my-2 w-full  border-t border-neutral-800"></div>

                <Link
                  to={`/category/sales-and-clearance`}
                  className="py-3 px-6 font-sf w-full text-base sm:text-lg text-red-600 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-between group"
                >
                  <span>New Arrivals</span>
                  <span className="text-red-500">★</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="relative">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
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
                  className="absolute right-12 -top-2.5 mt-2 w-48 sm:w-72"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="backdrop-blur-lg w-full p-2 rounded-xl bg-light-primary/80 dark:bg-dark-primary/80 border border-black-300 focus:outline-none focus:border-neutral-300 text-sm sm:text-base"
                    autoFocus
                  />
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
              0
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
