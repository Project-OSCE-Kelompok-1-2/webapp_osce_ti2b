import React from 'react';

// ... (Kolom struktur props tetap sama)

const OsTableHeader = ({ columns = [], variant = "admin" }) => {

    const isPenguji = variant === "penguji";

    // Kelas Latar Belakang
    // Jika 'penguji', gunakan kelas yang menghasilkan warna oranye.
    // Jika 'admin' (default), gunakan kelas default: bg-os-primary-dark
    const backgroundClass = isPenguji
        ? 'bg-os-primary-pj' // Ganti dengan kelas oranye yang sudah Anda definisikan (misalnya: bg-amber-600)
        : 'bg-os-primary-dark';

    // Kelas Border
    // Jika 'penguji', Anda mungkin ingin border-nya juga berubah
    const borderColorClass = isPenguji
        ? 'border-os-white' // Ganti dengan kelas warna border oranye yang sesuai
        : 'border-os-white';

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
