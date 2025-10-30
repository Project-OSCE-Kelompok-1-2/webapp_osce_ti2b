import React, { useState } from "react";

// Meenggunakan ikon dari lucide-react sebagai pengganti 
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
  Save, // Ikon untuk "Simpan"
} from "lucide-react";

// 2. MEMBUAT MOCK UNTUK KOMPONEN YANG HILANG
// Ini adalah pengganti untuk './Component1', './Icon1', dll.

// Mock untuk <Component1 /> (tombol mata)
// Kita buat sederhana saja, hanya menampilkan ikon mata
const Component1 = ({ className }) => <Eye className={className} />;

// Mock untuk <Icon1 /> (ikon simpan)
const Icon1 = ({ className }) => <Save className={className} />;

// Mock untuk <IconComponentNode /> (ikon gembok)
const IconComponentNode = ({ className }) => <Lock className={className} />;

// Mock untuk <Icon /> (ikon user/akun)
// Daripada membuat mock, kita akan ganti penggunaannya di JSX
// langsung dengan <User /> atau <BookUser /> agar lebih jelas.

// 3. FILE SVG YANG HILANG (image.svg, line-2.svg, dll)
// Kita tidak perlu mengimpornya lagi.
// Kita akan ganti <img> dengan <hr /> (garis horizontal)
// atau mengganti `bg-url` dengan komponen ikon lucide.

// ================================================================
// KODE ASLI ANDA (DENGAN MODIFIKASI)
// ================================================================

export const AdminSettingAkun = () => {
  const [username, setUsername] = useState("Admin1234");
  const [email] = useState("admin1234@gmail.com");
  const [oldPassword] = useState("123456789");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  
  // Menggunakan placeholder dari via.placeholder.com, mirip file pertama Anda
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/177/3a2323/FFFFFF?text=P"
  );

  const handleProfileImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleDeleteProfileImage = () => {
    // Kembali ke placeholder default saat dihapus
    setProfileImage("https://via.placeholder.com/177/3a2323/FFFFFF?text=P");
  };

  const handleSaveChanges = (event) => {
    event.preventDefault();
    console.log("Saving changes...", {
      username,
      newPassword,
      confirmPassword,
    });
    alert("Perubahan Disimpan! (Cek Console)"); // Tambahkan feedback
  };

  const navigationButtons = [
    {
      id: "account-page",
      label: "Halaman Akun",
      // DIGANTI: dari <Icon> ke <BookUser />
      icon: <BookUser className="!relative !w-[21px] !h-[21px]" color="white" />,
      bgColor: "bg-blue-600", // Menggunakan warna Tailwind
      opacity: "",
    },
    {
      id: "login-page",
      label: "Halaman Login",
      // DIGANTI: dari div bg-url ke <LogIn />
      icon: (
        <LogIn className="relative w-[19px] h-[21px]" color="white" />
      ),
      bgColor: "bg-blue-600", // Menggunakan warna Tailwind
      opacity: "opacity-75",
    },
  ];

  // Definisikan warna kustom jika 'primary' dan 'warning' tidak ada di Tailwind
  // Jika Anda sudah setup tailwind.config.js, ini tidak perlu.
  const customColors = {
    primary: '#3B82F6', // Contoh Biru
    warning: '#F97316', // Contoh Oranye
  };

  return (
    // Menambahkan bg-gray-100 agar mirip dengan file pertama
    <div className="bg-gray-100 w-full min-h-screen flex justify-center p-6 font-sans">
      {/* Menghapus 'min-w-[1440px]' dan 'ml-[134px]' 
        agar layout lebih fleksibel dan terpusat.
      */}
      <div className="grid w-full max-w-7xl h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-2.5">
        <header className="relative row-[1_/_2] col-[1_/_2] w-full flex flex-col items-start gap-5 bg-white p-4 rounded-xl shadow-sm border border-gray-900">
          <div className="flex items-center justify-between relative self-stretch w-full">
            <button
              type="button"
              className="flex w-[54px] h-[54px] items-center justify-center gap-[13px] p-3 relative bg-blue-600 text-white rounded-xl border border-solid border-black aspect-[1]"
              aria-label="Home"
              style={{ backgroundColor: customColors.primary }} // Gunakan style jika 'bg-primary' tidak ada
            >
              {/* DIGANTI: dari div bg-url ke <ArrowLeft /> */}
              <ArrowLeft className="relative w-[30px] h-[26px]" />
            </button>

            <nav
              className="relative flex-1 h-[54px] ml-4"
              aria-label="Breadcrumb"
            >
              <div className="h-full items-center bg-white flex w-full rounded-xl overflow-hidden border border-solid border-black">
                <p className="h-6 ml-5 [font-family:'Inter-Regular',Helvetica] font-normal text-transparent text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                  <span className="text-[#000000bf]">Pengaturan</span>
                  <span className="text-black"> / Akun</span>
                </p>
              </div>
            </nav>
          </div>

          {/* DIGANTI: <img> dengan <hr /> */}
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
                  style={{ backgroundColor: customColors.primary }} // Gunakan style jika 'bg-primary' tidak ada
                >
                  {button.icon}
                  <span className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                    {button.label}
                  </span>
                </button>
              ))}

              <div className="flex items-start justify-end gap-2.5 relative flex-1 self-stretch grow">
                <button
                  type="button"
                  className="bg-red-600 inline-flex items-center justify-center gap-[13px] p-3 relative rounded-xl text-white opacity-75"
                  aria-label="Log Out"
                //   style={{ backgroundColor: customColors.warning }} // Gunakan style jika 'bg-warning' tidak ada
                >
                  {/* DIGANTI: dari div bg-url ke <LogOut /> */}
                  <LogOut className="relative w-[23px] h-[21px]" />
                  <span className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                    Log Out
                  </span>
                </button>
              </div>
            </div>
          </nav>

          {/* Konten Utama: Grid Profil dan Akun */}
          <div className="flex flex-col lg:flex-row items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
            {/* Kiri: Gambar Profil */}
            <aside className="flex flex-col w-full lg:w-[403px] h-fit items-center gap-[17px] p-5 relative bg-white rounded-xl border border-solid border-black shadow-sm">
              <div className="relative self-stretch w-full h-[29px]">
                <h2 className="absolute top-[calc(50.00%_-_14px)] left-0 w-[261px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xl tracking-[0] leading-[normal]">
                  Gambar Profil
                </h2>
                {/* DIGANTI: <img> dengan <hr /> */}
                <hr className="absolute top-7 left-0 w-full border-black border-t" />
              </div>

              <div
                className="relative w-[177px] h-[177px] bg-[#3a2323] rounded-full border border-solid border-black bg-cover bg-center"
                style={
                  profileImage
                    ? { backgroundImage: `url(${profileImage})` }
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
                  {/* DIGANTI: dari div bg-url ke <AlertCircle /> */}
                  <AlertCircle
                    className="relative w-[15px] h-3.5 text-red-500"
                    aria-hidden="true"
                  />
                  <div className="relative flex items-center justify-center w-fit [font-family:'Inter-Regular',Helvetica] font-medium text-red-800 text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                    Perhatian!
                  </div>
                </div>
                <p className="relative self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-red-700 text-[13px] tracking-[0] leading-[normal]">
                  Gambar yang dikirim harus berukuran kurang lebih dari 1 MB
                  dengan resolusi max 500 x 500 px, hanya support format foto:
                  .png, .jpeg, .jpg, dan .gif
                </p>
              </div>

              <div className="flex items-center gap-[15px] relative self-stretch w-full">
                <label className="flex items-center justify-center gap-2.5 px-3 py-3 relative flex-1 self-stretch grow bg-blue-600 text-white rounded-xl overflow-hidden cursor-pointer">
                  <input
                    type="file"
                    accept=".png,.jpeg,.jpg,.gif"
                    onChange={handleProfileImageUpload}
                    className="sr-only"
                    aria-label="Upload profile image"
                  />
                  {/* DIGANTI: dari div bg-url ke <UploadCloud /> */}
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
                  {/* DIGANTI: dari div bg-url ke <Trash2 /> */}
                  <Trash2
                    className="relative w-[17px] h-5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </aside>

            {/* Kanan: Form Akun */}
            <section className="flex flex-col items-start gap-[15px] p-5 relative flex-1 grow bg-white rounded-xl border border-solid border-black shadow-sm">
              <div className="relative self-stretch w-full h-[29px]">
                <h2 className="absolute top-[calc(50.00%_-_14px)] left-0 w-[285px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xl tracking-[0] leading-[normal]">
                  Akun
                </h2>
                {/* DIGANTI: <img> dengan <hr /> */}
                <hr className="absolute top-7 left-0 w-full border-black border-t" />
              </div>

              <form
                onSubmit={handleSaveChanges}
                className="flex flex-col items-start gap-[15px] relative self-stretch w-full flex-[0_0_auto]"
              >
                {/* Nama Pengguna */}
                <div className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    htmlFor="username"
                    className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xs tracking-[0] leading-[normal]"
                  >
                    Nama pengguna
                  </label>
                  <div className="flex h-[54px] items-center gap-[13px] p-3 relative self-stretch w-full bg-white rounded-xl border border-solid border-black">
                    {/* DIGANTI: dari <Icon> ke <User /> */}
                    <User
                      className="!relative !w-4 !h-4"
                      color="black"
                      opacity="0.45"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[15.4px] tracking-[0] leading-[normal] bg-transparent border-none outline-none"
                      aria-label="Username"
                    />
                  </div>
                </div>

                {/* Email Pengguna */}
                <div className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    htmlFor="email"
                    className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xs tracking-[0] leading-[normal]"
                  >
                    Email pengguna
                  </label>
                  <div className="h-[54px] self-stretch w-full bg-gray-200 flex items-center gap-[13px] p-3 relative rounded-xl border border-solid border-black">
                    {/* DIGANTI: dari div bg-url ke <Mail /> */}
                    <Mail
                      className="relative w-5 h-4"
                      color="black"
                      opacity="0.45"
                      aria-hidden="true"
                    />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      disabled
                      className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-gray-600 text-[15.4px] tracking-[0] leading-[normal] bg-transparent cursor-not-allowed border-none outline-none"
                      aria-label="Email (disabled)"
                    />
                  </div>
                </div>

                {/* Password Lama */}
                <div className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    htmlFor="old-password"
                    className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xs tracking-[0] leading-[normal]"
                  >
                    Password lama
                  </label>
                  <div className="flex h-[54px] items-start gap-3.5 relative self-stretch w-full">
                    <div className="flex-1 self-stretch grow bg-gray-200 flex items-center gap-[13px] p-3 relative rounded-xl border border-solid border-black">
                      {/* MOCK: <IconComponentNode /> (ikon gembok) */}
                      <IconComponentNode
                        className="!relative !w-[19px] !h-[19px] !aspect-[1]"
                        aria-hidden="true"
                      />
                      <input
                        type={showOldPassword ? "text" : "password"}
                        id="old-password"
                        value={oldPassword}
                        disabled
                        className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-gray-600 text-[15.4px] tracking-[0] leading-[normal] bg-transparent cursor-not-allowed border-none outline-none"
                        aria-label="Old password (disabled)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="flex flex-col w-[54px] h-[54px] items-center justify-center gap-2.5 p-[11px] relative bg-blue-600 text-white rounded-xl border border-solid border-black"
                      aria-label={
                        showOldPassword
                          ? "Hide old password"
                          : "Show old password"
                      }
                    >
                      {/* MOCK: <Component1 /> (ikon mata) */}
                      {/* LOGIKA DIPERBAIKI: Menampilkan EyeOff jika password terlihat */}
                      {showOldPassword ? (
                        <EyeOff className="!relative !w-[31px] !h-[31px] !aspect-[1]" />
                      ) : (
                        <Component1
                          className="!relative !w-[31px] !h-[31px] !aspect-[1]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Baru & Konfirmasi */}
                <div className="flex flex-col md:flex-row items-center gap-[15px] relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex flex-col w-full md:w-[376px] items-start gap-[3px] relative">
                    <label
                      htmlFor="new-password"
                      className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xs tracking-[0] leading-[normal]"
                    >
                      Password baru
                    </label>
                    <div className="flex h-[54px] items-center gap-[13px] p-3 relative self-stretch w-full bg-white rounded-xl border border-solid border-black">
                      {/* MOCK: <IconComponentNode /> (ikon gembok) */}
                      <IconComponentNode
                        className="!relative !w-5 !h-5 !aspect-[1]"
                        aria-hidden="true"
                      />
                      <input
                        type="password"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Masukkan password yang baru..."
                        className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-[#00000080] text-[15.4px] tracking-[0] leading-[normal] bg-transparent placeholder:text-[#00000080] border-none outline-none"
                        aria-label="New password"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-[3px] relative flex-1 grow w-full">
                    <label
                      htmlFor="confirm-password"
                      className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xs tracking-[0] leading-[normal]"
                    >
                      Konfirmasi password baru
                    </label>
                    <div className="flex h-[54px] items-center gap-[13px] p-3 relative self-stretch w-full bg-white rounded-xl border border-solid border-black">
                      {/* MOCK: <IconComponentNode /> (ikon gembok) */}
                      <IconComponentNode
                        className="!relative !w-5 !h-5 !aspect-[1]"
                        aria-hidden="true"
                      />
                      <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    className="w-[223px] justify-center flex-[0_0_auto] bg-blue-600 text-white flex items-center gap-[13px] p-3 relative rounded-xl border border-solid border-black"
                    aria-label="Save changes"
                  >
                    {/* MOCK: <Icon1 /> (ikon simpan) */}
                    <Icon1
                      className="!relative !w-[17px] !h-[17px] !aspect-[1]"
                      aria-hidden="true"
                    />
                    <span className="relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[15.4px] tracking-[0] leading-[normal]">
                      Simpan
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
  );
};

// Ekspor default agar bisa di-render
export default AdminSettingAkun;
