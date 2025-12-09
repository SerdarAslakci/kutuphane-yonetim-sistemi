'use client';
import React, { useState, useEffect, useRef } from 'react';
import { UserFineDto } from '@/src/types/user';
import CreditCardVisual from './CreditCardVisual';
import toast from 'react-hot-toast';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PaymentReceiptPdf } from '@/src/components/ui/Pdf/PaymentReceipt';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    fine: UserFineDto | null;
    loading: boolean;
}

export default function PaymentModal({ isOpen, onClose, onConfirm, fine, loading: apiLoading }: Props) {
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [receiptId, setReceiptId] = useState("");
    const [simulatingPayment, setSimulatingPayment] = useState(false);

    const [snapshotFine, setSnapshotFine] = useState<UserFineDto | null>(null);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (isOpen) {
            setCardNumber('');
            setCardName('');
            setExpiry('');
            setCvc('');
            setFocusedField(null);
            setSimulatingPayment(false);
            setPaymentSuccess(false);
            setSnapshotFine(null);
        }
    }, [isOpen]);

    if (!isOpen || (!fine && !paymentSuccess)) return null;

    const displayFine = paymentSuccess ? snapshotFine : fine;
    if (!displayFine) return null;

    const isLoading = apiLoading || simulatingPayment;

    // --- INPUT HANDLERS (Aynı) ---
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        val = val.substring(0, 16);
        setCardNumber(val);
    };

    const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.toUpperCase();
        val = val.replace(/[^A-ZĞÜŞİÖÇ\s]/g, '');
        setCardName(val.substring(0, 24));
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        val = val.substring(0, 4);
        if (val.length >= 2) {
            val = val.substring(0, 2) + '/' + val.substring(2);
        }
        setExpiry(val);
    };

    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        setCvc(val.substring(0, 3));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (cardNumber.length < 16 || !cardName || expiry.length < 5 || cvc.length < 3) {
            toast.error("Lütfen kart bilgilerini eksiksiz giriniz.");
            return;
        }

        setSnapshotFine(fine);
        setSimulatingPayment(true);

        await new Promise(resolve => setTimeout(resolve, 3500));

        const generatedReceiptId = Math.floor(100000 + Math.random() * 900000).toString();
        setReceiptId(generatedReceiptId);

        onConfirm();

        setSimulatingPayment(false);
        setPaymentSuccess(true);
    };

    if (paymentSuccess && displayFine) {
        return (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-8 text-center border border-stone-200" onClick={e => e.stopPropagation()}>
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm">
                        ✅
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-stone-800 mb-2">Ödeme Başarılı!</h3>
                    <p className="text-stone-500 text-sm mb-8">Borcunuz başarıyla tahsil edilmiştir.</p>

                    <div className="space-y-3">
                        <PDFDownloadLink
                            document={<PaymentReceiptPdf fine={displayFine} userName={cardName} paymentId={receiptId} />}
                            fileName={`Dekont-${receiptId}.pdf`}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-bold transition-colors shadow-md"
                        >
                            {({ blob, url, loading, error }) => (
                                loading ? 'Dekont Hazırlanıyor...' : (
                                    <>
                                        <span>📄</span> Dekontu İndir
                                    </>
                                )
                            )}
                        </PDFDownloadLink>

                        <button
                            onClick={onClose}
                            className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg font-bold transition-colors"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in overflow-y-auto" onClick={!isLoading ? onClose : undefined}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 md:p-8 border border-stone-200 relative my-8" onClick={e => e.stopPropagation()}>
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center rounded-xl">
                        <div className="w-16 h-16 border-4 border-stone-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-stone-700 font-medium animate-pulse">Ödeme İşleniyor...</p>
                    </div>
                )}

                <div className="text-center mb-8">
                    <h3 className="font-serif font-bold text-2xl text-amber-950">Güvenli Ödeme</h3>
                    <p className="text-stone-500 text-sm mt-1">Borç kapama işlemi için kart bilgilerinizi giriniz.</p>
                </div>

                <CreditCardVisual
                    cardNumber={cardNumber}
                    cardName={cardName}
                    expiry={expiry}
                    cvc={cvc}
                    focusedField={focusedField}
                />

                {/* Tutar */}
                <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 mb-6 flex justify-between items-center">
                    <span className="text-stone-600 font-medium">Ödenecek Tutar:</span>
                    <span className="text-2xl font-mono font-bold text-green-700">{displayFine.amount.toFixed(2)} ₺</span>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wider">Kart Numarası</label>
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={cardNumber
                                    .replace(/\s/g, '')
                                    .replace(/(\d{4})/g, '$1 ')
                                    .trim()}
                                onChange={handleCardNumberChange}
                                onFocus={() => setFocusedField('number')}
                                placeholder="0000 0000 0000 0000"
                                maxLength={19}
                                disabled={isLoading}
                                className="w-full border border-stone-300 text-stone-800 rounded-lg p-3 pl-12 font-mono text-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all disabled:bg-stone-50"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">💳</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wider">Kart Üzerindeki İsim</label>
                        <input
                            type="text"
                            value={cardName}
                            onChange={handleCardNameChange}
                            onFocus={() => setFocusedField('name')}
                            placeholder="AD SOYAD"
                            disabled={isLoading}
                            className="w-full border border-stone-300 text-stone-800 rounded-lg p-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all uppercase disabled:bg-stone-50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wider">Son Kul. Tar.</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={expiry}
                                onChange={handleExpiryChange}
                                onFocus={() => setFocusedField('expiry')}
                                placeholder="AA/YY"
                                maxLength={5}
                                disabled={isLoading}
                                className="w-full border border-stone-300 text-stone-800 rounded-lg p-3 font-mono text-center focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all disabled:bg-stone-50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wider flex justify-between">
                                <span>CVC / CVV</span>
                                <span className="text-stone-400 text-[10px] normal-case">Arkada 3 hane</span>
                            </label>
                            <input
                                type="password"
                                inputMode="numeric"
                                value={cvc}
                                onChange={handleCvcChange}
                                onFocus={() => setFocusedField('cvc')}
                                placeholder="***"
                                maxLength={3}
                                disabled={isLoading}
                                className="w-full border border-stone-300 text-stone-800 rounded-lg p-3 font-mono text-center focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all disabled:bg-stone-50"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 mt-8 border-t border-stone-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 text-sm text-stone-600 hover:bg-stone-100 rounded-lg font-bold transition-colors disabled:opacity-50"
                        >
                            Vazgeç
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] px-6 py-3 text-sm bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 disabled:opacity-70 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'İşleniyor...' : `₺${displayFine.amount.toFixed(2)} Öde`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}