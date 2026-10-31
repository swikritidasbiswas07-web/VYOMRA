"""Import VYOMRA's six original demo resources into the running FastAPI backend.

Run from any directory:
    python VYOMRA_Import_Demo_Resources.py

Requires only Python's standard library. The FastAPI server must be running at
http://127.0.0.1:8000 (override with VYOMRA_API_BASE_URL environment variable).
Existing resources are not modified. Safe to run more than once.
"""
import json
import os
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

BASE = os.getenv('VYOMRA_API_BASE_URL', 'http://127.0.0.1:8000').rstrip('/')
RESOURCES = [
    dict(name='Thermal Analyser (TGA)',category='Laboratory Equipment',location='Materials Research Lab',institution='Northbridge Institute',description='Thermogravimetric analysis for polymer and materials samples.',availability='Available',rate=800,unit='session',requirements=['Safety induction','Lab manager approval'],capacity='2-hour slots',image='lab',owner='Dr. Mira Sen',hours=18,features=['Materials testing','Staff-supervised']),
    dict(name='Desktop 3D Printer',category='Fabrication',location='Innovation Workshop, Room 204',institution='Northbridge Institute',description='FDM printer for rapid prototyping and small engineering parts.',availability='Available',rate=150,unit='hour',requirements=['Maker induction'],capacity='1–4 hours',image='printer',owner='Workshop Team',hours=32,features=['PLA / PETG','Beginner friendly']),
    dict(name='Scanning Electron Microscope',category='Laboratory Equipment',location='Central Instrumentation Facility',institution='Northbridge Institute',description='High-resolution surface imaging. Operator supervision required.',availability='Limited',rate=1200,unit='hour',requirements=['Advanced training','Operator supervision'],capacity='1-hour slots',image='microscope',owner='CIF Manager',hours=7,features=['High resolution','Supervised access']),
    dict(name='GPU Workstation',category='Computing',location='Computing Lab, Bay 3',institution='Northbridge Institute',description='GPU-enabled workstation for approved machine-learning workloads.',availability='Available',rate=100,unit='hour',requirements=['Institution account'],capacity='3-hour slots',image='computer',owner='IT Services',hours=41,features=['GPU compute','Remote session possible']),
    dict(name='Portable Camera & Lighting Kit',category='Creative Equipment',location='Media Resource Desk',institution='Northbridge Institute',description='Camera, tripod, two LED panels and microphone for student projects.',availability='Limited',rate=300,unit='day',requirements=['ID verification','Return inspection'],capacity='Full-day loan',image='camera',owner='Media Lab',hours=11,features=['Complete kit','Condition checklist']),
    dict(name='Universal Testing Machine',category='Testing Facility',location='Mechanical Testing Lab',institution='Northbridge Institute',description='Tensile and compression testing with technician-led setup.',availability='Available',rate=950,unit='hour',requirements=['Approved test plan','Technician supervision'],capacity='2-hour slots',image='testing',owner='Testing Lab Manager',hours=14,features=['Tensile testing','Technician-led']),
]

def request(method, path, payload=None):
    data = None if payload is None else json.dumps(payload).encode('utf-8')
    req = Request(BASE + path, data=data, headers={'Content-Type': 'application/json'}, method=method)
    with urlopen(req, timeout=10) as response:
        return json.load(response)

def main():
    print('VYOMRA demo resource importer')
    print('API:', BASE)
    try:
        existing = request('GET', '/api/resources')
        if not isinstance(existing, list):
            raise ValueError('Unexpected API response: expected a list of resources')
    except (URLError, HTTPError, ValueError) as exc:
        print('ERROR: Could not reach the resource API:', exc)
        print('Start FastAPI first, then rerun this script.')
        return 1

    # Match name and institution to avoid duplicating sample entries on reruns.
    known = {(str(r.get('name', '')).casefold(), str(r.get('institution', '')).casefold()) for r in existing}
    created = skipped = failed = 0
    for item in RESOURCES:
        key = (item['name'].casefold(), item['institution'].casefold())
        if key in known:
            print('SKIP   ', item['name'], '(already exists)')
            skipped += 1
            continue
        try:
            saved = request('POST', '/api/resources', item)
            print('CREATED', item['name'], '->', saved.get('id', '?'))
            created += 1
            known.add(key)
        except HTTPError as exc:
            detail = exc.read().decode('utf-8', errors='replace')
            print('FAILED ', item['name'], f'HTTP {exc.code}: {detail}')
            failed += 1
        except (URLError, ValueError) as exc:
            print('FAILED ', item['name'], str(exc))
            failed += 1

    print(f'\nFinished: {created} created, {skipped} already present, {failed} failed.')
    print('Existing spectrometer and its price were not modified.')
    print('Refresh the VYOMRA Resources page to see the imported listings.')
    return 1 if failed else 0

if __name__ == '__main__':
    sys.exit(main())
