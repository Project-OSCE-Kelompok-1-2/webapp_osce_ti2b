import React from "react";
import Sidebar from "../../Components_Riko/Sidebar.js";

// 1. MENGGANTI IMPORT SVG DENGAN LUCIDE-REACT
import {
  Home,
  // Users, (Dihapus)
  // DollarSign, (Dihapus)
  // CreditCard, (Dihapus)
  // BarChart, (Dihapus)
  // PieChart, (Dihapus)
} from "lucide-react";
import OsBreadCrumb from "../../Components_Riko/breadcrumb.js";
import OsCopyright from "../../Components_Riko/copyright.js";

export const AdminDashboard = () => {
  return (
    // 🆕 Tambahkan relative dan overflow-hidden agar sidebar overlay bisa muncul di atas dashboard
    <div className="relative bg-os-white w-full min-h-screen  flex justify-start p-os-12 font-sans overflow-hidden">

      {/* Sidebar dipanggil langsung tanpa kontrol dari dashboard */}
      <Sidebar/>

      {/* Struktur layout dashboard tetap sama */}
      <div
        className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20"
      >
        {/* === HEADER === */}
        <OsBreadCrumb/>

        {/* === MAIN CONTENT === */}
        <main className="relative row-[2_/_3] col-[1_/_2] w-full h-full flex flex-col items-start gap-os-14">
          <h2 className="relative w-fit font-bold text-black text-os-subtitle tracking-[0] leading-[normal] whitespace-nowrap">
            Statistika
          </h2>

          <section
            className="grid grid-cols-1 md:grid-cols-3 gap-os-14 w-full"
            aria-label="Statistics cards"
          >
            <article className="w-full h-[200px] bg-os-white rounded-xl border border-solid border-black p-6 flex flex-col justify-between"></article>
            <article className="w-full h-[200px] bg-os-white rounded-xl border border-solid border-black p-6 flex flex-col justify-between"></article>
            <article className="w-full h-[200px] bg-os-white rounded-xl border border-solid border-black p-6 flex flex-col justify-between"></article>
          </section>

          <hr className="relative w-full border-black border-t" />

          <h2 className="relative w-fit font-bold text-os-subtitle tracking-[0] leading-[normal] whitespace-nowrap">
            Plot
          </h2>

          <section
            className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-os-14 w-full"
            aria-label="Plot charts"
          >
            <article className="w-full h-[360px] bg-os-white rounded-xl border border-solid border-black p-6 flex flex-col items-center justify-center"></article>
            <article className="w-full h-[360px] bg-os-white rounded-xl border border-solid border-black p-6 flex flex-col items-center justify-center"></article>
          </section>
        </main>

        {/* === FOOTER === */}
        <OsCopyright/>
      </div>
    </div>
  );
};

// Ekspor default agar bisa di-render
export default AdminDashboard;
