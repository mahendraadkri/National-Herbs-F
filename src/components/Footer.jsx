// src/components/Footer.jsx
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Head Office */}
        <div>
          <h3 className="text-yellow-400 font-semibold mb-2">Head Office</h3>
          <p>D2/2 - 2nd Floor, Sorakhutte</p>
          <p>Kathmandu, Nepal</p>
        </div>

        {/* Sub Office */}
        <div>
          <h3 className="text-yellow-400 font-semibold mb-2">Sub Office</h3>
          <p>Kupondole-2</p>
          <p>Lalitpur, Nepal</p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-yellow-400 font-semibold mb-2">Phone Number</h3>
          <p>+91-9829885383</p>
          <h3 className="text-yellow-400 font-semibold mt-4 mb-2">
            Email Address
          </h3>
          <p>info@nationalherbo.com</p>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-yellow-400 font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-yellow-400">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <FaLinkedinIn />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
        © 2025 Copyrights by{" "}
        <span className="text-yellow-400">National Herbo.</span> All Rights
        Reserved.
      </div>
    </footer>
  );
}
