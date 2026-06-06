namespace TicketingSystem.Application.Interfaces.Security;

public interface IAuth0Provider
{
    Task<Auth0UserInfo?> ValidateIdToken(string idToken);
}

public record Auth0UserInfo(
    string Sub,
    string Email,
    string FirstName,
    string LastName);
