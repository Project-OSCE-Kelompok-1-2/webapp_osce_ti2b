import React from "react";
import Sidebar from "../../Components/Sidebar.jsx";

// 1. MENGGANTI IMPORT SVG DENGAN LUCIDE-REACT
import {
  Home,
  // Users, (Dihapus)
  // DollarSign, (Dihapus)
  // CreditCard, (Dihapus)
  // BarChart, (Dihapus)
  // PieChart, (Dihapus)
} from "lucide-react";

export const AdminDashboard = () => {
  return (
    // 🆕 Tambahkan relative dan overflow-hidden agar sidebar overlay bisa muncul di atas dashboard
    <div className="relative bg-gray-100 w-full min-h-screen flex justify-center p-6 font-sans overflow-hidden">
      
      {/* Sidebar dipanggil langsung tanpa kontrol dari dashboard */}
      <Sidebar />

      {/* Struktur layout dashboard tetap sama */}
      <div
        className="grid w-full max-w-7xl h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-2.5 transition-all duration-300 md:ml-20"
      >
        {/* === HEADER === */}
        <header className="relative row-[1_/_2] col-[1_/_2] w-full flex flex-col items-start gap-5 bg-white p-4 rounded-xl shadow-sm border border-gray-900">
          <div className="flex items-center justify-between relative self-stretch w-full">
            
            {/* Tombol Home tetap tampil, tapi tidak lagi mengontrol sidebar */}
            <button
              className="flex w-[54px] h-[54px] items-center justify-center gap-[13px] p-3 relative bg-blue-600 text-white rounded-xl border border-solid border-black aspect-[1]"
              aria-label="Home"
            >
              <Home className="relative w-[30px] h-[26px]" />
            </button>

            {/* Dibuat fleksibel */}
            <div className="relative flex-1 h-[54px] ml-4">
              <div className="w-full h-full flex items-center bg-white rounded-xl overflow-hidden border border-solid border-black">
                <h1 className="h-6 ml-5 [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                  Beranda
                </h1>
              </div>
            </div>
          </div>

          <hr className="relative w-full border-black border-t" />
        </header>

        {/* === MAIN CONTENT === */}
        <main className="relative row-[2_/_3] col-[1_/_2] w-full h-full flex flex-col items-start gap-5">
          <h2 className="relative w-fit [font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap">
            Statistika
          </h2>

          <section
            className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full"
            aria-label="Statistics cards"
          >
            <article className="w-full h-[200px] bg-white rounded-xl border border-solid border-black p-6 flex flex-col justify-between"></article>
            <article className="w-full h-[200px] bg-white rounded-xl border border-solid border-black p-6 flex flex-col justify-between"></article>
            <article className="w-full h-[200px] bg-white rounded-xl border border-solid border-black p-6 flex flex-col justify-between"></article>
          </section>

          <hr className="relative w-full border-black border-t" />

          <h2 className="relative w-fit [font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap">
            Plot
          </h2>

          <section
            className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5 w-full"
            aria-label="Plot charts"
          >
            <article className="w-full h-[360px] bg-white rounded-xl border border-solid border-black p-6 flex flex-col items-center justify-center"></article>
            <article className="w-full h-[360px] bg-white rounded-xl border border-solid border-black p-6 flex flex-col items-center justify-center"></article>
          </section>
        </main>

        {/* === FOOTER === */}
        <footer className="relative row-[3_/_4] col-[1_/_2] w-full h-full flex flex-col items-center justify-end bg-white p-4 rounded-xl shadow-sm border border-gray-900">
          <div className="relative self-stretch w-full">
            <div className="w-full h-full flex">
              <div className="flex-1 flex items-center">
                <p className="[font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-base tracking-[0] leading-[normal] whitespace-nowrap">
                  Copyright Porem ipsum dolor sit amet
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Ekspor default agar bisa di-render
export default AdminDashboard;
