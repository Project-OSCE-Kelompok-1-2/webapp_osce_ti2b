// import { Head, router, useForm, usePage, Link } from "@inertiajs/react";
// import { ChevronLeft, Trash2, Send } from "lucide-react";
// import React, { useState } from "react";
// import Modals from "@/Components/Modals"; // ⬅️ PENTING: import Modals

// export default function TambahOsce({ tahunAkademikOptions = [], osce = null }) {
//     const { errors } = usePage().props;

//     const isEditMode = !!osce;

//     const { data, setData, post, put, processing, reset } = useForm({
//         nama_osce: osce ? osce.nama_osce : "",
//         id_tahun_akademik: osce ? osce.id_tahun_akademik : "",
//         tanggal_mulai: osce ? osce.tanggal_mulai : "",
//         tanggal_selesai: osce ? osce.tanggal_selesai : "",
//     });

//     // ============================
//     // STATE MODALS
//     // ============================
//     const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

//     function openDeleteModal() {
//         setDeleteModalOpen(true);
//     }

//     function closeDeleteModal() {
//         setDeleteModalOpen(false);
//     }

//     // Confirm delete → Reset form
//     function handleConfirmDelete() {
//         reset();
//         closeDeleteModal();
//     }

//     function handleSubmit(e) {
//         e.preventDefault();

//         if (isEditMode) {
//             put(`/admin/osce/${osce.id_osce}`, {
//                 onSuccess: () => router.get("/admin/osce"),
//             });
//         } else {
//             post("/admin/osce", {
//                 onSuccess: () => router.get("/admin/osce"),
//             });
//         }
//     }

//     return (
//         <div className="min-h-screen flex flex-col bg-white">
//             <Head title="Tambah OSCE" />

//             {/* HEADER */}
//             <header className="flex items-center gap-3 p-4 border-b bg-gray-50">
//                 <Link
//                     href="/admin/osce"
//                     className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 flex items-center justify-center transition"
//                 >
//                     <ChevronLeft size={20} />
//                 </Link>

//                 <input
//                     type="text"
//                     value="OSCE / Tambah OSCE"
//                     readOnly
//                     className="border rounded-lg px-4 py-2 text-sm w-full focus:outline-none bg-white"
//                 />
//             </header>

//             {/* MAIN */}
//             <main className="flex flex-1 items-center justify-center py-[5rem]">
//                 <form
//                     onSubmit={handleSubmit}
//                     className="w-full max-w-[400px] border rounded-xl overflow-hidden "
//                 >
//                     {/* CARD HEADER */}
//                     <div className="bg-gray-800 text-white p-5 text-center">
//                         <h2 className="text-lg font-semibold mb-1">
//                             Form Tambah OSCE
//                         </h2>
//                         <p className="text-gray-400 text-sm max-w-sm mx-auto">
//                             Silakan isi form berikut untuk menambahkan data OSCE baru.
//                         </p>
//                     </div>

//                     {/* FORM BODY */}
//                     <div className="p-5 space-y-4">

//                         {/* Nama OSCE */}
//                         <div>
//                             <label className="text-sm font-medium text-gray-700">
//                                 Nama OSCE
//                             </label>
//                             <input
//                                 type="text"
//                                 placeholder="Masukkan nama OSCE..."
//                                 className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
//                                     errors.nama_osce
//                                         ? "border-red-500 ring-red-500"
//                                         : "focus:ring-blue-500 border-gray-300"
//                                 }`}
//                                 value={data.nama_osce}
//                                 onChange={(e) =>
//                                     setData("nama_osce", e.target.value)
//                                 }
//                             />
//                             {errors.nama_osce && (
//                                 <div className="text-red-500 text-xs mt-1">
//                                     {errors.nama_osce}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Tahun Akademik */}
//                         <div>
//                             <label className="text-sm font-medium text-gray-700">
//                                 Tahun Akademik
//                             </label>
//                             <select
//                                 className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
//                                     errors.id_tahun_akademik
//                                         ? "border-red-500 ring-red-500"
//                                         : "focus:ring-blue-500 border-gray-300"
//                                 } bg-white`}
//                                 value={data.id_tahun_akademik}
//                                 onChange={(e) =>
//                                     setData("id_tahun_akademik", e.target.value)
//                                 }
//                             >
//                                 <option value="">Pilih Tahun</option>
//                                 {tahunAkademikOptions.map((opt) => (
//                                     <option key={opt.value} value={opt.value}>
//                                         {opt.label}
//                                     </option>
//                                 ))}
//                             </select>
//                             {errors.id_tahun_akademik && (
//                                 <div className="text-red-500 text-xs mt-1">
//                                     {errors.id_tahun_akademik}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Jadwal */}
//                         <div className="flex gap-3">
//                             <div className="w-1/2">
//                                 <label className="text-sm font-medium text-gray-700">
//                                     Jadwal Mulai
//                                 </label>
//                                 <input
//                                     type="date"
//                                     className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-white"
//                                     value={data.tanggal_mulai}
//                                     onChange={(e) =>
//                                         setData("tanggal_mulai", e.target.value)
//                                     }
//                                 />
//                                 {errors.tanggal_mulai && (
//                                     <p className="text-red-500 text-xs mt-1">
//                                         {errors.tanggal_mulai}
//                                     </p>
//                                 )}
//                             </div>

//                             <div className="w-1/2">
//                                 <label className="text-sm font-medium text-gray-700">
//                                     Jadwal Akhir
//                                 </label>
//                                 <input
//                                     type="date"
//                                     className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-white"
//                                     value={data.tanggal_selesai}
//                                     onChange={(e) =>
//                                         setData("tanggal_selesai", e.target.value)
//                                     }
//                                 />
//                                 {errors.tanggal_selesai && (
//                                     <p className="text-red-500 text-xs mt-1">
//                                         {errors.tanggal_selesai}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>

//                         {/* BUTTONS */}
//                         <div className="flex items-center justify-between pt-[5rem]">
//                             <button
//                                 type="submit"
//                                 disabled={processing}
//                                 className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm flex-1 mr-2 transition disabled:opacity-50"
//                             >
//                                 <Send size={16} className="mr-2" />
//                                 {processing ? "Menyimpan..." : "Submit"}
//                             </button>

//                             {/* DELETE → BUKA MODAL */}
//                             <button
//                                 type="button"
//                                 onClick={openDeleteModal}
//                                 className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition"
//                             >
//                                 <Trash2 size={16} />
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </main>

//             {/* FOOTER */}
//             <footer className="border text-center text-gray-600 text-xs py-3 mt-4 mx-4 rounded-lg bg-gray-50">
//                 © 2025 — OSCE Management System
//             </footer>

//             {/* ======================= */}
//             {/* MODALS DELETE           */}
//             {/* ======================= */}
//             <Modals
//                 isOpen={isDeleteModalOpen}
//                 onClose={closeDeleteModal}
//                 onConfirm={handleConfirmDelete}
//                 variant="delete"
//                 title="Reset Form?"
//                 message="Apakah Anda yakin ingin menghapus seluruh isi form? Data yang sudah diketik akan hilang."
//                 dataToDelete={[
//                     { key: "Nama OSCE", value: data.nama_osce || "-" },
//                     { key: "Tahun Akademik", value: data.id_tahun_akademik || "-" },
//                     { key: "Tanggal Mulai", value: data.tanggal_mulai || "-" },
//                     { key: "Tanggal Selesai", value: data.tanggal_selesai || "-" },
//                 ]}
//                 confirmText="Hapus Data Form"
//             />
//         </div>
//     );
// }
