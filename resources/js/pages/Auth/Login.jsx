import React, { useState } from "react";
import { Eye, EyeOff, User, KeyRound } from "lucide-react";
// [UBAH] Impor hook yang diperlukan dari Inertia
import { useForm, usePage } from "@inertiajs/react";
import Os_button from "../../components/button.jsx";
import OsInput from "../../components/input.jsx";
import OsIcon from "../../components/icons.jsx";

export default function LoginMosaicPage() {
    // [BARU] Ambil error dari props yang dikirim controller
    const { errors } = usePage().props;

    // State untuk show/hide password tetap sama
    const [showPwd, setShowPwd] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // [UBAH] Ganti useState dengan useForm untuk data login
    const { data, setData, post, processing } = useForm({
        username: "",
        password: "",
    });

    //[UBAH] Fungsi onSubmit sekarang mengirim data ke backend
    const onSubmit = (e) => {
        e.preventDefault();
        // Kirim request POST ke URL '/login'
        post("/login");
    };

    return (
        <div className="min-h-screen w-screen flex bg-os-tertiary items-center justify-center p-8 m-0 sm:p-0">
            <div className="w-full h-full min-h-[519px] flex flex-col justify-between max-w-md border bg-os-white border-os-primary rounded-xl p-8">
                <form
                    onSubmit={onSubmit}
                    className="flex h-full flex-col gap-os-14 min-h-[450px] justify-around"
                >
                    {/* Logo bulat */}
                    <div>
                        <div className="mx-auto w-20 h-20 rounded-full bg-blue-300" />
                        <h1 className="mt-2 text-center text-2xl font-bold">
                            MOSAIC
                        </h1>
                        <p className="text-center text-sm text-slate-600">
                            Website OSCE | Fakultas Kedokteran
                        </p>
                    </div>


                    <div>
                        {/* Username */}
                        <div className="relative">
                            {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                <User className="w-4 h-4" />
                            </span> */}
                            <OsInput
                                label="Username"
                                type="text"
                                placeholder="Masukkan username anda..."
                                // 👇 [UBAH] Gunakan data dari useForm
                                value={data.username}
                                onChange={(e) =>
                                    setData("username", e.target.value)
                                }
                                // className="w-full border border-gray-700 rounded-md py-2 pl-9 pr-3 text-sm placeholder-slate-500 focus:outline-none focus:border-slate-600"
                            />
                        </div>

                        {errors.username && (
                            <div className="text-red-500 text-xs">
                                {errors.username}
                            </div>
                        )}

                        {/* Password */}
                        <div className="flex items-center gap-2 mt-os-12">
                            <div className="relative flex-grow">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    {/* <KeyRound className="w-4 h-4" /> */}
                                </span>
                                <OsInput
                                    label="Password"
                                    type={showPwd ? "text" : "password"}
                                    placeholder="Masukkan password anda..."
                                    // 👇 [UBAH] Gunakan data dari useForm
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    // className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-md text-sm focus:outline-none focus:border-gray-700"
                                />
                            </div>

                            {/* button jadi nggak bisa di ubah tipe password */}
                            <button

                                type="button"
                                onClick={() => setShowPwd((v) => !v)}
                                className="w-[48px] h-[48px] mt-5 flex items-center justify-center border rounded-xl bg-os-primary text-white hover:bg-gray-600"
                            >
                                {showPwd ? (
                                    // <EyeOff className="h-os-36" />
                                    <OsIcon name="EyeCrossed" className="h-4 os-icon-light " />

                                ) : (
                                    <OsIcon name="Eye" className="h-4 os-icon-light " />
                                )}
                            </button>
                        </div>
                        {/* 👇 [BARU] Tampilkan error validasi dari backend */}
                        {errors.password && (
                            <div className="text-red-500 text-xs">
                                {errors.password}
                            </div>
                        )}

                        {usePage().props.flash.error && (
                            <div className="text-red-500 text-xs">
                                {usePage().props.flash.error}
                            </div>
                        )}
                    </div>

                    {/* Tombol Login */}
                    <div>
                        <div className="flex justify-center">
                            <Os_button
                            name="primary"
                                type="submit"
                                // 👇 [UBAH] Tambahkan disabled saat loading
                                disabled={processing}
                                // className="w-3/5 btn-primary py-2 rounded-md text-sm font-semibold disabled:opacity-50"
                                className="min-w-[250px]"
                            >
                                {/* 👇 [UBAH] Ganti teks tombol saat loading */}
                                {processing ? "Loading..." : "Login"}
                            </Os_button>
                        </div>

                        {/* Link bantuan */}
                        <div className="text-center text-xs text-blue-600 mt-os-8">
                            <a
                                href="#"
                                className="underline hover:text-blue-800 transition-colors"
                            >
                                Ada masalah? Hubungi admin.
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
