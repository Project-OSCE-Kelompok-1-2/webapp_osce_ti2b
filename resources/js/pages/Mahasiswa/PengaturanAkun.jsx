import React, { useState, useEffect } from "react";
// [UBAH] Import hook Inertia
import { useForm, usePage, Link, router } from "@inertiajs/react";
import { Eye, EyeOff, Home } from "lucide-react";

// Import Komponen Custom Sesuai Desain
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsIcon from "../../components/icons.jsx";
import OsButton from "../../components/button.jsx";
import SidebarUniversal from "../../components/SidebarUniversal.jsx";

// Komponen Input Custom (Sesuai Desain)
const CustomInput = ({
    label,
    type = "text",
    value,
    onChange,
    disabled,
    placeholder,
    icon,
    iconRight,
    error,
}) => (
    <div className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
        <label className="relative self-stretch mt-[-1.00px] font-sans font-normal text-black text-xs tracking-[0] leading-[normal]">
            {label}
        </label>
        <div
            className={`flex h-[54px] items-center gap-[13px] p-3 relative self-stretch w-full ${
                // [UBAH WARNA] Disabled jadi abu-abu gelap (#BFBFBF) sesuai gambar
                disabled ? "bg-[#BFBFBF]" : "bg-white"
            } rounded-xl border border-solid border-black`}
        >
            {icon && (
                <div className="!relative !w-5 !h-5 !aspect-[1] flex items-center justify-center opacity-45">
                    {icon}
                </div>
            )}

            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className="relative flex-1 font-sans font-normal text-black text-[15.4px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-full placeholder:text-gray-400"
            />

            {iconRight && (
                <div className="!relative !w-5 !h-5 !aspect-[1] flex items-center justify-center cursor-pointer">
                    {iconRight}
                </div>
            )}
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
);

export default function MahasiswaAccountSettings() {
    // 1. AMBIL DATA DARI PROPS (Backend Asdif)
    const { user, errors } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [showOldPassword, setShowOldPassword] = useState(false);
    // State untuk preview gambar
    const [profileImage, setProfileImage] = useState(
        "https://via.placeholder.com/177?text=U"
    );

    // 2. INISIALISASI FORM
    const { data, setData, post, processing, reset } = useForm({
        // Data Tampilan (Read Only)
        username: user.username || "",
        nama: user.mahasiswa?.nama || "",
        nim: user.mahasiswa?.nim || "",

        // Data Inputan
        foto: null,
        delete_foto: false,
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    // 3. EFFECT: SET PREVIEW GAMBAR
    useEffect(() => {
        if (user.path_gambar) {
            setProfileImage(`/${user.path_gambar}`);
        } else {
            setProfileImage("https://via.placeholder.com/177?text=U");
        }
    }, [user.path_gambar]);

    // 4. HANDLERS
    const handleProfileImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setData((prev) => ({ ...prev, foto: file, delete_foto: false }));
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleDeleteProfileImage = () => {
        setData((prev) => ({ ...prev, foto: null, delete_foto: true }));
        setProfileImage("https://via.placeholder.com/177?text=U");
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        post("/mahasiswa/pengaturan-akun", {
            preserveScroll: true,
            onSuccess: () => {
                reset(
                    "old_password",
                    "new_password",
                    "new_password_confirmation"
                );
            },
        });
    };

    const handleLogout = () => {
        router.post("/logout");
    };

    return (
        <div className="relative bg-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            {/* SIDEBAR */}
            {/* <SidebarPenguji /> */}
            <SidebarUniversal
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                type={"mahasiswa"}
            />

            {/* MAIN CONTENT WRAPPER */}
            <div className="bg-white w-full min-h-screen flex justify-center p-6 font-sans md:ml-20 transition-all duration-300">
                <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14">
                    {/* HEADER */}
                    <header className="relative w-full flex flex-col items-start gap-5 bg-white p-4 rounded-xl shadow-sm border border-gray-900">
                        <div className="flex items-center justify-between relative self-stretch w-full">
                            {/* Tombol Back */}
                            <Link
                                href="/mahasiswa/jadwal"
                                // [UBAH WARNA] Back button tetap biru standar atau disesuaikan navy jika mau
                                className="flex w-[54px] h-[54px] items-center justify-center gap-[13px] p-3 relative bg-blue-600 text-white rounded-xl border border-solid border-black aspect-[1] hover:bg-blue-700 transition"
                            >
                                <Home className="w-[30px] h-[26px] text-white" />
                            </Link>

                            {/* Breadcrumb */}
                            <nav className="relative flex-1 h-[54px] ml-4">
                                <div className="h-full items-center bg-white flex w-full rounded-xl overflow-hidden border border-solid border-black px-5">
                                    <p className="font-sans font-normal text-xl whitespace-nowrap">
                                        <span className="text-gray-400">
                                            Pengaturan
                                        </span>
                                        <span className="text-black">
                                            {" "}
                                            / Akun
                                        </span>
                                    </p>
                                </div>
                            </nav>
                        </div>
                        <hr className="relative w-full border-black border-t" />
                    </header>

                    {/* KONTEN UTAMA (DUA KOLOM) */}
                    <main className="flex flex-col gap-5 w-full">
                        <div className="flex flex-col lg:flex-row items-start gap-5 relative w-full">
                            {/* --- KOLOM KIRI: FOTO PROFIL --- */}
                            {/* [UBAH WARNA] Background Card jadi bg-blue-50 */}
                            <aside className="flex flex-col w-full lg:w-[403px] items-center gap-[17px] p-5 bg-blue-50 rounded-xl border border-black shadow-sm">
                                <div className="relative self-stretch w-full h-[29px]">
                                    <h2 className="absolute top-[calc(50%_-_14px)] left-0 font-sans font-normal text-black text-xl">
                                        Gambar Profil
                                    </h2>
                                    <hr className="absolute top-7 left-0 w-full border-black border-t" />
                                </div>

                                {/* Lingkaran Foto */}
                                <div
                                    className="relative w-[177px] h-[177px] bg-white rounded-full border border-solid border-black bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${profileImage})`,
                                    }}
                                />

                                {/* Alert Box */}
                                {/* [UBAH WARNA] Background Box jadi #B0B0B0 (Abu-abu), Text tetap merah sesuai style */}
                                <div className="flex-col items-start gap-[5px] p-3.5 relative self-stretch flex w-full bg-[#B0B0B0] rounded-xl overflow-hidden border border-solid border-[#B0B0B0]">
                                    <div className="inline-flex items-center gap-[5px]">
                                        <OsIcon
                                            name="Warning"
                                            className="w-[15px] h-3.5 text-red-500"
                                        />
                                        <div className="font-sans font-medium text-red-800 text-[15px]">
                                            Perhatian!
                                        </div>
                                    </div>
                                    {/* Text warna hitam/gelap agar terbaca di background abu */}
                                    <p className="font-sans font-normal text-black text-[13px]">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit. Nunc vulputate libero
                                        et velit interdum.
                                    </p>
                                </div>
                                {errors.foto && (
                                    <p className="text-sm text-red-500">
                                        {errors.foto}
                                    </p>
                                )}

                                {/* Tombol Upload & Delete */}
                                <div className="flex items-center gap-[15px] relative self-stretch w-full">
                                    {/* [UBAH WARNA] Tombol Upload jadi Navy (#0B0931) */}
                                    <label className="flex items-center justify-center gap-2.5 px-3 py-3 relative flex-1 bg-[#0B0931] text-blue-100 rounded-xl cursor-pointer hover:bg-slate-900 transition">
                                        <input
                                            type="file"
                                            accept=".png,.jpg,.jpeg,.gif"
                                            onChange={handleProfileImageUpload}
                                            className="sr-only"
                                        />
                                        <OsIcon
                                            name="Upload"
                                            className="w-[18px] h-[17px] fill-blue-100"
                                        />
                                        <span className="font-sans font-normal text-[15px]">
                                            Upload gambar profil
                                        </span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={handleDeleteProfileImage}
                                        className="flex w-12 h-12 items-center justify-center bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                                    >
                                        <OsIcon
                                            name="Trash"
                                            className="w-[17px] h-5 fill-white"
                                        />
                                    </button>
                                </div>
                            </aside>

                            {/* --- KOLOM KANAN: FORM DATA --- */}
                            {/* [UBAH WARNA] Background Card jadi bg-blue-50 */}
                            <section className="flex flex-col items-start gap-[15px] p-5 relative flex-1 grow bg-blue-50 rounded-xl border border-black shadow-sm">
                                <div className="relative self-stretch w-full h-[29px]">
                                    <h2 className="absolute top-[calc(50%_-_14px)] left-0 font-sans font-normal text-black text-xl">
                                        Akun
                                    </h2>
                                    <hr className="absolute top-7 left-0 w-full border-black border-t" />
                                </div>

                                <form
                                    onSubmit={handleSaveChanges}
                                    className="flex flex-col items-start gap-[15px] w-full"
                                >
                                    {/* USERNAME (Read Only) */}
                                    <CustomInput
                                        label="Nama pengguna"
                                        value={data.username}
                                        disabled
                                        icon={
                                            <OsIcon
                                                name="User"
                                                className="w-4 h-4"
                                            />
                                        }
                                    />

                                    {/* NAMA LENGKAP (Read Only) */}
                                    <CustomInput
                                        label="Nama Lengkap"
                                        value={data.nama}
                                        disabled
                                    />

                                    {/* NIM (Read Only) */}
                                    <CustomInput
                                        label="NIM"
                                        value={data.nim}
                                        disabled
                                        icon={
                                            <OsIcon
                                                name="Book"
                                                className="w-5 h-5"
                                            />
                                        }
                                    />

                                    <hr className="w-full border-gray-300 my-2" />

                                    {/* PASSWORD INPUTS */}
                                    <CustomInput
                                        type={
                                            showOldPassword
                                                ? "text"
                                                : "password"
                                        }
                                        label="Password lama"
                                        placeholder="Masukkan password lama..."
                                        value={data.old_password}
                                        onChange={(e) =>
                                            setData(
                                                "old_password",
                                                e.target.value
                                            )
                                        }
                                        error={errors.old_password}
                                        icon={
                                            <OsIcon
                                                name="Lock"
                                                className="w-5 h-5"
                                            />
                                        }
                                        iconRight={
                                            <div
                                                onClick={() =>
                                                    setShowOldPassword(
                                                        !showOldPassword
                                                    )
                                                }
                                            >
                                                {showOldPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </div>
                                        }
                                    />

                                    <div className="flex flex-col lg:flex-row gap-5 w-full">
                                        <div className="flex-1">
                                            <CustomInput
                                                type="password"
                                                label="Password baru"
                                                placeholder="Masukkan password baru..."
                                                value={data.new_password}
                                                onChange={(e) =>
                                                    setData(
                                                        "new_password",
                                                        e.target.value
                                                    )
                                                }
                                                error={errors.new_password}
                                                icon={
                                                    <OsIcon
                                                        name="Lock"
                                                        className="w-5 h-5"
                                                    />
                                                }
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <CustomInput
                                                type="password"
                                                label="Konfirmasi password baru"
                                                placeholder="Konfirmasi password..."
                                                value={
                                                    data.new_password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "new_password_confirmation",
                                                        e.target.value
                                                    )
                                                }
                                                icon={
                                                    <OsIcon
                                                        name="Lock"
                                                        className="w-5 h-5"
                                                    />
                                                }
                                                iconRight={
                                                    <div
                                                        onClick={() =>
                                                            setShowNewPass(
                                                                !showNewPass
                                                            )
                                                        }
                                                    >
                                                        {/* Logic toggle new pass */}
                                                    </div>
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* BUTTONS */}
                                    <div className="flex gap-3 mt-2">
                                        {/* [UBAH WARNA] Tombol Simpan jadi Navy (#0B0931) */}
                                        <OsButton
                                            name="primary"
                                            className="w-[223px] flex items-center justify-center gap-[13px] border border-black bg-[#0B0931] text-blue-100"
                                            onClick={handleSaveChanges}
                                            disabled={processing}
                                        >
                                            <OsIcon
                                                name="Save"
                                                className="w-[17px] h-[17px] fill-blue-100"
                                            />
                                            <span>
                                                {processing
                                                    ? "Menyimpan..."
                                                    : "Simpan"}
                                            </span>
                                        </OsButton>

                                        <OsButton
                                            name="warning"
                                            className="w-[223px] flex items-center justify-center gap-[13px] border border-black bg-red-600"
                                            onClick={handleLogout}
                                            type="button"
                                        >
                                            <OsIcon
                                                name="Logout"
                                                className="w-[23px] h-[21px] fill-white"
                                            />
                                            <span>Logout</span>
                                        </OsButton>
                                    </div>

                                    <a
                                        href="#"
                                        className="text-xs underline text-black mt-2"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Ada masalah? hubungi admin
                                    </a>
                                </form>
                            </section>
                        </div>
                    </main>

                    {/* FOOTER */}
                    <OsCopyright />
                </div>
            </div>
        </div>
    );
}
