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
      setProducts([]);
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
                <img src={`/images/products/${product.image_url}` || '🚗'} alt={product.name} className="h-64 object-contain"/>
              </div>
              <div className="p-6">
                <Link to={`/products/${product.id}`} className="text-xl font-medium text-vinfast hover:underline">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                </Link>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-vinfast">{Number(product.price).toLocaleString("vi-VN")} VND</span>
                  <Link to="/contact" state={{ product: product.name }} className="bg-vinfast text-white px-4 py-2 rounded hover:bg-vinfast_light transition">
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
