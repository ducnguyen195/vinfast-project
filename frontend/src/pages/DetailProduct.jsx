import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import API_URL, { getImageUrl } from '../api/config';
import Seo from '../components/Seo';
import { absoluteUrl } from '../utils/seo';

function DetailProduct({ initialProduct = null }) {
  const router = useRouter();
  const { slug } = router.query;

  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const normalizeColors = (input) => {
    if (!Array.isArray(input)) return [];
    return input.filter((item) => item?.image_url);
  };

  const normalizePromotionItems = (input) => {
    if (!Array.isArray(input)) return [];
    return input
      .map((item) => {
        if (typeof item === 'string') return item.trim();
        return String(item?.content || '').trim();
      })
      .filter(Boolean);
  };

  const normalizeVersionPriceRows = (input) => {
    if (!Array.isArray(input)) return [];
    return input
      .map((item) => ({
        version_name: String(item?.version_name || item?.name || '').trim(),
        price_label: String(item?.price_label || item?.price || '').trim(),
      }))
      .filter((item) => item.version_name || item.price_label);
  };

  const normalizeContentHtml = (html = '') => {
    if (!html || typeof html !== 'string') return '';

    return html.replace(/\b(src|poster)=["']([^"']+)["']/gi, (full, attr, rawUrl) => {
      const value = String(rawUrl || '').trim();
      if (!value) return full;

      if (value.startsWith('data:') || value.startsWith('blob:')) {
        return full;
      }

      // Rewrite legacy absolute media URLs (e.g. localhost/uploads/...) to current base URL.
      const absoluteUploadMatch = value.match(/^https?:\/\/[^/]+\/(uploads\/.*)$/i);
      if (absoluteUploadMatch?.[1]) {
        const fixed = getImageUrl(absoluteUploadMatch[1]);
        return `${attr}="${fixed}"`;
      }

      // Keep other absolute/external URLs, but encode unsafe characters.
      if (/^(https?:)?\/\//i.test(value)) {
        return `${attr}="${encodeURI(value)}"`;
      }

      const cleanPath = value.replace(/^\/+/, '');
      if (cleanPath.startsWith('uploads/')) {
        const fixed = getImageUrl(cleanPath);
        return `${attr}="${fixed}"`;
      }

      return `${attr}="/${cleanPath}"`;
    });
  };

  useEffect(() => {
    if (!slug || initialProduct) return;
    fetchProduct();
  }, [slug, initialProduct]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/slug/${slug}`);
      setProduct(response.data.data);
      const nextColors = normalizeColors(response?.data?.data?.colors || []);
      const defaultIndex = nextColors.findIndex((color) => color.is_default);
      setSelectedColorIndex(defaultIndex >= 0 ? defaultIndex : 0);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const nextColors = normalizeColors(product?.colors || []);
    const defaultIndex = nextColors.findIndex((color) => color.is_default);
    setSelectedColorIndex(defaultIndex >= 0 ? defaultIndex : 0);
  }, [product?.id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!product) return <div className="text-center py-10">Product not found</div>;

  const getImageUrl2 = getImageUrl;  // Rechỗuse from config
  const colors = normalizeColors(product?.colors || []);
  const selectedColor = colors[selectedColorIndex] || colors[0] || null;
  const selectedImage = selectedColor?.image_url || product.image_url;
  const selectedImageUrl = selectedImage ? getImageUrl2(selectedImage) : '';
  const contentHtml = normalizeContentHtml(product?.content || '');
  const promotionItems = normalizePromotionItems(product?.promotion_items || []);
  const versionPriceRows = normalizeVersionPriceRows(product?.version_price_rows || []);

  const canonicalSlug = product?.slug || slug || '';
  const pageUrl = absoluteUrl(`/products/${canonicalSlug}`);
  const pageTitle = product.name;
  const pageDescription = product.description || pageTitle;
  const pageImage = getImageUrl2(selectedImage);
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pageTitle,
    description: pageDescription,
    image: pageImage ? [pageImage] : undefined,
    sku: String(product.id || canonicalSlug || ''),
    brand: {
      '@type': 'Brand',
      name: 'VinFast',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price: Number(product.price || 0),
      availability: 'https://schema.org/InStock',
      url: pageUrl,
    },
  };

  return (
    <div className="mt-10 container mx-auto px-4 sm:px-6 lg:px-20">
      <Seo
        title={pageTitle}
        description={pageDescription}
        url={pageUrl}
        image={pageImage}
        type="product"
        jsonLd={productJsonLd}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-9 bg-white p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="w-full">
              <div className="w-full max-w-[510px] h-[230px] mx-auto aspect-[4/3] rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center">
                {selectedImageUrl ? (
                  <img
                    src={selectedImageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-500">
                    Chua co anh san pham
                  </div>
                )}
              </div>
               {!!colors.length && (
                <div className="mb-4 mt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {colors.map((color, index) => {
                      const isActive = index === selectedColorIndex;
                      const tone = color.hex_code || '#d9d9d9';
                      return (
                        <button
                          key={`${color.id || index}_${index}`}
                          type="button"
                          aria-label={`Chon mau ${index + 1}`}
                          onClick={() => setSelectedColorIndex(index)}
                          className={`h-11 w-11 rounded-full border flex items-center justify-center ${isActive ? 'border-blue-600' : 'border-gray-300 hover:border-gray-400'}`}
                        >
                          <span className="block h-8 w-8 rounded-full border" style={{ backgroundColor: tone }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {versionPriceRows.length > 0 && (
                <div className="mt-2 overflow-hidden rounded border border-gray-300">
                  <div className="grid grid-cols-2 bg-[#0f4a72] text-center text-white">
                    <div className="border-r border-gray-300 p-2 text-sm font-bold uppercase">Tên phiên bản</div>
                    <div className="p-2 text-sm font-bold uppercase">Giá</div>
                  </div>
                  {versionPriceRows.map((row, index) => (
                    <div key={`${row.version_name}_${row.price_label}_${index}`} className="grid grid-cols-2 border-t border-gray-300 bg-gray-100">
                      <div className="border-r border-gray-300 p-2 text-sm font-semibold text-gray-700">{row.version_name || '-'}</div>
                      <div className="p-2 text-sm font-semibold text-gray-700">{row.price_label || '-'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-700 mb-4">{product.description}</p>
              {promotionItems.length > 0 && (
                <div className="mb-5 rounded border border-red-200 bg-gray-100 p-4">
                  <div className="mb-3 bg-[#0f4a72] p-3 text-center text-lg font-bold uppercase text-white">
                    Chương trình khuyến mãi
                  </div>
                  <ul className="space-y-2">
                    {promotionItems.map((line, index) => (
                      <li key={`${index}_${line.slice(0, 20)}`} className="border-b border-dashed border-sky-300 pb-2 text-base text-gray-800">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
            </div>
          </div>
          <div className="mt-8 text-gray-700 leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: contentHtml }}/>
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
                <Link href="/contact" className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 transition rounded-full py-2 font-semibold">
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
