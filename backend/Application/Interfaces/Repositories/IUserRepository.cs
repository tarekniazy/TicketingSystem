using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetById(string id);

    Task<User?> GetByEmail(string email);

    Task Create(User user);
}