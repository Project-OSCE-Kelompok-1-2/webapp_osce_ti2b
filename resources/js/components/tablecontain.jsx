import React from "react";

const OsTableBody = ({ data = [], columns = [] }) => {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-gray-200">
      {data.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex text-sm h-[83px] text-os-regular 
            ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"} 
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
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[61px] w-px bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default OsTableBody;
