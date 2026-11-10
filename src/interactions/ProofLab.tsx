import React, { useState } from 'react';
import { LabFrame, Pill } from './LabFrame';
import { CheckCircle2, XCircle, Eye, RotateCcw } from 'lucide-react';

// ------------------------------------------------------------------ Hilbert proofs
interface ProofLine { f: string; just: string }
interface Puzzle { id: string; label: string; goal: string; system: string; lines: ProofLine[]; options: string[] }

const PUZZLES: Puzzle[] = [
  {
    id: 'pp', label: '⊢ p ⇒ p', goal: 'p ⇒ p', system: 'PC1, PC2, MP (Part 3.1 slide 15)',
    lines: [
      { f: 'p ⇒ ((p ⇒ p) ⇒ p)', just: 'PC1 [φ:=p, ψ:=p⇒p]' },
      { f: 'p ⇒ (p ⇒ p)', just: 'PC1 [φ:=p, ψ:=p]' },
      { f: '(p ⇒ ((p⇒p) ⇒ p)) ⇒ ((p ⇒ (p⇒p)) ⇒ (p ⇒ p))', just: 'PC2 [φ:=p, ψ:=p⇒p, χ:=p]' },
      { f: '(p ⇒ (p ⇒ p)) ⇒ (p ⇒ p)', just: 'MP 1, 3' },
      { f: 'p ⇒ p', just: 'MP 2, 4' }
    ],
    options: ['PC1 [φ:=p, ψ:=p⇒p]', 'PC1 [φ:=p, ψ:=p]', 'PC2 [φ:=p, ψ:=p⇒p, χ:=p]', 'MP 1, 3', 'MP 2, 4', 'MP 1, 2', 'PC3']
  },
  {
    id: 'tautology', label: '⊢ K(p ∨ ¬p)', goal: 'K(p ∨ ¬p)', system: 'S5 (slide 41 ex. 1)',
    lines: [
      { f: 'p ∨ ¬p', just: 'PC (tautology)' },
      { f: 'K(p ∨ ¬p)', just: 'Nec 1' }
    ],
    options: ['PC (tautology)', 'Nec 1', 'T', 'MP 1, 1', '4']
  },
  {
    id: 'kand', label: '⊢ K(p ∧ q) ⇒ Kp', goal: 'K(p ∧ q) ⇒ Kp', system: 'S5 (slide 41 ex. 2)',
    lines: [
      { f: '(p ∧ q) ⇒ p', just: 'PC (tautology)' },
      { f: 'K((p ∧ q) ⇒ p)', just: 'Nec 1' },
      { f: 'K((p ∧ q) ⇒ p) ⇒ (K(p ∧ q) ⇒ Kp)', just: 'K [φ:=p∧q, ψ:=p]' },
      { f: 'K(p ∧ q) ⇒ Kp', just: 'MP 2, 3' }
    ],
    options: ['PC (tautology)', 'Nec 1', 'K [φ:=p∧q, ψ:=p]', 'MP 2, 3', 'T [φ:=p]', 'MP 1, 3', 'Nec 3']
  },
  {
    id: 'kkk', label: '⊢ Kp ⇔ KKp', goal: 'Kp ⇔ KKp', system: 'S5 (slide 41 ex. 3, TD 3.1)',
    lines: [
      { f: 'Kp ⇒ KKp', just: '4 [φ:=p]' },
      { f: 'KKp ⇒ Kp', just: 'T [φ:=Kp]' },
      { f: '(Kp⇒KKp) ⇒ ((KKp⇒Kp) ⇒ (Kp⇔KKp))', just: 'PC (tautology)' },
      { f: '(KKp⇒Kp) ⇒ (Kp⇔KKp)', just: 'MP 1, 3' },
      { f: 'Kp ⇔ KKp', just: 'MP 2, 4' }
    ],
    options: ['4 [φ:=p]', 'T [φ:=Kp]', 'T [φ:=p]', '5 [φ:=p]', 'PC (tautology)', 'MP 1, 3', 'MP 2, 4', 'Nec 1']
  },
  {
    id: 'b', label: '⊢ φ ⇒ K¬K¬φ (B in S5)', goal: 'φ ⇒ K¬K¬φ', system: 'S5 (slide 40)',
    lines: [
      { f: 'K¬φ ⇒ ¬φ', just: 'T [φ:=¬φ]' },
      { f: '(K¬φ ⇒ ¬φ) ⇒ (φ ⇒ ¬K¬φ)', just: 'PC (contraposition)' },
      { f: 'φ ⇒ ¬K¬φ', just: 'MP 1, 2' },
      { f: '¬K¬φ ⇒ K¬K¬φ', just: '5 [φ:=¬φ]' },
      { f: '(φ⇒¬K¬φ) ⇒ ((¬K¬φ⇒K¬K¬φ) ⇒ (φ⇒K¬K¬φ))', just: 'PC (composition)' },
      { f: '(¬K¬φ⇒K¬K¬φ) ⇒ (φ⇒K¬K¬φ)', just: 'MP 3, 5' },
      { f: 'φ ⇒ K¬K¬φ', just: 'MP 4, 6' }
    ],
    options: ['T [φ:=¬φ]', 'PC (contraposition)', 'MP 1, 2', '5 [φ:=¬φ]', 'PC (composition)', 'MP 3, 5', 'MP 4, 6', '4 [φ:=¬φ]', 'Nec 1']
  },
  {
    id: 'stit', label: '⊢ Eᵢ(p ∧ q) → Eᵢq', goal: 'Eᵢ(p ∧ q) → Eᵢq', system: 'S5 for Eᵢ (Part 3.3 slides 21–22)',
    lines: [
      { f: '(p ∧ q) → q', just: 'PC (tautology)' },
      { f: 'Eᵢ((p ∧ q) → q)', just: 'Nec 1' },
      { f: 'Eᵢ((p ∧ q) → q) → (Eᵢ(p ∧ q) → Eᵢq)', just: 'Kᵢ [φ:=p∧q, ψ:=q]' },
      { f: 'Eᵢ(p ∧ q) → Eᵢq', just: 'MP 2, 3' }
    ],
    options: ['PC (tautology)', 'Nec 1', 'Kᵢ [φ:=p∧q, ψ:=q]', 'MP 2, 3', 'Tᵢ', 'MP 1, 2']
  }
];

const shuffle = <T,>(a: T[]) => [...a].sort((x, y) => (String(x) < String(y) ? -1 : 1));

const ProofBuilder: React.FC = () => {
  const [pid, setPid] = useState(PUZZLES[0].id);
  const puzzle = PUZZLES.find(p => p.id === pid)!;
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [checked, setChecked] = useState(false);
  const mine = answers[pid] || puzzle.lines.map(() => '');
  const setLine = (i: number, v: string) => {
    setAnswers({ ...answers, [pid]: mine.map((x, j) => (j === i ? v : x)) });
    setChecked(false);
  };
  const correct = mine.filter((a, i) => a === puzzle.lines[i].just).length;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {PUZZLES.map(p => <Pill key={p.id} active={p.id === pid} onClick={() => { setPid(p.id); setChecked(false); }}>{p.label}</Pill>)}
      </div>
      <p className="text-xs text-slate-600">
        Goal: <b className="font-mono">⊢ {puzzle.goal}</b> · system: {puzzle.system}. Each line must be an axiom instance or follow by MP / Nec from earlier lines. Pick the justification of every line.
      </p>
      <div className="border border-stone-200 rounded-xl divide-y divide-stone-100">
        {puzzle.lines.map((l, i) => {
          const ok = mine[i] === l.just;
          return (
            <div key={i} className="flex flex-wrap items-center gap-2 p-2 text-xs">
              <span className="w-5 font-mono text-slate-400">{i + 1}</span>
              <span className="flex-1 min-w-[12rem] font-mono text-slate-800">{l.f}</span>
              <select value={mine[i]} onChange={e => setLine(i, e.target.value)} className={`border rounded px-1.5 py-1 font-mono text-[11px] ${checked ? (ok ? 'border-emerald-500 bg-emerald-50' : 'border-rose-400 bg-rose-50') : 'border-stone-300'}`}>
                <option value="">justification…</option>
                {shuffle(puzzle.options).map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              {checked && (ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-500" />)}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setChecked(true)} className="px-3 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-bold">Check proof</button>
        <button onClick={() => { setAnswers({ ...answers, [pid]: puzzle.lines.map(l => l.just) }); setChecked(true); }} className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Show solution</button>
        <button onClick={() => { setAnswers({ ...answers, [pid]: puzzle.lines.map(() => '') }); setChecked(false); }} className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold inline-flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
        {checked && <span className={`text-xs font-bold ${correct === puzzle.lines.length ? 'text-emerald-700' : 'text-amber-700'}`}>{correct}/{puzzle.lines.length} lines justified correctly</span>}
      </div>
      <p className="text-[11px] text-slate-500">Reminder: Nec applies only to theorems (lines proved without assumptions). Uniform substitution: replace an atom everywhere by the same formula.</p>
    </div>
  );
};

// ------------------------------------------------------------------ correspondence
interface Corr {
  id: string; axiom: string; formula: string; property: string; definition: string;
  soundness: string[]; converse: string[];
  cm: { nodes: string[]; edges: [string, string][]; p: string[]; failsAt: string; text: string };
}

const CORR: Corr[] = [
  {
    id: 'T', axiom: 'T', formula: 'Kφ ⇒ φ', property: 'reflexive', definition: '∀w  wRw',
    soundness: ['Assume Kp true and p false at some w.', 'Every successor of w satisfies p, but w does not.', 'So w is not its own successor: ¬wRw.', 'Contraposition: on a reflexive frame T cannot fail.'],
    converse: ['Assume some w with ¬wRw.', 'Choose V(p) = R(w).', 'Kp holds at w (all successors are in R(w)).', 'w ∉ R(w), so p is false at w: T fails.'],
    cm: { nodes: ['w', 'v'], edges: [['w', 'v'], ['v', 'v']], p: ['v'], failsAt: 'w', text: 'R(w) = {v}, V(p) = {v}: Kp at w, ¬p at w.' }
  },
  {
    id: 'D', axiom: 'D', formula: 'Kφ ⇒ ¬K¬φ', property: 'serial', definition: '∀w ∃v  wRv',
    soundness: ['Assume Kp at w.', 'Seriality gives v with wRv; p holds at v.', 'So ¬p fails at v: K¬p is false at w.', 'Hence ¬K¬p at w.'],
    converse: ['Assume some w has no successor.', 'Then every K-formula is vacuously true at w.', 'Kp ∧ K¬p holds at w (for any V).', 'D fails at w.'],
    cm: { nodes: ['w'], edges: [], p: [], failsAt: 'w', text: 'No successor: Kp and K¬p both vacuously true.' }
  },
  {
    id: '4', axiom: '4', formula: 'Kφ ⇒ KKφ', property: 'transitive', definition: 'wRv ∧ vRu ⇒ wRu',
    soundness: ['Assume Kp at w, KKp false at w.', 'Some v with wRv has ¬Kp: some u with vRu has ¬p.', 'Kp at w forces u ∉ R(w): wRv, vRu, ¬wRu.', 'Transitivity fails; contraposition.'],
    converse: ['Take wRv, vRu, ¬wRu.', 'Choose V(p) = R(w).', 'Kp at w; p false at u so Kp false at v.', 'So KKp false at w: 4 fails.'],
    cm: { nodes: ['w', 'v', 'u'], edges: [['w', 'v'], ['v', 'u']], p: ['v'], failsAt: 'w', text: 'V(p) = R(w) = {v}: Kp at w, ¬Kp at v, so ¬KKp at w.' }
  },
  {
    id: 'B', axiom: 'B', formula: 'φ ⇒ K¬K¬φ', property: 'symmetric', definition: 'wRv ⇒ vRw',
    soundness: ['Assume p at w and K¬K¬p false at w.', 'Some v with wRv has K¬p.', 'p at w forces ¬vRw.', 'Symmetry fails; contraposition.'],
    converse: ['Take wRv and ¬vRw.', 'Choose V(p) = {w}.', 'v cannot see w, so K¬p at v.', 'wRv ⇒ K¬K¬p false at w, although p: B fails.'],
    cm: { nodes: ['w', 'v'], edges: [['w', 'v']], p: ['w'], failsAt: 'w', text: 'V(p) = {w}: v sees nothing with p, so K¬p at v.' }
  },
  {
    id: '5', axiom: '5', formula: '¬Kφ ⇒ K¬Kφ', property: 'Euclidean', definition: 'wRv ∧ wRu ⇒ vRu',
    soundness: ['Assume ¬Kp at w: some u, wRu, ¬p.', 'Assume K¬Kp false: some v, wRv, Kp at v.', 'v cannot see u: wRv, wRu, ¬vRu.', 'Euclideanness fails; contraposition.'],
    converse: ['Take wRv, wRu, ¬vRu.', 'Choose V(p) = R(v).', 'p false at u ⇒ ¬Kp at w; Kp at v.', 'wRv ⇒ K¬Kp false at w: 5 fails.'],
    cm: { nodes: ['w', 'v', 'u'], edges: [['w', 'v'], ['w', 'u']], p: [], failsAt: 'w', text: 'V(p) = R(v) = ∅: ¬Kp at w (u), Kp at v (vacuous).' }
  }
];

const MiniGraph: React.FC<{ cm: Corr['cm'] }> = ({ cm }) => {
  const x = (i: number) => 50 + i * 110;
  const has = (a: string, b: string) => cm.edges.some(([s, t]) => s === a && t === b);
  return (
    <svg viewBox={`0 0 ${Math.max(160, 100 + (cm.nodes.length - 1) * 110)} 110`} className="w-full max-w-xs bg-stone-50 rounded-lg border border-stone-200">
      <defs>
        <marker id="mg-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#0f766e" /></marker>
      </defs>
      {cm.edges.map(([a, b], k) => {
        const i = cm.nodes.indexOf(a), j = cm.nodes.indexOf(b);
        if (a === b) return <circle key={k} cx={x(i)} cy={30} r={10} fill="none" stroke="#0f766e" strokeWidth={1.6} />;
        const bend = has(b, a) ? 14 : 0;
        const dir = j > i ? 1 : -1;
        if (Math.abs(j - i) > 1) return <path key={k} d={`M${x(i)},${70} Q${(x(i) + x(j)) / 2},${100} ${x(j) - dir * 20},${72}`} fill="none" stroke="#0f766e" strokeWidth={1.6} markerEnd="url(#mg-arr)" />;
        return <path key={k} d={`M${x(i) + dir * 20},${55 - bend / 2} L${x(j) - dir * 22},${55 - bend / 2}`} fill="none" stroke="#0f766e" strokeWidth={1.6} markerEnd="url(#mg-arr)" />;
      })}
      {cm.nodes.map((n, i) => (
        <g key={n}>
          <circle cx={x(i)} cy={55} r={18} fill={n === cm.failsAt ? '#ffe4e6' : '#fff'} stroke={n === cm.failsAt ? '#be123c' : '#475569'} strokeWidth={1.6} />
          <text x={x(i)} y={59} textAnchor="middle" fontSize="12" fontWeight="700">{n}</text>
          <text x={x(i)} y={92} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#475569">{cm.p.includes(n) ? 'p' : '¬p'}</text>
        </g>
      ))}
    </svg>
  );
};

const Correspondence: React.FC = () => {
  const [id, setId] = useState('T');
  const [step, setStep] = useState(0);
  const c = CORR.find(x => x.id === id)!;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {CORR.map(x => <Pill key={x.id} active={x.id === id} onClick={() => { setId(x.id); setStep(0); }}>{x.axiom}: {x.formula}</Pill>)}
      </div>
      <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-sm">
        <b>Theorem.</b> R is <b>{c.property}</b> ({c.definition}) <b>⟺</b> F ⊨ {c.formula}
      </div>
      <div className="grid md:grid-cols-2 gap-4 text-xs">
        <div className="rounded-xl border border-emerald-200 p-3 space-y-1">
          <div className="font-bold text-emerald-800">(⇐) {c.property} ⇒ axiom valid</div>
          <ol className="list-decimal pl-4 space-y-1">{c.soundness.slice(0, step + 1).map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
        <div className="rounded-xl border border-rose-200 p-3 space-y-1">
          <div className="font-bold text-rose-800">(⇒) not {c.property} ⇒ countermodel</div>
          <ol className="list-decimal pl-4 space-y-1">{c.converse.slice(0, step + 1).map((s, i) => <li key={i}>{s}</li>)}</ol>
          {step >= 3 && (
            <div className="pt-2 space-y-1">
              <MiniGraph cm={c.cm} />
              <p className="text-slate-600">{c.cm.text}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setStep(s => Math.min(3, s + 1))} disabled={step >= 3} className="px-3 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-bold disabled:opacity-40">Next step</button>
        <button onClick={() => setStep(3)} className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold">Reveal all</button>
        <button onClick={() => setStep(0)} className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold">Restart</button>
      </div>
      <p className="text-[11px] text-slate-500">Axiom K needs no condition: it is valid on every frame. Equivalence = reflexive + symmetric + transitive = reflexive + transitive + Euclidean.</p>
    </div>
  );
};

export const ProofLab: React.FC = () => {
  const [tab, setTab] = useState<'proof' | 'corr'>('proof');
  return (
    <LabFrame
      title="Proof Workshop: Hilbert Derivations & Correspondence"
      subtitle="Justify every line of a Hilbert proof, then prove axiom ⟺ frame property in both directions, with the countermodel."
      source="Part 3.1 slides 14–15, 31–41 · Part 3.2 · TD Ex. 3"
      actions={
        <>
          <Pill active={tab === 'proof'} onClick={() => setTab('proof')}>Hilbert proofs</Pill>
          <Pill active={tab === 'corr'} onClick={() => setTab('corr')}>Correspondence theorems</Pill>
        </>
      }
    >
      {tab === 'proof' ? <ProofBuilder /> : <Correspondence />}
    </LabFrame>
  );
};
