import React from 'react';
import { FaBars } from 'react-icons/fa';

const Header = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-blue-800 shadow-md">
      {/* Hamburger Menu for Mobile */}
      <button
        onClick={onMenuClick}
        className="text-white focus:outline-none lg:hidden"
        aria-label="Toggle Menu"
      >
        <FaBars size={24} />
      </button>

      {/* School Name */}
      <h1 className="text-xl font-semibold text-white">Sacred Heart High School</h1>
    </header>
  );
};

export default Header;
