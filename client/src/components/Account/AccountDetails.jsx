import { Input, Button } from "../ui";
import { User, Mail, LockKeyhole, Eye, EyeOff, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export const AccountDetails = ({
  userData,
  onSubmit,
  isUpdating,
  isEditing,
  setIsEditing,
  errors,
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  

  return (
    <div className="details-container">
      <h2 className="text-3xl font-sf-heavy font-bold mb-4">Account Details</h2>

      {!isEditing ? (
        <>
          <p className="font-sf-light text-neutral-600">{userData?.name}</p>
          <p className="font-sf-light text-neutral-600">{userData?.email}</p>
          <Button
            type="button"
            className="font-extralight text-lg p-0"
            onClick={() => setIsEditing(true)}
          >
            <span className="flex items-center justify-center mt-5">
              Edit
              <Pencil className="ml-2  h-4 w-4" />
            </span>
          </Button>
        </>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />
            <Input
              name="name"
              defaultValue={userData?.name}
              placeholder="Name"
              className="pl-10 w-[300px] border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent py-2 sm:py-3"
            />
            {errors.name && (
              <small className="text-red-500 text-sm mt-1">{errors.name}</small>
            )}
          </div>
          <div className="flex flex-col relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5  text-black-500 dark:text-white-500" />

            <Input
              name="email"
              defaultValue={userData?.email}
              placeholder="Email"
              className="pl-10 w-[300px] border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent py-2 sm:py-3"
            />
            {errors.email && (
              <small className="text-red-500 text-sm mt-1">
                {errors.email}
              </small>
            )}
          </div>
          <div className="flex flex-col relative">
            <div className="flex  relative">
              <LockKeyhole className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />

              <Input
                name="password"
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password (optional)"
                className="pl-10 w-[300px] border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent py-2 sm:py-3"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className=" absolute left-[275px] top-2.5 text-black-500 dark:text-white-500 hover:text-violet-300 dark:hover:text-violet-300 transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <small className="text-red-500 text-sm mt-1">
                {errors.password}
              </small>
            )}
          </div>
          <div className="flex justify-start gap-2.5 mt-4">
            <Button
              type="submit"
              className=" font-extralight text-lg p-0 ml-8"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center"
                >
                  <div className="h-5 w-5 border-2 border-white dark:border-black-200 border-t-transparent rounded-full animate-spin mr-2" />
                  Saving Changes ...
                </motion.div>
              ) : (
                <span className="flex items-center justify-center">
                  Save Changes
                </span>
              )}
            </Button>
            <Button
              type="button"
              className="font-extralight text-lg p-0 ml-8"
              onClick={() => setIsEditing(false)}
            >
              <span className="flex items-center justify-center">Cancel</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
