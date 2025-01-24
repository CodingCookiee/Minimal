import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Trash2, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios";
import { useUser } from "../../utils/UserContext";
import { isPrimaryAdmin } from "../../utils/checkAdmin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Loading,
} from "../ui";

const ProductControl = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    product: null,
  });
  const { currentUser } = useUser();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const categoryData = {
    all: {
      all: "All Products",
    },
    men: {
      jeans: "Jeans",
      shirts: "Shirts",
    },
    women: {
      jeans: "Jeans",
      shirts: "Shirts",
      trousers: "Trousers",
    },
    sale: {
      men: "Men's Sale",
      women: "Women's Sale",
    },
  };

  useEffect(() => {
    if (currentUser) {
      const checkAdminStatus = async () => {
        try {
          const response = await axiosInstance.get("/user/profile");
          if (response.data.role !== "admin") {
            setAdminError("Access Denied - Admin Only");
          }
          setAdminLoading(false);
        } catch (error) {
          setAdminError(error.response?.data?.message || "Error checking admin status");
          setAdminLoading(false);
        }
      };

      checkAdminStatus();
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSubcategory]);

  const fetchProducts = async () => {
    try {
      let endpoint = "/product";

      if (selectedCategory !== "all") {
        if (selectedSubcategory) {
          endpoint = `/product/${selectedCategory}/${selectedSubcategory}`;
        } else {
          const defaultSubcategory = Object.keys(
            categoryData[selectedCategory]
          )[0];
          endpoint = `/product/${selectedCategory}/${defaultSubcategory}`;
        }
      }

      const response = await axiosInstance.get(endpoint);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.log("Error Retrieving Products", err.message);
      toast.error(err.message || "Error retrieving products");
      setError(err.message || "Error retrieving products");
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteDialog.product) return;

    try {
      await axiosInstance.delete(`/product/${deleteDialog.product._id}`);
      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product._id !== deleteDialog.product._id
        )
      );
      toast.success("Product deleted successfully");
      setDeleteDialog({ isOpen: false, product: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting product");
    }
  };

  if (adminLoading) return <Loading />;

  if (adminError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-sf-regular">
            Something went wrong
          </h1>
          <p className="text-gray-500 mb-4">{adminError}</p>
          <motion.button
            onClick={() => navigate("/")}
            className="font-sf-regular px-6 py-3 bg-dark-primary text-light-primary hover:bg-light-primary hover:text-dark-primary border border-dark-primary transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Return to Home
          </motion.button>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-sf-regular">
            Something went wrong
          </h1>
          <p className="text-gray-500 mb-4">{error}</p>
        </div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6" />
        <h2 className="text-2xl font-bold font-sf-heavy">Product Management</h2>
      </div>

      {/* Responsive Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubcategory("");
          }}
          className="w-full sm:w-48 py-2.5 px-2.5 border border-grey-500 appearance-none rounded-lg outline-none"
        >
          <option
            value="all"
            className="font-sf-light hover:bg-black-500 hover:text-light-primary"
          >
            All Products
          </option>
          <option
            value="men"
            className="font-sf-light hover:bg-black-500 hover:text-light-primary"
          >
            Men
          </option>
          <option
            value="women"
            className="font-sf-light hover:bg-black-500 hover:text-light-primary"
          >
            Women
          </option>
          <option
            value="sale"
            className="font-sf-light hover:bg-black-500 hover:text-light-primary"
          >
            Sale
          </option>
        </select>

        {selectedCategory !== "all" && (
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="w-full sm:w-48 py-2.5 px-2.5 border border-grey-500 appearance-none rounded-lg outline-none"
          >
            {Object.entries(categoryData[selectedCategory] || {}).map(
              ([key, value]) => (
                <option
                  key={key}
                  value={key}
                  className="font-sf-light hover:bg-black-500 hover:text-light-primary"
                >
                  {value}
                </option>
              )
            )}
          </select>
        )}
      </div>

      {/* Product Grid/List */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Desktop Header */}
        <div className="hidden md:grid md:grid-cols-5 bg-gray-50 p-4 rounded-t-lg">
          <div className="font-sf-medium">Image</div>
          <div className="font-sf-medium ">Name</div>
          <div className="font-sf-medium ">Category</div>
          <div className="font-sf-medium ">Price</div>
          <div className="font-sf-medium ">Actions</div>
        </div>

        {/* Products List */}
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t"
          >
            {/* Desktop View */}
            <div className="hidden md:grid md:grid-cols-5 gap-4 p-4 items-center">
              <div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-contain rounded"
                />
              </div>
              <div className="font-sf-medium">
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-sf-medium mb-1 cursor-pointer">
                    {product.name}
                  </h3>
                </Link>
              </div>
              <div className="font-sf-medium uppercase text-xs text-neutral-500">
                {product.category}
              </div>
              <div className="font-sf-medium">${product.price}</div>
              <div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={!isPrimaryAdmin(currentUser)}
                  onClick={() => setDeleteDialog({ isOpen: true, product })}
                  className="w-full font-sf-light"
                >
                  <Trash2 className="w-4 h-4 mr-2 text-red-700" /> Delete
                </Button>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden p-4">
              <div className="flex items-start gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-contain rounded"
                />
                <div className="flex-1">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-sf-medium mb-1 cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="font-sf-medium uppercase text-[10px] mb-1 text-neutral-500">
                    {product.category}
                  </p>
                  <p className="font-sf-medium">${product.price}</p>
                  <div className="mt-3">
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={!isPrimaryAdmin(currentUser)}
                      onClick={() => setDeleteDialog({ isOpen: true, product })}
                      className="w-full font-sf-light"
                    >
                      <Trash2 className=" w-4 h-4 mr-2 text-red-700" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) => setDeleteDialog({ isOpen, product: null })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-sf-semibold text-md">
              Delete Product
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 font-sf-light text-sm">
            <p>Are you sure you want to delete {deleteDialog.product?.name}?</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ isOpen: false, product: null })}
              className="font-sf-light"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              className="text-red-700 font-sf-light"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProductControl;
