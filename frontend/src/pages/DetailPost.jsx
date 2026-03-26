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
  const normalizeContentHtml = (html = '') => {
    if (!html || typeof html !== 'string') return '';

    return html.replace(/\b(src|poster)=["']([^"']+)["']/gi, (full, attr, rawUrl) => {
      const value = String(rawUrl || '').trim();
      if (!value) return full;

      if (value.startsWith('data:') || value.startsWith('blob:')) {
        return full;
      }

      const absoluteUploadMatch = value.match(/^https?:\/\/[^/]+\/(uploads\/.*)$/i);
      if (absoluteUploadMatch?.[1]) {
        return `${attr}="${getImageUrl(absoluteUploadMatch[1])}"`;
      }

      if (/^(https?:)?\/\//i.test(value)) {
        return `${attr}="${encodeURI(value)}"`;
      }

      const cleanPath = value.replace(/^\/+/, '');
      if (cleanPath.startsWith('uploads/')) {
        return `${attr}="${getImageUrl(cleanPath)}"`;
      }

      return `${attr}="${encodeURI(`/${cleanPath}`)}"`;
    });
  };

  const canonicalSlug = post?.slug || slug || '';
  const pageUrl = absoluteUrl(`/posts/${canonicalSlug}`);
  const pageTitle = post.title;
  const pageDescription = post.excerpt || (post.content ? post.content.replace(/<[^>]+>/g, '').slice(0,160) : '');
  const pageImage = post.image_url ? getImageUrl(post.image_url) : null;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle,
    description: pageDescription,
    image: pageImage ? [pageImage] : undefined,
    author: {
      '@type': 'Organization',
      name: 'VinFast Ha Thanh',
    },
    publisher: {
      '@type': 'Organization',
      name: 'VinFast Ha Thanh',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/images/logo/favicon.png'),
      },
    },
    mainEntityOfPage: pageUrl,
    datePublished: post.created_at || undefined,
    dateModified: post.updated_at || post.created_at || undefined,
  };

  const getImageUrl2 = getImageUrl; // Reuse from config
  const contentHtml = normalizeContentHtml(post.content || '');

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <Seo
        title={pageTitle}
        description={pageDescription}
        url={pageUrl}
        image={pageImage}
        type="article"
        jsonLd={articleJsonLd}
      />
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      {post.image_url && <img src={getImageUrl2(post.image_url)} alt={post.title} className="w-full h-auto object-cover rounded mb-4" />}
      <div className="prose max-w-none rich-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}
