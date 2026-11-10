import React, { useMemo, useState } from 'react';
import { LabFrame, Pill } from './LabFrame';
import { MathView } from '../components/MathView';
import { ShieldCheck, Zap, X } from 'lucide-react';

interface Witness { name: string; c: number; p: number; n: number }
interface Scenario { direct: { p: number; n: number }; witnesses: Witness[]; threshold: number; sybil: { c: number; p: number } }

const PRESETS: Record<string, { label: string; s: Scenario }> = {
  bob: {
    label: 'Alice & Bob (slides 8–12)',
    s: { direct: { p: 6, n: 4 }, witnesses: [{ name: 'Carol', c: 1, p: 3, n: 2 }], threshold: 0.7, sybil: { c: 1, p: 3 } }
  },
  seller: {
    label: 'Seller S exercise (slide 13)',
    s: { direct: { p: 7, n: 5 }, witnesses: [{ name: 'Witness 1', c: 0.8, p: 4, n: 1 }, { name: 'Witness 2', c: 0.5, p: 2, n: 2 }], threshold: 0.65, sybil: { c: 0.4, p: 4 } }
  }
};

const fmt = (x: number) => (Math.round(x * 1000) / 1000).toString();

export const ReputationLab: React.FC = () => {
  const [presetKey, setPresetKey] = useState<keyof typeof PRESETS>('bob');
  const [s, setS] = useState<Scenario>(() => JSON.parse(JSON.stringify(PRESETS.bob.s)));
  const [k, setK] = useState(0);
  const [defense, setDefense] = useState(false);

  const load = (key: keyof typeof PRESETS) => {
    setPresetKey(key);
    setS(JSON.parse(JSON.stringify(PRESETS[key].s)));
    setK(0);
    setDefense(false);
  };

  const sybilC = defense ? 0 : s.sybil.c;
  const calc = useMemo(() => {
    const P = s.direct.p + s.witnesses.reduce((a, w) => a + w.c * w.p, 0);
    const N = s.direct.n + s.witnesses.reduce((a, w) => a + w.c * w.n, 0);
    const R = (1 + P) / (2 + P + N);
    const Pk = P + k * sybilC * s.sybil.p;
    const Rk = (1 + Pk) / (2 + Pk + N);
    const add = sybilC * s.sybil.p;
    let needed: number | null = null;
    if (R >= s.threshold) needed = 0;
    else if (add > 0 && s.threshold < 1) {
      needed = Math.max(0, Math.ceil((s.threshold * (2 + P + N) - (1 + P)) / (add * (1 - s.threshold)) - 1e-9));
    }
    return { P, N, R, Pk, Rk, needed };
  }, [s, k, sybilC]);

  const setW = (i: number, patch: Partial<Witness>) => setS(prev => ({ ...prev, witnesses: prev.witnesses.map((w, j) => (j === i ? { ...w, ...patch } : w)) }));
  const num = (v: string) => Math.max(0, Number(v) || 0);

  const Bar: React.FC<{ value: number; label: string; tone: string }> = ({ value, label, tone }) => (
    <div>
      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-0.5">
        <span>{label}</span>
        <span className="font-mono">{fmt(value)}</span>
      </div>
      <div className="relative h-4 rounded-full bg-stone-100 overflow-hidden">
        <div className={`h-full ${tone}`} style={{ width: `${value * 100}%` }} />
        <div className="absolute top-0 bottom-0 w-0.5 bg-slate-900" style={{ left: `${s.threshold * 100}%` }} title="threshold" />
      </div>
    </div>
  );

  return (
    <LabFrame
      title="Beta Reputation & Sybil Attack Simulator"
      subtitle="Combine direct evidence with credibility-weighted witnesses, then try to cross the threshold with fake identities."
      source="Part 2.1, Slides 7–13"
      actions={
        <>
          {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map(key => (
            <Pill key={key} active={presetKey === key} onClick={() => load(key)}>{PRESETS[key].label}</Pill>
          ))}
        </>
      }
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="rounded-xl border border-stone-200 p-3">
            <div className="text-xs font-bold text-slate-700 mb-2">Direct evidence (i about j)</div>
            <div className="flex gap-3 text-xs">
              <label className="flex items-center gap-1">positive p<sub>ij</sub>
                <input type="number" min={0} value={s.direct.p} onChange={e => setS({ ...s, direct: { ...s.direct, p: num(e.target.value) } })} className="w-16 border rounded px-1.5 py-0.5" />
              </label>
              <label className="flex items-center gap-1">negative n<sub>ij</sub>
                <input type="number" min={0} value={s.direct.n} onChange={e => setS({ ...s, direct: { ...s.direct, n: num(e.target.value) } })} className="w-16 border rounded px-1.5 py-0.5" />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Witnesses k (credibility c<sub>ik</sub>)</span>
              <button onClick={() => setS({ ...s, witnesses: [...s.witnesses, { name: `Witness ${s.witnesses.length + 1}`, c: 1, p: 1, n: 0 }] })} className="text-[11px] px-2 py-0.5 rounded border border-stone-300 inline-flex items-center gap-1">
                + witness
              </button>
            </div>
            {s.witnesses.map((w, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold w-20 truncate">{w.name}</span>
                <label>c <input type="number" step={0.1} min={0} max={1} value={w.c} onChange={e => setW(i, { c: Math.min(1, num(e.target.value)) })} className="w-14 border rounded px-1 py-0.5" /></label>
                <label>p <input type="number" min={0} value={w.p} onChange={e => setW(i, { p: num(e.target.value) })} className="w-12 border rounded px-1 py-0.5" /></label>
                <label>n <input type="number" min={0} value={w.n} onChange={e => setW(i, { n: num(e.target.value) })} className="w-12 border rounded px-1 py-0.5" /></label>
                <button onClick={() => setS({ ...s, witnesses: s.witnesses.filter((_, j) => j !== i) })} className="text-slate-400 hover:text-rose-600"><X className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            <label className="flex items-center gap-2 text-xs pt-1">
              threshold τ
              <input type="number" step={0.01} min={0} max={1} value={s.threshold} onChange={e => setS({ ...s, threshold: Math.min(0.99, num(e.target.value)) })} className="w-16 border rounded px-1 py-0.5" />
            </label>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3 space-y-2">
            <div className="text-xs font-bold text-rose-800 flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Sybil attack</div>
            <div className="flex flex-wrap gap-3 text-xs">
              <label>each Sybil: credibility <input type="number" step={0.1} min={0} max={1} value={s.sybil.c} onChange={e => setS({ ...s, sybil: { ...s.sybil, c: Math.min(1, num(e.target.value)) } })} className="w-14 border rounded px-1 py-0.5" /></label>
              <label>positives <input type="number" min={0} value={s.sybil.p} onChange={e => setS({ ...s, sybil: { ...s.sybil, p: num(e.target.value) } })} className="w-12 border rounded px-1 py-0.5" /></label>
            </div>
            <label className="flex items-center gap-2 text-xs">
              Sybil identities k = <b className="font-mono w-4">{k}</b>
              <input type="range" min={0} max={10} value={k} onChange={e => setK(Number(e.target.value))} className="flex-1 accent-rose-600" />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <input type="checkbox" checked={defense} onChange={e => setDefense(e.target.checked)} className="accent-emerald-700" />
              <ShieldCheck className="w-3.5 h-3.5" /> Defense: unverified identities get credibility 0
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-xs space-y-2">
            <MathView math={String.raw`R_i(j)=\frac{1+p_{ij}+\sum_k c_{ik}p_{kj}}{2+p_{ij}+n_{ij}+\sum_k c_{ik}(p_{kj}+n_{kj})}`} displayMode />
            <div className="font-mono text-slate-700">
              P = {s.direct.p}{s.witnesses.map(w => ` + ${w.c}·${w.p}`).join('')} = <b>{fmt(calc.P)}</b>
              <br />
              N = {s.direct.n}{s.witnesses.map(w => ` + ${w.c}·${w.n}`).join('')} = <b>{fmt(calc.N)}</b>
              <br />
              R = (1 + {fmt(calc.P)}) / (2 + {fmt(calc.P)} + {fmt(calc.N)}) = <b>{fmt(calc.R)}</b>
            </div>
          </div>

          <Bar value={calc.R} label="Honest reputation" tone={calc.R >= s.threshold ? 'bg-emerald-500' : 'bg-slate-400'} />
          <Bar value={calc.Rk} label={`With ${k} Sybil${k === 1 ? '' : 's'} (each adds ${fmt(sybilC * s.sybil.p)} to P)`} tone={calc.Rk >= s.threshold ? 'bg-rose-500' : 'bg-amber-400'} />

          <div className={`rounded-xl p-3 text-sm font-semibold ${calc.Rk >= s.threshold ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
            {calc.Rk >= s.threshold
              ? k > 0 && calc.R < s.threshold
                ? `Manipulation succeeds: ${fmt(calc.Rk)} ≥ ${s.threshold}. Same agent, same behavior, same rule; different information environment.`
                : `Selected: ${fmt(calc.Rk)} ≥ ${s.threshold}.`
              : `Rejected: ${fmt(calc.Rk)} < ${s.threshold}.`}
          </div>

          <div className="rounded-xl border border-stone-200 p-3 text-xs text-slate-700 space-y-1">
            <div className="font-bold">Minimum number of Sybils</div>
            {calc.needed === null ? (
              <p>Impossible: each Sybil adds nothing to P{defense ? ' (the defense gives them credibility 0)' : ''}.</p>
            ) : calc.needed === 0 ? (
              <p>None: the honest reputation already clears the threshold.</p>
            ) : (
              <p>
                k ≥ (τ(2 + P + N) − (1 + P)) / (c·s·(1 − τ)) → <b className="font-mono">k = {calc.needed}</b>. Type: Sybil attack used for <b>self-promotion</b>.
              </p>
            )}
          </div>
        </div>
      </div>
    </LabFrame>
  );
};
