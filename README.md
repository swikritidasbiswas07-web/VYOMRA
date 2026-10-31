# VYOMRA — Resource Intelligence Network (Hackathon Starter)

A beige-and-blue React/Vite prototype for discovering and responsibly sharing underused laboratories, equipment and technical spaces.

## Included in this starter

- Responsive landing page and resource directory
- Search and category filtering
- Resource details and booking request form
- User activity page with approval status and booking history
- Owner console: approve, reject or waitlist requests
- Booking lifecycle: approved → check-in condition note → checked out → return condition note → returned
- Incident reporting and review queue
- Owner resource listing form
- Demo impact/utilisation dashboard
- About page, Terms & Conditions draft, and Privacy Policy draft
- Seeded fictional data and browser-local persistence
- Beige / muted blue visual system, responsive layout, accessible focus styles

## Important limitations — read before demo

This is a **frontend-only prototype**. It is not production-ready and must not be used to coordinate real access to restricted facilities. Data is saved to the current browser's `localStorage`; it is not shared across devices or users. The user/owner switch is a demo control, not authentication. There is no real identity verification, QR scanning, image upload, email/SMS notification, payment processing, secure backend, server-side authorisation, or institutional integration. Seeded resource details and utilisation values are illustrative. Terms and Privacy are draft templates and require review against the final deployment and applicable law.

## Run locally

Requires Node.js 20+ (recommended) and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

Build for production preview:

```bash
npm run build
npm run preview
```

## Quick judge demo

1. Open **Resources** and request the Thermal Analyser or another resource. Enter a purpose and date.
2. Open **My activity** to see the request.
3. Open **Owner console**, approve the pending request.
4. Return to **My activity**, click **Check in**, enter a condition note.
5. Click **Return resource**, enter a final condition note.
6. Open **Impact** and **Owner console** to show the activity and audit-like records.
7. Try **List a resource** and **Report issue** to demonstrate additional flows.

The seed data includes an existing pending request from “Aarav Mehta” so the owner approval flow can be demonstrated immediately.

## Reset demo data

Use **Reset demo data** in the footer. Alternatively, clear the site's local storage in browser developer tools. This reset is local to the current browser.

## Before deployment / next engineering steps

1. Add a backend (for example FastAPI or Node) and a real database (PostgreSQL/Supabase).
2. Implement authentication, verified institutional membership, role-based server-side permissions and organisation boundaries.
3. Add server-side slot-conflict detection and transaction-safe booking rules.
4. Store photos in controlled object storage; add access control and retention/deletion rules.
5. Implement notifications, QR code check-in, audit log immutability and incident workflows.
6. Replace all seed data, demo user identities, rates, and policy placeholders with approved information.
7. Test keyboard navigation, mobile layouts, validation, concurrency, access-control failures and data retention.
8. Deploy to a hosting provider and configure environment variables / custom domain as appropriate.

## Suggested stack

- React + Vite
- Lucide React icons
- CSS custom properties and responsive CSS
- Browser localStorage for prototype persistence only

## Build-time disclosure

Use this starter as a scaffold and disclose the template/framework and any AI-assisted code generation according to the hackathon rules. Make sure the team understands, tests, and can explain the code. Confirm that the final product complies with the event's official build-window rules.


## Ownership and 3D hero update

- Requests made by `You` no longer appear in the Owner Console incoming-requests queue. They remain in **My activity**.
- A resource with `owner: 'You'` shows **Manage resource** instead of **View & request**; a guard also blocks self-booking in the submit handler.
- The homepage hero now uses the Three.js GLB viewer (`src/HeroMachine.jsx`). Install dependencies with `npm.cmd install`.
- Copy your actual model to `public/models/lab-machine.glb`. The GLB file itself was not available as an attachment when this ZIP was prepared.
- This is still a browser-local demo, not production authentication or multi-user authorisation.
