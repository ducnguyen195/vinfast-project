import '../src/index.css';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';

export default function App({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
