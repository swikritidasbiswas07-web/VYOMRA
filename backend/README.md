# VYOMRA API — backend foundation

This folder contains the first backend milestone for the VYOMRA prototype.

## Included
- FastAPI service and interactive API docs
- SQLAlchemy database models for resources, bookings, and incidents
- SQLite fallback for local development
- PostgreSQL support via `DATABASE_URL`
- Resource list/create and availability updates
- Booking requests with server-side slot validation and overlap checks
- Owner decision endpoint (approve/reject/waitlist)
- Check-in and return condition records
- Incident creation and review status
- CORS for Vite development servers

## Run locally on Windows PowerShell

From this folder:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

If PowerShell blocks activation, use Command Prompt or run the venv Python directly:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Open:
- `http://127.0.0.1:8000/health` — health check
- `http://127.0.0.1:8000/docs` — interactive API docs

## PostgreSQL setup

1. Create a PostgreSQL database and user.
2. Set `DATABASE_URL` to a connection string, e.g.
   `postgresql+psycopg://vyomra_user:password@localhost:5432/vyomra`.
3. Set `FRONTEND_ORIGINS` to your actual frontend origin(s).
4. Restart the API.

The service creates tables on startup for this prototype. For a production deployment, replace `create_all` with Alembic migrations and configure secrets via the hosting provider.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/resources` | List/search/filter resources |
| POST | `/api/resources` | Create a resource |
| PATCH | `/api/resources/{id}/availability` | Update availability |
| GET | `/api/bookings` | List bookings |
| POST | `/api/bookings` | Submit a booking request |
| PATCH | `/api/bookings/{id}/status` | Approve, reject, or waitlist a pending request |
| POST | `/api/bookings/{id}/check-in` | Record initial condition and check in |
| POST | `/api/bookings/{id}/return` | Record return condition and complete booking |
| GET | `/api/incidents` | List incidents |
| POST | `/api/incidents` | Report an incident |
| PATCH | `/api/incidents/{id}/status` | Mark incident reviewed / needs review |

## Important limitations

This milestone is **not yet connected to the React frontend**. The current frontend continues using its existing `localStorage` demo state until we add the API client and migrate its actions. Authentication/authorization is also not implemented; owner/user identity values are currently supplied by the caller. Do not expose this API publicly or use it to coordinate real access to restricted equipment until authentication, authorization, audit controls, and deployment security are added.
