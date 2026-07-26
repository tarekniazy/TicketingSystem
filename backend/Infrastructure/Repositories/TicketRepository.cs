using System.Text.RegularExpressions;
using MongoDB.Bson;
using MongoDB.Driver;
using TicketingSystem.Application.DTOs.Common;
using TicketingSystem.Application.DTOs.Tickets;
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

    public Task<PagedResult<Ticket>> GetAllTicketsWithUserId(
        string userId,
        TicketQueryParameters query)
    {
        var baseFilter = Builders<Ticket>.Filter.Eq(
            ticket => ticket.AssignedToUserId,
            userId);

        return QueryTickets(baseFilter, query);
    }

    public Task<PagedResult<Ticket>> GetAllTicketsCreatedByUser(
        string userId,
        TicketQueryParameters query)
    {
        var baseFilter = Builders<Ticket>.Filter.Eq(
            ticket => ticket.CreatedById,
            userId);

        return QueryTickets(baseFilter, query);
    }

    private async Task<PagedResult<Ticket>> QueryTickets(
        FilterDefinition<Ticket> baseFilter,
        TicketQueryParameters query)
    {
        var filter = ApplyQueryFilters(baseFilter, query);

        var totalCount = await _tickets.CountDocumentsAsync(filter);

        var items = await _tickets
            .Find(filter)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Limit(query.PageSize)
            .ToListAsync();

        return new PagedResult<Ticket>(
            items,
            query.PageNumber,
            query.PageSize,
            totalCount);
    }

    private static FilterDefinition<Ticket> ApplyQueryFilters(
        FilterDefinition<Ticket> filter,
        TicketQueryParameters query)
    {
        var builder = Builders<Ticket>.Filter;

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            filter &= builder.Regex(
                ticket => ticket.Title,
                new BsonRegularExpression(Regex.Escape(query.Search), "i"));
        }

        if (query.Priority.HasValue)
        {
            filter &= builder.Eq(ticket => ticket.Priority, query.Priority.Value);
        }

        if (query.Status.HasValue)
        {
            filter &= builder.Eq(ticket => ticket.Status, query.Status.Value);
        }

        if (query.Category.HasValue)
        {
            filter &= builder.Eq(ticket => ticket.Category, query.Category.Value);
        }

        return filter;
    }
}