import React, { useState } from "react";
import { X, FilePlus, CircleArrowRight, CircleArrowLeft } from "lucide-react";

export default function OsStepModal({
    show,
    onClose,
    onSubmit,
    steps,
    currentStep,
    setCurrentStep,
    variant = "admin", 
}) {
    if (!show) return null;
    const isLastStep = currentStep === steps.length - 1;
    const isPenguji = variant === "penguji";

    const getThemeColors = () => {
        if (isPenguji) {
            return {
                headerBg: "bg-orange-950", 
                primaryBg: "bg-orange-600", 
                primaryHover: "hover:bg-orange-700",
                secondaryBg: "bg-os-tertiary-pj", 
                secondaryHover: "hover:bg-orange-200", 
                secondaryText: "text-orange-800", 
                activeDot: "bg-os-primary-pj",
            };
        }
        return {
            headerBg: "bg-blue-950",
            primaryBg: "bg-blue-600",
            primaryHover: "hover:bg-blue-700",
            secondaryBg: "bg-os-tertiary", 
            secondaryHover: "hover:bg-blue-200", 
            secondaryText: "text-blue-800",
            activeDot: "bg-blue-500",
        };
    };

    const theme = getThemeColors();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form
                className="relative bg-white rounded-2xl border-os1 border-os-black
                md:w-full md:max-w-md max-w-[350px] text-os-paragraph md:min-h-[85vh] min-h-[70vh] max-h-[85vh] flex flex-col overflow-hidden"
            >
                {/* HEADER */}
                <header
                    className={`${theme.headerBg} text-white text-center p-4 pt-8 flex-none relative`}
                >
                    {/* ---- TITLE ---- */}
                    <h2 className="text-os-subtitle font-semibold">
                        {steps[currentStep].title}
                    </h2>

                    {/* ---- SUBTITLE ---- */}
                    <p className="text-os-paragraph opacity-os-alpha-25">
                        Step {currentStep + 1} dari {steps.length}
                    </p>

                    <div className="relative flex items-center justify-between mt-4 px-6 w-full">
                        {/* GARIS PUTIH */}
                        <div className="absolute top-2 left-16 right-16 h-[2px] bg-white opacity-50" />

                        {steps.map((s, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center flex-1 relative z-10"
                            >
                                {/* TITIK — BUTTON TIDAK AKTIF */}
                                <button
                                    type="button"
                                    disabled
                                    className={`
                                        w-4 h-4 rounded-full border-2 border-white cursor-default
                                        ${
                                            idx === currentStep
                                                ? theme.activeDot
                                                : "bg-white"
                                        }
                                    `}
                                />

                                {/* LABEL */}
                                <p
                                    className={`text-xs mt-1 w-15 ${
                                        idx === currentStep
                                            ? "text-white font-semibold"
                                            : "text-white/50"
                                    }`}
                                >
                                    {/* {s.title} */}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* CLOSE BUTTON */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 text-white hover:scale-110 transition
                                 bg-transparent hover:bg-transparent border-none focus:outline-none focus:ring-0"
                    >
                        <X size={22} />
                    </button>
                </header>

                {/* BODY */}
                <main className="flex flex-col gap-3 flex-1 overflow-y-auto p-os-20">
                    {steps[currentStep].content}
                </main>

                {/* FOOTER */}
                <footer className="p-os-20 flex-none">
                    <div className="flex items-start justify-between gap-os-14 ">
                        {/* PREV BUTTON */}
                        <button
                            type="button"
                            disabled={currentStep === 0}
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className={`flex flex-row-reverse w-full justify-center items-center gap-2 h-[48px]
                            ${theme.secondaryBg} ${theme.secondaryText} ${theme.secondaryHover} px-4 py-2 rounded-lg disabled:opacity-40 transition-colors`}
                        >
                            Prev
                            <CircleArrowLeft size={18} />
                        </button>

                        {!isLastStep ? (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className={`flex w-full justify-center items-center gap-2 h-[48px]
                                ${theme.primaryBg} text-white px-4 py-2 rounded-lg ${theme.primaryHover} transition-colors`}
                            >
                                Next
                                <CircleArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={onSubmit}
                                className="flex w-full justify-center items-center gap-2 h-[48px]
                                bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <FilePlus size={18} />
                                Submit
                            </button>
                        )}
                    </div>
                </footer>
            </form>
        </div>
    );
}
