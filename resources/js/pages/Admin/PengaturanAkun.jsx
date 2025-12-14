import React, { useState, useEffect } from "react";
import { useForm, usePage, Link, router } from "@inertiajs/react";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    UploadCloud,
    Trash2,
    AlertCircle,
    LogOut,
    BookUser,
    LogIn,
    ArrowLeft,
    Save,
    Image,
} from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import Modals from "../../components/Modals.jsx";
import OsButton from "../../components/button.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsIcon from "../../components/icons.jsx";

const Component1 = ({ className }) => <Eye className={className} />;
const Icon1 = ({ className }) => <Save className={className} />;
const IconComponentNode = ({ className }) => <Lock className={className} />;

export default function AdminSettingAkun({ user }) {
    // ⭐ UPDATE 1: Ambil prop 'flash'
    const { errors, flash } = usePage().props;

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    //  ⭐ MODAL STATE
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data, setData, post, processing, wasSuccessful, reset } = useForm({
        username: user.username || "",
        email: user.email || "",
        foto: null,
        delete_foto: false,
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    useEffect(() => {
        if (user.path_gambar) {
            setProfileImage(`/${user.path_gambar}`);
        } else {
            // LOGIKA BARU: Gunakan UI Avatars untuk inisial
            const name = user.username || "User";
            const initialAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                name
            )}&background=3B82F6&color=fff&bold=true&size=177`;

            setProfileImage(initialAvatarUrl);
        }
    }, [user.path_gambar, user.username]);

    useEffect(() => {
        if (wasSuccessful) {
            reset("old_password", "new_password", "new_password_confirmation");
        }
    }, [wasSuccessful]);

    const handleProfileImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setData({ ...data, foto: file, delete_foto: false });
            setProfileImage(URL.createObjectURL(file));
        }
    };

    // ⭐ BUKA MODAL HAPUS FOTO
    const openDeletePhotoModal = () => {
        setIsDeleteModalOpen(true);
    };

    // ⭐ KONFIRMASI HAPUS FOTO
    const confirmDeletePhoto = () => {
        setData({ ...data, foto: null, delete_foto: true });

        // LOGIKA BARU: Reset ke Inisial Nama
        const name = user.username || "User";
        const initialAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
        )}&background=3B82F6&color=fff&bold=true&size=177`;

        setProfileImage(initialAvatarUrl);
        setIsDeleteModalOpen(false);
    };

    const handleSaveChanges = (event) => {
        event.preventDefault();
        post("/admin/pengaturan-akun", {
            preserveScroll: true,
        });
    };

    const customColors = { primary: "#3B82F6" };

    // ============================
    // RETURN (FULL UI)
    // ============================
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleLogout = () => {
        router.post("/logout");
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                type="admin"
                onToggle={handleSidebarToggle}
                user={user}
            />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader onMenuClick={handleSidebarToggle} />

                    <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300">
                        <div className="flex-1 overflow-auto">
                            {/* MAIN */}
                            <div className="relative row-[2_/_3] col-[1_/_2] flex flex-col gap-3">
                                {/* ⭐ UPDATE 2: FLASH MESSAGES AREA */}
                                {flash?.success && (
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                                        <strong className="font-bold">
                                            Berhasil!
                                        </strong>
                                        <span className="block sm:inline">
                                            {" "}
                                            {flash.success}
                                        </span>
                                    </div>
                                )}
                                {flash?.error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                        <strong className="font-bold">
                                            Error!
                                        </strong>
                                        <span className="block sm:inline">
                                            {" "}
                                            {flash.error}
                                        </span>
                                    </div>
                                )}
                                {/* END FLASH MESSAGES AREA */}

                                {/* NAV */}
                                <div className="flex justify-between"></div>

                                {/* CONTENT */}
                                <div className="flex flex-col lg:flex-row gap-4 w-full">
                                    {/* ASIDE */}
                                    <aside className="flex flex-col w-full lg:w-[403px] gap-[17px] p-5 bg-white rounded-xl border border-os-primary justify-center items-center">
                                        <div className="w-full h-full">
                                            <div className="flex gap-1 items-center justify-start">
                                                <Image size={18} />
                                                <h2 className="font-semibold text-lg">
                                                    Gambar Profil
                                                </h2>
                                            </div>
                                            <hr className="mt-1 border-os-primary" />
                                        </div>

                                        <div
                                            className="min-w-[177px] min-h-[177px] rounded-full bg-[#3a2323] border border-os-primary bg-cover bg-center"
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
                                                Max 1MB, 500x500px. Format: png,
                                                jpeg, jpg, gif.
                                            </p>
                                        </div>

                                        {errors.foto && (
                                            <p className="text-sm text-red-500">
                                                {errors.foto}
                                            </p>
                                        )}

                                        <div className="flex gap-[15px] w-full">
                                            <label className="flex flex-1 items-center justify-center gap-2.5 p-3 bg-blue-600 text-white rounded-xl cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept=".png,.jpeg,.jpg,.gif"
                                                    onChange={
                                                        handleProfileImageUpload
                                                    }
                                                    className="sr-only"
                                                />
                                                <UploadCloud className="w-[18px]" />
                                                Upload
                                            </label>

                                            <OsButton
                                                name="warning"
                                                type="button"
                                                onClick={openDeletePhotoModal}
                                                className=" bg-red-600 text-white rounded-xl flex items-center justify-center"
                                            >
                                                <Trash2 size={18} />
                                            </OsButton>
                                        </div>
                                    </aside>

                                    {/* FORM */}
                                    <section className="flex-1 flex flex-col gap-[15px] p-5 bg-white rounded-xl border border-os-primary">
                                        <div>
                                            <div className="flex gap-1 items-center justify-start">
                                                <User size={18} />
                                                <h2 className="font-semibold text-lg">
                                                    Akun
                                                </h2>
                                            </div>
                                            <hr className="mt-1 border-os-primary" />
                                        </div>

                                        <form
                                            onSubmit={handleSaveChanges}
                                            className="flex flex-col gap-[15px]"
                                        >
                                            {/* USERNAME */}
                                            <div className="flex flex-col gap-[3px]">
                                                <label className="text-xs">
                                                    Nama pengguna
                                                </label>
                                                <div className="flex items-center gap-[13px] p-3 bg-gray-200 rounded-xl border border-black">
                                                    <User
                                                        size={18}
                                                        opacity={0.5}
                                                    />
                                                    <input
                                                        disabled
                                                        value={data.username}
                                                        className="flex-1 bg-transparent outline-none text-gray-600 cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>

                                            <hr className="w-full border-os-primary my-2" />

                                            {/* PASSWORD LAMA */}
                                            <div className="flex flex-col gap-[3px]">
                                                <label className="text-xs">
                                                    Password lama
                                                </label>
                                                <div className="flex items-center p-2 bg-white rounded-xl border border-black pr-2">
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
                                                        value={
                                                            data.old_password
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "old_password",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Masukkan password lama"
                                                        className="flex-1 bg-transparent outline-none ml-3 py-1"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowOldPassword(
                                                                !showOldPassword
                                                            )
                                                        }
                                                        className="bg-gray-500 hover:bg-gray-600 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
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
                                            </div>

                                            {/* WRAPPER: PASSWORD BARU & KONFIRMASI (SEJAJAR) */}
                                            <div className="flex flex-col md:flex-row gap-[15px] w-full">
                                                {/* KOLOM KIRI: PASSWORD BARU */}
                                                <div className="flex flex-col gap-[3px] w-full">
                                                    <label className="text-xs">
                                                        Password baru
                                                    </label>
                                                    <div className="flex items-center p-2 bg-white rounded-xl border border-black pr-2">
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
                                                            value={
                                                                data.new_password
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "new_password",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Password baru"
                                                            className="flex-1 bg-transparent outline-none ml-3 py-1"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowNewPassword(
                                                                    !showNewPassword
                                                                )
                                                            }
                                                            className="bg-gray-500 hover:bg-gray-600 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                                                            title={
                                                                showNewPassword
                                                                    ? "Sembunyikan"
                                                                    : "Lihat"
                                                            }
                                                        >
                                                            {showNewPassword ? (
                                                                <EyeOff
                                                                    size={18}
                                                                />
                                                            ) : (
                                                                <Eye
                                                                    size={18}
                                                                />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* KOLOM KANAN: KONFIRMASI PASSWORD */}
                                                <div className="flex flex-col gap-[3px] w-full">
                                                    <label className="text-xs">
                                                        Konfirmasi password baru
                                                    </label>
                                                    <div className="flex items-center p-2 bg-white rounded-xl border border-black pr-2">
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
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Konfirmasi password"
                                                            className="flex-1 bg-transparent outline-none ml-3 py-1"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowConfirmPassword(
                                                                    !showConfirmPassword
                                                                )
                                                            }
                                                            className="bg-gray-500 hover:bg-gray-600 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                                                            title={
                                                                showConfirmPassword
                                                                    ? "Sembunyikan"
                                                                    : "Lihat"
                                                            }
                                                        >
                                                            {showConfirmPassword ? (
                                                                <EyeOff
                                                                    size={18}
                                                                />
                                                            ) : (
                                                                <Eye
                                                                    size={18}
                                                                />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full flex justify-between gap-3">
                                                <OsButton
                                                    name="primary"
                                                    type="submit"
                                                    disabled={processing}
                                                    className="sm:w-[223px] w-6/12  bg-blue-600 text-white flex items-center gap-[13px] p-3 border border-black"
                                                >
                                                    <Save className="w-[17px]" />
                                                    {processing
                                                        ? "Menyimpan..."
                                                        : "Simpan"}
                                                </OsButton>

                                                <OsButton
                                                    name="warning"
                                                    className="sm:w-[223px] w-6/12 !bg-white !text-red-600 !border-red-600  flex items-center justify-start gap-[13px] !border-os-2"
                                                    onClick={handleLogout}
                                                    type="button"
                                                >
                                                    <LogOut size={17} />
                                                    <span>Logout</span>
                                                </OsButton>
                                            </div>
                                            {/* SAVE */}

                                            <a
                                                href="#contact-admin"
                                                className="underline text-xs text-os-primary"
                                            >
                                                Ada masalah? hubungi admin
                                            </a>
                                        </form>
                                    </section>
                                </div>
                            </div>

                            {/* FOOTER */}
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <OsCopyright />
                </div>

                {/* ============================
                MODAL UNTUK DELETE FOTO PROFIL
            ============================ */}
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
