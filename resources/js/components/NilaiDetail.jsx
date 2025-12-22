import React from "react";
import { UserCheck, ClipboardList } from "lucide-react";

const StaseHeader = ({ staseNumber, staseName, examinerName, totalScore }) => {
    const formattedScore = parseFloat(totalScore || 0).toFixed(2);
    const displayScore = formattedScore.endsWith(".00")
        ? parseFloat(formattedScore)
        : formattedScore;

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border-b border-gray-100 p-6 rounded-t-xl">
            <div className="flex items-start gap-4">
                {/* Badge Nomor Stase */}
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-lg shrink-0">
                    {staseNumber}
                </div>

                <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {staseName || "Nama Stase"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-gray-500 text-sm">
                        <UserCheck className="w-4 h-4" />
                        <span>
                            Penguji:{" "}
                            <span className="font-medium text-gray-700">
                                {examinerName || "-"}
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Score Badge */}
            <div className="mt-4 md:mt-0 flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                    Nilai Stase
                </span>
                <span className="text-2xl font-bold text-gray-800">
                    {displayScore}
                </span>
            </div>
        </div>
    );
};

/**
 * KOMPONEN INTERNAL: Baris Penilaian
 */
const AssessmentRow = ({ item, score, detail, index }) => {
    return (
        <div
            className={`grid grid-cols-[auto_1fr_auto] gap-4 py-4 px-6 items-center hover:bg-gray-50 transition-colors ${
                index !== 0 ? "border-t border-gray-100" : ""
            }`}
        >
            {/* Icon Bullet */}
            <div className="w-8 text-gray-300 flex justify-center">
                <span className="text-sm font-medium">{index + 1}.</span>
            </div>

            {/* Nama Kompetensi & Detail */}
            <div>
                <p className="text-gray-800 font-medium text-[15px] leading-snug">
                    {item}
                </p>
                {/* Detail perhitungan kecil di bawah */}
                <p className="text-xs text-gray-400 mt-0.5 font-mono">
                    {detail}
                </p>
            </div>

            {/* Nilai Per Item */}
            <div className="text-right pl-4">
                <span className="inline-block min-w-[3rem] text-center py-1 px-2 bg-white border border-gray-200 rounded text-sm font-semibold text-gray-700 shadow-sm">
                    {score}
                </span>
            </div>
        </div>
    );
};

//=================================================================
// KOMPONEN UTAMA
//=================================================================

const StaseAssessmentView = ({
    staseNumber,
    staseName,
    examinerName,
    overallScore,
    assessmentData = [],
}) => {
    const calculatedTotal = assessmentData.reduce(
        (sum, row) => sum + parseFloat(row.score || 0),
        0
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
            {/* 1. Header Stase */}
            <StaseHeader
                staseNumber={staseNumber}
                staseName={staseName}
                examinerName={examinerName}
                totalScore={overallScore}
            />

            {/* 2. Body List Kompetensi */}
            <div className="bg-white">
                {/* Table Header (Visual Only) */}
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 py-3 px-6 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="w-8 text-center">No</div>
                    <div>Kompetensi & Bobot</div>
                    <div className="text-right">Nilai</div>
                </div>

                {/* Rows */}
                {assessmentData.length > 0 ? (
                    assessmentData.map((row, index) => (
                        <AssessmentRow
                            key={index}
                            index={index}
                            item={row.item}
                            score={row.score}
                            detail={row.detail}
                        />
                    ))
                ) : (
                    <div className="py-8 text-center text-gray-400 text-sm italic">
                        Tidak ada detail kompetensi.
                    </div>
                )}
            </div>

            {/* 3. Footer Total (Optional, if you want to show sum of items vs stase score) */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <ClipboardList className="w-4 h-4" />
                    <span>Total Poin Kompetensi</span>
                </div>
                <span className="text-gray-900 font-bold text-lg">
                    {calculatedTotal.toFixed(2).endsWith(".00")
                        ? calculatedTotal
                        : calculatedTotal.toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default StaseAssessmentView;
