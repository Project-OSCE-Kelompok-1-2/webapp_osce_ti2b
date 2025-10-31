import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

// Ambil props errors, flash messages (success, error), dan data auth
export default function ProfilAdmin() {
  const { auth, errors } = usePage().props;
  // Flash message dari Laravel (Contoh: session('success'))
  const successMessage = usePage().props.flash?.success;
  const errorMessage = usePage().props.flash?.error;
  const successPasswordMessage = usePage().props.flash?.success_password;
  const errorPasswordMessage = usePage().props.flash?.error_password;
  
  const user = auth.user;
  // console.log(user) // Hilangkan console.log yang tidak perlu

  // --- FORM UPDATE PROFIL ---
  const { 
    data: profileData, 
    setData: setProfileData, 
    put: putProfile, 
    processing: processingProfile, 
    progress: profileProgress,
    reset: resetProfile,
    // errors: profileErrors, // Inertia sudah menyediakan errors dari usePage().props
  } = useForm({
    // Inisialisasi data dari user yang di-share dari controller
    nama: user?.nama || '', 
    foto: null, 
    // _method: 'PUT', // TIDAK PERLU lagi karena fungsi `put` dari useForm sudah otomatis menangani method spoofing.
  });

  // Fungsi submit profil
  const handleSubmitProfile = (e) => {
    e.preventDefault();
    
    // Panggil putProfile dan kirim ke route update profil
    // Inertia akan secara otomatis mendeteksi apakah ada file yang perlu diupload (multipart/form-data)
    putProfile(route('admin.profil.update'), { // Pastikan Anda menggunakan route yang benar
      onSuccess: () => {
        resetProfile('foto'); // Kosongkan input file setelah berhasil
      },
      // Hapus logika untuk testing success/error yang tidak diperlukan
      // preserveScroll: true, // Opsional: pertahankan posisi scroll
    });
  }

  // --- FORM UPDATE PASSWORD ---
  const { 
    data: passwordData, 
    setData: setPasswordData, 
    put: putPassword, 
    processing: processingPassword,
    reset: resetPassword
    // errors: passwordErrors, // Sama, Inertia sudah menyediakan errors
  } = useForm({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
    // _method: 'PUT', // TIDAK PERLU
  });
  
  // Fungsi submit password
  const handleSubmitPassword = (e) => {
    e.preventDefault();
    putPassword(route('admin.password.update'), {
      onSuccess: () => {
        resetPassword(); // Kosongkan semua field password
      },
      // preserveScroll: true, // Opsional
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Head title="Profil Admin" />

      {/* FORM UPDATE PROFIL */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Update Profil</h2>

        {/* Menampilkan Flash Message dari Laravel */}
        {successMessage && <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">✅ {successMessage}</div>}
        {errorMessage && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">❌ {errorMessage}</div>}

        <form onSubmit={handleSubmitProfile}>
          {/* Input Nama */}
          <div className="mb-4">
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              id="nama"
              type="text"
              value={profileData.nama} 
              onChange={e => setProfileData('nama', e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {/* Menggunakan errors dari usePage().props */}
            {errors.nama && <div className="text-sm text-red-600 mt-1">{errors.nama}</div>}
          </div>

          {/* Input Foto */}
          <div className="mb-4">
            <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">Foto Profil (Baru)</label>
            <input
              id="foto"
              type="file"
              // Penting: gunakan callback untuk setData file
              onChange={e => setProfileData('foto', e.target.files[0])}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            {errors.foto && <div className="text-sm text-red-600 mt-1">{errors.foto}</div>}
            
            {/* Indikator progress upload */}
            {profileProgress && profileProgress.percentage < 100 && ( // Tampilkan saat progress < 100
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${profileProgress.percentage}%` }}></div>
              </div>
            )}
          </div>

          <button type="submit" disabled={processingProfile} className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150">
            {processingProfile ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </form>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      {/* FORM UPDATE PASSWORD */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Update Password</h2>
        
        {/* Menampilkan Flash Message dari Laravel */}
        {successPasswordMessage && <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">✅ {successPasswordMessage}</div>}
        {errorPasswordMessage && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">❌ {errorPasswordMessage}</div>}

        <form onSubmit={handleSubmitPassword}>
          {/* Input Password Lama */}
          <div className="mb-4">
            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
            <input
              id="current_password"
              type="password"
              value={passwordData.current_password}
              onChange={e => setPasswordData('current_password', e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.current_password && <div className="text-sm text-red-600 mt-1">{errors.current_password}</div>}
          </div>

          {/* Input Password Baru */}
          <div className="mb-4">
            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input
              id="new_password"
              type="password"
              value={passwordData.new_password}
              onChange={e => setPasswordData('new_password', e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.new_password && <div className="text-sm text-red-600 mt-1">{errors.new_password}</div>}
          </div>

          {/* Input Konfirmasi Password Baru */}
          <div className="mb-4">
            <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
            <input
              id="new_password_confirmation"
              type="password"
              value={passwordData.new_password_confirmation}
              onChange={e => setPasswordData('new_password_confirmation', e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {/* Error konfirmasi akan ada di errors.new_password (dari validasi `confirmed`) */}
            {/* {errors.new_password_confirmation && <div className="text-sm text-red-600 mt-1">{errors.new_password_confirmation}</div>} */}
          </div>

          <button type="submit" disabled={processingPassword} className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150">
            {processingPassword ? 'Menyimpan...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}