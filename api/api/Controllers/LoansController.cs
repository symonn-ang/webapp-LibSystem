using api.Data;
using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoansController : ControllerBase
    {
        private readonly LibContext _context;

        public LoansController(LibContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Loan>>> GetLoans()
        {
            return await _context.Loans
                .Include(l => l.Book)
                .Include(l => l.Member)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Loan>> GetLoan(int id)
        {
            var loan = await _context.Loans
                .Include(l => l.Book)
                .Include(l => l.Member)
                .FirstOrDefaultAsync(l => l.LoanID == id);

            if (loan == null)
                return NotFound();

            return loan;
        }

        [HttpPost]
        public async Task<ActionResult<Loan>> PostLoan(Loan loan)
        {
            loan.LoanDate = DateOnly.FromDateTime(DateTime.Now);

            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLoan), new { id = loan.LoanID }, loan);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoan(int id, Loan loan)
        {
            if (id != loan.LoanID)
                return BadRequest();

            _context.Entry(loan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Loans.Any(e => e.LoanID == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoan(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null)
                return NotFound();

            _context.Loans.Remove(loan);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
