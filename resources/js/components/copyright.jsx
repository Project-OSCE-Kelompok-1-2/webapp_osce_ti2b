export default function OsCopyright({ children, className = "", variant = "admin" }) {
    // Tentukan kelas CSS berdasarkan varian
    const isPenguji = variant === "penguji";

    // Kelas untuk footer (latar belakang, border)
    const footerClasses = isPenguji
        ? "bg-os-tertiary-pj border-os-primary-pj" // Ganti dengan kelas warna oranye Anda
        : "!bg-os-tertiary border-os-primary";

    // Kelas untuk teks (warna teks)
    const textClasses = isPenguji
        ? "text-os-paragraph-pj text-os-primary-pj" // Ganti dengan kelas warna oranye Anda
        : "text-os-paragraph text-os-primary";

    return (
        <footer
            className={`relative row-[3_/_4] col-[1_/_2] w-full h-full flex flex-col items-center justify-end bg-white p-4 rounded-xl border ${footerClasses} ${className}`}
        >
            <div className="relative self-stretch w-full">
                <div className="w-full h-full flex">
                    <div className="flex-1 flex items-center">
                        <p className={`${textClasses} opacity-os-alpha-75 text-base tracking-[0] leading-[normal] whitespace-nowrap`}>
                            Copyright Porem ipsum dolor sit amet
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* Catatan:
Anda perlu memastikan bahwa kelas CSS seperti:
- bg-os-tertiary-orange
- border-os-primary-orange
- text-os-paragraph-orange
- text-os-primary-orange

sudah didefinisikan dalam konfigurasi Tailwind CSS Anda untuk menghasilkan warna oranye yang diinginkan.
*/
