import React, { useEffect } from "react";
import { X, Trash2, FilePlus } from "lucide-react";
import OsButton from "./button";
import OsIcon from "./icons";

export default function OsModal({
    show,
    children,
    onClose,
    title,
    subtitle,
    variant = "add", // add | edit
    onSubmit,
    onDelete,
    onClear,
}) {
    useEffect(() => {
        if (show) document.body.classList.add("overflow-hidden");
        else document.body.classList.remove("overflow-hidden");
        return () => document.body.classList.remove("overflow-hidden");
    }, [show]);

    if (!show) return null;

    // Title & subtitle
    const modaltitle =
        variant === "edit"
            ? `Edit ${title || "Data"}`
            : title || "Title not entered";

    const modalsubtitle =
        variant === "edit"
            ? `Editing: ${subtitle || "Data tidak ditemukan"}`
            : subtitle || "subtitle not entered";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form
                onSubmit={onSubmit}
                className="relative bg-white rounded-2xl w-full md:max-w-md max-w-[90vw] text-os-paragraph max-h-[80vh] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <header className="bg-gray-900 text-white text-center p-4 pt-8">
                    <h2 className="text-os-subtitle font-semibold">{modaltitle}</h2>
                    <p className="text-os-paragraph mt-1 opacity-os-alpha-25">
                        {modalsubtitle}
                    </p>
                </header>

                {/* Body */}
                <div className="flex flex-col gap-3 overflow-y-scroll p-os-20 flex-1">
                    {children || (
                        <p className="text-center text-gray-500">No content</p>
                    )}
                </div>

                {/* Footer */}
                <footer className="p-os-20 pt-0">
                    {variant === "add" ? (
                        <div className="flex items-start justify-between gap-os-14">
                            <OsButton
                                type="submit"
                                name="primary"
                                className="flex w-full items-center gap-2 h-[48px] text-white rounded-lg hover:bg-blue-700"
                            >
                                <FilePlus size={20} />
                                Submit
                            </OsButton>

                            <OsButton
                                type="button"
                                onClick={onClear}
                                className="flex items-center gap-2 h-[48px] !bg-red-500 text-white rounded-lg hover:!bg-red-600"
                            >
                                <OsIcon
                                    name={'erase'}
                                    className="w-[24px] os-icon-light"
                                />
                            </OsButton>
                        </div>
                    ) : (
                        <div className="flex items-start justify-between gap-os-14">
                            <OsButton
                                type="submit"
                                name="primary"
                                className="flex w-full items-center gap-2 h-[48px] text-white rounded-lg hover:bg-blue-700"
                            >
                                <FilePlus size={20} />
                                Simpan Perubahan
                            </OsButton>
                        </div>
                    )}
                </footer>

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 text-white hover:scale-110 transition
                               bg-transparent hover:bg-transparent border-none focus:outline-none focus:ring-0"
                >
                    <X size={22} />
                </button>
            </form>
        </div>
    );
}
