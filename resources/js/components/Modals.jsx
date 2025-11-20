import React from "react";
import { LogOut, Trash2, AlertTriangle, X } from "lucide-react";

export default function Modals({
    isOpen,
    onClose,
    onConfirm,
    variant = "logout",
    title,
    message,
    dataToDelete = [],
    confirmText,
}) {
    if (!isOpen) return null;

    // ==========================
    // VARIAN MODAL
    // ==========================
    const modalConfig = {
        logout: {
            title: title || "Anda ingin log out?",
            alertMessage:
                "Apakah anda yakin? Bila anda lupa password atau email, anda bisa menghubungi superadmin.",
            buttonText: confirmText || "Log Out",
            buttonIcon: <LogOut size={18} className="mr-2" />,
            buttonColor: "bg-blue-600 hover:bg-blue-700",
            alertColor: "bg-blue-50 border-blue-300 text-blue-700",
        },

        delete: {
            title: title || "Hapus Entitas?",
            alertMessage:
                message ||
                "Apakah anda yakin? Data yang dihapus tidak bisa di-undo / dikembalikan.",
            buttonText: confirmText || "Hapus",
            buttonIcon: <Trash2 size={18} className="mr-2" />,
            buttonColor: "bg-red-600 hover:bg-red-700",
            alertColor: "bg-red-50 border-red-300 text-red-700",
        },
    };

    const {
        title: finalTitle,
        alertMessage,
        buttonText,
        buttonIcon,
        buttonColor,
        alertColor,
    } = modalConfig[variant];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-white w-[90%] max-w-md rounded-xl shadow-lg overflow-hidden animate-fade-in border border-gray-300">

                {/* ======================= */}
                {/* HEADER ABU-ABU GELAP   */}
                {/* ======================= */}
                <div
                    className="py-4 px-6 flex items-center justify-center relative border-b border-gray-300"
                    style={{ backgroundColor: "#2D2D2D" }}
                >
                    {/* Tombol X */}
                    <button
                        onClick={onClose}
                        className="absolute left-4 text-white hover:opacity-70 transition"
                        style={{ background: "transparent", border: "none" }}
                    >
                        <X size={22} strokeWidth={2.5} color="white" />
                    </button>

                    {/* Judul */}
                    <h2 className="text-base font-semibold text-white text-center w-full">
                        {finalTitle}
                    </h2>
                </div>

                {/* ======================= */}
                {/* BODY                   */}
                {/* ======================= */}
                <div className="p-6 space-y-4">

                    {/* Alert utama */}
                    <div
                        className={`${alertColor} border rounded-md p-4 flex items-start gap-3`}
                    >
                        <AlertTriangle
                            size={18}
                            className="mt-0.5 flex-shrink-0"
                        />
                        <p className="text-sm leading-snug">
                            <span className="font-semibold">Perhatian!</span>
                            <br />
                            {alertMessage}
                        </p>
                    </div>

                    {/* Jika delete → tampilkan detail data yg dihapus */}
                    {variant === "delete" && (
                        <div className="bg-red-100 border border-red-300 rounded-md p-4 text-red-800">
                            <p className="font-semibold mb-2 flex items-center gap-2">
                                <AlertTriangle size={16} />
                                Data yang akan anda hapus
                            </p>

                            <div className="text-sm space-y-1">
                                {dataToDelete.length > 0 ? (
                                    dataToDelete.map((item, i) => (
                                        <div key={i}>
                                            [{item.key}] : {item.value}
                                        </div>
                                    ))
                                ) : (
                                    <p>[key] : [value]</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tombol Konfirmasi */}
                    <button
                        className={`w-full ${buttonColor} text-white font-semibold py-2.5 rounded-md flex items-center justify-center transition`}
                        onClick={onConfirm}
                    >
                        {buttonIcon}
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
