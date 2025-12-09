'use client';

import React, { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title?: string;
    message?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

export default function GenericConfirmModal({
                                                isOpen, onClose, onConfirm,
                                                title = "Onay Gerekiyor",
                                                message = "Bu işlemi yapmak istediğinize emin misiniz?",
                                                confirmText = "Onayla",
                                                cancelText = "İptal",
                                                isDanger = false
                                            }: Props) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-lg shadow-xl w-full max-w-sm p-6 border ${isDanger ? 'border-red-100' : 'border-stone-200'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl ${isDanger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                        {isDanger ? '⚠️' : 'ℹ️'}
                    </div>

                    <h3 className="font-bold text-lg text-stone-800 mb-2">{title}</h3>
                    <div className="text-stone-500 text-sm mb-6 leading-relaxed">{message}</div>

                    <div className="flex justify-center gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border border-stone-300 rounded-md text-stone-600 hover:bg-stone-50 text-sm font-medium transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className={`px-4 py-2 text-white rounded-md text-sm font-bold shadow-sm transition-colors flex items-center gap-2
                                ${isDanger
                                ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                                : 'bg-stone-800 hover:bg-stone-900 disabled:bg-stone-600'
                            }`}
                        >
                            {loading && <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>}
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}