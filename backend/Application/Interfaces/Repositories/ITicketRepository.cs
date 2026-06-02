using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Interfaces.Repositories;

public interface ITicketRepository
{
    Task<List<Ticket>> GetAll();

    Task<Ticket?> GetById(string ticketId);

    Task<List<Ticket>> GetAllTicketsWithUserId(string userId);

    Task Create(Ticket ticket);

    Task Update(Ticket ticket);

    Task Delete(string ticketId);
}