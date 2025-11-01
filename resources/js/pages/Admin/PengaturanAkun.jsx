import React, { useState, useEffect } from "react";
import { Head, useForm, usePage } from '@inertiajs/react'; // <-- IMPORT INERTIA

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

// 2. MOCK UNTUK KOMPONEN YANG HILANG (TETAP SAMA)
const Component1 = ({ className }) => <Eye className={className} />;
const Icon1 = ({ className }) => <Save className={className} />;
const IconComponentNode = ({ className }) => <Lock className={className} />;

// ================================================================
// KODE YANG DISINKRONKAN DENGAN INERTIA
// ================================================================

// Ubah nama 'Profil' menjadi 'PengaturanAkun' agar sesuai nama file
export default function PengaturanAkun({ auth, user }) { // <-- Terima 'user' prop

  // --- LOGIKA BARU: INERTIA HOOKS ---
  const { flash, errors: formErrors } = usePage().props;
  
  // Cek jika user tidak ada (untuk anti-crash layar putih)
  if (!user) {
    return (
        <div className="bg-gray-100 w-full min-h-screen flex justify-center items-center p-6 font-sans">
            <Head title="Loading..." />
            <p>Loading data pengguna...</p>
        </div>
    );
  }

  const { data, setData, post, processing, reset } = useForm({
    // Inisialisasi dari 'user' prop, BUKAN useState
    username: user.username || '', 
    foto: null, // Input file
    old_password: '', // Mulai kosong
    new_password: '',
    new_password_confirmation: '',
    _method: 'POST', // Wajib POST untuk file upload
    delete_foto: false // Opsi hapus foto
  });

  // --- State Lokal HANYA untuk UI (TETAP SAMA) ---
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [preview, setPreview] = useState(
    user.path_gambar || "https://via.placeholder.com/177/3a2323/FFFFFF?text=P"
  );

  // --- LOGIKA BARU: Update handler agar pakai setData ---
  const handleProfileImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setData('foto', file); // <-- BARU: Simpan file ke form Inertia
      setData('delete_foto', false); 
      setPreview(URL.createObjectURL(file)); // Tetap untuk preview
    }
  };

  const handleDeleteProfileImage = () => {
    setData('foto', null); // <-- BARU: Hapus file dari form Inertia
    setData('delete_foto', true); // <-- KIRIM PERINTAH HAPUS
    setPreview("https://via.placeholder.com/177/3a2323/FFFFFF?text=P");
    // Reset input file
    const fileInput = document.getElementById('foto-input');
    if(fileInput) fileInput.value = '';
  };

  // --- LOGIKA BARU: Submit ke Backend ---
  const handleSaveChanges = (event) => {
    event.preventDefault();
    // Kirim data ke rute '/admin/akun'
    post('/admin/profil/update', {
        preserveScroll: true,
        onSuccess: () => {
            // Hapus isian password setelah sukses
            reset('old_password', 'new_password', 'new_password_confirmation');
            // Reset file input
            const fileInput = document.getElementById('foto-input');
            if(fileInput) fileInput.value = '';
            // Reset 'delete_foto' flag setelah sukses
            setData('delete_foto', false);
        },
    });
  };

  // --- LOGIKA BARU: Cleanup Blob URL ---
  useEffect(() => {
    const blobUrl = preview && preview.startsWith('blob:');
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Sisa UI Anda (TETAP SAMA)
  const navigationButtons = [
    {
      id: "account-page",
      label: "Halaman Akun",
      icon: <BookUser className="!relative !w-[21px] !h-[21px]" color="white" />,
      bgColor: "bg-blue-600",
      opacity: "",
    },
    {
      id: "login-page",
      label: "Halaman Login",
      icon: <LogIn className="relative w-[19px] h-[21px]" color="white" />,
      bgColor: "bg-blue-600",
      opacity: "opacity-75",
    },
  ];

  const customColors = {
    primary: '#3B82F6',
    warning: '#F97316',
  };

  return (
    <div className="bg-gray-100 w-full min-h-screen flex justify-center p-6 font-sans">
      <Head title="Pengaturan Akun" /> {/* <-- BARU: Title halaman */}

      <div className="grid w-full max-w-7xl h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-2.5">
        
        {/* === HEADER (TETAP SAMA) === */}
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
                  <span className="text-[#000000bf]">Pengaturan</span>
                  <span className="text-black"> / Akun</span>
                </p>
              </div>
            </nav>
          </div>
          <hr className="relative w-full border-black border-t" />
        </header>

        {/* === MAIN (Ada penambahan Flash Message) === */}
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
                  style={{ backgroundColor: customColors.primary }}
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
                >
                  <LogOut className="relative w-[23px] h-[21px]" />
                  <span className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                    Log Out
                  </span>
                </button>
              </div>
            </div>
          </nav>
          
          {/* === BARU: FLASH MESSAGE (Pesan Sukses/Error) === */}
          {flash.success && (
            <div className="p-4 w-full bg-green-100 text-green-700 border border-green-300 rounded-xl">
              {flash.success}
            </div>
          )}
          
          {/* Tag <form> harus membungkus KEDUA kolom (kiri & kanan) */}
          <form onSubmit={handleSaveChanges} className="flex flex-col lg:flex-row items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
            
            {/* === KIRI: Gambar Profil (Ada penambahan Error Message) === */}
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
                  preview
                    ? { backgroundImage: `url(${preview})` }
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
                  Gambar yang dikirim harus berukuran kurang lebih dari 1 MB
                  dengan resolusi max 500 x 500 px, hanya support format foto:
                  .png, .jpeg, .jpg, dan .gif
                </p>
              </div>

              {/* === BARU: Input Error untuk 'foto' === */}
              {formErrors.foto && (
                  <p className="w-full text-sm text-red-600">{formErrors.foto}</p>
              )}

              <div className="flex items-center gap-[15px] relative self-stretch w-full">
                <label className="flex items-center justify-center gap-2.5 px-3 py-3 relative flex-1 self-stretch grow bg-blue-600 text-white rounded-xl overflow-hidden cursor-pointer">
                  <input
                    type="file"
                    id="foto-input" // Tambahkan ID
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

            {/* === KANAN: Form Akun (Input disinkronkan) === */}
            <section className="flex flex-col items-start gap-[15px] p-5 relative flex-1 grow bg-white rounded-xl border border-solid border-black shadow-sm">
              <div className="relative self-stretch w-full h-[29px]">
                <h2 className="absolute top-[calc(50.00%_-_14px)] left-0 w-[285px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xl tracking-[0] leading-[normal]">
                  Akun
                </h2>
                <hr className="absolute top-7 left-0 w-full border-black border-t" />
              </div>

              {/* Bagian dalam form, tidak perlu tag <form> lagi */}
              {/* Tag <form> sudah ada di luar membungkus 2 kolom */}
              <div className="flex flex-col items-start gap-[15px] relative self-stretch w-full flex-[0_0_auto]">
                
                {/* --- Nama Pengguna (DIBUAT DISABLED) --- */}
                <div className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    htmlFor="username"
                    className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xs tracking-[0] leading-[normal]"
                  >
                    Nama pengguna
                  </label>
                  <div className="flex h-[54px] items-center gap-[13px] p-3 relative self-stretch w-full bg-gray-200 rounded-xl border border-solid border-black"> {/* BUAT ABU-ABU */}
                    <User
                      className="!relative !w-4 !h-4"
                      color="black"
                      opacity="0.45"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      id="username"
                      value={data.username} // <-- BARU: Dari useForm (user prop)
                      disabled // <-- BARU: Dibuat disabled
                      className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-gray-600 text-[15.4px] tracking-[0] leading-[normal] bg-transparent border-none outline-none cursor-not-allowed"
                      aria-label="Username (tidak bisa diubah)"
                    />
                  </div>
                </div>

                {/* --- Email Pengguna (TETAP DISABLED) --- */}
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
                      value={user.email || 'email-tidak-tersedia@sistem.com'} // <-- BARU: dari user prop (atau placeholder)
                      disabled
                      className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-gray-600 text-[15.4px] tracking-[0] leading-[normal] bg-transparent cursor-not-allowed border-none outline-none"
                      aria-label="Email (disabled)"
                    />
                  </div>
                </div>

                {/* --- Password Lama (DIBUAT BISA DIISI) --- */}
                <div className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    htmlFor="old-password"
                    className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xs tracking-[0] leading-[normal]"
                  >
                    Password lama
                  </label>
                  <div className="flex h-[54px] items-start gap-3.5 relative self-stretch w-full">
                    <div className="flex-1 self-stretch grow bg-white flex items-center gap-[13px] p-3 relative rounded-xl border border-solid border-black"> {/* GANTI JADI PUTIH */}
                      <IconComponentNode
                        className="!relative !w-[19px] !h-[19px] !aspect-[1]"
                        aria-hidden="true"
                      />
                      <input
                        type={showOldPassword ? "text" : "password"}
                        id="old-password"
                        value={data.old_password} // <-- BARU: dari useForm
                        onChange={(e) => setData('old_password', e.target.value)} // <-- BARU: pakai setData
                        placeholder="Masukkan password lama..." // <-- BARU: Tambah placeholder
                        className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[15.4px] tracking-[0] leading-[normal] bg-transparent border-none outline-none placeholder:text-[#00000080]"
                        aria-label="Old password"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="flex flex-col w-[54px] h-[54px] items-center justify-center gap-2.5 p-[11px] relative bg-blue-600 text-white rounded-xl border border-solid border-black"
                      aria-label={showOldPassword ? "Hide old password" : "Show old password"}
                    >
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
                  {/* === BARU: Input Error untuk 'old_password' === */}
                  {formErrors.old_password && (
                      <p className="w-full text-sm text-red-600">{formErrors.old_password}</p>
                  )}
                </div>

                {/* --- Password Baru & Konfirmasi (Dihubungkan ke useForm) --- */}
                <div className="flex flex-col md:flex-row items-start gap-[15px] relative self-stretch w-full flex-[0_0_auto]">
                  {/* Password Baru */}
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
                        value={data.new_password} // <-- BARU: dari useForm
                        onChange={(e) => setData('new_password', e.target.value)} // <-- BARU: pakai setData
                        placeholder="Masukkan password yang baru..."
                        className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-[#00000080] text-[15.4px] tracking-[0] leading-[normal] bg-transparent placeholder:text-[#00000080] border-none outline-none"
                        aria-label="New password"
                      />
                    </div>
                    {/* === BARU: Input Error untuk 'new_password' === */}
                    {formErrors.new_password && (
                        <p className="w-full text-sm text-red-600">{formErrors.new_password}</p>
                    )}
                  </div>
                  
                  {/* Konfirmasi Password */}
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
                        value={data.new_password_confirmation} // <-- BARU: dari useForm
                        onChange={(e) => setData('new_password_confirmation', e.target.value)} // <-- BARU: pakai setData
                        placeholder="Konfirmasi password yang baru..."
                        className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-[#00000080] text-[15.4px] tracking-[0] leading-[normal] bg-transparent placeholder:text-[#00000080] border-none outline-none"
                        aria-label="Confirm new password"
                      />
                    </div>
                  </div>
                </div>

                {/* --- Tombol Simpan (Dihubungkan ke processing) --- */}
                <div className="inline-flex flex-col items-start gap-2.5 relative flex-[0_0_auto]">
                  <button
                    type="submit" // <-- BARU: Tipe 'submit'
                    className="w-[223px] justify-center flex-[0_0_auto] bg-blue-600 text-white flex items-center gap-[13px] p-3 relative rounded-xl border border-solid border-black disabled:bg-gray-400"
                    aria-label="Save changes"
                    disabled={processing} // <-- BARU: Dibuat disabled saat loading
                  >
                    <Icon1
                      className="!relative !w-[17px] !h-[17px] !aspect-[1]"
                      aria-hidden="true"
                    />
                    <span className="relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[15.4px] tracking-[0] leading-[normal]">
                      {processing ? 'Menyimpan...' : 'Simpan'} {/* <-- BARU: Teks dinamis */}
                    </span>
                  </button>
                  <a
                    href="#contact-admin"
                    className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[11.8px] tracking-[0] leading-[normal] underline whitespace-nowrap"
                  >
                    Ada masalah? hubungi admin
                  </a>
                </div>
              </div>
            </section>
          </form> {/* === End Form === */}
        </main>

        {/* === FOOTER (TETAP SAMA) === */}
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
}

// Hapus 'export default AdminSettingAkun' jika sudah ada di atas
// Pastikan hanya ada satu default export