import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback products
      setProducts([
        {
          id: 1,
          name: 'VinFast VF 8',
          price: 800000000,
          image: 'vinfast-vf8.png',
          description: 'SUV thông minh với công nghệ tiên tiến'
        },
        {
          id: 2,
          name: 'VinFast VF 9',
          price: 1499000000,
          image: 'vinfast-vf9.png',
          description: 'SUV hạng sang cao cấp'
        },
        {
          id: 3,
          name: 'VinFast VF 3',
          price: 299000000,
          image: 'vinfast-vf3.png',
          description: 'Sedan compact tiết kiệm'
        },
        {
          id: 4,
          name: 'VinFast VF 7',
          price: 799000000,
          image: 'vinfast-vf7.png',
          description: 'SUV hạng sang cao cấp'
        },
        {
          id: 4,
          name: 'VinFast VF 6',
          price: 694000000,
          image: 'vinfast-vf6.png',
          description: 'SUV hạng sang cao cấp'
        }
        
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold text-center mb-12">Bộ Sưu Tập Xe VinFast</h1>

      {loading ? (
        <div className="text-center text-xl">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition">
              <div className="bg-gradient-to-b from-gray-200 to-gray-300 h-80 flex items-center justify-center text-8xl">
                <img src={`/images/products/${product.image}` || '🚗'} alt={product.name} className="h-64 object-contain"/>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-vinfast">{Number(product.price).toLocaleString("vi-VN")} VND</span>
                  <Link to="/contact" className="bg-vinfast text-white px-4 py-2 rounded hover:bg-vinfast_light transition">
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
