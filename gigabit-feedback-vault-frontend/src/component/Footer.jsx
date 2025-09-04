import React from "react";

const Footer = () => {
  return (
    <footer className="footer bg-gray-900 footer-center text-white p-4">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by Gigabit
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
