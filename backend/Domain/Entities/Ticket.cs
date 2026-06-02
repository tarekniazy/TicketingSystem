using TicketingSystem.Domain.Enums;
using TicketingSystem.Domain.Exceptions;

namespace TicketingSystem.Domain.Entities;

public class Ticket
{
    public string Id { get; private set; }

    public string Title { get; private set; }

    public string Description { get; private set; }

    public TicketPriority Priority { get; private set; }

    public TicketStatus Status { get; private set; }

    public TicketCategory Category { get; private set; }

    public string CreatedById { get; private set; }

    public string? AssignedToUserId { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime? UpdatedAt { get; private set; }

    private Ticket()
    {
        Id = string.Empty;
        Title = string.Empty;
        Description = string.Empty;
        CreatedById = string.Empty;
    }

    public Ticket(
        string title,
        string description,
        TicketPriority priority,
        TicketCategory category,
        string createdById)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Ticket title is required.");

        if (string.IsNullOrWhiteSpace(description))
            throw new DomainException("Ticket description is required.");

        Id = Guid.NewGuid().ToString();

        Title = title.Trim();

        Description = description.Trim();

        Priority = priority;

        Category = category;

        CreatedById = createdById;

        Status = TicketStatus.Open;

        CreatedAt = DateTime.UtcNow;
    }

    public void AssignTo(string userId)
    {
        AssignedToUserId = userId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(
        string title,
        string description,
        TicketPriority priority,
        TicketCategory category)
    {
        if (Status == TicketStatus.Closed)
        {
            throw new DomainException("Closed tickets cannot be modified.");
        }

        Title = title.Trim();
        Description = description.Trim();
        Priority = priority;
        Category = category;

        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangeStatus(
        TicketStatus newStatus)
    {
        if (Status == TicketStatus.Closed)
        {
            throw new DomainException("Closed tickets cannot be modified.");
        }

        if (newStatus == TicketStatus.Closed &&
            Status != TicketStatus.Resolved)
        {
            throw new DomainException("Ticket must be resolved before closing.");
        }

        Status = newStatus;

        UpdatedAt = DateTime.UtcNow;
    }
}