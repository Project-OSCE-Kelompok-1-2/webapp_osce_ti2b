import React from "react";
import { X, Trash2, FilePlus } from "lucide-react";

export default function OsModal({ show, children, onClose, title, subtitle }) {
    if (!show) return null;
    const modaltitle = title || "Title not entered";
    const modalsubtitle = subtitle || "subtitle not entered";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form className="relative bg-white rounded-2xl border-os1 border-os-black w-full max-w-md text-os-paragraph max-h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-gray-900 text-white flex flex-col justify-center items-center text-center p-4 pt-8 flex-none">
                    <h2 className="text-os-subtitle font-semibold">
                        {modaltitle}
                    </h2>
                    <p className="text-os-paragraph mt-1 opacity-os-alpha-25">
                        {modalsubtitle}
                    </p>
                </header>

                {/* Body Scrollable */}
                <main className="flex flex-col gap-3 overflow-y-auto p-os-20">
                    {children ? (
                        children
                    ) : (
                        <p className="text-center text-os-paragraph text-gray-500">
                            No content
                        </p>
                    )}
                </main>

                {/* Footer - fixed di bawah modal */}
                <footer className="p-os-20 pt-0 flex-none ">
                    <div className="flex items-start justify-between gap-os-14">
                        <button
                            type="submit"
                            className="flex w-full items-center gap-2 h-[48px] bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            <FilePlus size={18} />
                            Submit
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-2 h-[48px] bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </footer>

                {/* Tombol Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 text-white hover:text-gray-300"
                >
                    <X size={22} />
                </button>
            </form>
        </div>
    );
}
