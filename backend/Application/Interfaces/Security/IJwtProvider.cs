using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Interfaces.Security;

public interface IJwtProvider
{
    string Generate(User user);
}