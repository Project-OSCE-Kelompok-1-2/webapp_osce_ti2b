import React from 'react';
import { Head } from '@inertiajs/react';

export default function Index({ stases = [] }) {
  return (
    <div className="p-6">
      <Head title="Stase" />
      <h1 className="text-2xl font-semibold mb-4">Menu Stase</h1>

      <div className="mb-4">
        <button className="btn">Tambah Stase</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">No</th>
              <th className="px-4 py-2 text-left">Nama Rubrik</th>
              <th className="px-4 py-2 text-left">Nama Penguji</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {stases.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center">Belum ada data.</td>
              </tr>
            ) : (
              stases.map((s, i) => (
                <tr key={s.id} className="border-b">
                  <td className="px-4 py-2 align-top">{i + 1}</td>
                  <td className="px-4 py-2 align-top">{s.nama_rubrik}</td>
                  <td className="px-4 py-2 align-top">{s.nama_pengujii}</td>
                  <td className="px-4 py-2 align-top">
                    {/* contoh tombol edit/delete */}
                    <button className="mr-2">Edit</button>
                    <button>Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
