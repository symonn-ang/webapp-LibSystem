using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class BookArchive
    {
        public int ArchiveID { get; set; }
        public int BookID { get; set; }
        [Required]
        public string Title { get; set; } = "";
        [Required]
        public string Author { get; set; } = "";
        public DateOnly DeletedAt { get; set; }
    }
}
