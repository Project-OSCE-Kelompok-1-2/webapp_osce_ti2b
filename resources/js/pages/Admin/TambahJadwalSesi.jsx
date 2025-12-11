// import React from "react";
// import { router, useForm, Head } from "@inertiajs/react";
// import { ChevronLeft, Save, Calendar, Clock, List } from "lucide-react";

// // 1. Terima props baru: 'sesi' dan 'stase_terpilih'
// //    Beri nilai default null/[] agar halaman Create tidak error
// export default function TambahJadwalSesi({
//     osce,
//     stase_options = [],
//     sesi = null,
//     stase_terpilih = [],
// }) {
//     // 2. Tentukan mode Edit
//     const isEditMode = !!sesi; // true jika 'sesi' (bukan mock) ada isinya

//     // 3. Gunakan useForm untuk state management
//     //    Isi 'data' awal berdasarkan props 'sesi' dan 'stase_terpilih'
//     const { data, setData, post, put, processing, errors, reset } = useForm({
//         tanggal: sesi?.tanggal || "",
//         jam_mulai: sesi?.jam_mulai || "",
//         jam_selesai: sesi?.jam_selesai || "",
//         stase_ids: stase_terpilih || [], // Gunakan stase_terpilih
//     });

//     // 4. Fungsi untuk menangani checkbox stase
//     function handleStaseCheck(e) {
//         const { value, checked } = e.target;
//         const id = parseInt(value);

//         if (checked) {
//             setData("stase_ids", [...data.stase_ids, id]);
//         } else {
//             setData(
//                 "stase_ids",
//                 data.stase_ids.filter((item) => item !== id)
//             );
//         }
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (isEditMode) {
//             // Jika mode Edit, kirim PUT ke route 'update'
//             const sesiId = `${sesi.tanggal}_${sesi.jam_mulai}`; // ID sesi lama
//             put(`/admin/osce/${osce.id_osce}/jadwal/${sesiId}`);
//         } else {
//             // Jika mode Create, kirim POST ke route 'store'
//             post(`/admin/osce/${osce.id_osce}/jadwal`);
//         }
//     };

//     // 6. Navigasi dinamis
//     const handleBack = () => {
//         router.visit(`/admin/osce/${osce.id_osce}/jadwal`);
//     };

//     return (
//         <div className="flex flex-col min-h-screen bg-white">
//             {/* 7. Judul Halaman Dinamis */}
//             <Head
//                 title={
//                     isEditMode
//                         ? `Edit Sesi - ${osce.nama_osce}`
//                         : `Tambah Sesi - ${osce.nama_osce}`
//                 }
//             />

//             {/* Header/Breadcrumb Dinamis */}
//             <header className="flex items-center gap-3 text-sm text-gray-700 p-4 border-b border-gray-300 bg-white">
//                 <button
//                     type="button"
//                     onClick={handleBack}
//                     className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 flex items-center justify-center"
//                 >
//                     <ChevronLeft size={20} />
//                 </button>
//                 <div className="flex-1 border border-gray-400 rounded-lg px-4 py-2 text-sm font-medium bg-white">
//                     OSCE / {osce.nama_osce} / Jadwal Sesi /{" "}
//                     {isEditMode ? "Edit Sesi" : "Tambah Sesi"}
//                 </div>
//             </header>

//             <main className="flex-1 flex items-center justify-center p-6">
//                 <form
//                     onSubmit={handleSubmit}
//                     className="w-full max-w-2xl border rounded-lg -sm bg-white overflow-hidden"
//                 >
//                     {/* 8. Judul Form Dinamis */}
//                     <div className="bg-gray-900 text-white p-5 text-center">
//                         <h2 className="text-lg font-semibold">
//                             {isEditMode
//                                 ? "Form Edit Jadwal Sesi"
//                                 : "Form Jadwal Sesi Baru"}
//                         </h2>
//                         <p className="text-xs text-gray-300 mt-1">
//                             {isEditMode
//                                 ? `Mengedit sesi untuk OSCE: ${osce.nama_osce}`
//                                 : `Buat sesi baru untuk OSCE: ${osce.nama_osce}`}
//                         </p>
//                     </div>

//                     {/* 9. Form Fields (sekarang sudah terisi otomatis jika edit) */}
//                     <div className="p-6 space-y-5">
//                         {/* Tanggal */}
//                         <div>
//                             <label
//                                 htmlFor="tanggal"
//                                 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
//                             >
//                                 <Calendar size={16} /> Tanggal Sesi
//                             </label>
//                             <input
//                                 id="tanggal"
//                                 type="date"
//                                 value={data.tanggal} // Terisi otomatis
//                                 onChange={(e) =>
//                                     setData("tanggal", e.target.value)
//                                 }
//                                 className={`w-full border rounded-lg p-3 text-sm ${
//                                     errors.tanggal
//                                         ? "border-red-500"
//                                         : "border-gray-400"
//                                 }`}
//                             />
//                             {errors.tanggal && (
//                                 <div className="text-xs text-red-600 mt-1">
//                                     {errors.tanggal}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Jam Mulai & Selesai */}
//                         <div className="flex gap-4">
//                             <div className="flex-1">
//                                 <label
//                                     htmlFor="jam_mulai"
//                                     className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
//                                 >
//                                     <Clock size={16} /> Jam Mulai
//                                 </label>
//                                 <input
//                                     id="jam_mulai"
//                                     type="time"
//                                     value={data.jam_mulai} // Terisi otomatis
//                                     onChange={(e) =>
//                                         setData("jam_mulai", e.target.value)
//                                     }
//                                     className={`w-full border rounded-lg p-3 text-sm ${
//                                         errors.jam_mulai
//                                             ? "border-red-500"
//                                             : "border-gray-400"
//                                     }`}
//                                 />
//                                 {errors.jam_mulai && (
//                                     <div className="text-xs text-red-600 mt-1">
//                                         {errors.jam_mulai}
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="flex-1">
//                                 <label
//                                     htmlFor="jam_selesai"
//                                     className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
//                                 >
//                                     <Clock size={16} /> Jam Selesai
//                                 </label>
//                                 <input
//                                     id="jam_selesai"
//                                     type="time"
//                                     value={data.jam_selesai} // Terisi otomatis
//                                     onChange={(e) =>
//                                         setData("jam_selesai", e.target.value)
//                                     }
//                                     className={`w-full border rounded-lg p-3 text-sm ${
//                                         errors.jam_selesai
//                                             ? "border-red-500"
//                                             : "border-gray-400"
//                                     }`}
//                                 />
//                                 {errors.jam_selesai && (
//                                     <div className="text-xs text-red-600 mt-1">
//                                         {errors.jam_selesai}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Pilihan Stase */}
//                         <div>
//                             <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                                 <List size={16} /> Pilih Stase untuk Sesi Ini
//                             </label>
//                             <div className="w-full border border-gray-400 rounded-lg p-4 h-64 overflow-y-auto space-y-2">
//                                 {stase_options.length > 0 ? (
//                                     stase_options.map((stase) => (
//                                         <label
//                                             key={stase.value}
//                                             className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
//                                         >
//                                             <input
//                                                 type="checkbox"
//                                                 value={stase.value}
//                                                 checked={data.stase_ids.includes(
//                                                     stase.value
//                                                 )}
//                                                 onChange={handleStaseCheck}
//                                                 className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
//                                             />
//                                             <span className="text-sm text-gray-800">
//                                                 {stase.label}
//                                             </span>
//                                         </label>
//                                     ))
//                                 ) : (
//                                     <p className="text-sm text-gray-500 text-center py-4">
//                                         Tidak ada stase yang tersedia untuk sesi
//                                         ini.
//                                     </p>
//                                 )}
//                             </div>
//                             {errors.stase_ids && (
//                                 <div className="text-xs text-red-600 mt-1">
//                                     {errors.stase_ids}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Tombol Submit */}
//                         <div className="flex items-center gap-3 pt-4 justify-center">
//                             <button
//                                 type="submit"
//                                 disabled={processing}
//                                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
//                             >
//                                 <Save size={16} />
//                                 {processing
//                                     ? "Menyimpan..."
//                                     : isEditMode
//                                     ? "Update Sesi"
//                                     : "Simpan Sesi"}
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </main>

//             <footer className="border-t border-gray-300 p-3 text-center text-xs text-gray-600 bg-white">
//                 Copyright © Lorem ipsum dolor sit amet.
//             </footer>
//         </div>
//     );
// }
