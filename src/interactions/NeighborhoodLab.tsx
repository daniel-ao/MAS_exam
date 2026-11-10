import React, { useMemo, useState } from 'react';
import { LabFrame, TruthBadge } from './LabFrame';
import { NeighborhoodModel, Formula, parseFormula, formatFormula, extension, subformulas, neighborhoodConstraints, setKey } from '../logic/modal';
import { CheckCircle2, XCircle, Info, RotateCcw } from 'lucide-react';

interface Preset {
  id: string;
  label: string;
  note: string;
  model: NeighborhoodModel;
  atoms: string[];
  formulas: string[];
}

const PRESETS: Preset[] = [
  {
    id: 'biat', label: '3.3 · slides 26–28 · door & light (BIAT)', atoms: ['p', 'q'],
    note: 'p = door locked, q = light on. Only {w1, w2} is attributed to i at w1. Compute the truth set, then test membership.',
    model: { worlds: ['w1', 'w2', 'w3', 'w4'], neighborhoods: { i: { w1: [['w1', 'w2']], w2: [], w3: [], w4: [] } }, valuation: { p: ['w1', 'w2'], q: ['w1', 'w3'] } },
    formulas: ['BA_i p', 'BA_i q', 'BA_i (p ∨ q)', 'BA_i (p ∧ q)', 'BA_i T', 'BA_i BA_i p', 'BA_i p → BA_i BA_i p', '¬BA_i p → BA_i ¬BA_i p']
  },
  {
    id: 'repair', label: '3.3 · slide 29 · repair the assignment', atoms: ['p', 'q'],
    note: 'The student’s proposal. Check the constraints, then remove W and add the missing intersection {w1}.',
    model: { worlds: ['w1', 'w2', 'w3', 'w4'], neighborhoods: { i: { w1: [['w1', 'w2'], ['w1', 'w3'], ['w1', 'w2', 'w3', 'w4']], w2: [], w3: [], w4: [] } }, valuation: { p: ['w1', 'w2'], q: ['w1', 'w3'] } },
    formulas: ['BA_i p', 'BA_i q', 'BA_i (p ∧ q)', 'BA_i (p ∨ q)', 'BA_i T']
  },
  {
    id: 'td4', label: 'TD · Ex. 4 · neighborhood model checker', atoms: ['p', 'q'],
    note: 'N(a) = {{a,b},{b,c}}, N(b) = {W}, N(c) = ∅. No monotonicity, no intersection closure assumed.',
    model: { worlds: ['a', 'b', 'c'], neighborhoods: { N: { a: [['a', 'b'], ['b', 'c']], b: [['a', 'b', 'c']], c: [] } }, valuation: { p: ['a', 'b'], q: ['b', 'c'] } },
    formulas: ['□p', '□q', '□(p ∧ q)', '□(p ∨ q)', '□p ∧ □q', '(□p ∧ □q) → □(p ∧ q)', '□(p → q) → (□p → □q)', '◇p', '◇⊥']
  },
  {
    id: 'kfail', label: 'TD · Ex. 4.3 · axiom K fails', atoms: ['p', 'q'],
    note: 'A countermodel to K: both □(p → q) and □p hold at a, but □q does not.',
    model: { worlds: ['a', 'b'], neighborhoods: { N: { a: [['a'], ['b']], b: [] } }, valuation: { p: ['a'], q: [] } },
    formulas: ['□(p → q)', '□p', '□q', '□(p → q) → (□p → □q)']
  }
];

const subsets = (ws: string[]): string[][] => {
  const out: string[][] = [];
  for (let mask = 0; mask < 1 << ws.length; mask++) out.push(ws.filter((_, i) => mask & (1 << i)));
  return out.sort((a, b) => a.length - b.length);
};
const show = (s: string[]) => (s.length === 0 ? '∅' : `{${s.join(',')}}`);

const clone = (m: NeighborhoodModel): NeighborhoodModel => JSON.parse(JSON.stringify(m));

export const NeighborhoodLab: React.FC<{ initialPreset?: string }> = ({ initialPreset }) => {
  const [presetId, setPresetId] = useState(PRESETS.some(p => p.id === initialPreset) ? initialPreset! : PRESETS[0].id);
  const preset = PRESETS.find(p => p.id === presetId)!;
  const [model, setModel] = useState<NeighborhoodModel>(() => clone(preset.model));
  const [formulaText, setFormulaText] = useState(preset.formulas[0]);
  const rel = Object.keys(model.neighborhoods)[0];

  const load = (id: string) => {
    const p = PRESETS.find(x => x.id === id)!;
    setPresetId(id);
    setModel(clone(p.model));
    setFormulaText(p.formulas[0]);
  };

  const parsed = useMemo((): { f?: Formula; error?: string } => {
    try {
      return { f: parseFormula(formulaText) };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [formulaText]);

  const toggleSet = (w: string, X: string[]) => {
    setModel(m => {
      const cur = m.neighborhoods[rel][w] || [];
      const k = setKey(X);
      const next = cur.some(Y => setKey(Y) === k) ? cur.filter(Y => setKey(Y) !== k) : [...cur, X];
      return { ...m, neighborhoods: { ...m.neighborhoods, [rel]: { ...m.neighborhoods[rel], [w]: next } } };
    });
  };
  const toggleVal = (a: string, w: string) =>
    setModel(m => {
      const cur = m.valuation[a] || [];
      return { ...m, valuation: { ...m.valuation, [a]: cur.includes(w) ? cur.filter(x => x !== w) : [...cur, w] } };
    });

  const rows = parsed.f ? subformulas(parsed.f).filter(g => g.kind !== 'top' && g.kind !== 'bot') : [];
  const constraints = neighborhoodConstraints(model, rel);
  const allSubsets = subsets(model.worlds);

  return (
    <LabFrame
      title="Neighborhood Model Checker"
      subtitle="□φ (BAᵢφ, Eᵢᵈφ) is true at w iff the truth set ⟦φ⟧ is a member of N(w). No edges: compute sets, then test membership."
      source="Part 3.3 slides 23–29 · Part 3.4 · TD Ex. 4"
      actions={
        <select value={presetId} onChange={e => load(e.target.value)} className="text-xs font-semibold border border-stone-300 rounded-lg px-2 py-1.5 bg-white max-w-[16rem]">
          {PRESETS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      }
    >
      <div className="flex items-start gap-2 text-xs text-slate-600 bg-sky-50 border border-sky-100 rounded-xl p-3 mb-4">
        <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" /> <span>{preset.note}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <input
            value={formulaText}
            onChange={e => setFormulaText(e.target.value)}
            spellCheck={false}
            className={`w-full font-mono text-sm px-3 py-2 rounded-lg border ${parsed.error ? 'border-rose-400 bg-rose-50' : 'border-stone-300'}`}
          />
          <div className="flex flex-wrap gap-1.5">
            {preset.formulas.map(f => (
              <button key={f} onClick={() => setFormulaText(f)} className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-100 hover:bg-teal-50 border border-stone-200">{f}</button>
            ))}
          </div>
          {parsed.error && <p className="text-xs text-rose-700 font-semibold">{parsed.error}</p>}
          {parsed.f && (
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-xs">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="text-left px-2 py-1.5 font-semibold text-slate-600">Subformula</th>
                    <th className="text-left px-2 py-1.5 font-semibold text-slate-600">Truth set ⟦·⟧</th>
                    {model.worlds.map(w => <th key={w} className="px-1.5 font-mono text-slate-600">{w}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {rows.map((g, i) => {
                    const ext = extension(g, model);
                    return (
                      <tr key={i} className={i === rows.length - 1 ? 'bg-teal-50/60 font-bold' : ''}>
                        <td className="px-2 py-1 font-mono whitespace-nowrap">{formatFormula(g)}</td>
                        <td className="px-2 py-1 font-mono text-slate-600 whitespace-nowrap">{show(ext)}</td>
                        {model.worlds.map(w => (
                          <td key={w} className="px-1.5 py-1 text-center"><TruthBadge value={ext.includes(w)} small /></td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="text-[11px] text-slate-500 bg-stone-50 rounded-lg p-2.5 leading-relaxed">
            <b>Pseudo-code (TD 4.5).</b> ext(□φ) = {'{'} w ∈ W : ext(φ) ∈ N(w) {'}'}. The relational checker loops over the successors of w;
            this one builds the whole extension of φ first and compares <i>sets</i>. ◇φ = ¬□¬φ is NOT “some accessible world”.
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-stone-200 p-3 space-y-1.5">
            <div className="text-xs font-bold text-slate-700">Constraints on N (BIAT / KBE Eᵈ)</div>
            {constraints.map(c => (
              <div key={c.name} className="flex items-start gap-2 text-xs">
                {c.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                <span className="font-semibold text-slate-700 w-44 shrink-0">{c.name}</span>
                <span className="text-slate-500">{c.detail}</span>
              </div>
            ))}
            <p className="text-[11px] text-slate-500 pt-1">BIAT requires the first three. Upward closure is what BIAT deliberately does NOT have (so BAp ∧ ¬BA(p ∨ q) is possible).</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Neighborhoods N(w) · click sets to toggle</h4>
              <button onClick={() => load(presetId)} className="text-[11px] px-2 py-1 rounded border border-stone-300 hover:bg-stone-50 inline-flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> reset
              </button>
            </div>
            <div className="space-y-2">
              {model.worlds.map(w => {
                const mine = model.neighborhoods[rel][w] || [];
                return (
                  <div key={w} className="flex items-start gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 w-8 pt-1">{w}</span>
                    <div className="flex flex-wrap gap-1">
                      {allSubsets.map(X => {
                        const on = mine.some(Y => setKey(Y) === setKey(X));
                        return (
                          <button
                            key={setKey(X)}
                            onClick={() => toggleSet(w, X)}
                            className={`text-[10.5px] font-mono px-1.5 py-0.5 rounded border ${on ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-400 border-stone-200 hover:border-violet-300'}`}
                          >
                            {show(X)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Valuation</h4>
            <table className="text-xs">
              <thead>
                <tr>
                  <th />
                  {model.worlds.map(w => <th key={w} className="px-1.5 font-mono text-slate-600">{w}</th>)}
                </tr>
              </thead>
              <tbody>
                {preset.atoms.map(a => (
                  <tr key={a}>
                    <td className="pr-2 font-mono font-bold">{a}</td>
                    {model.worlds.map(w => (
                      <td key={w} className="px-1.5 text-center">
                        <input type="checkbox" checked={(model.valuation[a] || []).includes(w)} onChange={() => toggleVal(a, w)} className="accent-teal-700" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LabFrame>
  );
};
