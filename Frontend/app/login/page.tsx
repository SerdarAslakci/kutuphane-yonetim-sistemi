'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import toast from "react-hot-toast";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {

        if (e) e.preventDefault();
        setError('');
        setLoading(true);
        const toastId = toast.loading("Giriş işlemi yapılıyor.");

        try {
            await login({ email, password });

            toast.success("Giriş işlemi başarılıdır. Yönlendiriliyorsunuz...", { id : toastId});

            setTimeout(() =>{
                router.push('/');
            },1500);
        } catch (error: any) {
            console.error("Giriş İşlemi Başarısız: ", error.response.data);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                (typeof error.response?.data === 'string' ? error.response?.data : "İşlem başarısız.");

            if (errorMessage) {
                toast.error(errorMessage, { id: toastId });
            } else {
                toast.error("Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.", { id: toastId });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f3e5d0] relative">

            <div className="w-full max-w-md bg-[#f6dcb7] rounded-2xl shadow-xl shadow-[#b47b3c33] p-10 border border-[#c79f74]">
                <h1 className="text-3xl font-semibold mb-6 text-[#2f1b10]">
                    Kütüphane Sistemi Giriş
                </h1>
                <p className="text-sm text-[#5c4735] mb-4">
                    Henüz üye değil misiniz?{" "}
                    <a
                        href="/register"
                        className="font-semibold text-[#7a4c24] hover:text-[#5f391b]"
                    >
                        Hemen üye olun
                    </a>
                    .
                </p>
                <form className="space-y-4">
                    <div className="mt-2">
                        <label className="block text-sm font-semibold text-[#4a2f1c] mb-1">
                            E-posta
                        </label>
                        <input
                            type="email"
                            value={email}
                            placeholder={"ornek@gmail.com"}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border border-[#b2824b] px-3 py-2 text-sm bg-[#fff9f1] text-black placeholder:text-[#7a6a58] focus:outline-none focus:ring-2 focus:ring-[#a15c2f]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#4a2f1c] mb-1">
                            Şifre
                        </label>
                        <input
                            type="password"
                            value={password}
                            placeholder={"Parolanızı girin"}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-[#b2824b] px-3 py-2 text-sm bg-[#fff9f1] text-black placeholder:text-[#7a6a58] focus:outline-none focus:ring-2 focus:ring-[#a15c2f]"
                            required
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full inline-flex justify-center items-center rounded-md bg-[#7a4c24] px-4 py-2 text-sm font-semibold text-[#fdf3e6] hover:bg-[#5f391b] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </button>
                </form>
            </div>
        </div>
    );
}
