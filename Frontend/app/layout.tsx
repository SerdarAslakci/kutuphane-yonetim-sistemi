import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {AuthProvider} from "@/src/context/AuthContext";
import {Toaster} from "react-hot-toast";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Kütüphane Yönetim Sistemi",
    description: "Kütüphane Yönetim Sistemi",
    icons: {
        icon: '@/public/kutuphaneiconv2.png',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <AuthProvider>
            {children}

            <Toaster
                position="bottom-right"
                reverseOrder={false}
                gutter={12}
                toastOptions={{
                    duration: 4000,

                    style: {
                        background: '#fffbf0',
                        color: '#451a03',
                        border: '1px solid #a8a29e',
                        fontFamily: 'serif',

                        fontSize: '16px',
                        padding: '16px 24px',
                        minWidth: '350px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },

                    success: {
                        iconTheme: {
                            primary: '#15803d',
                            secondary: '#dcfce7',
                        },
                    },

                    error: {
                        iconTheme: {
                            primary: '#b91c1c',
                            secondary: '#fee2e2',
                        },
                    },
                }}
            />
        </AuthProvider>
        </body>
        </html>
    );
}
