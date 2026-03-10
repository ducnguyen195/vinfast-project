import Seo from '../components/Seo';
import { absoluteUrl } from '../utils/seo';

const cars = [
    {
    name: "Vinfast VF3",
    image: "/images/products/vinfast-vf3.png",
    versions: [
      {
        name: "Vinfast VF3 - Kèm Pin",
        price: "299.000.000 VND"
      }
    ]
  },
  {
    name: "Vinfast VF5",
    image: "/images/products/vinfast-vf5.png",
    versions: [
      {
        name: "Vinfast VF5 Plus - Kèm Pin",
        price: "529.000.000 VND"
      }
    ]
  },
  {
    name: "Vinfast VF6",
    image: "/images/products/vinfast-vf6.png",
    versions: [
      {
        name: "VinFast VF6 Eco - Nâng Cấp",
        price: "694.000.000 VND"
      },
      {
        name: "VinFast VF6 Plus - Nâng Cấp",
        price: "759.000.000 VND"
      }
    ]
  },
  {
    name: "Vinfast VF7",
    image: "/images/products/vinfast-vf7.png",
    versions: [
        {
        name: "VinFast VF7 Eco - Kèm Pin",
        price: "799.000.000 VND"
      },
      {
        name: "VinFast VF7 Eco - Nâng Cấp",
        price: "999.000.000 VND"
      },
      {
        name: "VinFast VF7 Plus - Nâng Cấp",
        price: "1.019.000.000 VND"
      }
    ]
  },
  {
    name: "Vinfast VF8",
    image: "/images/products/vinfast-vf8.png",
    versions: [
      {
        name: "VinFast VF8 Eco - Nâng Cấp",
        price: "1.069.000.000 VND"
      },
      {
        name: "VinFast VF8 Plus - Kèm Pin",
        price: "1.199.000.000 VND"
      }
    ]
  },
  {
    name: "Vinfast VF9",
    image: "/images/products/vinfast-vf9.png",
    versions: [
      {
        name: "VinFast VF9 Eco - Kèm Pin",
        price: "1.499.000.000 VND"
      },
      {
        name: "VinFast VF9 Plus - Kèm Pin",
        price: "1.699.000.000 VND"
      }
    ]
  }

];

export default function PriceSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      <Seo
        title="Bảng giá xe VinFast mới nhất"
        description="Cập nhật bảng giá VinFast VF3, VF5, VF6, VF7, VF8, VF9 mới nhất cùng ưu đãi tại VinFast Hà Thành."
        url={absoluteUrl('/price-table')}
      />

      {cars.map((car, idx) => (
        <div key={idx}>
          
          {/* Thanh thông báo */}
          <div className="bg-gray-100 border-l-4 border-orange-500 p-4 mb-6 text-gray-700">
            🔊 Giá trên là giá công bố của Hãng. 
            <span className="text-red-600 font-semibold">
              {" "}Giá tốt nhất + Khuyến mãi nhiều nhất{" "}
            </span>
            hãy gọi ngay cho Phòng Bán Hàng.
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            {/* Ảnh xe */}
            <div>
              <h2 className="text-2xl font-bold mb-4">{car.name}</h2>
              <img
                src={car.image}
                alt={car.name}
                className="w-full object-contain"
              />
            </div>

            {/* Bảng giá */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-center">
                GIẢM GIÁ TIỀN MẶT HẤP DẪN
              </h3>

              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border">Tên phiên bản</th>
                    <th className="p-3 text-left border">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {car.versions.map((v, i) => (
                    <tr key={i}>
                      <td className="p-3 border font-medium">
                        {v.name}
                      </td>
                      <td className="p-3 border text-red-600 font-bold">
                        {v.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
