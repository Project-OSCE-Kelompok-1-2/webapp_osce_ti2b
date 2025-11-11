import { useForm } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Login() {
    const [showPwd, setShowPwd] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        username: "",
        password: "",
    });

    const { flash } = usePage().props;

    const onSubmit = (e) => {
        e.preventDefault();

        if (!data.username || !data.password) {
            alert("isi semua field");
            return;
        }

        alert("anda mengirimkan post");
        console.log(data.username, data.password);
        post("/login");
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 flex items-start md:items-center justify-center p-4">
            {/* frame abu-abu seperti wireframe */}
            <div className="w-full max-w-md ">
                <div className="rounded-xl border border-slate-500 bg-white shadow-sm px-8 py-8 md:py-10">
                    {/* Logo bulat */}
                    <div className="mx-auto w-20 h-20 rounded-full bg-slate-900" />

                    {/* Heading */}
                    <h1 className="mt-4 text-center text-2xl font-bold tracking-tight">
                        MOSAIC
                    </h1>
                    <p className="text-center text-lm text-slate-700">
                        Website OSCE [Nama fakultas]
                    </p>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="mt-8 space-y-4">
                        {/* Username */}
                        <label className="block">
                            <span className="sr-only">Username</span>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
                                    <div className="w-4 h-4 rounded-full bg-slate-300" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    onChange={(evt) => {
                                        setData("username", evt.target.value);
                                        console.log(evt.target.value);
                                    }}
                                    className="w-full rounded-md border border-slate-900 bg-white px-10 py-2.5 text-sm outline-none ring-0 placeholder:text-slate-500 focus:border-slate-500"
                                />
                            </div>
                        </label>

                        {/* Password + toggle show */}
                        <label className="block">
                            <span className="sr-only">Password</span>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
                                    <div className="w-4 h-4 rounded-full bg-slate-300" />
                                </div>
                                <input
                                    placeholder="Password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="w-full rounded-md border border-slate-900 bg-white px-10 py-2.5 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-500 pr-14"
                                />
                                {/* toggle kotak bundar di kanan (meniru switch di wireframe) */}
                                <button
                                    type="button"
                                    aria-label="Tampilkan password"
                                    onClick={() => setShowPwd((v) => !v)}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg border ${
                                        showPwd ? "bg-slate-900" : "bg-white"
                                    } flex items-center justify-center`}
                                >
                                    <span
                                        className={`block h-4 w-4 rounded-full ${
                                            showPwd
                                                ? "bg-white"
                                                : "bg-slate-300"
                                        }`}
                                    />
                                </button>
                            </div>
                        </label>

                        {/* Button Login */}
                        <div className="flex justify-center">
                            <button className="mt-2 w-3/5 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 active:scale-[.99]">
                                Login
                            </button>
                        </div>
                    </form>

                    {/* Bantuan admin */}
                    <div className="mt-3 text-center text-[11px]">
                        Ada masalah?{" "}
                        <a href="#" className="underline">
                            hubungi admin
                        </a>
                    </div>

                    {flash.error && <p className="text-sm">{flash.error}</p>}
                </div>
            </div>
        </div>
    );
}