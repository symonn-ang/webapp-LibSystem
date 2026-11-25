using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace api.Data
{
    public class LibContext : DbContext
    {
        public LibContext(DbContextOptions<LibContext> options) : base(options) { }
        public DbSet<Member> Members { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<BookArchive> BookArchives { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Loan>()
                .Property(l => l.LoanDate)
                .HasDefaultValueSql("CONVERT(date, GETDATE())");

            modelBuilder.Entity<BookArchive>()
                .Property(b => b.DeletedAt)
                .HasDefaultValueSql("CONVERT(date, GETDATE())");

            modelBuilder.Entity<Member>()
                .HasIndex(l => l.Email)
                .IsUnique();

            // for trigs
            modelBuilder.Entity<Book>()
                .ToTable("Books", tb => tb.UseSqlOutputClause(false));

            modelBuilder.Entity<Loan>()
                .ToTable("Loans", tb => tb.UseSqlOutputClause(false));

            // TODO check
            //modelBuilder.Entity<Loan>()
            //    .HasIndex(l => new { l.MemberID, l.BookID })
            //    .IsUnique();

        }
    }
}
