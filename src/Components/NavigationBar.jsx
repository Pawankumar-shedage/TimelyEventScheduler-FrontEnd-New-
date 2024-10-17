/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../auth/Redux/authSliceRed";
import { ThemeToggle } from "./ThemeToggle";

export const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const dispatch = useDispatch();

  const handleLogout = () => {
    alert("Loggin out...");
    dispatch(logout());
  };

  return (
    <nav className="bg-gray-100 w-full mx-auto border-b-2  border-gray-200 dark:bg-gray-900 dark:border-none">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

        {/* Left Logo */}
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="/src/assets/images/timely-high-resolution-logo-white.png"
            className="h-8"
            alt="Timely Logo"
          />
          <span className="sm:invisible md:visible self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Timely
          </span>
        </a>
        <button
          onClick={toggleMenu}
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Home,View Events,login/signup */}
        <div
          className={`w-full md:block md:w-auto ${isOpen ? "" : `hidden`} `}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to={"/"}
                className="block py-2 px-3 text-gray-900 rounded md:bg-transparent hover:text-blue-700 md:p-0 dark:text-white "
                aria-current="page"
              >
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/events"}
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                <span>Events</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/admin"}
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                <span>Admin Dashboard</span>
              </Link>
            </li>
            <li className="sm:flex sm:flex-col sm:justify-start sm:px-2 md:flex md:flex-row md:justify-center">
              <div>
                <span type="button">
                  <Link
                    to={"/login"}
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Login
                  </Link>
                </span>
              </div>
              <div className="sm:mt-3 md:mt-0">
                <span type="button">
                  <Link
                    to={"/register"}
                    className=" text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Sign up
                  </Link>
                </span>
              </div>
              <div className="sm:mt-3 md:mt-0">
                <span
                  type="button"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  Logout
                </span>
              </div>
              <div className="sm:mt-3 md:mt-0">
                
                  <ThemeToggle />
               
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
