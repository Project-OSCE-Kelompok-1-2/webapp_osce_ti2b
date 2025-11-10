import React from 'react';
// Ikon-ikon ini diimpor, pastikan Anda telah menginstal 'lucide-react'
import { CheckCircle, AlertCircle } from 'lucide-react'; 

//=================================================================
// KOMPONEN INTERNAL (HELPER)
// Komponen-komponen ini digunakan oleh komponen utama di bawah.
//=================================================================

/**
 * [BARU] StaseHeader
 * Komponen baru untuk banner biru di bagian atas, sesuai gambar dan kode Figma.
 */
const StaseHeader = ({ staseNumber, staseName, examinerName, totalScore }) => {
  return (
    <div className="flex items-center justify-between bg-[#77B6FF] py-2.5 px-4 mb-8 rounded-xl text-white">
      {/* Bagian Kiri: Info Stase */}
      <div className="flex flex-col items-start">
        <div className="relative bg-[#FA5E1B] px-3 py-0.5 rounded-full mb-2">
          <span className="text-white text-xs font-bold relative z-10">
            {staseNumber || "Stase 1"}
          </span>
        </div>
        <span className="text-white text-4xl font-bold mb-1">
          {staseName || "Stase Bedah Umum"}
        </span>
        <span className="text-white text-xs font-bold">
          {examinerName ? `Penguji : ${examinerName}` : "Penguji : Dr Mafkar Afkar"}
        </span>
      </div>
      
      {/* Bagian Kanan: Total Nilai */}
      <div 
        className="bg-white w-[119px] pt-1.5 pb-2 px-2.5 rounded-xl flex-shrink-0"
        style={{ boxShadow: "0px 4px 4px #00000040" }}
      >
        <div className="flex flex-col items-center">
          <div className="bg-[#FA5E1B] rounded-full px-3 py-0.5 mb-1">
            <span className="text-white text-xs font-bold">
              Total Nilai
            </span>
          </div>
          <span className="text-[#77B6FF] text-[66px] font-bold leading-none">
            {totalScore || "89"}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * OsAssessmentHeader
 * Komponen baru untuk header abu-abu di atas tabel, sesuai gambar.
 * [UPDATE] Gaya disesuaikan dengan kode Figma (warna, border, font-size)
 */
const OsAssessmentHeader = ({ columns = [] }) => {
  return (
    <div className="flex text-[15px] font-semibold text-black bg-[#C4C6CD] mb-4 rounded-xl items-center border border-solid border-black">
      {columns.map((column, index) => (
        <div
          key={index}
          className={`${column.width || 'flex-1'} flex ${column.classes || 'justify-center items-center'}
           ${index < columns.length - 1 ? 'border-r border-solid border-black' : ''} text-left py-4`}
        >
          {column.content}
        </div>
      ))}
    </div>
  );
};

/**
 * OsAssessmentRow
 * [UPDATE] Gaya disesuaikan dengan kode Figma (border, font-size)
 */
const OsAssessmentRow = ({ columns = [], isBold = false }) => {
  // [UPDATE] Menggunakan style dari Figma: border-black, rounded-xl, text-[15px]
  const baseStyle = "flex text-[15px] items-center text-black border border-solid border-black mb-4 rounded-xl min-h-[48px]";
  const boldStyle = isBold ? "font-bold" : "";

  return (
    <div className={`${baseStyle} ${boldStyle}`}>
      {columns.map((column, index) => (
        <div
          key={index}
          className={`${column.width || 'flex-1'} flex ${column.classes || 'justify-center items-center'}
           ${index < columns.length - 1 ? 'border-r border-solid border-black' : ''} text-left py-4`} // [UPDATE] border-black, py-4
        >
          {column.content}
        </div>
      ))}
    </div>
  );
};


//=================================================================
// KOMPONEN UTAMA (REUSABLE)
// Ini adalah komponen yang Anda minta.
// Anda dapat menggunakannya di halaman mana pun.
//=================================================================

/**
 * StaseAssessmentView
 * Komponen reusable yang menggabungkan StaseHeader dan tabel penilaian.
 * Komponen ini menerima semua data sebagai props.
 */
const StaseAssessmentView = ({ 
  staseNumber, 
  staseName, 
  examinerName, 
  overallScore, // Nilai total untuk header biru
  assessmentData = [] // Data untuk baris tabel
}) => {

  // Definisi kolom untuk Header
  // [UPDATE] Padding disesuaikan dengan Figma
  const headerColumns = [
    { content: 'A', width: 'w-16', classes: 'justify-center px-[18px]' },
    { content: 'Aspek Penilaian (5 Bobot)', width: 'flex-1', classes: 'justify-start pl-2.5 font-bold' },
  ];

  // Definisi kolom untuk Baris Data & Footer
  // Strukturnya berbeda dari header, sesuai gambar
  // [UPDATE] Padding disesuaikan dengan Figma
  const rowColumnsConfig = [
    { width: 'flex-1', classes: 'justify-start px-[88px]' }, // px-[88px] dari figma
    { width: 'w-48', classes: 'justify-start px-4' }, // w-48 adalah tebakan, sesuaikan
  ];

  // Menghitung total dari prop assessmentData
  const totalScore = assessmentData.reduce((sum, row) => {
    const score = parseInt(row.value.split(' ')[0], 10); // Ambil angka pertama
    return sum + (isNaN(score) ? 0 : score);
  }, 0);

  // Fungsi untuk membuat props kolom untuk baris
  const getRowColumns = (item, value) => [
    { content: item, ...rowColumnsConfig[0] },
    { content: value, ...rowColumnsConfig[1] },
  ];

  // [BARU] Kolom untuk footer, agar bisa di-center-kan
  const footerColumns = [
    { content: 'Total', width: 'flex-1', classes: 'justify-center' }, // Berbeda dari row biasa
    { content: totalScore.toString(), width: 'w-48', classes: 'justify-center px-4' }, // Berbeda dari row biasa
  ];

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* [BARU] Header Stase Biru */}
      <StaseHeader 
        staseNumber={staseNumber}
        staseName={staseName}
        examinerName={examinerName}
        totalScore={overallScore} // Menggunakan prop overallScore
      />

      {/* Header Abu-abu */}
      <OsAssessmentHeader columns={headerColumns} />

      {/* Baris Data (Putih) */}
      {assessmentData.map((row, index) => (
        <OsAssessmentRow 
          key={index} 
          columns={getRowColumns(row.item, row.value)} 
        />
      ))}

      {/* Baris Footer (Putih, Bold) */}
      {/* [UPDATE] Menggunakan footerColumns kustom untuk alignment */}
      <OsAssessmentRow 
        columns={footerColumns} 
        isBold={true} 
      />
      
    </div>
  );
};


