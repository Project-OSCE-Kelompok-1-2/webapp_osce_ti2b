import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
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

const jadwalColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16",
        classes: "justify-center items-center",
    },
    {
        key: "tanggal_sesi",
        content: "Tanggal / Sesi",
        width: "w-7/12",
        classes: "justify-start items-center px-4",
    },
    {
        key: "jumlah_mahasiswa",
        content: "Jumlah Mahasiswa",
        width: "w-2/12",
        classes: "justify-start items-center px-4",
    },
    {
        key: "action",
        content: "Action",
        width: "w-3/12",
        classes: "justify-center items-center",
    },
];

export default function SesiOscePage({
    sesi,
    osce,
    filters,
    master_stase = [],
}) {
    // State UI Standar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSesi, setSelectedSesi] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // --- STATE KHUSUS WIZARD (STEP MODAL) ---
    const [isStepOpen, setIsStepOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Menyimpan data input wizard
    const [wizardData, setWizardData] = useState({
        stase_objs: [],
        stase_ids: [],
        tanggal: "",
        jam_mulai: "",
        durasi: "60",
        id_ruang: "",
        penguji_map: {},
    });

    // Menyimpan data dinamis (hasil filter API)
    const [isLoadingCheck, setIsLoadingCheck] = useState(false);
    const [availRooms, setAvailRooms] = useState([]);
    const [availPenguji, setAvailPenguji] = useState([]);

    // --- LOGIC FILTER DINAMIS ---
    useEffect(() => {
        if (currentStep === 2 && wizardData.tanggal && wizardData.jam_mulai) {
            checkAvailability();
        }
    }, [currentStep]); // useEffect sekarang sudah dikenali

    const checkAvailability = async () => {
        setIsLoadingCheck(true);
        try {
            // Menggunakan axios yang sudah di-import
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

    // --- SUBMIT FINAL WIZARD ---
    const handleWizardSubmit = () => {
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
                });
            },
            preserveScroll: true,
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

    // Modal Add Setup
    const [formData, setFormData] = useState({
        nama_sesi: "",
        durasi: "",
        keterangan: "",
    });
    const [isAddOpen, setIsAddOpen] = useState(false);

    function openAddModal() {
        setFormData({ nama_sesi: "", durasi: "", keterangan: "" });
        setIsAddOpen(true);
    }

    function openEditModal(item) {
        setSelectedSesi(item);
        setFormData({
            nama_sesi: item?.nama_sesi || "",
            durasi: item?.durasi || "",
            keterangan: item?.keterangan || "",
        });
        setIsEditOpen(true);
    }

    function handleSubmitAdd(e) {
        e.preventDefault();
        router.post(
            `/admin/osce/${osce.id_osce}/sesi`,
            { ...formData },
            {
                onFinish: () => setIsAddOpen(false),
                preserveScroll: true,
            }
        );
    }

    function handleSubmitEdit(e) {
        e.preventDefault();
        if (!selectedSesi) return;
        router.put(
            `/admin/osce/${osce.id_osce}/sesi/${selectedSesi.id_sesi}`,
            { ...formData },
            {
                onFinish: () => setIsEditOpen(false),
                preserveScroll: true,
            }
        );
    }

    function handleDeleteInsideEdit() {
        if (!selectedSesi) return;
        router.delete(
            `/admin/osce/${osce.id_osce}/sesi/${selectedSesi.id_sesi}`,
            {
                onFinish: () => setIsEditOpen(false),
                preserveScroll: true,
            }
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

    const handleEditEnrollment = (id_osce_stase) => {
        router.visit(
            `/admin/osce/${osce.id_osce}/jadwal/${id_osce_stase}/enrollment`
        );
    };

    const handleDeleteSesi = (item) => openDeleteModal(item);

    const rows = sesi.data.map((item, index) => ({
        no: sesi.from + index,
        tanggal_sesi: `${item.tanggal_formatted} (Pukul ${item.jam_mulai_formatted})`,
        jumlah_mahasiswa: `${item.jumlah_mahasiswa} Mahasiswa`,
        action: (
            <div className="flex items-center justify-between w-full gap-4 px-5">
                <OsButton
                    name="primary"
                    onClick={() => handleEditEnrollment(item.id_osce_stase)}
                    className="h-[38px] text-os-small w-full flex justify-around items-center gap-1"
                >
                    <OsIcon
                        name={"student"}
                        className="os-icon-light h-[20px]"
                    />
                    Edit Jumlah Mahasiswa
                </OsButton>

                <div className="flex items-center gap-2">
                    <OsButton
                        name="warning"
                        onClick={() => handleDeleteSesi(item)}
                    >
                        <Trash2 size={17} />
                    </OsButton>
                </div>
            </div>
        ),
    }));

    const calculateEndTime = () => {
        if (!wizardData.jam_mulai || !wizardData.durasi) return "";

        const staseCount = wizardData.stase_ids.length;
        if (staseCount === 0) return ""; // Jika belum pilih stase

        const [hours, minutes] = wizardData.jam_mulai.split(":").map(Number);

        // Rumus: Durasi * Jumlah Stase
        const totalDurationMinutes = parseInt(wizardData.durasi) * staseCount;

        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes + totalDurationMinutes);

        // Format kembali ke HH:mm
        const endHours = String(date.getHours()).padStart(2, "0");
        const endMinutes = String(date.getMinutes()).padStart(2, "0");

        return `${endHours}:${endMinutes}`;
    };

    const jamSelesaiOtomatis = calculateEndTime();

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 md:ml-20">
                <OsHeader variant="goback" backLink="/admin/osce/" />

                <div className="flex-1 overflow-auto ">
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold mb-1">
                            {/* Ganti nama_ujian menjadi nama_osce sesuai database */}
                            {osce.nama_osce || "Detail Jadwal OSCE"}
                        </h2>

                        <div className="text-sm text-gray-500 mb-4 max-w-lg">
                            <p>
                                Halaman ini digunakan untuk mengelola{" "}
                                <strong>Jadwal Sesi</strong> pada ujian{" "}
                                <strong>{osce.nama_osce}</strong>.
                            </p>

                            {/* Menambahkan Tanggal Pelaksanaan jika datanya ada */}
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
                    <div className="border rounded-lg overflow-hidden">
                        <OsTableHeader columns={jadwalColumns} />
                        {rows.length > 0 ? (
                            <OsTableBody data={rows} columns={jadwalColumns} />
                        ) : (
                            <div className="flex items-center justify-center border-t border-gray-200">
                                <p className="w-full text-center text-sm py-4 text-gray-500">
                                    Data sesi tidak ditemukan.
                                </p>
                            </div>
                        )}
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
                                    value={wizardData.stase_ids} // Kirim ID agar checkbox menyala
                                    // --- BAGIAN PERBAIKAN DI SINI ---
                                    onChange={(e) => {
                                        // 1. Ambil array dari event.target.value (Sesuai format OsInput Anda)
                                        const selected = e.target.value;

                                        // 2. Validasi agar selalu menjadi array
                                        const rawValues = Array.isArray(
                                            selected
                                        )
                                            ? selected
                                            : [];

                                        // 3. Logika pemisahan ID dan Object
                                        let newIds = [];
                                        let newObjs = [];

                                        if (
                                            rawValues.length > 0 &&
                                            typeof rawValues[0] === "object"
                                        ) {
                                            // Jika OsInput mengirim Array Object
                                            newObjs = rawValues;
                                            newIds = rawValues.map(
                                                (item) => item.value
                                            );
                                        } else {
                                            // Jika OsInput mengirim Array ID (Default logic OsInput Anda)
                                            newIds = rawValues;
                                            // Cari object aslinya di master_stase agar Step 4 (Penguji) punya Label
                                            newObjs = master_stase.filter(
                                                (ms) =>
                                                    rawValues.includes(ms.value)
                                            );
                                        }

                                        // 4. Simpan ke state
                                        setWizardData({
                                            ...wizardData,
                                            stase_ids: newIds, // Disimpan sebagai [1, 2, 3]
                                            stase_objs: newObjs, // Disimpan sebagai [{value:1, label:'A'}, ...]
                                        });
                                    }}
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                    {wizardData.stase_ids.length} stase dipilih.
                                </p>
                            </div>
                        ),
                    },
                    {
                        title: "Jadwal & Durasi",
                        content: (
                            <div className="flex flex-col gap-4">
                                {/* 1. Input Tanggal */}
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

                                {/* 2. Input Durasi (Berlaku untuk semua stase) */}
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
                                    {/* 3. Input Jam Mulai */}
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

                                    {/* 4. Input Jam Selesai (Otomatis & Readonly) */}
                                    <div className="w-1/2 flex flex-col">
                                        <label className="text-os-small text-gray-600 mb-1">
                                            Jam Selesai (Estimasi)
                                        </label>
                                        <div className="relative w-full">
                                            <input
                                                type="time"
                                                disabled
                                                value={jamSelesaiOtomatis} // Nilai hasil hitungan
                                                className="w-full min-h-[48px] px-3 py-2 rounded-lg
                                                border border-gray-300 bg-gray-200 text-gray-500
                                                cursor-not-allowed outline-none font-medium"
                                            />
                                            {/* Icon Gembok (Optional) */}
                                            <div className="absolute right-3 top-3 text-gray-400">
                                                <CalendarClock size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ),
                    },
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
                                            // Pastikan value dibandingkan dengan tipe yang sama di OsInput
                                            value={wizardData.id_ruang}
                                            onChange={(e) => {
                                                // OsInput single-select mengirim event { target: { name, value } }
                                                // Value yang dikirim adalah ID Ruangan (misal: 101)
                                                const selectedId =
                                                    e.target.value;

                                                setWizardData({
                                                    ...wizardData,
                                                    id_ruang: selectedId, // Simpan ID langsung
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
                                            // --- LOGIKA FILTER AGAR UNIK ---
                                            // 1. Ambil semua ID penguji yang SUDAH dipilih di stase manapun
                                            const allSelectedIds =
                                                Object.values(
                                                    wizardData.penguji_map
                                                );

                                            // 2. Ambil ID penguji yang dipilih di stase INI (jika ada)
                                            const currentSelectedId =
                                                wizardData.penguji_map[
                                                    stase.value
                                                ];

                                            // 3. Filter list opsi:
                                            // Tampilkan jika: (Belum dipilih siapapun) ATAU (Sedang dipilih di stase ini)
                                            const filteredOptions =
                                                availPenguji.filter((p) => {
                                                    const isSelectedElsewhere =
                                                        allSelectedIds.includes(
                                                            p.value
                                                        );
                                                    const isSelectedHere =
                                                        p.value ===
                                                        currentSelectedId;

                                                    // Tampilkan jika tidak dipilih orang lain, ATAU jika dia yang dipilih disini
                                                    return (
                                                        !isSelectedElsewhere ||
                                                        isSelectedHere
                                                    );
                                                });
                                            // -------------------------------

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
                                                        // GUNAKAN OPSI YANG SUDAH DIFILTER
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
                ]}
            />
        </div>
    );
}
