import React from "react";

export default function OsCopyright({
    children,
    className = "",
    variant = "admin",
}) {
    const isPenguji = variant === "penguji";
    const isMahasiswa = variant === "mahasiswa";

    const currentYear = new Date().getFullYear();

    const footerClasses = (() => {
        if (isMahasiswa) {
            return "bg-[var(--os-tertiary-mhs)] border-[var(--os-primary-mhs)]";
        }
        if (isPenguji) {
            return "bg-[var(--os-tertiary-pj)] border-[var(--os-primary-pj)]";
        }
        return "!bg-[var(--os-tertiary)] border-[var(--os-primary)]";
    })();

    const textClasses = (() => {
        if (isMahasiswa) {
            return "text-[var(--os-primary-mhs)]";
        }
        if (isPenguji) {
            return "text-[var(--os-primary-pj)]";
        }
        return "text-[var(--os-primary)]";
    })();

    return (
        <footer
            className={`relative row-[3_/_4] col-[1_/_2] w-full h-auto flex flex-col items-center justify-end bg-white p-4 rounded-xl border ${footerClasses} ${className}`}
        >
            <div className="relative self-stretch w-full">
                <div className="w-full h-full flex justify-center">
                    <div className="flex-1 flex items-center justify-center">
                        <p
                            className={`${textClasses} text-os-paragraph opacity-os-alpha-75 text-sm tracking-[0] leading-snug text-center`}
                        >
                            {/* Jika ada children, pakai children. Jika tidak, pakai logika responsif default */}
                            {children || (
                                <>
                                    Copyright &copy; {currentYear}{" "}
                                    <strong>MOSAIC</strong>
                                    {/* --- LOGIKA RESPONSIF --- */}
                                    {/* Tampil di MOBILE saja (layar kecil) -> Tampilkan Titik */}
                                    <span className="md:hidden">. </span>
                                    {/* Tampil di DESKTOP saja (md ke atas) -> Tampilkan Titik Dua & Kepanjangan */}
                                    <span className="hidden md:inline">
                                        : Medical OSCE Assessment and
                                        Information Center.{" "}
                                    </span>
                                    {/* ------------------------- */}
                                    Politeknik Negeri Semarang. All rights
                                    reserved.
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
