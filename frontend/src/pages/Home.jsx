import React from 'react';
import Link from 'next/link';
import Slider from "../components/Slider";
import Seo from '../components/Seo';
import { absoluteUrl } from '../utils/seo';

function Home() {
  return (
    <div>
      <Seo
        title="VinFast Hà Thành - Trang Chủ"
        description="Đại lý chính hãng VinFast tại Hà Thành. Tư vấn, báo giá và giao xe tận nơi. Hotline 0986 585 054."
        url={absoluteUrl('/')}
      />
      {/* Slider */}
      <Slider /> 
      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Dòng Xe Nổi Bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition">
              <div className="bg-gradient-to-b from-gray-200 to-gray-300 h-64 flex items-center justify-center">
                <div className="text-6xl">
                  <img src={`/images/products/vinfast-vf8.png` || '🚗'} alt="VinFast VF 8" className="h-64 object-contain"/>
                </div>
              </div>
              <div className="p-6">
              <Link href="/products/vinfast-vf-8"><h3 className="text-2xl hover:underline text-vinfast font-bold mb-2">VinFast VF 8</h3></Link>
                <p className="text-gray-600 mb-4">SUV thông minh với thời lượng pin lên đến 500km</p>
                <p className="text-vinfast text-xl font-bold mb-4">Từ 800.000.000 VND</p>
                <Link href="/contact?product=VinFast%20VF%208" className="text-vinfast hover:text-vinfast_light font-bold">Yêu Cầu Thông Tin →</Link>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition">
              <div className="bg-gradient-to-b from-gray-200 to-gray-300 h-64 flex items-center justify-center">
                  <img src={`/images/products/vinfast-vf9.png` || '🚗'} alt="VinFast VF 9" className="h-64 object-contain"/>
              </div>
              <div className="p-6">
                <Link href="/products/vinfast-vf-9">
                <h3 className="text-2xl hover:underline text-vinfast font-bold mb-2">VinFast VF 9</h3>
                </Link>
                <p className="text-gray-600 mb-4">SUV hạng sang với công nghệ tự lái mới nhất</p>
                <p className="text-vinfast text-xl font-bold mb-4">Từ 1.499.000.000 VND</p>
                <Link href="/contact?product=VinFast%20VF%209" className="text-vinfast hover:text-vinfast_light font-bold">Yêu Cầu Thông Tin →</Link>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition">
              <div className="bg-gradient-to-b from-gray-200 to-gray-300 h-64 flex items-center justify-center">
                <div className="text-6xl">
                  <img src={`/images/products/vinfast-vf3.png` || '🚗'} alt="VinFast VF 3" className="h-64 object-contain"/>
                </div>
              </div>
              <div className="p-6">
                <Link href="/products/vinfast-vf-3">
                <h3 className="text-2xl hover:underline text-vinfast font-bold mb-2">VinFast VF 3</h3>
                </Link>
                <p className="text-gray-600 mb-4">Sedan compact giá rẻ, hiệu suất cao</p>
                <p className="text-vinfast text-xl font-bold mb-4">Từ 299.000.000 VND</p>
                <Link href="/contact?product=VinFast%20VF%203" className="text-vinfast hover:text-vinfast_light font-bold">Yêu Cầu Thông Tin →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Tính Năng Nổi Bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🔋</div>
              <h3 className="text-2xl font-bold mb-2">Pin Dung Lượng Cao</h3>
              <p className="text-gray-600">Công nghệ pin tiên tiến, tuổi thọ cao, sạc nhanh</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-2">Kết Nối Thông Minh</h3>
              <p className="text-gray-600">Màn hình cảm ứng 15.6 inch, AI, tích hợp ứng dụng</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-2xl font-bold mb-2">An Toàn Cao Cấp</h3>
              <p className="text-gray-600">Hệ thống an toàn 5 sao, tự lái cấp cao</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
