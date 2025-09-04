import React, { useEffect, createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  //Load theme from localstorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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
      }, 60 * 60 * 1000);

      return () => clearTimeout(timer);
    }
  }, [token]);

  // Function to logout user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userdata");
  };
  // Function to change theme
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        logout,
        toggleTheme,
        theme,
        setLoading,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
