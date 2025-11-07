import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search, Check } from "lucide-react";

export const Section = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [currentPage, setCurrentPage] = useState(1);

  const students = [
    {
      id: 1,
      nim: "4.33.24.1.2301827492",
      name: "Raul Haryo Fauzian",
      checked: true,
      bgColor: "bg-white",
    },
    {
      id: 2,
      nim: "4.33.24.1.2301827492",
      name: "Ray Egan Priambodo",
      checked: true,
      bgColor: "bg-gray-200",
    },
    {
      id: 3,
      nim: "4.33.24.1.2301827492",
      name: "Hapis",
      checked: true,
      bgColor: "bg-white",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Top Section */}
      <div className="px-6 pt-4 pb-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg hover:bg-blue-700 flex-shrink-0">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <input
            type="text"
            value="OSCE \ OSCE Radiologi 01-A \ Jadwal Sesi \ Enrollment Mahasiswa"
            readOnly
            className="flex-1 h-10 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700"
          />
        </div>

        {/* Divider */}
        <div className="border-b border-gray-300 mb-6"></div>

        {/* Menu Title Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-black mb-2">
            Menu Enrollment Mahasiswa
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed max-w-md">
            Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            vulputate libero et velit interdum, ac aliquet odio mattis.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="cari data mahasiswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-black placeholder-gray-400 focus:outline-none text-sm"
            />
          </div>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-28 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-black font-medium focus:outline-none"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>

          <button className="w-28 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-sm">
            Cari
          </button>
        </div>

        {/* Table Title */}
        <h3 className="text-sm font-semibold text-black mb-3">
          Table Mahasiswa
        </h3>

        {/* Divider */}
        <div className="border-b border-gray-300 mb-0"></div>
      </div>

      {/* Table Section */}
      <div className="px-6 pb-6">
        {/* Table */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="bg-white border-b border-gray-300">
                <th className="px-4 py-3 text-left text-xs font-semibold text-black border-r border-gray-300 w-12">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black border-r border-gray-300 w-32">
                  Nim Mahasiswa
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black border-r border-gray-300 flex-1">
                  Mahasiswa
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-black w-20">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className={`${
                    student.bgColor === "bg-white" ? "bg-white" : "bg-gray-100"
                  } border-b border-gray-300 hover:bg-gray-50`}
                >
                  <td className="px-4 py-4 text-xs text-black border-r border-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 text-xs text-black border-r border-gray-300">
                    {student.nim}
                  </td>
                  <td className="px-4 py-4 text-xs text-black border-r border-gray-300">
                    {student.name}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center">
                      {student.checked && (
                        <div className="flex items-center justify-center w-5 h-5 border border-gray-400 rounded">
                          <Check className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-300 mt-4 mb-4"></div>

        {/* Pagination */}
        <div className="flex items-center gap-2 mb-6">
          <button className="flex items-center justify-center w-5 h-5 rounded-full bg-black hover:bg-gray-700">
            <ChevronLeft className="w-3 h-3 text-white" />
          </button>

          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-5 h-5 rounded text-xs font-normal flex items-center justify-center ${
                currentPage === page
                  ? "bg-black text-white"
                  : "text-black"
              }`}
            >
              {page}
            </button>
          ))}

          <button className="flex items-center justify-center w-5 h-5 rounded-full bg-black hover:bg-gray-700">
            <ChevronRight className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-24"></div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-white">
        <div className="h-10 bg-white border border-gray-400 rounded-lg px-4 py-2 flex items-center">
          <span className="text-xs text-gray-600">
            Copyright Porem ipsum dolor sit ametPorem ipsum dolor sit amet
          </span>
        </div>
      </div>
    </div>
  );
};

export default Section;