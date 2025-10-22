import React, { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // <-- Impor layout utama Anda

// Ikon dari Lucide React
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    UploadCloud,
    Trash2,
    AlertCircle
} from 'lucide-react';

// --- MOCK DATA ---
// Di aplikasi nyata, 'auth' akan dikirim sebagai prop dari Laravel
const mockAuth = {
    user: {
        name: 'Admin1234',
        email: 'admin1234@gmail.com',
        profile_photo_url: 'https://via.placeholder.com/150/000000/FFFFFF/?text=Profil',
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
        className={`block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
    />
));

const PrimaryButton = ({ className = '', disabled, children, ...props }) => (
    <button
        {...props}
        className={`inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 ${disabled && 'opacity-25'
            } ${className}`}
        disabled={disabled}
    >
        {children}
    </button>
);

const SecondaryButton = ({ className = '', disabled, children, ...props }) => (
    <button
        {...props}
        className={`inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150 ${disabled && 'opacity-25'
            } ${className}`}
        disabled={disabled}
    >
        {children}
    </button>
);

const DangerButton = ({ className = '', disabled, children, ...props }) => (
    <button
        {...props}
        className={`inline-flex items-center justify-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150 ${disabled && 'opacity-25'
            } ${className}`}
        disabled={disabled}
    >
        {children}
    </button>
);


export default function PengaturanAkun({ auth }) {
    
    // === STATE ===
    const user = auth.user || mockAuth.user;
    const [showPassword, setShowPassword] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoProcessing, setPhotoProcessing] = useState(false); // State loading untuk foto
    const photoInputRef = useRef();

    // === FORM 1: UNTUK INFO AKUN & PASSWORD ===
    // Menggunakan useForm dari Inertia
    const { data: infoData, setData: setInfoData, post: postInfo, processing: infoProcessing, errors: infoErrors, reset } = useForm({
        nama_pengguna: user.name,
        email_pengguna: user.email,
        password_old: '',
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
    // Untuk upload foto, lebih mudah menggunakan router.post agar bisa auto-submit
    // saat file dipilih, tanpa harus membungkusnya dalam <form> terpisah.
    
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
        router.post(route('profile.photo.update'), {
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
        // router.delete(route('profile.photo.delete'), {
        //     preserveScroll: true,
        //     onSuccess: () => setPhotoPreview(null),
        // });
        console.log("Hapus foto...");
        alert("Foto Dihapus! (Mock)");
    }


    return (
        // <AuthenticatedLayout // <-- Buka komentar ini dan bungkus semuanya
        //     header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pengaturan / Akun</h2>}
        // >
        <> {/* Hapus <></> jika sudah pakai AuthenticatedLayout */}
            <Head title="Pengaturan Akun" />

            {/* Konten Halaman */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800 px-4 sm:px-0">
                        Pengaturan / Akun
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* === KOLOM KIRI: PROFIL === */}
                        <div className="lg:col-span-1 bg-white shadow-md rounded-lg p-6 h-fit">
                            <h3 className="text-xl font-semibold border-b border-gray-200 pb-4">
                                Profile
                            </h3>

                            <div className="mt-6 flex justify-center">
                                <img
                                    src={photoPreview || user.profile_photo_url}
                                    alt="Gambar Profil"
                                    className="h-32 w-32 rounded-full object-cover"
                                />
                            </div>
                            
                            {/* Alert Box */}
                            <div className="mt-6 rounded-md bg-yellow-50 p-4 border border-yellow-200">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">Perhatian!</h3>
                                        <div className="mt-2 text-sm text-yellow-700">
                                            <p>Edit. Mota volupatun blora et velit, laboriun, ad aliquid nobis maitis.</p>
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

                            <div className="mt-6 flex gap-3">
                                <PrimaryButton
                                    className="flex-1"
                                    onClick={triggerPhotoUpload}
                                    disabled={photoProcessing}
                                >
                                    <UploadCloud className="h-4 w-4 mr-2" />
                                    {photoProcessing ? 'Mengunggah...' : 'Upload gambar profil'}
                                </PrimaryButton>
                                <DangerButton
                                    className="px-3" // Buat tombol lebih kecil
                                    onClick={deletePhoto}
                                    disabled={photoProcessing}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </DangerButton>
                            </div>
                        </div>

                        {/* === KOLOM KANAN: AKUN === */}
                        <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-xl font-semibold border-b border-gray-200 pb-4">
                                Account
                            </h3>
                            
                            <form onSubmit={submitInfoForm} className="mt-6 space-y-6">
                                {/* Nama Pengguna */}
                                <div>
                                    <InputLabel htmlFor="nama_pengguna" value="Nama pengguna" />
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="nama_pengguna"
                                            value={infoData.nama_pengguna}
                                            onChange={(e) => setInfoData('nama_pengguna', e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    {infoErrors.nama_pengguna && <p className="mt-2 text-sm text-red-600">{infoErrors.nama_pengguna}</p>}
                                </div>

                                {/* Email Pengguna */}
                                <div>
                                    <InputLabel htmlFor="email_pengguna" value="Email pengguna" />
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="email_pengguna"
                                            type="email"
                                            value={infoData.email_pengguna}
                                            onChange={(e) => setInfoData('email_pengguna', e.target.value)}
                                            className="pl-10 disabled:bg-gray-100"
                                            disabled // Sesuai gambar
                                        />
                                    </div>
                                    {infoErrors.email_pengguna && <p className="mt-2 text-sm text-red-600">{infoErrors.email_pengguna}</p>}
                                </div>

                                {/* Password Old */}
                                <div>
                                    <InputLabel htmlFor="password_old" value="Password old" />
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="password_old"
                                            type={showPassword ? 'text' : 'password'}
                                            value={infoData.password_old}
                                            onChange={(e) => setInfoData('password_old', e.target.value)}
                                            className="pl-10 pr-10"
                                            placeholder="Masukkan password lama"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {infoErrors.password_old && <p className="mt-2 text-sm text-red-600">{infoErrors.password_old}</p>}
                                </div>

                                {/* Password Baru */}
                                <div>
                                    <InputLabel htmlFor="password_new" value="Password baru" />
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="password_new"
                                            type={showPassword ? 'text' : 'password'}
                                            value={infoData.password_new}
                                            onChange={(e) => setInfoData('password_new', e.target.value)}
                                            className="pl-10"
                                            placeholder="Masukkan password baru"
                                        />
                                    </div>
                                    {infoErrors.password_new && <p className="mt-2 text-sm text-red-600">{infoErrors.password_new}</p>}
                                </div>
                                
                                {/* Konfirmasi Password Baru */}
                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi password baru" />
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="password_confirmation"
                                            type={showPassword ? 'text' : 'password'}
                                            value={infoData.password_confirmation}
                                            onChange={(e) => setInfoData('password_confirmation', e.target.value)}
                                            className="pl-10"
                                            placeholder="Konfirmasi password baru"
                                        />
                                    </div>
                                    {infoErrors.password_confirmation && <p className="mt-2 text-sm text-red-600">{infoErrors.password_confirmation}</p>}
                                </div>

                                <div className="flex items-center justify-between">
                                    <PrimaryButton 
                                        type="submit"
                                        className="bg-gray-800 hover:bg-gray-900 active:bg-gray-700 focus:ring-gray-500" // Override ke warna gelap
                                        disabled={infoProcessing}
                                    >
                                        {infoProcessing ? 'Menyimpan...' : 'Simpan'}
                                    </PrimaryButton>
                                    
                                    <a href="#" className="text-sm text-blue-600 hover:underline">
                                        Ada masalah? Hubungi admin
                                    </a>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        {/* </AuthenticatedLayout> // <-- Penutup layout */}
        </>
    );
}