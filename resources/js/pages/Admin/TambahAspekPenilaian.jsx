// import React from "react";
// import { useForm, usePage, Link } from "@inertiajs/react";

// export default function TambahAspekPenilaian() {
//     const { stase, aspek = null, errors } = usePage().props;

//     const isEditMode = !!aspek;

//     const { data, setData, post, put, processing } = useForm({
//         // Sesuaikan nama field dengan kolom database
//         aspek: aspek?.aspek || "",
//         bobot_maksimum: aspek?.bobot_maksimum || "",
//     });

//     // 4. Fungsi untuk mengirim data ke backend
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (isEditMode) {
//             // Jika mode edit, kirim request PUT ke URL update
//             put(`/admin/aspek-penilaian/${aspek.id_aspek_penilaian}`);
//         } else {
//             // Jika mode tambah, kirim request POST ke URL store
//             post(`/admin/stase/${stase.id_stase}/aspek-penilaian`);
//         }
//     };

//     const pageTitle = isEditMode
//         ? "Edit Aspek Penilaian"
//         : "Tambah Aspek Penilaian";
//     const formTitle = isEditMode
//         ? "Form Edit Aspek Penilaian"
//         : "Form Tambah Aspek Penilaian";

//     return (
//         <div className="p-4 space-y-6 bg-os-white">
//             <div className="flex items-center gap-3 text-sm text-gray-700 mb-6 border rounded-lg p-2 bg-os-white ">
//                 {/* 👇 [UBAH] Tombol 'kembali' diubah menjadi Link agar lebih efisien */}
//                 <Link
//                     href={`/admin/stase/${stase.id_stase}/aspek-penilaian`}
//                     className="bg-blue-600 text-white p-2 rounded-md flex items-center justify-center hover:bg-blue-700 transition"
//                     title="Kembali"
//                 >
//                     {/* Ikon Panah Kembali */}
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={2.5}
//                         stroke="currentColor"
//                         className="w-5 h-5"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
//                         />
//                     </svg>
//                 </Link>
//                 {/* Breadcrumb dinamis */}
//                 <span className="font-medium">
//                     Stase / {stase.nama_stase} / {pageTitle}
//                 </span>
//             </div>

//             <div className="max-w-xl mx-auto border-2 rounded-lg overflow-hidden">
//                 <div className="bg-gray-800 text-white px-6 py-5 text-center">
//                     {/* Judul form dinamis */}
//                     <h2 className="font-semibold text-xl">{formTitle}</h2>
//                     <p className="text-sm text-gray-300 mt-1">
//                         Dosen Penguji : Tahan Prahara., S.T., M.Kom
//                     </p>
//                 </div>

//                 <form
//                     onSubmit={handleSubmit}
//                     className="bg-os-white p-6 space-y-5"
//                 >
//                     <div>
//                         <label
//                             htmlFor="nama-aspek"
//                             className="text-sm font-medium text-gray-700 block mb-2"
//                         >
//                             Nama Aspek Penilaian
//                         </label>
//                         <textarea
//                             id="nama-aspek"
//                             value={data.aspek}
//                             onChange={(e) => setData("aspek", e.target.value)}
//                             className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
//                             rows={5}
//                             required
//                         ></textarea>
//                         {/* [BARU] Tampilkan error jika ada */}
//                         {errors.aspek && (
//                             <p className="text-red-500 text-xs mt-1">
//                                 {errors.aspek}
//                             </p>
//                         )}
//                     </div>

//                     <div>
//                         <label
//                             htmlFor="bobot-maksimal"
//                             className="text-sm font-medium text-gray-700 block mb-2"
//                         >
//                             Bobot Maksimal Aspek Penilaian
//                         </label>
//                         <input
//                             id="bobot-maksimal"
//                             type="number"
//                             value={data.bobot_maksimum}
//                             onChange={(e) =>
//                                 setData("bobot_maksimum", e.target.value)
//                             }
//                             className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
//                             required
//                         />
//                         {/* [BARU] Tampilkan error jika ada */}
//                         {errors.bobot_maksimum && (
//                             <p className="text-red-500 text-xs mt-1">
//                                 {errors.bobot_maksimum}
//                             </p>
//                         )}
//                     </div>

//                     <div className="pt-2">
//                         <div className="flex items-center gap-3">
//                             <button
//                                 type="submit"
//                                 disabled={processing}
//                                 className={` ${
//                                     isEditMode ? "flex-1" : "w-full"
//                                 } bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 hover:bg-blue-700  transition disabled:opacity-50`}
//                             >
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     strokeWidth={2}
//                                     stroke="currentColor"
//                                     className="w-5 h-5"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                                     />
//                                 </svg>
//                                 {processing ? "Menyimpan..." : "Submit"}
//                             </button>

//                             {isEditMode && (
//                                 <button
//                                     type="button"
//                                     className="bg-red-600 text-white p-3 rounded-lg  hover:bg-red-700 transition"
//                                     title="Hapus"
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                         strokeWidth={2}
//                                         stroke="currentColor"
//                                         className="w-5 h-5"
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.498 0c-.34.052-.68.107-1.022.166m11.022 0L12 5.4g-2.5-3.15V5.4H4.5m15 0a48.108 48.108 0 01-3.478-.397m-12.498 0c-.34.052-.68.107-1.022.166"
//                                         />
//                                     </svg>
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </form>
//             </div>

//             <div className="text-center text-gray-400 text-sm mt-16 border-t pt-4">
//                 Copyright Porem ipsum dolor sit ametPorem ipsum dolor sit amet
//             </div>
//         </div>
//     );
// }
