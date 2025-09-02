import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const { user,setUser } = useContext(UserContext);
  // const [user, setUser] = useState(newuser);
  const [isOpen, setIsOpen] = useState(false);

  const Logout = () => {
    setUser(null);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <nav className="bg-gray-900 shadow-md px-4 py-4 md:px-6 sticky top-0 w-full z-50 flex justify-between items-center">
      {/*general for big and small screen */}
      <h1 className="text-xl text-white font-bold">Gigabit Feedback Vault</h1>
      {/* Navbar for big-screen start */}
      <div className="hidden lg:flex flex-1 justify-center items-center space-x-6">
        <NavLink to="/">Home</NavLink>
        {user ? (
          <>
            
            <NavLink to="/submitfeedback">Submit Feedback</NavLink>
            {user.role == "admin" ? (
              <NavLink to="/adminpanel">Admin Panel</NavLink>
            ) : (
              <><NavLink to="/myfeedback">Dashboard</NavLink></>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="hidden lg:flex items-center space-x-4">
        {user ? (
          <div className="flex items-center gap-1">
            <button
              onClick={Logout}
              className="btn  text-white border-none bg-purple-500 hover:bg-purple-600 rounded-md"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Link
              to="/auth/login"
              className="btn  text-white border-none bg-purple-500 hover:bg-purple-600 rounded-md"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="btn  text-white border-none bg-purple-500 hover:bg-purple-600 rounded-md"
            >
              Register
            </Link>
          </div>
        )}
      </div>
      {/* Navbar for big-screen end */}

      {/* Navbar for small-screen start */}
      <div className="flex space-x-4">
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none text-white"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 w-full bg-gray-900 text-white flex flex-col items-center space-y-4 py-4"
        >
          <NavLink to="/" onClick={toggleMenu}>
            Home
          </NavLink>
          {user ? (
            <>
              
              <NavLink to="/submitfeedback">Submit Feedback</NavLink>
              {user.role == "admin" ? (
                <NavLink to="/adminpanel">Admin Panel</NavLink>
              ) : (
                <><NavLink to="/myfeedback">Dashboard</NavLink></>
              )}
              <button
                onClick={Logout}
                className="btn bg-red-500 text-white px-3 py-1 w-full">
                Log Out
              </button>
            </>
          ) : (
            <>
              <div className="flex space-x-2">
                <Link
                  to="/auth/login"
                  className="btn  text-white border-none bg-purple-500 hover:bg-purple-600 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="btn  text-white border-none bg-purple-500 hover:bg-purple-600 rounded-md"
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      )}
      {/* Navbar for small-screen end */}
    </nav>
  );
};

export default Navbar;
