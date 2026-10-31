"""VYOMRA FairShare isolated test. Run from backend folder with its venv Python.
Creates only a temporary SQLite database; never touches vyomra.db or Gemini API.
"""
import importlib.util
import json
import os
import sys
from pathlib import Path
import tempfile
from datetime import date, timedelta
from types import SimpleNamespace
from unittest.mock import patch

backend = Path(__file__).resolve().parent
main_path = backend / 'main.py'
if not main_path.exists():
    raise SystemExit('Put this test file beside backend/main.py, then run it from backend.')

with tempfile.TemporaryDirectory(prefix='vyomra-fairshare-test-') as tmp:
    # Set before importing main.py so its engine uses a temporary database.
    os.environ['DATABASE_URL'] = 'sqlite:///' + str(Path(tmp) / 'isolated-test.db').replace('\\', '/')
    os.environ['GEMINI_API_KEY'] = 'LOCAL_MOCK_NO_NETWORK'
    os.environ['GEMINI_MODEL'] = 'gemini-3.5-flash-lite'

    spec = importlib.util.spec_from_file_location('vyomra_isolated_test_main', main_path)
    main = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = main  # Required for SQLAlchemy to resolve Mapped[...] annotations.
    spec.loader.exec_module(main)
    main.Base.metadata.create_all(main.engine)

    with main.SessionLocal() as db:
        resource = main.create_resource(main.ResourceCreate(
            name='FairShare Test pH Meter', category='Laboratory Equipment',
            location='Isolated test lab', owner='Test Lab Owner',
            description='Measures pH of aqueous samples',
            requirements=['Lab safety training'],
        ), db)
        rid = resource['id']
        future_date = (date.today() + timedelta(days=7)).isoformat()
        cases = [
            ('Routine', dict(user='Routine Researcher', purpose='Routine pH measurement of buffer solutions',
                             purposeCategory='Research Need', urgency='Flexible',
                             deadlineExplanation='', evidenceReference='', alternativesConsidered='')),
            ('Referenced deadline', dict(user='Deadline Researcher', purpose='pH measurement before scheduled academic report',
                             purposeCategory='Research Need', urgency='Within 48 hours',
                             deadlineExplanation='Lab report submission in two days',
                             evidenceReference='TEST-COURSE-SCHEDULE-001',
                             alternativesConsidered='Other lab unavailable during scheduled practical')),
            ('Unsupported urgency', dict(user='Urgent Researcher', purpose='Urgent pH measurements for sample preparation',
                             purposeCategory='Research Need', urgency='Time-critical',
                             deadlineExplanation='Need it immediately',
                             evidenceReference='', alternativesConsidered='')),
        ]
        ids = {}
        for label, fields in cases:
            created = main.create_booking(main.BookingCreate(
                resourceId=rid, date=future_date, slot='10:00-12:00', **fields,
            ), db)
            ids[label] = created['id']
            assert created['status'] == 'Pending approval'
            context = db.get(main.BookingContext, created['id'])
            assert context is not None, f'Context not saved: {label}'
            assert context.urgency == fields['urgency'], f'Urgency not persisted: {label}'
            assert context.evidence_reference == fields['evidenceReference'], f'Evidence not persisted: {label}'
        print('PASS: All three competing pending bookings saved with separate context records.')

        def mock_generate_content(*, model, contents, config):
            sent = json.loads(contents)
            assert 'evidenceReference' not in json.dumps(sent), 'Evidence references leaked to Gemini input'
            assert len(sent['requests']) == 3
            reviews = [dict(bookingId=x['bookingId'], suitability='plausible',
                            rationale='Plausible pH meter application; owner must verify.',
                            questions=['Has safety training been completed?']) for x in sent['requests']]
            return SimpleNamespace(text=json.dumps({'reviews': reviews}))

        fake_client = SimpleNamespace(models=SimpleNamespace(generate_content=mock_generate_content))
        with patch.object(main.genai, 'Client', return_value=fake_client):
            result = main.fairshare_ai(main.FairShareAIRequest(resourceId=rid), db)
        assert result['mode'] == 'gemini', result
        rows = {r['bookingId']: r for r in result['requests']}
        routine = rows[ids['Routine']]
        referenced = rows[ids['Referenced deadline']]
        unsupported = rows[ids['Unsupported urgency']]
        assert routine['provisionalScore'] == 0
        assert referenced['provisionalScore'] == 17, referenced
        assert referenced['evidenceVerified'] is False
        assert unsupported['provisionalScore'] == 0, unsupported
        assert unsupported['urgencyClaim'] == 'Time-critical'
        assert unsupported['deadlineDocumented'] is False
        assert all(r['aiReview']['suitability'] == 'plausible' for r in rows.values())
        print('PASS: Mock Gemini assessments mapped to all three requests.')
        print('PASS: Unsupported urgent claim earns zero urgency points.')
        print('PASS: Referenced deadline is scored as self-reported, never verified.')
        print('RESULTS:')
        for label, booking_id in ids.items():
            r = rows[booking_id]
            print(f"  {label}: {r['provisionalScore']}/20 | urgency={r['urgency']} | evidenceProvided={r['evidenceProvided']} | verified={r['evidenceVerified']}")
        print('ALL TESTS PASSED — production database untouched; no Gemini request sent.')

    # Release SQLite file handles before TemporaryDirectory removes the DB on Windows.
    main.engine.dispose()
    print("PASS: Temporary SQLite database connections released for cleanup.")
