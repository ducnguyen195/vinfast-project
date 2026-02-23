import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL, { getImageUrl } from "../api/config";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data.data || []))
      .catch((err) => console.error(err));
  }, []);

  const getImageUrl2 = getImageUrl;  // Reuse from config

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Bài viết</h1>

      <div className="space-y-6">
        {posts.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <div className="flex gap-4">
              {p.image_url && (
                <img src={getImageUrl2(p.image_url)} alt={p.title} className="w-64 h-40 object-cover rounded" />
              )}
              <div>
                <Link to={`/posts/${p.slug}`} className="text-lg font-semibold hover:text-vinfast_light">
                  {p.title}
                </Link>
                <p className="text-sm text-gray-600 mt-2" dangerouslySetInnerHTML={{ __html: p.content?.slice(0, 200) + '...' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
