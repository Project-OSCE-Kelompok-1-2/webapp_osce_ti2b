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
      name: "Riko Aditya Zaki Sir Raja",
      checked: true,
      bgColor: "bg-white",
    },
    {
      id: 2,
      nim: "4.33.24.1.2301827492",
      name: "Ray Egan Primodium Insya Allah tahun depan",
      checked: true,
      bgColor: "bg-gray-200",
    },
    {
      id: 3,
      nim: "4.33.24.1.2301827492",
      name: "Bang Ucup AKA Ifad Dahlih Zangetsu",
      checked: true,
      bgColor: "bg-white",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white p-6">
      {/* Main Container */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-lg border-2 border-black hover:bg-blue-700">
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>

          <div className="flex-1 flex items-center h-14 bg-white rounded-lg border-2 border-black px-5">
            <span className="text-black text-base font-normal">
              OSCE \ OSCE Radiologi 01-A \ Jadwal Sesi \ Enrollment Mahasiswa
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-gray-300"></div>

        {/* Menu Title */}
        <div>
          <h2 className="text-base font-normal text-black mb-2">
            Menu Enrollment Mahasiswa
          </h2>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
            Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            vulputate libero et velit interdum, ac aliquet odio mattis.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-3 bg-white rounded-lg border-2 border-black px-4 py-3">
            <Search className="w-5 h-5 text-gray-400" />
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
            className="w-32 bg-white rounded-lg border-2 border-black px-4 py-3 text-black font-medium focus:outline-none"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>

          <button className="w-32 bg-blue-600 text-white font-bold rounded-lg border-2 border-black hover:bg-blue-700">
            Cari
          </button>
        </div>

        {/* Table Section */}
        <div>
          <h3 className="text-base font-normal text-black mb-4">
            Table Mahasiswa
          </h3>

          {/* Table */}
          <div className="border border-gray-400 rounded-lg overflow-hidden">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="border-b-2 border-gray-400">
                  <th className="px-6 py-3 text-left text-sm font-normal text-black border-r border-gray-400 w-16">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-black border-r border-gray-400 w-40">
                    Nim Mahasiswa
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-black border-r border-gray-400 flex-1">
                    Mahasiswa
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-normal text-black w-24">
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
                      student.bgColor === "bg-white" ? "bg-white" : "bg-gray-200"
                    } border-b border-gray-300`}
                  >
                    <td className="px-6 py-4 text-sm font-normal text-black border-r border-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-normal text-black border-r border-gray-300">
                      {student.nim}
                    </td>
                    <td className="px-6 py-4 text-sm font-normal text-black border-r border-gray-300">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        {student.checked && (
                          <Check className="w-5 h-5 text-black bg-white border border-gray-400 rounded p-0.5" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Divider */}
          <div className="border-b-2 border-gray-300 mt-4"></div>

          {/* Pagination */}
          <div className="flex items-center gap-2 mt-4">
            <button className="flex items-center justify-center w-6 h-6 rounded-full bg-black hover:bg-gray-700">
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>

            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-6 h-6 rounded text-sm font-normal ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "text-black"
                }`}
              >
                {page}
              </button>
            ))}

            <button className="flex items-center justify-center w-6 h-6 rounded-full bg-black hover:bg-gray-700">
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section;