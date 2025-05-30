import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const onLogo = () => {
    navigate("/");
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-teal-600 text-white p-6 shadow-md w-full ">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={onLogo}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
            />
          </svg>
          <h1 className="text-2xl font-bold">SplitIt</h1>
        </div>
        <nav className="flex gap-6 text-lg items-center">
          {window.location.pathname === "/" && (
            <div className="flex gap-6 text-lg items-center">
              <a href="#features" className="hover:underline ">
                Features
              </a>
              <a href="#comparison" className="hover:underline">
                Why Us
              </a>
              <a href="#reviews" className="hover:underline">
                Reviews
              </a>
            </div>
          )}

          <Link
            to="/login"
            className="hover:underline cursor-pointer bg-amber-600 py-2 px-4 rounded-lg  hover:bg-amber-500 transition-colors"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
