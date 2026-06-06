using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using TicketingSystem.Application.Interfaces.Security;

namespace TicketingSystem.Infrastructure.Security;

public class Auth0Provider : IAuth0Provider
{
    private readonly string _domain;
    private readonly string _clientId;
    private readonly ConfigurationManager<OpenIdConnectConfiguration> _configManager;

    public Auth0Provider(IConfiguration configuration)
    {
        _domain = configuration["Auth0:Domain"]!;
        _clientId = configuration["Auth0:ClientId"]!;
        _configManager = new ConfigurationManager<OpenIdConnectConfiguration>(
            $"https://{_domain}/.well-known/openid-configuration",
            new OpenIdConnectConfigurationRetriever());
    }

    public async Task<Auth0UserInfo?> ValidateIdToken(string idToken)
    {
        try
        {
            var config = await _configManager.GetConfigurationAsync();

            var handler = new JwtSecurityTokenHandler
            {
                MapInboundClaims = false
            };

            var principal = handler.ValidateToken(idToken, new TokenValidationParameters
            {
                ValidIssuer = $"https://{_domain}/",
                ValidAudience = _clientId,
                IssuerSigningKeys = config.SigningKeys,
                ValidateLifetime = true,
            }, out _);

            var sub = principal.FindFirst("sub")?.Value;
            var email = principal.FindFirst("email")?.Value;

            if (sub is null || email is null)
                return null;

            var firstName = principal.FindFirst("given_name")?.Value ?? string.Empty;
            var lastName = principal.FindFirst("family_name")?.Value ?? string.Empty;

            if (string.IsNullOrEmpty(firstName))
            {
                var name = principal.FindFirst("name")?.Value ?? string.Empty;
                var parts = name.Split(' ', 2);
                firstName = parts[0];
                lastName = parts.Length > 1 ? parts[1] : string.Empty;
            }

            return new Auth0UserInfo(sub, email, firstName, lastName);
        }
        catch
        {
            return null;
        }
    }
}
