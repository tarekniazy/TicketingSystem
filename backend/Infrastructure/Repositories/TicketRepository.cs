using MongoDB.Driver;
using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Infrastructure.Persistence;

namespace TicketingSystem.Infrastructure.Repositories;

public class TicketRepository : ITicketRepository
{
    private readonly IMongoCollection<Ticket> _tickets;

    public TicketRepository(
        MongoDbContext context)
    {
        _tickets = context.Tickets;
    }

    public async Task<List<Ticket>> GetAll()
    {
        return await _tickets
            .Find(_ => true)
            .ToListAsync();
    }

    public async Task<Ticket?> GetById(
        string id)
    {
        return await _tickets
            .Find(x => x.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task Create(
        Ticket ticket)
    {
        await _tickets.InsertOneAsync(ticket);
    }

    public async Task Update(
        Ticket ticket)
    {
        await _tickets.ReplaceOneAsync(
            x => x.Id == ticket.Id,
            ticket);
    }

    public async Task Delete(
        string id)
    {
        await _tickets.DeleteOneAsync(
            x => x.Id == id);
    }

    public Task<List<Ticket>> GetAllTicketsWithUserId(string userId)
    {
        return _tickets.Find(ticket => ticket.AssignedToUserId == userId).ToListAsync();
    }
}