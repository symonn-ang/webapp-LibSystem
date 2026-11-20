using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Book
    {
        public int BookID { get; set; }
        [Required]
        public string Title { get; set; } = "";
        [Required]
        public string Author { get; set; } = "";
        [Column(TypeName = "nvarchar(max)")]
        public string? Description { get; set; }
        public int AvailableCopies { get; set; }
    }
}
