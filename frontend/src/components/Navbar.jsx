import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-vinfast text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/images/logo/Logo-Full.png" alt="VinFast" className="h-12 sm:h-14 md:h-16 w-auto"/>
              <div className="hidden sm:block h-10 sm:h-12 w-px bg-gray-300"></div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs sm:text-lg md:text-xl font-semibold">
                  VINFAST NGUYỄN VĂN LINH
                </span>
                <span className="text-xs sm:text-base font-semibold">
                  Quỳnh Hoa: 0986.585.054
                </span>
              </div>

            </div>
          </Link>


          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-vinfast_light transition font-bold">Trang Chủ</Link>
            <Link to="/products" className="hover:text-vinfast_light transition font-bold">Sản Phẩm</Link>
            <Link to="/price-table" className="hover:text-vinfast_light transition font-bold">Bảng Giá</Link>
            <Link to="/contact" className="hover:text-vinfast_light transition font-bold">Liên Hệ</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block px-3 py-2 hover:bg-vinfast_light rounded">Trang Chủ</Link>
            <Link to="/products" className="block px-3 py-2 hover:bg-vinfast_light rounded">Sản Phẩm</Link>
            <Link to="/contact" className="block px-3 py-2 hover:bg-vinfast_light rounded">Liên Hệ</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
