import React, { useState, useRef } from 'react';
// import { Head, useForm, router } from '@inertiajs/react'; // <-- Hapus komentar jika menggunakan Inertia
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // <-- Impor layout utama Anda

// --- Mock untuk useForm dan router (untuk demo) ---
const useForm = (initialData) => {
    const [data, setData] = useState(initialData);
    return {
        data,
        setData: (key, value) => setData(prev => ({ ...prev, [key]: value })),
        post: (url, options) => {
            console.log("Form posted to:", url, data);
            options.onSuccess && options.onSuccess();
            options.onFinish && options.onFinish();
        },
        reset: (...keys) => {
            const newData = { ...data };
            keys.forEach(key => {
                newData[key] = initialData[key];
            });
            setData(newData);
        },
        processing: false,
        errors: {},
    };
};
const router = {
    post: (url, data, options) => {
        console.log("Router POST to:", url, data);
        alert("Foto Profil Diperbarui! (Mock)");
        options.onSuccess && options.onSuccess();
        options.onFinish && options.onFinish();
    },
    delete: (url, options) => {
        console.log("Router DELETE to:", url);
        alert("Foto Profil Dihapus! (Mock)");
        options.onSuccess && options.onSuccess();
    }
};
// Komponen Head mock
const Head = ({ title }) => {
    React.useEffect(() => {
        document.title = title;
    }, [title]);
    return null;
};
// ----------------------------------------------------


// Ikon dari Lucide React
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    UploadCloud,
    Trash2,
    AlertCircle,    // Menggunakan AlertCircle kembali sesuai gambar
    LogOut,         // Ikon untuk tombol Log Out
    BookUser,       // Ikon untuk Halaman Akun
    LogIn,          // Ikon untuk Halaman Login
    ArrowLeft,      // Ikon untuk Header
} from 'lucide-react';

// --- MOCK DATA ---
// Di aplikasi nyata, 'auth' akan dikirim sebagai prop dari Laravel
const mockAuth = {
    user: {
        name: 'Admin1234',
        email: 'admin1234@gmail.com',
        // Menggunakan latar belakang gelap untuk placeholder foto profil
        profile_photo_url: 'https://via.placeholder.com/150/333333/FFFFFF?text=P',
    }
};
// -----------------

// Komponen Input Kustom untuk Tailwind (DRY)
const InputLabel = ({ value, htmlFor, className = '', ...props }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>
        {value}
    </label>
);

const TextInput = React.forwardRef(({ type = 'text', className = '', ...props }, ref) => (
    <input
        {...props}
        type={type}
        ref={ref}
        className={`block w-full border-gray-500 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${className}`} // text-sm untuk ukuran font standar // Diubah ke border-gray-500
    />
));

const PrimaryButton = ({ className = '', disabled, children, ...props }) => (
    <button
        {...props}
        className={`inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 ${disabled && 'opacity-25'
            } ${className}`}
        disabled={disabled}
    >
        {children}
    </button>
);

const SecondaryButton = ({ className = '', disabled, children, ...props }) => (
    <button
        {...props}
        className={`inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-500 rounded-md font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150 ${disabled && 'opacity-25' // Diubah ke border-gray-500
            } ${className}`}
        disabled={disabled}
    >
        {children}
    </button>
);

const DangerButton = ({ className = '', disabled, children, ...props }) => (
    <button
        {...props}
        className={`inline-flex items-center justify-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150 ${disabled && 'opacity-25'
            } ${className}`}
        disabled={disabled}
    >
        {children}
    </button>
);


export default function PengaturanAkun({ auth = mockAuth }) { // Default ke mockAuth

    // === STATE ===
    const user = auth?.user || mockAuth.user; // <-- SAYA UBAH BARIS INI
    const [showPassword, setShowPassword] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoProcessing, setPhotoProcessing] = useState(false); // State loading untuk foto
    const photoInputRef = useRef();

    // === FORM 1: UNTUK INFO AKUN & PASSWORD ===
    const { data: infoData, setData: setInfoData, post: postInfo, processing: infoProcessing, errors: infoErrors, reset } = useForm({
        nama_pengguna: user.name,
        email_pengguna: user.email,
        password_old: '123456789', // Sesuai gambar
        password_new: '',
        password_confirmation: '',
    });

    // Handler untuk submit form info & password
    const submitInfoForm = (e) => {
        e.preventDefault();
        // Ganti 'route('...'))' dengan URL rute Laravel Anda
        // postInfo(route('profile.info.update'), {
        //     onSuccess: () => reset('password_old', 'password_new', 'password_confirmation'),
        // });
        console.log("Data Info & Password Dikirim:", infoData);
        alert("Data Akun Disimpan! (Cek Console)");
        // Reset password fields setelah submit
        reset('password_old', 'password_new', 'password_confirmation');
    };

    // === LOGIKA FOTO PROFIL ===

    // 1. Handler untuk tombol "Upload gambar profil"
    const triggerPhotoUpload = () => {
        photoInputRef.current.click();
    };

    // 2. Handler saat file foto dipilih (auto-submit)
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Tampilkan preview
        setPhotoPreview(URL.createObjectURL(file));
        setPhotoProcessing(true);

        // Kirim data menggunakan router.post
        // Ganti 'route('...'))' dengan URL rute Laravel Anda
        router.post('profile.photo.update', {
            profile_picture: file, // Nama key harus sesuai dengan backend
        }, {
            forceFormData: true, // WAJIB untuk file upload
            onSuccess: () => {
                console.log("Foto profil berhasil di-upload!");
                setPhotoPreview(null); // Hapus preview, biarkan data 'auth' baru yang me-render
            },
            onError: (errors) => {
                console.error("Error upload foto:", errors);
                setPhotoPreview(null); // Hapus preview jika gagal
            },
            onFinish: () => {
                setPhotoProcessing(false); // Hentikan loading
                photoInputRef.current.value = null; // Reset input file
            }
        });
    };

    // 3. Handler untuk hapus foto
    const deletePhoto = () => {
        // Ganti 'route('...'))' dengan URL rute Laravel Anda
        router.delete('profile.photo.delete', {
            preserveScroll: true,
            onSuccess: () => setPhotoPreview(null),
        });
        console.log("Hapus foto...");
    }


    return (
        // <AuthenticatedLayout // <-- Buka komentar ini dan bungkus semuanya
        //     header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pengaturan / Akun</h2>}
        // >
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <Head title="Pengaturan Akun" />

            {/* === HEADER / NAVBAR === */}
            <header className="bg-white shadow-sm border-b border-gray-900"> {/* Diubah ke border-gray-900 */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Kiri: Judul Halaman */}
                        <div className="flex items-center">
                            <button className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 text-gray-700">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <span className="ml-2 font-semibold text-lg text-gray-800">
                                Pengaturan / Akun
                            </span>
                        </div>

                        {/* Kanan: Tombol Log Out */}
                        <div>
                            <DangerButton className="flex items-center text-sm px-3 py-1.5">
                                <LogOut className="h-4 w-4 mr-1.5" />
                                Log Out
                            </DangerButton>
                        </div>
                    </div>
                </div>
            </header>

            {/* === KONTEN UTAMA === */}
            <main className="flex-grow">
                <div className="py-8"> {/* Padding vertikal lebih kecil */}
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                        {/* === BAGIAN NAVIGASI === */}
                        {/* Menghilangkan judul "Navigasi" agar lebih mirip gambar */}
                        <div className="bg-white shadow-md border border-gray-900 rounded-md p-4"> {/* Padding dan border lebih kecil */} {/* Diubah ke border-gray-900 */}
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Navigasi</h3> {/* Judul navigasi kecil */}
                            <div className="flex flex-wrap gap-2"> {/* Gap lebih kecil */}
                                <PrimaryButton className="flex-1 min-w-0 md:flex-none text-sm px-3 py-1.5"> {/* Ukuran tombol lebih kecil */}
                                    <BookUser className="h-4 w-4 mr-1.5" />
                                    Halaman Akun
                                </PrimaryButton>
                                <SecondaryButton className="flex-1 min-w-0 md:flex-none text-sm px-3 py-1.5"> {/* Ukuran tombol lebih kecil */}
                                    <LogIn className="h-4 w-4 mr-1.5" />
                                    Halaman Login
                                </SecondaryButton>
                            </div>
                        </div>

                        {/* === KONTEN PENGATURAN (Grid) === */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* === KOLOM KIRI: GAMBAR PROFIL === */}
                            <div className="lg:col-span-1 bg-white shadow-md border border-gray-900 rounded-md p-6 h-fit"> {/* Diubah ke border-gray-900 */}
                                <h3 className="text-base font-semibold border-b border-gray-900 pb-3"> {/* Diubah ke border-gray-900 */}
                                    Gambar Profil
                                </h3>

                                <div className="mt-4 flex justify-center"> {/* Margin top lebih kecil */}
                                    <img
                                        src={photoPreview || user.profile_photo_url}
                                        alt="Gambar Profil"
                                        className="h-32 w-32 rounded-full object-cover border border-gray-900 bg-gray-200" // Menambahkan border pada gambar profil // Diubah ke border-gray-900
                                    />
                                </div>

                                {/* Alert Box (Merah) */}
                                <div className="mt-4 rounded-md bg-red-50 p-3 border border-red-300"> {/* Padding dan warna lebih cerah */} {/* Border disesuaikan */}
                                    <div className="flex">
                                        <div className="flex-shrink-0 mt-0.5"> {/* Menyesuaikan posisi ikon */}
                                            <AlertCircle className="h-4 w-4 text-red-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-2"> {/* Margin lebih kecil */}
                                            <h3 className="text-xs font-medium text-red-800">Perhatian!</h3> {/* Ukuran font lebih kecil */}
                                            <div className="mt-1 text-xs text-red-700"> {/* Ukuran font lebih kecil */}
                                                <p>Gambar yang dikirim harus berukuran kurang lebih dari 1 MB dengan resolusi max 500 x 500 px, hanya support format foto: .png, .jpeg, .jpg, dan .gif</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Input file tersembunyi */}
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={photoInputRef}
                                    onChange={handlePhotoChange}
                                    accept="image/*"
                                />

                                <div className="mt-4 flex gap-2"> {/* Margin top dan gap lebih kecil */}
                                    <PrimaryButton
                                        className="flex-1 text-xs px-3 py-1.5" // Ukuran tombol lebih kecil
                                        onClick={triggerPhotoUpload}
                                        disabled={photoProcessing}
                                    >
                                        <UploadCloud className="h-3.5 w-3.5 mr-1.5" /> {/* Ukuran ikon lebih kecil */}
                                        {photoProcessing ? 'Mengunggah...' : 'Upload gambar profil'}
                                    </PrimaryButton>
                                    <DangerButton
                                        className="p-1.5" // Ukuran tombol hapus lebih kecil dan kotak
                                        onClick={deletePhoto}
                                        disabled={photoProcessing}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" /> {/* Ukuran ikon lebih kecil */}
                                    </DangerButton>
                                </div>
                            </div>

                            {/* === KOLOM KANAN: AKUN === */}
                            <div className="lg:col-span-2 bg-white shadow-md border border-gray-900 rounded-md p-6"> {/* Diubah ke border-gray-900 */}
                                <h3 className="text-base font-semibold border-b border-gray-900 pb-3"> {/* Diubah ke border-gray-900 */}
                                    Akun
                                </h3>

                                <form onSubmit={submitInfoForm} className="mt-4 space-y-4"> {/* Margin top dan space-y lebih kecil */}
                                    {/* Nama Pengguna */}
                                    <div>
                                        <InputLabel htmlFor="nama_pengguna" value="Nama pengguna" className="mb-1" /> {/* Margin bottom lebih kecil */}
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-4 w-4 text-gray-400" /> {/* Ukuran ikon lebih kecil */}
                                            </div>
                                            <TextInput
                                                id="nama_pengguna"
                                                value={infoData.nama_pengguna}
                                                onChange={(e) => setInfoData('nama_pengguna', e.target.value)}
                                                className="pl-9 py-1.5" // Padding dan ukuran input lebih kecil
                                            />
                                        </div>
                                        {infoErrors.nama_pengguna && <p className="mt-1 text-xs text-red-600">{infoErrors.nama_pengguna}</p>}
                                    </div>

                                    {/* Email Pengguna */}
                                    <div>
                                        <InputLabel htmlFor="email_pengguna" value="Email pengguna" className="mb-1" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <TextInput
                                                id="email_pengguna"
                                                type="email"
                                                value={infoData.email_pengguna}
                                                onChange={(e) => setInfoData('email_pengguna', e.target.value)}
                                                className="pl-9 py-1.5 disabled:bg-gray-100 disabled:text-gray-500" // Padding dan ukuran input lebih kecil, warna teks disabled
                                                disabled // Sesuai gambar
                                            />
                                        </div>
                                        {infoErrors.email_pengguna && <p className="mt-1 text-xs text-red-600">{infoErrors.email_pengguna}</p>}
                                    </div>

                                    {/* Password Old */}
                                    <div>
                                        <InputLabel htmlFor="password_old" value="Password lama" className="mb-1" />
                                        {/* 1. Ubah div ini dari "relative" menjadi "flex" untuk mensejajarkan item */}
                                        <div className="flex items-center gap-2">
                                            
                                            {/* 2. Buat wrapper baru HANYA untuk input field, agar ikon gembok tetap di dalam */}
                                            <div className="relative w-full"> 
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="password_old"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={infoData.password_old}
                                                    onChange={(e) => setInfoData('password_old', e.target.value)}
                                                    className="pl-9 py-1.5" 
                                                    placeholder="Masukkan password lama"
                                                />
                                            </div>

                                            {/* 4. Pindahkan tombol toggle ke luar wrapper input */}
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="flex-shrink-0 bg-blue-600 text-white rounded-md p-2 flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {infoErrors.password_old && <p className="mt-1 text-xs text-red-600">{infoErrors.password_old}</p>}
                                    </div>

                                    {/* === Wrapper untuk Password Baru (Grid) === */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Password Baru */}
                                        <div>
                                            <InputLabel htmlFor="password_new" value="Password baru" className="mb-1" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="password_new"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={infoData.password_new}
                                                    onChange={(e) => setInfoData('password_new', e.target.value)}
                                                    className="pl-9 py-1.5"
                                                    placeholder="Masukkan password baru"
                                                />
                                            </div>
                                            {infoErrors.password_new && <p className="mt-1 text-xs text-red-600">{infoErrors.password_new}</p>}
                                        </div>
                                        
                                        {/* Konfirmasi Password Baru */}
                                        <div>
                                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi password baru" className="mb-1" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="password_confirmation"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={infoData.password_confirmation}
                                                    onChange={(e) => setInfoData('password_confirmation', e.target.value)}
                                                    className="pl-9 py-1.5"
                                                    placeholder="Konfirmasi password baru"
                                                />
                                            </div>
                                            {infoErrors.password_confirmation && <p className="mt-1 text-xs text-red-600">{infoErrors.password_confirmation}</p>}
                                        </div>
                                    </div>
                                    {/* === Akhir Wrapper Grid === */}


                                    {/* Perubahan di div bawah ini: dihapus "flex items-center justify-between" */}
                                    <div className="pt-4 border-t border-gray-900"> 
                                        <PrimaryButton
                                            type="submit"
                                            className="text-sm px-4 py-2" // Ukuran tombol standar, tanpa uppercase
                                            disabled={infoProcessing}
                                        >
                                            Simpan
                                        </PrimaryButton>

                                        {/* Tambahkan "block" dan "mt-3" (margin-top) agar link-nya pindah ke bawah tombol */}
                                        <a href="#" className="block mt-3 text-sm text-gray-500 hover:text-gray-700 hover:underline"> 
                                            Ada masalah? hubungi admin
                                        </a>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            {/* === FOOTER === */}
            <footer className="text-center py-3 bg-white border-t border-gray-900 text-gray-600 text-xs"> {/* Padding dan ukuran font lebih kecil */} {/* Diubah ke border-gray-900 */}
                Copyright Porem ipsum dolor sit ametPorem ipsum dolor sit amet
            </footer>
        </div>
        // </AuthenticatedLayout> // <-- Penutup layout
    );
}





