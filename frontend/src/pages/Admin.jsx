import { useState, useEffect } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { useRouter } from 'next/router';
import API_URL, { getImageUrl } from "../api/config";
import Seo from '../components/Seo';
import { absoluteUrl } from '../utils/seo';

const uploadMediaFile = (file, metadata = {}) => {
  const data = new FormData();
  data.append('file', file, file.name || `media-${Date.now()}`);
  if (metadata.purpose) data.append('purpose', metadata.purpose);
  if (metadata.entityType) data.append('entity_type', metadata.entityType);
  if (metadata.entityKey) data.append('entity_key', metadata.entityKey);

  return fetch(`${API_URL}/upload`, {
    method: 'POST',
    credentials: 'include',
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

const createColorDraft = (index = 0) => ({
  key: `${Date.now()}_${index}_${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  hex_code: '#d9d9d9',
  image_url: '',
  file: null,
  is_default: index === 0,
});

const uploadImageFile = async (file, metadata = {}) => {
  try {
    return await uploadMediaFile(file, metadata);
  } catch (error) {
    throw new Error(error?.message || 'Upload ảnh màu thất bại');
  }
};

export default function Admin() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loadError, setLoadError] = useState("");
  // Products
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [prevAutoSlugProduct, setPrevAutoSlugProduct] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [colorOptions, setColorOptions] = useState([createColorDraft(0)]);
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

  const activeEntityType = activeTab === 'posts' ? 'post' : 'product';
  const activeEntityKey = activeTab === 'posts'
    ? (postSlug || selectedPostId || postTitle || 'post-draft')
    : (slug || selectedId || name || 'product-draft');

  const handleEditorImageUpload = (blobInfo) => uploadMediaFile(blobInfo.blob(), {
    purpose: 'tinymce',
    entityType: activeEntityType,
    entityKey: activeEntityKey,
  });

  // load list sản phẩm
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const authRes = await fetch(`${API_URL}/admin/session`, { credentials: 'include' });
        if (!authRes.ok) {
          router.replace('/admin-login');
          return;
        }

        setLoadError("");

        fetch(`${API_URL}/products`)
          .then(res => res.json())
          .then(data => setProducts(Array.isArray(data.data) ? data.data : []))
          .catch(() => {
            setProducts([]);
            setLoadError("Khong tai duoc du lieu san pham. Kiem tra DATABASE_URL/PostgreSQL.");
          });

        fetch(`${API_URL}/posts`)
          .then(res => res.json())
          .then(data => setPosts(Array.isArray(data.data) ? data.data : []))
          .catch(() => {
            setPosts([]);
            setLoadError("Khong tai duoc du lieu bai viet. Kiem tra DATABASE_URL/PostgreSQL.");
          });
      } catch {
        router.replace('/admin-login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    bootstrap();
  }, [router]);

  if (isCheckingAuth) {
    return (
      <>
        <Seo title="Admin" url={absoluteUrl('/admin')} noindex />
        <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">Dang kiem tra quyen truy cap...</div>
      </>
    );
  }

  const handleSelectProduct = async (id) => {
    setSelectedId(id);

    if (!id) {
      setName("");
      setSlug("");
      setDescription("");
      setPrice("");
      setImageUrl(""); 
      setColorOptions([createColorDraft(0)]);
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
    const colors = Array.isArray(result?.data?.colors) ? result.data.colors : [];
    if (colors.length) {
      setColorOptions(
        colors.map((color, index) => ({
          key: `${color.id || 'db'}_${index}_${Date.now()}`,
          name: color.name || '',
          hex_code: color.hex_code || '#d9d9d9',
          image_url: color.image_url || '',
          file: null,
          is_default: Boolean(color.is_default),
        }))
      );
    } else {
      setColorOptions([
        {
          ...createColorDraft(0),
          name: '',
          image_url: result.data.image_url || '',
          is_default: true,
        },
      ]);
    }
    setContent(result.data.content || "");
  };

  const handleAddColor = () => {
    setColorOptions((prev) => [...prev, createColorDraft(prev.length)]);
  };

  const handleRemoveColor = (key) => {
    setColorOptions((prev) => {
      const next = prev.filter((color) => color.key !== key);
      if (!next.length) return [createColorDraft(0)];
      if (!next.some((color) => color.is_default)) {
        next[0] = { ...next[0], is_default: true };
      }
      return next;
    });
  };

  const handleColorChange = (key, field, value) => {
    setColorOptions((prev) => prev.map((color) => {
      if (color.key !== key) return color;
      return { ...color, [field]: value };
    }));
  };

  const handleSetDefaultColor = (key) => {
    setColorOptions((prev) => prev.map((color) => ({ ...color, is_default: color.key === key })));
  };

  const handleSubmit = async () => {
    const normalizedColors = [];

    for (let i = 0; i < colorOptions.length; i += 1) {
      const color = colorOptions[i];
      const uploadedUrl = color.file ? await uploadImageFile(color.file, {
        purpose: 'product-color',
        entityType: 'product',
        entityKey: slug || selectedId || name || `color-${i + 1}`,
      }) : color.image_url;
      const finalImage = (uploadedUrl || '').trim();
      if (!finalImage) {
        continue;
      }

      normalizedColors.push({
        name: '',
        hex_code: (color.hex_code || '').trim(),
        image_url: finalImage,
        sort_order: i,
        is_default: Boolean(color.is_default),
      });
    }

    if (!normalizedColors.length) {
      alert('Can it nhat 1 mau co anh rieng.');
      return;
    }

    if (!normalizedColors.some((c) => c.is_default)) {
      normalizedColors[0].is_default = true;
    }

    const defaultColor = normalizedColors.find((c) => c.is_default) || normalizedColors[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("content", content);
    formData.append("image_url", defaultColor.image_url);
    formData.append("colors_json", JSON.stringify(normalizedColors));


    let url = `${API_URL}/products`;
    let method = "POST";

    if (selectedId) {
      url = `${API_URL}/products/${selectedId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      credentials: 'include',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data?.detail || 'Khong luu duoc san pham');
      return;
    }
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
      credentials: 'include',
      body: formData,
    });

    const data2 = await res.json();
    alert(selectedPostId ? "Cập nhật bài viết thành công!" : "Tạo bài viết thành công!");
    window.location.reload();
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      <Seo title="Admin" url={absoluteUrl('/admin')} noindex />
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
          onClick={async () => {
            await fetch(`${API_URL}/admin/logout`, {
              method: 'POST',
              credentials: 'include',
            });
            router.push('/admin-login');
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
      {loadError && (
        <div className="mb-6 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          {loadError}
        </div>
      )}
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

          {/* Màu sắc + ảnh theo màu */}
          <div className="mb-6 rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <label className="block font-semibold">Bảng màu và ảnh theo màu</label>
              <button
                type="button"
                onClick={handleAddColor}
                className="rounded bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600"
              >
                + Thêm màu
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-600">Mỗi màu cần ảnh riêng. Màu được tích chọn sẽ là ảnh đại diện cho sản phẩm.</p>
            <div className="space-y-4">
              {colorOptions.map((color, index) => (
                <div key={color.key} className="rounded border border-gray-200 p-3">
                  <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      value={color.hex_code}
                      placeholder="#ffffff"
                      onChange={(e) => handleColorChange(color.key, 'hex_code', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-3"
                    />
                    <label className="flex items-center gap-2 rounded-lg border border-gray-300 p-3">
                      <input
                        type="radio"
                        name="default-color"
                        checked={color.is_default}
                        onChange={() => handleSetDefaultColor(color.key)}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">
                    <input
                      value={color.image_url}
                      placeholder="URL ảnh màu hoặc để trống nếu upload file"
                      onChange={(e) => handleColorChange(color.key, 'image_url', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-3 md:col-span-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleColorChange(color.key, 'file', e.target.files?.[0] || null)}
                      className="w-full rounded-lg border border-gray-300 p-3"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: color.hex_code || '#d9d9d9' }}
                      />
                    </div>
                    {colorOptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color.key)}
                        className="rounded bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        Xóa màu
                      </button>
                    )}
                  </div>

                  {color.image_url && !color.file && (
                    <img src={getImageUrl(color.image_url)} alt="Anh mau" className="mt-3 h-24 rounded object-cover" />
                  )}
                  {color.file && (
                    <p className="mt-2 text-sm text-blue-600">Đã chọn file: {color.file.name}</p>
                  )}
                </div>
              ))}
            </div>
            {imageUrl && (
              <p className="mt-3 text-xs text-gray-500">Ảnh đại diện hiện tại: {imageUrl}</p>
            )}
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
                    font_family_formats: 'Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times,serif; Georgia=georgia,palatino,serif; Tahoma=tahoma,arial,helvetica,sans-serif; Verdana=verdana,geneva,sans-serif; Trebuchet MS=trebuchet ms,helvetica,sans-serif; Courier New=courier new,courier,monospace; Garamond=garamond,serif; Palatino=palatino,book antiqua,palatino linotype,serif; Bookman=bookman,serif; Impact=impact,charcoal,sans-serif; Comic Sans MS=comic sans ms,sans-serif',
                    font_size_formats: '8px 10px 12px 14px 16px 18px 20px 24px 28px 32px 36px 42px 48px 56px 64px 72px 96px',
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                      'preview', 'anchor', 'searchreplace', 'visualblocks',
                      'code', 'fullscreen', 'insertdatetime', 'media', 'table'
                    ],
                    toolbar:
                      'undo redo | fontfamily fontsize formatselect forecolor | bold italic backcolor | alignleft aligncenter table alignright alignjustify | bullist numlist outdent indent | removeformat | image media link',
                    images_upload_handler: handleEditorImageUpload,
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
                  font_family_formats: 'Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times,serif; Georgia=georgia,palatino,serif; Tahoma=tahoma,arial,helvetica,sans-serif; Verdana=verdana,geneva,sans-serif; Trebuchet MS=trebuchet ms,helvetica,sans-serif; Courier New=courier new,courier,monospace; Garamond=garamond,serif; Palatino=palatino,book antiqua,palatino linotype,serif; Bookman=bookman,serif; Impact=impact,charcoal,sans-serif; Comic Sans MS=comic sans ms,sans-serif',
                  font_size_formats: '8px 10px 12px 14px 16px 18px 20px 24px 28px 32px 36px 42px 48px 56px 64px 72px 96px',
                  plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                      'preview', 'anchor', 'searchreplace', 'visualblocks',
                      'code', 'fullscreen', 'insertdatetime', 'media', 'table'
                    ],
                    toolbar:
                      'undo redo | fontfamily fontsize formatselect forecolor | bold italic backcolor | alignleft aligncenter table alignright alignjustify | bullist numlist outdent indent | removeformat | image media link',
                  images_upload_handler: handleEditorImageUpload,
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
