// === FINISHED WITH PARALLAX ===

import React, { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import Os_button from "../../components/button.jsx";
import OsInput from "../../components/input.jsx";
import OsIcon from "../../components/icons.jsx";

export default function LoginMosaicPage() {
    const { errors, flash } = usePage().props;
    const [showPwd, setShowPwd] = useState(false);

    // === PARALLAX STATE ===
    const [offsetY, setOffsetY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffsetY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { data, setData, post, processing } = useForm({
        username: "",
        password: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <div className="relative min-h-screen w-screen overflow-hidden">
            {/* === PARALLAX BACKGROUND === */}
            <div
                className="absolute inset-0 bg-cover bg-no-repeat will-change-transform"
                style={{
                    backgroundImage: "url('/images/frontpolines.jpg')",
                    backgroundPosition: "bottom",
                    transform: `translateY(${offsetY * 0.25}px)`,
                }}
            />

            {/* === OVERLAYS === */}

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-200/60 to-blue-100/60" />

            {/* Blur */}
            <div className="absolute inset-0 backdrop-blur-[2px]" />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.15))]" />

            {/* Decorative Shapes */}
            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-blue-300/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-300/20 rounded-full blur-3xl" />

            {/* === CONTENT === */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-8 sm:p-0">
                <div className="w-full max-w-md">
                    <div className="min-h-[520px] flex flex-col justify-between bg-white/95 border border-os-primary rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
                        <form
                            onSubmit={onSubmit}
                            className="flex h-full flex-col justify-around gap-6"
                        >
                            {/* Header */}
                            <div className="text-center">
                                <div className="mx-auto w-20 h-20 rounded-full bg-blue-400 mb-3" />
                                <h1 className="text-2xl font-bold tracking-wide">
                                    MOSAIC
                                </h1>
                                <p className="text-sm text-slate-600">
                                    Website OSCE | Fakultas Kedokteran
                                </p>
                            </div>

                            {/* Form */}
                            <div>
                                <OsInput
                                    label="Username"
                                    type="text"
                                    placeholder="Masukkan username anda..."
                                    value={data.username}
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                />
                                {errors?.username && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.username}
                                    </p>
                                )}

                                <div className="flex items-end gap-2 mt-4">
                                    <div className="flex-grow">
                                        <OsInput
                                            label="Password"
                                            type={
                                                showPwd
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Masukkan password anda..."
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPwd((v) => !v)
                                        }
                                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-os-primary text-white hover:scale-105 transition shadow"
                                    >
                                        {showPwd ? (
                                            <OsIcon
                                                name="EyeCrossed"
                                                className="h-5 os-icon-light"
                                            />
                                        ) : (
                                            <OsIcon
                                                name="Eye"
                                                className="h-5 os-icon-light"
                                            />
                                        )}
                                    </button>
                                </div>

                                {errors?.password && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.password}
                                    </p>
                                )}

                                {flash?.error && (
                                    <p className="text-red-500 text-xs mt-2 text-center">
                                        {flash.error}
                                    </p>
                                )}
                            </div>

                            {/* Action */}
                            <div>
                                <div className="flex justify-center">
                                    <Os_button
                                        name="primary"
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[250px]"
                                    >
                                        {processing
                                            ? "Loading..."
                                            : "Login"}
                                    </Os_button>
                                </div>

                                <div className="text-center text-xs text-blue-600 mt-3">
                                    <a
                                        href="#"
                                        className="underline hover:text-blue-800 transition"
                                    >
                                        Ada masalah? Hubungi admin.
                                    </a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
