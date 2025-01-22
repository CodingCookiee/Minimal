export const isPrimaryAdmin = (user) => {
  if (!user) return false;
  return (
    user._id === import.meta.env.VITE_ADMIN_ID &&
    user.email === import.meta.env.VITE_ADMIN_EMAIL
  );
};

export const hasAdminRequest = (user) => {
  return user?.adminRequest || false;
};
