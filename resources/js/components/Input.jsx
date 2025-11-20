import { useState } from "react";

export default function OsInput({
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

    /** #########################################################
     * 🔹 CUSTOM NUMBER INPUT (ADA PANAH ATAS & BAWAH)
     ######################################################### */
    if (type === "number") {
        const increase = () => {
            const newValue = Number(inputValue || 0) + 1;
            setInputValue(newValue);
            onChange && onChange({ target: { value: newValue } });
        };

        const decrease = () => {
            const newValue = Number(inputValue || 0) - 1;
            setInputValue(newValue);
            onChange && onChange({ target: { value: newValue } });
        };

        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="mb-1 text-os-small text-gray-600">
                        {label}
                    </label>
                )}

                <div className="relative w-full">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            onChange && onChange(e);
                        }}
                        placeholder={placeholder}
                        className="w-full min-h-[48px] px-3 py-2 rounded-lg text-os-paragraph border-os-1 border-os-black outline-none focus:border-os-primary focus:ring-1 focus:ring-os-primary"
                    />
                </div>
            </div>
        );
    }

    /** 🔹 TEXT INPUT */
    if (
        type === "text" ||
        type === "email" ||
        type === "password"
    ) {
        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="mb-1 text-os-small text-gray-600">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        onChange && onChange(e);
                    }}
                    placeholder={placeholder}
                    className="w-full min-h-[48px] px-3 py-2 rounded-lg text-os-paragraph border-os-1 border-os-black outline-none focus:border-os-primary focus:ring-1 focus:ring-os-primary"
                />
            </div>
        );
    }

    /** 🔹 TEXTAREA */
    if (type === "textarea") {
        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="mb-1 text-os-small text-gray-600">
                        {label}
                    </label>
                )}
                <textarea
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        onChange && onChange(e);
                    }}
                    placeholder={placeholder}
                    className="w-full min-h-[100px] px-3 py-2 rounded-lg text-os-paragraph border-os-1 border-os-black outline-none focus:border-os-primary focus:ring-1 focus:ring-os-primary"
                />
            </div>
        );
    }

    /** 🔹 SUGGEST INPUT */
    if (type === "suggest") {
        const filtered = suggestions.filter((s) =>
            s.toLowerCase().includes(inputValue.toLowerCase())
        );

        return (
            <div className={`relative flex flex-col ${className}`}>
                {label && (
                    <label className="mb-1 text-os-small text-gray-600">
                        {label}
                    </label>
                )}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        onChange && onChange(e);
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
    if (type === "bullet") {
        return (
            <div className={`flex flex-col items-center gap-4 ${className}`}>
                {label && (
                    <label className="text-sm text-gray-600">{label}</label>
                )}

                <div className="flex gap-8 items-center">
                    {options.map((opt, idx) => (
                        <label
                            key={idx}
                            className="flex flex-col items-center cursor-pointer select-none"
                        >
                            <span className="text-sm font-medium text-gray-700 mb-2">
                                {opt}
                            </span>

                            <div className="relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name={name}
                                    value={opt}
                                    checked={String(value) === String(opt)}
                                    onChange={() => onChange && onChange(opt)}
                                    className="peer appearance-none w-8 h-8 rounded-full border-2 border-black cursor-pointer transition-all duration-200 hover:scale-110"
                                />
                                <div className="absolute w-6 h-6 rounded-full bg-black opacity-0 peer-checked:opacity-100 transition-all duration-200" />
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        );
    }

    /** 🔹 SELECT (DROPDOWN) */
    if (type === "select") {
        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="mb-1 text-os-small text-gray-600">
                        {label}
                    </label>
                )}

                <select
                    name={name}
                    value={value}
                    onChange={(e) => onChange && onChange(e)}
                    className={`w-full h-[48px] px-3 py-2 rounded-lg text-os-paragraph border-os-1 border-os-black outline-none focus:border-os-primary focus:ring-1 focus:ring-os-primary ${className}`}
                >
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt.value || opt}>
                            {opt.label || opt}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    return null;
}
