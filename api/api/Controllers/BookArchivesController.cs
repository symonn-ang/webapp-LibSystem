using api.Data;
using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookArchivesController : ControllerBase
    {
        private readonly LibContext _context;

        public BookArchivesController(LibContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookArchive>>> GetBookArchives()
        {
            return await _context.BookArchives.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookArchive>> GetBookArchive(int id)
        {
            var archive = await _context.BookArchives.FindAsync(id);

            if (archive == null)
                return NotFound();

            return archive;
        }

        // don't need POST/PUT/DELETE for archive
        // DELETE trigger will insert into it automatically.
    }
}
