using FluentValidation;
using TicketingSystem.Application.DTOs.Tickets;

namespace TicketingSystem.Application.Validators;

public class CreateTicketRequestValidator
    : AbstractValidator<CreateTicketRequest>
{
    public CreateTicketRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MinimumLength(5)
            .MaximumLength(100);

        RuleFor(x => x.Description)
            .NotEmpty()
            .MinimumLength(10)
            .MaximumLength(1000);
    }
}