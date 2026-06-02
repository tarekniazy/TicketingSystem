using FluentValidation;
using TicketingSystem.Application.DTOs.Auth;

namespace TicketingSystem.Application.Validators;

public class SignInRequestValidator
    : AbstractValidator<SignInRequest>
{
    public SignInRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty();
    }
}