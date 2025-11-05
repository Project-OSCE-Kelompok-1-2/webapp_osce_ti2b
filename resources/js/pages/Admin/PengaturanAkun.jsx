import React, { useState, useEffect } from "react";
// 👇 [UBAH] Impor hook yang diperlukan dari Inertia
import { useForm, usePage, Link } from "@inertiajs/react";
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
} from "lucide-react";
import Sidebar from "../../Components/Sidebar";


// Mock untuk <Component1 /> (tombol mata)
const Component1 = ({ className }) => <Eye className={className} />;
const Icon1 = ({ className }) => <Save className={className} />;
const IconComponentNode = ({ className }) => <Lock className={className} />;

// ================================================================
// KODE YANG SUDAH TERHUBUNG KE DATABASE
// ================================================================

// 👇 [UBAH] Ganti nama komponen dan terima 'user' dari props
export default function AdminSettingAkun({ user }) {
    // 👇 [UBAH] Hapus semua `useState` untuk data form
    const { errors } = usePage().props;
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null); // Ini hanya untuk preview

    // 👇 [BARU] Gunakan useForm untuk mengelola state dan koneksi ke backend
    const { data, setData, post, processing, wasSuccessful, reset } = useForm({
        username: user.username || "",
        email: user.email || "", // Email tidak diubah, tapi kita simpan di sini
        foto: null,
        delete_foto: false,
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    // 👇 [BARU] Atur gambar profil awal dari data user
    useEffect(() => {
        if (user.path_gambar) {
            setProfileImage(`/${user.path_gambar}`);
        } else {
            setProfileImage(
                "https://via.placeholder.com/177/3a2323/FFFFFF?text=P"
            );
        }
    }, [user.path_gambar]);

    // 👇 [BARU] Reset field password setelah berhasil update
    useEffect(() => {
        if (wasSuccessful) {
            reset("old_password", "new_password", "new_password_confirmation");
        }
    }, [wasSuccessful]);

    const handleProfileImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            // 👇 [UBAH] Simpan file ke state useForm dan update preview
            setData({ ...data, foto: file, delete_foto: false });
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleDeleteProfileImage = () => {
        // 👇 [UBAH] Set flag hapus di useForm dan hapus preview
        setData({ ...data, foto: null, delete_foto: true });
        setProfileImage("https://via.placeholder.com/177/3a2323/FFFFFF?text=P");
    };

    const handleSaveChanges = (event) => {
        event.preventDefault();
        // 👇 [UBAH] Kirim data ke backend menggunakan Inertia post
        // Inertia otomatis menangani file upload (multipart/form-data)
        post("/admin/pengaturan-akun", {
            preserveScroll: true,
        });
    };

    const navigationButtons = [
        {
            id: "account-page",
            label: "Halaman Akun",
            icon: (
                <BookUser
                    className="!relative !w-[21px] !h-[21px]"
                    color="white"
                />
            ),
            bgColor: "bg-blue-600",
            opacity: "",
        },
        {
            id: "login-page",
            label: "Halaman Login",
            icon: (
                <LogIn className="relative w-[19px] h-[21px]" color="white" />
            ),
            bgColor: "bg-blue-600",
            opacity: "opacity-75",
        },
    ];

    const customColors = { primary: "#3B82F6", warning: "#F97316" };

    return (
        // 🆕 Tambahkan relative dan overflow-hidden agar sidebar overlay bisa muncul di atas dashboard
        <div className="relative bg-os-white w-full min-h-screen  flex justify-start p-os-12 font-sans overflow-hidden">

            {/* Sidebar dipanggil langsung tanpa kontrol dari dashboard */}
            <Sidebar/>

        <div className="bg-gray-100 w-full min-h-screen flex justify-center p-6 font-sans">
            <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                <header className="relative row-[1_/_2] col-[1_/_2] w-full flex flex-col items-start gap-5 bg-white p-4 rounded-xl shadow-sm border border-gray-900">
                    <div className="flex items-center justify-between relative self-stretch w-full">
                        <button
                            type="button"
                            className="flex w-[54px] h-[54px] items-center justify-center gap-[13px] p-3 relative bg-blue-600 text-white rounded-xl border border-solid border-black aspect-[1]"
                            aria-label="Home"
                            style={{ backgroundColor: customColors.primary }}
                        >
                            <ArrowLeft className="relative w-[30px] h-[26px]" />
                        </button>
                        <nav
                            className="relative flex-1 h-[54px] ml-4"
                            aria-label="Breadcrumb"
                        >
                            <div className="h-full items-center bg-white flex w-full rounded-xl overflow-hidden border border-solid border-black">
                                <p className="h-6 ml-5 [font-family:'Inter-Regular',Helvetica] font-normal text-transparent text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                                    <span className="text-[#000000bf]">
                                        Pengaturan
                                    </span>
                                    <span className="text-black"> / Akun</span>
                                </p>
                            </div>
                        </nav>
                    </div>
                    <hr className="relative w-full border-black border-t" />
                </header>

                <main className="relative row-[2_/_3] col-[1_/_2] w-full h-full flex flex-col items-start gap-3">
                    <nav
                        className="flex items-start gap-[15px] relative self-stretch w-full flex-[0_0_auto] bg-white p-4 rounded-xl shadow-sm border border-gray-900"
                        aria-label="Main navigation"
                    >
                        <div className="flex flex-wrap h-full items-start gap-[15px] relative flex-1 grow">
                            {navigationButtons.map((button) => (
                                <button
                                    key={button.id}
                                    type="button"
                                    className={`${button.bgColor} inline-flex items-center justify-center gap-[13px] p-3 relative rounded-xl text-white ${button.opacity}`}
                                    aria-label={button.label}
                                    style={{
                                        backgroundColor: customColors.primary,
                                    }}
                                >
                                    {button.icon}
                                    <span className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                                        {button.label}
                                    </span>
                                </button>
                            ))}
                            <div className="flex items-start justify-end gap-2.5 relative flex-1 self-stretch grow">
                                {/* 👇 [UBAH] Tombol Logout sekarang menjadi Link Inertia */}
                                <Link
                                    as="button"
                                    method="post"
                                    href="/logout"
                                    className="bg-red-600 inline-flex items-center justify-center gap-[13px] p-3 relative rounded-xl text-white opacity-75"
                                    aria-label="Log Out"
                                >
                                    <LogOut className="relative w-[23px] h-[21px]" />
                                    <span className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                                        Log Out
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </nav>

                    <div className="flex flex-col lg:flex-row items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
                        <aside className="flex flex-col w-full lg:w-[403px] h-fit items-center gap-[17px] p-5 relative bg-white rounded-xl border border-solid border-black shadow-sm">
                            <div className="relative self-stretch w-full h-[29px]">
                                <h2 className="absolute top-[calc(50.00%_-_14px)] left-0 w-[261px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xl tracking-[0] leading-[normal]">
                                    Gambar Profil
                                </h2>
                                <hr className="absolute top-7 left-0 w-full border-black border-t" />
                            </div>
                            <div
                                className="relative w-[177px] h-[177px] bg-[#3a2323] rounded-full border border-solid border-black bg-cover bg-center"
                                style={
                                    profileImage
                                        ? {
                                              backgroundImage: `url(${profileImage})`,
                                          }
                                        : {}
                                }
                                role="img"
                                aria-label="Profile picture"
                            />
                            <div
                                className="flex-col items-start gap-[5px] p-3.5 relative self-stretch flex-[0_0_auto] bg-red-100 flex w-full rounded-xl overflow-hidden border border-solid border-red-400"
                                role="alert"
                            >
                                <div className="inline-flex items-center gap-[5px] relative flex-[0_0_auto]">
                                    <AlertCircle
                                        className="relative w-[15px] h-3.5 text-red-500"
                                        aria-hidden="true"
                                    />
                                    <div className="relative flex items-center justify-center w-fit [font-family:'Inter-Regular',Helvetica] font-medium text-red-800 text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                                        Perhatian!
                                    </div>
                                </div>
                                <p className="relative self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-red-700 text-[13px] tracking-[0] leading-[normal]">
                                    Gambar yang dikirim harus berukuran kurang
                                    lebih dari 1 MB dengan resolusi max 500 x
                                    500 px, hanya support format foto: .png,
                                    .jpeg, .jpg, dan .gif
                                </p>
                            </div>
                            {errors.foto && (
                                <p className="text-sm text-red-500">
                                    {errors.foto}
                                </p>
                            )}
                            <div className="flex items-center gap-[15px] relative self-stretch w-full">
                                <label className="flex items-center justify-center gap-2.5 px-3 py-3 relative flex-1 self-stretch grow bg-blue-600 text-white rounded-xl overflow-hidden cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".png,.jpeg,.jpg,.gif"
                                        onChange={handleProfileImageUpload}
                                        className="sr-only"
                                        aria-label="Upload profile image"
                                    />
                                    <UploadCloud
                                        className="relative w-[18px] h-[17px]"
                                        aria-hidden="true"
                                    />
                                    <span className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                                        Upload gambar profil
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    onClick={handleDeleteProfileImage}
                                    className="flex flex-col w-12 h-12 items-center justify-center gap-2.5 relative bg-red-600 text-white rounded-xl aspect-[1]"
                                    aria-label="Delete profile image"
                                >
                                    <Trash2
                                        className="relative w-[17px] h-5"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </aside>

                        <section className="flex flex-col items-start gap-[15px] p-5 relative flex-1 grow bg-white rounded-xl border border-solid border-black shadow-sm">
                            <div className="relative self-stretch w-full h-[29px]">
                                <h2 className="absolute top-[calc(50.00%_-_14px)] left-0 w-[285px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xl tracking-[0] leading-[normal]">
                                    Akun
                                </h2>
                                <hr className="absolute top-7 left-0 w-full border-black border-t" />
                            </div>
                            <form
                                onSubmit={handleSaveChanges}
                                className="flex flex-col items-start gap-[15px] relative self-stretch w-full flex-[0_0_auto]"
                            >
                                <div className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
                                    <label
                                        htmlFor="username"
                                        className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xs tracking-[0] leading-[normal]"
                                    >
                                        Nama pengguna
                                    </label>
                                    <div className="flex h-[54px] items-center gap-[13px] p-3 relative self-stretch w-full bg-white rounded-xl border border-solid border-black">
                                        <User
                                            className="!relative !w-4 !h-4"
                                            color="black"
                                            opacity="0.45"
                                            aria-hidden="true"
                                        />
                                        <input
                                            type="text"
                                            id="username"
                                            value={data.username}
                                            onChange={(e) =>
                                                setData(
                                                    "username",
                                                    e.target.value
                                                )
                                            }
                                            className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[15.4px] tracking-[0] leading-[normal] bg-transparent border-none outline-none"
                                            aria-label="Username"
                                        />
                                    </div>
                                    {errors.username && (
                                        <p className="text-sm text-red-500">
                                            {errors.username}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
                                    <label
                                        htmlFor="email"
                                        className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xs tracking-[0] leading-[normal]"
                                    >
                                        Email pengguna
                                    </label>
                                    <div className="h-[54px] self-stretch w-full bg-gray-200 flex items-center gap-[13px] p-3 relative rounded-xl border border-solid border-black">
                                        <Mail
                                            className="relative w-5 h-4"
                                            color="black"
                                            opacity="0.45"
                                            aria-hidden="true"
                                        />
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            disabled
                                            className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-gray-600 text-[15.4px] tracking-[0] leading-[normal] bg-transparent cursor-not-allowed border-none outline-none"
                                            aria-label="Email (disabled)"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
                                    <label
                                        htmlFor="old-password"
                                        className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xs tracking-[0] leading-[normal]"
                                    >
                                        Password lama
                                    </label>
                                    <div className="flex h-[54px] items-start gap-3.5 relative self-stretch w-full">
                                        <div className="flex-1 self-stretch grow bg-white flex items-center gap-[13px] p-3 relative rounded-xl border border-solid border-black">
                                            <IconComponentNode
                                                className="!relative !w-[19px] !h-[19px] !aspect-[1]"
                                                aria-hidden="true"
                                            />
                                            <input
                                                type={
                                                    showOldPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                id="old-password"
                                                value={data.old_password}
                                                onChange={(e) =>
                                                    setData(
                                                        "old_password",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Isi jika ingin ganti password"
                                                className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-gray-600 text-[15.4px] tracking-[0] leading-[normal] bg-transparent border-none outline-none"
                                                aria-label="Old password"
                                            />
                                        </div>
                                    </div>
                                    {errors.old_password && (
                                        <p className="text-sm text-red-500">
                                            {errors.old_password}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col md:flex-row items-center gap-[15px] relative self-stretch w-full flex-[0_0_auto]">
                                    <div className="flex flex-col w-full md:w-[376px] items-start gap-[3px] relative">
                                        <label
                                            htmlFor="new-password"
                                            className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xs tracking-[0] leading-[normal]"
                                        >
                                            Password baru
                                        </label>
                                        <div className="flex h-[54px] items-center gap-[13px] p-3 relative self-stretch w-full bg-white rounded-xl border border-solid border-black">
                                            <IconComponentNode
                                                className="!relative !w-5 !h-5 !aspect-[1]"
                                                aria-hidden="true"
                                            />
                                            <input
                                                type="password"
                                                id="new-password"
                                                value={data.new_password}
                                                onChange={(e) =>
                                                    setData(
                                                        "new_password",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Masukkan password yang baru..."
                                                className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-[#00000080] text-[15.4px] tracking-[0] leading-[normal] bg-transparent placeholder:text-[#00000080] border-none outline-none"
                                                aria-label="New password"
                                            />
                                        </div>
                                        {errors.new_password && (
                                            <p className="text-sm text-red-500">
                                                {errors.new_password}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-start gap-[3px] relative flex-1 grow w-full">
                                        <label
                                            htmlFor="confirm-password"
                                            className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xs tracking-[0] leading-[normal]"
                                        >
                                            Konfirmasi password baru
                                        </label>
                                        <div className="flex h-[54px] items-center gap-[13px] p-3 relative self-stretch w-full bg-white rounded-xl border border-solid border-black">
                                            <IconComponentNode
                                                className="!relative !w-5 !h-5 !aspect-[1]"
                                                aria-hidden="true"
                                            />
                                            <input
                                                type="password"
                                                id="confirm-password"
                                                value={
                                                    data.new_password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "new_password_confirmation",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Konfirmasi password yang baru..."
                                                className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-[#00000080] text-[15.4px] tracking-[0] leading-[normal] bg-transparent placeholder:text-[#00000080] border-none outline-none"
                                                aria-label="Confirm new password"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="inline-flex flex-col items-start gap-2.5 relative flex-[0_0_auto]">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-[223px] justify-center flex-[0_0_auto] bg-blue-600 text-white flex items-center gap-[13px] p-3 relative rounded-xl border border-solid border-black disabled:opacity-50"
                                    >
                                        <Icon1
                                            className="!relative !w-[17px] !h-[17px] !aspect-[1]"
                                            aria-hidden="true"
                                        />
                                        <span className="relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[15.4px] tracking-[0] leading-[normal]">
                                            {processing
                                                ? "Menyimpan..."
                                                : "Simpan"}
                                        </span>
                                    </button>
                                    <a
                                        href="#contact-admin"
                                        className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[11.8px] tracking-[0] leading-[normal] underline whitespace-nowrap"
                                    >
                                        Ada masalah? hubungi admin
                                    </a>
                                </div>
                            </form>
                        </section>
                    </div>
                </main>

                <footer className="relative row-[3_/_4] col-[1_/_2] w-full h-full flex flex-col items-center justify-end bg-white p-4 rounded-xl shadow-sm border border-gray-900">
                    <div className="relative self-stretch w-full">
                        <div className="w-full h-full flex">
                            <div className="flex-1 flex items-center">
                                <p className="[font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-base tracking-[0] leading-[normal] whitespace-nowrap">
                                    Copyright Porem ipsum dolor sit amet
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </div>
    );
}
