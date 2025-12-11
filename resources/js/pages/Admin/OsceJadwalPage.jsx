import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import axios from "axios";
import {
    Search,
    ArrowLeft,
    Pencil,
    Trash2,
    ClipboardList,
    CalendarClock,
    Plus,
    Edit,
    Edit2,
} from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import Modals from "../../components/Modals.jsx";
import OsModal from "../../components/Modal";
import OsIcon from "../../components/icons.jsx";
import OsStepModal from "../../components/StepModal.jsx";

import OsInput from "../../components/input.jsx";
import OsButton from "../../components/button.jsx";
import OsHeader from "../../components/Header.jsx";

// [MODIFIKASI] Update lebar dan padding kolom agar lebih lega
const jadwalColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16 shrink-0",
        classes: "justify-center items-center",
    },
    {
        key: "tanggal",
        content: "Tanggal",
        width: "w-48 shrink-0", // [UBAH] Diperlebar dari w-32 ke w-48
        classes: "justify-start items-center px-6", // [UBAH] Padding diperbesar (px-6)
    },
    {
        key: "jam_mulai",
        content: "Mulai",
        width: "w-28 shrink-0", // [UBAH] Sedikit diperlebar
        classes: "justify-center items-center px-2",
    },
    {
        key: "jam_selesai",
        content: "Selesai",
        width: "w-28 shrink-0", // [UBAH] Sedikit diperlebar
        classes: "justify-center items-center px-2",
    },
    {
        key: "ruangan",
        content: "Ruangan",
        width: "flex-1 min-w-[250px] shrink-0", // [UBAH] Min-width ditambah agar tidak terlalu sempit
        classes: "justify-start items-center px-6", // [UBAH] Padding diperbesar
    },
    {
        key: "jumlah_mahasiswa",
        content: "Kuota",
        width: "w-44 shrink-0", // [UBAH] Diperlebar agar header tidak sesak
        classes: "justify-center items-center px-4",
    },
    {
        key: "action",
        content: "Action",
        width: "w-24 shrink-0",
        classes: "justify-center items-center",
    },
];

export default function SesiOscePage({
    sesi,
    osce,
    filters,
    master_stase = [],
}) {
    const { errors } = usePage().props;

    // State UI Standar
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSesi, setSelectedSesi] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // --- STATE KHUSUS WIZARD (STEP MODAL) ---
    const [isStepOpen, setIsStepOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    // Menyimpan data input wizard
    const [wizardData, setWizardData] = useState({
        stase_objs: [],
        stase_ids: [],
        tanggal: "",
        jam_mulai: "",
        durasi: "60",
        id_ruang: "",
        penguji_map: {},
        // Data Mahasiswa
        filter_angkatan: "",
        mahasiswa_ids: [],
    });

    // Menyimpan data dinamis (hasil filter API)
    const [isLoadingCheck, setIsLoadingCheck] = useState(false);
    const [availRooms, setAvailRooms] = useState([]);
    const [availPenguji, setAvailPenguji] = useState([]);

    // State untuk Step 5 (Mahasiswa)
    const [listAngkatan, setListAngkatan] = useState([]);
    // const [useFilterAngkatan, setUseFilterAngkatan] = useState(false); <-- Hapus state ini jika sudah tidak dipakai
    const [availableMahasiswa, setAvailableMahasiswa] = useState([]);
    const [isLoadingMhs, setIsLoadingMhs] = useState(false);

    // --- LOGIC FILTER DINAMIS ---
    useEffect(() => {
        if (currentStep === 2 && wizardData.tanggal && wizardData.jam_mulai) {
            checkAvailability();
        }
    }, [currentStep]);

    // Trigger fetch saat masuk step 4 (index array 4) -> Step Mahasiswa
    useEffect(() => {
        if (currentStep === 4) {
            fetchMahasiswa(wizardData.filter_angkatan);
        }
    }, [currentStep, wizardData.filter_angkatan]);

    const checkAvailability = async () => {
        setIsLoadingCheck(true);
        try {
            const res = await axios.post("/admin/osce/check-availability", {
                tanggal: wizardData.tanggal,
                jam_mulai: wizardData.jam_mulai,
                durasi: wizardData.durasi,
            });
            setAvailRooms(res.data.rooms);
            setAvailPenguji(res.data.penguji);
        } catch (err) {
            console.error(err);
            alert("Gagal mengecek ketersediaan jadwal.");
        } finally {
            setIsLoadingCheck(false);
        }
    };

    // Fetch Data Mahasiswa
    const fetchMahasiswa = async (angkatan = "") => {
        setIsLoadingMhs(true);
        try {
            const res = await axios.post("/admin/osce/get-mahasiswa", {
                angkatan: angkatan,
            });

            setAvailableMahasiswa(res.data.mahasiswa);

            if (res.data.list_angkatan && listAngkatan.length === 0) {
                const optionsRaw = res.data.list_angkatan.map((th) => ({
                    value: th,
                    label: `Tahun Akademik ${th}`,
                }));
                // Hapus unshift opsi "Semua Angkatan" sesuai request sebelumnya
                setListAngkatan(optionsRaw);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingMhs(false);
        }
    };

    // --- SUBMIT FINAL WIZARD ---
    const handleWizardSubmit = () => {
        if (wizardData.mahasiswa_ids.length !== wizardData.stase_ids.length) {
            // Optional Validation
        }

        router.post(`/admin/osce/${osce.id_osce}/jadwal`, wizardData, {
            onSuccess: () => {
                setIsStepOpen(false);
                setCurrentStep(0);
                setWizardData({
                    stase_objs: [],
                    stase_ids: [],
                    tanggal: "",
                    jam_mulai: "",
                    durasi: "60",
                    id_ruang: "",
                    penguji_map: {},
                    filter_angkatan: "",
                    mahasiswa_ids: [],
                });
            },
            preserveScroll: true,
            onError: (errors) => {
                console.log("Validation Errors:", errors);
            },
        });
    };

    function handleSearch(e) {
        e.preventDefault();
        router.get(
            `/admin/osce/${osce.id_osce}/sesi`,
            { search: searchTerm },
            { preserveState: true, replace: true }
        );
    }

    // --- DELETE LOGIC ---
    function openDeleteModal(item) {
        setSelectedSesi(item);
        setIsModalOpen(true);
    }

    function confirmDelete() {
        if (!selectedSesi) return;

        const jamMulaiClean = selectedSesi.jam_mulai.substring(0, 5);
        const uniqueSesiId = `${selectedSesi.tanggal}_${jamMulaiClean}`;

        router.delete(`/admin/osce/${osce.id_osce}/jadwal/${uniqueSesiId}`, {
            onSuccess: () => {
                setIsModalOpen(false);
                setSelectedSesi(null);
            },
            preserveScroll: true,
        });
    }

    const handleDeleteSesi = (item) => openDeleteModal(item);

    // Update mapping rows untuk data tabel
    const rows = sesi.data.map((item, index) => ({
        no: sesi.from + index,

        // Hanya menampilkan Tanggal
        tanggal: (
            <span className="font-medium text-gray-700">
                {item.tanggal_formatted}
            </span>
        ),

        // Menampilkan Jam Mulai
        jam_mulai: (
            <span className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                {item.jam_mulai_formatted}
            </span>
        ),

        // Menampilkan Jam Selesai (Data dari controller yang baru kita tambah)
        jam_selesai: (
            <span className="text-sm bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200">
                {item.jam_selesai_formatted}
            </span>
        ),

        ruangan: item.nama_ruang || "-",

        jumlah_mahasiswa: (
            <span className="text-sm">{item.jumlah_mahasiswa} Mahasiswa</span>
        ),

        action: (
            <div className="flex items-center justify-center w-full px-2">
                <OsButton
                    name="warning"
                    onClick={() => handleDeleteSesi(item)}
                    title="Hapus Sesi"
                    className="p-2"
                >
                    <Trash2 size={18} />
                </OsButton>
            </div>
        ),
    }));

    const calculateEndTime = () => {
        if (!wizardData.jam_mulai || !wizardData.durasi) return "";

        const staseCount = wizardData.stase_ids.length;
        if (staseCount === 0) return "";

        const [hours, minutes] = wizardData.jam_mulai.split(":").map(Number);
        const totalDurationMinutes = parseInt(wizardData.durasi) * staseCount;

        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes + totalDurationMinutes);

        const endHours = String(date.getHours()).padStart(2, "0");
        const endMinutes = String(date.getMinutes()).padStart(2, "0");

        return `${endHours}:${endMinutes}`;
    };

    const jamSelesaiOtomatis = calculateEndTime();

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="grid w-full p-os-16 lg:p-4 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 lg:ml-20">
                <OsHeader variant="goback" backLink="/admin/osce/" />

                <div className="flex-1 overflow-auto ">
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold mb-1">
                            {osce.nama_osce || "Detail Jadwal OSCE"}
                        </h2>

                        <div className="text-sm text-gray-500 mb-4 max-w-lg">
                            <p>
                                Halaman ini digunakan untuk mengelola{" "}
                                <strong>Jadwal Sesi</strong> pada ujian{" "}
                                <strong>{osce.nama_osce}</strong>.
                            </p>
                            {osce.tanggal_mulai && (
                                <p className="mt-1 text-xs text-gray-400">
                                    Pelaksanaan: {osce.tanggal_mulai} s/d{" "}
                                    {osce.tanggal_selesai}
                                </p>
                            )}
                        </div>
                        <OsButton
                            name="primary"
                            onClick={() => {
                                setCurrentStep(0);
                                setIsStepOpen(true);
                            }}
                            className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                            <OsIcon
                                name="add"
                                className="h-os-20 os-icon-light mr-os-8"
                            />
                            Tambah Sesi
                        </OsButton>
                    </section>

                    <section className="rounded-lg w-full">
                        <OsSearchBar
                            search={searchTerm}
                            setSearch={setSearchTerm}
                            onSearchClick={handleSearch}
                            placeholder="Cari sesi..."
                        />
                    </section>

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Sesi
                    </h2>

                    <div className="w-full overflow-x-auto pb-4">
                        <div className="min-w-max border rounded-lg overflow-hidden">
                            <OsTableHeader columns={jadwalColumns} />
                            {rows.length > 0 ? (
                                <OsTableBody
                                    data={rows}
                                    columns={jadwalColumns}
                                />
                            ) : (
                                <div className="flex items-center justify-center border-t border-gray-200">
                                    <p className="w-full text-center text-sm py-4 text-gray-500">
                                        Data sesi tidak ditemukan.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <OsPagination links={sesi?.links} />
                </div>

                <footer>
                    <OsCopyright />
                </footer>
            </main>

            {/* DELETE MODAL */}
            <Modals
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                variant="delete"
                title="Hapus Sesi?"
                message="Apakah Anda yakin ingin menghapus seluruh jadwal sesi ini? Semua stase pada jam ini akan terhapus."
                dataToDelete={
                    selectedSesi
                        ? [
                              {
                                  key: "Tanggal",
                                  value: selectedSesi.tanggal_formatted,
                              },
                              {
                                  key: "Jam Mulai",
                                  value: selectedSesi.jam_mulai_formatted,
                              },
                          ]
                        : []
                }
                confirmText="Hapus"
            />

            {/* === STEP MODAL DINAMIS === */}
            <OsStepModal
                show={isStepOpen}
                onClose={() => setIsStepOpen(false)}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                onSubmit={handleWizardSubmit}
                steps={[
                    // STEP 1: Pilih Stase
                    {
                        title: "Pilih Stase",
                        content: (
                            <div>
                                <label className="mb-2 block text-sm font-bold">
                                    Stase Soal
                                </label>
                                <OsInput
                                    type="multi-select"
                                    label="Cari stase..."
                                    options={master_stase}
                                    value={wizardData.stase_ids}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        const rawValues = Array.isArray(
                                            selected
                                        )
                                            ? selected
                                            : [];
                                        let newIds = [];
                                        let newObjs = [];

                                        if (
                                            rawValues.length > 0 &&
                                            typeof rawValues[0] === "object"
                                        ) {
                                            newObjs = rawValues;
                                            newIds = rawValues.map(
                                                (item) => item.value
                                            );
                                        } else {
                                            newIds = rawValues;
                                            newObjs = master_stase.filter(
                                                (ms) =>
                                                    rawValues.includes(ms.value)
                                            );
                                        }

                                        setWizardData({
                                            ...wizardData,
                                            stase_ids: newIds,
                                            stase_objs: newObjs,
                                        });
                                    }}
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                    {wizardData.stase_ids.length} stase dipilih.
                                </p>
                            </div>
                        ),
                    },
                    // STEP 2: Jadwal & Durasi
                    {
                        title: "Jadwal & Durasi",
                        content: (
                            <div className="flex flex-col gap-4">
                                <OsInput
                                    type="date"
                                    label="Tanggal Mulai"
                                    value={wizardData.tanggal}
                                    onChange={(e) =>
                                        setWizardData({
                                            ...wizardData,
                                            tanggal: e.target.value,
                                        })
                                    }
                                />
                                <div>
                                    <OsInput
                                        type="number"
                                        label={`Durasi per Stase (Menit)`}
                                        placeholder="Contoh: 15"
                                        value={wizardData.durasi}
                                        onChange={(e) =>
                                            setWizardData({
                                                ...wizardData,
                                                durasi: e.target.value,
                                            })
                                        }
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        *Total ada {wizardData.stase_ids.length}{" "}
                                        stase terpilih.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1/2">
                                        <OsInput
                                            type="clock"
                                            label="Jam Mulai"
                                            value={wizardData.jam_mulai}
                                            onChange={(e) =>
                                                setWizardData({
                                                    ...wizardData,
                                                    jam_mulai: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="w-1/2 flex flex-col">
                                        <label className="text-os-small text-gray-600 mb-1">
                                            Jam Selesai (Estimasi)
                                        </label>
                                        <div className="relative w-full">
                                            <input
                                                type="time"
                                                disabled
                                                value={jamSelesaiOtomatis}
                                                className="w-full min-h-[48px] px-3 py-2 rounded-lg border border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed outline-none font-medium"
                                            />
                                            <div className="absolute right-3 top-3 text-gray-400">
                                                <CalendarClock size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                    // STEP 3: Pilih Sirkuit
                    {
                        title: "Pilih Sirkuit",
                        content: (
                            <div>
                                {isLoadingCheck ? (
                                    <div className="py-4 text-center text-gray-500">
                                        Sedang mengecek sirkuit tersedia...
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 mb-2">
                                            Hanya menampilkan sirkuit kosong
                                            pada jam tersebut.
                                        </div>
                                        <OsInput
                                            type="single-select"
                                            label="Ruangan Ujian"
                                            placeholder="Pilih Sirkuit"
                                            options={availRooms}
                                            value={wizardData.id_ruang}
                                            onChange={(e) => {
                                                const selectedId =
                                                    e.target.value;
                                                setWizardData({
                                                    ...wizardData,
                                                    id_ruang: selectedId,
                                                });
                                            }}
                                        />
                                        {availRooms.length === 0 && (
                                            <p className="text-red-500 text-xs mt-1">
                                                Tidak ada sirkuit tersedia.
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        ),
                    },
                    // STEP 4: Pilih Penguji
                    {
                        title: "Pilih Penguji",
                        content: (
                            <div>
                                {isLoadingCheck ? (
                                    <div className="py-4 text-center">
                                        Loading...
                                    </div>
                                ) : (
                                    <div className="max-h-[300px] overflow-y-auto pr-2 flex flex-col gap-4">
                                        <div className="bg-blue-50 p-2 rounded text-xs text-blue-700">
                                            Pilih penguji untuk setiap stase.
                                            (Penguji tidak boleh rangkap)
                                        </div>
                                        {wizardData.stase_objs.map((stase) => {
                                            const allSelectedIds =
                                                Object.values(
                                                    wizardData.penguji_map
                                                );
                                            const currentSelectedId =
                                                wizardData.penguji_map[
                                                    stase.value
                                                ];

                                            const filteredOptions =
                                                availPenguji.filter((p) => {
                                                    const isSelectedElsewhere =
                                                        allSelectedIds.includes(
                                                            p.value
                                                        );
                                                    const isSelectedHere =
                                                        p.value ===
                                                        currentSelectedId;
                                                    return (
                                                        !isSelectedElsewhere ||
                                                        isSelectedHere
                                                    );
                                                });

                                            return (
                                                <div
                                                    key={stase.value}
                                                    className="border p-3 rounded bg-white"
                                                >
                                                    <label className="block text-sm font-bold mb-1">
                                                        Stase: {stase.label}
                                                    </label>
                                                    <OsInput
                                                        type="single-select"
                                                        placeholder={`Penguji untuk ${stase.label}`}
                                                        options={
                                                            filteredOptions
                                                        }
                                                        value={
                                                            wizardData
                                                                .penguji_map[
                                                                stase.value
                                                            ]
                                                        }
                                                        onChange={(e) => {
                                                            setWizardData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    penguji_map:
                                                                        {
                                                                            ...prev.penguji_map,
                                                                            [stase.value]:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                })
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}
                                        {wizardData.stase_objs.length === 0 && (
                                            <p className="text-center text-gray-400">
                                                Pilih stase dulu pada step 1.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ),
                    },
                    // STEP 5: Enrollment Mahasiswa
                    {
                        title: "Enrollment Mahasiswa",
                        content: (
                            <div className="flex flex-col gap-4 min-h-[400px]">
                                {errors.mahasiswa_ids && (
                                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm flex items-center gap-2">
                                        <div className="shrink-0">⚠️</div>
                                        <div>{errors.mahasiswa_ids}</div>
                                    </div>
                                )}

                                {/* Filter Angkatan Dropdown Saja */}
                                <div className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <OsInput
                                        type="single-select"
                                        label="Filter Tahun Akademik"
                                        placeholder="Pilih Angkatan (Kosongkan untuk semua)"
                                        options={listAngkatan}
                                        value={wizardData.filter_angkatan}
                                        onChange={(e) =>
                                            setWizardData({
                                                ...wizardData,
                                                filter_angkatan: e.target.value,
                                            })
                                        }
                                        className="w-full bg-white"
                                    />
                                </div>

                                {/* Container List Mahasiswa */}
                                <div className="border rounded-lg flex-1 flex flex-col overflow-hidden bg-white shadow-sm">
                                    <div className="flex justify-between items-center p-3 border-b bg-gray-50">
                                        <label className="text-sm font-bold text-gray-700">
                                            Daftar Mahasiswa
                                        </label>

                                        <span
                                            className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${
                                                wizardData.mahasiswa_ids
                                                    .length ===
                                                wizardData.stase_ids.length
                                                    ? "bg-green-100 text-green-700 border-green-200"
                                                    : "bg-blue-50 text-blue-600 border-blue-100"
                                            }`}
                                        >
                                            {wizardData.mahasiswa_ids.length} /{" "}
                                            {wizardData.stase_ids.length}{" "}
                                            Dipilih
                                        </span>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-2">
                                        {isLoadingMhs ? (
                                            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                                                <span className="text-sm">
                                                    Memuat data...
                                                </span>
                                            </div>
                                        ) : availableMahasiswa.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                                                <p>
                                                    Tidak ada mahasiswa
                                                    ditemukan.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {availableMahasiswa.map(
                                                    (mhs) => {
                                                        const isSelected =
                                                            wizardData.mahasiswa_ids.includes(
                                                                mhs.value
                                                            );
                                                        const isMaxReached =
                                                            wizardData
                                                                .mahasiswa_ids
                                                                .length >=
                                                            wizardData.stase_ids
                                                                .length;
                                                        const isDisabled =
                                                            isMaxReached &&
                                                            !isSelected;

                                                        return (
                                                            <label
                                                                key={mhs.value}
                                                                className={`group flex items-center p-3 rounded-lg border transition-all duration-200 ${
                                                                    isDisabled
                                                                        ? "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"
                                                                        : "cursor-pointer hover:border-blue-300 hover:shadow-sm"
                                                                } ${
                                                                    isSelected
                                                                        ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                                                                        : "bg-white border-gray-200"
                                                                }`}
                                                            >
                                                                <div className="relative flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className={`w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all ${
                                                                            isDisabled
                                                                                ? "text-gray-300"
                                                                                : ""
                                                                        }`}
                                                                        checked={
                                                                            isSelected
                                                                        }
                                                                        disabled={
                                                                            isDisabled
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            const checked =
                                                                                e
                                                                                    .target
                                                                                    .checked;
                                                                            let newIds =
                                                                                [
                                                                                    ...wizardData.mahasiswa_ids,
                                                                                ];

                                                                            if (
                                                                                checked
                                                                            ) {
                                                                                if (
                                                                                    newIds.length <
                                                                                    wizardData
                                                                                        .stase_ids
                                                                                        .length
                                                                                ) {
                                                                                    newIds.push(
                                                                                        mhs.value
                                                                                    );
                                                                                }
                                                                            } else {
                                                                                newIds =
                                                                                    newIds.filter(
                                                                                        (
                                                                                            id
                                                                                        ) =>
                                                                                            id !==
                                                                                            mhs.value
                                                                                    );
                                                                            }

                                                                            setWizardData(
                                                                                {
                                                                                    ...wizardData,
                                                                                    mahasiswa_ids:
                                                                                        newIds,
                                                                                }
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span
                                                                    className={`ml-3 text-sm font-medium ${
                                                                        isSelected
                                                                            ? "text-blue-900"
                                                                            : "text-gray-700"
                                                                    }`}
                                                                >
                                                                    {mhs.label}
                                                                </span>
                                                            </label>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
}
