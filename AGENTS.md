<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Drive Connect Operating Instructions

## Scope
Drive Connect is the customer-facing rental marketplace and operator platform. It
includes the public site, partner onboarding, vehicle search, booking, host and
renter dashboards, messaging, claims, authentication, and the Hetzner-hosted
application/database deployment.

## Working rules
- Treat production deployment, database migrations, authentication changes,
  payment/checkout behavior, bookings, customer/partner email, and claims as
  explicit human-approved operations.
- Never use demo data, test credentials, or seeded vehicle state as if it were
  production truth.
- Never edit production data directly to make a UI appear correct; trace the
  application, schema, and migration path.
- Keep renter and host authorization boundaries strict.

## Working method and done criteria
Start with the affected route, component, API, schema, and deployment boundary.
Define responsive behavior, empty/error states, authorization, tests, and
rollout/rollback before implementation. A change needs relevant tests/build
output, diff review, a deployment plan, and post-deploy verification steps. A
local page load is not a production release.
