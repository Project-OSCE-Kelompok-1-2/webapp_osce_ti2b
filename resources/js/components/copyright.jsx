export default function OsCopyright({ children, className = "", variant = "admin" }) {
    // Tentukan kelas CSS berdasarkan varian
    const isPenguji = variant === "penguji";
    const isMahasiswa = variant === "mahasiswa"; // Tambahkan varian mahasiswa (Hijau)

    // Kelas untuk footer (latar belakang, border)
    const footerClasses = (() => {
        if (isMahasiswa) {
            // Mahasiswa: Hijau Tersier (Background) & Hijau Primary (Border)
            return "bg-[var(--os-tertiary-mhs)] border-[var(--os-primary-mhs)]";
        }
        if (isPenguji) {
            // Penguji: Oranye Tersier (Background) & Oranye Primary (Border)
            // Menggunakan variabel CSS kustom untuk konsistensi
            return "bg-[var(--os-tertiary-pj)] border-[var(--os-primary-pj)]";
        }
        // Admin: Biru Tersier (Background) & Biru Primary (Border) - Default
        return "!bg-[var(--os-tertiary)] border-[var(--os-primary)]";
    })();

    // Kelas untuk teks (warna teks)
    const textClasses = (() => {
        if (isMahasiswa) {
            // Mahasiswa: Teks Hijau Primary
            return "text-[var(--os-primary-mhs)]";
        }
        if (isPenguji) {
            // Penguji: Teks Oranye Primary
            return "text-[var(--os-primary-pj)]";
        }
        // Admin: Teks Biru Primary - Default
        return "text-[var(--os-primary)]";
    })();

    return (
        <footer
            className={`relative row-[3_/_4] col-[1_/_2] w-full h-full flex flex-col items-center justify-end bg-white p-4 rounded-xl border ${footerClasses} ${className}`}
        >
            <div className="relative self-stretch w-full">
                <div className="w-full h-full flex">
                    <div className="flex-1 flex items-center">
                        <p className={`${textClasses} text-os-paragraph opacity-os-alpha-75 text-base tracking-[0] leading-[normal] whitespace-nowrap`}>
                            {/* Mempertahankan children jika ada, atau menggunakan default */}
                            {children || "Copyright Porem ipsum dolor sit amet"}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
