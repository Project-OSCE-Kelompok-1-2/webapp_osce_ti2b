export default function OsButton({
    name = "os-primary",
    children,
    onClick,
    className = "",
    type = "button",
}) {
    // name = "warning" akan menghasilkan baseColor: var(--os-warning)
    const baseColor = `var(--os-${name})`;

    //   Warna yang tersedia: primary, secondary, tertiary, black, white, warning, edit, neutral, success
    // Berdasarkan isi COLOURS tailwind.config.js

    // name= "primary" | Contoh penggunaan: <Os_button name="primary">Click Me</Os_button>

    return (
        <button
            type={type}
            onClick={onClick}
            style={{
                backgroundColor: baseColor,
                color: "var(--os-white)",
                transition: "all 0.25s ease-in-out",
                fontWeight: "var(--os-font-regular)",
            }}
            className={`px-4 py-2 min-h-[45px] rounded-md font-os-weight-semibold transform hover:scale-[102%] active:scale-95 ${className}`}
            onMouseEnter={(e) => {
                // Buat efek hover warna sedikit gelap
                e.currentTarget.style.backgroundColor = `color-mix(in srgb, ${baseColor} 85%, black 15%)`;
            }}
            onMouseLeave={(e) => {
                // Kembalikan ke warna aslinya
                e.currentTarget.style.backgroundColor = baseColor;
            }}
        >
            {children}
        </button>
    );
}
