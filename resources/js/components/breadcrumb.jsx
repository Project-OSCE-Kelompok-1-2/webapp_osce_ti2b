import React from "react";
import { Home } from "lucide-react";

export default function OsBreadCrumb({ children, className = "" }) {
    const items = React.Children.toArray(children);

    return (
        <header className="relative row-[1_/_2] col-[1_/_2] w-full flex flex-col items-start gap-os-12" >
          <div className="flex items-center justify-between relative self-stretch w-full">

            {/* Tombol Home tetap tampil */}
            <a
              href="/admin/dashboard" // Menjadikan tombol ini link
              className="flex w-[46px] h-[46px] items-center justify-center relative bg-blue-600 text-white rounded-xl border border-solid border-blue-700 aspect-[1] hover:bg-blue-700 transition"
              aria-label="Home"
            >
              <Home className="relative w-[30px] h-[26px]" />
            </a>

            {/* Kotak judul utama */}
            <div className="relative flex-1 h-[46px] ml-4">
              <div className="w-full h-full flex items-center bg-white rounded-xl overflow-hidden border border-solid border-gray-300 shadow-inner">
                <h1 className=" ml-5 text-os-regular text-black tracking-[0] leading-[normal] whitespace-nowrap">
                  Beranda
                </h1>
              </div>
            </div>
          </div>

          <hr className="relative w-full border-os-black" />
        </header>
    );
}
