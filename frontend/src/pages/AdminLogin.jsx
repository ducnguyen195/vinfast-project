import { useState } from "react";
import { useRouter } from 'next/router';
import API_URL from '../api/config';
import Seo from '../components/Seo';
import { absoluteUrl } from '../utils/seo';

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
          router.push('/admin');
      } else {
        setError("Sai tai khoan hoac mat khau");
      }
    } catch (e) {
      setError("Khong ket noi duoc API /admin/login");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <Seo title="Admin Login" url={absoluteUrl('/admin-login')} noindex />
      <input
        placeholder="Username"
        className="border p-2 w-full mb-3"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-3"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleLogin}>Login</button>
      {error && <p className="mt-3 text-red-600">{error}</p>}
      
    </div>
  );
}
