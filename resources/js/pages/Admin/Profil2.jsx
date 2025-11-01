import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

// 'user' adalah prop yang dikirim dari controller 'show_profile'
export default function Profil({ auth, user }) {
    const { flash, errors } = usePage().props;

    // --- SATU useForm untuk SEMUA data ---
    const { data, setData, post, processing, errors: formErrors, reset } = useForm({
        username: user.username || '',
        foto: null, // Input file
        old_password: '',
        new_password: '',
        new_password_confirmation: '',
        _method: 'POST' // Wajib POST untuk file upload
    });

    const [preview, setPreview] = useState(user.path_gambar || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('foto', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // --- SATU fungsi submit ---
    const submitAkun = (e) => {
        e.preventDefault();
        
        // Submit ke URL rute baru kita ('/admin/akun')
        post('/admin/akun', {
            preserveScroll: true,
            onSuccess: () => {
                // Hapus isian password setelah sukses
                reset('old_password', 'new_password', 'new_password_confirmation');
                // Hapus file dari state form
                setData('foto', null); 
                // Kosongkan value input file secara manual
                const fileInput = document.getElementById('foto-input');
                if (fileInput) fileInput.value = '';
            },
        });
    };

    useEffect(() => {
        // Cleanup blob URL
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    // --- Helper untuk styling input (agar rapi) ---
    const inputClassName = "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500";
    const labelClassName = "block text-sm font-medium text-gray-700";

    return (
        // Menggunakan React Fragment (<>) sebagai pembungkus
        <>
            <Head title="Pengaturan Akun" />
            
            {/* CATATAN: 
              'Layout' Anda (sidebar, header) tidak ada di sini
              karena Anda memintanya dihapus.
            */}

            {/* --- Konten Halaman --- */}
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                
                {/* Tampilkan pesan sukses dari controller */}
                {flash.success && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">
                        {flash.success}
                    </div>
                )}

                {/* --- Form Utama (Membungkus Semuanya) --- */}
                <form onSubmit={submitAkun} className="space-y-6">

                    {/* --- Grid Layout 2 Kolom --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* --- Kolom 1: Gambar Profil --- */}
                        <div className="md:col-span-1 space-y-4">
                            <div className="p-4 bg-white shadow sm:rounded-lg">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Gambar Profil
                                </h3>
                                
                                {/* Preview Gambar */}
                                <div className="mt-4 flex justify-center">
                                    <img 
                                        src={preview || `https://placehold.co/500x500/EBF4FF/7F9CF5?text=${user.username.charAt(0)}`}
                                        alt="Preview"
                                        className="h-40 w-40 rounded-full object-cover"
                                    />
                                </div>

                                {/* Perhatian Box */}
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                                    <p className="text-xs font-semibold">Perhatian!</p>
                                    <p className="text-xs">
                                        Gambar yang dikirim harus berukuran kurang lebih dari 1 MB dengan resolusi max 500x500 px, hanya support format foto: .png, .jpg, .dan .gif
                                    </p>
                                </div>

                                {/* Tombol Upload */}
                                <input
                                    id="foto-input"
                                    type="file"
                                    className="hidden" // Sembunyikan input asli
                                    onChange={handleFileChange}
                                    accept="image/png, image/jpeg, image/gif"
                                />
                                <label 
                                    htmlFor="foto-input"
                                    className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                >
                                    Upload gambar profil
                                </label>
                                {formErrors.foto && <p className="mt-2 text-sm text-red-600">{formErrors.foto}</p>}
                            </div>
                        </div>

                        {/* --- Kolom 2: Akun --- */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="p-4 bg-white shadow sm:rounded-lg">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Akun
                                </h3>
                                <div className="mt-4 space-y-4">
                                    {/* Nama pengguna */}
                                    <div>
                                        <label htmlFor="username" className={labelClassName}>
                                            Nama pengguna
                                        </label>
                                        <input
                                            id="username"
                                            type="text"
                                            className={inputClassName}
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value)}
                                            required
                                        />
                                        {formErrors.username && <p className="mt-2 text-sm text-red-600">{formErrors.username}</p>}
                                    </div>

                                    {/* Email pengguna (Disabled) */}
                                    {/* CATATAN: Model Pengguna.php Anda tidak punya 'email'.
                                      Jika 'user.email' tidak ada, field ini akan kosong.
                                      Ini HANYA untuk tampilan, tidak akan disubmit.
                                    */}
                                    <div>
                                        <label htmlFor="email" className={labelClassName}>
                                            Email pengguna
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            className={inputClassName + " bg-gray-100"}
                                            value={user.email || 'email-tidak-ada-di-model'}
                                            disabled 
                                        />
                                    </div>
                                    
                                    {/* Password lama */}
                                    <div>
                                        <label htmlFor="old_password" className={labelClassName}>
                                            Password lama
                                        </label>
                                        <input
                                            id="old_password"
                                            type="password"
                                            className={inputClassName}
                                            value={data.old_password}
                                            onChange={(e) => setData('old_password', e.target.value)}
                                            placeholder="Masukkan password lama..."
                                        />
                                        {formErrors.old_password && <p className="mt-2 text-sm text-red-600">{formErrors.old_password}</p>}
                                    </div>

                                    {/* Password baru */}
                                    <div>
                                        <label htmlFor="new_password" className={labelClassName}>
                                            Password baru
                                        </label>
                                        <input
                                            id="new_password"
                                            type="password"
                                            className={inputClassName}
                                            value={data.new_password}
                                            onChange={(e) => setData('new_password', e.target.value)}
                                            placeholder="Masukkan password yang baru..."
                                        />
                                        {formErrors.new_password && <p className="mt-2 text-sm text-red-600">{formErrors.new_password}</p>}
                                    </div>

                                    {/* Konfirmasi password baru */}
                                    <div>
                                        <label htmlFor="new_password_confirmation" className={labelClassName}>
                                            Konfirmasi password baru
                                        </label>
                                        <input
                                            id="new_password_confirmation"
                                            type="password"
                                            className={inputClassName}
                                            value={data.new_password_confirmation}
                                            onChange={(e) => setData('new_password_confirmation', e.target.value)}
                                            placeholder="Konfirmasi password baru..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Simpan (di luar box Akun tapi di dalam form) */}
                            <div className="flex justify-start">
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
                                    disabled={processing}
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </div>
                        
                    </div> {/* End Grid */}
                </form> {/* End Form */}
            </div> {/* End Konten Halaman */}
        </>
    );
}

