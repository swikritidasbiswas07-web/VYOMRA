import React, { useEffect, useMemo, useState } from 'react';















import HeroMachine from './HeroMachine';















import { Orbit, Search, ArrowRight, FlaskConical, CalendarDays, ShieldCheck, ChartNoAxesColumn, Menu, X, MapPin, Clock3, Users, CheckCircle2, ClipboardCheck, ScanLine, Plus, SlidersHorizontal, ChevronRight, CircleHelp, FileText, LockKeyhole, Bell, LayoutDashboard, Wrench, Microscope, Laptop, Camera, Building2, LogIn, LogOut, AlertTriangle, Sparkles, Activity, Trash2 } from 'lucide-react';
































const vyomraFetch = (url, options={}) => {
  const token = sessionStorage.getItem('vyomra-judge-token');
  const headers = {...(options.headers||{}), ...(token?{'Authorization':`Bearer ${token}`}:{})};
  return fetch(url, {...options, headers});
};

const seedResources = [















 {id:'R-101',name:'Thermal Analyser (TGA)',category:'Laboratory Equipment',location:'Materials Research Lab',institution:'Northbridge Institute',description:'Thermogravimetric analysis for polymer and materials samples.',availability:'Available',rate:800,unit:'session',requirements:['Safety induction','Lab manager approval'],capacity:'2-hour slots',image:'lab',owner:'Dr. Mira Sen',hours:18,features:['Materials testing','Staff-supervised']},















 {id:'R-102',name:'Desktop 3D Printer',category:'Fabrication',location:'Innovation Workshop, Room 204',institution:'Northbridge Institute',description:'FDM printer for rapid prototyping and small engineering parts.',availability:'Available',rate:150,unit:'hour',requirements:['Maker induction'],capacity:'1–4 hours',image:'printer',owner:'Workshop Team',hours:32,features:['PLA / PETG','Beginner friendly']},















 {id:'R-103',name:'Scanning Electron Microscope',category:'Laboratory Equipment',location:'Central Instrumentation Facility',institution:'Northbridge Institute',description:'High-resolution surface imaging. Operator supervision required.',availability:'Limited',rate:1200,unit:'hour',requirements:['Advanced training','Operator supervision'],capacity:'1-hour slots',image:'microscope',owner:'CIF Manager',hours:7,features:['High resolution','Supervised access']},















 {id:'R-104',name:'GPU Workstation',category:'Computing',location:'Computing Lab, Bay 3',institution:'Northbridge Institute',description:'GPU-enabled workstation for approved machine-learning workloads.',availability:'Available',rate:100,unit:'hour',requirements:['Institution account'],capacity:'3-hour slots',image:'computer',owner:'IT Services',hours:41,features:['GPU compute','Remote session possible']},















 {id:'R-105',name:'Portable Camera & Lighting Kit',category:'Creative Equipment',location:'Media Resource Desk',institution:'Northbridge Institute',description:'Camera, tripod, two LED panels and microphone for student projects.',availability:'Limited',rate:300,unit:'day',requirements:['ID verification','Return inspection'],capacity:'Full-day loan',image:'camera',owner:'Media Lab',hours:11,features:['Complete kit','Condition checklist']},















 {id:'R-106',name:'Universal Testing Machine',category:'Testing Facility',location:'Mechanical Testing Lab',institution:'Northbridge Institute',description:'Tensile and compression testing with technician-led setup.',availability:'Available',rate:950,unit:'hour',requirements:['Approved test plan','Technician supervision'],capacity:'2-hour slots',image:'testing',owner:'Testing Lab Manager',hours:14,features:['Tensile testing','Technician-led']}















];















const starterBookings = [















 {id:'BK-2401',resourceId:'R-103',resourceName:'Scanning Electron Microscope',user:'Aarav Mehta',purpose:'Surface morphology study for materials project',date:new Date().toISOString().slice(0,10),slot:'14:00–15:00',status:'Pending approval',createdAt:'2026-10-30',conditionBefore:'',conditionAfter:'',notes:''},















 {id:'BK-2398',resourceId:'R-102',resourceName:'Desktop 3D Printer',user:'You',purpose:'Prototype enclosure for sensor project',date:'2026-10-31',slot:'11:00–13:00',status:'Approved',createdAt:'2026-10-29',conditionBefore:'',conditionAfter:'',notes:''},















 {id:'BK-2387',resourceId:'R-104',resourceName:'GPU Workstation',user:'You',purpose:'Train an image classification model',date:'2026-10-28',slot:'10:00–13:00',status:'Returned',createdAt:'2026-10-26',conditionBefore:'No visible damage; workstation powered on.',conditionAfter:'Returned in same condition.',notes:''}















];















const initial = () => ({resources:[],bookings:[],incidents:[]});















const money = n => `₹${Number(n).toLocaleString('en-IN')}`;















const statusClass = s => s.toLowerCase().replaceAll(' ','-');



































function SynapsePanel({apiBase,onSelect}) {

  const [prompt,setPrompt] = useState('');

  const [result,setResult] = useState(null);

  const [loading,setLoading] = useState(false);

  const [error,setError] = useState('');

  const suggestions = [

    {label:'Thermal analysis',query:'Analyse thermal stability of polymers'},

    {label:'Surface imaging',query:'Examine surface morphology'},

    {label:'3D prototyping',query:'3D print a prototype'},

    {label:'Machine learning',query:'Train a machine learning model'}

  ];



  const run = async () => {

    if(prompt.trim().length < 3 || loading) return;

    setLoading(true);

    setError('');

    setResult(null);

    try {

      const response = await vyomraFetch(`${apiBase}/api/intelligence/synapse`,{

        method:'POST',

        headers:{'Content-Type':'application/json'},

        body:JSON.stringify({query:prompt.trim(),limit:6})

      });

      const data = await response.json();

      if(!response.ok) throw Error(typeof data.detail==='string' ? data.detail : 'Search failed');

      setResult(data);

    } catch(e) {

      setError(e.message || 'Could not retrieve matches.');

    } finally {

      setLoading(false);

    }

  };



  const matches = Array.isArray(result?.results) ? result.results : [];

  return <section className="synapse-panel" aria-label="Synapse resource discovery">

    <div className="synapse-hero">

      <div className="synapse-orbit synapse-orbit-one" aria-hidden="true"></div>

      <div className="synapse-orbit synapse-orbit-two" aria-hidden="true"></div>

      <div className="synapse-hero-content">

        <div className="synapse-brandline">

          <div className="synapse-symbol"><Sparkles size={23}/></div>

          <div>

            <div className="synapse-kicker">VYOMRA INTELLIGENCE / 01</div>

            <h2>Synapse <span>Discovery</span></h2>

          </div>

          <span className="synapse-live"><span className="synapse-live-dot"></span> Live catalogue</span>

        </div>

        <p className="synapse-intro">Describe your research goal. Find relevant equipment by its listed capabilities, not just its name.</p>

        <div className="synapse-search">

          <Search size={20} className="synapse-search-icon"/>

          <input aria-label="Describe your equipment need" value={prompt}

            onChange={e=>setPrompt(e.target.value)}

            onKeyDown={e=>{if(e.key==='Enter')run()}}

            placeholder="e.g. I need to test tensile strength of polymer samples"/>

          <button className="button synapse-submit" disabled={loading||prompt.trim().length<3} onClick={run}>

            <Sparkles size={16}/>{loading?'Matching…':'Find matches'}<ArrowRight size={16}/>

          </button>

        </div>

        <div className="synapse-prompts">

          <span>TRY A RESEARCH GOAL</span>

          <div className="synapse-chips">

            {suggestions.map(s=><button key={s.label} type="button" onClick={()=>{setPrompt(s.query);setResult(null);setError('')}}>{s.label}<ArrowRight size={12}/></button>)}

          </div>

        </div>

      </div>

    </div>

    {error&&<p role="alert" className="synapse-error"><AlertTriangle size={16}/>{error}</p>}

    {loading&&<div className="synapse-loading" role="status"><span className="synapse-loading-pulse"></span>Checking catalogue descriptions and related concepts…</div>}

    {result&&<div className="synapse-results">

      <div className="synapse-results-heading">

        <div><div className="synapse-section-label">SEARCH RESULTS</div><h3>Recommended resources</h3><p>Ranked by the matching service for your stated research goal.</p></div>

        <span className="synapse-count">{matches.length} {matches.length===1?'match':'matches'}</span>

      </div>

      {matches.length?<div className="synapse-result-grid">

        {matches.map((item,index)=>{

          const r=item.resource;

          const top=index===0;

          return <article className={`synapse-result-card ${top?'synapse-top-match':''}`} key={r.id}>

            <div className="synapse-card-top">

              <div className="synapse-card-icon">{r.category==='Computing'?<Laptop size={23}/>:r.category==='Fabrication'?<Wrench size={23}/>:r.category==='Testing Facility'?<Activity size={23}/>:r.category==='Creative Equipment'?<Camera size={23}/>:<Microscope size={23}/>}</div>

              <div className="synapse-card-title">

                <div className="synapse-card-badges"><span className="synapse-rank">MATCH {String(index+1).padStart(2,'0')}</span>{top&&<span className="synapse-best"><CheckCircle2 size={13}/> Highest-ranked match</span>}</div>

                <h4>{r.name}</h4>

                <p>{r.category} <span>·</span> {r.location||'Location not listed'}</p>

              </div>

              <span className={`synapse-availability ${r.availability==='Available'?'is-available':'is-limited'}`}>{r.availability}</span>

            </div>

            <div className="synapse-card-description">{r.description}</div>

            <div className="synapse-explanation">

              <div className="synapse-explanation-title"><Sparkles size={14}/> Why this appeared</div>

              <p>{Array.isArray(item.reasons)&&item.reasons.length?item.reasons.join(' · '):'Related to terms in your search and the listed resource details.'}</p>

            </div>

            <div className="synapse-card-bottom">

              <div className="synapse-price"><strong>₹{Number(r.rate||0).toLocaleString('en-IN')}</strong><span> / {r.unit||'hour'}</span></div>

              <button className="button button-small" disabled={!item.requestable} onClick={()=>onSelect(r)}>

                {item.requestable?'View & request':'Unavailable'}<ArrowRight size={15}/>

              </button>

            </div>

          </article>;

        })}

      </div>:<div className="synapse-no-results"><Search size={22}/><strong>No supported match found</strong><p>Try a more specific technique, equipment type or research purpose.</p></div>}

      <p className="synapse-disclaimer"><ShieldCheck size={16}/><span>{result.method}. {result.disclaimer}</span></p>

    </div>}

    {!result&&!loading&&<div className="synapse-idle-note"><ShieldCheck size={15}/> Explainable catalogue matching · Human-reviewed access · No automated safety certification</div>}

  </section>;

}



function FairSharePanel({apiBase,resources}) {
  const [id,setId]=useState('');
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [mode,setMode]=useState('ai');
  const [demoOnly,setDemoOnly]=useState(true);
  const inspect=async(nextMode=mode)=>{
    if(!id)return;
    setLoading(true);setError('');setResult(null);
    try {
      const ai=nextMode==='ai';
      const response=await vyomraFetch(ai?`${apiBase}/api/intelligence/fairshare-ai`:`${apiBase}/api/intelligence/fairshare?resource_id=${encodeURIComponent(id)}`,
        ai?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({resourceId:id})}:undefined);
      const data=await response.json();
      if(!response.ok)throw Error(typeof data.detail==='string'?data.detail:'Could not load FairShare review');
      setResult(data);setMode(nextMode);
    }catch(e){setError(e.message||'Could not load FairShare review')}
    finally{setLoading(false)}
  };
  const shownRequests = (result?.requests || []).filter(r => !demoOnly || r.isDemo);
  return <section className="fairshare-ai-panel" aria-label="FairShare allocation intelligence">
    <div className="fairshare-ai-hero">
      <div className="fairshare-ai-orb" aria-hidden="true"/>
      <div className="fairshare-ai-top"><div className="fairshare-ai-symbol"><Users size={22}/></div><span>VYOMRA INTELLIGENCE / 02</span><span className="fairshare-ai-tag"><Sparkles size={13}/> Human-governed AI</span></div>
      <h2>FairShare <span>Intelligence</span></h2>
      <p>Evaluate competing equipment requests with technical context, transparent signals and owner-led decisions. No automatic approvals.</p>
      <div className="fairshare-ai-controls">
        <select aria-label="Choose owned resource" value={id} onChange={e=>{setId(e.target.value);setResult(null)}}>
          <option value="">Select an owned resource</option>
          {resources.map(r=><option value={r.id} key={r.id}>{r.name}</option>)}
        </select>
        <button className="button fairshare-ai-run" onClick={()=>inspect('ai')} disabled={!id||loading}><Sparkles size={16}/>{loading?'Analysing requests…':'Analyse with Gemini'}<ArrowRight size={16}/></button>
        <button className="button button-outline fairshare-ai-queue" onClick={()=>inspect('queue')} disabled={!id||loading}>FIFO queue</button>
      </div>
    </div>
    {error&&<p role="alert" className="fairshare-ai-alert"><AlertTriangle size={16}/>{error}</p>}
    {loading&&<div className="fairshare-ai-loading"><span className="synapse-loading-pulse"/>Checking booking records and review criteria…</div>}
    {result&&<div className="fairshare-ai-results">
      <div className="fairshare-ai-results-head"><div><div className="fairshare-ai-kicker">ALLOCATION REVIEW</div><h3>{result.resourceName}</h3><p>{result.policy}</p></div><span className={`fairshare-ai-mode ${result.mode==='gemini'?'is-gemini':''}`}>{mode==='queue'?'FIFO review':result.mode==='gemini'?'Gemini analysis':'Manual fallback'}</span></div>
      {result.warning&&<p className="fairshare-ai-warning"><ShieldCheck size={16}/>{result.warning}</p>}
      <label style={{display:'flex',alignItems:'center',gap:9,margin:'14px 0',fontSize:13,color:'#244965'}}>
        <input type="checkbox" checked={demoOnly} onChange={e=>setDemoOnly(e.target.checked)}/>
        Judge demo: show only the three protected requests
      </label>
      {demoOnly&&<p className="fairshare-ai-detail">Demo requests are real saved records, protected against status changes in this local demo. Gemini analysis remains live and advisory.</p>}
      {shownRequests.length?<div className="fairshare-ai-cards">{shownRequests.map(r=><article className="fairshare-ai-card" key={r.bookingId}>
        <div className="fairshare-ai-card-head"><div><span className="fairshare-ai-position">QUEUE {String(r.queuePosition).padStart(2,'0')}</span><h4>{r.bookingId} {r.isDemo&&<span style={{fontSize:11,color:"#267c73",fontWeight:600}}>· DEMO</span>}</h4></div><span className="fairshare-ai-suitability">{r.aiReview?.suitability||'Manual review'}</span></div>
        <div className="fairshare-ai-meta"><span><CalendarDays size={14}/>{r.date}</span><span><Clock3 size={14}/>{r.slot}</span>{r.requester&&<span><Users size={14}/>{r.requester}</span>}</div>
        {r.purpose&&<p className="fairshare-ai-purpose">{r.purpose}</p>}
        {r.purposeCategory&&<div className="fairshare-ai-details"><span>{r.purposeCategory}</span><span>Urgency: {r.urgency}</span><span>Claim completeness: {r.provisionalScore}/{r.maxProvisionalScore}</span></div>}
        {r.aiReview?<div className="fairshare-ai-assessment"><strong><Sparkles size={14}/> AI suitability assessment</strong><p>{r.aiReview.rationale}</p>{r.aiReview.questions?.length>0&&<><strong className="fairshare-ai-questions-title">Owner should verify</strong><ul>{r.aiReview.questions.map((q,i)=><li key={i}>{q}</li>)}</ul></>}</div>:<p className="fairshare-ai-assessment">{r.recommendation} {r.explanation}</p>}
        {r.conflicts?.length>0&&<p className="v-alert"><AlertTriangle size={15}/> Competing for the same slot: {r.conflicts.join(', ')}</p>}
        {r.deadlineWarnings?.map((w,i)=><p className="v-alert" key={i}><AlertTriangle size={15}/> {w}</p>)}
        {r.priorityBasis&&<p className="fairshare-ai-detail"><strong>Scoring basis:</strong> {r.priorityBasis}</p>}
        {r.evidenceReference&&<p className="fairshare-ai-detail"><strong>Evidence reference (unverified):</strong> {r.evidenceReference}</p>}
        {r.deadlineExplanation&&<p className="fairshare-ai-detail"><strong>Deadline claim:</strong> {r.deadlineExplanation}</p>}
        {r.alternativesConsidered&&<p className="fairshare-ai-detail"><strong>Alternatives considered:</strong> {r.alternativesConsidered}</p>}
        
        <div className="fairshare-ai-card-foot"><ShieldCheck size={14}/>Owner verification and approval required</div>
      </article>)}</div>:<div className="fairshare-ai-empty"><ClipboardCheck size={25}/><h4>No pending requests</h4><p>New booking requests for this resource will appear here.</p></div>}
      <p className="fairshare-ai-note">{result.note} AI output cannot verify claims, credentials or safety; the owner makes the final decision.</p>
    </div>}
  </section>;
}


function SentinelPanel({apiBase,bookings,onChanged}) {
  const [bookingId,setBookingId]=useState('');
  const [review,setReview]=useState(null);
  const [checks,setChecks]=useState({trainingVerified:false,approvalVerified:false,supervisionArranged:false,conditionChecked:false,notes:'',reviewer:'Demo owner'});
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const eligible=bookings.filter(b=>!['Returned','Rejected','Waitlisted','Checked out'].includes(b.status)&&!['BK-582695','BK-278676','BK-694517'].includes(b.id));
  useEffect(()=>{if(!bookingId){setReview(null);return;}let active=true;setError('');vyomraFetch(`${apiBase}/api/sentinel/bookings/${encodeURIComponent(bookingId)}`).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.detail||'Could not load');return d}).then(d=>{if(active){setReview(d);setChecks({trainingVerified:d.verified.training,approvalVerified:d.verified.approval,supervisionArranged:d.verified.supervision,conditionChecked:d.verified.condition,notes:d.notes||'',reviewer:d.reviewer||'Demo owner'});}}).catch(e=>{if(active)setError(e.message)});return()=>{active=false}},[bookingId,apiBase]);
  const save=async()=>{setBusy(true);setError('');try{const r=await vyomraFetch(`${apiBase}/api/sentinel/bookings/${bookingId}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(checks)});const d=await r.json();if(!r.ok)throw Error(d.detail||'Could not save');setReview(d);onChanged?.();}catch(e){setError(e.message)}finally{setBusy(false)}};
  return <section className="v-module" aria-label="Sentinel safety intelligence">
    <div className="v-module-heading"><div><div className="eyebrow">VYOMRA INTELLIGENCE / 03</div><h2><ShieldCheck size={22}/> Sentinel Safety</h2><p>Verify mandatory access conditions before approving an ordinary booking. Owner attestations are not external credential verification.</p></div></div>
    <label>Choose a booking for safety review<select value={bookingId} onChange={e=>setBookingId(e.target.value)}><option value="">Select a booking</option>{eligible.map(b=><option key={b.id} value={b.id}>{b.id} · {b.resourceName} · {b.user}</option>)}</select></label>
    {error&&<p className="v-alert">{error}</p>}
    {review&&<><div className="v-review-grid">{[['training','trainingVerified','Training / induction'],['approval','approvalVerified','Prior approval'],['supervision','supervisionArranged','Supervisor / operator'],['condition','conditionChecked','Equipment condition']].map(([key,field,label])=><label className="v-check" key={key}><input type="checkbox" checked={checks[field]} onChange={e=>setChecks(v=>({...v,[field]:e.target.checked}))}/><span><strong>{label}</strong><small>{review.requirements[key]?'Required for this listing':'Not explicitly required by listing'}</small></span></label>)}</div><label>Owner verification notes<textarea rows="2" value={checks.notes} onChange={e=>setChecks(v=>({...v,notes:e.target.value}))} placeholder="Record how checks were confirmed; do not include sensitive identifiers"/></label><div className="v-actionline"><button className="button" disabled={busy} onClick={save}>{busy?'Saving…':'Save safety review'}</button><span className={review.readyForOwnerDecision?'v-ok':'v-pending'}>{review.readyForOwnerDecision?'Checks recorded · ready for owner decision':`Missing: ${review.missing.join(', ')}`}</span></div><p className="v-footnote">{review.warning}</p></>}
    {!bookingId&&<p className="v-footnote">The three protected judge-demo requests stay untouched. Select another pending request to demonstrate safety verification and approval gating.</p>}
  </section>
}

function ProofChainPanel({apiBase,bookings}) {
  const [id,setId]=useState('');const [data,setData]=useState(null);const [error,setError]=useState('');
  useEffect(()=>{if(!id){setData(null);return;}let active=true;setError('');vyomraFetch(`${apiBase}/api/proofchain/bookings/${encodeURIComponent(id)}`).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.detail||'Could not load history');return d}).then(d=>{if(active)setData(d)}).catch(e=>{if(active)setError(e.message)});return()=>{active=false}},[id,apiBase]);
  return <section className="v-module"><div className="v-module-heading"><div><div className="eyebrow">VYOMRA TRUST / 04</div><h2><ClipboardCheck size={22}/> ProofChain Ledger</h2><p>Server-recorded booking transitions, condition notes and incident events.</p></div></div><label>Inspect booking history<select value={id} onChange={e=>setId(e.target.value)}><option value="">Choose a booking</option>{bookings.map(b=><option key={b.id} value={b.id}>{b.id} · {b.resourceName} · {b.status}</option>)}</select></label>{error&&<p className="v-alert">{error}</p>}{data&&<><div className="v-timeline">{data.events.map((ev,i)=><div className="v-event" key={i}><span className="v-event-dot"/><div><strong>{ev.action}</strong><p>{ev.details}</p><small>{ev.actor} · {ev.occurredAt}</small></div></div>)}</div><p className="v-footnote">{data.note}</p></>}</section>
}

function ImpactDashboard({apiBase}) {
  const [data,setData]=useState(null);const [error,setError]=useState('');const [loading,setLoading]=useState(true);
  const load=()=>{setLoading(true);setError('');vyomraFetch(`${apiBase}/api/impact/summary`).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.detail||'Could not load metrics');return d}).then(setData).catch(e=>setError(e.message)).finally(()=>setLoading(false))};
  useEffect(()=>{load()},[apiBase]);
  return <section className="page-section wrap"><div className="eyebrow spaced">MEASURE WHAT MATTERS</div><div className="page-title-row"><div><h1>Idle-to-Impact</h1><p className="muted">Real counts and calculated booking hours from the connected database.</p></div><button className="button button-outline" onClick={load}>Refresh metrics</button></div>{loading&&<p>Loading live metrics…</p>}{error&&<p className="v-alert">{error}</p>}{data&&<><div className="v-metric-grid">{[['Resources listed',data.resourcesListed],['Requests submitted',data.totalRequests],['Pending review',data.pendingRequests],['Completed returns',data.completedReturns],['Completed usage hours',data.completedUsageHours],['Confirmed booked hours',data.confirmedBookedHours],['Open incidents',data.openIncidents],['Utilisation rate','Not measured']].map(([label,value])=><div className="v-metric" key={label}><small>{label}</small><strong>{value}</strong></div>)}</div><div className="v-module"><div className="v-module-heading"><div><h2>Usage by resource</h2><p>Completed hours count only bookings marked Returned; no fabricated capacity percentage.</p></div></div><div className="v-bars">{data.resourceBreakdown.map(r=><div className="v-bar-row" key={r.id}><div><strong>{r.name}</strong><small>{r.completedReturns} returns · {r.requests} requests</small></div><div className="v-bar-track"><span style={{width:`${data.completedUsageHours?Math.max(0,100*r.completedHours/data.completedUsageHours):0}%`}}/></div><b>{r.completedHours} h</b></div>)}</div></div><p className="v-footnote">{data.note}</p></>}</section>
}


function LifecycleOperations({apiBase,bookings,onChanged,viewer,ownerMode=false}) {
  const [extensions,setExtensions]=useState([]);
  const [notices,setNotices]=useState([]);
  const [fairUse,setFairUse]=useState(null);
  const [overdue,setOverdue]=useState([]);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const [selected,setSelected]=useState('');
  const [reason,setReason]=useState('');
  const [slot,setSlot]=useState('10:00–13:00');
  const demoIds=new Set(['BK-582695','BK-278676','BK-694517']);
  const load=async()=>{
    try {
      const paths=[`/api/extensions`,`/api/notifications?recipient=${encodeURIComponent(viewer||'You')}`,`/api/fair-use/summary`,`/api/overdue`];
      const responses=await Promise.all(paths.map(x=>vyomraFetch(apiBase+x)));
      const data=await Promise.all(responses.map(async r=>{const d=await r.json();if(!r.ok)throw Error(d.detail||'Could not load operations');return d}));
      setExtensions(data[0]);setNotices(data[1]);setFairUse(data[2]);setOverdue(data[3]);
    }catch(e){setError(e.message)}
  };
  useEffect(()=>{load()},[apiBase,viewer]);
  const send=async(path,method,payload)=>{
    setBusy(true);setError('');setMessage('');
    try {
      const response=await vyomraFetch(apiBase+path,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data=await response.json();if(!response.ok)throw Error(typeof data.detail==='string'?data.detail:'Request failed');
      setMessage('Saved successfully. ProofChain and booking status have been updated.');
      setReason('');await load();await onChanged?.();
    }catch(e){setError(e.message)}finally{setBusy(false)}
  };
  const editable=bookings.filter(b=>!demoIds.has(b.id));
  const selectedBooking=editable.find(b=>b.id===selected);
  return <section className="v-module" aria-label="Booking lifecycle operations">
    <div className="v-module-heading"><div><div className="eyebrow">VYOMRA OPERATIONS / 05</div><h2><CalendarDays size={22}/> Lifecycle & Fair Access</h2><p>Cancellation, extension approval, activity notifications and transparent usage warnings. Demo identities are not authenticated.</p></div><button className="button button-outline" onClick={load}>Refresh</button></div>
    {error&&<p className="v-alert">{error}</p>}{message&&<p className="v-ok">{message}</p>}
    <div className="v-ops-grid"><div className="v-ops-card"><h3>Booking actions</h3><label>Choose an ordinary booking<select value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Select booking</option>{editable.map(b=><option key={b.id} value={b.id}>{b.id} · {b.resourceName} · {b.status}</option>)}</select></label>
    {selectedBooking&&<><p className="v-footnote">{selectedBooking.date} · {selectedBooking.slot} · {selectedBooking.user}</p><label>Reason for action<textarea rows="2" value={reason} onChange={e=>setReason(e.target.value)} placeholder="Explain why (minimum 5 characters)"/></label>
    <div className="v-actionline">{['Pending approval','Approved','Waitlisted'].includes(selectedBooking.status)&&<button className="button button-outline" disabled={busy||reason.trim().length<5} onClick={()=>{if(window.confirm('Cancel this test booking?'))send(`/api/bookings/${selected}/cancel`,'POST',{reason})}}>Cancel booking</button>}
    {['Approved','Checked out'].includes(selectedBooking.status)&&<><label>Proposed extended slot<input value={slot} onChange={e=>setSlot(e.target.value)} placeholder="10:00–13:00"/></label><button className="button" disabled={busy||reason.trim().length<5} onClick={()=>send(`/api/bookings/${selected}/extensions`,'POST',{proposedSlot:slot,reason})}>Request extension</button></>}</div></>}</div>
    <div className="v-ops-card"><h3>Extension decisions</h3>{extensions.filter(x=>x.status==='Pending'&&bookings.some(b=>b.id===x.bookingId)).length===0?<p className="muted">No pending extension requests.</p>:extensions.filter(x=>x.status==='Pending'&&bookings.some(b=>b.id===x.bookingId)).map(x=><div className="v-ops-entry" key={x.id}><strong>{x.bookingId} → {x.proposedSlot}</strong><p>{x.reason}</p>{ownerMode&&<div className="v-actionline"><button className="button button-small" disabled={busy} onClick={()=>send(`/api/extensions/${x.id}`,'PATCH',{decision:'Approved'})}>Approve extension</button><button className="button button-outline" disabled={busy} onClick={()=>send(`/api/extensions/${x.id}`,'PATCH',{decision:'Rejected'})}>Reject</button></div>}</div>)}</div>
    <div className="v-ops-card"><h3>Notifications</h3>{notices.length===0?<p className="muted">No notifications for this demo profile yet.</p>:notices.slice(0,6).map(n=><p className="v-ops-entry" key={n.id}>{n.message}<small>{n.createdAt}</small></p>)}</div>
    <div className="v-ops-card"><h3>Fair-use & overdue signals</h3><p className="v-footnote">{fairUse?.policy||'Loading fair-use summary…'}</p>{fairUse?.users.filter(x=>x.reviewSuggested).map(x=><p key={x.user} className="v-ops-entry">Review suggested: {x.user} has {x.activeRequests} active requests.</p>)}{overdue.length===0?<p className="muted">No overdue checked-out bookings detected.</p>:overdue.map(x=><p className="v-ops-entry" key={x.bookingId}>Overdue: {x.bookingId} · {x.resourceName} · {x.user}</p>)}</div></div>
    <p className="v-footnote">Fair-use warnings are advisory. Overdue estimates use the recorded booking date and slot interpreted as UTC; institution time-zone configuration is required before real deployment. Cancellation and extension actions are not role-secured in this demo.</p>
  </section>
}

function App(){















 const [db,setDb]=useState(initial); const [page,setPage]=useState('Home'); const [query,setQuery]=useState(''); const [category,setCategory]=useState('All resources'); const [selected,setSelected]=useState(null); const [modal,setModal]=useState(''); const [toast,setToast]=useState(''); const [role,setRole]=useState('User'); const [form,setForm]=useState({purpose:'',purposeCategory:'General/Other',urgency:'Flexible',deadlineExplanation:'',evidenceReference:'',alternativesConsidered:'',date:new Date().toISOString().slice(0,10),slot:'10:00–12:00',condition:'',notes:''}); const [newResource,setNewResource]=useState({name:'',category:'Laboratory Equipment',location:'',description:'',rate:'',requirements:''});















 const [profile,setProfile]=useState(()=>{try{return JSON.parse(localStorage.getItem('vyomra-profile-v1')||'null')}catch{return null}}); const [authMode,setAuthMode]=useState('signup'); const [authForm,setAuthForm]=useState({fullName:'',email:'',phone:'',institution:'',department:'',designation:'',institutionId:'',password:'',confirmPassword:'',truthful:false}); const [safetyAccepted,setSafetyAccepted]=useState(false); const [busy,setBusy]=useState(false); const [apiStatus,setApiStatus]=useState('checking'); const API_BASE=(import.meta.env.VITE_API_BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');















  const api = async (path, options={}) => {







  const response = await vyomraFetch(`${API_BASE}${path}`, {headers:{'Content-Type':'application/json'},...options});







  if (!response.ok) {let message=`API error ${response.status}`;try{const body=await response.json();message=typeof body.detail==='string'?body.detail:message}catch{}throw new Error(message)}







  return response.json();







 };







 const refresh = async () => {







  const [resources,bookings,incidents]=await Promise.all([api('/api/resources'),api('/api/bookings'),api('/api/incidents')]);







  setDb({resources,bookings,incidents});setApiStatus('connected');







 };







 useEffect(()=>{let live=true;Promise.all([







  vyomraFetch(`${API_BASE}/api/resources`),vyomraFetch(`${API_BASE}/api/bookings`),vyomraFetch(`${API_BASE}/api/incidents`)







 ]).then(async responses=>{if(responses.some(r=>!r.ok))throw new Error('API unavailable');return Promise.all(responses.map(r=>r.json()))})







 .then(([resources,bookings,incidents])=>{if(live){setDb({resources,bookings,incidents});setApiStatus('connected')}})







 .catch(()=>{if(live)setApiStatus('offline')});const timer=setInterval(()=>{Promise.all([vyomraFetch(`${API_BASE}/api/resources`),vyomraFetch(`${API_BASE}/api/bookings`),vyomraFetch(`${API_BASE}/api/incidents`)]).then(async rs=>{if(rs.some(r=>!r.ok))throw Error('API unavailable');return Promise.all(rs.map(r=>r.json()))}).then(([resources,bookings,incidents])=>{if(live){setDb({resources,bookings,incidents});setApiStatus('connected')}}).catch(()=>{if(live)setApiStatus('offline')})},12000);return()=>{live=false;clearInterval(timer)}},[API_BASE]);







 useEffect(()=>{if(profile)localStorage.setItem('vyomra-profile-v1',JSON.stringify(profile))},[profile]);







useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(''),3200);return()=>clearTimeout(t)}},[toast]);















 const resources=useMemo(()=>db.resources.filter(r=>(category==='All resources'||r.category===category)&&`${r.name} ${r.category} ${r.location} ${r.description}`.toLowerCase().includes(query.toLowerCase())),[db.resources,query,category]);















 const myResources=useMemo(()=>db.resources.filter(r=>(r.owner==='You'||r.owner===profile?.fullName)),[db.resources,profile?.fullName]);















 const myResourceIds=useMemo(()=>new Set(myResources.map(r=>r.id)),[myResources]);















 const incomingRequests=useMemo(()=>db.bookings.filter(b=>myResourceIds.has(b.resourceId)&&b.user!==(profile?.fullName||'You')),[db.bookings,myResourceIds,profile?.fullName]);















 const myBookings=useMemo(()=>db.bookings.filter(b=>myResourceIds.has(b.resourceId)),[db.bookings,myResourceIds]);















 const myBookingIds=useMemo(()=>new Set(myBookings.map(b=>b.id)),[myBookings]);















 const myIncidents=useMemo(()=>db.incidents.filter(i=>myBookingIds.has(i.bookingId)||myResources.some(r=>r.name===i.resourceName)),[db.incidents,myBookingIds,myResources]);















 const updateBooking=(id,changes)=>setDb(d=>({...d,bookings:d.bookings.map(b=>b.id===id?{...b,...changes}:b)}));















 const requestBooking = async () => {







  if (!selected||!form.purpose.trim()||!form.date) {setToast('Complete the purpose and date fields.');return}







  if (selected.owner==='You'||selected.owner===profile?.fullName){setToast('You cannot book your own resource.');return}







  if(busy)return;setBusy(true);







  try {const booking=await api('/api/bookings',{method:'POST',body:JSON.stringify({resourceId:selected.id,user:profile?.fullName||'You',purpose:form.purpose.trim(),purposeCategory:form.purposeCategory,urgency:form.urgency,deadlineExplanation:form.deadlineExplanation.trim(),evidenceReference:form.evidenceReference.trim(),alternativesConsidered:form.alternativesConsidered.trim(),date:form.date,slot:form.slot})});







   setDb(d=>({...d,bookings:[booking,...d.bookings.filter(b=>b.id!==booking.id)]}));setModal('');setSelected(null);setPage('My activity');setToast('Request submitted to the backend for owner review.');







  }catch(error){setToast(error.message)}finally{setBusy(false)}







 };







 const changeBookingStatus=async(id,status)=>{if(busy)return;setBusy(true);try{const saved=await api(`/api/bookings/${id}/status`,{method:'PATCH',body:JSON.stringify({status})});setDb(d=>({...d,bookings:d.bookings.map(b=>b.id===id?saved:b)}));setToast(`Request ${status.toLowerCase()}.`)}catch(e){setToast(e.message)}finally{setBusy(false)}};







 const handover=async(kind)=>{if(busy||!selected)return;if(form.condition.trim().length<3){setToast('Add a condition note of at least 3 characters.');return}setBusy(true);try{const saved=await api(`/api/bookings/${selected.id}/${kind==='checkin'?'check-in':'return'}`,{method:'POST',body:JSON.stringify(kind==='checkin'?{conditionBefore:form.condition.trim()}:{conditionAfter:form.condition.trim(),notes:form.notes})});setDb(d=>({...d,bookings:d.bookings.map(b=>b.id===saved.id?saved:b)}));setForm(f=>({...f,condition:'',notes:''}));setModal('');setToast(kind==='checkin'?'Check-in recorded.':'Return recorded.')}catch(e){setToast(e.message)}finally{setBusy(false)}};







 const changeAvailability=async(r)=>{if(busy)return;setBusy(true);try{const next=r.availability==='Available'?'Limited':'Available';const saved=await api(`/api/resources/${r.id}/availability`,{method:'PATCH',body:JSON.stringify({availability:next})});setDb(d=>({...d,resources:d.resources.map(x=>x.id===r.id?saved:x)}));setToast(`${r.name} marked ${next.toLowerCase()}.`)}catch(e){setToast(e.message)}finally{setBusy(false)}};







 const reviewIncident=async(i)=>{if(busy)return;setBusy(true);try{const saved=await api(`/api/incidents/${i.id}/status`,{method:'PATCH',body:JSON.stringify({status:'Reviewed'})});setDb(d=>({...d,incidents:d.incidents.map(x=>x.id===i.id?saved:x)}));setToast('Incident marked reviewed.')}catch(e){setToast(e.message)}finally{setBusy(false)}};







 const addResource=async()=>{if(!newResource.name.trim()||!newResource.location.trim()){setToast('Add a resource name and location.');return}if(!safetyAccepted){setModal('safety-declaration');return}if(busy)return;setBusy(true);







 const payload={...newResource,rate:Number(newResource.rate)||0,unit:'hour',requirements:newResource.requirements.split(',').map(x=>x.trim()).filter(Boolean),capacity:'By approval',owner:profile?.fullName||'You',institution:profile?.institution||'Your institution',hours:0,features:[],image:'lab',availability:'Available'};







 try{const saved=await api('/api/resources',{method:'POST',body:JSON.stringify(payload)});setDb(d=>({...d,resources:[saved,...d.resources]}));setApiStatus('connected');setNewResource({name:'',category:'Laboratory Equipment',location:'',description:'',rate:'',requirements:''});setSafetyAccepted(false);setModal('');setToast('Resource published to shared backend.');setPage('Resources')}







 catch(e){setToast(`Listing not published: ${e.message}`)}finally{setBusy(false)}







 };








 const demoProfiles=[
  {fullName:'Rahul Roy',email:'rahul.roy@vyomra-demo.example',phone:'Demo only',institution:'VYOMRA Demo Institution',department:'Materials Testing Laboratory',designation:'Lab owner / researcher',institutionId:'DEMO-OWNER-01'},
  {fullName:'Researcher A',email:'researcher.a@vyomra-demo.example',phone:'Demo only',institution:'VYOMRA Demo Institution',department:'Chemical Engineering',designation:'Researcher',institutionId:'DEMO-RESEARCHER-A'},
  {fullName:'Researcher B',email:'researcher.b@vyomra-demo.example',phone:'Demo only',institution:'VYOMRA Demo Institution',department:'Chemical Engineering',designation:'Researcher',institutionId:'DEMO-RESEARCHER-B'},
  {fullName:'Researcher C',email:'researcher.c@vyomra-demo.example',phone:'Demo only',institution:'VYOMRA Demo Institution',department:'Chemical Engineering',designation:'Researcher',institutionId:'DEMO-RESEARCHER-C'},
 ];
 const enterDemo=async(demo)=>{
    const accessCode=window.prompt(`Enter the ${demo.fullName==='Rahul Roy'?'OWNER':'RESEARCHER'} demo access code:`);
    if(!accessCode)return;
    try {
      const response=await fetch(`${API_BASE}/api/demo/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:demo.fullName,accessCode})});
      const data=await response.json();
      if(!response.ok)throw Error(data.detail||'Demo login failed');
      sessionStorage.setItem('vyomra-judge-token',data.token);
      const next={...demo,demoAccount:true,truthfulnessAcceptedAt:null,truthfulnessVersion:'judge-v2'};
      localStorage.setItem('vyomra-profile-v1',JSON.stringify(next));setProfile(next);
      setRole(demo.fullName==='Rahul Roy'?'Owner':'User');
      setPage(demo.fullName==='Rahul Roy'?'Owner console':'My activity');
      setToast(`Authenticated demo profile: ${demo.fullName}`);
    }catch(error){setToast(error.message)}
  };
 const submitAuth=(e)=>{e.preventDefault();if(authMode==='signup'){if(!authForm.truthful){setToast('Please accept the truthfulness declaration.');return}if(authForm.password.length<8){setToast('Use a password with at least 8 characters.');return}if(authForm.password!==authForm.confirmPassword){setToast('Passwords do not match.');return}const next={fullName:authForm.fullName.trim(),email:authForm.email.trim().toLowerCase(),phone:authForm.phone.trim(),institution:authForm.institution.trim(),department:authForm.department.trim(),designation:authForm.designation.trim(),institutionId:authForm.institutionId.trim(),truthfulnessAcceptedAt:new Date().toISOString(),truthfulnessVersion:'v1'};if(!next.fullName||!next.email||!next.phone||!next.institution||!next.department||!next.designation||!next.institutionId){setToast('Complete all required profile fields.');return}localStorage.setItem('vyomra-demo-account-email',next.email);setProfile(next);setToast('Demo profile created on this device. Email verification and secure server-side authentication are not enabled yet.');setPage('Home')}else{const saved=localStorage.getItem('vyomra-profile-v1');let p=null;try{p=JSON.parse(saved||'null')}catch{}if(!p||p.email!==authForm.email.trim().toLowerCase()){setToast('No matching demo profile found on this device. Create a profile first.');return}setProfile(p);setPage('Home');setToast('Demo profile opened. This is device-local access, not secure production login.')}};















 const reportIncident=async(b)=>{const description=prompt('Describe the delay, damage or incident.');if(!description?.trim())return;try{const saved=await api('/api/incidents',{method:'POST',body:JSON.stringify({bookingId:b.id,description:description.trim()})});setDb(d=>({...d,incidents:[saved,...d.incidents]}));setToast('Incident recorded on the backend.')}catch(e){setToast(e.message)}};







 const nav=role==='Owner' ? ['Home','Resources','Owner console','Impact','About'] : ['Home','Resources','My activity','Impact','About'];















 const go=p=>{setPage(p);setSelected(null);window.scrollTo({top:0,behavior:'smooth'})};















 const IconFor=({type,size=22})=>{const props={size,strokeWidth:1.7};if(type==='Fabrication')return <Wrench {...props}/>;if(type==='Computing')return <Laptop {...props}/>;if(type==='Creative Equipment')return <Camera {...props}/>;if(type==='Testing Facility')return <Activity {...props}/>;if(type==='Laboratory Equipment')return <Microscope {...props}/>;return <Building2 {...props}/>};















 const ResourceCard=({r})=><article className="resource-card" key={r.id}><div className={`resource-art art-${r.image||'lab'}`}><div className="art-orbit"><IconFor type={r.category} size={36}/></div><span className="availability"><span className={`dot ${r.availability==='Limited'?'amber':''}`}></span>{r.availability}</span></div><div className="resource-body"><div className="eyebrow">{r.category}</div><h3>{r.name}</h3><p className="muted small"><MapPin size={14}/>{r.location}</p><p className="description">{r.description}</p><div className="tag-row">{r.requirements.slice(0,2).map(t=><span className="tag" key={t}>{t}</span>)}</div><div className="card-bottom"><div><strong>{money(r.rate)}</strong><span className="muted small"> / {r.unit}</span></div><button className="button button-small" onClick={()=>{if((r.owner==='You'||r.owner===profile?.fullName)){go('Owner console');setToast('This is your listing. Manage it from the Owner Console.');}else if(role==='Owner'){setToast('Owner mode is for managing your own listings. Switch to User view to submit a booking request.');}else{setSelected(r);setModal('request');}}}>{(r.owner==='You'||r.owner===profile?.fullName)?'Manage resource':role==='Owner'?'View listing':'View & request'} <ArrowRight size={15}/></button></div></div></article>;















 const home=()=> <>















  <section className="hero wrap"><div className="hero-copy"><div className="eyebrow spaced">IDLE ASSETS. INFINITE POSSIBILITIES.</div><h1>Access. Innovate.<br/><span>Go Further.</span></h1><p className="hero-lead">VYOMRA connects people with specialised laboratories, equipment and technical spaces, turning underused resources into new opportunities for research and innovation.</p><div className="hero-search"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="What do you need access to?" onKeyDown={e=>e.key==='Enter'&&go('Resources')}/><select aria-label="Resource category" value={category} onChange={e=>setCategory(e.target.value)}><option>All resources</option>{[...new Set(db.resources.map(r=>r.category))].map(c=><option key={c}>{c}</option>)}</select><button className="button" onClick={()=>go('Resources')}>Search</button></div><div className="popular"><span>Popular searches:</span>{['SEM','3D Printer','Clean Room','Thermal Analyser'].map(t=><button key={t} onClick={()=>{setQuery(t==='SEM'?'Scanning Electron Microscope':t);go('Resources')}}>{t}</button>)}</div></div><div className="hero-visual"><div className="hero-blob"></div><div className="hero-image"><HeroMachine /><div className="image-caption"><span className="eyebrow">RESOURCE INTELLIGENCE</span><h3>Shared resources.<br/>Stronger innovation.</h3><p>Discover verified facilities, request access and manage every handover with confidence.</p><button className="round-button" onClick={()=>go('Resources')} aria-label="Explore resources"><ArrowRight size={19}/></button></div></div><div className="floating-note"><ChartNoAxesColumn size={25}/><div><strong>Real equipment</strong><span>Real opportunities</span></div></div></div></section>















  <section className="benefits wrap"><div className="benefit"><span className="benefit-icon"><FlaskConical/></span><div><h3>Verified resources</h3><p>Access trusted laboratories and equipment.</p></div></div><div className="benefit"><span className="benefit-icon"><CalendarDays/></span><div><h3>Transparent access</h3><p>Fair and explainable allocation.</p></div></div><div className="benefit"><span className="benefit-icon"><ShieldCheck/></span><div><h3>Safe and accountable</h3><p>Eligibility checks and traceable usage.</p></div></div><div className="benefit"><span className="benefit-icon"><ChartNoAxesColumn/></span><div><h3>Greater impact</h3><p>Higher utilisation for stronger innovation.</p></div></div></section>















  <section className="how-section"><div className="wrap"><div className="section-heading"><div><div className="eyebrow spaced">HOW VYOMRA WORKS</div><h2>From need to impact, in a few steps.</h2></div><p>A simple, transparent and accountable process to discover, request and use shared resources.</p></div><div className="steps">{[{n:'01',title:'Discover',desc:'Search laboratories, equipment or workspaces.',icon:<Search/>},{n:'02',title:'Request',desc:'Submit a request with your requirements.',icon:<FileText/>},{n:'03',title:'Get approved',desc:'Eligibility and allocation are reviewed.',icon:<ShieldCheck/>},{n:'04',title:'Use the resource',desc:'Complete check-in, use and check-out.',icon:<ScanLine/>},{n:'05',title:'Create impact',desc:'Help improve utilisation and opportunity.',icon:<ChartNoAxesColumn/>}].map((s,i)=><div className="step" key={s.n}><span className="step-number">{s.n}</span>{s.icon}<h3>{s.title}</h3><p>{s.desc}</p>{i<4&&<ArrowRight className="step-arrow" size={18}/>}</div>)}</div><div className="center"><button className="button" onClick={()=>go('Resources')}>Explore resources <ArrowRight size={16}/></button></div></div></section>















  <section className="featured wrap"><div className="section-heading"><div><div className="eyebrow spaced">AVAILABLE TO EXPLORE</div><h2>Make more of what exists.</h2></div><button className="text-button" onClick={()=>go('Resources')}>View all resources <ArrowRight size={16}/></button></div><div className="resource-grid">{db.resources.slice(0,3).map(r=><ResourceCard r={r} key={r.id}/>)}</div></section>















 </>;















 const resourcesPage=()=> <section className="page-section wrap"><div className="page-title-row"><div><div className="eyebrow spaced">RESOURCE DIRECTORY</div><h1>Find what you need.</h1><p className="muted">Explore verified equipment, laboratories and technical spaces.</p></div><button className="button" onClick={()=>setModal('add-resource')}><Plus size={17}/> List a resource</button></div><SynapsePanel apiBase={API_BASE} onSelect={r=>{if(r.owner==='You'||r.owner===profile?.fullName){setToast('This is your own listing.');return}if(role==='Owner'){setToast('Switch to User view to request access.');return}setSelected(r);setModal('request')}}/><div className="filter-bar"><div className="filter-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name, purpose or location"/></div><div className="filter-select"><SlidersHorizontal size={17}/><select value={category} onChange={e=>setCategory(e.target.value)}><option>All resources</option>{[...new Set(db.resources.map(r=>r.category))].map(c=><option key={c}>{c}</option>)}</select></div><span className="result-count">{resources.length} resources</span></div>{resources.length?<div className="resource-grid">{resources.map(r=><ResourceCard r={r} key={r.id}/>)}</div>:<div className="empty-state"><Search size={32}/><h3>No resources found</h3><p>Try another search term or category.</p><button className="button button-outline" onClick={()=>{setQuery('');setCategory('All resources')}}>Clear filters</button></div>}</section>;















 const activityPage=()=>{const mine=db.bookings.filter(b=>b.user===(profile?.fullName||'You')||b.user==='You');return <section className="page-section wrap"><div className="eyebrow spaced">YOUR WORKSPACE</div><div className="page-title-row"><div><h1>My activity</h1><p className="muted">Track requests, approvals, handovers and returns.</p></div><button className="button button-outline" onClick={()=>go('Resources')}>Find a resource <ArrowRight size={16}/></button></div><div className="stats-row"><div className="stat-card"><span>Active requests</span><strong>{mine.filter(b=>['Pending approval','Approved','Checked out','Waitlisted'].includes(b.status)).length}</strong></div><div className="stat-card"><span>Completed returns</span><strong>{mine.filter(b=>b.status==='Returned').length}</strong></div><div className="stat-card"><span>Incidents reported</span><strong>{db.incidents.filter(i=>mine.some(b=>b.id===i.bookingId)).length}</strong></div></div><div className="panel"><div className="panel-heading"><h2>Booking history</h2><span className="muted small">Latest activity first</span></div>{mine.length?mine.map(b=><div className="booking-row" key={b.id}><div className="booking-icon"><ClipboardCheck/></div><div className="booking-main"><h3>{b.resourceName}</h3><p>{b.date} · {b.slot} · {b.id}</p><p className="muted small">{b.purpose}</p>{b.conditionBefore&&<p className="condition-note">Check-in: {b.conditionBefore}</p>}{b.conditionAfter&&<p className="condition-note">Return: {b.conditionAfter}</p>}</div><div className="booking-actions"><span className={`status status-${statusClass(b.status)}`}>{b.status}</span>{b.status==='Approved'&&<button className="button button-small" onClick={()=>{setSelected(b);setModal('checkin')}}>Check in</button>}{b.status==='Checked out'&&<button className="button button-small" onClick={()=>{setSelected(b);setModal('checkout')}}>Return resource</button>}{['Pending approval','Approved','Checked out'].includes(b.status)&&<button className="link-button" onClick={()=>reportIncident(b)}>Report issue</button>}</div></div>):<div className="empty-state"><ClipboardCheck size={32}/><h3>No bookings yet</h3><p>When you request a resource, its progress will appear here.</p><button className="button" onClick={()=>go('Resources')}>Browse resources</button></div>}</div><LifecycleOperations apiBase={API_BASE} bookings={mine} viewer={profile?.fullName||"You"} onChanged={refresh}/><div className="notice"><ShieldCheck size={18}/><p><strong>Demo environment.</strong> Activity is synchronised with the configured backend. Accounts are still device-local demo profiles, not secure authentication.</p></div></section>};















 const ownerPage=()=> <section className="page-section wrap">















  <div className="eyebrow spaced">RESOURCE MANAGEMENT</div>















  <div className="page-title-row"><div><h1>Owner console</h1><p className="muted">Manage your listings, review incoming requests and document handovers.</p></div><button className="button" onClick={()=>setModal('add-resource')}><Plus size={17}/> Add resource</button></div>















  <FairSharePanel apiBase={API_BASE} resources={myResources}/>
  <SentinelPanel apiBase={API_BASE} bookings={myBookings} onChanged={refresh}/>
  <ProofChainPanel apiBase={API_BASE} bookings={myBookings}/>
  <LifecycleOperations apiBase={API_BASE} bookings={myBookings} viewer={profile?.fullName||"You"} ownerMode onChanged={refresh}/>







  <div className="stats-row">















   <div className="stat-card"><span>My resources</span><strong>{myResources.length}</strong><small>Listings owned by this demo profile</small></div>















   <div className="stat-card"><span>Awaiting review</span><strong>{incomingRequests.filter(b=>b.status==='Pending approval').length}</strong><small>Requests for your resources</small></div>















   <div className="stat-card"><span>Active handovers</span><strong>{myBookings.filter(b=>['Approved','Checked out','Checked-in','Checked in','In use'].includes(b.status)).length}</strong><small>Approved or currently checked out</small></div>















   <div className="stat-card"><span>Incidents to review</span><strong>{myIncidents.filter(i=>i.status==='Needs review').length}</strong><small>Linked to your listings</small></div>















  </div>















  <div className="panel">















   <div className="panel-heading"><div><h2>My resources</h2><p className="muted small">Only listings owned by the current demo profile appear here.</p></div><button className="button button-small button-outline" onClick={()=>setModal('add-resource')}><Plus size={15}/> Add listing</button></div>















   {myResources.length ? <div className="owner-resource-grid">{myResources.map(r=><article className="owner-resource-card" key={r.id}>















    <div className="owner-resource-top"><div className={`owner-resource-icon art-${r.image||'lab'}`}><IconFor type={r.category} size={24}/></div><span className="availability"><span className={`dot ${r.availability==='Limited'?'amber':''}`}></span>{r.availability}</span></div>















    <div className="eyebrow">{r.category}</div><h3>{r.name}</h3><p className="muted small"><MapPin size={14}/>{r.location}</p><p className="description">{r.description||'No description added yet.'}</p>















    <div className="owner-resource-meta"><span>{myBookings.filter(b=>b.resourceId===r.id).length} booking records</span><strong>{money(r.rate)} / {r.unit}</strong></div>















    <button className="button button-small button-outline owner-availability-button" onClick={()=>changeAvailability(r)}>{r.availability==='Available'?'Mark limited':'Mark available'}</button>















   </article>)}</div> : <div className="owner-empty"><div className="owner-empty-icon"><Building2 size={24}/></div><h3>No resources owned by this demo profile yet</h3><p>Publish a listing to start managing availability and receiving requests for your own equipment or spaces.</p><button className="button" onClick={()=>setModal('add-resource')}><Plus size={16}/> List your first resource</button></div>}















  </div>















  <div className="panel">















   <div className="panel-heading"><div><h2>Incoming requests</h2><p className="muted small">Requests are shown only when they target one of your listings.</p></div><span className="muted small">{incomingRequests.length} total</span></div>















   {incomingRequests.length ? incomingRequests.map(b=><div className="booking-row" key={b.id}><div className="booking-icon"><CalendarDays/></div><div className="booking-main"><h3>{b.resourceName}</h3><p>{b.user} · {b.date} · {b.slot}</p><p className="muted small">{b.purpose}</p><p className="muted small">Request ID: {b.id}</p></div><div className="booking-actions"><span className={`status status-${statusClass(b.status)}`}>{b.status}</span>{b.isDemo&&<span style={{fontSize:12,color:'#267c73',fontWeight:600}}>Protected demo request</span>}{b.status==='Pending approval'&&!b.isDemo&&<><button className="button button-small" onClick={()=>{changeBookingStatus(b.id,'Approved');}}>Approve</button><button className="button button-small button-outline" onClick={()=>{changeBookingStatus(b.id,'Rejected');}}>Reject</button><button className="link-button" onClick={()=>{changeBookingStatus(b.id,'Waitlisted');}}>Waitlist</button></>}</div></div>) : <div className="empty-inline">{myResources.length?'No incoming requests for your listings yet.':'List a resource first; incoming requests will appear here when they target one of your listings.'}</div>}















  </div>















  <div className="panel">















   <div className="panel-heading"><div><h2>Incident log</h2><p className="muted small">Incidents connected to your resources only.</p></div><span className="muted small">{myIncidents.length} records</span></div>















   {myIncidents.length?myIncidents.map(i=><div className="incident-row" key={i.id}><AlertTriangle size={20}/><div><strong>{i.resourceName}</strong><p>{i.description}</p><span className="muted small">{i.id} · {i.createdAt}</span></div><span className={`status status-${statusClass(i.status==='Needs review'?'Pending approval':i.status)}`}>{i.status}</span>{i.status==='Needs review'&&<button className="link-button" onClick={()=>{reviewIncident(i);}}>Mark reviewed</button>}</div>):<div className="empty-inline">No incidents have been reported for your resources.</div>}















  </div>















  <div className="notice owner-demo-notice"><ShieldCheck size={18}/><p><strong>Prototype limitation:</strong> Owner/User is a demo view switch, not account authentication. Resources and requests use the shared backend; identity is still an unverified local demo profile. Do not deploy publicly without authentication and authorization.</p></div>















 </section>;















 const impactPage=()=>{const checked=db.bookings.filter(b=>b.status==='Returned').length;const active=db.bookings.filter(b=>['Approved','Checked out'].includes(b.status)).length;return <section className="page-section wrap"><div className="eyebrow spaced">MEASURE WHAT MATTERS</div><h1>Idle-to-Impact</h1><p className="muted page-intro">A transparent view of resource access and utilisation in this demo dataset.</p><div className="stats-row impact-stats"><div className="stat-card"><span>Resources listed</span><strong>{db.resources.length}</strong><small>Across {new Set(db.resources.map(r=>r.category)).size} categories</small></div><div className="stat-card"><span>Booking records</span><strong>{db.bookings.length}</strong><small>Requests and past use</small></div><div className="stat-card"><span>Active bookings</span><strong>{active}</strong><small>Approved or checked out</small></div><div className="stat-card"><span>Completed returns</span><strong>{checked}</strong><small>Recorded as returned</small></div></div><div className="impact-layout"><div className="panel"><div className="panel-heading"><h2>Resource utilisation signals</h2><span className="muted small">Illustrative available-hour data</span></div>{db.resources.slice(0,5).map(r=><div className="util-row" key={r.id}><div className="util-meta"><strong>{r.name}</strong><span>{r.hours} estimated available hours</span></div><div className="progress"><span style={{width:`${Math.min(100,Math.max(12,r.hours*2))}%`}}/></div></div>)}<p className="footnote">Hours shown are seeded demo values, not live sensor readings or verified institutional statistics.</p></div><div className="impact-callout"><Sparkles size={24}/><h2>Unused capacity is an opportunity.</h2><p>VYOMRA helps institutions understand where resources exist, where demand is building and how access can be made fairer.</p><button className="button button-light" onClick={()=>go('Resources')}>Explore resources <ArrowRight size={16}/></button></div></div></section>};















 const aboutPage=()=> <section className="page-section wrap legal-page"><div className="eyebrow spaced">THE IDEA BEHIND VYOMRA</div><h1>Access beyond ownership.</h1><p className="page-intro">VYOMRA is a proposed resource-intelligence network designed to connect people with underused equipment, laboratories and technical spaces—while preserving owner control, safety and accountability.</p><div className="about-grid"><div className="panel"><FlaskConical/><h2>Our purpose</h2><p>Reduce the gap between valuable resources that sit idle and people who need access to carry out research, learning and innovation.</p></div><div className="panel"><ShieldCheck/><h2>Our principles</h2><p>Clear eligibility, explainable allocation, documented handovers, privacy-aware design and human oversight for important decisions.</p></div><div className="panel"><Activity/><h2>Our approach</h2><p>Start with a focused, verifiable workflow. Expand only when the core lifecycle is reliable and institutions can operate it responsibly.</p></div></div><div className="notice"><CircleHelp size={18}/><p>This is a hackathon starter prototype. Listings, institutions, user identities and booking records are illustrative demo data. Do not use it to coordinate real access to restricted equipment.</p></div></section>;















 const legalPage=(kind)=> <section className="page-section wrap legal-page"><div className="eyebrow spaced">VYOMRA · POLICIES</div><h1>{kind==='terms'?'Terms & Conditions':'Privacy Policy'}</h1><p className="muted">Prototype policy draft · Last updated: 30 October 2026</p><div className="legal-callout"><AlertTriangle size={19}/><p><strong>Important:</strong> This is a starter draft for a hackathon prototype, not legal advice. Before public or institutional deployment, replace the operator details and have the policy reviewed for the applicable jurisdiction and actual technical implementation.</p></div>{kind==='terms'?<div className="legal-content"><h2>1. Purpose and scope</h2><p>VYOMRA is a prototype concept for discovering and requesting access to equipment, facilities and shared spaces. In this starter version, all records are demo records stored in the current browser.</p><h2>2. Eligibility and authorised use</h2><p>Users must follow the resource owner's eligibility requirements, safety instructions, supervision rules and permitted-use conditions. A listing or booking request does not itself grant permission to enter a facility or operate equipment.</p><h2>3. Requests, approvals and availability</h2><p>Requests are subject to owner review and resource availability. Owners may approve, reject or waitlist a request. Availability shown in the prototype may be illustrative and must be confirmed by the responsible institution.</p><h2>4. Check-in, return and condition reports</h2><p>Users should record the condition of a resource at handover and return, report damage or delays promptly, and follow the owner's return process. This prototype does not establish a legally binding chain of custody.</p><h2>5. Cancellations, damage and disputes</h2><p>Any cancellation windows, deposits, fees, liability allocation and dispute process must be set by the operating institution before real use. This prototype does not process payments or determine liability.</p><h2>6. Safety and human oversight</h2><p>Users must not bypass safety requirements or access controls. Automated recommendations are informational only. Safety-critical access decisions must be reviewed by an authorised person.</p><h2>7. Acceptable use</h2><p>Do not submit false information, misuse another person's account, attempt unauthorised access, upload unlawful content or interfere with the service.</p><h2>8. Service limitations</h2><p>The prototype is provided for demonstration and evaluation. It has no production authentication, guaranteed uptime, institutional verification or secure central database.</p><h2>9. Changes and contact</h2><p>These draft terms should be updated before deployment. Add the legal name and contact details of the organisation operating VYOMRA before publishing a production service.</p></div>:<div className="legal-content"><h2>1. Information handled by this prototype</h2><p>The demo may store booking purpose, requested dates, resource identifiers, condition notes and incident descriptions entered by the user. Seeded records may contain fictional names and example information.</p><h2>2. Where data is stored</h2><p>In this starter version, application state is saved in localStorage in the current browser. It is not synchronised across devices and may be accessible to someone else using the same browser profile. Clearing browser storage may remove the records.</p><h2>3. Sensitive information</h2><p>Do not enter passwords, government identifiers, health information, confidential research details, personal contact information or other sensitive data into this demo. Use fictional or authorised test data only.</p><h2>4. Purpose and sharing</h2><p>Information entered in the demo is used to demonstrate resource requests, approvals, handovers and incident workflows. The starter has no server-side account system or third-party analytics integration by default.</p><h2>5. Retention and deletion</h2><p>Records remain in the browser until they are changed or local storage is cleared. This prototype does not provide a verified account-level data export or deletion process.</p><h2>6. Security limitations</h2><p>Browser-local storage is not an adequate security boundary for real institutional records. This starter has no production access control, server-side authorisation, encrypted database, audit service or backup system.</p><h2>7. Children's privacy and institutional deployment</h2><p>The operating organisation must determine appropriate age restrictions, consent, institutional requirements and applicable privacy obligations before deployment.</p><h2>8. Your choices and contact</h2><p>For this local demo, you can clear the VYOMRA browser data using the Reset demo data action in the footer. For a production release, add the responsible organisation's identity, contact details, applicable rights and request process, retention schedule and legally required disclosures.</p></div>}</section>;















 if(!profile)return <div className="app-shell auth-shell"><div className="auth-brand"><span className="brand-mark"><Orbit size={27}/></span><span><strong>VYOMRA</strong><small>RESOURCE INTELLIGENCE NETWORK</small></span></div><main className="auth-layout"><section className="auth-intro"><div className="eyebrow spaced">IDLE ASSETS. INFINITE POSSIBILITIES.</div><h1>Access more.<br/><span>Own less.</span></h1><p>Connect to underused equipment, specialist facilities and technical spaces through a more intelligent resource network.</p><div className="auth-points"><div><ShieldCheck/><span><b>Trust-led access</b><small>Profile declarations and responsible use</small></span></div><div><Building2/><span><b>Institution-aware</b><small>Resources with clear ownership and requirements</small></span></div><div><Activity/><span><b>Transparent workflows</b><small>Requests, handovers and condition records</small></span></div></div></section><section className="auth-card"><div className="eyebrow">VYOMRA ACCESS</div><h2>{authMode==='signup'?'Create your profile':'Welcome back'}</h2><p className="muted">{authMode==='signup'?'Use your real institutional details to get started.':'Open the demo profile saved on this device.'}</p><div className="vy-access-demo">
  <div className="vy-access-demo-heading"><span className="vy-access-demo-icon"><FlaskConical size={19}/></span><div><span className="vy-access-overline">EXPLORE THE PLATFORM</span><h3>Judge demo access</h3></div><span className="vy-access-demo-label">NO PASSWORD</span></div>
  <p className="vy-access-demo-desc">Step into a pre-filled research profile to explore real demo bookings and resource workflows.</p>
  <div className="vy-access-demo-grid">{demoProfiles.map((d,i)=><button key={d.fullName} type="button" className="vy-access-profile" onClick={()=>enterDemo(d)}><span className="vy-access-profile-icon">{i===0?<Building2 size={19}/>:i===1?<FlaskConical size={19}/>:i===2?<Microscope size={19}/>:<Activity size={19}/>}</span><span className="vy-access-profile-text"><strong>{d.fullName}</strong><small>{i===0?'Resource owner':'Research requester'}</small></span><ArrowRight size={17}/></button>)}</div>
  <p className="vy-access-demo-foot"><ShieldCheck size={15}/> Fictional profiles only. Not authenticated or verified. Create your own profile to submit a new request.</p>
</div><form onSubmit={submitAuth} className="auth-form">{authMode==='signup'&&<><div className="form-grid"><label>Full legal name<input autoComplete="name" value={authForm.fullName} onChange={e=>setAuthForm({...authForm,fullName:e.target.value})} required/></label><label>Email address<input type="email" autoComplete="email" value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} required/></label></div><div className="form-grid"><label>Phone number<input type="tel" autoComplete="tel" value={authForm.phone} onChange={e=>setAuthForm({...authForm,phone:e.target.value})} required/></label><label>Institution / university<input value={authForm.institution} onChange={e=>setAuthForm({...authForm,institution:e.target.value})} required/></label></div><div className="form-grid"><label>Department<input value={authForm.department} onChange={e=>setAuthForm({...authForm,department:e.target.value})} required/></label><label>Designation / role<input value={authForm.designation} onChange={e=>setAuthForm({...authForm,designation:e.target.value})} placeholder="Student, faculty, technician…" required/></label></div><label>Institutional ID / affiliation reference<input value={authForm.institutionId} onChange={e=>setAuthForm({...authForm,institutionId:e.target.value})} placeholder="Do not enter sensitive ID numbers in this demo" required/></label></>}{authMode==='login'&&<label>Email address<input type="email" autoComplete="email" value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} required/></label>}{authMode==='signup'&&<div className="form-grid"><label>Password (demo only; not stored)<input type="password" autoComplete="new-password" value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} minLength={8} required/></label><label>Confirm password<input type="password" autoComplete="new-password" value={authForm.confirmPassword} onChange={e=>setAuthForm({...authForm,confirmPassword:e.target.value})} minLength={8} required/></label></div>}{authMode==='signup'&&<label className="auth-check"><input type="checkbox" checked={authForm.truthful} onChange={e=>setAuthForm({...authForm,truthful:e.target.checked})} required/><span>I declare that the information provided is true and accurate to the best of my knowledge. I understand that material discrepancies, misrepresentation or misuse may lead to action under VYOMRA policies and applicable institutional rules.</span></label>}<button className="button auth-submit" type="submit">{authMode==='signup'?'Create demo profile':'Continue'} <ArrowRight size={16}/></button></form><p className="auth-switch">{authMode==='signup'?'Already created a profile on this device?':'New to VYOMRA?'} <button onClick={()=>{setAuthMode(authMode==='signup'?'login':'signup');setAuthForm({...authForm,truthful:false})}}>{authMode==='signup'?'Sign in':'Create profile'}</button></p><p className="auth-disclaimer"><LockKeyhole size={14}/> Prototype notice: this is a device-local demo profile, not secure authentication. Passwords are not stored or verified, and email/phone verification is not enabled. Do not enter real passwords or sensitive ID numbers.</p></section></main></div>;















 return <div className="app-shell"><header className="site-header"><div className="nav-wrap"><button className="brand" onClick={()=>go('Home')}><span className="brand-mark"><Orbit size={27}/></span><span><strong>VYOMRA</strong><small>RESOURCE INTELLIGENCE NETWORK</small></span></button><nav className="desktop-nav">{nav.map(n=><button className={page===n?'active':''} key={n} onClick={()=>go(n)}>{n}</button>)}</nav><div className="header-actions"><button className="icon-button" aria-label="Search resources" onClick={()=>go('Resources')}><Search size={19}/></button><button className="button button-outline sign-in" onClick={()=>{const nextRole=role==='User'?'Owner':'User';setRole(nextRole);setPage(nextRole==='Owner'?'Owner console':'Resources');setSelected(null);setModal('');setToast(nextRole==='Owner'?'Owner workspace opened. Manage your listings and incoming requests here.':'User workspace opened. Browse resources and track your bookings here.');window.scrollTo({top:0,behavior:'smooth'});}}>{role==='User'?'Switch to Owner':'Switch to User'}</button><button className="button button-outline sign-in" onClick={()=>{sessionStorage.removeItem('vyomra-judge-token');setProfile(null);setAuthMode('login');setAuthForm({fullName:'',email:'',phone:'',institution:'',department:'',designation:'',institutionId:'',password:'',confirmPassword:'',truthful:false});}}><LogOut size={15}/> Sign out</button><button className="button header-cta" onClick={()=>go('Resources')}>Get started</button><button className="mobile-menu" onClick={()=>setModal('menu')} aria-label="Open menu"><Menu/></button></div></div></header>















 <main>{page==='Home'?home():page==='Resources'?resourcesPage():page==='My activity'?activityPage():page==='Owner console'?ownerPage():page==='Impact'?<ImpactDashboard apiBase={API_BASE}/>:page==='About'?aboutPage():page==='Terms & Conditions'?legalPage('terms'):page==='Privacy Policy'?legalPage('privacy'):home()}</main>















 <footer className="site-footer"><div className="footer-main wrap"><div className="footer-brand"><button className="brand" onClick={()=>go('Home')}><span className="brand-mark"><Orbit size={25}/></span><span><strong>VYOMRA</strong><small>RESOURCE INTELLIGENCE NETWORK</small></span></button><p>Idle assets. Infinite possibilities.<br/>Access beyond ownership.</p></div><div className="footer-links"><div><strong>Explore</strong><button onClick={()=>go('Resources')}>Resources</button><button onClick={()=>go('My activity')}>My activity</button><button onClick={()=>go('Owner console')}>Owner console</button></div><div><strong>Company</strong><button onClick={()=>go('About')}>About VYOMRA</button><button onClick={()=>go('Impact')}>Impact</button><button onClick={()=>setToast('Support contact details should be configured before production launch.')}>Help & contact</button></div><div><strong>Legal</strong><button onClick={()=>go('Terms & Conditions')}>Terms & Conditions</button><button onClick={()=>go('Privacy Policy')}>Privacy Policy</button><button onClick={()=>{localStorage.removeItem('vyomra-state-v1');refresh().then(()=>setToast('Reloaded shared backend records.')).catch(e=>setToast(e.message))}}>Reset demo data</button></div></div></div><div className="footer-bottom wrap"><span>© 2026 VYOMRA · Hackathon prototype</span><span><ShieldCheck size={14}/> Built around trust, safety and fair access · API {apiStatus}</span></div></footer>















 {modal==='request'&&selected&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setModal('')}><div className="modal"><div className="modal-top"><div><div className="eyebrow">RESOURCE REQUEST</div><h2>{selected.name}</h2></div><button className="icon-button" onClick={()=>setModal('')} aria-label="Close"><X/></button></div><p className="muted">{selected.description}</p><div className="modal-facts"><span><MapPin size={15}/>{selected.location}</span><span><Clock3 size={15}/>{selected.capacity}</span><span><strong>{money(selected.rate)}</strong> / {selected.unit}</span></div><div className="requirements"><strong>Access requirements</strong><ul>{selected.requirements.map(x=><li key={x}>{x}</li>)}</ul></div><div className="fairshare-request-intro"><Sparkles size={17}/><div><strong>FairShare intelligent review</strong><p>Describe your actual equipment need. Gemini assists the owner with suitability questions; urgency and evidence claims are not automatically verified.</p></div></div><label>Purpose category<select value={form.purposeCategory} onChange={e=>setForm({...form,purposeCategory:e.target.value})}>{['Research Need','Hospital/Healthcare Need','Industrial/Technical','Education/Training','Community/Public Service','General/Other'].map(c=><option key={c}>{c}</option>)}</select></label><label>Purpose of use<textarea value={form.purpose} onChange={e=>setForm({...form,purpose:e.target.value})} placeholder="Briefly describe what you plan to do with this resource." rows="3"/></label><div className="form-grid"><label>Time sensitivity<select value={form.urgency} onChange={e=>setForm({...form,urgency:e.target.value})}>{['Flexible','Within a week','Within 48 hours','Time-critical'].map(u=><option key={u}>{u}</option>)}</select></label><label>Evidence reference (optional)<input maxLength={1000} value={form.evidenceReference} onChange={e=>setForm({...form,evidenceReference:e.target.value})} placeholder="Approval ID or non-sensitive reference"/></label></div><label>Deadline explanation<textarea maxLength={1500} rows="2" value={form.deadlineExplanation} onChange={e=>setForm({...form,deadlineExplanation:e.target.value})} placeholder="If urgent, explain the real deadline and why it matters."/></label><label>Alternatives considered<textarea maxLength={1500} rows="2" value={form.alternativesConsidered} onChange={e=>setForm({...form,alternativesConsidered:e.target.value})} placeholder="Other equipment or time slots you considered."/></label><p className="fairshare-request-privacy"><LockKeyhole size={14}/> Do not enter patient identifiers, confidential documents or sensitive personal information. Claims require independent owner verification.</p><div className="form-grid"><label>Requested date<input type="date" value={form.date} min={new Date().toISOString().slice(0,10)} onChange={e=>setForm({...form,date:e.target.value})}/></label><label>Preferred slot<select value={form.slot} onChange={e=>setForm({...form,slot:e.target.value})}><option>09:00–11:00</option><option>10:00–12:00</option><option>11:00–13:00</option><option>14:00–16:00</option><option>15:00–17:00</option></select></label></div><p className="form-hint"><ShieldCheck size={15}/> Submitting sends a request for owner review; it does not grant access automatically.</p><div className="modal-actions"><button className="button button-outline" onClick={()=>setModal('')}>Cancel</button><button className="button" onClick={requestBooking}>Submit request <ArrowRight size={16}/></button></div></div></div>}















 {modal==='checkin'&&selected&&<div className="modal-backdrop"><div className="modal"><div className="modal-top"><div><div className="eyebrow">PROOFCHAIN · CHECK-IN</div><h2>Record initial condition</h2></div><button className="icon-button" onClick={()=>setModal('')}><X/></button></div><p className="muted">{selected.resourceName} · {selected.id}</p><label>Condition before use<textarea rows="4" value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})} placeholder="Describe visible condition, accessories and any existing damage."/></label><p className="form-hint"><ScanLine size={15}/> QR scanning and photo uploads are not enabled in this starter; this form records a text condition note.</p><div className="modal-actions"><button className="button button-outline" onClick={()=>setModal('')}>Cancel</button><button className="button" onClick={()=>handover('checkin')}>Confirm check-in</button></div></div></div>}















 {modal==='checkout'&&selected&&<div className="modal-backdrop"><div className="modal"><div className="modal-top"><div><div className="eyebrow">PROOFCHAIN · RETURN</div><h2>Confirm resource return</h2></div><button className="icon-button" onClick={()=>setModal('')}><X/></button></div><p className="muted">{selected.resourceName} · {selected.id}</p><label>Condition after use<textarea rows="4" value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})} placeholder="Describe the final condition and any change from check-in."/></label><label>Return notes (optional)<textarea rows="2" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Accessories returned, maintenance note, etc."/></label><div className="modal-actions"><button className="button button-outline" onClick={()=>setModal('')}>Cancel</button><button className="button" onClick={()=>handover('return')}>Confirm return</button></div></div></div>}















 {modal==='add-resource'&&<div className="modal-backdrop"><div className="modal"><div className="modal-top"><div><div className="eyebrow">OWNER CONSOLE</div><h2>List a resource</h2></div><button className="icon-button" onClick={()=>setModal('')}><X/></button></div><p className="muted">Use fictional or authorised demo information only.</p><label>Resource name<input value={newResource.name} onChange={e=>setNewResource({...newResource,name:e.target.value})} placeholder="e.g. FTIR Spectrometer"/></label><div className="form-grid"><label>Category<select value={newResource.category} onChange={e=>setNewResource({...newResource,category:e.target.value})}>{['Laboratory Equipment','Fabrication','Computing','Creative Equipment','Testing Facility','Workspace'].map(c=><option key={c}>{c}</option>)}</select></label><label>Indicative rate (₹/hour)<input type="number" min="0" value={newResource.rate} onChange={e=>setNewResource({...newResource,rate:e.target.value})} placeholder="0"/></label></div><label>Location<input value={newResource.location} onChange={e=>setNewResource({...newResource,location:e.target.value})} placeholder="Building, lab or room"/></label><label>Description<textarea rows="3" value={newResource.description} onChange={e=>setNewResource({...newResource,description:e.target.value})} placeholder="Purpose, capabilities and limitations"/></label><label>Requirements (comma-separated)<input value={newResource.requirements} onChange={e=>setNewResource({...newResource,requirements:e.target.value})} placeholder="Safety induction, owner approval"/></label><div className="modal-actions"><button className="button button-outline" onClick={()=>setModal('')}>Cancel</button><button className="button" onClick={addResource}>Publish demo listing <ArrowRight size={16}/></button></div></div></div>}















 {modal==='safety-declaration'&&<div className="modal-backdrop"><div className="modal safety-modal"><div className="modal-top"><div><div className="eyebrow">LISTING INTEGRITY · REQUIRED</div><h2>Resource safety declaration</h2></div><button className="icon-button" onClick={()=>setModal('add-resource')} aria-label="Back to listing"><X/></button></div><p className="muted">Before publishing, confirm the following statements to the best of your knowledge.</p><div className="safety-copy"><p>• The equipment or space is not knowingly damaged, unsafe or hazardous in a way that has not been disclosed.</p><p>• I have the authority or permission necessary to list this resource.</p><p>• I have no malicious intent to misuse this listing, mislead users or cause harm.</p><p>• I have disclosed known defects, hazards, operational restrictions and relevant usage requirements.</p></div><label className="auth-check"><input type="checkbox" checked={safetyAccepted} onChange={e=>setSafetyAccepted(e.target.checked)}/><span>I confirm these statements to the best of my knowledge. I understand that false declarations or deliberate concealment may result in suspension and further action under applicable institutional rules and policies.</span></label><p className="form-hint"><ShieldCheck size={15}/> Acceptance is recorded in this browser demo only; a production system should record the authenticated user, declaration version and server timestamp.</p><div className="modal-actions"><button className="button button-outline" onClick={()=>{setSafetyAccepted(false);setModal('add-resource')}}>Back</button><button className="button" disabled={!safetyAccepted} onClick={()=>{setModal('add-resource');setTimeout(()=>addResource(),0)}}>Confirm and publish <ArrowRight size={16}/></button></div></div></div>}















 {modal==='menu'&&<div className="modal-backdrop"><div className="modal mobile-nav-modal"><div className="modal-top"><h2>Navigation</h2><button className="icon-button" onClick={()=>setModal('')}><X/></button></div>{[...nav,'Terms & Conditions','Privacy Policy'].map(n=><button className="mobile-nav-link" key={n} onClick={()=>{setModal('');go(n)}}>{n}<ChevronRight size={17}/></button>)}</div></div>}















 {toast&&<div className="toast" role="status"><CheckCircle2 size={18}/>{toast}<button onClick={()=>setToast('')} aria-label="Dismiss"><X size={16}/></button></div>}















 </div>















}















export default App;
