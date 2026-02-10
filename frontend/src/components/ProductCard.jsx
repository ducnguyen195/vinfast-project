import React from 'react';

function ProductCard({ product, onSelect }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105">
      <div className="bg-gradient-to-b from-gray-200 to-gray-300 h-64 flex items-center justify-center text-8xl">
        <img src={`/images/products/${product.image_url}` || '🚗'} alt={product.name} className="h-64 object-contain"/>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-3xl font-bold text-vinfast">{product.price}M</span>
          <span className="text-sm text-gray-500">VND</span>
        </div>

        <button
          onClick={() => onSelect(product)}
          className="w-full bg-vinfast text-white font-bold py-2 rounded hover:bg-vinfast_light transition"
        >
          Xem Chi Tiết
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
