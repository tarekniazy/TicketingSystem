using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Infrastructure.Persistence;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(
        IOptions<MongoDbSettings> settings)
    {
        var client =
            new MongoClient(
                settings.Value.ConnectionString);

        _database =
            client.GetDatabase(
                settings.Value.DatabaseName);
    }

    public IMongoCollection<User> Users =>
        _database.GetCollection<User>("Users");

    public IMongoCollection<Ticket> Tickets =>
        _database.GetCollection<Ticket>("Tickets");
}