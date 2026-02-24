import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import API_URL, { getImageUrl } from '../api/config';
import Seo from '../components/Seo';

function DetailProduct() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/slug/${slug}`);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!product) return <div className="text-center py-10">Product not found</div>;

  const getImageUrl2 = getImageUrl;  // Reuse from config

  const pageUrl = window.location.href;
  const pageTitle = product.name;
  const pageDescription = product.description || pageTitle;
  const pageImage = getImageUrl2(product.image_url);

  return (
    <div className="mt-10 container mx-auto px-4 sm:px-6 px-4 lg:px-20">
      <Seo
        title={pageTitle}
        description={pageDescription}
        url={pageUrl}
        image={pageImage}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-start">
        <div className="lg:col-span-9 bg-white p-4 rounded-lg">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <img
              src={getImageUrl2(product.image_url)} alt={product.name} className="w-full md:w-1/2 h-auto rounded-lg mb-4 md:mb-0"
            />
            <div className="md:ml-6">
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-700 mb-4">{product.description}</p>
              <p className="text-xl font-semibold text-green-600 mb-4">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)}
              </p>
              <Link to="/contact" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Liên Hệ Ngay
              </Link>
            </div>
          </div>
          <div className="mt-8 text-gray-700 leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: product.content }}/>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-lg overflow-hidden shadow-xl sticky top-24">
            <img src="/images/banner/9.jpg" alt="Vinfast Nguyễn Văn Linh" className="w-full h-48 object-cover"/>
            <div className="bg-gradient-to-b from-red-700 via-red-800 to-red-950 text-white p-4">
              <h2 className="text-xl font-bold mb-4 uppercase">
                Vinfast Nguyễn Văn Linh
              </h2>

              <ul className="space-y-2 text-sm leading-relaxed mb-6 list-disc pl-5">
                <li>Giá tốt nhất khi gọi Hotline</li>
                <li>Ký hợp đồng và giao xe tận nhà</li>
                <li>Hỗ trợ đăng ký xe mọi miền tổ quốc</li>
                <li>Hỗ trợ vay lên đến 85%, lãi suất cực ưu đãi</li>
                <li>Duyệt vay trong ngày, hỗ trợ hồ sơ nợ xấu</li>
                <li>Thu mua xe cũ, đổi xe mới</li>
              </ul>

              <div className="flex flex-col gap-3">
                <a  href="tel:0986585054" className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition rounded-full py-2 font-semibold">
                  0986.585.054
                </a>
                <Link to="/contact" className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 transition rounded-full py-2 font-semibold">
                  <button >
                    BÁO GIÁ NHANH
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailProduct;
