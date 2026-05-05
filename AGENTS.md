# AGENTS.md

## Stack
- Backend: .NET
- Database: PostgreSQL

## Rules
- Keep the architecture simple, clean, and testable.
- Follow SOLID. Avoid unnecessary abstractions.
- Use EF Core migrations for schema changes.
- Never hardcode secrets. Use environment variables or secure config.
- Validate inputs and return clear HTTP status codes.
- Write production-ready code, not demo code.

## Structure
- Separate API, application, domain, and infrastructure concerns.
- Keep business logic out of controllers.
- Keep data access out of application/service logic.

## Database
- Use PostgreSQL-specific types/features only when they provide real value.
- Add indexes deliberately. Do not guess.
- Make migrations explicit and review them before applying.

## Quality
- Prefer clear naming over clever code.
- Add tests for business-critical behavior.
- Reject over-engineering.

## HTTP / manual checks
- When you add or change an API route, update the project’s `.http` file (e.g. `PokemonAPI/PokemonAPI.http`) in the same change so example requests stay current.
