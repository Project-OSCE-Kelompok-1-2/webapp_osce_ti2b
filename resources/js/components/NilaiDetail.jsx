import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react'; 

//=================================================================
// KOMPONEN INTERNAL (Tanpa 'export')
//=================================================================

/**
 * [BARU] StaseHeader
 * (Ini adalah komponen internal, tidak di-export)
 */
const StaseHeader = ({ staseNumber, staseName, examinerName, totalScore }) => {
  return (
    <div className="flex items-center justify-between bg-[#77B6FF] py-2.5 px-4 mb-8 rounded-xl text-white">
      {/* ... (isi StaseHeader) ... */}
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
          {examinerName ? Penguji : ${examinerName} : "Penguji : Dr Mafkar Afkar"}
        </span>
      </div>
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
 * (Ini adalah komponen internal, tidak di-export)
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
 * (Ini adalah komponen internal, tidak di-export)
 */
const OsAssessmentRow = ({ columns = [], isBold = false }) => {
  const baseStyle = "flex text-[15px] items-center text-black border border-solid border-black mb-4 rounded-xl min-h-[48px]";
  const boldStyle = isBold ? "font-bold" : "";

  return (
    <div className={${baseStyle} ${boldStyle}}>
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


//=================================================================
// KOMPONEN UTAMA (YANG AKAN DI-EXPORT)
//=================================================================

/**
 * StaseAssessmentView
 * (Ini adalah komponen utama yang akan kita export)
 */
const StaseAssessmentView = ({ 
  staseNumber, 
  staseName, 
  examinerName, 
  overallScore, 
  assessmentData = [] 
}) => {

  // ... (semua logika internal StaseAssessmentView) ...
  const headerColumns = [
    { content: 'A', width: 'w-16', classes: 'justify-center px-[18px]' },
    { content: 'Aspek Penilaian (5 Bobot)', width: 'flex-1', classes: 'justify-start pl-2.5 font-bold' },
  ];
  const rowColumnsConfig = [
    { width: 'flex-1', classes: 'justify-start px-[88px]' }, 
    { width: 'w-48', classes: 'justify-start px-4' }, 
  ];
  const totalScore = assessmentData.reduce((sum, row) => {
    const score = parseInt(row.value.split(' ')[0], 10); 
    return sum + (isNaN(score) ? 0 : score);
  }, 0);
  const getRowColumns = (item, value) => [
    { content: item, ...rowColumnsConfig[0] },
    { content: value, ...rowColumnsConfig[1] },
  ];
  const footerColumns = [
    { content: 'Total', width: 'flex-1', classes: 'justify-center' }, 
    { content: totalScore.toString(), width: 'w-48', classes: 'justify-center px-4' }, 
  ];

  return (
    <div>
      <StaseHeader 
        staseNumber={staseNumber}
        staseName={staseName}
        examinerName={examinerName}
        totalScore={overallScore} 
      />
      <OsAssessmentHeader columns={headerColumns} />
      {assessmentData.map((row, index) => (
        <OsAssessmentRow 
          key={index} 
          columns={getRowColumns(row.item, row.value)} 
        />
      ))}
      <OsAssessmentRow 
        columns={footerColumns} 
        isBold={true} 
      />
    </div>
  );
};

export default StaseAssessmentView;