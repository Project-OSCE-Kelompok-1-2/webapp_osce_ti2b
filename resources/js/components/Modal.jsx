import React, { useEffect } from "react";
import { X, Trash2, FilePlus } from "lucide-react";
import OsButton from "./button";

export default function OsModal({ show, children, onClose, title, subtitle }) {
    // ❗ Block scroll ketika modal terbuka
    useEffect(() => {
        if (show) document.body.classList.add("overflow-hidden");
        else document.body.classList.remove("overflow-hidden");
        return () => document.body.classList.remove("overflow-hidden");
    }, [show]);

    if (!show) return null;

    const modaltitle = title || "Title not entered";
    const modalsubtitle = subtitle || "subtitle not entered";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <form
                className="relative bg-white rounded-2xl border-os1 border-os-black w-full max-w-md text-os-paragraph max-h-[80vh] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <header className="bg-gray-900 text-white flex flex-col justify-center items-center text-center p-4 pt-8 flex-none">
                    <h2 className="text-os-subtitle font-semibold">
                        {modaltitle}
                    </h2>
                    <p className="text-os-paragraph mt-1 opacity-os-alpha-25">
                        {modalsubtitle}
                    </p>
                </header>

                {/* Body */}
                <form className="flex flex-col gap-3 overflow-y-scroll p-os-20">
                    {children || (
                        <p className="text-center text-os-paragraph text-gray-500">
                            No content
                        </p>
                    )}
                </form>

                {/* Footer */}
                <footer className="p-os-20 pt-0 flex-none">
                    <div className="flex items-start justify-between gap-os-14">
                        <OsButton
                            type="submit"
                            className="flex w-full items-center gap-2 h-[48px] bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            <FilePlus size={20} />
                            Submit
                        </OsButton>

                        <OsButton
                            type="button"
                            className="flex items-center gap-2 h-[48px] !bg-red-500 text-white px-4 py-2 rounded-lg hover:!bg-red-600"
                        >
                            <Trash2 size={20} />
                        </OsButton>
                    </div>
                </footer>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 text-white !bg-transparent hover:!bg-transparent scale-100 hover:scale-110 transition"
                >
                    <X size={22} />
                </button>
            </form>
        </div>
    );
}
