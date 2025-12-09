'use client';

import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/src/hooks/useAuth';
import { commentService } from '@/src/services/commentService';
import { BookComment } from '@/src/types/comment';
import GenericConfirmModal from '@/src/components/ui/Admin/Modals/GenericConfirmationModal';

const CommentItem = ({
                         comment,
                         user,
                         isAuthenticated,
                         onDeleteClick,
                         renderStars,
                         formatDate
                     }: {
    comment: BookComment,
    user: any,
    isAuthenticated: boolean,
    onDeleteClick: (id: number) => void,
    renderStars: (rating: number) => React.ReactNode,
    formatDate: (date?: string) => string
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_LENGTH = 200;

    const shouldTruncate = comment.content.length > MAX_LENGTH;
    const displayedContent = isExpanded ? comment.content : comment.content.slice(0, MAX_LENGTH);

    return (
        <div className="flex gap-4 group border-b border-stone-50 pb-4 last:border-0">
            <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold shrink-0 uppercase select-none">
                {comment.userFullName ? comment.userFullName.charAt(0) : "U"}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-stone-800 text-sm">{comment.userFullName || "Anonim"}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            {renderStars(comment.rating)}
                            <span className="text-[10px] text-stone-400">• {formatDate(comment.createdAt)}</span>
                        </div>
                    </div>

                    {isAuthenticated && user && (user.id === comment.userId || user.roles.includes('Admin')) && (
                        <button
                            onClick={() => onDeleteClick(comment.id)}
                            className="text-stone-300 hover:text-red-500 text-xs transition-colors opacity-0 group-hover:opacity-100 px-2 py-1 rounded hover:bg-red-50 flex items-center gap-1 shrink-0"
                            title="Yorumu Sil"
                        >
                            <span>🗑️</span>
                            <span className="hidden sm:inline">Sil</span>
                        </button>
                    )}
                </div>

                <div className="text-stone-600 text-sm mt-2 leading-relaxed whitespace-pre-wrap break-words">
                    {displayedContent}
                    {!isExpanded && shouldTruncate && "..."}
                </div>

                {shouldTruncate && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs font-bold text-amber-700 hover:text-amber-900 mt-1 hover:underline focus:outline-none"
                    >
                        {isExpanded ? "Daha Az Göster" : "Devamını Oku"}
                    </button>
                )}
            </div>
        </div>
    );
};

interface Props {
    bookId: number;
}

const BookReviews = ({ bookId }: Props) => {
    const { user, isAuthenticated } = useAuth();

    const MAX_COMMENT_LENGTH = 400;

    const [comments, setComments] = useState<BookComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState<number | null>(null);

    const fetchComments = useCallback(async () => {
        setLoading(true);
        try {
            const result = await commentService.getComments(bookId, page, pageSize);
            if (result && Array.isArray(result.items)) {
                setComments(result.items);
                setTotalCount(result.totalCount || 0);
            } else {
                setComments([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error("Yorumlar çekilemedi", error);
        } finally {
            setLoading(false);
        }
    }, [bookId, page]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error("Yorum yapmak için giriş yapmalısınız.");
            return;
        }
        if (!newComment.trim()) return;

        setSubmitting(true);
        const toastId = toast.loading("Yorum gönderiliyor...");

        try {
            await commentService.addComment({
                bookId,
                content: newComment,
                rating
            });
            toast.success("Yorumunuz eklendi!", { id: toastId });
            setNewComment("");
            setRating(5);
            setPage(1);
            fetchComments();
        } catch (error: any) {
            console.error("Yorum eklenemedi", error.response.data);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                (typeof error.response?.data === 'string' ? error.response?.data : "İşlem başarısız.");

            if (errorMessage) {
                toast.error(errorMessage, { id: toastId });
            } else {
                toast.error("Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.", { id: toastId });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (commentId: number) => {
        setCommentIdToDelete(commentId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!commentIdToDelete) return;
        const toastId = toast.loading("Yorum Siliniyor...");

        try {
            await commentService.deleteComment(commentIdToDelete);
            toast.success("Yorum başarıyla silindi.", { id: toastId });
            fetchComments();
        } catch (error: any) {
            console.error("Yorum silme basarisiz", error.response.data);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                (typeof error.response?.data === 'string' ? error.response?.data : "İşlem başarısız.");

            if (errorMessage) {
                toast.error(errorMessage, { id: toastId });
            } else {
                toast.error("Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.", { id: toastId });
            }
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const renderStars = (count: number) => (
        <div className="flex text-amber-500 text-sm">
            {[...Array(5)].map((_, i) => (
                <span key={i}>{i < count ? "★" : "☆"}</span>
            ))}
        </div>
    );

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return (
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm mt-8">
            <h3 className="font-serif font-bold text-xl text-amber-950 mb-6 border-b border-amber-100 pb-2 flex justify-between items-center">
                <span>Okuyucu Yorumları</span>
                <span className="text-xs font-sans font-normal text-stone-500 bg-stone-100 px-2 py-1 rounded-full">Toplam {totalCount} Yorum</span>
            </h3>

            <div className="space-y-6 mb-8">
                {loading ? (
                    <div className="text-center py-8 text-stone-400 flex flex-col items-center gap-2">
                        <span className="animate-spin text-2xl">↻</span>
                        <span>Yükleniyor...</span>
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-stone-500 italic text-center py-4 bg-stone-50 rounded">Bu kitap için henüz yorum yapılmamış. İlk yorumu sen yap!</p>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            user={user}
                            isAuthenticated={isAuthenticated}
                            onDeleteClick={handleDeleteClick}
                            renderStars={renderStars}
                            formatDate={formatDate}
                        />
                    ))
                )}
            </div>

            {!loading && totalCount > pageSize && (
                <div className="flex justify-center items-center gap-4 mb-8 pt-4 border-t border-stone-50">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="text-xs font-bold text-stone-500 hover:text-amber-800 disabled:opacity-30 disabled:hover:text-stone-500 transition-colors px-3 py-1 rounded hover:bg-stone-100"
                    >
                        ← Önceki
                    </button>
                    <span className="text-xs text-stone-400 font-medium">Sayfa {page} / {totalPages}</span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="text-xs font-bold text-stone-500 hover:text-amber-800 disabled:opacity-30 disabled:hover:text-stone-500 transition-colors px-3 py-1 rounded hover:bg-stone-100"
                    >
                        Sonraki →
                    </button>
                </div>
            )}

            {isAuthenticated ? (
                <div className="bg-stone-50 p-5 rounded-lg border border-stone-200">
                    <h4 className="font-serif font-bold text-amber-900 mb-3 text-sm">Yorum Yap</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="block text-xs font-bold text-stone-600 mb-1">Puanınız</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-2xl transition-transform active:scale-90 ${rating >= star ? 'text-amber-500' : 'text-stone-300 hover:text-amber-300'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="flex justify-between items-end mb-1 px-1">
                                <label className="text-xs font-semibold text-stone-500">Yorumunuz</label>
                                <span className={`text-[10px] font-medium transition-colors ${newComment.length >= MAX_COMMENT_LENGTH ? 'text-red-600 font-bold' : 'text-stone-400'}`}>
                                    {newComment.length} / {MAX_COMMENT_LENGTH}
                                </span>
                            </div>

                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                maxLength={MAX_COMMENT_LENGTH} // Karakter sınırı
                                placeholder="Kitap hakkında düşünceleriniz..."
                                className="w-full p-3 border border-stone-300 rounded text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 min-h-[100px] text-black bg-white placeholder:text-stone-400 resize-y"
                                required
                            />
                        </div>

                        <div className="text-right">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-amber-900 hover:bg-amber-800 text-amber-50 px-6 py-2 rounded text-sm font-serif transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 text-center">
                    <p className="text-stone-600 text-sm mb-2">Yorum yapabilmek için giriş yapmalısınız.</p>
                    <a href="/login" className="text-amber-800 font-bold hover:underline text-sm inline-block px-4 py-2 border border-amber-800 rounded hover:bg-amber-800 hover:text-white transition-colors">
                        Giriş Yap
                    </a>
                </div>
            )}

            <GenericConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Yorumu Sil"
                message="Bu yorumu kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Evet, Sil"
                cancelText="Vazgeç"
                isDanger={true}
            />
        </div>
    );
};

export default BookReviews;