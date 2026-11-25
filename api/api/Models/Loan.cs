using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Loan
    {
        public int LoanID { get; set; }
        public int BookID { get; set; }
        [ForeignKey(nameof(BookID))]
        [ValidateNever]
        public Book Book { get; set; } = null!;
        public int MemberID { get; set; }
        [ForeignKey(nameof(MemberID))]
        [ValidateNever]
        public Member Member { get; set; } = null!;
        public DateOnly LoanDate { get; set; }
        public DateOnly? ReturnDate { get; set; }
    }
}
