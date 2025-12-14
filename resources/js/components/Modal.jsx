import React, { useEffect } from "react";
import { X, Trash2, FilePlus, Delete, FilePenLine } from "lucide-react";
import OsButton from "./button";
import OsIcon from "./icons";

export default function OsModal({
    show,
    children,
    onClose,
    title,
    subtitle,
    variant = "add", // add | edit | delete (variant aksi)
    themeVariant = "admin", // admin | penguji | mahasiswa (variant warna)
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

    // --- LOGIKA VARIAN WARNA ---
    const isMahasiswa = themeVariant === "mahasiswa";
    const isPenguji = themeVariant === "penguji";

    const getThemeColors = () => {
        if (isMahasiswa) {
            // Hijau Gelap
            return {
                headerBg: "bg-[var(--os-primary-mhs-dark)]",
                primaryBg: "bg-[var(--os-primary-mhs)]",
                primaryHover: "hover:bg-[var(--os-primary-mhs-dark)]",
                deleteBg: "bg-[var(--os-warning)]", // Merah
                deleteHover: "hover:bg-red-700",
            };
        }
        if (isPenguji) {
            // Oranye Gelap
            return {
                headerBg: "bg-[var(--os-primary-pj-dark)]",
                primaryBg: "bg-[var(--os-primary-pj)]",
                primaryHover: "hover:bg-[var(--os-primary-pj-dark)]",
                deleteBg: "bg-[var(--os-warning)]", // Merah
                deleteHover: "hover:bg-red-700",
            };
        }
        // Admin (Biru Gelap)
        return {
            headerBg: "bg-blue-950", // Mengganti bg-gray-900 dengan biru gelap
            primaryBg: "bg-[var(--os-primary)]",
            primaryHover: "hover:bg-[var(--os-primary-dark)]",
            deleteBg: "bg-[var(--os-warning)]", // Merah
            deleteHover: "hover:bg-red-700",
        };
    };

    const theme = getThemeColors();
    const isDelete = variant === "delete"; // Varian khusus untuk konfirmasi hapus

    // Title & subtitle
    const modaltitle = (() => {
        if (isDelete) return `Hapus ${title || "Data"}`;
        if (variant === "edit") return `Edit ${title || "Data"}`;
        return title || "Title not entered";
    })();

    const modalsubtitle = (() => {
        if (isDelete)
            return `Konfirmasi penghapusan: ${
                subtitle || "Data tidak ditemukan"
            }`;
        if (variant === "edit")
            return `Editing: ${subtitle || "Data tidak ditemukan"}`;
        return subtitle || "subtitle not entered";
    })();

    // Kelas tombol submit/primary
    const submitButtonClasses = `flex w-full items-center justify-center gap-2 h-[48px] text-white rounded-lg transition-colors duration-200 ${theme.primaryBg} ${theme.primaryHover}`;

    // Kelas tombol delete
    const deleteButtonClasses = `flex w-full items-center justify-center gap-2 h-[48px] text-white rounded-lg transition-colors duration-200 ${theme.deleteBg} ${theme.deleteHover}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form
                onSubmit={onSubmit}
                className="relative bg-white rounded-2xl w-full md:max-w-md max-w-[90vw] text-os-paragraph max-h-[80vh] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <header
                    className={`${theme.headerBg} text-white text-center p-4 pt-8`}
                >
                    <h2 className="text-os-subtitle font-semibold">
                        {modaltitle}
                    </h2>
                    <p className="text-os-paragraph mt-1 opacity-os-alpha-75">
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
                    {isDelete ? (
                        // Varian DELETE
                        <div className="flex items-start justify-between gap-os-14">
                            <OsButton
                                type="button"
                                onClick={onClose}
                                className="flex w-full items-center justify-center gap-2 h-[48px] bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                            >
                                Batal
                            </OsButton>
                            <OsButton
                                name="warning"
                                type="button"
                                onClick={onDelete}
                            >
                                <Trash2 size={20} />
                                Hapus Permanen
                            </OsButton>
                        </div>
                    ) : variant === "add" ? (
                        // Varian ADD
                        <div className="flex items-start justify-between gap-os-14">
                            <OsButton
                                type="submit"
                                name="primary"
                                className={submitButtonClasses}
                            >
                                <FilePlus size={20} />
                                Submit
                            </OsButton>

                            <OsButton
                                name="warning"
                                type="button"
                                onClick={onClear}
                                className={`flex items-center justify-center gap-2 h-[48px] !bg-white  rounded-lg `}
                            >
                                <Delete size={22} className="text-red-600" />
                            </OsButton>
                        </div>
                    ) : (
                        // Varian EDIT (Default)
                        <div className="flex items-start justify-between gap-os-14">
                            <OsButton
                                type="submit"
                                name="edit"
                                className={submitButtonClasses}
                            >
                                <FilePenLine size={20} />
                                Simpan Perubahan
                            </OsButton>

                            {/* Tombol Delete opsional untuk Edit */}
                            {onDelete && (
                                <OsButton
                                    name="warning"
                                    type="button"
                                    onClick={onClear}
                                    className={`flex items-center justify-center gap-2 h-[48px] !bg-white  rounded-lg `}
                                >
                                    <Delete
                                        size={22}
                                        className="text-red-600"
                                    />
                                </OsButton>
                            )}
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
