using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController : ControllerBase
    {
        private readonly LibContext _context;
        private readonly ILogger<MembersController> _logger;
        public MembersController(LibContext context, ILogger<MembersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("GetAllMembers")]
        public async Task<ActionResult<IEnumerable<Member>>> GetAllMembers()
        {
            var members = await _context.Members.ToListAsync();

            if (members == null)
            {
                return BadRequest();
            }
            return Ok(members);
        }

        [HttpGet("GetMember/{id:int}")]
        public async Task<ActionResult<Member>> GetMember([FromRoute] int id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null)
            {
                return NotFound();
            }

            return Ok(member);
        }

        [HttpPost("AddMember")]
        public async Task<ActionResult<Member>> AddMember([FromBody] Member member)
        {
            if (member == null)
            {
                return BadRequest();
            }

            //TODO check error handlomg later
            if (await MemberExists(member.MemberID))
                return Conflict("Email already exists.");

            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMember), new { id = member.MemberID }, member);    
        }

        [HttpPut("EditMember/{id:int}")]
        public async Task<IActionResult> EditMember([FromRoute] int id, [FromBody] Member updatedMember)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null)
            {
                return NotFound();
            }

            if (id != updatedMember.MemberID)
            {
                return BadRequest();
            }

            // check later if dto is better here, and it was, cause modified is for when u dont make an instance beforehand
            //_context.Entry(updatedMember).State = EntityState.Modified;

            member.Name = updatedMember.Name;
            member.Email = updatedMember.Email;

            try
            {
                await _context.SaveChangesAsync();
            } 
            catch (DbUpdateException e)
            {
                if (!await MemberExists(id))
                {
                    return NotFound();
                }
                else
                {
                    Console.WriteLine($"Error: {e.Message}");
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("DeleteMember/{id:int}")]
        public async Task<IActionResult> DeleteMember([FromRoute] int id)
        {
            var member = await _context.Members.FindAsync(id);

            if (member == null)
            {
                return NotFound();
            }

            _context.Members.Remove(member);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> MemberExists(int id)
        {
            return await _context.Members.AnyAsync(x => x.MemberID == id);
        }
    }
}
