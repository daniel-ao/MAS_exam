import React, { useMemo, useState } from 'react';
import { LabFrame, Pill } from './LabFrame';
import { RotateCcw } from 'lucide-react';

type FormId = 'centralized' | 'hierarchical' | 'p2p' | 'market' | 'coalition' | 'holonic';
interface Node { id: string; x: number; y: number; hub?: boolean }
interface Form { label: string; shape: string; root?: string; nodes: Node[]; edges: [string, string][]; good: string; risk: string }

const FORMS: Record<FormId, Form> = {
  centralized: {
    label: 'Centralized', shape: 'star', root: 'Coord',
    nodes: [{ id: 'Coord', x: 200, y: 120, hub: true }, { id: 'A', x: 80, y: 50 }, { id: 'B', x: 320, y: 50 }, { id: 'C', x: 80, y: 190 }, { id: 'D', x: 320, y: 190 }],
    edges: [['Coord', 'A'], ['Coord', 'B'], ['Coord', 'C'], ['Coord', 'D']],
    good: 'simple global optimization and conflict resolution', risk: 'bottleneck and single point of failure'
  },
  hierarchical: {
    label: 'Hierarchical', shape: 'tree', root: 'Planner',
    nodes: [{ id: 'Planner', x: 200, y: 30, hub: true }, { id: 'Zone1', x: 110, y: 110, hub: true }, { id: 'Zone2', x: 290, y: 110, hub: true }, { id: 'R1', x: 60, y: 200 }, { id: 'R2', x: 160, y: 200 }, { id: 'R3', x: 240, y: 200 }, { id: 'R4', x: 340, y: 200 }],
    edges: [['Planner', 'Zone1'], ['Planner', 'Zone2'], ['Zone1', 'R1'], ['Zone1', 'R2'], ['Zone2', 'R3'], ['Zone2', 'R4']],
    good: 'scalable delegation, clear accountability', risk: 'slow adaptation; a failed level cuts off its subtree'
  },
  p2p: {
    label: 'Peer-to-peer', shape: 'mesh',
    nodes: [{ id: 'A', x: 80, y: 60 }, { id: 'B', x: 180, y: 40 }, { id: 'C', x: 310, y: 70 }, { id: 'D', x: 90, y: 170 }, { id: 'E', x: 210, y: 200 }, { id: 'F', x: 330, y: 180 }],
    edges: [['A', 'B'], ['B', 'C'], ['C', 'F'], ['F', 'E'], ['E', 'D'], ['D', 'A'], ['B', 'E'], ['D', 'C']],
    good: 'resilience through redundant paths, local adaptation', risk: 'no global optimum guaranteed'
  },
  market: {
    label: 'Market-based', shape: 'auction', root: 'Board',
    nodes: [{ id: 'Board', x: 200, y: 40, hub: true }, { id: 'A', x: 80, y: 180 }, { id: 'B', x: 200, y: 180 }, { id: 'C', x: 320, y: 180 }],
    edges: [['Board', 'A'], ['Board', 'B'], ['Board', 'C']],
    good: 'agents reveal costs through bids; good under scarcity', risk: 'needs truthful bids and a working task board'
  },
  coalition: {
    label: 'Coalition', shape: 'alliance',
    nodes: [{ id: 'Fire', x: 80, y: 80 }, { id: 'F2', x: 60, y: 170 }, { id: 'Medic', x: 320, y: 80 }, { id: 'M2', x: 340, y: 170 }, { id: 'Logi', x: 200, y: 190 }, { id: 'Protocol', x: 200, y: 50, hub: true }],
    edges: [['Fire', 'F2'], ['Medic', 'M2'], ['Fire', 'Protocol'], ['Medic', 'Protocol'], ['Logi', 'Protocol'], ['Fire', 'Logi'], ['Medic', 'Logi']],
    good: 'local autonomy across organizations', risk: 'interoperability, trust and protocols'
  },
  holonic: {
    label: 'Holonic', shape: 'nested', root: 'Factory',
    nodes: [{ id: 'Factory', x: 200, y: 30, hub: true }, { id: 'CellA', x: 110, y: 110, hub: true }, { id: 'CellB', x: 290, y: 110, hub: true }, { id: 'M1', x: 60, y: 200 }, { id: 'M2', x: 160, y: 200 }, { id: 'M3', x: 240, y: 200 }, { id: 'M4', x: 340, y: 200 }],
    edges: [['Factory', 'CellA'], ['Factory', 'CellB'], ['CellA', 'M1'], ['CellA', 'M2'], ['CellB', 'M3'], ['CellB', 'M4'], ['CellA', 'CellB']],
    good: 'autonomy at every level; a cell keeps working as a whole', risk: 'complex nested coordination'
  }
};

const component = (start: string, alive: Set<string>, edges: [string, string][]) => {
  const seen = new Set<string>([start]);
  const stack = [start];
  while (stack.length) {
    const u = stack.pop()!;
    edges.forEach(([a, b]) => {
      const v = a === u ? b : b === u ? a : null;
      if (v && alive.has(v) && !seen.has(v)) { seen.add(v); stack.push(v); }
    });
  }
  return seen;
};

interface Bot { name: string; distance: number; battery: number; load: number }

export const OrganizationLab: React.FC = () => {
  const [tab, setTab] = useState<'stress' | 'market'>('stress');
  const [formId, setFormId] = useState<FormId>('centralized');
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const [bots, setBots] = useState<Bot[]>([
    { name: 'A', distance: 6, battery: 80, load: 1 },
    { name: 'B', distance: 4, battery: 70, load: 0 },
    { name: 'C', distance: 7, battery: 90, load: 2 }
  ]);
  const form = FORMS[formId];

  const metrics = useMemo(() => {
    const alive = new Set(form.nodes.map(n => n.id).filter(id => !failed.has(id)));
    const agents = form.nodes.filter(n => !n.hub && alive.has(n.id)).map(n => n.id);
    let coordinated: Set<string>;
    if (form.root) {
      coordinated = alive.has(form.root) ? component(form.root, alive, form.edges) : new Set();
      if (formId === 'holonic' && !alive.has(form.root)) {
        // cells keep working as autonomous wholes
        coordinated = new Set(['CellA', 'CellB'].filter(c => alive.has(c)).flatMap(c => [...component(c, alive, form.edges.filter(e => !e.includes('Factory')))]));
      }
    } else {
      const comps = [...alive].map(id => component(id, alive, form.edges));
      coordinated = comps.sort((a, b) => b.size - a.size)[0] || new Set();
    }
    const ok = agents.filter(a => coordinated.has(a)).length;
    return { ok, total: form.nodes.filter(n => !n.hub).length };
  }, [form, failed, formId]);

  const toggle = (id: string) => setFailed(f => { const n = new Set(f); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const bid = (b: Bot) => b.distance * 2 + b.load * 3 + (b.battery < 30 ? 10 : 0);
  const winner = [...bots].sort((a, b) => bid(a) - bid(b))[0];

  return (
    <LabFrame
      title="Organization Stress-Test & Task Market"
      subtitle="Knock agents out and see which organizational forms keep coordinating; then run a market allocation (announce → bid → award)."
      source="Part 1.2, Slides 3–11"
      actions={<><Pill active={tab === 'stress'} onClick={() => setTab('stress')}>Failure stress-test</Pill><Pill active={tab === 'market'} onClick={() => setTab('market')}>Task market</Pill></>}
    >
      {tab === 'stress' ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(FORMS) as FormId[]).map(f => <Pill key={f} active={formId === f} onClick={() => { setFormId(f); setFailed(new Set()); }}>{FORMS[f].label} · {FORMS[f].shape}</Pill>)}
          </div>
          <div className="grid lg:grid-cols-[1fr,16rem] gap-4">
            <svg viewBox="0 0 400 230" className="w-full bg-stone-50 rounded-xl border border-stone-200">
              {formId === 'holonic' && (
                <>
                  <rect x={20} y={70} width={360} height={155} rx={18} fill="rgba(15,118,110,0.06)" stroke="#0f766e" strokeDasharray="5 4" />
                  <rect x={35} y={85} width={160} height={135} rx={14} fill="rgba(124,58,237,0.05)" stroke="#7c3aed" strokeDasharray="4 3" />
                  <rect x={205} y={85} width={160} height={135} rx={14} fill="rgba(124,58,237,0.05)" stroke="#7c3aed" strokeDasharray="4 3" />
                </>
              )}
              {form.edges.map(([a, b], i) => {
                const na = form.nodes.find(n => n.id === a)!, nb = form.nodes.find(n => n.id === b)!;
                const dead = failed.has(a) || failed.has(b);
                return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={dead ? '#e2e8f0' : '#0f766e'} strokeWidth={dead ? 1 : 2.2} strokeDasharray={dead ? '4 4' : undefined} />;
              })}
              {form.nodes.map(n => {
                const dead = failed.has(n.id);
                return (
                  <g key={n.id} onClick={() => toggle(n.id)} className="cursor-pointer">
                    <circle cx={n.x} cy={n.y} r={n.hub ? 22 : 17} fill={dead ? '#fee2e2' : n.hub ? '#0f4c81' : '#e0f2fe'} stroke={dead ? '#e11d48' : '#0f766e'} strokeWidth={2} />
                    <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={n.hub ? 9 : 10} fontWeight="700" fill={n.hub && !dead ? '#fff' : '#0f172a'}>{dead ? '✕' : n.id}</text>
                  </g>
                );
              })}
            </svg>
            <div className="text-xs space-y-2">
              <div className={`rounded-xl p-3 font-bold text-center text-base ${metrics.ok === metrics.total ? 'bg-emerald-50 text-emerald-800' : metrics.ok === 0 ? 'bg-rose-50 text-rose-800' : 'bg-amber-50 text-amber-800'}`}>
                {metrics.ok} / {metrics.total} working agents still coordinated
              </div>
              <p><b className="text-emerald-700">Good:</b> {form.good}</p>
              <p><b className="text-rose-700">Risk:</b> {form.risk}</p>
              <p className="text-slate-500">Click any node to make it fail. Try the hub of the star, a zone lead of the tree, and any single peer of the mesh.</p>
              <button onClick={() => setFailed(new Set())} className="px-2.5 py-1 rounded-lg border border-stone-300 font-semibold inline-flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Repair all</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5 text-xs">
          <div className="space-y-3">
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-3">
              <b>1. Announce:</b> a parcel must be delivered. <b>2. Bid:</b> each robot estimates its cost = 2·distance + 3·load (+10 if battery &lt; 30%). <b>3. Award:</b> lowest bid wins.
            </div>
            {bots.map((b, i) => (
              <div key={b.name} className="rounded-xl border border-stone-200 p-2.5 space-y-1">
                <div className="font-bold">Robot {b.name}</div>
                {(['distance', 'battery', 'load'] as const).map(k => (
                  <label key={k} className="flex items-center gap-2">
                    <span className="w-14">{k}</span>
                    <input type="range" min={0} max={k === 'battery' ? 100 : k === 'load' ? 4 : 12} value={b[k]} onChange={e => setBots(bots.map((x, j) => (j === i ? { ...x, [k]: Number(e.target.value) } : x)))} className="flex-1 accent-teal-700" />
                    <span className="font-mono w-8 text-right">{b[k]}{k === 'battery' ? '%' : ''}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[...bots].sort((a, b) => bid(a) - bid(b)).map(b => (
              <div key={b.name} className={`rounded-xl border p-3 flex items-center justify-between ${b === winner ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200'}`}>
                <span className="font-bold">Robot {b.name}</span>
                <span className="font-mono">bid: {bid(b)} min {b === winner ? '✓ awarded' : ''}</span>
              </div>
            ))}
            <p className="text-slate-500">Allocation emerges from offers, costs and constraints: no coordinator needs to know every robot’s state. Market-based fits uncertain costs and scarce resources because agents reveal their preferences through bids.</p>
          </div>
        </div>
      )}
    </LabFrame>
  );
};
