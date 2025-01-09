import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  User,
  MapPinned,
  Map,
  BadgePlus,
  House,
  SignpostBig,
  Smartphone,
  LoaderCircle,
} from "lucide-react";
import { Button, Input, Checkbox } from "../components/ui";

const AddAddressPage = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressData, setAddressData] = useState({
    name: "",
    address1: "",
    address2: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    address1: "",
    city: "",
    country: "",
    phone: "",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      address1: "",
      city: "",
      country: "",
      phone: "",
    };

    if (!addressData.name) {
      newErrors.name = "Full name is required";
      isValid = false;
    }

    if (!addressData.address1) {
      newErrors.address1 = "Address is required";
      isValid = false;
    }

    if (!addressData.city) {
      newErrors.city = "City is required";
      isValid = false;
    }

    if (!addressData.country) {
      newErrors.country = "Country is required";
      isValid = false;
    }

    if (!addressData.phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: async (newAddress) => {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/user/address", newAddress);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Address added successfully");
      setTimeout(() => {
        setIsSubmitting(false);
        queryClient.invalidateQueries(["user"]);
        navigate("/account");
      }, 100);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      setIsSubmitting(false);
    },
  });

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setIsUpdating(true);
      setAddressData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      setTimeout(() => setIsUpdating(false), 500);
    } else {
      setAddressData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutate(addressData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen mt-16 flex items-center justify-center p-4 container mx-auto max-w-screen-xl"
    >
      <div className="max-w-md w-full p-4 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6">
          Add Shipping Address
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />
            <Input
              type="text"
              name="name"
              placeholder="Full name"
              value={addressData.name}
              onChange={handleChange}
              className="pl-10 w-full border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent py-2 sm:py-3"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="relative">
            <House className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />
            <Input
              type="text"
              name="address1"
              placeholder="Address 1"
              value={addressData.address1}
              onChange={handleChange}
              className="pl-10 w-full border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent py-2 sm:py-3"
            />
            {errors.address1 && (
              <p className="text-red-500 text-sm mt-1">{errors.address1}</p>
            )}
          </div>

          <div className="relative">
            <House className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />
            <Input
              type="text"
              name="address2"
              placeholder="Address 2"
              value={addressData.address2}
              onChange={handleChange}
              className="pl-10 w-full border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent py-2 sm:py-3"
            />
          </div>

          <div className="relative">
            <MapPinned className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />
            <Input
              type="text"
              name="city"
              placeholder="City"
              value={addressData.city}
              onChange={handleChange}
              className="pl-10 w-full border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent py-2 sm:py-3"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div className="relative">
            <Map className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />
            <Input
              type="text"
              name="country"
              placeholder="Country"
              value={addressData.country}
              onChange={handleChange}
              className="pl-10 w-full border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent py-2 sm:py-3"
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          <div className="relative">
            <SignpostBig className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />
            <Input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={addressData.postalCode}
              onChange={handleChange}
              className="pl-10 w-full border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent py-2 sm:py-3"
            />
          </div>

          <div className="relative">
            <Smartphone className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />
            <Input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={addressData.phone}
              onChange={handleChange}
              className="pl-10 w-full border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent py-2 sm:py-3"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="mt-6">
            {isUpdating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5"
              >
                <LoaderCircle className="h-5 w-5 text-neutral-900" />
              </motion.div>
            ) : (
              <div className="flex items-center gap-2 mt-4">
                <Checkbox
                  id="isDefault"
                  name="isDefault"
                  checked={addressData.isDefault}
                  onChange={handleChange}
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
              <Button
                type="submit"
                className="w-full sm:w-1/2 rounded-md bg-dark-primary text-light-primary hover:bg-light-primary hover:text-dark-primary transition-all duration-300"
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center"
                  >
                    <div className="h-5 w-5 border-2 border-white dark:border-black-200 border-t-transparent rounded-full animate-spin mr-2" />
                    Adding Address ...
                  </motion.div>
                ) : (
                  <span className="flex items-center justify-center">
                    Add Address
                    <BadgePlus className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/account")}
                className="w-full sm:w-1/2 rounded-md bg-light-primary text-dark-primary"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddAddressPage;
