import React, { useMemo, useState } from 'react';
import { LabFrame, Pill } from './LabFrame';
import { CheckCircle2, XCircle } from 'lucide-react';

type Payoffs = [number, number][][]; // [row][col] = [u1, u2]
interface Game { rows: [string, string]; cols: [string, string]; p: Payoffs; p1: string; p2: string }

const PD: Game = { p1: 'Prisoner 1', p2: 'Prisoner 2', rows: ['Silent C', 'Betray B'], cols: ['Silent C', 'Betray B'], p: [[[-2, -2], [-10, -1]], [[-1, -10], [-5, -5]]] };
const COORD: Game = { p1: 'Player 1', p2: 'Player 2', rows: ['A', 'B'], cols: ['A', 'B'], p: [[[2, 2], [0, 0]], [[0, 0], [1, 1]]] };
const TD5: Game = { p1: 'Joueur 1', p2: 'Joueur 2', rows: ['T (trahir)', 'C (coopérer)'], cols: ['T (trahir)', 'C (coopérer)'], p: [[[1, 1], [2, 0]], [[0, 2], [1, 1]]] };

interface SupParams { m: number; p: number; r: number; c: number; b: number; q: number; a: number }
const supGame = (s: SupParams): Game => ({
  p1: 'Supervisor', p2: 'Company', rows: ['Supervise S', 'Not supervise S̄'], cols: ['Manipulate M', 'Honest H'],
  p: [[[s.b - s.c, s.m - s.p], [s.a - s.c, s.r]], [[-s.q, s.m], [0, 0]]]
});

const PRESETS = { pd: 'Prisoner’s Dilemma', coord: 'Coordination', sup: 'Supervisor norm', td5: 'TD Ex. 5 (T/C)' } as const;
type PresetKey = keyof typeof PRESETS;

export const GameLab: React.FC<{ initialPreset?: string }> = ({ initialPreset }) => {
  const [preset, setPreset] = useState<PresetKey>(initialPreset && initialPreset in PRESETS ? (initialPreset as PresetKey) : 'pd');
  const [custom, setCustom] = useState<Game>(initialPreset === 'td5' ? TD5 : initialPreset === 'coord' ? COORD : PD);
  const [sup, setSup] = useState<SupParams>({ m: 10, p: 6, r: 5, c: 3, b: 2, q: 2, a: 4 });

  const game = preset === 'sup' ? supGame(sup) : custom;
  const load = (k: PresetKey) => {
    setPreset(k);
    if (k === 'pd') setCustom(PD);
    if (k === 'coord') setCustom(COORD);
    if (k === 'td5') setCustom(TD5);
  };

  const a = useMemo(() => {
    const u = game.p;
    const br1 = [0, 1].map(c => { const m = Math.max(u[0][c][0], u[1][c][0]); return [0, 1].filter(r => u[r][c][0] === m); });
    const br2 = [0, 1].map(r => { const m = Math.max(u[r][0][1], u[r][1][1]); return [0, 1].filter(c => u[r][c][1] === m); });
    const ne: [number, number][] = [];
    for (const r of [0, 1]) for (const c of [0, 1]) if (br1[c].includes(r) && br2[r].includes(c)) ne.push([r, c]);
    const dom1 = [0, 1].find(r => [0, 1].every(c => u[r][c][0] > u[1 - r][c][0]));
    const dom2 = [0, 1].find(c => [0, 1].every(r => u[r][c][1] > u[r][1 - c][1]));
    const mm1 = [0, 1].map(r => Math.min(u[r][0][0], u[r][1][0]));
    const mm2 = [0, 1].map(c => Math.min(u[0][c][1], u[1][c][1]));
    const pareto = (r: number, c: number) =>
      ![0, 1].some(r2 => [0, 1].some(c2 => u[r2][c2][0] >= u[r][c][0] && u[r2][c2][1] >= u[r][c][1] && (u[r2][c2][0] > u[r][c][0] || u[r2][c2][1] > u[r][c][1])));
    return { br1, br2, ne, dom1, dom2, mm1, mm2, pareto };
  }, [game]);

  const edit = (r: number, c: number, k: 0 | 1, v: string) => {
    const n = Number(v);
    if (Number.isNaN(n)) return;
    setCustom(g => ({ ...g, p: g.p.map((row, ri) => row.map((cell, ci) => (ri === r && ci === c ? (k === 0 ? [n, cell[1]] : [cell[0], n]) : cell))) as Payoffs }));
  };

  const cond = (ok: boolean, text: string) => (
    <div className="flex items-center gap-2 text-xs">
      {ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-500" />} <span className="font-mono">{text}</span>
    </div>
  );

  return (
    <LabFrame
      title="Nash Equilibrium & Norm Design Lab"
      subtitle="Mark best responses, find pure Nash equilibria, compare with maximin and Pareto optimality, and redesign payoffs with norms."
      source="Part 2.3 · TD Ex. 5"
      actions={<>{(Object.keys(PRESETS) as PresetKey[]).map(k => <Pill key={k} active={preset === k} onClick={() => load(k)}>{PRESETS[k]}</Pill>)}</>}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="text-sm border-collapse mx-auto">
              <thead>
                <tr>
                  <th className="p-2 text-xs text-slate-500">{game.p1} ↓ · {game.p2} →</th>
                  {game.cols.map(c => <th key={c} className="p-2 text-xs font-bold text-slate-700 bg-stone-50 border border-stone-200">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {[0, 1].map(r => (
                  <tr key={r}>
                    <th className="p-2 text-xs font-bold text-slate-700 bg-stone-50 border border-stone-200 text-left">{game.rows[r]}</th>
                    {[0, 1].map(c => {
                      const isNE = a.ne.some(([x, y]) => x === r && y === c);
                      const b1 = a.br1[c].includes(r), b2 = a.br2[r].includes(c);
                      return (
                        <td key={c} className={`p-2 border text-center ${isNE ? 'border-emerald-500 border-2 bg-emerald-50' : 'border-stone-200'}`}>
                          <div className="flex items-center justify-center gap-1 font-mono">
                            {preset === 'sup' ? (
                              <span className={b1 ? 'text-blue-700 font-bold underline' : ''}>{game.p[r][c][0]}</span>
                            ) : (
                              <input value={game.p[r][c][0]} onChange={e => edit(r, c, 0, e.target.value)} className={`w-12 text-center border rounded ${b1 ? 'border-blue-500 text-blue-700 font-bold bg-blue-50' : 'border-stone-200'}`} />
                            )}
                            ,
                            {preset === 'sup' ? (
                              <span className={b2 ? 'text-rose-700 font-bold underline' : ''}>{game.p[r][c][1]}</span>
                            ) : (
                              <input value={game.p[r][c][1]} onChange={e => edit(r, c, 1, e.target.value)} className={`w-12 text-center border rounded ${b2 ? 'border-rose-500 text-rose-700 font-bold bg-rose-50' : 'border-stone-200'}`} />
                            )}
                          </div>
                          <div className="text-[10px] mt-0.5 text-slate-500">{isNE ? 'Nash equilibrium' : a.pareto(r, c) ? 'Pareto-optimal' : ''}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            <span className="text-blue-700 font-bold">Blue</span> = {game.p1}’s best response to that column ·{' '}
            <span className="text-rose-700 font-bold">red</span> = {game.p2}’s best response to that row · green border = both = Nash equilibrium
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="rounded-xl border border-stone-200 p-3 space-y-1.5">
            <div className="font-bold text-slate-800">Analysis</div>
            <p>
              <b>Pure Nash equilibria:</b>{' '}
              {a.ne.length === 0 ? 'none' : a.ne.map(([r, c]) => `(${game.rows[r].split(' ')[0]}, ${game.cols[c].split(' ')[0]})`).join(', ')}
            </p>
            <p>
              <b>Dominant strategies:</b> {game.p1}: {a.dom1 === undefined ? 'none' : game.rows[a.dom1]} · {game.p2}: {a.dom2 === undefined ? 'none' : game.cols[a.dom2]}
            </p>
            <p>
              <b>Maximin:</b> {game.p1}: {game.rows.map((n, i) => `${n.split(' ')[0]}→${a.mm1[i]}`).join(', ')} ⇒ {game.rows[a.mm1[0] >= a.mm1[1] ? 0 : 1].split(' ')[0]}
              {' · '}
              {game.p2}: {game.cols.map((n, i) => `${n.split(' ')[0]}→${a.mm2[i]}`).join(', ')} ⇒ {game.cols[a.mm2[0] >= a.mm2[1] ? 0 : 1].split(' ')[0]}
            </p>
            <p className="text-slate-500">
              Nash compares responses to a FIXED opposing strategy; maximin compares the worst outcome of each choice ex ante. They can coincide without
              meaning the same thing.
            </p>
          </div>

          {preset === 'sup' && (
            <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-3 space-y-2">
              <div className="font-bold text-violet-900">Norm parameters (slides 19–20)</div>
              {(
                [
                  ['m', 'gain from successful manipulation'],
                  ['p', 'penalty if detected'],
                  ['r', 'reward for verified honesty'],
                  ['c', 'cost of supervision'],
                  ['b', 'bonus for detecting manipulation'],
                  ['q', 'loss for missing manipulation'],
                  ['a', 'value of verified honesty']
                ] as [keyof SupParams, string][]
              ).map(([k, label]) => (
                <label key={k} className="flex items-center gap-2">
                  <span className="font-mono font-bold w-4">{k}</span>
                  <input type="range" min={0} max={15} value={sup[k]} onChange={e => setSup({ ...sup, [k]: Number(e.target.value) })} className="flex-1 accent-violet-700" />
                  <span className="font-mono w-5 text-right">{sup[k]}</span>
                  <span className="text-slate-500 w-44 truncate">{label}</span>
                </label>
              ))}
              <div className="pt-1 space-y-1">
                <div className="font-semibold text-slate-700">(S, H) is a Nash equilibrium iff:</div>
                {cond(sup.a >= sup.c, `a ≥ c   (${sup.a} ≥ ${sup.c})`)}
                {cond(sup.r >= sup.m - sup.p, `r ≥ m − p   (${sup.r} ≥ ${sup.m - sup.p})`)}
                <div className="font-semibold text-slate-700 pt-1">Unique NE if, strictly:</div>
                {cond(sup.a > sup.c, 'a > c')}
                {cond(sup.p + sup.r > sup.m, `p + r > m   (${sup.p + sup.r} > ${sup.m})`)}
                {cond(sup.b + sup.q > sup.c, `b + q > c   (${sup.b + sup.q} > ${sup.c})`)}
              </div>
            </div>
          )}
        </div>
      </div>
    </LabFrame>
  );
};
