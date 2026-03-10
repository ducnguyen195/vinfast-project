import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import API_URL, { getImageUrl } from "../api/config";
import Seo from '../components/Seo';
import { absoluteUrl } from '../utils/seo';

export default function DetailPost({ initialPost = null }) {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(initialPost);

  useEffect(() => {
    if (!slug || initialPost) return;
    fetch(`${API_URL}/posts/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => setPost(data.data))
      .catch((err) => console.error(err));
  }, [slug, initialPost]);

  if (!post) return <div className="max-w-4xl mx-auto mt-8">Đang tải...</div>;

  const pageUrl = typeof window !== 'undefined'
    ? window.location.href
    : absoluteUrl(`/posts/${slug || ''}`);
  const pageTitle = post.title;
  const pageDescription = post.excerpt || (post.content ? post.content.replace(/<[^>]+>/g, '').slice(0,160) : '');
  const pageImage = post.image_url ? getImageUrl(post.image_url) : null;

  const getImageUrl2 = getImageUrl; // Reuse from config

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <Seo
        title={pageTitle}
        description={pageDescription}
        url={pageUrl}
        image={pageImage}
      />
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      {post.image_url && <img src={getImageUrl2(post.image_url)} alt={post.title} className="w-full h-auto object-cover rounded mb-4" />}
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
