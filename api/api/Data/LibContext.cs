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
        }
    }
}
