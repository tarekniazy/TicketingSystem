using TicketingSystem.Application.DTOs.Auth;
using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Application.Interfaces.Security;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Services;

public class AuthenticationService(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IJwtProvider jwtProvider)
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly IJwtProvider _jwtProvider = jwtProvider;

    public async Task Register(
        SignUpRequest request)
    {
        var existing =
            await _userRepository
                .GetByEmail(request.Email);

        if (existing != null)
        {
            throw new Exception(
                "Email already exists.");
        }

        var user = new User(
            request.FirstName,
            request.LastName,
            request.Email,
            _passwordHasher.Hash(
                request.Password));

        await _userRepository.Create(user);
    }

    public async Task<AuthResponse> Login(
        SignInRequest request)
    {
        var user =
            await _userRepository
                .GetByEmail(request.Email);

        if (user == null)
        {
            throw new UnauthorizedAccessException();
        }

        if (!_passwordHasher.Verify(
                request.Password,
                user.PasswordHash))
        {
            throw new UnauthorizedAccessException();
        }

        return new AuthResponse(
            _jwtProvider.Generate(user));
    }
}