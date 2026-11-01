"""One-time, idempotent import of the user's VYOMRA demo snapshot into Render PostgreSQL.
Run ONLY with SEED_DEMO_DATA=true. Never overwrites existing rows or deletes data.
Snapshot contains synthetic/demo records; review before sharing publicly.
"""
import os
import json
import base64
import zlib
from datetime import datetime
from sqlalchemy import inspect
from sqlalchemy.orm import Session
from sqlalchemy.types import JSON as JSONType, DateTime as DateTimeType
from main import Base, engine

SNAPSHOT = """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"""
TABLE_ORDER = ['resources', 'bookings', 'booking_contexts', 'incidents', 'safety_reviews', 'proof_events', 'extension_requests', 'notices']

def main():
    if os.getenv("SEED_DEMO_DATA", "").lower() != "true":
        print("Demo seed skipped: set SEED_DEMO_DATA=true to run.")
        return
    if engine.dialect.name != "postgresql":
        raise SystemExit("Safety stop: this import is intended for Render PostgreSQL only.")
    data = json.loads(zlib.decompress(base64.b64decode(SNAPSHOT)).decode("utf-8"))
    Base.metadata.create_all(bind=engine)
    models = {mapper.local_table.name: mapper.class_ for mapper in Base.registry.mappers}
    with Session(engine) as db:
        counts = {}
        for table in TABLE_ORDER:
            model = models[table]
            added = 0
            for source in data[table]:
                row = dict(source)
                for col in inspect(model).columns:
                    value = row.get(col.name)
                    if value is not None and isinstance(col.type, JSONType) and isinstance(value, str):
                        row[col.name] = json.loads(value)
                    elif value is not None and isinstance(col.type, DateTimeType) and isinstance(value, str):
                        row[col.name] = datetime.fromisoformat(value)
                key = tuple(row[c.name] for c in inspect(model).primary_key)
                pk = key[0] if len(key) == 1 else key
                if db.get(model, pk) is None:
                    db.add(model(**row))
                    added += 1
            db.flush()
            counts[table] = added
        db.commit()
    for table, count in counts.items():
        print(f"{table}: {count} new rows imported (existing rows preserved)")
    print("VYOMRA demo import complete.")

if __name__ == "__main__":
    main()
