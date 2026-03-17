import '../src/index.css';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import FloatingContact from '../src/components/FloatingContact';

export default function App({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow pb-24">
        <Component {...pageProps} />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}
