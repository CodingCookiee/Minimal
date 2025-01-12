import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, UserRound, ShoppingBag, X } from "lucide-react";
import { RiAdminLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axios.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../utils/UserContext";

const Header = () => {
  const { currentUser, updateUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
    <header className="fixed w-full top-0 z-50 px-3 sm:px-6 py-4 bg-transparent backdrop-blur-md">
      <nav className="flex items-center justify-between px mx-auto">
        <div className="flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 sm:p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="flex items-center absolute left-12 top-6">
            <img src="/brand-name.svg" alt="Logo" className="h-20" />
          </Link>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-transparent py-4 sm:py-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto text-center">
                {["Men", "Women", "Kids"].map((category) => (
                  <Link
                    key={category}
                    to={`/category/${category.toLowerCase()}`}
                    className="font-sf text-base sm:text-lg hover:text-neutral-400 transition-colors py-2"
                  >
                    {category}
                  </Link>
                ))}
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
                    className="w-full p-2 rounded-xl bg-light-primary dark:bg-dark-primary border border-black-300 focus:outline-none focus:border-neutral-300 text-sm sm:text-base"
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
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
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
