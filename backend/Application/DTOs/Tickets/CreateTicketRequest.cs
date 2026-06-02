using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Application.DTOs.Tickets;

public record CreateTicketRequest(
    string Title,
    string Description,
    TicketPriority Priority,
    TicketCategory Category);