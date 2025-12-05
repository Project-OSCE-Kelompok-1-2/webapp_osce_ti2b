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
}) {
    const [focused, setFocused] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");

    // State tambahan untuk Multiple Choice
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);

// Sinkronisasi dan filter untuk multi-select (TETAP SAMA)
    useEffect(() => {
        if (type === "multi-select") {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = options.filter((opt) =>
                (opt.label || opt).toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredOptions(filtered);
        }
    }, [searchQuery, options, type]);

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
        const increase = () => {
            const newValue = Number(inputValue || 0) + 1;
            setInputValue(newValue);
            onChange && onChange({ target: { value: newValue, name } });
        };

        const decrease = () => {
            const newValue = Number(inputValue || 0) - 1;
            setInputValue(newValue);
            onChange && onChange({ target: { value: newValue, name } });
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
    if (type === "text" || type === "email" || type === "password") {
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
        // Gunakan prop 'value' untuk filtering
        const currentValue = value || "";

        const filtered = suggestions.filter((s) =>
            s?.toLowerCase().includes(currentValue.toLowerCase())
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
                    // Gunakan prop 'value' langsung
                    value={currentValue}
                    onChange={(e) => {
                        // Tidak perlu setInputValue lokal, karena komponen induk akan mengurusnya
                        // dan mengirim kembali via prop 'value'.
                        onChange && onChange(e);
                    }}
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    // Perlu timeout agar onClick pada <li> sempat tereksekusi
                    onBlur={() => setTimeout(() => setFocused(false), 150)}
                    className="w-full min-h-[48px] px-3 py-2 border-os-1 border-os-black rounded-lg bg-white outline-none focus:border-os-primary focus:ring-1 focus:ring-os-primary"
                />
                {focused && filtered.length > 0 && (
                    // Naikkan mt-20 menjadi mt-[52px] atau sejenisnya
                    // agar list tepat di bawah input (48px tinggi + sedikit margin)
                    <ul className="absolute z-10 mt-[52px] w-full bg-white border rounded-lg max-h-48 overflow-auto shadow-lg">
                        {filtered.map((s, i) => (
                            <li
                                key={i}
                                onClick={() => {
                                    // Panggil onChange, mengirimkan string saran (s)
                                    // Komponen induk harus mengupdate state-nya dengan 's'
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
                                    // Untuk type bullet, onChange menerima nilai opt langsung
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

    /** 🔹 DATE INPUT */
    if (type === "date") {
        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="mb-1 text-os-small text-gray-600">
                        {label}
                    </label>
                )}
                <input
                    type="date"
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

    /** 🔹 CLOCK (TIME) INPUT */
    if (type === "clock") {
        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="mb-1 text-os-small text-gray-600">
                        {label}
                    </label>
                )}
                <input
                    type="time" // Menggunakan type="time" HTML5
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

    /** 🔹 MULTIPLE CHOICE (CHECKBOX GROUP WITH SEARCH) */
    if (type === "multi-select") {
        // value diharapkan berupa array dari nilai yang dipilih
        const selectedValues = Array.isArray(value) ? value : [];

        const handleCheckboxChange = (optionValue) => {
            const newValue = selectedValues.includes(optionValue)
                ? selectedValues.filter((v) => v !== optionValue) // Hapus
                : [...selectedValues, optionValue]; // Tambah

            // Panggil onChange, mengirim array nilai yang telah diperbarui
            onChange && onChange({ target: { value: newValue, name } });
        };

        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className=" text-os-small text-gray-600">
                        {label}
                    </label>
                )}

                <div className="border border-os-black rounded-lg p-2">
                    {/* Input Pencarian */}
                    <input
                        type="text"
                        placeholder="Cari..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border rounded-lg outline-none border-os-black"
                    />

                    {/* Daftar Pilihan (dengan overflow) */}
                    <div className="max-h-64 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt, idx) => {
                                // Mendapatkan nilai dan label dari opsi
                                const optValue = opt.value || opt;
                                const optLabel = opt.label || opt;

                                // Cek apakah opsi saat ini terpilih
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
                                            className="mr-3 w-4 h-4 text-os-primary focus:ring-os-primary border-gray-300 rounded"
                                        />
                                        <span className="text-os-paragraph text-gray-800">
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
            </div>
        );
    }

    /** 🔹 SINGLE SELECT (DROPDOWN WITH SEARCH) */
    /** 🔹 SINGLE SELECT (SEARCH + SINGLE CHOICE) */
    /** 🔹 SINGLE SELECT — UI seperti multi-select checkbox tapi hanya 1 bisa dipilih */
    /** 🔹 SINGLE SELECT — Checkbox UI + Search + Only One Selected */
    if (type === "single-select") {
        const selectedValue = value || "";
        const [query, setQuery] = useState("");

        const filteredOptions = options.filter((opt) => {
            const label = opt.label || opt;
            return label.toLowerCase().includes(query.toLowerCase());
        });

        const selectOption = (val) => {
            onChange?.({ target: { name, value: val } });
        };

        return (
            <div className={`flex flex-col ${className}`}>
                {label && (
                    <label className="text-os-small text-gray-600">
                        {label}
                    </label>
                )}

                <div className="p-2 border border-os-black rounded-lg">
                    {/* 🔍 Search box */}
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-os-black rounded-lg p-2 mb-2 text-os-base w-full"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    {/* List Checkbox */}
                    <div className=" rounded-lg bg-white">
                        {filteredOptions.length === 0 && (
                            <p className="text-gray-400 text-sm p-2">
                                No result...
                            </p>
                        )}

                        {filteredOptions.map((opt, idx) => {
                            const val = opt.value || opt;
                            const label = opt.label || opt;
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
                                        className="w-4 h-4"
                                    />
                                    <span>{label}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    /** 🔹 MULTI INPUT (SEARCH + MULTI SELECT + CHIPS) */
    if (type === "multi-input") {
        const selected = Array.isArray(value) ? value : [];
        const [search, setSearch] = useState("");

        // Simpan waktu per item
        const [timeMap, setTimeMap] = useState({});

        const filtered = options.filter((opt) =>
            (opt.label || opt).toLowerCase().includes(search.toLowerCase())
        );

        const toggleOption = (optValue) => {
            const isSelected = selected.includes(optValue);

            const newValue = isSelected
                ? selected.filter((v) => v !== optValue)
                : [...selected, optValue];

            // Update selected item
            onChange && onChange({ target: { value: newValue, name } });

            // Jika unselect, hapus waktu juga
            if (!isSelected) return;
        };

        const updateTime = (optValue, time) => {
            setTimeMap((prev) => ({
                ...prev,
                [optValue]: time,
            }));
        };

        return (
            <div className={`flex flex-col ${className} `}>
                {label && (
                    <label className="text-os-small text-gray-600">
                        {label}
                    </label>
                )}

                {/* SEARCH BOX */}
                <div className="p-2 border border-os-black rounded-lg">
                    <input
                        type="text"
                        placeholder="Cari item..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-2 border rounded-lg outline-none border-os-black"
                    />

                    {/* LIST OPTIONS */}
                    <div className=" mt-2">
                        {filtered.map((opt, idx) => {
                            const val = opt.value || opt;
                            const label = opt.label || opt;
                            const active = selected.includes(val);

                            return (
                                <div
                                    key={idx}
                                    className={`
                                    p-2 flex items-center justify-between cursor-pointer
                                    hover:bg-gray-100 border-b
                                    ${active ? "bg-gray-200 font-semibold" : ""}
                                `}
                                    onClick={() => toggleOption(val)}
                                >
                                    {/* LABEL ITEM */}
                                    <span>{label}</span>

                                    {/* CLOCK INPUT */}
                                    <input
                                        type="time"
                                        value={timeMap[val] || ""}
                                        onChange={(e) =>
                                            updateTime(val, e.target.value)
                                        }
                                        className="border border-os-black px-2 py-1 rounded-lg ml-3"
                                        onClick={(e) => e.stopPropagation()} // biar tidak toggle saat klik time
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    if (type === "multi-input-drop") {
        // ... (Inisialisasi schedules, search, suggestSearch, focusedIndex TETAP SAMA) ...

        const initialSchedules = Array.isArray(value)
            ? value
            : options.map((opt) => ({
                  stase: opt.value || opt,
                  dosen: "",
              }));

        const [schedules, setSchedules] = useState(initialSchedules);
        const [search, setSearch] = useState("");
        const [suggestSearch, setSuggestSearch] = useState("");
        // Gunakan stase ID/value untuk fokus, BUKAN index array, untuk mengatasi masalah filtering
        const [focusedStaseId, setFocusedStaseId] = useState(null);

        // Menerapkan pencarian pada list stase yang ditampilkan
        const filteredSchedules = schedules.filter((schedule) => {
            const staseData = options.find(
                (opt) => (opt.value || opt) === schedule.stase
            ) || { label: schedule.stase };
            return staseData.label.toLowerCase().includes(search.toLowerCase());
        });

        // ⚠️ PERUBAHAN UTAMA: Gunakan ID Stase untuk menemukan index yang benar
        const findIndexByStaseId = (staseId) =>
            schedules.findIndex((s) => s.stase === staseId);

        const handleSelectDosen = (staseId, dosenName) => {
            const index = findIndexByStaseId(staseId);
            if (index === -1) return;

            const newSchedules = [...schedules];
            newSchedules[index].dosen = dosenName;

            setSchedules(newSchedules);
            setSuggestSearch(dosenName);
            onChange?.({ target: { name, value: newSchedules } });
            setFocusedStaseId(null); // Tutup list setelah seleksi
        };

        const handleDosenChange = (staseId, typedValue) => {
            const index = findIndexByStaseId(staseId);
            if (index === -1) return;

            const newSchedules = [...schedules];
            newSchedules[index].dosen = typedValue;

            setSchedules(newSchedules);
            setSuggestSearch(typedValue);
            onChange?.({ target: { name, value: newSchedules } });
        };

        const filteredSuggest = suggestOptions.filter((d) =>
            d.toLowerCase().includes(suggestSearch.toLowerCase())
        );

        return (
            <div className={`flex flex-col ${className} `}>
                {label && (
                    <label className="text-os-small text-gray-600">
                        {label}
                    </label>
                )}
                <div className="border border-os-black p-2 rounded-lg">
                    {/* SEARCH STASE */}
                    <input
                        type="text"
                        placeholder="Cari stase..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className=" mb-2 border border-os-black p-2 rounded-lg w-full"
                    />

                    {/* CONTAINER LIST STASE DENGAN SCROLL */}
                    <div className=" rounded-lg ">
                        {filteredSchedules.map((schedule, idx) => {
                            const staseId = schedule.stase; // ID Unik Stase
                            const staseData = options.find(
                                (opt) => (opt.value || opt) === staseId
                            ) || { label: staseId };
                            const staseLabel = staseData.label;
                            const isFocused = focusedStaseId === staseId; // Cek fokus berdasarkan ID

                            return (
                                <div
                                    key={staseId}
                                    // UI: Tambah z-index saat fokus
                                    className={`m-1 p-1 px-0 '} ${
                                        isFocused ? "relative z-40" : ""
                                    } flex items-center justify-center`}
                                >
                                    {/* NAMA STASE */}
                                    <div className="font-medium pb-2 text-os-paragraph w-full">
                                        {staseLabel}
                                    </div>

                                    {/* INPUT DOSEN */}
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            placeholder="Cari dosen..."
                                            className="os-input w-full border border-os-black p-2 rounded-lg "
                                            value={schedule.dosen}
                                            onChange={(e) =>
                                                handleDosenChange(
                                                    staseId,
                                                    e.target.value
                                                )
                                            }
                                            onFocus={() => {
                                                setFocusedStaseId(staseId); // Set fokus berdasarkan ID
                                                setSuggestSearch(
                                                    schedule.dosen
                                                );
                                            }}
                                            onBlur={() =>
                                                setTimeout(
                                                    // Tutup fokus BUKAN index, tapi ID
                                                    () =>
                                                        setFocusedStaseId(null),
                                                    150
                                                )
                                            }
                                        />

                                        {/* LIST SUGGEST Dosen */}
                                        {isFocused &&
                                            filteredSuggest.length > 0 && (
                                                <ul
                                                    // UI: z-50 dan top-full mt-1. Ini harusnya mengatasi masalah potong jika tidak ada ancestor lain yang memotong.
                                                    className="absolute z-50 w-full bg-white border rounded-lg max-h-48 overflow-auto shadow-lg top-full mt-1"
                                                >
                                                    {filteredSuggest.map(
                                                        (s, i) => (
                                                            <li
                                                                key={i}
                                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                                // Panggil handler dengan ID Stase
                                                                onClick={() =>
                                                                    handleSelectDosen(
                                                                        staseId,
                                                                        s
                                                                    )
                                                                }
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
            </div>
        );
    }

    return null;
}
