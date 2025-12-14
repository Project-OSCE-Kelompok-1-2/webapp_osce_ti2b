import React from 'react';

// ... (Kolom struktur props tetap sama)

const OsTableHeader = ({ columns = [], variant = "admin" }) => {

    const isPenguji = variant === "penguji";
    const isMahasiswa = variant === "mahasiswa"; // Tambahkan varian mahasiswa

    // --- Definisi Kelas Warna Kondisional ---

    // Kelas Latar Belakang (Menggunakan warna Dark dari Primary)
    const backgroundClass = (() => {
        if (isMahasiswa) {
            // Mahasiswa: Hijau Primary Dark
            return 'bg-[var(--os-primary-mhs-dark)]';
        }
        if (isPenguji) {
            // Penguji: Oranye Primary Dark
            return 'bg-[var(--os-primary-pj-dark)]';
        }
        // Admin: Biru Primary Dark (Default)
        return 'bg-os-primary-dark';
    })();

    // Kelas Border (Biasanya Putih atau warna kontras terang)
    const borderColorClass = 'border-os-white'; // Tetap Putih untuk semua varian agar kontras dengan latar belakang gelap

    return (
        // Mengganti kelas latar belakang secara keseluruhan
        <div className={`flex text-sm h-[48px] text-os-regular ${backgroundClass} text-white rounded-lg py-os-8`}>
            {columns.map((column, index) => (
                <div
                    key={index}
                    className={`${column.width || 'flex-1'} flex ${column.classes || 'justify-center items-center'}
                        ${index < columns.length - 1 ? `border-r-os-1 ${borderColorClass}` : ''} text-center`}
                >
                    {column.content}
                </div>
            ))}
        </div>
    );
};

export default OsTableHeader;   
