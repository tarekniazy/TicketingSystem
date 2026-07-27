using MongoDB.Driver;
using MongoDB.Driver.Linq;
using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Infrastructure.Persistence;

namespace TicketingSystem.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(
        MongoDbContext context)
    {
        _users = context.Users;
    }

    public async Task<List<User>> GetAll()
    {
        return await _users.AsQueryable().ToListAsync();
    }

    public async Task<User?> GetById(
        string id)
    {
        return await _users
            .Find(x => x.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<User?> GetByEmail(
        string email)
    {
        return await _users
            .Find(x => x.Email == email)
            .FirstOrDefaultAsync();
    }

    public async Task Create(
        User user)
    {
        await _users.InsertOneAsync(user);
    }
}