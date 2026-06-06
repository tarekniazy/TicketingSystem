# TicketingSystem

A full-stack ticketing application built with ASP.NET Core 8 and React 19. Users can register, log in (email/password or Auth0 SSO), create and manage tickets, and assign them across the team.

---

## Tech Stack

**Backend**
- ASP.NET Core 8 — REST API
- MongoDB — document database
- JWT Bearer — stateless authentication
- Auth0 — SSO / OpenID Connect
- BCrypt.Net-Next — password hashing
- FluentValidation — request validation
- Swagger / Swashbuckle — API docs

**Frontend**
- React 19 + TypeScript — UI
- Vite — build tool & dev server
- React Router 7 — client-side routing
- Material UI 9 — component library
- Auth0 React SDK — SSO integration
- React Hook Form — form state
- Axios — HTTP client

---

## Project Structure

```
TicketingSystem/
├── backend/                    # ASP.NET Core API
│   ├── Api/
│   │   └── Controllers/        # AuthController, TicketsController, UsersController
│   ├── Application/
│   │   ├── DTOs/               # Request / response shapes
│   │   ├── Interfaces/         # Repository + security abstractions
│   │   ├── Services/           # AuthenticationService, TicketService
│   │   └── Validators/         # FluentValidation rules
│   ├── Domain/
│   │   ├── Entities/           # User, Ticket
│   │   ├── Enums/              # TicketStatus, TicketPriority, TicketCategory
│   │   └── Exceptions/         # DomainException
│   ├── Infrastructure/
│   │   ├── Persistence/        # MongoDbContext, MongoDbSettings
│   │   ├── Repositories/       # UserRepository, TicketRepository
│   │   └── Security/           # JwtProvider, PasswordHasher, Auth0Provider
│   ├── Program.cs
│   └── appsettings.json
│
└── frontend/                   # React app
    └── src/
        ├── api/                # authApi, ticketApi, userApi, axiosClient
        ├── components/         # TicketCard, CreateTicketDialog, EditTicketDialog, TicketDetailsDialog
        ├── context/            # AuthContext
        ├── hooks/              # useAuth
        ├── models/             # TypeScript interfaces
        ├── pages/              # LoginPage, SignupPage, HomePage, Auth0CallbackPage
        ├── routes/             # AppRoutes, ProtectedRoute
        └── App.tsx
```

### Architecture

The backend follows Clean Architecture — dependencies point inward from Infrastructure → Application → Domain. Controllers sit in the `Api` layer and depend only on Application services. Infrastructure implementations (MongoDB, JWT, Auth0) are registered via DI and hidden behind interfaces.

---

## Features

### Authentication
- **Email / password sign-up and sign-in** with bcrypt hashing and JWT issuance
- **Auth0 SSO** — "Continue with SSO" button on the login page redirects through Auth0. On callback the frontend sends the Auth0 ID token to the backend, which validates it via OpenID Connect JWKS, auto-provisions the user if they're new, and returns an app JWT
- `PasswordHash` is nullable so SSO users are stored without a password
- Protected routes redirect unauthenticated users to `/login`

### Tickets
- Create tickets with title, description, category, and priority
- View all tickets on the home page
- Edit ticket details
- Update ticket status (e.g. Open → In Progress → Closed)
- Assign tickets to users

### Users
- User listing available for ticket assignment

---

## Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- MongoDB instance (or Atlas connection string)
- Auth0 tenant with a Single Page Application configured

### Backend

```bash
cd backend
dotnet restore
dotnet run
```

The API starts on `https://localhost:7xxx` (check `launchSettings.json`). Swagger UI is available at `/swagger` in development.

**Configuration** (`appsettings.json` or environment variables):

| Key | Description |
|-----|-------------|
| `MongoDb:ConnectionString` | MongoDB connection string |
| `MongoDb:DatabaseName` | Database name |
| `Jwt:Key` | Signing key (min 32 chars) |
| `Jwt:Issuer` | JWT issuer claim |
| `Jwt:Audience` | JWT audience claim |
| `Auth0:Domain` | Auth0 tenant domain (e.g. `example.us.auth0.com`) |
| `Auth0:ClientId` | Auth0 application client ID |

> Use `dotnet user-secrets` or environment variables to keep secrets out of `appsettings.json` in production.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server starts on `http://localhost:5173` and proxies `/api` calls to the backend.

**Environment variables** (`.env`):

```env
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

In Auth0, add `http://localhost:5173/auth/callback` as an **Allowed Callback URL** and `http://localhost:5173` as an **Allowed Logout URL** and **Allowed Web Origin**.

---

## API Endpoints

### Auth — `/api/auth`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/signup` | Register with email + password |
| `POST` | `/auth/signin` | Sign in with email + password → JWT |
| `POST` | `/auth/auth0` | Exchange Auth0 ID token → app JWT |

### Tickets — `/api/tickets`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/tickets` | List all tickets |
| `POST` | `/tickets` | Create a ticket |
| `PUT` | `/tickets/{id}` | Update ticket details |
| `PUT` | `/tickets/{id}/status` | Update ticket status |
| `PUT` | `/tickets/{id}/assign` | Assign ticket to a user |

### Users — `/api/users`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/users` | List all users |

All ticket and user endpoints require a valid `Authorization: Bearer <token>` header.
