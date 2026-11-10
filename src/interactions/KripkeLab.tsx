import React, { useMemo, useState } from 'react';
import { LabFrame, Pill, TruthBadge } from './LabFrame';
import {
  KripkeModel,
  Formula,
  parseFormula,
  formatFormula,
  evalKripke,
  subformulas,
  successors,
  relationFor,
  frameProperties
} from '../logic/modal';
import { CheckCircle2, XCircle, RotateCcw, Info } from 'lucide-react';

interface Preset {
  id: string;
  label: string;
  note: string;
  model: KripkeModel;
  atoms: string[];
  actual: string;
  formulas: string[];
}

const eq = (classes: string[][]): [string, string][] => classes.flatMap(c => c.flatMap(a => c.map(b => [a, b] as [string, string])));

const PRESETS: Preset[] = [
  {
    id: 'key-door', label: '3.1 · slide 22 · key & door', actual: 'w1', atoms: ['p', 'q'],
    note: 'p = key in the drawer, q = door locked. One agent; classes {w1, w2} and {w3}.',
    model: { worlds: ['w1', 'w2', 'w3'], relations: { K: eq([['w1', 'w2'], ['w3']]) }, valuation: { p: ['w1', 'w2'], q: ['w1', 'w3'] } },
    formulas: ['K p', 'K q', 'K ¬q', '¬K q ∧ ¬K ¬q']
  },
  {
    id: 'two-agents', label: '3.1 · slide 23 · agents a & b', actual: 'w1', atoms: ['p', 'q'],
    note: 'a confuses worlds in the same row (w1–w2, w3–w4), b in the same column (w1–w3, w2–w4).',
    model: { worlds: ['w1', 'w2', 'w3', 'w4'], relations: { a: eq([['w1', 'w2'], ['w3', 'w4']]), b: eq([['w1', 'w3'], ['w2', 'w4']]) }, valuation: { p: ['w1', 'w2'], q: ['w1', 'w3'] } },
    formulas: ['K_a p', 'K_b q', 'K_a q', '¬K_a q', 'K_a ¬q', 'K_a K_b q']
  },
  {
    id: 'reflexive', label: '3.1 · slide 26 · reflexivity & T', actual: 'a', atoms: ['p'],
    note: 'Remove the loop (a,a) in the relation editor and watch T fail at a.',
    model: { worlds: ['a', 'b', 'c'], relations: { K: [['a', 'a'], ['b', 'b'], ['c', 'c'], ['a', 'b'], ['b', 'c']] }, valuation: { p: ['b', 'c'] } },
    formulas: ['K p', 'K p → p']
  },
  {
    id: 'transitive', label: '3.1 · slide 27A · transitivity & 4', actual: 'a', atoms: ['p'],
    note: 'Transitive relation: Kp and KKp agree everywhere.',
    model: { worlds: ['a', 'b', 'c'], relations: { K: [['a', 'b'], ['a', 'c'], ['b', 'c'], ['c', 'c']] }, valuation: { p: ['b', 'c'] } },
    formulas: ['K p', 'K K p', 'K p → K K p']
  },
  {
    id: 'symmetric', label: '3.1 · slide 27B · symmetry & B', actual: 'a', atoms: ['p'],
    note: 'Symmetric relation: evaluate K¬K¬p from the inside out.',
    model: { worlds: ['a', 'b', 'c'], relations: { K: [['a', 'b'], ['b', 'a'], ['b', 'c'], ['c', 'b']] }, valuation: { p: ['a', 'c'] } },
    formulas: ['p', 'K ¬p', 'K ¬K ¬p', 'p → K ¬K ¬p']
  },
  {
    id: 'euclidean', label: '3.1 · slide 30 · Euclidean & 5', actual: 'a', atoms: ['p'],
    note: 'Whenever ¬Kp holds, K¬Kp holds too.',
    model: { worlds: ['a', 'b', 'c', 'd'], relations: { K: [['a', 'b'], ['a', 'c'], ['b', 'b'], ['b', 'c'], ['c', 'b'], ['c', 'c'], ['d', 'd']] }, valuation: { p: ['b', 'd'] } },
    formulas: ['K p', '¬K p', 'K ¬K p', '¬K p → K ¬K p']
  },
  {
    id: 'axiom-k', label: '3.1 · slide 35 · axiom K', actual: 'a', atoms: ['p', 'q'],
    note: 'Try to edit the model so that axiom K fails somewhere. You cannot.',
    model: { worlds: ['a', 'b', 'c', 'd'], relations: { K: [['a', 'b'], ['a', 'c'], ['b', 'b'], ['c', 'c'], ['d', 'd']] }, valuation: { p: ['b', 'd'], q: ['c', 'd'] } },
    formulas: ['K (p → q)', 'K p', 'K q', 'K (p → q) → (K p → K q)']
  },
  {
    id: 'no-nec', label: '3.1 · slide 44 · truth without knowledge', actual: 'w', atoms: ['p'],
    note: 'p true at w but not known. Set p true at v too (slide 45) and Kp becomes true.',
    model: { worlds: ['w', 'v'], relations: { K: eq([['w', 'v']]) }, valuation: { p: ['w'] } },
    formulas: ['p', 'K p', 'p → K p']
  },
  {
    id: 'kd45', label: '3.2 · slide 5 · false belief (KD45)', actual: 'w', atoms: ['p', 'q'],
    note: 'Every world believes {u, v}. The actual world w is not among its own alternatives.',
    model: { worlds: ['w', 'u', 'v'], relations: { B: ['w', 'u', 'v'].flatMap(x => [[x, 'u'], [x, 'v']] as [string, string][]) }, valuation: { p: ['u', 'v'], q: ['u'] } },
    formulas: ['B p ∧ ¬p', '¬B q ∧ ¬B ¬q', 'B B p', 'B ¬B q', 'B p → p']
  },
  {
    id: 'kd45-min', label: '3.2 · slide 11 · minimal false belief', actual: 'w', atoms: ['p'],
    note: 'The two-world solution: serial, transitive, Euclidean, not reflexive.',
    model: { worlds: ['w', 'v'], relations: { B: [['w', 'v'], ['v', 'v']] }, valuation: { p: ['v'] } },
    formulas: ['B p ∧ ¬p', 'B p → p', 'B p → ¬B ¬p', 'B p → B B p', '¬B p → B ¬B p']
  },
  {
    id: 'stit', label: '3.3 · slides 15, 22 · door & alarm (STIT)', actual: 'w1', atoms: ['p', 'q'],
    note: 'p = door locked, q = alarm armed. i chooses the row, j the column: Eᵢ quantifies over i’s cell.',
    model: { worlds: ['w1', 'w2', 'w3', 'w4'], relations: { i: eq([['w1', 'w2'], ['w3', 'w4']]), j: eq([['w1', 'w3'], ['w2', 'w4']]) }, valuation: { p: ['w1', 'w2'], q: ['w1', 'w3'] } },
    formulas: ['E_i p', 'E_i q', 'E_j q', 'E_j p', 'E_i E_i p', 'E_i ¬E_i q', 'E_i E_j q', 'q → E_i q']
  },
  {
    id: 'td1', label: 'TD · Ex. 1 · model checking with □ and ◇', actual: 'w0', atoms: ['p', 'q'],
    note: 'w3 has no successor: □ is vacuously true there and ◇ false.',
    model: { worlds: ['w0', 'w1', 'w2', 'w3'], relations: { R: [['w0', 'w1'], ['w0', 'w2'], ['w1', 'w1'], ['w1', 'w3'], ['w2', 'w3']] }, valuation: { p: ['w0', 'w1'], q: ['w1', 'w3'] } },
    formulas: ['p → q', '□p', '◇q', '□◇q', '◇□p', '□(p → ◇q)', '◇(p ∧ □q)', '□p → p', '◇□q']
  }
];

const REL_COLORS = ['#0f766e', '#7c3aed', '#c2410c', '#2563eb'];

const clone = (m: KripkeModel): KripkeModel => ({
  worlds: [...m.worlds],
  relations: Object.fromEntries(Object.entries(m.relations).map(([k, v]) => [k, v.map(e => [...e] as [string, string])])),
  valuation: Object.fromEntries(Object.entries(m.valuation).map(([k, v]) => [k, [...v]]))
});

export const KripkeLab: React.FC<{ initialPreset?: string }> = ({ initialPreset }) => {
  const [presetId, setPresetId] = useState(PRESETS.some(p => p.id === initialPreset) ? initialPreset! : PRESETS[0].id);
  const preset = PRESETS.find(p => p.id === presetId)!;
  const [model, setModel] = useState<KripkeModel>(() => clone(preset.model));
  const [atoms, setAtoms] = useState<string[]>(preset.atoms);
  const [actual, setActual] = useState(preset.actual);
  const [formulaText, setFormulaText] = useState(preset.formulas[preset.formulas.length - 1]);
  const [editRel, setEditRel] = useState(Object.keys(preset.model.relations)[0]);

  const loadPreset = (id: string) => {
    const p = PRESETS.find(x => x.id === id)!;
    setPresetId(id);
    setModel(clone(p.model));
    setAtoms(p.atoms);
    setActual(p.actual);
    setFormulaText(p.formulas[p.formulas.length - 1]);
    setEditRel(Object.keys(p.model.relations)[0]);
  };

  const relNames = Object.keys(model.relations);
  const parsed = useMemo((): { f?: Formula; error?: string } => {
    try {
      return { f: parseFormula(formulaText) };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [formulaText]);

  const unknownRelations = useMemo(() => {
    if (!parsed.f) return [];
    const missing = new Set<string>();
    subformulas(parsed.f).forEach(g => {
      if (g.kind === 'box' || g.kind === 'dia') {
        const r = relationFor(g.op, g.agent, model);
        if (!relNames.includes(r)) missing.add(r);
      }
    });
    return [...missing];
  }, [parsed.f, model, relNames]);

  // ------------------------------------------------------------- editing helpers
  const has = (rel: string, a: string, b: string) => (model.relations[rel] || []).some(([x, y]) => x === a && y === b);
  const toggleEdge = (rel: string, a: string, b: string) => {
    setModel(m => {
      const edges = m.relations[rel] || [];
      const exists = edges.some(([x, y]) => x === a && y === b);
      return { ...m, relations: { ...m.relations, [rel]: exists ? edges.filter(([x, y]) => !(x === a && y === b)) : [...edges, [a, b]] } };
    });
  };
  const transformRel = (rel: string, kind: 'refl' | 'sym' | 'trans' | 'clear') => {
    setModel(m => {
      let edges = [...(m.relations[rel] || [])];
      const hasE = (a: string, b: string) => edges.some(([x, y]) => x === a && y === b);
      if (kind === 'clear') edges = [];
      if (kind === 'refl') m.worlds.forEach(w => !hasE(w, w) && edges.push([w, w]));
      if (kind === 'sym') [...edges].forEach(([a, b]) => !hasE(b, a) && edges.push([b, a]));
      if (kind === 'trans') {
        let changed = true;
        while (changed) {
          changed = false;
          for (const [a, b] of [...edges]) for (const [c, d] of [...edges]) if (b === c && !hasE(a, d)) { edges.push([a, d]); changed = true; }
        }
      }
      return { ...m, relations: { ...m.relations, [rel]: edges } };
    });
  };
  const toggleVal = (atom: string, w: string) => {
    setModel(m => {
      const cur = m.valuation[atom] || [];
      return { ...m, valuation: { ...m.valuation, [atom]: cur.includes(w) ? cur.filter(x => x !== w) : [...cur, w] } };
    });
  };
  const addWorld = () => {
    if (model.worlds.length >= 6) return;
    let n = model.worlds.length;
    let name = `w${n}`;
    while (model.worlds.includes(name)) name = `w${++n}`;
    setModel(m => ({ ...m, worlds: [...m.worlds, name] }));
  };
  const removeWorld = (w: string) => {
    if (model.worlds.length <= 1) return;
    setModel(m => ({
      worlds: m.worlds.filter(x => x !== w),
      relations: Object.fromEntries(Object.entries(m.relations).map(([k, v]) => [k, v.filter(([a, b]) => a !== w && b !== w)])),
      valuation: Object.fromEntries(Object.entries(m.valuation).map(([k, v]) => [k, v.filter(x => x !== w)]))
    }));
    if (actual === w) setActual(model.worlds.find(x => x !== w)!);
  };
  const addAtom = () => {
    const next = ['p', 'q', 'r', 's', 't'].find(a => !atoms.includes(a));
    if (next) setAtoms([...atoms, next]);
  };

  // ------------------------------------------------------------- evaluation
  const rows = parsed.f ? subformulas(parsed.f).filter(g => g.kind !== 'top' && g.kind !== 'bot') : [];
  const topValue = (w: string) => (parsed.f ? evalKripke(parsed.f, model, w) : false);
  const explanation = useMemo(() => {
    const f = parsed.f;
    if (!f || (f.kind !== 'box' && f.kind !== 'dia')) return null;
    const rel = relationFor(f.op, f.agent, model);
    const succ = successors(model, rel, actual);
    return { rel, succ: succ.map(v => ({ v, ok: evalKripke(f.f, model, v) })), inner: formatFormula(f.f), isBox: f.kind === 'box' };
  }, [parsed.f, model, actual]);

  // ------------------------------------------------------------- layout
  const W = 420, H = 300, cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 48;
  const pos = (w: string) => {
    const i = model.worlds.indexOf(w), n = model.worlds.length;
    if (n === 1) return { x: cx, y: cy };
    const ang = -Math.PI / 2 + (2 * Math.PI * i) / n + (n === 4 ? Math.PI / 4 : 0);
    return { x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) };
  };

  return (
    <LabFrame
      title="Kripke Model Checker"
      subtitle="Edit worlds, accessibility and valuation, type any formula, and watch it evaluated at every world, subformula by subformula."
      source="Parts 3.1–3.3 · TD Ex. 1"
      actions={
        <select value={presetId} onChange={e => loadPreset(e.target.value)} className="text-xs font-semibold border border-stone-300 rounded-lg px-2 py-1.5 bg-white max-w-[16rem]">
          {PRESETS.map(p => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      }
    >
      <div className="flex items-start gap-2 text-xs text-slate-600 bg-sky-50 border border-sky-100 rounded-xl p-3 mb-4">
        <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
        <span>{preset.note}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Graph */}
        <div className="space-y-2">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-stone-50 rounded-xl border border-stone-200">
            <defs>
              {relNames.map((r, i) => (
                <marker key={r} id={`arr-${r}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill={REL_COLORS[i % REL_COLORS.length]} />
                </marker>
              ))}
            </defs>
            {relNames.map((r, ri) =>
              (model.relations[r] || []).map(([a, b]) => {
                const color = REL_COLORS[ri % REL_COLORS.length];
                const pa = pos(a), pb = pos(b);
                if (a === b) {
                  const off = 26 + ri * 9;
                  const dx = pa.x - cx, dy = pa.y - cy, len = Math.hypot(dx, dy) || 1;
                  const ux = dx / len, uy = dy / len;
                  const lx = pa.x + ux * off, ly = pa.y + uy * off;
                  return <circle key={`${r}-${a}-${b}`} cx={lx} cy={ly} r={9} fill="none" stroke={color} strokeWidth={1.6} opacity={0.75} />;
                }
                const dx = pb.x - pa.x, dy = pb.y - pa.y, len = Math.hypot(dx, dy);
                const ux = dx / len, uy = dy / len;
                const bend = (has(r, b, a) ? 0 : 0) + ri * 10 + 14;
                const sx = pa.x + ux * 22, sy = pa.y + uy * 22, ex = pb.x - ux * 24, ey = pb.y - uy * 24;
                const mx = (sx + ex) / 2 - uy * bend, my = (sy + ey) / 2 + ux * bend;
                return (
                  <path key={`${r}-${a}-${b}`} d={`M${sx},${sy} Q${mx},${my} ${ex},${ey}`} fill="none" stroke={color} strokeWidth={1.6} markerEnd={`url(#arr-${r})`} opacity={0.85} />
                );
              })
            )}
            {model.worlds.map(w => {
              const p = pos(w);
              const val = parsed.f ? topValue(w) : null;
              const trueAtoms = atoms.filter(a => (model.valuation[a] || []).includes(w));
              return (
                <g key={w} onClick={() => setActual(w)} className="cursor-pointer">
                  <circle cx={p.x} cy={p.y} r={20} fill={val === null ? '#fff' : val ? '#d1fae5' : '#ffe4e6'} stroke={w === actual ? '#b45309' : '#475569'} strokeWidth={w === actual ? 3 : 1.5} />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e293b">{w}</text>
                  <text x={p.x} y={p.y + 36} textAnchor="middle" fontSize="11" fill="#475569" fontFamily="monospace">
                    {trueAtoms.length ? trueAtoms.join(',') : '∅'}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            {relNames.map((r, i) => (
              <span key={r} className="inline-flex items-center gap-1">
                <span className="w-4 h-1 rounded" style={{ background: REL_COLORS[i % REL_COLORS.length] }} /> relation <b className="font-mono">{r}</b>
              </span>
            ))}
            <span>· click a world to make it the actual world (gold) · green = formula true</span>
          </div>
        </div>

        {/* Formula & evaluation */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">Formula</label>
          <input
            value={formulaText}
            onChange={e => setFormulaText(e.target.value)}
            spellCheck={false}
            className={`w-full font-mono text-sm px-3 py-2 rounded-lg border ${parsed.error ? 'border-rose-400 bg-rose-50' : 'border-stone-300'}`}
          />
          <div className="flex flex-wrap gap-1.5">
            {preset.formulas.map(f => (
              <button key={f} onClick={() => setFormulaText(f)} className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-100 hover:bg-teal-50 border border-stone-200">
                {f}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">
            Syntax: ¬ ~ · ∧ &amp; · ∨ | · → -&gt; · ↔ &lt;-&gt; · □ [] · ◇ &lt;&gt; · K p, K_a p, B p, E_i p (agent after “_” names the relation).
          </p>
          {parsed.error && <p className="text-xs text-rose-700 font-semibold">{parsed.error}</p>}
          {unknownRelations.length > 0 && (
            <p className="text-xs text-amber-700 font-semibold">No relation named {unknownRelations.join(', ')} in this model: its modalities quantify over nothing (vacuously true □).</p>
          )}

          {parsed.f && (
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-xs">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="text-left px-2 py-1.5 font-semibold text-slate-600">Subformula</th>
                    {model.worlds.map(w => (
                      <th key={w} className={`px-1.5 py-1.5 font-mono ${w === actual ? 'text-amber-700' : 'text-slate-600'}`}>{w}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {rows.map((g, i) => (
                    <tr key={i} className={i === rows.length - 1 ? 'bg-teal-50/60 font-bold' : ''}>
                      <td className="px-2 py-1 font-mono text-slate-800 whitespace-nowrap">{formatFormula(g)}</td>
                      {model.worlds.map(w => (
                        <td key={w} className={`px-1.5 py-1 text-center ${w === actual ? 'bg-amber-50' : ''}`}>
                          <TruthBadge value={evalKripke(g, model, w)} small />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {parsed.f && (
            <div className="text-xs rounded-xl border border-stone-200 p-3 bg-white space-y-1">
              <div className="font-bold text-slate-800">
                At {actual}: <span className="font-mono">{formatFormula(parsed.f)}</span> is{' '}
                <span className={topValue(actual) ? 'text-emerald-700' : 'text-rose-700'}>{topValue(actual) ? 'TRUE' : 'FALSE'}</span>
              </div>
              {explanation && (
                <div className="text-slate-600">
                  Successors of {actual} via <b className="font-mono">{explanation.rel}</b>:{' '}
                  {explanation.succ.length === 0 ? (
                    <i>none, so {explanation.isBox ? 'every' : 'no'} “{explanation.isBox ? '□' : '◇'}” claim holds {explanation.isBox ? '(vacuous truth)' : ''}</i>
                  ) : (
                    explanation.succ.map(s => (
                      <span key={s.v} className={`inline-block mr-1.5 font-mono ${s.ok ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {s.v}:{s.ok ? '✓' : '✗'}
                      </span>
                    ))
                  )}
                  {explanation.succ.length > 0 && (
                    <span>
                      {' '}
                      → {explanation.isBox ? 'needs ✓ at all' : 'needs ✓ at one'} for <span className="font-mono">{explanation.inner}</span>.
                    </span>
                  )}
                </div>
              )}
              <div className="text-slate-500">
                Valid in this model? <b>{model.worlds.every(topValue) ? 'yes (true at every world)' : 'no'}</b> · satisfiable in this model? <b>{model.worlds.some(topValue) ? 'yes' : 'no'}</b>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editors */}
      <div className="grid lg:grid-cols-2 gap-5 mt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Accessibility relation</h4>
            <div className="flex gap-1">
              {relNames.map(r => (
                <Pill key={r} active={editRel === r} onClick={() => setEditRel(r)}>{r}</Pill>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="text-xs">
              <thead>
                <tr>
                  <th className="px-1 text-slate-400 font-normal">from \ to</th>
                  {model.worlds.map(w => <th key={w} className="px-1.5 font-mono text-slate-600">{w}</th>)}
                </tr>
              </thead>
              <tbody>
                {model.worlds.map(a => (
                  <tr key={a}>
                    <td className="pr-2 font-mono text-slate-600 font-bold">{a}</td>
                    {model.worlds.map(b => (
                      <td key={b} className="px-1.5 py-0.5 text-center">
                        <input type="checkbox" checked={has(editRel, a, b)} onChange={() => toggleEdge(editRel, a, b)} className="accent-teal-700" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => transformRel(editRel, 'refl')} className="text-[11px] px-2 py-1 rounded border border-stone-300 hover:bg-stone-50">+ all loops</button>
            <button onClick={() => transformRel(editRel, 'sym')} className="text-[11px] px-2 py-1 rounded border border-stone-300 hover:bg-stone-50">symmetrize</button>
            <button onClick={() => transformRel(editRel, 'trans')} className="text-[11px] px-2 py-1 rounded border border-stone-300 hover:bg-stone-50">transitive closure</button>
            <button onClick={() => transformRel(editRel, 'clear')} className="text-[11px] px-2 py-1 rounded border border-stone-300 hover:bg-stone-50">clear</button>
            <button onClick={() => loadPreset(presetId)} className="text-[11px] px-2 py-1 rounded border border-stone-300 hover:bg-stone-50 inline-flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> reset preset
            </button>
          </div>

          {/* Frame properties */}
          {(() => {
            const fp = frameProperties(model.worlds, model.relations[editRel] || []);
            const props: { key: keyof typeof fp.witnesses; label: string; axiom: string }[] = [
              { key: 'reflexive', label: 'Reflexive', axiom: 'T: □φ → φ' },
              { key: 'serial', label: 'Serial', axiom: 'D: □φ → ◇φ' },
              { key: 'symmetric', label: 'Symmetric', axiom: 'B: φ → □◇φ' },
              { key: 'transitive', label: 'Transitive', axiom: '4: □φ → □□φ' },
              { key: 'euclidean', label: 'Euclidean', axiom: '5: ◇φ → □◇φ' }
            ];
            const isEq = fp.reflexive && fp.symmetric && fp.transitive;
            const isKD45 = fp.serial && fp.transitive && fp.euclidean;
            return (
              <div className="rounded-xl border border-stone-200 p-3 space-y-1.5">
                <div className="text-xs font-bold text-slate-700">
                  Frame of <span className="font-mono">{editRel}</span>: {isEq ? 'equivalence relation → S5' : isKD45 ? 'serial + transitive + Euclidean → KD45' : 'neither S5 nor KD45'}
                </div>
                {props.map(p => {
                  const ok = fp[p.key] as boolean;
                  return (
                    <div key={p.key} className="flex items-start gap-2 text-xs">
                      {ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                      <span className="w-20 font-semibold text-slate-700">{p.label}</span>
                      <span className="font-mono text-slate-500 w-28 shrink-0">{p.axiom}</span>
                      <span className="text-slate-500">{ok ? 'valid on this frame' : fp.witnesses[p.key]}</span>
                    </div>
                  );
                })}
                <div className="text-[11px] text-slate-500 pt-1">Axiom K holds on every frame.</div>
              </div>
            );
          })()}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Valuation V</h4>
            <div className="flex gap-1">
              <button onClick={addAtom} className="text-[11px] px-2 py-1 rounded border border-stone-300 hover:bg-stone-50">+ atom</button>
              <button onClick={addWorld} className="text-[11px] px-2 py-1 rounded border border-stone-300 hover:bg-stone-50" disabled={model.worlds.length >= 6}>+ world</button>
            </div>
          </div>
          <table className="text-xs">
            <thead>
              <tr>
                <th />
                {model.worlds.map(w => (
                  <th key={w} className="px-1.5 font-mono text-slate-600">
                    {w}
                    <button onClick={() => removeWorld(w)} className="ml-0.5 text-slate-300 hover:text-rose-600" title={`remove ${w}`}>×</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {atoms.map(a => (
                <tr key={a}>
                  <td className="pr-2 font-mono font-bold text-slate-700">{a}</td>
                  {model.worlds.map(w => (
                    <td key={w} className="px-1.5 py-0.5 text-center">
                      <input type="checkbox" checked={(model.valuation[a] || []).includes(w)} onChange={() => toggleVal(a, w)} className="accent-teal-700" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-[11px] text-slate-500 leading-relaxed bg-stone-50 rounded-lg p-2.5">
            <b>Exam method.</b> Evaluate inside-out: atoms, then connectives at the same world, then each modality by looking at the
            successors of the world. For a false □φ, name an accessible counterexample; for a true ◇φ, name a witness.
          </div>
        </div>
      </div>
    </LabFrame>
  );
};
