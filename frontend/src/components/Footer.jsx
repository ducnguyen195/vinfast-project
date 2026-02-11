import React from 'react';

function Footer() {
  return (
    <footer className="bg-vinfast text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">VinFast Nguyễn Văn Linh</h3>
            <p className="text-gray-300">Đại lý chính hãng xe điện VinFast tại Hà Nội</p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-bold mb-4">Sản Phẩm</h4>
            <ul className="text-gray-300 space-y-2">
              <li><a href="#" className="hover:text-vinfast_light">VinFast VF 8</a></li>
              <li><a href="#" className="hover:text-vinfast_light">VinFast VF 9</a></li>
              <li><a href="#" className="hover:text-vinfast_light">VinFast VF e34</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4">Hỗ Trợ</h4>
            <ul className="text-gray-300 space-y-2">
              <li><a href="#" className="hover:text-vinfast_light">Liên Hệ</a></li>
              <li><a href="#" className="hover:text-vinfast_light">FAQ</a></li>
              <li><a href="#" className="hover:text-vinfast_light">Hướng Dẫn</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-bold mb-4">Liên Hệ</h4>
            <p className="text-gray-100 text-lg mb-2">☎️ Hotline:  0986.585.054</p>
            <p className="text-gray-100 mb-2 text-lg">📧 Email: quynhhoa@gmail.com</p>
            <p className="text-gray-100 mb-2 text-lg">🏠 Địa chỉ: 985 Giải Phóng, Hà Nội</p>
            <p className="text-gray-100 text-lg">🌐 Website:  vinfasthathanh.com</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 .Designed by Duc Nguyen</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
