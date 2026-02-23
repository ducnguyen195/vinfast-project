import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import API_URL, { getImageUrl } from '../api/config';

function DetailProduct() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center">
        <img
          src={getImageUrl2(product.image_url)}
          alt={product.name}
          className="w-full md:w-1/2 h-auto rounded-lg mb-4 md:mb-0"
        />

        <div className="md:ml-6">
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-700 mb-4">{product.description}</p>

          <p className="text-xl font-semibold text-green-600 mb-4">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(product.price)}
          </p>

          <Link
            to="/contact"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Liên Hệ Ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DetailProduct;
