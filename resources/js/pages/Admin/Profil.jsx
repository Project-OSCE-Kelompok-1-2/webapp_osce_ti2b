import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Asumsikan Anda memiliki komponen Layout
// import Layout from '@/Layouts/AdminLayout'; 

export default function Profile({ user }) {
    
    // 1. MENGAMBIL PAGE (UNTUK FLASH MESSAGES & ERRORS)
    const { flash, errors } = usePage().props;

    // 2. STATE UNTUK PREVIEW FOTO
    const [photoPreview, setPhotoPreview] = useState(null);

    // 3. FORM UPDATE PROFIL
    const { data: profileData, setData: setProfileData, post: postProfile, processing: processingProfile, errors: profileErrors } = useForm({
        nama: user?.nama || '',
        foto: null, 
    });

    // 4. FORM UPDATE PASSWORD
    // Field 'new_password_confirmation' wajib ada untuk validasi 'confirmed'
    const { data: passwordData, setData: setPasswordData, post: postPassword, processing: processingPassword, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '', 
    });

    // 5. HELPER UNTUK MENAMPILKAN URL FOTO
    function getFotoUrl() {
        if (user?.foto) {
            // Memastikan path dimulai dengan / jika disimpan sebagai storage/...
            return `/${user.foto}`;
        }
        return 'https://via.placeholder.com/100/3182CE/FFFFFF?text=No+Foto';
    }

    // 6. FUNGSI HANDLER
    function handlePhotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        setProfileData('foto', file); 

        const reader = new FileReader();
        reader.onload = (event) => {
            setPhotoPreview(event.target.result);
        };
        reader.readAsDataURL(file);
    }

    function submitProfile(e) {
        e.preventDefault();
        postProfile(route('admin.profil.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setPhotoPreview(null); 
                const fileInput = document.getElementById('foto');
                if (fileInput) fileInput.value = null; 
            },
        });
    }

    function submitPassword(e) {
        e.preventDefault();
        // Route disesuaikan
        postPassword(route('admin.password.update'), {
            preserveScroll: true,
            onSuccess: () => resetPassword(), // Reset form password jika sukses
        });
    }

    // 7. RENDER JSX
    return (
        // <Layout> 
        <div className="container mx-auto p-8 font-sans">
            
            {/* ===== NOTIFIKASI SUKSES (flash.success) ===== */}
            <h3>Nanti di sini ada flash sukses</h3>
            {flash.success && (
                <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg shadow-md" role="alert">
                    <p className="font-bold">Berhasil!</p>
                    <p>{flash.success}</p>
                </div>
            )}
            
            {/* ===== NOTIFIKASI ERROR (flash.error) ===== */}
            {flash.error && (
                <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md" role="alert">
                    <p className="font-bold">Gagal!</p>
                    <p>{flash.error}</p>
                </div>
            )}
            
            {/* ====================================================== */}

            
            {/* ===== FORM UPDATE PROFIL ===== */}
            <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Update Profil</h2>
                
                <form onSubmit={submitProfile}>
                    
                    {/* Nama */}
                    <div className="mb-4">
                        <label htmlFor="nama" className="block text-sm font-semibold text-gray-600">Nama</label>
                        <input
                            type="text"
                            id="nama"
                            value={profileData.nama}
                            onChange={(e) => setProfileData('nama', e.target.value)}
                            className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${profileErrors.nama ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {profileErrors.nama && (
                            <div className="text-xs text-red-600 mt-1">{profileErrors.nama}</div>
                        )}
                    </div>

                    {/* Foto Profil (Baru) */}
                    <div className="mb-6">
                        <label htmlFor="foto" className="block text-sm font-semibold text-gray-600 mb-2">Foto Profil (Baru)</label>
                        
                        {/* Tampilkan Foto Saat Ini atau Preview */}
                        <div className="mt-2 flex items-center mb-3">
                            {photoPreview ? (
                                <span
                                    className="block h-24 w-24 rounded-full border-2 border-blue-500"
                                    style={{
                                        backgroundImage: `url('${photoPreview}')`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                    aria-label="New Photo Preview"
                                />
                            ) : (
                                <img src={getFotoUrl()} alt="Foto Profil Saat Ini" className="h-24 w-24 rounded-full object-cover border-2 border-gray-300" />
                            )}
                            <span className='ml-4 text-sm text-gray-500'>*Foto akan tersimpan setelah menekan tombol Simpan.</span>
                        </div>
                        
                        <input
                            type="file"
                            id="foto"
                            onChange={handlePhotoChange}
                            className={`mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer ${profileErrors.foto ? 'border-red-500' : ''}`}
                        />
                        {profileErrors.foto && (
                            <div className="text-xs text-red-600 mt-1">{profileErrors.foto}</div>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        disabled={processingProfile}
                        className="w-full px-4 py-2 mt-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 transition duration-150 ease-in-out"
                    >
                        {processingProfile ? 'Menyimpan...' : 'Simpan Profil'}
                    </button>
                </form>
            </div>

            {/* ===== FORM UPDATE PASSWORD ===== */}
            <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Update Password</h2>
                <form onSubmit={submitPassword}>
                    
                    {/* Password Lama */}
                    <div className="mb-4">
                        <label htmlFor="current_password" className="block text-sm font-semibold text-gray-600">Password Lama</label>
                        <input
                            type="password"
                            id="current_password"
                            value={passwordData.current_password}
                            onChange={(e) => setPasswordData('current_password', e.target.value)}
                            className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${passwordErrors.current_password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {/* Error validasi 422 (required) atau error dari controller (Password lama tidak sesuai) */}
                        {(passwordErrors.current_password || errors.current_password) && (
                            <div className="text-xs text-red-600 mt-1">
                                {passwordErrors.current_password || errors.current_password}
                            </div>
                        )}
                    </div>
                    
                    {/* Password Baru */}
                    <div className="mb-4">
                        <label htmlFor="new_password" className="block text-sm font-semibold text-gray-600">Password Baru</label>
                        <input
                            type="password"
                            id="new_password"
                            value={passwordData.new_password}
                            onChange={(e) => setPasswordData('new_password', e.target.value)}
                            className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${passwordErrors.new_password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                         {passwordErrors.new_password && (
                            <div className="text-xs text-red-600 mt-1">{passwordErrors.new_password}</div>
                        )}
                    </div>
                    
                    {/* Konfirmasi Password Baru */}
                    <div className="mb-6">
                        <label htmlFor="new_password_confirmation" className="block text-sm font-semibold text-gray-600">Konfirmasi Password Baru</label>
                        <input
                            type="password"
                            id="new_password_confirmation"
                            value={passwordData.new_password_confirmation}
                            onChange={(e) => setPasswordData('new_password_confirmation', e.target.value)}
                            className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${passwordErrors.new_password_confirmation ? 'border-red-500' : 'border-gray-300'}`}
                        />
                         {passwordErrors.new_password_confirmation && (
                            <div className="text-xs text-red-600 mt-1">{passwordErrors.new_password_confirmation}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processingPassword}
                        className="w-full px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 disabled:opacity-50 transition duration-150 ease-in-out"
                    >
                        {processingPassword ? 'Mengupdate...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
        // </Layout>
    );
}