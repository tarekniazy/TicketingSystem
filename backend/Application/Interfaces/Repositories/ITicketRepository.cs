using TicketingSystem.Application.DTOs.Common;
using TicketingSystem.Application.DTOs.Tickets;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Interfaces.Repositories;

public interface ITicketRepository
{
    Task<List<Ticket>> GetAll();

    Task<Ticket?> GetById(string ticketId);

    Task<PagedResult<Ticket>> GetAllTicketsWithUserId(
        string userId,
        TicketQueryParameters query);

    Task<PagedResult<Ticket>> GetAllTicketsCreatedByUser(
        string userId,
        TicketQueryParameters query);

    Task Create(Ticket ticket);

    Task Update(Ticket ticket);

    Task Delete(string ticketId);
}