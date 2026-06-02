using Microsoft.AspNetCore.Authorization;
using TicketingSystem.Application.DTOs.Tickets;
using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Services;

public class TicketService(
    ITicketRepository ticketRepository,
    IUserRepository userRepository)
{
    private readonly ITicketRepository _ticketRepository = ticketRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task Create(
        CreateTicketRequest request,
        string createdById)
    {
        var ticket = new Ticket(
            request.Title,
            request.Description,
            request.Priority,
            request.Category,
            createdById);

        await _ticketRepository.Create(ticket);
    }

    public async Task<List<Ticket>> GetAll()
    {
        return await _ticketRepository.GetAll();
    }

    public async Task<List<Ticket>> GetAllTicketsWithUserId(string userId)
    {
        return await _ticketRepository.GetAllTicketsWithUserId(userId);
    }

    public async Task Update(UpdateTicketRequest request)
    {
        var ticket = await _ticketRepository.GetById(request.TicketId);

        if (ticket == null)
        {
            throw new Exception(
                "Ticket not found.");
        }

        ticket.Update(
            request.Title,
            request.Description,
            request.Priority,
            request.Category);

        await _ticketRepository.Update(ticket);
    }

    public async Task Delete(
        string ticketId)
    {
        await _ticketRepository.Delete(ticketId);
    }

    public async Task Assign(AssignTicketRequest request)
    {
        var ticket = await _ticketRepository.GetById(request.TicketId);

        if (ticket == null)
        {
            throw new Exception(
                "Ticket not found.");
        }

        var user = await _userRepository.GetById(request.UserId);

        if (user == null)
        {
            throw new Exception(
                "User not found.");
        }

        ticket.AssignTo(request.UserId);

        await _ticketRepository.Update(ticket);
    }

    public async Task ChangeStatus(UpdateTicketStatusRequest request)
    {
        var ticket = await _ticketRepository.GetById(request.TicketId);

        if (ticket == null)
        {
            throw new Exception(
                "Ticket not found.");
        }

        ticket.ChangeStatus(request.Status);

        await _ticketRepository.Update(ticket);
    }
}