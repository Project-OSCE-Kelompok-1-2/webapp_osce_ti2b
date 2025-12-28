import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendar({
    onDateSelect,
    events = [],
    variant = "admin",
}) {
    const today = new Date();

    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);

    const getThemeClasses = () => {
        switch (variant) {
            case "penguji":
                return {
                    selected:
                        "!bg-os-primary-pj text-white shadow-md shadow-orange-200",
                    today: "text-os-primary-pj-dark !bg-os-tertiary-pj border border-os-secondary-pj font-bold",
                    hover: "hover:!bg-os-tertiary-pj",
                    dot: "bg-os-primary-pj",
                    textHeader: "text-gray-800",
                    btnNav: "text-gray-600 hover:!bg-os-tertiary-pj", 
                };
            case "mahasiswa":
                return {
                    selected:
                        "!bg-os-primary-mhs text-white shadow-md shadow-green-200",
                    today: "text-os-primary-mhs-dark !bg-os-tertiary-mhs border border-os-secondary-mhs font-bold",
                    hover: "hover:!bg-os-tertiary-mhs",
                    dot: "bg-os-primary-mhs",
                    textHeader: "text-gray-800",
                    btnNav: "text-gray-600 hover:!bg-os-tertiary-mhs",
                };
            default: 
                return {
                    selected:
                        "!bg-os-primary text-white shadow-md shadow-blue-200",
                    today: "text-os-primary !bg-os-tertiary border border-blue-200 font-bold",
                    hover: "hover:!bg-os-tertiary",
                    dot: "bg-os-warning",
                    textHeader: "text-gray-800",
                    btnNav: "text-gray-600 hover:!bg-os-neutral",
                };
        }
    };

    const theme = getThemeClasses();

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
        const fullDate = new Date(currentYear, currentMonth, day);
        setSelectedDate(fullDate);
        if (onDateSelect) onDateSelect(fullDate);
    };

    const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    return (
        <div className="w-full p-4 rounded-xl bg-white shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button" 
                    onClick={handlePrev}
                    className={`p-2 rounded-lg transition !bg-transparent ${theme.btnNav}`}
                >
                    <ChevronLeft size={20} />
                </button>
                <h2 className={`text-lg font-bold ${theme.textHeader}`}>
                    {monthNames[currentMonth]} {currentYear}
                </h2>
                <button
                    type="button"
                    onClick={handleNext}
                    className={`p-2 rounded-lg transition !bg-transparent ${theme.btnNav}`}
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Days Name */}
            <div className="grid grid-cols-7 text-center mb-2">
                {daysName.map((d) => (
                    <div
                        key={d}
                        className="py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
                {Array(offset)
                    .fill(null)
                    .map((_, idx) => (
                        <div key={`empty-${idx}`}></div>
                    ))}

                {Array(daysInMonth)
                    .fill(null)
                    .map((_, index) => {
                        const day = index + 1;
                        const dateToRender = new Date(
                            currentYear,
                            currentMonth,
                            day
                        );
                        const isSelected = isSameDay(
                            selectedDate,
                            dateToRender
                        );
                        const isToday = isSameDay(today, dateToRender);

                        const dateStr = `${currentYear}-${String(
                            currentMonth + 1
                        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const hasEvent = events && events.includes(dateStr);

                        let buttonClass = "";

                        if (isSelected) {
                            buttonClass = theme.selected;
                        } else if (isToday) {
                            buttonClass = theme.today;
                        } else {
                            buttonClass = `!bg-white text-gray-700 ${theme.hover}`;
                        }

                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() => handleSelect(day)}
                                className={`
                                h-9 w-9 mx-auto flex flex-col items-center justify-center rounded-lg transition-all duration-200 relative
                                ${buttonClass}
                            `}
                            >
                                <span className="text-sm font-medium leading-none mt-0.5">
                                    {day}
                                </span>

                                {hasEvent && (
                                    <span
                                        className={`absolute bottom-1.5 w-1 h-1 rounded-full ${
                                            isSelected ? "bg-white" : theme.dot
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
                    <span
                        className={`w-2 h-2 rounded-full ${theme.dot}`}
                    ></span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">
                        Jadwal Ujian
                    </span>
                </div>
            )}
        </div>
    );
}
