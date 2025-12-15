import React, { useState, useEffect } from "react";
// Import hook Inertia
import { useForm, usePage, router, Head } from "@inertiajs/react";
import {
    AlertCircle,
    Eye,
    EyeOff,
    LogOut,
    Save,
    Trash2,
    UploadCloud,
    Lock,
    User,
    Book,
} from "lucide-react";

// Import Komponen Custom Sesuai Desain
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsIcon from "../../components/icons.jsx";
import OsButton from "../../components/button.jsx";
import Sidebar from "../../components/Sidebar.jsx";
// ⭐ Import Modals
import Modals from "../../components/Modals.jsx";

// CustomInput
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
    <div className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto] ">
        <label className="relative self-stretch mt-[-1.00px] font-sans font-normal text-black text-xs tracking-[0] leading-[normal]">
            {label}
        </label>
        <div
            className={`flex h-[54px] items-center gap-[13px] p-3 relative self-stretch w-full rounded-xl border border-solid border-black ${
                disabled ? "bg-gray-200" : "bg-white"
            }`}
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
                className={`relative flex-1 font-sans font-normal text-[15.4px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-full placeholder:text-gray-400 ${
                    disabled
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-black"
                }`}
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
    const { user, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // State untuk Toggle Password
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // State Modal Hapus
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [profileImage, setProfileImage] = useState(null);

    // ⭐ UPDATE: Tambahkan errors, clearErrors, setError
    const {
        data,
        setData,
        post,
        processing,
        reset,
        errors,
        clearErrors,
        setError,
    } = useForm({
        username: user.username || "",
        nama: user.mahasiswa?.nama || "",
        nim: user.mahasiswa?.nim || "",
        foto: null,
        delete_foto: false,
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const getGreenAvatar = (name) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
        )}&background=16A34A&color=fff&bold=true&size=177`;
    };

    // Init Foto Profil
    useEffect(() => {
        if (user.path_gambar) {
            setProfileImage(`/${user.path_gambar}`);
        } else {
            const displayName =
                user.mahasiswa?.nama || user.username || "Mahasiswa";
            setProfileImage(getGreenAvatar(displayName));
        }
    }, [user.path_gambar, user.mahasiswa, user.username]);

    const handleProfileImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setData({
                ...data,
                foto: file,
                delete_foto: false,
            });
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const openDeletePhotoModal = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDeletePhoto = () => {
        setData({
            ...data,
            foto: null,
            delete_foto: true,
        });

        const displayName =
            user.mahasiswa?.nama || user.username || "Mahasiswa";
        setProfileImage(getGreenAvatar(displayName));

        setIsDeleteModalOpen(false);
    };

    // ⭐ UPDATE: Logic Validasi Manual (Sama seperti Admin/Penguji)
    const handleSaveChanges = (e) => {
        e.preventDefault();
        clearErrors();

        let isValid = true;

        // 1. Password Lama diisi, Password Baru KOSONG
        if (data.old_password && !data.new_password) {
            setError("new_password", "Password baru wajib diisi.");
            isValid = false;
        }

        // 2. Password Baru diisi, Password Lama KOSONG
        if (!data.old_password && data.new_password) {
            setError(
                "old_password",
                "Password lama wajib diisi untuk verifikasi."
            );
            isValid = false;
        }

        // 3. Konfirmasi Password Tidak Cocok
        if (
            data.new_password &&
            data.new_password !== data.new_password_confirmation
        ) {
            setError(
                "new_password_confirmation",
                "Konfirmasi password tidak cocok."
            );
            isValid = false;
        }

        if (!isValid) return;

        post("/mahasiswa/pengaturan-akun", {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset(
                    "old_password",
                    "new_password",
                    "new_password_confirmation",
                    "foto"
                );
            },
        });
    };

    const handleLogout = () => {
        router.post("/logout");
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            {/* <Head title="Pengaturan Akun" /> */}

            <Sidebar
                type="mahasiswa"
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                user={user}
            />

            <main className="grid w-full p-os-16 lg:p-4 min-h-screen grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 lg:ml-20">
                <OsHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} variant="mahasiswa" />

                <div className="flex flex-col gap-5 w-full">
                    {/* FLASH MESSAGE */}
                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                            <strong className="font-bold">Berhasil!</strong>
                            <span className="block sm:inline">
                                {" "}
                                {flash.success}
                            </span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline">
                                {" "}
                                {flash.error}
                            </span>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row items-start gap-5 relative w-full">
                        {/* --- KOLOM KIRI: FOTO PROFIL --- */}
                        <aside className="flex flex-col w-full lg:w-[403px] items-center gap-[17px] p-5 rounded-xl border border-os-primary-mhs shadow-sm bg-white">
                            <div className="relative self-stretch w-full h-[29px]">
                                <h2 className="text-xl">Gambar Profil</h2>
                                <hr className="mt-1 border-os-primary-mhs" />
                            </div>

                            <div
                                className="w-[177px] h-[177px] rounded-full bg-gray-100 border border-black bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${profileImage})`,
                                }}
                            />

                            <div className="flex flex-col gap-[5px] bg-red-100 p-3 rounded-xl border border-red-400 w-full">
                                <div className="flex items-center gap-[5px]">
                                    <AlertCircle className="w-[15px] text-red-500" />
                                    <p className="text-red-800 font-medium">
                                        Perhatian!
                                    </p>
                                </div>
                                <p className="text-red-700 text-[13px]">
                                    Max 1MB, 500x500px. Format: png, jpeg, jpg,
                                    gif.
                                </p>
                            </div>
                            {errors.foto && (
                                <p className="text-sm text-red-500">
                                    {errors.foto}
                                </p>
                            )}

                            <div className="flex items-center gap-[15px] relative self-stretch w-full">
                                <label className="flex items-center justify-center gap-2.5 px-3 py-3 relative flex-1 bg-os-primary-mhs text-white rounded-xl cursor-pointer hover:bg-os-primary-mhs-dark transition">
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.gif"
                                        onChange={handleProfileImageUpload}
                                        className="sr-only"
                                    />
                                    <UploadCloud className="w-[18px]" />
                                    <span className="font-sans font-normal text-[15px] ">
                                        Upload
                                    </span>
                                </label>

                                <button
                                    type="button"
                                    onClick={openDeletePhotoModal}
                                    className="flex w-12 h-12 items-center justify-center bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                                >
                                    <Trash2 className="w-[20px]" />
                                </button>
                            </div>
                        </aside>

                        {/* --- KOLOM KANAN: FORM DATA --- */}
                        <section className="flex flex-col w-full items-start gap-[15px] p-5 relative flex-1 grow rounded-xl border border-os-primary-mhs shadow-sm bg-white">
                            <div className="relative self-stretch w-full h-[29px]">
                                <h2 className="absolute top-[calc(50%_-_14px)] left-0 font-sans font-normal text-black text-xl">
                                    Akun
                                </h2>
                                <hr className="absolute top-7 left-0 w-full border-os-primary-mhs border-t" />
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
                                        <User className="w-4 h-4 opacity-50" />
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
                                    icon={
                                        <Book className="w-5 h-5 opacity-50" />
                                    }
                                    disabled
                                />

                                <hr className="w-full border-os-primary-mhs my-2" />

                                {/* PASSWORD LAMA */}
                                <div className="flex flex-col gap-[3px] w-full">
                                    <label className="text-xs">
                                        Password lama
                                    </label>
                                    {/* ⭐ Logic Border Merah */}
                                    <div
                                        className={`flex items-center p-2 bg-white rounded-xl border pr-2 ${
                                            errors.old_password
                                                ? "border-red-500"
                                                : "border-black"
                                        }`}
                                    >
                                        <Lock
                                            size={16}
                                            opacity={0.5}
                                            className="ml-2"
                                        />
                                        <input
                                            type={
                                                showOldPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={data.old_password}
                                            onChange={(e) =>
                                                setData(
                                                    "old_password",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Masukkan password lama..."
                                            className="flex-1 bg-transparent outline-none ml-3 py-1 placeholder:text-gray-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowOldPassword(
                                                    !showOldPassword
                                                )
                                            }
                                            className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                                            title={
                                                showOldPassword
                                                    ? "Sembunyikan"
                                                    : "Lihat"
                                            }
                                        >
                                            {showOldPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                    {/* ⭐ Logic Pesan Error + Ikon */}
                                    {errors.old_password && (
                                        <p className="text-xs text-red-500 mt-1 font-medium flex items-center gap-1">
                                            <AlertCircle size={12} />{" "}
                                            {errors.old_password}
                                        </p>
                                    )}
                                </div>

                                {/* WRAPPER: PASSWORD BARU & KONFIRMASI */}
                                <div className="flex flex-col md:flex-row gap-[15px] w-full">
                                    {/* PASSWORD BARU */}
                                    <div className="flex flex-col gap-[3px] w-full">
                                        <label className="text-xs">
                                            Password baru
                                        </label>
                                        <div
                                            className={`flex items-center p-2 bg-white rounded-xl border pr-2 ${
                                                errors.new_password
                                                    ? "border-red-500"
                                                    : "border-black"
                                            }`}
                                        >
                                            <Lock
                                                size={16}
                                                opacity={0.5}
                                                className="ml-2"
                                            />
                                            <input
                                                type={
                                                    showNewPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={data.new_password}
                                                onChange={(e) =>
                                                    setData(
                                                        "new_password",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Password baru..."
                                                className="flex-1 bg-transparent outline-none ml-3 py-1 placeholder:text-gray-400"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        !showNewPassword
                                                    )
                                                }
                                                className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                                                title={
                                                    showNewPassword
                                                        ? "Sembunyikan"
                                                        : "Lihat"
                                                }
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                        {errors.new_password && (
                                            <p className="text-xs text-red-500 mt-1 font-medium flex items-center gap-1">
                                                <AlertCircle size={12} />{" "}
                                                {errors.new_password}
                                            </p>
                                        )}
                                    </div>

                                    {/* KONFIRMASI PASSWORD */}
                                    <div className="flex flex-col gap-[3px] w-full">
                                        <label className="text-xs">
                                            Konfirmasi password baru
                                        </label>
                                        <div
                                            className={`flex items-center p-2 bg-white rounded-xl border pr-2 ${
                                                errors.new_password_confirmation
                                                    ? "border-red-500"
                                                    : "border-black"
                                            }`}
                                        >
                                            <Lock
                                                size={16}
                                                opacity={0.5}
                                                className="ml-2"
                                            />
                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    data.new_password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "new_password_confirmation",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Konfirmasi password..."
                                                className="flex-1 bg-transparent outline-none ml-3 py-1 placeholder:text-gray-400"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                                className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                                                title={
                                                    showConfirmPassword
                                                        ? "Sembunyikan"
                                                        : "Lihat"
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                        {errors.new_password_confirmation && (
                                            <p className="text-xs text-red-500 mt-1 font-medium flex items-center gap-1">
                                                <AlertCircle size={12} />{" "}
                                                {
                                                    errors.new_password_confirmation
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* BUTTONS GROUP */}
                                <div className="w-full flex justify-between gap-3 mt-2">
                                    <OsButton
                                        name="primary-mhs"
                                        className="w-[223px] flex items-center rounded-xl p-3 justify-start gap-[13px] border border-black bg-[#0B0931] text-blue-100"
                                        onClick={handleSaveChanges}
                                        disabled={processing}
                                    >
                                        <Save className="w-[17px]" />
                                        <span>
                                            {processing
                                                ? "Menyimpan..."
                                                : "Simpan"}
                                        </span>
                                    </OsButton>

                                    <OsButton
                                        name="warning"
                                        className="sm:w-[223px] w-6/12 !bg-white !text-red-600 !border-red-600  flex items-center justify-start gap-[13px] !border-os-2"
                                        onClick={() => {
                                            handleLogout();
                                        }}
                                        type="button"
                                    >
                                        <LogOut size={17} />
                                        <span>Logout</span>
                                    </OsButton>
                                </div>

                                <a
                                    href="#"
                                    className="text-xs underline text-os-primary"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    Ada masalah? hubungi admin
                                </a>
                            </form>
                        </section>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="mt-2">
                    <OsCopyright variant="mahasiswa" />
                </div>

                {/* MODAL */}
                <Modals
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDeletePhoto}
                    variant="delete"
                    title="Hapus Foto Profil"
                    message="Apakah Anda yakin ingin menghapus foto profil Anda?"
                    confirmText="Hapus"
                    showDataDetails={false}
                />
            </main>
        </div>
    );
}
