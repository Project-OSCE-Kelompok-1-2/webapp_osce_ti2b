import React from "react";

// Tambahkan 'variant' dengan default 'admin'
const OsTableBody = ({ data = [], columns = [], variant = "admin" }) => {

    const isPenguji = variant === "penguji";

    // --- Definisi Kelas Warna Kondisional ---

    // Kelas latar belakang untuk baris ganjil (rowIndex % 2 !== 0)
    const oddBgClass = isPenguji ? "bg-orange-50" : "bg-blue-50";

    // Kelas latar belakang untuk baris genap (rowIndex % 2 === 0)
    const evenBgClass = isPenguji ? "bg-os-white" : "bg-b";

    // Kelas untuk garis pemisah vertikal antar kolom
    const dividerClass = isPenguji ? "bg-orange-500" : "bg-blue-500";

    return (
        <div className="flex flex-col rounded-lg overflow-hidden">
            {data.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    // Terapkan kelas latar belakang secara kondisional
                    className={`flex text-sm h-[83px] text-os-regular
                        ${rowIndex % 2 === 0 ? evenBgClass : oddBgClass}
                        items-center relative`}
                >
                    {columns.map((col, colIndex) => (
                        <div
                            key={colIndex}
                            className={`relative ${
                                col.width || "flex-1"
                            } flex ${col.classes || "justify-center items-center"} text-center`}
                        >
                            {row[col.key]}

                            {colIndex < columns.length - 1 && (
                                // Terapkan kelas garis pemisah secara kondisional
                                <div className={`absolute right-0 top-1/2 -translate-y-1/2 h-[61px] w-px ${dividerClass}`} />
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default OsTableBody;
