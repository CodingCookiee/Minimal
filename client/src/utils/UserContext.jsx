import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (userData) => {
    if (userData) {
      const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000; // 1 day
      const userWithExpiration = { ...userData, expiresAt };
      localStorage.setItem("user", JSON.stringify(userWithExpiration));
      localStorage.removeItem("expiredNotificationShown"); // Reset flag when user logs in
      setCurrentUser(userWithExpiration);
    } else {
      localStorage.removeItem("user");
      setCurrentUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
