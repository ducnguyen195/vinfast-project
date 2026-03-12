import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import API_URL from '../api/config';
import Seo from '../components/Seo';
import { absoluteUrl } from '../utils/seo';

function ContactForm() {
  const router = useRouter();
  const queryProduct = typeof router.query.product === 'string' ? router.query.product : '';
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: queryProduct || '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!queryProduct) return;
    setFormData((prev) => ({ ...prev, product: queryProduct }));
  }, [queryProduct]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        const fetchedProducts = response.data?.data || [];
        setProducts(fetchedProducts);

        // If there is no product from query, default to the first product from API.
        if (!queryProduct && fetchedProducts.length > 0) {
          setFormData((prev) => ({
            ...prev,
            product: prev.product || fetchedProducts[0].name
          }));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [queryProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/requests`, formData);
      
      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          product: queryProduct || products[0]?.name || '',
          message: ''
        });

        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Seo
        title="Liên hệ tư vấn – VinFast Hà Thành"
        description="Gửi yêu cầu tư vấn, báo giá và hỗ trợ mua xe VinFast chính hãng. Hotline 0986 585 054."
        url={absoluteUrl('/contact')}
      />
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-2">Yêu Cầu Thông Tin</h1>
        <p className="text-center text-gray-600 mb-8">Liên hệ với chúng tôi để nhận thông tin chi tiết</p>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            ✅ Yêu cầu của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ trong thời gian sớm nhất.
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Họ và Tên *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-vinfast"
              placeholder="Nhập họ và tên"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-vinfast"
              placeholder="example@email.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Số Điện Thoại *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-vinfast"
              placeholder="0912345678"
            />
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Chọn Sản Phẩm *</label>
            <select
              name="product"
              value={formData.product}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-vinfast"
            >
              {products.length === 0 && <option value="">Chọn sản phẩm</option>}
              {products.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name}
                </option>
              ))}
              {queryProduct && !products.some((product) => product.name === queryProduct) && (
                <option value={queryProduct}>{queryProduct}</option>
              )}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Lời Nhắn (Tùy Chọn)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-vinfast resize-none"
              placeholder="Viết lời nhắn của bạn..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-vinfast text-white font-bold py-3 rounded-lg hover:bg-vinfast_light transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8 text-sm">
          💬 Chúng tôi sẽ liên hệ bạn ngay khi nhận được yêu cầu 
        </p>
      </div>
    </div>
  );
}

export default ContactForm;
