using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class BookArchive
    {
        [Key]
        public int ArchiveID { get; set; }
        public int BookID { get; set; }
        [Required]
        public string Title { get; set; } = "";
        [Required]
        public string Author { get; set; } = "";
        public string? Description { get; set; }
        public DateOnly DeletedAt { get; set; }
    }
}
