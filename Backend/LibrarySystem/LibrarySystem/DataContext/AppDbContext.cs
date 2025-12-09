using LibrarySystem.Models.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace LibrarySystem.API.DataContext
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {


        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>()
                .HasIndex(u => u.NormalizedUserName)
                .IsUnique(false);

            builder.Entity<BookAuthor>()
                .HasKey(ba => new { ba.BookId, ba.AuthorId });

            // BookAuthor relationships - cascade delete the join-rows when Book or Author deleted
            builder.Entity<BookAuthor>()
                .HasOne(ba => ba.Book)
                .WithMany(b => b.BookAuthors)
                .HasForeignKey(ba => ba.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<BookAuthor>()
                .HasOne(ba => ba.Author)
                .WithMany(a => a.BookAuthors)
                .HasForeignKey(ba => ba.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Book>()
                .HasIndex(b => b.ISBN)
                .IsUnique();

            // Book -> Category (cascade delete books when category deleted)
            builder.Entity<Book>()
                .HasOne(b => b.Category)
                .WithMany(c => c.Books)
                .HasForeignKey(b => b.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // Book -> Publisher (cascade delete books when publisher deleted)
            builder.Entity<Book>()
                .HasOne(b => b.Publisher)
                .WithMany(p => p.Books)
                .HasForeignKey(b => b.PublisherId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<BookCopy>()
                .HasIndex(bc => bc.BarcodeNumber)
                .IsUnique();

            // BookCopy -> Book (cascade delete copies when book deleted)
            builder.Entity<BookCopy>()
                .HasOne(bc => bc.Book)
                .WithMany(b => b.BookCopies)
                .HasForeignKey(bc => bc.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            // BookCopy -> Shelf (cascade delete copies when shelf deleted)
            builder.Entity<BookCopy>()
                .HasOne(bc => bc.Shelf)
                .WithMany(s => s.BookCopies)
                .HasForeignKey(bc => bc.ShelfId)
                .OnDelete(DeleteBehavior.Cascade);

            // Loan relations
            builder.Entity<Loan>()
                .HasOne(l => l.AppUser)
                .WithMany(u => u.Loans)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Loan>()
                .HasOne(l => l.BookCopy)
                .WithMany(bc => bc.Loans)
                .HasForeignKey(l => l.BookCopyId)
                .OnDelete(DeleteBehavior.Cascade);

            // Fine -> Loan (cascade delete fines when loan deleted)
            builder.Entity<Fine>()
                .HasOne(f => f.Loan)
                .WithMany(l => l.Fines)
                .HasForeignKey(f => f.LoanId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);

            // Fine -> AppUser (cascade delete fines when user deleted)
            builder.Entity<Fine>()
             .HasOne(f => f.AppUser)
             .WithMany(u => u.Fines)
             .HasForeignKey(f => f.UserId)
             .OnDelete(DeleteBehavior.Restrict);

            // FineType -> Fines (cascade delete fines when fine type deleted)
            builder.Entity<FineType>()
                .HasMany(ft => ft.Fines)
                .WithOne(f => f.FineType)
                .HasForeignKey(f => f.FineTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Fine>()
                .HasOne(f => f.FineType)
                .WithMany(ft => ft.Fines)
                .HasForeignKey(f => f.FineTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Loan>()
                .HasOne(l => l.AppUser)
                .WithMany(u => u.Loans)
                .HasForeignKey(l => l.UserId);

            builder.Entity<Fine>()
                .HasOne(f => f.Loan)
                .WithMany(l => l.Fines)
                .HasForeignKey(f => f.LoanId)
                .IsRequired(false);

            builder.Entity<BookComment>()
                .HasOne(bc => bc.Book)
                .WithMany(b => b.Comments)
                .HasForeignKey(bc => bc.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<BookComment>()
                .HasOne(bc => bc.AppUser)
                .WithMany(u => u.Comments)
                .HasForeignKey(bc => bc.userId)
                .OnDelete(DeleteBehavior.Cascade);
        }


        // Konum Yönetimi
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Shelf> Shelves { get; set; }

        // Kitap Yönetimi
        public DbSet<Author> Authors { get; set; }
        public DbSet<Publisher> Publishers { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<BookComment> BookComments { get; set; }
        public DbSet<BookCopy> BookCopies { get; set; }

        // Çoktan Çoğa İlişkisi İçin Ara Tablo
        public DbSet<BookAuthor> BookAuthors { get; set; }

        // İşlem ve Ceza Yönetimi
        public DbSet<Loan> Loans { get; set; }
        public DbSet<FineType> FineTypes { get; set; }
        public DbSet<Fine> Fines { get; set; }
    }
}
