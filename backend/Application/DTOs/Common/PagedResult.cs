namespace TicketingSystem.Application.DTOs.Common;

public record PagedResult<T>(
    List<T> Items,
    int PageNumber,
    int PageSize,
    long TotalCount)
{
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
