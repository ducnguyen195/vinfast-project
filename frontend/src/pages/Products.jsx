import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import API_URL, { getImageUrl } from '../api/config';
import Seo from '../components/Seo';
import { absoluteUrl } from '../utils/seo';

const extractVfNumber = (name = '') => {
  const match = String(name).match(/\bvf\s*(\d+)\b/i);
  return match ? Number(match[1]) : null;
};

const sortOnlyVfProducts = (items = []) => {
  const list = Array.isArray(items) ? items : [];
  const vfItems = [];
  const nonVfItems = [];

  list.forEach((item) => {
    const vfNumber = extractVfNumber(item?.name || '');
    if (vfNumber !== null) {
      vfItems.push({ item, vfNumber });
      return;
    }
    nonVfItems.push(item);
  });

  vfItems.sort((a, b) => a.vfNumber - b.vfNumber);
  return [...vfItems.map(({ item }) => item), ...nonVfItems];
};

function Products({ initialProducts = [] }) {
  const [products, setProducts] = useState(sortOnlyVfProducts(initialProducts));
  const [loading, setLoading] = useState(initialProducts.length === 0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(sortOnlyVfProducts(response.data.data || []));
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback products
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl2 = getImageUrl; // Reuse from config

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <Seo
        title="Xe VinFast - Danh sách sản phẩm"
        description="Khám phá bộ sưu tập xe điện VinFast: VF3, VF5, VF8, VF9. Giá tốt nhất, giao nhanh trong ngày."
        url={absoluteUrl('/products')}
      />
      <h1 className="text-5xl font-bold text-center mb-12">Bộ Sưu Tập Xe VinFast</h1>

      {loading ? (
        <div className="text-center text-xl">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition">
              <div className="bg-gradient-to-b from-gray-200 to-gray-300 h-80 flex items-center justify-center text-8xl">
                <img src={getImageUrl2(product.image_url)} alt={product.name} className="h-64 object-contain"/>
              </div>
              <div className="p-6">
                <Link href={`/products/${product.slug || product.id}`} className="text-xl font-medium text-vinfast hover:underline">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                </Link>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-vinfast">{Number(product.price).toLocaleString("vi-VN")} VND</span>
                  <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="bg-vinfast text-white px-4 py-2 rounded hover:bg-vinfast_light transition">
                    Yêu Cầu
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
