import React from 'react';


const OsTableHeader = ({ columns = [], variant = "admin" }) => {

    const isPenguji = variant === "penguji";
    const isMahasiswa = variant === "mahasiswa"; 

    const backgroundClass = (() => {
        if (isMahasiswa) {
            return 'bg-[var(--os-primary-mhs-dark)]';
        }
        if (isPenguji) {
            return 'bg-[var(--os-primary-pj-dark)]';
        }
        return 'bg-os-primary-dark';
    })();

    const borderColorClass = 'border-os-white'; 

    return (
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
