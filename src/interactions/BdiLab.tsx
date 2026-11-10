import React, { useState } from 'react';
import { LabFrame, Pill } from './LabFrame';
import { Play, RotateCcw } from 'lucide-react';

interface Beliefs { location: string; battery: number; obstacle: boolean; hasPackage: boolean; packageLocation: string }
interface Desire { goal: string; priority: number; relevant: boolean; why: string }
interface Intention { goal: string; plan: string[]; step: number; status: 'running' | 'achieved' | 'dropped' }

const ROOMS = ['Room A', 'Room B', 'Room C', 'Base'];

const generateDesires = (b: Beliefs): Desire[] => [
  { goal: 'avoidCollision', priority: 4, relevant: b.obstacle, why: 'obstacleDetected = true' },
  { goal: 'rechargeBattery', priority: 3, relevant: b.battery < 30, why: `battery = ${b.battery}% < 30%` },
  { goal: 'deliverPackage', priority: 2, relevant: b.hasPackage || b.packageLocation !== 'delivered', why: b.hasPackage ? 'carrying the package' : `package waiting in ${b.packageLocation}` },
  { goal: 'returnToBase', priority: 1, relevant: b.location !== 'Base', why: `location = ${b.location}` }
];

const planFor = (goal: string, b: Beliefs): string[] => {
  switch (goal) {
    case 'avoidCollision': return ['stop', 'turn', 'move'];
    case 'rechargeBattery': return ['goTo(Base)', 'dock', 'charge'];
    case 'deliverPackage': return b.hasPackage ? ['goTo(Room C)', 'drop(package)'] : [`goTo(${b.packageLocation})`, 'pick(package)', 'goTo(Room C)', 'drop(package)'];
    default: return ['goTo(Base)'];
  }
};

const apply = (action: string, b: Beliefs): Beliefs => {
  const nb = { ...b, battery: Math.max(0, b.battery - 4) };
  if (action === 'turn' || action === 'move') nb.obstacle = false;
  if (action.startsWith('goTo(')) nb.location = action.slice(5, -1);
  if (action === 'pick(package)') nb.hasPackage = true;
  if (action === 'drop(package)') { nb.hasPackage = false; nb.packageLocation = 'delivered'; }
  if (action === 'charge') nb.battery = 100;
  return nb;
};

const achieved = (goal: string, b: Beliefs) =>
  goal === 'avoidCollision' ? !b.obstacle : goal === 'rechargeBattery' ? b.battery >= 90 : goal === 'deliverPackage' ? b.packageLocation === 'delivered' : b.location === 'Base';

const INIT: Beliefs = { location: 'Room A', battery: 28, obstacle: true, hasPackage: false, packageLocation: 'Room B' };

export const BdiLab: React.FC = () => {
  const [beliefs, setBeliefs] = useState<Beliefs>(INIT);
  const [intention, setIntention] = useState<Intention | null>(null);
  const [mode, setMode] = useState<'naive' | 'improved'>('improved');
  const [log, setLog] = useState<string[]>([]);

  const desires = generateDesires(beliefs);
  const relevant = desires.filter(d => d.relevant).sort((a, b) => b.priority - a.priority);

  const cycle = () => {
    const lines: string[] = [];
    let b = beliefs;
    lines.push(`1. perceive & update beliefs: battery ${b.battery}%, obstacle ${b.obstacle}, at ${b.location}`);
    let cur = intention && intention.status === 'running' ? intention : null;
    const impossible = cur && !generateDesires(b).find(d => d.goal === cur!.goal)?.relevant;
    if (mode === 'naive' || !cur || impossible) {
      const options = generateDesires(b).filter(d => d.relevant).sort((x, y) => y.priority - x.priority);
      if (options.length === 0) {
        lines.push('2–5. no relevant desire: idle');
        setLog(l => [...lines, ...l].slice(0, 40));
        setIntention(null);
        return;
      }
      const chosen = options[0];
      const reason = mode === 'naive' ? 'naive loop re-deliberates every cycle' : !cur ? 'no current intention' : 'current intention became impossible';
      cur = { goal: chosen.goal, plan: planFor(chosen.goal, b), step: 0, status: 'running' };
      lines.push(`2–5. deliberate (${reason}) → select ${chosen.goal} (priority ${chosen.priority}), plan ${cur.plan.join(' → ')}`);
    } else {
      lines.push(`2–5. keep committed intention ${cur.goal} (step ${cur.step + 1}/${cur.plan.length})`);
    }
    const action = cur.plan[cur.step];
    b = apply(action, b);
    lines.push(`6. execute ${action}`);
    const next: Intention = { ...cur, step: cur.step + 1 };
    if (achieved(next.goal, b)) { next.status = 'achieved'; lines.push(`→ ${next.goal} achieved: drop the intention`); }
    else if (next.step >= next.plan.length) { next.step = 0; next.plan = planFor(next.goal, b); }
    setBeliefs(b);
    setIntention(next.status === 'achieved' ? null : next);
    setLog(l => [`— cycle —`, ...lines, ...l].slice(0, 60));
  };

  const reset = () => { setBeliefs(INIT); setIntention(null); setLog([]); };

  return (
    <LabFrame
      title="BDI Delivery Robot"
      subtitle="Edit the robot’s beliefs, watch desires appear, and step through the BDI loop: naive (re-plan every cycle) vs improved (commit, reconsider only when impossible)."
      source="Part 1.1, Slides 28–45"
      actions={
        <>
          <Pill active={mode === 'improved'} onClick={() => setMode('improved')}>Improved loop (slide 39)</Pill>
          <Pill active={mode === 'naive'} onClick={() => setMode('naive')}>Naive loop (slide 38)</Pill>
        </>
      }
    >
      <div className="grid md:grid-cols-3 gap-4 text-xs">
        <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-3 space-y-2">
          <div className="font-bold text-sky-900">Beliefs (name, value)</div>
          <label className="flex items-center justify-between gap-2">robotLocation
            <select value={beliefs.location} onChange={e => setBeliefs({ ...beliefs, location: e.target.value })} className="border rounded px-1 py-0.5">{ROOMS.map(r => <option key={r}>{r}</option>)}</select>
          </label>
          <label className="block">battery = {beliefs.battery}%
            <input type="range" min={0} max={100} value={beliefs.battery} onChange={e => setBeliefs({ ...beliefs, battery: Number(e.target.value) })} className="w-full accent-sky-700" />
          </label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={beliefs.obstacle} onChange={e => setBeliefs({ ...beliefs, obstacle: e.target.checked })} /> obstacleDetected</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={beliefs.hasPackage} onChange={e => setBeliefs({ ...beliefs, hasPackage: e.target.checked })} /> carrying package</label>
          <div className="text-slate-500">packageLocation = {beliefs.packageLocation}</div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3 space-y-1.5">
          <div className="font-bold text-amber-900">Desires (goal, priority, condition)</div>
          {desires.map(d => (
            <div key={d.goal} className={`flex items-start justify-between gap-2 ${d.relevant ? '' : 'opacity-40'}`}>
              <span className="font-mono">{d.goal}</span>
              <span className="text-right">
                <b>P{d.priority}</b>
                <br />
                <span className="text-[10px] text-slate-500">{d.relevant ? d.why : 'not relevant'}</span>
              </span>
            </div>
          ))}
          <div className="text-[11px] text-slate-500 pt-1">Highest-priority relevant desire: <b>{relevant[0]?.goal || 'none'}</b></div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 space-y-1.5">
          <div className="font-bold text-emerald-900">Intention (desire, plan, step, status)</div>
          {intention ? (
            <>
              <div>desire: <b className="font-mono">{intention.goal}</b></div>
              <div className="flex flex-wrap gap-1">
                {intention.plan.map((a, i) => (
                  <span key={i} className={`px-1.5 py-0.5 rounded font-mono ${i === intention.step ? 'bg-emerald-600 text-white' : i < intention.step ? 'bg-emerald-100 line-through' : 'bg-white border'}`}>{a}</span>
                ))}
              </div>
              <div>status: <b>{intention.status}</b></div>
            </>
          ) : (
            <div className="text-slate-500">none: the next cycle will deliberate</div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={cycle} className="px-3 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-bold inline-flex items-center gap-1"><Play className="w-3.5 h-3.5" /> Run one BDI cycle</button>
        <button onClick={reset} className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold inline-flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
      </div>
      <div className="mt-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] p-3 h-48 overflow-y-auto space-y-0.5">
        {log.length === 0 ? <div className="text-slate-400">Press “Run one BDI cycle”. Try toggling the obstacle in the middle of a delivery.</div> : log.map((l, i) => <div key={i} className={l.startsWith('—') ? 'text-amber-300' : ''}>{l}</div>)}
      </div>
    </LabFrame>
  );
};
