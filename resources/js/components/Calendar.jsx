import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendar({ onDateSelect }) {
    const today = new Date();

    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
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
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Agar mulai dari Senin

    const handleSelect = (day) => {
        const dateObj = new Date(currentYear, currentMonth, day);
        setSelectedDate(day);
        if (onDateSelect) onDateSelect(dateObj);
    };

    return (
        <div className="w-full p-4 rounded-xl bg-white shadow-sm border">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={handlePrev}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                    <ChevronLeft size={20} />
                </button>

                <h2 className="text-lg font-semibold">
                    {monthNames[currentMonth]} {currentYear}
                </h2>

                <button
                    onClick={handleNext}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Days Name */}
            <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-2">
                {daysName.map((d) => (
                    <div key={d} className="py-1">{d}</div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center">
                {/* Empty cells for offset */}
                {Array(offset)
                    .fill(null)
                    .map((_, idx) => (
                        <div key={idx}></div>
                    ))}

                {/* Days */}
                {Array(daysInMonth)
                    .fill(null)
                    .map((_, index) => {
                        const day = index + 1;
                        const isSelected = selectedDate === day;

                        return (
                            <button
                                key={day}
                                onClick={() => handleSelect(day)}
                                className={`
                                    h-10 w-10 mx-auto flex items-center justify-center rounded-full transition
                                    ${isSelected
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-blue-200 hover:text-blue-900"
                                    }
                                `}
                            >
                                {day}
                            </button>
                        );
                    })}
            </div>
        </div>
    );
}