import React from 'react';

/**
 * Komponen statis untuk menampilkan tabel detail nilai OSCE.
 *
 * @param {Object} props
 * @param {Array<Object>} props.data - Array objek nilai yang akan ditampilkan.
 * Contoh: [{ no: 1, nama_osce: "...", nama_stase: "...", nilai: 96 }]
 */
export default function NilaiDetail({ data = [] }) {
    
    // --- Data Fallback ---
    // Aku pakai data dari screenshot kamu sebagai fallback (data cadangan)
    // Jadi, kalau prop 'data' yang kamu kirim kosong, komponen ini tetap nampilin sesuatu.
    // Nanti kalau BE-nya udah siap, data ini bakal otomatis diganti sama data dari prop.
    const fallbackData = [
        { no: 1, nama_osce: "Kesehatan Jantung Mafkar", nama_stase: "Keterampilan Membedah Jantung", nilai: 96 },
        { no: 2, nama_osce: "Kerusakan Otak dan Pola Pikir", nama_stase: "Keterampilan Menjahit", nilai: 69 },
        { no: 3, nama_osce: "Kerusakan Otak dan Pola Pikir", nama_stase: "Keterampilan Membedah", nilai: 96 },
        { no: 4, nama_osce: "Kerusakan Otak dan Pola Pikir", nama_stase: "Analisis Penyelesaian", nilai: 69 },
        { no: 5, nama_osce: "Pertolongan Pertama Pada Kecelakaan", nama_stase: "Analisis Obat yang diberikan", nilai: 96 },
    ];

    // Cek apakah data dari prop ada isinya, kalau nggak, pakai data fallback
    const displayData = data && data.length > 0 ? data : fallbackData;

    // Class dasar untuk layout grid setiap baris
    // Kolom: [No (kecil), Nama OSCE (besar), Nama Stase (besar), Nilai (kecil)]
    const rowGridClasses = "grid grid-cols-[60px_1fr_1fr_100px] items-center px-5 py-3.5";

    return (
        // Container utama, menggunakan flex-col dengan gap antar baris
        <div className="w-full flex flex-col gap-2"> 
            
            {/* Header Row (Baris Judul) */}
            <div 
                className={`
                    ${rowGridClasses} 
                    bg-black text-white font-semibold 
                    rounded-xl {/* Sesuai gambar, header punya rounded corner */}
                `}
            >
                <span className="text-left">No</span>
                <span className="text-left">Nama OSCE</span>
                <span className="text-left">Nama Stase</span>
                <span className="text-left">Nilai</span>
            </div>

            {/* Data Rows (Baris Data) */}
            {/* Kita mapping/looping data yang mau ditampilkan */}
            {displayData.map((item, index) => (
                <div
                    key={item.no || index} // Pakai 'no' sebagai key unik
                    className={`
                        ${rowGridClasses}
                        rounded-xl border border-os-1 border-os-black
                        text-black
                        ${index % 2 !== 0 ? 'bg-gray-200' : 'bg-white'} {/* Logic warna selang-seling */}
                    `}
                >
                    <span className="text-left">{item.no}</span>
                    <span className="text-left">{item.nama_osce}</span>
                    <span className="text-left">{item.nama_stase}</span>
                    {/* Nilai dibuat tebal (semibold) sesuai gambar */}
                    <span className="text-left font-semibold">{item.nilai}</span>
                </div>
            ))}

        </div>
    );
}