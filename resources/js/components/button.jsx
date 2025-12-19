export default function OsButton({
    name = "os-primary",
    children,
    onClick,
    className = "",
    type = "button",
}) {
    const baseColor = `var(--os-${name})`;

    return (
        <button
            type={type}
            onClick={onClick}
            style={{
                backgroundColor: baseColor,
                color: "var(--os-white)",
                transition: "all 0.25s ease-in-out",
                fontWeight: "var(--os-font-regular)",
                border: "2px solid " + baseColor,

            }}
            className={`px-4 py-2 min-h-[45px] rounded-lg font-os-weight-semibold transform border-2 hover:scale-[102%] active:scale-95 ${className}`}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `color-mix(in srgb, ${baseColor} 85%, black 15%)`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = baseColor;
            }}
        >
            {children}
        </button>
    );
}
