import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL, { getImageUrl } from "../api/config";

export default function DetailPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_URL}/posts/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => setPost(data.data))
      .catch((err) => console.error(err));
  }, [slug]);

  if (!post) return <div className="max-w-4xl mx-auto mt-8">Đang tải...</div>;

  const getImageUrl2 = getImageUrl; // Reuse from config

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      {post.image_url && <img src={getImageUrl2(post.image_url)} alt={post.title} className="w-full h-auto object-cover rounded mb-4" />}
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
