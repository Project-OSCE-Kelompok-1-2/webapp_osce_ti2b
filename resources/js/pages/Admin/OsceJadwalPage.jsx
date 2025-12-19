import React, { useState, useEffect, useMemo } from "react";
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
    Info,
    X,
    Users,
    Clock,
    AlertCircle,
    FileText,
    Table2, // Import icon untuk error
} from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import Modals from "../../components/Modals.jsx";
import OsIcon from "../../components/icons.jsx";
import OsStepModal from "../../components/StepModal.jsx";

import OsInput from "../../components/input.jsx";
import OsButton from "../../components/button.jsx";
import OsHeader from "../../components/Header.jsx";

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
        width: "w-48 shrink-0",
        classes: "justify-start items-center px-6",
    },
    {
        key: "jam_mulai",
        content: "Mulai",
        width: "w-28 shrink-0",
        classes: "justify-center items-center px-2",
    },
    {
        key: "jam_selesai",
        content: "Selesai",
        width: "w-28 shrink-0",
        classes: "justify-center items-center px-2",
    },
    {
        key: "ruangan",
        content: "Ruangan",
        width: "flex-1 min-w-[250px] shrink-0",
        classes: "justify-start items-center px-6",
    },
    {
        key: "jumlah_mahasiswa",
        content: "Kuota",
        width: "w-44 shrink-0",
        classes: "justify-center items-center px-4",
    },
    {
        key: "action",
        content: "Action",
        width: "w-32 shrink-0",
        classes: "justify-center items-center",
    },
];

export default function SesiOscePage({
    sesi,
    osce,
    filters,
    master_stase = [],
}) {
    const { errors, flash } = usePage().props;

    // State UI Standar
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSesi, setSelectedSesi] = useState(null);

    // State untuk Detail Modal
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [detailData, setDetailData] = useState({
        stase_data: [],
        mahasiswa_data: [],
    });
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    // --- STATE KHUSUS WIZARD (STEP MODAL) ---
    const [isStepOpen, setIsStepOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // [BARU] State untuk menyimpan pesan error validasi wizard
    const [validationError, setValidationError] = useState(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    // Menyimpan data input wizard
    const [wizardData, setWizardData] = useState({
        stase_objs: [],
        stase_ids: [],
        tanggal: "",
        jam_mulai: "",
        durasi: "7",
        id_ruang: "",
        penguji_map: {},
        filter_angkatan: "",
        mahasiswa_ids: [],
    });

    // Menyimpan data dinamis (hasil filter API)
    const [isLoadingCheck, setIsLoadingCheck] = useState(false);
    const [availRooms, setAvailRooms] = useState([]);
    const [availPenguji, setAvailPenguji] = useState([]);

    // State untuk Step 5 (Mahasiswa)
    const [listAngkatan, setListAngkatan] = useState([]);
    const [availableMahasiswa, setAvailableMahasiswa] = useState([]);
    const [isLoadingMhs, setIsLoadingMhs] = useState(false);

    // Menampilkan Alert jika ada Flash Error dari Backend
    useEffect(() => {
        if (flash.error) {
            alert(flash.error);
        }
    }, [flash]);

    // Reset validation error saat modal ditutup atau step direset
    useEffect(() => {
        if (!isStepOpen) {
            setValidationError(null);
        }
    }, [isStepOpen]);

    // --- LOGIC FILTER DINAMIS ---
    useEffect(() => {
        if (currentStep === 2 && wizardData.tanggal && wizardData.jam_mulai) {
            checkAvailability();
        }
    }, [currentStep]);

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

    const fetchMahasiswa = async (angkatan = "") => {
        setIsLoadingMhs(true);
        try {
            const res = await axios.post("/admin/osce/get-mahasiswa", {
                angkatan: angkatan,
                id_osce: osce.id_osce,
            });

            setAvailableMahasiswa(res.data.mahasiswa);

            if (res.data.list_angkatan && listAngkatan.length === 0) {
                const optionsRaw = res.data.list_angkatan.map((th) => {
                    const tahunTampil = th.toString().includes("/")
                        ? th.toString().split("/")[1] // ambil tahun kedua
                        : th;

                    return {
                    value: th, // ✅ TETAP ASLI (2022/2023)
                    label: `Tahun Angkatan ${tahunTampil}`, // ✅ TAMPILAN SAJA
                    };
                });

setListAngkatan(optionsRaw);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingMhs(false);
        }
    };

    const fetchSessionDetail = async (item) => {
        setIsLoadingDetail(true);
        setSelectedSesi(item);
        try {
            const res = await axios.post(
                `/admin/osce/${osce.id_osce}/get-session-detail`,
                {
                    tanggal: item.tanggal,
                    jam_mulai: item.jam_mulai,
                }
            );
            setDetailData(res.data);
            setIsDetailModalOpen(true);
        } catch (err) {
            console.error(err);
            alert("Gagal mengambil detail sesi.");
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const handleWizardSubmit = () => {
        setValidationError(null);

        // --- VALIDASI STEP 5 (Index 4): MAHASISWA ---
        // Biasanya jumlah mahasiswa harus sama dengan jumlah stase untuk 1 putaran penuh
        if (wizardData.mahasiswa_ids.length !== wizardData.stase_ids.length) {
            setValidationError(
                `Jumlah mahasiswa (${wizardData.mahasiswa_ids.length}) harus sama dengan jumlah stase (${wizardData.stase_ids.length}) agar putaran ujian pas.`
            );
            return;
        }

        // Jika valid, kirim data
        router.post(`/admin/osce/${osce.id_osce}/jadwal`, wizardData, {
            onSuccess: (page) => {
                if (page.props.flash?.error) return;
                setIsStepOpen(false);
                setCurrentStep(0);
                // Reset form
                setWizardData({
                    stase_objs: [],
                    stase_ids: [],
                    tanggal: "",
                    jam_mulai: "",
                    durasi: "7",
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

    const rows = sesi.data.map((item, index) => ({
        no: sesi.from + index,
        tanggal: (
            <span className="font-medium text-gray-700">
                {item.tanggal_formatted}
            </span>
        ),
        jam_mulai: (
            <span className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                {item.jam_mulai_formatted}
            </span>
        ),
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
            <div className="flex items-center justify-center w-full px-2 gap-2">
                <OsButton
                    name="secondary"
                    onClick={() => fetchSessionDetail(item)}
                    title="Lihat Detail"
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                >
                    <Info size={18} />
                </OsButton>
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
        return `${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
        ).padStart(2, "0")}`;
    };

    const jamSelesaiOtomatis = calculateEndTime();

    // ===============================================
    // KONVERSI TANGGAL & VALIDASI CLIENT-SIDE
    // ===============================================

    const convertDateForInput = (dateString) => {
        if (!dateString) return undefined;
        const parts = dateString.split("-");
        if (parts.length !== 3) return undefined;
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };

    const minDateISO = useMemo(
        () => convertDateForInput(osce.tanggal_mulai),
        [osce.tanggal_mulai]
    );
    const maxDateISO = useMemo(
        () => convertDateForInput(osce.tanggal_selesai),
        [osce.tanggal_selesai]
    );

    // [MODIFIKASI] Handler Perpindahan Step dengan Validation Error State
    const handleStepChange = (nextStepIndex) => {
        // Reset error setiap kali navigasi
        setValidationError(null);

        const isMovingForward = nextStepIndex > currentStep;

        if (isMovingForward) {
            // --- VALIDASI STEP 1 (Index 0): STASE ---
            if (currentStep === 0) {
                if (wizardData.stase_ids.length === 0) {
                    setValidationError(
                        "Mohon pilih minimal satu stase untuk melanjutkan."
                    );
                    return;
                }
            }

            // --- VALIDASI STEP 2 (Index 1): JADWAL ---
            if (currentStep === 1) {
                if (
                    !wizardData.tanggal ||
                    !wizardData.jam_mulai ||
                    !wizardData.durasi
                ) {
                    setValidationError(
                        "Mohon lengkapi Tanggal, Jam Mulai, dan Durasi."
                    );
                    return;
                }
                // Validasi Rentang Tanggal
                if (
                    wizardData.tanggal < minDateISO ||
                    wizardData.tanggal > maxDateISO
                ) {
                    setValidationError(
                        `Tanggal diluar jadwal ujian.\nRentang: ${minDateISO} s.d. ${maxDateISO}`
                    );
                    return;
                }
            }

            // --- VALIDASI STEP 3 (Index 2): SIRKUIT / RUANG ---
            if (currentStep === 2) {
                if (!wizardData.id_ruang) {
                    setValidationError("Mohon pilih Ruangan/Sirkuit ujian.");
                    return;
                }
            }

            // --- VALIDASI STEP 4 (Index 3): PENGUJI ---
            if (currentStep === 3) {
                const selectedCount = Object.keys(
                    wizardData.penguji_map
                ).length;
                const requiredCount = wizardData.stase_ids.length;

                // Pastikan jumlah penguji sama dengan jumlah stase
                if (selectedCount < requiredCount) {
                    setValidationError(
                        `Mohon lengkapi penguji untuk semua stase (${selectedCount}/${requiredCount} terpilih).`
                    );
                    return;
                }

                // Opsional: Cek apakah ada value kosong di map
                const hasEmptySelection = Object.values(
                    wizardData.penguji_map
                ).some((val) => !val);
                if (hasEmptySelection) {
                    setValidationError(
                        "Pastikan semua stase sudah memiliki penguji."
                    );
                    return;
                }
            }
        }

        // Jika lolos validasi, pindah step
        setCurrentStep(nextStepIndex);
    };

    const ErrorBanner = ({ message }) => {
        if (!message) return null;
        return (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div className="whitespace-pre-line leading-relaxed">
                    {message}
                </div>
            </div>
        );
    };

    return (
        <div className="relative bg-blue-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader variant="goback" backLink="/admin/osce/" />

                    <div className="flex-1 overflow-auto p-1">
                        {/* Flash Message di Layout Utama */}
                        {flash.error && (
                            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                                <p className="font-bold">Error</p>
                                <p>{flash.error}</p>
                            </div>
                        )}
                        {flash.success && (
                            <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                                <p className="font-bold">Sukses</p>
                                <p>{flash.success}</p>
                            </div>
                        )}

                        <section className="mb-6">
                            {/* <h2 className="text-lg font-semibold mb-1">
                                {osce.nama_osce || "Detail Jadwal OSCE"}
                            </h2> */}
                            <div className="flex gap-1 items-center justify-start my-2">
                                <FileText size={18} />
                                <h2 className="font-semibold text-lg">
                                    {osce.nama_osce || "Detail Jadwal OSCE"}
                                </h2>
                            </div>
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
                                    setValidationError(null); // Reset error saat buka modal
                                }}
                                className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                            >
                                <OsIcon
                                    name="add"
                                    className="h-[18px] os-icon-light mr-os-8"
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

                        {/* <h2 className="font-semibold text-lg mb-2 mt-os-8">
                            Table Sesi
                        </h2> */}
                        <div className="flex gap-1 items-center justify-start mb-2">
                            <Table2 size={18} />
                            <h2 className="font-semibold text-lg">
                                Table OSCE
                            </h2>
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                Total: {sesi.total} data
                            </span>
                        </div>

                        <div className="w-full overflow-x-auto bg-white rounded-xl border border-os-primary pb-4 p-4">
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
                </div>
                <div className="">
                    <OsCopyright />
                </div>
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

            {/* DETAIL MODAL */}
            {/* DETAIL MODAL */}
            {isDetailModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsDetailModalOpen(false)}
                    ></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all scale-100">
                        <div className="flex justify-between items-start px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md z-10">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <ClipboardList
                                        className="text-blue-200"
                                        size={24}
                                    />
                                    Detail Sesi OSCE
                                </h3>
                                {selectedSesi && (
                                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm font-medium text-blue-100">
                                        <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                                            <CalendarClock size={16} />
                                            <span>
                                                {selectedSesi.tanggal_formatted}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                                            <Clock size={16} />
                                            <span>
                                                {
                                                    selectedSesi.jam_mulai_formatted
                                                }{" "}
                                                -{" "}
                                                {
                                                    selectedSesi.jam_selesai_formatted
                                                }{" "}
                                                WIB
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white focus:outline-none"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 lg:p-8">
                            {isLoadingDetail ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
                                    <p>Mengambil data sesi...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
                                    <div className="lg:col-span-3 flex flex-col gap-4 h-full">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                                                <ClipboardList size={20} />
                                            </div>
                                            <h4 className="font-bold text-gray-800 text-lg">
                                                Konfigurasi Stase
                                            </h4>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-gray-50 border-b border-gray-100">
                                                        <tr>
                                                            <th className="px-5 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">
                                                                Nama Stase
                                                            </th>
                                                            <th className="px-5 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs w-1/4">
                                                                Lokasi
                                                            </th>
                                                            <th className="px-5 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs w-1/3">
                                                                Penguji
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {detailData.stase_data
                                                            .length > 0 ? (
                                                            detailData.stase_data.map(
                                                                (ds, idx) => (
                                                                    <tr
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="hover:bg-blue-50/50 transition-colors group"
                                                                    >
                                                                        <td className="px-5 py-4 align-top">
                                                                            <div className="font-semibold text-gray-800">
                                                                                {
                                                                                    ds.stase
                                                                                }
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-5 py-4 align-top">
                                                                            <div className="flex items-start gap-2 text-gray-600">
                                                                                <span>
                                                                                    {
                                                                                        ds.ruang
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-5 py-4 align-top">
                                                                            <div className="flex items-start gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                                                                <span className="font-medium text-xs leading-snug">
                                                                                    {
                                                                                        ds.penguji
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )
                                                        ) : (
                                                            <tr>
                                                                <td
                                                                    colSpan="3"
                                                                    className="px-6 py-8 text-center text-gray-400 bg-gray-50 italic"
                                                                >
                                                                    Tidak ada
                                                                    konfigurasi
                                                                    stase.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-2 flex flex-col gap-4 h-full">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-green-100 text-green-600 rounded-lg">
                                                    <Users size={20} />
                                                </div>
                                                <h4 className="font-bold text-gray-800 text-lg">
                                                    Mahasiswa
                                                </h4>
                                            </div>
                                            <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200 shadow-sm">
                                                {
                                                    detailData.mahasiswa_data
                                                        .length
                                                }{" "}
                                                Orang
                                            </span>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
                                            <div className="overflow-y-auto flex-1 p-2 max-h-[500px]">
                                                {detailData.mahasiswa_data
                                                    .length > 0 ? (
                                                    <ul className="flex flex-col gap-2">
                                                        {detailData.mahasiswa_data.map(
                                                            (mhs, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100"
                                                                >
                                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold shadow-sm shrink-0 border border-white">
                                                                        {mhs.nama
                                                                            .split(
                                                                                " "
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    n
                                                                                ) =>
                                                                                    n[0]
                                                                            )
                                                                            .slice(
                                                                                0,
                                                                                2
                                                                            )
                                                                            .join(
                                                                                ""
                                                                            )
                                                                            .toUpperCase()}
                                                                    </div>
                                                                    <div className="flex flex-col min-w-0">
                                                                        <span className="text-sm font-semibold text-gray-800 truncate">
                                                                            {
                                                                                mhs.nama
                                                                            }
                                                                        </span>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                                                                {
                                                                                    mhs.nim
                                                                                }
                                                                            </span>
                                                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                                            <span className="text-[10px] text-green-600 font-medium uppercase tracking-wide">
                                                                                Terdaftar
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                                        <div className="bg-gray-50 p-4 rounded-full mb-3">
                                                            <Users
                                                                size={32}
                                                                className="text-gray-300"
                                                            />
                                                        </div>
                                                        <p className="text-sm">
                                                            Belum ada mahasiswa
                                                            terdaftar.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 z-10"></div>
                    </div>
                </div>
            )}

            <OsStepModal
                show={isStepOpen}
                onClose={() => setIsStepOpen(false)}
                currentStep={currentStep}
                setCurrentStep={handleStepChange}
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
                                        setValidationError(null); // Clear error on change
                                        const selected = e.target.value;
                                        const rawValues = Array.isArray(
                                            selected
                                        )
                                            ? selected
                                            : [];
                                        let newIds = [],
                                            newObjs = [];

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
                                {/* Pesan Error Ditambahkan Disini */}
                                <ErrorBanner message={validationError} />
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
                                    min={minDateISO}
                                    max={maxDateISO}
                                    onChange={(e) => {
                                        setValidationError(null);
                                        setWizardData({
                                            ...wizardData,
                                            tanggal: e.target.value,
                                        });
                                    }}
                                />
                                <p className="text-xs text-blue-600 -mt-3">
                                    Rentang jadwal: <b>{osce.tanggal_mulai}</b>{" "}
                                    s.d. <b>{osce.tanggal_selesai}</b>
                                </p>
                                <div>
                                    <OsInput
                                        type="number"
                                        label={`Durasi per Stase (Menit)`}
                                        placeholder="Contoh: 15"
                                        value={wizardData.durasi}
                                        onChange={(e) => {
                                            setValidationError(null);
                                            setWizardData({
                                                ...wizardData,
                                                durasi: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="w-full sm:w-1/2">
                                        <OsInput
                                            type="clock"
                                            label="Jam Mulai"
                                            value={wizardData.jam_mulai}
                                            onChange={(e) => {
                                                setValidationError(null);
                                                setWizardData({
                                                    ...wizardData,
                                                    jam_mulai: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="w-full sm:w-1/2 flex flex-col">
                                        <label className="mb-1 text-sm text-gray-700">
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
                                {/* Pesan Error Ditambahkan Disini */}
                                <ErrorBanner message={validationError} />
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
                                                setValidationError(null);
                                                setWizardData({
                                                    ...wizardData,
                                                    id_ruang: e.target.value,
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
                                {/* Pesan Error Ditambahkan Disini */}
                                <ErrorBanner message={validationError} />
                            </div>
                        ),
                    },
                    // STEP 4: Pilih Penguji
                    {
                        title: "Pilih Penguji",
                        content: (
                            <div className="flex flex-col h-full">
                                {isLoadingCheck ? (
                                    <div className="py-4 text-center">
                                        Loading...
                                    </div>
                                ) : (
                                    <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
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
                                                    <label className="block text-sm mb-1">
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
                                                            setValidationError(
                                                                null
                                                            );
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
                                {/* Pesan Error Ditambahkan Disini (fixed at bottom of modal content usually) */}
                                <div className="mt-auto">
                                    <ErrorBanner message={validationError} />
                                </div>
                            </div>
                        ),
                    },
                    // STEP 5: Enrollment Mahasiswa
                    {
                        title: "Enrollment Mahasiswa",
                        content: (
                            // Ubah min-h-[500px] menjadi h-full atau sesuaikan,
                            // tapi kuncinya ada di child element (list container)
                            <div className="flex flex-col gap-4 h-full min-h-[500px]">
                                {/* Dropdown Filter */}
                                <div className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200 shrink-0">
                                    <OsInput
                                        type="single-select"
                                        label="Filter Tahun Angkatan"
                                        placeholder="Pilih Angkatan"
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

                                {/* List Mahasiswa */}
                                {/* PERBAIKAN: Tambahkan 'min-h-[300px]' disini agar tidak tergencet error */}
                                <div className="border rounded-lg flex-1 flex flex-col overflow-hidden bg-white shadow-sm min-h-[300px]">
                                    <div className="flex justify-between items-center p-3 border-b bg-gray-50 shrink-0">
                                        <label className="text-sm font-bold text-gray-700">
                                            Daftar Mahasiswa
                                        </label>
                                        <span
                                            className={`text-xs font-bold px-3 py-1 rounded-full border ${
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
                                            <div className="text-center p-4 text-gray-400">
                                                Loading...
                                            </div>
                                        ) : availableMahasiswa.length === 0 ? (
                                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                                Tidak ada mahasiswa
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {availableMahasiswa.map(
                                                    (mhs) => {
                                                        const isSelected =
                                                            wizardData.mahasiswa_ids.includes(
                                                                mhs.value
                                                            );
                                                        const isAlreadyEnrolled =
                                                            mhs.already_enrolled ===
                                                            true;
                                                        const isMaxReached =
                                                            wizardData
                                                                .mahasiswa_ids
                                                                .length >=
                                                            wizardData.stase_ids
                                                                .length;
                                                        const isDisabled =
                                                            (isMaxReached &&
                                                                !isSelected) ||
                                                            isAlreadyEnrolled;

                                                        return (
                                                            <label
                                                                key={mhs.value}
                                                                className={`group flex items-center p-3 rounded-lg border transition-all ${
                                                                    isDisabled
                                                                        ? "bg-gray-100 opacity-70 cursor-not-allowed"
                                                                        : "cursor-pointer hover:border-blue-300"
                                                                } ${
                                                                    isSelected
                                                                        ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                                                                        : "bg-white border-gray-200"
                                                                }`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                                    checked={
                                                                        isSelected
                                                                    }
                                                                    disabled={
                                                                        isDisabled
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setValidationError(
                                                                            null
                                                                        );
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
                                                                            )
                                                                                newIds.push(
                                                                                    mhs.value
                                                                                );
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
                                                                <div className="flex flex-col">
                                                                    <span
                                                                        className={`text-sm font-medium ${
                                                                            isSelected
                                                                                ? "text-blue-900"
                                                                                : "text-gray-700"
                                                                        } ${
                                                                            isAlreadyEnrolled
                                                                                ? "line-through text-gray-500"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        {
                                                                            mhs.label
                                                                        }
                                                                    </span>
                                                                    {isAlreadyEnrolled && (
                                                                        <span className="text-[10px] text-red-500 italic">
                                                                            Sudah
                                                                            terjadwal
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </label>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Error Banner (Akan muncul di bawah tanpa menghancurkan layout list) */}
                                <div className="shrink-0">
                                    <ErrorBanner message={validationError} />
                                </div>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
}
