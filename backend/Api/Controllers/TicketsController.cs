using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TicketingSystem.Application.DTOs.Tickets;
using TicketingSystem.Application.Services;
using TicketingSystem.Domain.Entities;

[Authorize]
[ApiController]
[Route("api/tickets")]
public class TicketsController : ControllerBase
{
    private readonly TicketService _service;

    public TicketsController(
        TicketService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(
            await _service.GetAll());
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetAllTicketsForUser(
        string userId)
    {
        return Ok(await _service.GetAllTicketsWithUserId(userId));
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateTicketRequest request)
    {
        var userId =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!;

        await _service.Create(
            request,
            userId);

        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        UpdateTicketRequest request)
    {
        await _service.Update(request);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(
        string id)
    {
        await _service.Delete(id);

        return NoContent();
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(
        string id,
        UpdateTicketStatusRequest request)
    {
        await _service.ChangeStatus(request);

        return NoContent();
    }

    [HttpPut("{id}/assign")]
    public async Task<IActionResult> Assign(
        string id,
        AssignTicketRequest request)
    {
        await _service.Assign(request);

        return NoContent();
    }
}