using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Application.DTOs.Tickets;

public record UpdateTicketStatusRequest(string TicketId, TicketStatus Status);