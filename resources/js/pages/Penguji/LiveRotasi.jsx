import React, { useState, useEffect } from "react"; 
import { Head, router, usePage } from "@inertiajs/react";
import OsCopyright from "../../components/copyright";
import Sidebar from "../../components/Sidebar";
import OsTableHeader from "../../components/tableheader";
import OsHeader from "../../components/Header";
import {
    ArrowLeft,
    Download,
    Search,
    ExternalLink,
    FileText,
    User,
    Clock,
    UserCheck,
    Table2,
    Info,
    CircleArrowRight,
    CircleCheckBig,
} from "lucide-react";

export default function LiveRotasi() {
    const {
        osce_detail,
        mahasiswa_selanjutnya,
        sisa_waktu_rotasi_detik = 60, 
    } = usePage().props;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [timeLeft, setTimeLeft] = useState(sisa_waktu_rotasi_detik);

    const safeOsce = osce_detail || { nama_osce: "-", nama_stase: "-" };
    const isFinished = !mahasiswa_selanjutnya;

    useEffect(() => {
        setTimeLeft(sisa_waktu_rotasi_detik);
    }, [sisa_waktu_rotasi_detik, mahasiswa_selanjutnya]);

    useEffect(() => {
        if (timeLeft <= 0 || isFinished) return;

        const intervalId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft, isFinished]);

    const handleBack = () => {
        router.get("/penguji/dashboard");
    };

    const handleSubmit = () => {
        if (isFinished) {
            router.get(
                `/penguji/osce/${safeOsce.id_osce}/stase/${safeOsce.id_osce_stase}/submitrubrik`
            );
        } else {
            router.get(
                `/penguji/penilaian/${mahasiswa_selanjutnya.id_enrollment_osce}`
            );
        }
    };

    const formatWaktu = (detik) => {
        if (detik < 0) detik = 0; 
        const m = Math.floor(detik / 60)
            .toString()
            .padStart(2, "0");
        const s = (detik % 60).toString().padStart(2, "0");
        return `00:${m}:${s}`;
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="relative bg-orange-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            {/* <Head title="Rotasi Mahasiswa" /> */}

            <div className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <Sidebar
                    isOpen={sidebarOpen}
                    setIsOpen={handleSidebarToggle}
                    type={"penguji"}
                />
                <div className="flex flex-col gap-os-8">
                    <div className="overflow-x-auto">
                        <OsHeader
                            onMenuClick={handleSidebarToggle}
                            variant="goback"
                            role="penguji"
                            backLink="/penguji/osce"
                        />
                    </div>

                    {/* MAIN */}
                    <main className="w-full   min-h-[88vh] flex flex-col justify-between">
                        {/* <div className="mx-auto max-w-4xl px-4 py-8 bg-yellow-300"></div> */}
                        <div className="flex justify-center items-center ">
                            {/* Card Rotasi */}
                            <div className="md:w-full w-[90%] md:mt-32 mt-28  max-w-md !border-os-primary-pj bg-white rounded-2xl shadow-[0_4px_8px_rgba(0,0,0,0.15)] border  py-6 px-6 text-center">
                                {/* Icon Check / Finish */}
                                <div className="flex justify-center mb-4">
                                    <CircleCheckBig
                                        size={90}
                                        className="text-orange-400"
                                    />
                                </div>

                                {/* Konten Dinamis */}
                                {isFinished ? (
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            Seluruh Mahasiswa Telah Dinilai!
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-6">
                                            Anda dapat menyelesaikan sesi ini
                                            sekarang.
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className=" text-lg text-black mb-3">
                                            Rotasi mahasiswa selanjutnya
                                        </p>
                                        <div className="border border-os-primary-pj rounded-xl px-4 py-4 flex items-center gap-4 mb-4 text-left">
                                            <div className="w-[70px] h-[70px] rounded-full bg-[#402525]" />
                                            <div className="text-xs sm:text-sm leading-relaxed">
                                                <p className="font-semibold text-os-primary-pj text-sm">
                                                    Nama :{" "}
                                                    <span className="font-normal">
                                                        {
                                                            mahasiswa_selanjutnya.nama
                                                        }
                                                    </span>
                                                </p>
                                                <p className="font-semibold mt-1">
                                                    NIM :{" "}
                                                    <span className="font-normal text-sm">
                                                        {
                                                            mahasiswa_selanjutnya.nim
                                                        }
                                                    </span>
                                                </p>
                                                <p className="font-semibold mt-1">
                                                    Jurusan :{" "}
                                                    <span className="font-normal text-sm">
                                                        {
                                                            mahasiswa_selanjutnya.prodi
                                                        }
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tombol Sisa Waktu + Action */}
                                <div className="mt-4 flex justify-between gap-3">
                                    {!isFinished && (
                                        <div className="flex-1 md:flex-row flex-col flex items-center justify-between rounded-xl border border-os-primary-pj bg-os-tertiary-pj px-4 md:py-3 py-1">
                                            <span className="text-sm font-medium text-orange-500">
                                                Istirahat
                                            </span>
                                            <span className="text-sm font-bold text-orange-500">
                                                {formatWaktu(timeLeft)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="w-full flex justify-center items-center">
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className={`flex justify-center gap-3 items-center rounded-xl border border-black px-4 md:py-3 py-2 text-sm font-bold text-white text-center ${
                                                isFinished
                                                    ? "bg-green-600 hover:bg-green-700"
                                                    : "bg-orange-400 hover:bg-orange-500"
                                            }`}
                                        >
                                            {isFinished
                                                ? "Sesi Selesai"
                                                : "Lanjut Nilai"}
                                            <CircleArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <OsCopyright variant="penguji" />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
