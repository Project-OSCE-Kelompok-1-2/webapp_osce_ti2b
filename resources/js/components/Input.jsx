import { useState, useEffect } from "react";

export default function OsInput({
    type = "text",
    placeholder = "",
    suggestions = [],
    options = [],
    suggestOptions = [],
    value,
    onChange,
    name = "",
    className = "",
    label = "",
    required = false, // Menambahkan prop required untuk styling label
    error, // Menambahkan prop error untuk pesan validasi
}) {
    // ❌ STATE inputValue DIHAPUS (Biang kerok tombol clear tidak jalan)
    // const [inputValue, setInputValue] = useState(value || "");

    const [focused, setFocused] = useState(false);

    // State tambahan untuk Multiple Choice
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);

    // Reset search query saat value kosong (tombol clear ditekan)
    useEffect(() => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
            setSearchQuery("");
        }
    }, [value]);

    // Sinkronisasi dan filter untuk multi-select
    useEffect(() => {
        if (type === "multi-select") {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = options.filter((opt) =>
                (opt.label || opt).toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredOptions(filtered);
        }
    }, [searchQuery, options, type]);

    /** #########################################################
         * 🔹 CUSTOM NUMBER INPUT (ADA PANAH ATAS & BAWAH)
         ######################################################### */
    if (type === "number") {
        // Hapus fungsi increase/decrease internal state, langsung panggil onChange
        /* const increase = () => { ... } */

        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="mb-1 text-sm text-gray-700">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}

                <div className="relative w-full">
                    <input
                        type="number"
                        name={name}
                        value={value} // ✅ Gunakan Value Prop langsung
                        onChange={onChange}
                        placeholder={placeholder}
                        className="w-full min-h-[48px] px-3 py-2 rounded-lg text-os-paragraph border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                {error && (
                    <span className="text-xs text-red-500 mt-1">{error}</span>
                )}
            </div>
        );
    }

    /** 🔹 TEXT INPUT */
    if (type === "text" || type === "email" || type === "password") {
        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="mb-1 text-sm text-gray-700">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <input
                    type={type}
                    name={name}
                    value={value} // ✅ Gunakan Value Prop langsung
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full min-h-[48px] px-3 py-2 rounded-lg text-os-paragraph border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {error && (
                    <span className="text-xs text-red-500 mt-1">{error}</span>
                )}
            </div>
        );
    }

    /** 🔹 TEXTAREA */
    if (type === "textarea") {
        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="mb-1 text-sm text-gray-700">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <textarea
                    name={name}
                    value={value} // ✅ Gunakan Value Prop langsung
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full min-h-[100px] px-3 py-2 rounded-lg text-os-paragraph border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {error && (
                    <span className="text-xs text-red-500 mt-1">{error}</span>
                )}
            </div>
        );
    }

    /** 🔹 SUGGEST INPUT */
    if (type === "suggest") {
        const currentValue = value || "";
        const filtered = suggestions.filter((s) =>
            s?.toLowerCase().includes(currentValue.toLowerCase())
        );

        return (
            <div className={`relative flex flex-col ${className}`}>
                {label && (
                    <label className="mb-1 text-sm text-gray-700">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <input
                    type="text"
                    value={currentValue} // ✅ Sudah benar (menggunakan value prop)
                    onChange={onChange}
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 150)}
                    className="w-full min-h-[48px] px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {focused && filtered.length > 0 && (
                    <ul className="absolute z-50 mt-[52px] w-full bg-white border rounded-lg max-h-48 overflow-auto shadow-lg">
                        {filtered.map((s, i) => (
                            <li
                                key={i}
                                onClick={() => {
                                    onChange && onChange(s);
                                    setFocused(false);
                                }}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                            >
                                {s}
                            </li>
                        ))}
                    </ul>
                )}
                {error && (
                    <span className="text-xs text-red-500 mt-1">{error}</span>
                )}
            </div>
        );
    }

    /** 🔹 BULLET RADIO BUTTON GROUP */
    if (type === "bullet") {
        return (
            <div className={`flex flex-col items-center gap-4 ${className}`}>
                {label && (
                    <label className="text-sm text-gray-700">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                    </label>
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
                    <label className="mb-1 text-sm text-gray-700">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <select
                    name={name}
                    value={value} // ✅ Gunakan Value Prop
                    onChange={(e) => onChange && onChange(e)}
                    className={`w-full h-[48px] px-3 py-2 rounded-lg text-os-paragraph border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className}`}
                >
                    {options.map((opt, idx) => {
                        const val = typeof opt === "object" ? opt.value : opt;
                        const lab = typeof opt === "object" ? opt.label : opt;
                        return (
                            <option key={idx} value={val}>
                                {lab}
                            </option>
                        );
                    })}
                </select>
                {error && (
                    <span className="text-xs text-red-500 mt-1">{error}</span>
                )}
            </div>
        );
    }

    /** 🔹 DATE INPUT */
    if (type === "date") {
        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="mb-1 text-sm text-gray-700">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <input
                    type="date"
                    name={name}
                    value={value} // ✅ Gunakan Value Prop
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full min-h-[48px] px-3 py-2 rounded-lg text-os-paragraph border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {error && (
                    <span className="text-xs text-red-500 mt-1">{error}</span>
                )}
            </div>
        );
    }

    /** 🔹 CLOCK (TIME) INPUT */
    if (type === "clock") {
        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="mb-1 text-sm text-gray-700">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <input
                    type="time"
                    name={name}
                    value={value} // ✅ Gunakan Value Prop
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full min-h-[48px] px-3 py-2 rounded-lg text-os-paragraph border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {error && (
                    <span className="text-xs text-red-500 mt-1">{error}</span>
                )}
            </div>
        );
    }

    /** 🔹 MULTIPLE CHOICE (CHECKBOX GROUP WITH SEARCH) */
    if (type === "multi-select") {
        const selectedValues = Array.isArray(value) ? value : [];

        const handleCheckboxChange = (optionValue) => {
            const newValue = selectedValues.includes(optionValue)
                ? selectedValues.filter((v) => v !== optionValue)
                : [...selectedValues, optionValue];
            onChange && onChange({ target: { value: newValue, name } });
        };

        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="text-sm text-gray-700">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}

                <div className="border border-gray-300 rounded-lg p-2">
                    <input
                        type="text"
                        placeholder="Cari..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border rounded-lg outline-none border-gray-300 mb-2"
                    />
                    <div className="max-h-64 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt, idx) => {
                                const optValue = opt.value || opt;
                                const optLabel = opt.label || opt;
                                const isChecked =
                                    selectedValues.includes(optValue);
                                return (
                                    <label
                                        key={idx}
                                        className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                                    >
                                        <input
                                            type="checkbox"
                                            name={name}
                                            value={optValue}
                                            checked={isChecked}
                                            onChange={() =>
                                                handleCheckboxChange(optValue)
                                            }
                                            className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-gray-800">
                                            {optLabel}
                                        </span>
                                    </label>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500 py-4">
                                Tidak ada pilihan yang cocok.
                            </p>
                        )}
                    </div>
                </div>
                {error && (
                    <span className="text-xs text-red-500 mt-1">{error}</span>
                )}
            </div>
        );
    }

    /** 🔹 SINGLE SELECT (SEARCH) */
    if (type === "single-select") {
        const selectedValue = value || "";
        const [query, setQuery] = useState("");

        const filteredOptionsSingle = options.filter((opt) => {
            const label = opt.label || opt;
            return label.toLowerCase().includes(query.toLowerCase());
        });

        const selectOption = (val) => {
            onChange?.({ target: { name, value: val } });
        };

        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="text-sm text-gray-700">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <div className="p-2 border border-gray-300 rounded-lg">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded-lg p-2 mb-2 w-full outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="rounded-lg bg-white max-h-64 overflow-y-auto">
                        {filteredOptionsSingle.length === 0 && (
                            <p className="text-gray-400 text-sm p-2">
                                No result...
                            </p>
                        )}
                        {filteredOptionsSingle.map((opt, idx) => {
                            const val = opt.value || opt;
                            const optLabel = opt.label || opt;
                            const active = selectedValue === val;
                            return (
                                <label
                                    key={idx}
                                    className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                                >
                                    <input
                                        type="checkbox"
                                        checked={active}
                                        onChange={() => selectOption(val)}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span>{optLabel}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
                {error && (
                    <span className="text-xs text-red-500 mt-1">{error}</span>
                )}
            </div>
        );
    }

    /** 🔹 MULTI INPUT (Tags + Time) */
    if (type === "multi-input") {
        const selected = Array.isArray(value) ? value : [];
        const [search, setSearch] = useState("");
        const [timeMap, setTimeMap] = useState({});

        const filtered = options.filter((opt) =>
            (opt.label || opt).toLowerCase().includes(search.toLowerCase())
        );

        const toggleOption = (optValue) => {
            const isSelected = selected.includes(optValue);
            const newValue = isSelected
                ? selected.filter((v) => v !== optValue)
                : [...selected, optValue];
            onChange && onChange({ target: { value: newValue, name } });
        };

        const updateTime = (optValue, time) => {
            setTimeMap((prev) => ({
                ...prev,
                [optValue]: time,
            }));
        };

        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="text-sm text-gray-700">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <div className="border border-gray-300 rounded-lg p-2">
                    <input
                        type="text"
                        placeholder="Cari item..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-2 border rounded-lg outline-none border-gray-300 mb-2"
                    />
                    <div className="mt-2 max-h-64 overflow-y-auto">
                        {filtered.map((opt, idx) => {
                            const val = opt.value || opt;
                            const label = opt.label || opt;
                            const active = selected.includes(val);

                            return (
                                <div
                                    key={idx}
                                    className={`p-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 border-b ${
                                        active
                                            ? "bg-gray-100"
                                            : ""
                                    }`}
                                    onClick={() => toggleOption(val)}
                                >
                                    <span>{label}</span>
                                    <input
                                        type="time"
                                        value={timeMap[val] || ""}
                                        onChange={(e) =>
                                            updateTime(val, e.target.value)
                                        }
                                        className="border border-gray-300 px-2 py-1 rounded-lg ml-3"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
                {error && (
                    <span className="text-xs text-red-500 mt-1">{error}</span>
                )}
            </div>
        );
    }

    /** 🔹 MULTI INPUT DROP (Jadwal Stase - Dosen) */
    if (type === "multi-input-drop") {
        // [PERBAIKAN] Menggunakan derived state.
        // Jika 'value' (dari parent) adalah array & ada isinya, gunakan itu.
        // Jika tidak (misal di-reset), kembali ke array kosong yang di-map dari options.
        const schedules =
            Array.isArray(value) && value.length > 0
                ? value
                : options.map((opt) => ({
                      stase: opt.value || opt,
                      dosen: "",
                  }));

        const [search, setSearch] = useState("");
        const [suggestSearch, setSuggestSearch] = useState("");
        const [focusedStaseId, setFocusedStaseId] = useState(null);

        const filteredSchedules = schedules.filter((schedule) => {
            const staseData = options.find(
                (opt) => (opt.value || opt) === schedule.stase
            ) || { label: schedule.stase };
            return staseData.label
                ?.toLowerCase()
                .includes(search.toLowerCase());
        });

        // Handler untuk update dosen
        const handleUpdateDosen = (staseId, newDosenVal) => {
            const newSchedules = schedules.map((item) => {
                if (item.stase === staseId) {
                    return { ...item, dosen: newDosenVal };
                }
                return item;
            });
            setSuggestSearch(newDosenVal);
            onChange?.({ target: { name, value: newSchedules } });
        };

        const filteredSuggest = suggestOptions.filter((d) =>
            d.toLowerCase().includes(suggestSearch.toLowerCase())
        );

        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="text-sm text-gray-700">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <div className="border border-gray-300 p-2 rounded-lg">
                    <input
                        type="text"
                        placeholder="Cari stase..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-2 border border-gray-300 p-2 rounded-lg w-full outline-none"
                    />

                    <div className="rounded-lg max-h-[400px] overflow-y-auto">
                        {filteredSchedules.map((schedule) => {
                            const staseId = schedule.stase;
                            const staseData = options.find(
                                (opt) => (opt.value || opt) === staseId
                            ) || { label: staseId };
                            const staseLabel = staseData.label || staseId;
                            const isFocused = focusedStaseId === staseId;

                            return (
                                <div
                                    key={staseId}
                                    className={`m-1 p-2 border-b ${
                                        isFocused
                                            ? "relative z-40 bg-gray-50"
                                            : ""
                                    }`}
                                >
                                    <div className="font-medium pb-2 text-os-paragraph w-full">
                                        {staseLabel}
                                    </div>

                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            placeholder="Cari dosen..."
                                            className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:border-blue-500"
                                            value={schedule.dosen} // ✅ Controlled
                                            onChange={(e) =>
                                                handleUpdateDosen(
                                                    staseId,
                                                    e.target.value
                                                )
                                            }
                                            onFocus={() => {
                                                setFocusedStaseId(staseId);
                                                setSuggestSearch(
                                                    schedule.dosen
                                                );
                                            }}
                                            onBlur={() =>
                                                setTimeout(
                                                    () =>
                                                        setFocusedStaseId(null),
                                                    200
                                                )
                                            }
                                        />

                                        {isFocused &&
                                            filteredSuggest.length > 0 && (
                                                <ul className="absolute z-50 w-full bg-white border rounded-lg max-h-48 overflow-auto shadow-lg top-full mt-1">
                                                    {filteredSuggest.map(
                                                        (s, i) => (
                                                            <li
                                                                key={i}
                                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                                onMouseDown={() => {
                                                                    handleUpdateDosen(
                                                                        staseId,
                                                                        s
                                                                    );
                                                                    setFocusedStaseId(
                                                                        null
                                                                    );
                                                                }}
                                                            >
                                                                {s}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {error && (
                    <span className="text-xs text-red-500 mt-1">{error}</span>
                )}
            </div>
        );
    }

    return null;
}
