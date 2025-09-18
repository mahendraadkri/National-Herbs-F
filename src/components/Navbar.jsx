import React from "react";
import logo from "../assets/national-herbo.png";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHome,
  FaInfoCircle,
  FaBlog,
  FaUsers,
  FaBox,
} from "react-icons/fa";

function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Top bar */}
      <div className="bg-green-600 text-white text-sm flex justify-center px-6 py-2">
        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-2">
            <FaPhoneAlt /> <span>+977 51-591457 / 591047</span>
          </span>
          <span className="flex items-center space-x-2">
            <FaEnvelope /> <span>info@nationalherbs.com</span>
          </span>
          <span className="flex items-center space-x-2">
            <FaMapMarkerAlt /> <span>Nayabazar, Sorakhutte, Kathmandu</span>
          </span>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-gray-100 shadow">
        <div className="mx-auto flex justify-between items-center px-6 py-4 max-w-7xl">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="National Herbs" className="h-10 w-auto" />
          </div>

          {/* Nav links */}
          <ul className="hidden md:flex items-center space-x-8 font-medium">
            <li className="flex items-center space-x-2 hover:text-green-600 cursor-pointer">
              <FaHome /> <span>Home</span>
            </li>
            <li className="flex items-center space-x-2 hover:text-green-600 cursor-pointer">
              <FaInfoCircle /> <span>About Us</span>
            </li>
            <li className="flex items-center space-x-2 hover:text-green-600 cursor-pointer">
              <FaBlog /> <span>Blogs</span>
            </li>
            <li className="flex items-center space-x-2 hover:text-green-600 cursor-pointer">
              <FaUsers /> <span>Distributors</span>
            </li>
            <li className="flex items-center space-x-2 hover:text-green-600 cursor-pointer">
              <FaBox /> <span>Products</span>
            </li>
          </ul>

          {/* Contact button */}
          <button className="ml-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            Contact Us
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
