using api.Data;
using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Specialized;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly LibContext _context;
        private readonly ILogger<BooksController> _logger;
        public BooksController(LibContext context, ILogger<BooksController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("GetAllBooks")]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            var books = await _context.Books.ToListAsync();

            if (books == null)
            {
                return NotFound();
            }

            return Ok(books);
        }

        [HttpGet("GetBook/{id:int}")]
        public async Task<ActionResult<Book>> GetBook([FromRoute] int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        [HttpPost("AddBook")]
        public async Task<ActionResult<Book>> AddBook([FromBody] Book book)
        {
            if (book == null)
            {
                return BadRequest();
            }

            //if (await BookExist(book.BookID))
            //{
            //    return Conflict("Book already exists.");
            //}

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBook), new { id = book.BookID }, book);
        }

        [HttpPut("EditBook/{id:int}")]
        public async Task<IActionResult> EditBook([FromRoute] int id, [FromBody] Book updatedBook)
        {
            //var book = await _context.Books.FindAsync(id);
            //if (book == null)
            //{
            //    return NotFound();
            //}

            if (id != updatedBook.BookID)
            {
                return BadRequest();
            }

            //book.Title = updatedBook.Title;
            //book.Author = updatedBook.Author;   
            //book.Description = updatedBook.Description;
            //book.AvailableCopies = updatedBook.AvailableCopies;

            _context.Entry(updatedBook).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch(DbUpdateException e)
            {
                if (!await BookExist(id))
                {
                    return NotFound();
                }
                else
                {
                    Console.WriteLine($"Error: {e}");
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("DeleteBook/{id:int}")]
        public async Task<IActionResult> DeleteBook([FromRoute] int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> BookExist(int id)
        {
            return await _context.Books.AnyAsync(x => x.BookID == id);
        }
    }
}
