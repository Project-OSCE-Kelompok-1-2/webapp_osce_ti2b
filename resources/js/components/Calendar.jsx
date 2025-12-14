import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendar({ onDateSelect, events = [] }) {
    const today = new Date();

    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    // PERBAIKAN 1: State ini sekarang akan menyimpan objek Date lengkap, bukan cuma angka
    const [selectedDate, setSelectedDate] = useState(null);

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const daysName = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const handlePrev = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNext = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    const handleSelect = (day) => {
        // Membuat objek date lengkap
        const fullDate = new Date(currentYear, currentMonth, day);

        // PERBAIKAN 2: Simpan full date ke state, bukan cuma 'day'
        setSelectedDate(fullDate);

        if (onDateSelect) onDateSelect(fullDate);
    };

    // Helper untuk mengecek apakah dua tanggal sama persis (hari, bulan, tahun)
    const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    return (
        <div className="w-full p-4 rounded-xl bg-white shadow-sm border">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={handlePrev}
                    className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                >
                    <ChevronLeft size={20} />
                </button>

                <h2 className="text-lg font-bold text-gray-800">
                    {monthNames[currentMonth]} {currentYear}
                </h2>

                <button
                    onClick={handleNext}
                    className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Days Name */}
            <div className="grid grid-cols-7 text-center font-semibold text-gray-400 text-xs uppercase mb-2">
                {daysName.map((d) => (
                    <div key={d} className="py-1 tracking-wider">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
                {/* Empty cells */}
                {Array(offset)
                    .fill(null)
                    .map((_, idx) => (
                        <div key={`empty-${idx}`}></div>
                    ))}

                {/* Days */}
                {Array(daysInMonth)
                    .fill(null)
                    .map((_, index) => {
                        const day = index + 1;

                        // Tanggal yang sedang dirender saat looping
                        const dateToRender = new Date(
                            currentYear,
                            currentMonth,
                            day
                        );

                        // PERBAIKAN 3: Cek kesamaan tanggal menggunakan helper isSameDay
                        // Ini untuk memastikan misal: tanggal 25 Januari != 25 Februari
                        const isSelected = isSameDay(
                            selectedDate,
                            dateToRender
                        );

                        // Logic Cek Hari Ini (Real-time)
                        // Menggunakan helper isSameDay membandingkan 'today' vs tanggal render
                        const isToday = isSameDay(today, dateToRender);

                        // Logic Dot / Penanda
                        const dateStr = `${currentYear}-${String(
                            currentMonth + 1
                        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const hasEvent = events && events.includes(dateStr);

                        return (
                            <button
                                key={day}
                                onClick={() => handleSelect(day)}
                                className={`
                                    h-9 w-9 mx-auto flex flex-col items-center justify-center rounded-lg transition relative
                                    ${
                                        isSelected
                                            ? "bg-orange-600 text-white shadow-md" // Jika dipilih (Prioritas Utama)
                                            : isToday
                                            ? "text-orange-800 font-bold border hover:bg-orange-100 bg-orange-200" // Jika HARI INI (Prioritas Kedua)
                                            : "bg-white hover:bg-orange-50 text-gray-800" // Normal
                                    }
                                `}
                            >
                                <span className="text-sm font-medium leading-none">
                                    {day}
                                </span>

                                {hasEvent && (
                                    <span
                                        className={`absolute bottom-1 w-1 h-1 rounded-full ${
                                            isSelected
                                                ? "bg-white"
                                                : "bg-red-500"
                                        }`}
                                    ></span>
                                )}
                            </button>
                        );
                    })}
            </div>

            {/* Legend */}
            {events.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">
                        Jadwal Ujian
                    </span>
                </div>
            )}
        </div>
    );
}
