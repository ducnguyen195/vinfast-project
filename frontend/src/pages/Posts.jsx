import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { decode } from 'he';
import API_URL, { getImageUrl } from "../api/config";
import Seo from '../components/Seo';
import { absoluteUrl } from '../utils/seo';

export default function Posts({ initialPosts = [] }) {
  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
    if (initialPosts.length > 0) return;

    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data.data || []))
      .catch((err) => console.error(err));
  }, [initialPosts]);

  const getImageUrl2 = getImageUrl;  // Reuse from config
  const toPlainText = (value = '') => decode(String(value || ''))
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <Seo
        title="Tin tức & bài viết VinFast"
        description="Tổng hợp bài viết, tin tức và cẩm nang hữu ích cho chủ xe VinFast."
        url={absoluteUrl('/posts')}
      />
      <h1 className="text-2xl font-bold mb-6">Bài viết</h1>

      <div className="space-y-6">
        {posts.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <div className="flex gap-4">
              {p.image_url && (
                <img src={getImageUrl2(p.image_url)} alt={p.title} className="w-64 h-40 object-cover rounded" />
              )}
              <div>
                <Link href={`/posts/${p.slug}`} className="text-lg font-semibold hover:text-vinfast_light">
                  {toPlainText(p.title || '')}
                </Link>
                <p className="text-sm text-gray-600 mt-2">
                  {toPlainText(p.content || '').slice(0, 200)}
                  {toPlainText(p.content || '').length > 200 ? '...' : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
