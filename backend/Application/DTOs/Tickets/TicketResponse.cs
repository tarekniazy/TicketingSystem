using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Application.DTOs.Tickets;

public record TicketResponse(
    string Id,
    string Title,
    string Description,
    TicketPriority Priority,
    TicketCategory Category,
    TicketStatus Status,
    string CreatedById,
    string? AssignedToId,
    DateTime CreatedAt);