'use client';

import React, { useState, useEffect } from 'react';
import {useRouter} from "next/navigation";
import toast from 'react-hot-toast';
import { UserViewDto } from '@/src/types/user';
import { FineType, AssignFineDto } from '@/src/types/fine';
import { userService } from '@/src/services/userService';
import { fineService } from '@/src/services/fineService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: UserViewDto | null;
    onUpdate: () => void;
}

type ViewMode = 'details' | 'assignFine';

export default function UserDetailModal({ isOpen, onClose, user, onUpdate }: Props) {
    const router = useRouter();
    const [userDetail, setUserDetail] = useState<UserViewDto | null>(user);
    const [loading, setLoading] = useState(false);

    const [viewMode, setViewMode] = useState<ViewMode>('details');
    const [actionLoading, setActionLoading] = useState(false);

    const [fineTypes, setFineTypes] = useState<FineType[]>([]);
    const [selectedTypeId, setSelectedTypeId] = useState<number>(0);
    const [reason, setReason] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (isOpen && user) {
            setViewMode('details');
            setUserDetail(user);
            fetchUserDetail(user.id);

            setSelectedTypeId(0);
            setReason('');
            setAmount('');
        }
    }, [isOpen, user]);

    useEffect(() => {
        if (viewMode === 'assignFine') {
            fetchFineTypes();
        }
    }, [viewMode]);

    const fetchUserDetail = async (id: string) => {
        setLoading(true);
        try {
            const data = await userService.getUserById(id);
            setUserDetail(data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const fetchFineTypes = async () => {
        setLoading(true);
        try {
            const types = await fineService.getFineTypes();
            const filteredTypes = types.filter(t => t.dailyRate === 0);
            setFineTypes(filteredTypes);

            if (filteredTypes.length > 0) setSelectedTypeId(filteredTypes[0].id);
        } catch (error) {
            toast.error("Ceza tipleri yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    const handleAssignFineSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTypeId) return toast.error("Lütfen bir ceza tipi seçiniz.");
        if (!reason.trim()) return toast.error("Lütfen ceza nedeni giriniz.");

        const selectedType = fineTypes.find(t => t.id === selectedTypeId);
        const isMonetary = selectedType?.name.toLowerCase().includes("para")
            || selectedType?.name.toLowerCase().includes("monetary");

        if (isMonetary && (!amount || Number(amount) <= 0)) {
            return toast.error("Geçerli bir tutar giriniz.");
        }

        setActionLoading(true);
        try {
            const dto: AssignFineDto = {
                userId: userDetail!.id,
                fineTypeId: selectedTypeId,
                reason: reason,
                amount: isMonetary ? Number(amount) : undefined
            };

            await fineService.assignFine(dto);

            toast.success("Ceza başarıyla atandı.");
            if (userDetail) setUserDetail({ ...userDetail, hasFine: true });
            onUpdate();
            onClose();

        } catch (error) {
            toast.error("Ceza atama işlemi başarısız.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleGoToFinePage = () => {
        if (!userDetail?.email) return toast.error("Kullanıcı e-postası bulunamadı.");
        onClose();

        router.push(`/admin/users/banned?email=${encodeURIComponent(userDetail.email)}`);
    };

    if (!isOpen || !userDetail) return null;

    const isSelectedMonetary = fineTypes.find(t => t.id === selectedTypeId)?.name.toLowerCase().includes("para")
        || fineTypes.find(t => t.id === selectedTypeId)?.name.toLowerCase().includes("monetary");

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl border border-stone-200 overflow-hidden relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

                {/* Loading Bar */}
                {(loading || actionLoading) && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-stone-100 overflow-hidden z-20">
                        <div className="h-full bg-amber-500 animate-progress origin-left"></div>
                    </div>
                )}

                {/* Header */}
                <div className="bg-stone-50 p-6 border-b border-stone-100 flex justify-between items-start shrink-0">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-amber-900 text-amber-50 flex items-center justify-center text-lg font-bold font-serif uppercase shadow-sm">
                            {userDetail.firstName?.charAt(0)}{userDetail.lastName?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-stone-800">{userDetail.firstName} {userDetail.lastName}</h2>
                            <p className="text-stone-500 text-xs">{userDetail.email}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">×</button>
                </div>

                <div className="p-6 overflow-y-auto">

                    {viewMode === 'details' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-left-4 duration-300">
                            <div className="space-y-5">
                                <h3 className="font-bold text-stone-800 border-b border-stone-100 pb-2 text-sm uppercase tracking-wide">Kişisel Bilgiler</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] text-stone-500 uppercase font-bold block mb-1">Telefon</label>
                                        <p className="text-stone-800 text-sm font-medium">{userDetail.phoneNumber || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-stone-500 uppercase font-bold block mb-1">Doğum Tarihi</label>
                                        <p className="text-stone-800 text-sm font-medium">{formatDate(userDetail.dateOfBirth)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <h3 className="font-bold text-stone-800 border-b border-stone-100 pb-2 text-sm uppercase tracking-wide">Durum</h3>
                                <div className={`flex justify-between items-center p-3 rounded border transition-colors ${userDetail.hasFine ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                                    <span className="text-stone-600 text-sm font-medium">Ceza Durumu</span>
                                    {userDetail.hasFine ? <span className="font-bold text-red-700 text-sm">🚫 Cezalı</span> : <span className="font-bold text-green-700 text-sm">✅ Temiz</span>}
                                </div>

                                <div className="pt-2 flex flex-col gap-3"> {/*TODO: Burada Hasfine kismi kaldirilacak, kullanicinin cezalari burada gorunmeyecektir.*/}
                                    {userDetail.hasFine ? (
                                        <button
                                            onClick={handleGoToFinePage}
                                            disabled={actionLoading}
                                            className="w-full border border-stone-300 text-stone-700 bg-white py-2.5 rounded text-sm font-bold hover:bg-stone-50 hover:text-stone-900 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <span>🔍</span> Cezayı Görüntüle / Yönet
                                        </button>
                                    ) : (
                                        <button onClick={() => setViewMode('assignFine')} disabled={actionLoading} className="w-full border border-red-300 text-red-700 bg-white py-2.5 rounded text-sm font-bold hover:bg-red-50 transition disabled:opacity-50">
                                            <span>⚠️</span> Ceza Ata
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {viewMode === 'assignFine' && (
                        <form onSubmit={handleAssignFineSubmit} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-2 mb-2">
                                <button type="button" onClick={() => setViewMode('details')} className="text-stone-400 hover:text-stone-600 text-sm">← Geri</button>
                                <h3 className="font-bold text-red-800 text-lg">Ceza Türü Seçin</h3>
                            </div>

                            {fineTypes.length === 0 && !loading ? (
                                <p className="text-red-500 text-sm">
                                    Ceza tipleri yüklenemedi veya uygun kriterlerde (Günlük Oran = 0) ceza tipi bulunamadı.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {fineTypes.map((type) => (
                                        <label
                                            key={type.id}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all flex flex-col gap-1 relative overflow-hidden
                                                ${selectedTypeId === type.id
                                                ? 'border-red-500 bg-red-50 ring-1 ring-red-500 shadow-sm'
                                                : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'}`}
                                        >
                                            <input
                                                type="radio"
                                                name="fineType"
                                                checked={selectedTypeId === type.id}
                                                onChange={() => setSelectedTypeId(type.id)}
                                                className="hidden"
                                            />
                                            <div className="font-bold text-stone-800">{type.name}</div>

                                            {selectedTypeId === type.id && (
                                                <div className="absolute top-2 right-2 text-red-500">✔</div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            )}

                            {isSelectedMonetary && (
                                <div className="animate-in fade-in zoom-in duration-200">
                                    <label className="block text-xs font-bold text-stone-600 mb-1">Ceza Tutarı (TL)</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full border text-black rounded p-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">Ceza Nedeni <span className="text-red-500">*</span></label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={3}
                                    placeholder="Örn: Kitap hasarlı iade edildi."
                                    className="w-full border text-black rounded p-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('details')}
                                    className="px-4 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded font-medium"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading || selectedTypeId === 0}
                                    className="px-6 py-2 text-sm bg-red-600 text-white rounded font-bold hover:bg-red-700 shadow-sm disabled:opacity-70 transition-colors"
                                >
                                    {actionLoading ? 'İşleniyor...' : 'Cezayı Onayla'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}