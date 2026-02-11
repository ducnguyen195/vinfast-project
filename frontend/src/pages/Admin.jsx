import { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  // load list sản phẩm
  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data.data));
  }, []);

  const handleSelectProduct = async (id) => {
    setSelectedId(id);

    if (!id) {
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setContent("");
      return;
    }

    const res = await fetch(`http://localhost:8000/api/products/${id}`);
    const result = await res.json();

    setName(result.data.name || "");
    setDescription(result.data.description || "");
    setPrice(result.data.price || "");
    setImageUrl(result.data.image_url || "");
    setContent(result.data.content || "");
  };

  const handleSubmit = async () => {
    const payload = {
      name,
      description,
      price: Number(price),
      image_url: imageUrl,
      content,
    };

    let url = "http://localhost:8000/api/products";
    let method = "POST";

    if (selectedId) {
      url = `http://localhost:8000/api/products/${selectedId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "admin-token": localStorage.getItem("admin_token"),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    alert(selectedId ? "Cập nhật thành công!" : "Tạo sản phẩm xong!");
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {selectedId ? "Admin - Sửa sản phẩm" : "Admin - Tạo sản phẩm"}
        </h2>

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
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3"
        />
      </div>

      {/* Mô tả */}
      <div className="mb-5">
        <label className="block font-semibold mb-2">Mô tả ngắn</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3"
        />
      </div>

      {/* Giá */}
      <div className="mb-5">
        <label className="block font-semibold mb-2">Giá</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3"
        />
      </div>

      {/* Ảnh */}
      <div className="mb-5">
        <label className="block font-semibold mb-2">Ảnh đại diện</label>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3"
        />
      </div>

      {/* CKEditor */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Nội dung chi tiết</label>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <CKEditor
            editor={ClassicEditor}
            data={content}
            onChange={(event, editor) => {
              setContent(editor.getData());
            }}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg"
      >
        {selectedId ? "Cập nhật sản phẩm" : "Lưu sản phẩm"}
      </button>
    </div>
  );
}
