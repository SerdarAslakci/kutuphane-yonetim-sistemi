"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/src/services/authService';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        dateOfBirth: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // --- PAROLA KONTROL MANTIĞI ---
    const password = formData.password;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isPasswordValid = hasUpperCase && hasNumber && hasSpecialChar;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'phoneNumber') {
            if (value === '' || /^\d+$/.test(value)) {
                setFormData({
                    ...formData,
                    [name]: value
                });
            }
            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const toastId = toast.loading("Kayıt işlemi başlatılıyor.")

        if (!isPasswordValid) {
            toast.error("Lütfen parola gereksinimlerini karşılayınız.", { id: toastId });
            return;
        }

        setLoading(true);

        try {
            await authService.register(formData);

            toast.success("Kayıt başarılı! Yönlendiriliyorsunuz...", { id : toastId});
            setTimeout(() =>{
                router.push('/login');
            },1000);
        } catch (error: any) {
            console.error("Kayit Basarisiz: ", error.response?.data);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                (typeof error.response?.data === 'string' ? error.response?.data : "İşlem başarısız.");

            if (errorMessage) {
                toast.error(errorMessage, { id: toastId });
            } else {
                toast.error("Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.", { id: toastId });
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f3e5d0] relative">
            <div className="w-full max-w-lg bg-[#f6dcb7] rounded-2xl shadow-xl shadow-[#b47b3c33] p-10 border border-[#c79f74] space-y-6">
                <div>
                    <h1 className="text-3xl font-semibold text-[#2f1b10]">
                        Kütüphaneye Üyelik
                    </h1>
                    <p className="mt-1 text-sm text-[#5c4735]">
                        Ad, soyad, iletişim ve doğum tarihinizle kütüphaneye üye olun.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                            <label className="block text-sm font-semibold text-[#4a2f1c] mb-1">
                                Ad
                            </label>
                            <input
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder={"Adınız"}
                                className="w-full rounded-md border border-[#b2824b] px-3 py-2 text-sm bg-[#fff9f1] text-black placeholder:text-[#7a6a58] focus:outline-none focus:ring-2 focus:ring-[#a15c2f]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#4a2f1c] mb-1">
                                Soyad
                            </label>
                            <input
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder={"Soyadınızı girin"}
                                className="w-full rounded-md border border-[#b2824b] px-3 py-2 text-sm bg-[#fff9f1] text-black placeholder:text-[#7a6a58] focus:outline-none focus:ring-2 focus:ring-[#a15c2f]"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#4a2f1c] mb-1">
                            Telefon Numarası
                        </label>
                        <input
                            name="phoneNumber"
                            type="tel"
                            inputMode="numeric"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="5xx xxx xx xx"
                            maxLength={11}
                            className="w-full rounded-md border border-[#b2824b] px-3 py-2 text-sm bg-[#fff9f1] text-black placeholder:text-[#7a6a58] focus:outline-none focus:ring-2 focus:ring-[#a15c2f]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#4a2f1c] mb-1">
                            E-posta
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={"ornek@gmail.com"}
                            className="w-full rounded-md border border-[#b2824b] px-3 py-2 text-sm bg-[#fff9f1] text-black placeholder:text-[#7a6a58] focus:outline-none focus:ring-2 focus:ring-[#a15c2f]"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="block text-sm font-semibold text-[#4a2f1c] mb-1">
                                Parola
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={"Parolanızı girin"}
                                className={`w-full rounded-md border px-3 py-2 text-sm bg-[#fff9f1] text-black placeholder:text-[#7a6a58] focus:outline-none focus:ring-2 
                                ${!isPasswordValid && formData.password.length > 0 ? 'border-red-400 focus:ring-red-400' : 'border-[#b2824b] focus:ring-[#a15c2f]'}`}
                                required
                            />

                            <div className="mt-2 text-xs space-y-1 bg-[#f6dcb7] p-2 rounded border border-[#c79f74]">
                                <p className={`flex items-center text-black gap-1.5 transition-colors ${hasUpperCase ? 'text-green-700 font-semibold' : 'text-[#8a7a6a]'}`}>
                                    <span className="text-[10px]">{hasUpperCase ? '✔' : '○'}</span> En az 1 büyük harf
                                </p>
                                <p className={`flex items-center text-black gap-1.5 transition-colors ${hasLowerCase ? 'text-green-700 font-semibold' : 'text-[#8a7a6a]'}`}>
                                    <span className="text-[10px]">{hasLowerCase ? '✔' : '○'}</span> En az 1 küçük harf
                                </p>
                                <p className={`flex items-center text-black gap-1.5 transition-colors ${hasNumber ? 'text-green-700 font-semibold' : 'text-[#8a7a6a]'}`}>
                                    <span className="text-[10px]">{hasNumber ? '✔' : '○'}</span> En az 1 rakam
                                </p>
                                <p className={`flex items-center text-black gap-1.5 transition-colors ${hasSpecialChar ? 'text-green-700 font-semibold' : 'text-[#8a7a6a]'}`}>
                                    <span className="text-[10px]">{hasSpecialChar ? '✔' : '○'}</span> En az 1 özel karakter (!@#$...)
                                </p>
                                <p className={`flex items-center text-black gap-1.5 transition-colors ${formData.password.length >= 8 ? 'text-green-700 font-semibold' : 'text-[#8a7a6a]'}`}>
                                    <span className="text-[10px]">{formData.password.length >= 8 ? '✔' : '○'}</span> En az 8 karakter
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#4a2f1c] mb-1">
                                Doğum Tarihi
                            </label>
                            <input
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full rounded-md border border-[#b2824b] px-3 py-2 text-sm bg-[#fff9f1] text-black placeholder:text-[#7a6a58] focus:outline-none focus:ring-2 focus:ring-[#a15c2f]"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex justify-center items-center rounded-md bg-[#7a4c24] px-4 py-2 text-sm font-semibold text-[#fdf3e6] hover:bg-[#5f391b] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? "Kayıt yapılıyor..." : "Üye Ol"}
                    </button>
                </form>

                <p className="text-xs text-[#6a5a4a]">
                    Zaten üye misiniz?{" "}
                    <a
                        href="/login"
                        className="font-semibold text-[#7a4c24] hover:text-[#5f391b]"
                    >
                        Giriş yapın
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}