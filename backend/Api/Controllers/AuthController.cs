using Microsoft.AspNetCore.Mvc;
using TicketingSystem.Application.DTOs.Auth;
using TicketingSystem.Application.Services;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthenticationService _service;

    public AuthController(
        AuthenticationService service)
    {
        _service = service;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp(
        SignUpRequest request)
    {
        await _service.Register(request);

        return Ok();
    }

    [HttpPost("signin")]
    public async Task<ActionResult<AuthResponse>>
        SignIn(
            SignInRequest request)
    {
        var response =
            await _service.Login(request);

        return Ok(response);
    }
}