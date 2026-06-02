namespace TicketingSystem.Domain.Entities;

public class User
{
    public string Id { get; private set; }

    public string FirstName { get; private set; }

    public string LastName { get; private set; }

    public string Email { get; private set; }

    public string PasswordHash { get; private set; }

    public DateTime CreatedAt { get; private set; }

    private User()
    {
        Id = string.Empty;
        FirstName = string.Empty;
        LastName = string.Empty;
        Email = string.Empty;
        PasswordHash = string.Empty;
    }

    public User(
        string firstName,
        string lastName,
        string email,
        string passwordHash)
    {
        Id = Guid.NewGuid().ToString();

        FirstName = firstName.Trim();

        LastName = lastName.Trim();

        Email = email.Trim().ToLowerInvariant();

        PasswordHash = passwordHash;

        CreatedAt = DateTime.UtcNow;
    }

    public string FullName =>
        $"{FirstName} {LastName}";
}