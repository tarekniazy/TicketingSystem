using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Application.DTOs.Tickets;

public class TicketQueryParameters
{
    public string? Search { get; set; }

    public TicketPriority? Priority { get; set; }

    public TicketStatus? Status { get; set; }

    public TicketCategory? Category { get; set; }

    public int PageNumber { get; set; } = 1;

    public int PageSize { get; set; } = 10;
}
