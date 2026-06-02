using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Application.DTOs.Tickets;

public record UpdateTicketRequest(
    string TicketId,
    string Title,
    string Description,
    TicketPriority Priority,
    TicketCategory Category);