import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ContactForm from './pages/ContactForm';
import DetailProduct from './pages/DetailProduct';
import PriceTable from './pages/PriceTable';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/price-table" element={<PriceTable />} />
            <Route path="/products/:id" element={<DetailProduct />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin"element={localStorage.getItem("admin_token") ? <Admin /> : <Navigate to="/admin-login" />}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
