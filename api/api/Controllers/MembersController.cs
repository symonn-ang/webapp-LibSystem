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
        public MembersController(LibContext context)
        {
            _context = context;
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

            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMember), new { id = member.MemberID }, member);    
        }

        // Not gonna add update member cause its more work rn
        [HttpPut("EditMember/{id:int}")]
        public async Task<IActionResult> EditMember([FromRoute] int id, [FromBody] Member updatedMember)
        {
            var member = await _context.Members.FindAsync(id);

            if (id != updatedMember.MemberID)
            {
                return BadRequest();
            }

            return Ok();
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

        private bool MemberExists(int id)
        {
            return _context.Members.Any(x => x.MemberID == id);
        }
    }
}
