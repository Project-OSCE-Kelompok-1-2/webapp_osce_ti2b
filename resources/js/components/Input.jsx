import { useState } from "react";

export default function Os_input({
    type = "text",
    placeholder = "",
    suggestions = [],
    options = [],
    value,
    onChange,
    name = "",
    className = "",
    label = "",
}) {
    const [focused, setFocused] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");

    /** 🔹 TEXT INPUT */
    if (type === "text" || type === "email" || type === "password" || type === "number") {
        return (
            <div className={`flex flex-col ${className}`}>
                {label && <label className="mb-1 text-os-small text-gray-600">{label}</label>}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        onChange && onChange(e); // ✅ kirim event, bukan value
                    }}
                    placeholder={placeholder}
                    className="w-full min-h-[48px] px-3 py-2 rounded-lg text-os-paragraph border-os-1 border-os-black outline-none focus:border-os-primary focus:ring-1 focus:ring-os-primary"
                />
            </div>
        );
    }

    /** 🔹 SUGGEST INPUT (AUTOCOMPLETE) */
    if (type === "suggest") {
        const filtered = suggestions.filter((s) =>
            s.toLowerCase().includes(inputValue.toLowerCase())
        );

        return (
            <div className={`relative flex flex-col ${className}`}>
                {label && <label className="mb-1 text-sm text-gray-600">{label}</label>}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        onChange && onChange(e); // ✅ kirim event, bukan value
                    }}
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 150)}
                    className="w-full min-h-[48px] px-3 py-2 border-os-1 border-os-black rounded-lg bg-white outline-none focus:border-os-primary focus:ring-1 focus:ring-os-primary"
                />
                {focused && filtered.length > 0 && (
                    <ul className="absolute z-10 mt-20 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-auto">
                        {filtered.map((s, i) => (
                            <li
                                key={i}
                                onClick={() => {
                                    setInputValue(s);
                                    onChange && onChange(s);
                                    setFocused(false);
                                }}
                                className="px-3 py-2 hover:bg-os-secondary hover:text-white cursor-pointer transition"
                            >
                                {s}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    /** 🔹 BULLET RADIO BUTTON GROUP */
    // Gunakan import { useState } from "react";
    // const [rating, setRating] = useState("")

    if (type === "bullet") {
        return (
            <div className={`flex flex-col gap-2 ${className}`}>
                {label && <label className="text-sm text-gray-600">{label}</label>}
                <div className="flex gap-3">
                    {options.map((opt, idx) => (
                        <label
                            key={idx}
                            className="relative flex items-center justify-center cursor-pointer"
                        >
                            <input
                                type="radio"
                                name={name}
                                value={opt}
                                checked={String(value) === String(opt)}
                                onChange={() => onChange && onChange(opt)}
                                className="peer appearance-none w-6 h-6 rounded-full border-2 border-os-primary cursor-pointer transition-all duration-200 hover:scale-110 checked:bg-os-primary checked:border-os-primary"
                            />
                            <span className="absolute text-xs mb-12 text-gray-700 select-none">
                                {opt}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        );
    }

    return null;
}
