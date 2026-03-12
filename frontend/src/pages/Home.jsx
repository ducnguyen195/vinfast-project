import React from 'react';
import Link from 'next/link';
import Slider from "../components/Slider";
import Seo from '../components/Seo';
import { absoluteUrl } from '../utils/seo';
import { getImageUrl } from '../api/config';

function Home({ initialProducts = [] }) {
  const siteUrl = absoluteUrl('/');
  const featuredProducts = initialProducts;

  const formatPrice = (value) => Number(value || 0).toLocaleString('vi-VN');
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VinFast Ha Thanh',
    url: siteUrl,
    telephone: '0986585054',
    logo: absoluteUrl('/images/logo/favicon.png'),
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VinFast Ha Thanh',
    url: siteUrl,
    inLanguage: 'vi-VN',
  };

  return (
    <div>
      <Seo
        title="VinFast Hà Thành - Trang Chủ"
        description="Đại lý chính hãng VinFast tại Hà Thành. Tư vấn, báo giá và giao xe tận nơi. Hotline 0986 585 054."
        url={siteUrl}
        jsonLd={[orgJsonLd, websiteJsonLd]}
      />
      {/* Slider */}
      <Slider /> 
      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Dòng Xe Nổi Bật</h2>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition">
                  <div className="bg-gradient-to-b from-gray-200 to-gray-300 h-64 flex items-center justify-center">
                    <img src={getImageUrl(product.image_url)} alt={product.name} className="h-64 object-contain" />
                  </div>
                  <div className="p-6">
                    <Link href={`/products/${product.slug || product.id}`}>
                      <h3 className="text-2xl hover:underline text-vinfast font-bold mb-2">{product.name}</h3>
                    </Link>
                    <p className="text-gray-600 mb-4">{product.description || 'Thông tin đang được cập nhật.'}</p>
                    <p className="text-vinfast text-xl font-bold mb-4">Từ {formatPrice(product.price)} VND</p>
                    <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="text-vinfast hover:text-vinfast_light font-bold">
                      Yêu Cầu Thông Tin →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">Chưa có sản phẩm nổi bật để hiển thị.</div>
          )}
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
