'use client';

import React, { useState, useEffect, useMemo } from 'react'; // useMemo eklendi
import { UserViewDto, UserFilterDto } from '@/src/types/user';
import { userService } from '@/src/services/userService';
import UserDetailModal from '@/src/components/ui/Admin/Modals/UserDetailModal';

import UserStats from '@/src/components/ui/Admin/Users/UserStats';
import UserFilterBar from '@/src/components/ui/Admin/Users/UserFilterBar';
import UsersTable from '@/src/components/ui/Admin/Users/UsersTable';
import PaginationControls from '@/src/components/ui/Admin/Common/PaginationControls';

export default function UsersPage() {
    const [users, setUsers] = useState<UserViewDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const [filters, setFilters] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        hasFine: "all"
    });

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [selectedUser, setSelectedUser] = useState<UserViewDto | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const stats = useMemo(() => {
        const penalized = users.filter(u => u.hasFine).length;
        const activeReaders = users.filter(u => u.loanBookCount > 0).length;

        return {
            penalizedCount: penalized,
            activeReaderCount: activeReaders
        };
    }, [users]);

    const fetchUsers = async (overrideFilters?: any) => {
        setLoading(true);
        try {
            const currentFilters = overrideFilters || filters;
            const filterDto: UserFilterDto = {
                firstName: currentFilters.firstName || undefined,
                lastName: currentFilters.lastName || undefined,
                email: currentFilters.email || undefined,
                role: currentFilters.role || undefined,
                hasFine: currentFilters.hasFine === "all" ? undefined : (currentFilters.hasFine === "true"),
                page: page,
                size: pageSize
            };

            const result = await userService.getAllUsers(filterDto);
            setUsers(result.items || []);
            setTotalCount(result.totalCount || 0);
        } catch (error) {
            console.error("Kullanıcılar çekilemedi", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        setPage(1);
        fetchUsers();
    };

    const handleUpdateSuccess = () => {
        fetchUsers();
    };

    const handleClear = () => {
        const emptyFilters = { firstName: "", lastName: "", email: "", role: "", hasFine: "all" };
        setFilters(emptyFilters);
        setPage(1);
        fetchUsers(emptyFilters);
    };

    return (
        <div className="space-y-8">
            <UserStats
                totalCount={totalCount}
                penalizedCount={stats.penalizedCount}
                activeReaderCount={stats.activeReaderCount}
            />

            <UserFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onClear={handleClear}
            />

            <UsersTable
                users={users}
                loading={loading}
                onDetailClick={(user) => { setSelectedUser(user); setIsDetailOpen(true); }}
            />

            <PaginationControls
                currentPage={page}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={setPage}
            />

            <UserDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                user={selectedUser}
                onUpdate={handleUpdateSuccess}
            />
        </div>
    );
}