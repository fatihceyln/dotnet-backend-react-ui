# AGENTS.md

## Stack
- Frontend: React
- Build tool: Vite

## Rules
- Keep the UI simple, clear, and maintainable.
- Prefer functional React components and hooks.
- Do not hardcode secrets or environment-specific URLs. Use environment variables when needed.
- Validate API responses before rendering.
- Handle loading, empty, and error states explicitly.
- Write production-ready code, not demo code.

## Structure
- Keep business and data-fetching logic out of presentation-only components when complexity grows.
- Keep components small and focused. Split files only when it improves readability.
- Reuse UI patterns deliberately. Do not create abstractions without a real second use case.

## Quality
- Prefer clear naming over clever code.
- Keep state minimal and local unless sharing is necessary.
- Preserve accessibility basics: semantic HTML, button usage, labels, and keyboard-safe interactions.
- Reject over-engineering.
