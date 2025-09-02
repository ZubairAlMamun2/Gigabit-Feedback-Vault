import React from "react";
import { createContext, useState } from "react";


// Create Context

// eslint-disable-next-line react-refresh/only-export-components
export  const UserContext = createContext();

// Context Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user = logged in user data

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

