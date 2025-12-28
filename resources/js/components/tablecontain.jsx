import React from "react";

const OsTableBody = ({ data = [], columns = [], variant = "admin" }) => {

    const isPenguji = variant === "penguji";
    const isMahasiswa = variant === "mahasiswa"; 

    const oddBgClass = (() => {
        if (isMahasiswa) {
            return "bg-green-50";
        }
        if (isPenguji) {
            return "bg-orange-50";
        }
        return "bg-blue-50";
    })();


    const evenBgClass = isMahasiswa ? "bg-white" : isPenguji ? "bg-os-white" : "bg-white"; 


    const dividerClass = (() => {
        if (isMahasiswa) {
            return "bg-green-500";
        }
        if (isPenguji) {
            return "bg-orange-500";
        }
        return "bg-blue-500";
    })();

    return (
        <div className="flex flex-col rounded-lg overflow-hidden">
            {data.map((row, rowIndex) => (
                <div
                    key={rowIndex}
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
