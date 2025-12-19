import React from "react";
import { X, TriangleAlert, Save } from "lucide-react";

export default function SubmitConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      {/* Container Modal */}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-black animate-in fade-in zoom-in duration-200">
        
        {/* --- HEADER --- */}
        <div className="bg-[#3177C8] p-6 relative text-center">
          {/* Tombol Close (X) di Kiri Atas */}
          <button 
            onClick={onClose}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-1 rounded-full transition"
          >
            <X className="w-6 h-6" strokeWidth={3} />
          </button>
          
          {/* Judul */}
          <h2 className="text-white text-2xl font-bold">
            Apakah Anda sudah yakin?
          </h2>
        </div>

        {/* --- BODY --- */}
        <div className="p-6 flex flex-col gap-44 pb-12">
          
          {/* Kotak Peringatan Merah */}
          <div className="bg-[#E57373] bg-opacity-60 border border-black rounded-xl p-4 flex items-start gap-3">
            <div className="mt-1">
               <TriangleAlert className="w-5 h-5 text-black fill-transparent" />
            </div>
            <div className="text-black text-sm leading-relaxed">
              <span className="font-bold block mb-1">Perhatian!</span>
              Apakah Anda yakin untuk submit rubrik penilaian ini ? Perhatikan kembali data yang sudah Anda ubah.
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            onClick={onConfirm}
            className="w-full bg-[#1447E6] text-white py-4 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-blue-800 transition shadow-md"
          >
            <Save className="w-5 h-5" />
            Submit
          </button>

        </div>
      </div>
    </div>
  );
}