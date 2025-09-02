import React, { useEffect, createContext, useState } from "react";

// Create Context
export const UserContext = createContext();

// Context Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Logged-in user data
  const [token, setToken] = useState(null); // JWT token

  // Load user and token from localStorage on initial render
  useEffect(() => {
    const userdata = localStorage.getItem("userdata");
    if (userdata) {
      try {
        const { user, token } = JSON.parse(userdata);
        if (user && token) {
          setUser(user);
          setToken(token);
        }
      } catch (err) {
        console.error("Failed to parse userdata:", err);
        localStorage.removeItem("userdata");
      }
    }
  }, []);

  // Auto logout after 1 hour
  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("userdata");
        console.log("Token expired: User logged out automatically.");
      }, 60 * 60 * 1000); // 1 hour in milliseconds

      return () => clearTimeout(timer); // cleanup on unmount or token change
    }
  }, [token]);

  // Function to logout user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userdata"); // clear storage
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};
