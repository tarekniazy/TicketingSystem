using Microsoft.Extensions.DependencyInjection;
using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Application.Interfaces.Security;
using TicketingSystem.Infrastructure.Repositories;
using TicketingSystem.Infrastructure.Security;

namespace TicketingSystem.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection
        AddInfrastructure(
            this IServiceCollection services)
    {
        services.AddScoped<
            IUserRepository,
            UserRepository>();

        services.AddScoped<
            ITicketRepository,
            TicketRepository>();

        services.AddScoped<
            IPasswordHasher,
            PasswordHasher>();

        services.AddScoped<
            IJwtProvider,
            JwtProvider>();

        return services;
    }
}