'use client';

import React from 'react';

interface CreditCardVisualProps {
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvc: string;
    focusedField: string | null;
}

export default function CreditCardVisual({ cardNumber, cardName, expiry, cvc, focusedField }: CreditCardVisualProps) {
    const formatCardNumberPlaceholder = (num: string) => {
        const standard = '#### #### #### ####';
        if (!num) return standard;
        let formatted = '';
        for (let i = 0; i < num.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += num[i];
        }
        return formatted + standard.slice(formatted.length);
    };

    const isFlipped = focusedField === 'cvc';

    return (
        <div className="w-full max-w-[360px] h-[220px] mx-auto mb-6 perspective-[1000px] select-none group">

            <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>

                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl shadow-xl p-6 text-white [backface-visibility:hidden] z-20 flex flex-col justify-between border border-stone-700">

                    <div className="flex justify-between items-start">
                        <div className="w-12 h-9 bg-gradient-to-tr from-yellow-400 to-yellow-200 rounded-md border border-yellow-600 shadow-sm opacity-90 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 skew-y-12 origin-top-left"></div>
                        </div>
                        <span className="font-serif italic text-lg opacity-70 text-stone-300">Kütüphane Kart</span>
                    </div>

                    <div className="space-y-6">
                        <div className="font-mono text-xl tracking-widest transition-all p-1 -m-1">
                            {formatCardNumberPlaceholder(cardNumber)}
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="flex flex-col p-1 -m-1 transition-all">
                                <span className="text-[9px] uppercase text-stone-400 font-bold tracking-wider">Kart Sahibi</span>
                                <span className="font-medium uppercase tracking-wide text-sm truncate max-w-[180px]">
                                    {cardName || 'AD SOYAD'}
                                </span>
                            </div>

                            {/* SKT */}
                            <div className="flex flex-col p-1 -m-1 transition-all">
                                <span className="text-[9px] uppercase text-stone-400 font-bold tracking-wider">SKT</span>
                                <span className="font-mono font-medium tracking-wider text-sm">
                                    {expiry || 'MM/YY'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-stone-700 to-stone-800 rounded-xl shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden border border-stone-600">
                    <div className="w-full h-12 bg-stone-950 mt-6 opacity-90"></div>

                    <div className="px-6 mt-4 flex items-center justify-between gap-4">
                        <div className="flex-1 h-10 bg-stone-300/80 rounded-sm flex items-center px-3 relative overflow-hidden">
                            <span className="text-[10px] text-stone-500 font-serif italic opacity-70 z-10">İmza Paneli</span>
                            <div className="absolute inset-0 bg-stone-400/20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)' }}></div>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                            <span className="text-[9px] uppercase text-stone-400 font-bold tracking-wider mr-1 mb-0.5">CVV / CVC</span>
                            <div className="w-16 h-10 bg-white text-stone-900 font-mono text-center p-2 rounded-sm font-bold flex justify-center items-center border border-stone-300">
                                <span className="tracking-widest text-lg leading-none">{cvc || '***'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pr-6 flex justify-end opacity-30 grayscale">
                        <span className="text-3xl">🏦</span>
                    </div>
                </div>

            </div>
        </div>
    );
}