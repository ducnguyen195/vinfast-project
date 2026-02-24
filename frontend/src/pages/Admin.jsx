import { useState, useEffect } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from "react-router-dom";
import API_URL, { getImageUrl } from "../api/config";

// helper for TinyMCE image uploads
const handleImageUpload = (blobInfo) => {
  const data = new FormData();
  data.append('file', blobInfo.blob(), blobInfo.filename());

  return fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: data,
  })
    .then(res => {
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    })
    .then(res => {
      if (!res.location) {
        throw new Error('Invalid response');
      }
      return res.location;
    });
};

export default function Admin() {
  const navigate = useNavigate();
  // Products
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [prevAutoSlugProduct, setPrevAutoSlugProduct] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null); 
  const [content, setContent] = useState("");

  // Posts 
  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [postImageFile, setPostImageFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [prevAutoSlugPost, setPrevAutoSlugPost] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  // auto-generate slug from title when appropriate
  const slugify = (s) => {
  if (!s) return "";

  return s
    .toString()
    .normalize("NFD")                    // tách dấu khỏi chữ
    .replace(/[\u0300-\u036f]/g, "")     // xoá dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  };


  // when title changes, update slug only if user didn't customize it (for posts)
  useEffect(() => {
    const auto = slugify(postTitle);
    if (!postSlug || postSlug === prevAutoSlugPost) {
      setPostSlug(auto);
      setPrevAutoSlugPost(auto);
    }
  }, [postTitle]);

  // same for products
  useEffect(() => {
    const auto = slugify(name);
    if (!slug || slug === prevAutoSlugProduct) {
      setSlug(auto);
      setPrevAutoSlugProduct(auto);
    }
  }, [name]);

  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  // load list sản phẩm
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data.data));
    // load posts for admin
    fetch(`${API_URL}/posts`)
      .then(res => res.json())
      .then(data => setPosts(data.data || []));
  }, []);

  const handleSelectProduct = async (id) => {
    setSelectedId(id);

    if (!id) {
      setName("");
      setSlug("");
      setDescription("");
      setPrice("");
      setImageUrl(""); 
      setImageFile(null);   
      setContent("");
      return;
    }

    const res = await fetch(`${API_URL}/products/${id}`);
    const result = await res.json();

    setName(result.data.name || "");
    setSlug(result.data.slug || "");
    setDescription(result.data.description || "");
    setPrice(result.data.price || "");
    setImageUrl(result.data.image_url || "");
    setImageFile(null);
    setContent(result.data.content || "");
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("content", content);

    if (imageFile) {
      formData.append("file", imageFile);
    }


    let url = `${API_URL}/products`;
    let method = "POST";

    if (selectedId) {
      url = `${API_URL}/products/${selectedId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "admin-token": localStorage.getItem("admin_token"),
      },
      body: formData,
    });

    const data = await res.json();
    alert(selectedId ? "Cập nhật thành công!" : "Tạo sản phẩm xong!");
    window.location.reload();
  };

  // Posts handlers
  const handleSelectPost = async (id) => {
    setSelectedPostId(id);

    if (!id) {
      setPostTitle("");
      setPostSlug("");
      setPostImageUrl("");
      setPostImageFile(null);
      setContent("");
      return;
    }

    const res = await fetch(`${API_URL}/posts/slug/${posts.find(p=>p.id==id)?.slug}`);
    const result = await res.json();
    const p = result.data;
    setPostTitle(p.title || "");
    setPostSlug(p.slug || "");
    setPrevAutoSlugPost(p.slug || "");
    setPostImageUrl(p.image_url || "");
    setPostImageFile(null);
    setContent(p.content || "");
  };

  const handleSubmitPost = async () => {
    const formData = new FormData();
    formData.append("title", postTitle);
    formData.append("slug", postSlug);
    formData.append("content", content);
    if (postImageFile) {
      formData.append("file", postImageFile);
    } else if (postImageUrl) {
      formData.append("image_url", postImageUrl);
    }

    let url = `${API_URL}/posts/posts`;
    let method = "POST";

    if (selectedPostId) {
      url = `${API_URL}/posts/posts/${selectedPostId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "admin-token": localStorage.getItem("admin_token"),
      },
      body: formData,
    });

    const data2 = await res.json();
    alert(selectedPostId ? "Cập nhật bài viết thành công!" : "Tạo bài viết thành công!");
    window.location.reload();
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Admin</h2>
          <div className="mt-2 flex gap-3">
            <button onClick={()=>setActiveTab('products')} className={`px-3 py-1 rounded ${activeTab==='products'?'bg-vinfast text-white':'bg-gray-300'}`}>Sản phẩm</button>
            <button onClick={()=>setActiveTab('posts')} className={`px-3 py-1 rounded ${activeTab==='posts'?'bg-vinfast text-white':'bg-gray-300'}`}>Bài viết</button>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("admin_token");
            navigate("/admin-login");
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
      {/* PRODUCT*/}
      {activeTab === 'products' && (
        <>
          {/* SELECT SẢN PHẨM */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Chọn sản phẩm để sửa</label>
            <select
              value={selectedId}
              onChange={(e) => handleSelectProduct(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
            >
              <option value="">-- Tạo sản phẩm mới --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} - {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tên */}
          <div className="mb-5">
            <label className="block font-semibold mb-2">Tên sản phẩm</label>
            <input
              value={name}
              placeholder ="Nhập tên sản phẩm"
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>
          {/* Slug (URL thân thiện) */}
          <div className="mb-5">
            <label className="block font-semibold mb-2">Slug (URL)</label>
            <input
              value={slug}
              placeholder ="tên-san-pham"
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <p className="text-sm text-gray-500 mt-1">Tự động sinh từ tên nếu để trống</p>
          </div>

          {/* Mô tả */}
          <div className="mb-5">
            <label className="block font-semibold mb-2">Mô tả ngắn</label>
            <input
              value={description}
              placeholder ="Nhập mô tả ngắn"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Giá */}
          <div className="mb-5">
            <label className="block font-semibold mb-2">Giá</label>
            <input
              value={price}
              placeholder ="Nhập giá sản phẩm"
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Ảnh */}
          <div className="mb-5">
            <label className="block font-semibold mb-2">Ảnh đại diện</label>
           {imageUrl && !imageFile && (<img src={getImageUrl(imageUrl)} className="w-40 mt-3 rounded" />)}
            <input type ="file"  onChange={(e) => setImageFile(e.target.files[0])} className="w-full border border-gray-300 rounded-lg p-3"/>
          </div>

          {/* TinyMCE editor */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Nội dung chi tiết</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
                <Editor
                  value={content}
                  apiKey="tfdst35n5912ndph3q5a1pb7dxi00enphokpn1m0hlvjr1ge"
                  init={{
                    height: 400,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                      'preview', 'anchor', 'searchreplace', 'visualblocks',
                      'code', 'fullscreen', 'insertdatetime', 'media', 'table'
                    ],
                    toolbar:
                      'undo redo |fontsize formatselect forecolor | bold italic backcolor | alignleft aligncenter table alignright alignjustify | bullist numlist outdent indent | removeformat | image media link',
                    images_upload_handler: handleImageUpload,
                    automatic_uploads: true,
                    media_live_embeds: true,
                    media_filter_html: false,
                    extended_valid_elements:
                      'video[controls|src|width|height|autoplay|loop|muted|poster],source[src|type]',
                  }}
                  onEditorChange={(newContent) => setContent(newContent)}
                />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg"
          >
            {selectedId ? "Cập nhật sản phẩm" : "Lưu sản phẩm"}
          </button>
        </>
      )}

      {activeTab === 'posts' && (
        <>
          {/* POSTS */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Chọn bài viết để sửa</label>
            <select
              value={selectedPostId}
              onChange={(e) => handleSelectPost(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
            >
              <option value="">-- Tạo bài viết mới --</option>
              {posts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} - {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Tiêu đề</label>
            <input value={postTitle} onChange={(e)=>setPostTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3" />
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4">
            <div>
              <label className="block font-semibold mb-2">Slug</label>
              <input value={postSlug} onChange={(e)=>setPostSlug(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Ảnh đại diện</label>
            {postImageUrl && !postImageFile && (<img src={getImageUrl(postImageUrl)} className="w-40 mt-2 rounded" />)}
            <input type="file" onChange={(e) => setPostImageFile(e.target.files[0])} className="w-full border border-gray-300 rounded-lg p-3 mt-2" />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Nội dung bài viết</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <Editor
                value={content}
                init={{
                  height: 400,
                  menubar: false,
                  plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                      'preview', 'anchor', 'searchreplace', 'visualblocks',
                      'code', 'fullscreen', 'insertdatetime', 'media', 'table'
                    ],
                    toolbar:
                      'undo redo |fontsize formatselect forecolor | bold italic backcolor | alignleft aligncenter table alignright alignjustify | bullist numlist outdent indent | removeformat | image media link',
                  images_upload_handler: handleImageUpload,
                  automatic_uploads: true,
                  media_live_embeds: true,
                  media_filter_html: false,
                  extended_valid_elements:
                      'video[controls|src|width|height|autoplay|loop|muted|poster],source[src|type]',
                }}
                onEditorChange={(newContent) => {
                  setContent(newContent);
                }}
              />
            </div>
          </div>

          <button onClick={handleSubmitPost} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg">
            {selectedPostId ? 'Cập nhật bài viết' : 'Tạo bài viết mới'}
          </button>
        </>
      )}
    </div>
  );
}
