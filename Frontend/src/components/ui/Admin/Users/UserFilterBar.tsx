import React from 'react';

interface FilterState {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    hasFine: string;
}

interface Props {
    filters: FilterState;
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSearch: () => void;
    onClear: () => void;
}

export default function UserFilterBar({ filters, onFilterChange, onSearch, onClear }: Props) {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') onSearch();
    };

    return (
        <div className="bg-white p-4 md:p-5 rounded-lg border border-stone-200 shadow-sm">
            {/* Grid: Mobilde 1, Tablette 2, Masaüstünde 5 sütun */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <input
                    type="text"
                    name="firstName"
                    placeholder="Ad"
                    value={filters.firstName}
                    onChange={onFilterChange}
                    onKeyDown={handleKeyDown}
                    className="border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-800 w-full"
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Soyad"
                    value={filters.lastName}
                    onChange={onFilterChange}
                    onKeyDown={handleKeyDown}
                    className="border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-800 w-full"
                />
                <input
                    type="text"
                    name="email"
                    placeholder="E-posta"
                    value={filters.email}
                    onChange={onFilterChange}
                    onKeyDown={handleKeyDown}
                    className="border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-800 w-full"
                />
                <select
                    name="role"
                    value={filters.role}
                    onChange={onFilterChange}
                    className="border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-600 bg-white w-full"
                >
                    <option value="">Tüm Roller</option>
                    <option value="Admin">Admin</option>
                    <option value="User">Üye</option>
                </select>
                <select
                    name="hasFine"
                    value={filters.hasFine}
                    onChange={onFilterChange}
                    className="border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-600 bg-white w-full"
                >
                    <option value="all">Tüm Durumlar</option>
                    <option value="false">Temiz (Cezasız)</option>
                    <option value="true">Cezalı</option>
                </select>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 pt-4 border-t border-stone-100">
                <button
                    onClick={onClear}
                    className="px-4 py-2 text-sm text-stone-500 hover:text-stone-800 font-medium transition-colors w-full sm:w-auto text-center"
                >
                    Temizle
                </button>
                <button
                    onClick={onSearch}
                    className="bg-amber-900 hover:bg-amber-800 text-white px-6 py-2 rounded text-sm font-medium transition-colors shadow-sm w-full sm:w-auto"
                >
                    Filtrele
                </button>
            </div>
        </div>
    );
}