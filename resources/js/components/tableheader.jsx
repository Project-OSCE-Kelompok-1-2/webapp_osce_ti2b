import React from 'react';

// Struktur props untuk mendefinisikan setiap kolom
// Contoh penggunaan:
// const columns = [
//   { content: 'No', width: 'w-16', classes: 'justify-center' },
//   { content: 'Nama Stase', width: 'flex-1', classes: 'justify-start px-4' },
// ];

const OsTableHeader = ({ columns = [] }) => {
  return (
    <div className="flex text-sm h-[48px] text-os-regular bg-os-primary-dark text text-white rounded-lg py-os-8">
      {columns.map((column, index) => (
        <div
          key={index}
          className={`${column.width || 'flex-1'} flex ${column.classes || 'justify-center items-center'}
            ${index < columns.length - 1 ? 'border-r-os-1 border-os-white' : ''} text-center`}
        >
          {column.content}
        </div>
      ))}
    </div>
  );
};

export default OsTableHeader;
