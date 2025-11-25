import React, { useState } from "react";
import { X, FilePlus } from "lucide-react";

export default function OsStepModal({ show, onClose, onSubmit, steps }) {
    const [currentStep, setCurrentStep] = useState(0);

    if (!show) return null;
    const isLastStep = currentStep === steps.length - 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form
                className="relative bg-white rounded-2xl border-os1 border-os-black
                w-full max-w-md text-os-paragraph max-h-[85vh] flex flex-col overflow-hidden"
            >
                {/* HEADER */}
                <header className="bg-gray-900 text-white text-center p-4 pt-8 flex-none relative">
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
                        <div className="absolute top-2 left-16 right-16 h-[2px] bg-white opacity-50"></div>

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
                                        ${idx === currentStep ? "bg-blue-500" : "bg-gray-700"}
                                    `}
                                />

                                {/* LABEL */}
                                <p
                                    className={`text-xs mt-1 ${
                                        idx === currentStep
                                            ? "text-white font-semibold"
                                            : "text-white/50"
                                    }`}
                                >
                                    {s.title}
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
                <main className="flex flex-col gap-3 min-h-[55vh] overflow-y-auto p-os-20">
                    {steps[currentStep].content}
                </main>

                {/* FOOTER */}
                <footer className="p-os-20 pt-3 flex-none">
                    <div className="flex items-start justify-between gap-os-14 ">
                        <button
                            type="button"
                            disabled={currentStep === 0}
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="flex w-full justify-center items-center gap-2 h-[48px]
                            bg-gray-300 text-gray-800 px-4 py-2 rounded-lg disabled:opacity-40"
                        >
                            Prev
                        </button>

                        {!isLastStep ? (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="flex w-full justify-center items-center gap-2 h-[48px]
                                bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={onSubmit}
                                className="flex w-full justify-center items-center gap-2 h-[48px]
                                bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
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
