using Microsoft.Extensions.DependencyInjection;
using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Application.Interfaces.Security;
using TicketingSystem.Infrastructure.Repositories;
using TicketingSystem.Infrastructure.Security;
using Microsoft.Extensions.Configuration;

namespace TicketingSystem.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository,UserRepository>();

        services.AddScoped<ITicketRepository,TicketRepository>();

        services.AddSingleton<IPasswordHasher,PasswordHasher>();

        services.AddSingleton<IJwtProvider,JwtProvider>();

        services.AddSingleton<IAuth0Provider,Auth0Provider>();

        return services;
    }
}