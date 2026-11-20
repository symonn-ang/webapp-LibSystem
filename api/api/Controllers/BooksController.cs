using api.Data;
using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly LibContext _context;
        public BooksController(LibContext context)
        {
            _context = context;
        }

        List<Book> books = new List<Book>()
        {
            new Book()
            {
                BookID = 1,
                Title = "The Book",
                Author = "Jane Doe",
                Description = "In a world of books.",
                AvailableCopies = 5
            },
            new Book()
            {
                BookID = 2,
                Title = "The Book Sequel",
                Author = "John Moe",
                Description = "In a city of books.",
                AvailableCopies = 10
            },
            new Book()
            {
                BookID = 3,
                Title = "The Book Afterword",
                Author = "Jean Dancho",
                Description = "In a house of books.",
                AvailableCopies = 15
            }
        };

        [HttpGet("GetAllBooks")]
        public async Task<ActionResult<List<Book>>> GetBooks()
        {
            //if (await _context.Members.AnyAsync(m => m.Email == member.Email))
            //{
            //    return Conflict(new
            //    {
            //        message = "Email already exists."
            //    });
            //}
            if (books == null)
            {
                return BadRequest();
            }

            return Ok(books);
        }

        [HttpGet("GetBook/{id:int}")]
        public async Task<ActionResult<Book>> GetBook([FromRoute] int id)
        {
            Book? book = books.FirstOrDefault(x => x.BookID == id);
            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }
    }
}
