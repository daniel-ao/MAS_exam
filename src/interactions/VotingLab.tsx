import React, { useMemo, useState } from 'react';
import { LabFrame, Pill } from './LabFrame';
import { X, Zap } from 'lucide-react';

interface Group { n: number; ranking: string }
type Rule = 'plurality' | 'borda' | 'irv' | 'condorcet' | 'approval';

const PRESETS: Record<string, { label: string; groups: Group[] }> = {
  ex20: { label: 'Plurality exercise (slide 20)', groups: [{ n: 4, ranking: 'ABC' }, { n: 3, ranking: 'BCA' }, { n: 2, ranking: 'CBA' }] },
  borda: { label: 'Borda example (slides 16–18)', groups: [{ n: 1, ranking: 'ABCD' }, { n: 1, ranking: 'CBAD' }, { n: 1, ranking: 'BADC' }] },
  cycle: { label: 'Condorcet cycle', groups: [{ n: 1, ranking: 'ABC' }, { n: 1, ranking: 'BCA' }, { n: 1, ranking: 'CAB' }] }
};

const permutations = (xs: string[]): string[][] =>
  xs.length <= 1 ? [xs] : xs.flatMap((x, i) => permutations([...xs.slice(0, i), ...xs.slice(i + 1)]).map(p => [x, ...p]));

const candidatesOf = (groups: Group[]) => [...new Set(groups.flatMap(g => g.ranking.split('')))].sort();

/** Expand groups into individual ballots. */
const ballots = (groups: Group[]) => groups.flatMap(g => Array.from({ length: g.n }, () => g.ranking.split('')));

const pluralityScores = (bs: string[][], C: string[]) => Object.fromEntries(C.map(c => [c, bs.filter(b => b[0] === c).length]));
const bordaScores = (bs: string[][], C: string[]) =>
  Object.fromEntries(C.map(c => [c, bs.reduce((s, b) => s + (b.indexOf(c) >= 0 ? C.length - 1 - b.indexOf(c) : 0), 0)]));
const approvalScores = (bs: string[][], C: string[], k: number) => Object.fromEntries(C.map(c => [c, bs.filter(b => b.slice(0, k).includes(c)).length]));
const pairwise = (bs: string[][], x: string, y: string) => bs.filter(b => b.indexOf(x) < b.indexOf(y)).length;

/** Winner(s) of a rule; returns all tied winners. */
const winners = (rule: Rule, bs: string[][], C: string[], approvalK: number): { win: string[]; detail: string } => {
  const top = (sc: Record<string, number>) => {
    const m = Math.max(...C.map(c => sc[c]));
    return C.filter(c => sc[c] === m);
  };
  if (rule === 'plurality') { const sc = pluralityScores(bs, C); return { win: top(sc), detail: C.map(c => `${c} ${sc[c]}`).join(' · ') }; }
  if (rule === 'borda') { const sc = bordaScores(bs, C); return { win: top(sc), detail: C.map(c => `${c} ${sc[c]}`).join(' · ') }; }
  if (rule === 'approval') { const sc = approvalScores(bs, C, approvalK); return { win: top(sc), detail: C.map(c => `${c} ${sc[c]}`).join(' · ') }; }
  if (rule === 'condorcet') {
    const cw = C.filter(x => C.every(y => y === x || pairwise(bs, x, y) > pairwise(bs, y, x)));
    return { win: cw, detail: cw.length ? `${cw[0]} beats every rival head-to-head` : 'no Condorcet winner (cycle or tie)' };
  }
  // IRV
  let alive = [...C];
  const steps: string[] = [];
  while (alive.length > 1) {
    const sc = Object.fromEntries(alive.map(c => [c, bs.filter(b => b.filter(x => alive.includes(x))[0] === c).length]));
    const total = bs.length;
    const leader = alive.find(c => sc[c] > total / 2);
    steps.push(alive.map(c => `${c} ${sc[c]}`).join(' '));
    if (leader) return { win: [leader], detail: steps.join(' → ') };
    const min = Math.min(...alive.map(c => sc[c]));
    const out = alive.filter(c => sc[c] === min).sort().reverse()[0];
    alive = alive.filter(c => c !== out);
  }
  return { win: alive, detail: steps.join(' → ') };
};

const RULE_LABEL: Record<Rule, string> = { plurality: 'Plurality', borda: 'Borda', irv: 'Instant-runoff', condorcet: 'Condorcet', approval: 'Approval (top-k)' };

export const VotingLab: React.FC = () => {
  const [presetKey, setPresetKey] = useState('ex20');
  const [groups, setGroups] = useState<Group[]>(PRESETS.ex20.groups);
  const [approvalK, setApprovalK] = useState(2);
  const [manipRule, setManipRule] = useState<Rule>('plurality');
  const [sybils, setSybils] = useState<{ n: number; ranking: string }>({ n: 0, ranking: 'BCA' });

  const load = (k: string) => { setPresetKey(k); setGroups(PRESETS[k].groups.map(g => ({ ...g }))); setSybils({ n: 0, ranking: PRESETS[k].groups[1]?.ranking || 'BCA' }); };
  const C = candidatesOf(groups);
  const valid = groups.every(g => g.ranking.length === C.length && new Set(g.ranking).size === g.ranking.length && /^[A-E]+$/.test(g.ranking));
  const allGroups = sybils.n > 0 && sybils.ranking.length === C.length ? [...groups, sybils] : groups;
  const bs = useMemo(() => ballots(allGroups), [allGroups]);
  const N = bs.length;

  const results = useMemo(() => (valid ? (['plurality', 'borda', 'irv', 'condorcet', 'approval'] as Rule[]).map(r => ({ r, ...winners(r, bs, C, approvalK) })) : []), [bs, C, approvalK, valid]);

  /** For each group, can ONE voter of it misreport and get an outcome it strictly prefers? */
  const manipulations = useMemo(() => {
    if (!valid) return [];
    const truth = ballots(groups);
    const base = winners(manipRule, truth, C, approvalK).win;
    const out: { group: number; ranking: string; from: string; to: string; tie: boolean }[] = [];
    groups.forEach((g, gi) => {
      const pref = g.ranking.split('');
      const rank = (c: string) => pref.indexOf(c);
      const bestBase = Math.min(...base.map(rank));
      let best: { ranking: string; to: string[] } | null = null;
      for (const p of permutations(C)) {
        if (p.join('') === g.ranking) continue;
        const idx = truth.findIndex((b, i) => b.join('') === g.ranking && i >= 0);
        const changed = truth.map((b, i) => (i === idx ? p : b));
        const w = winners(manipRule, changed, C, approvalK).win;
        const bestNew = Math.min(...w.map(rank));
        if (bestNew < bestBase && (!best || bestNew < Math.min(...best.to.map(rank)) || (w.length < best.to.length && bestNew === Math.min(...best.to.map(rank))))) best = { ranking: p.join(''), to: w };
      }
      if (best) out.push({ group: gi, ranking: best.ranking, from: base.join('='), to: best.to.join('='), tie: best.to.length > 1 });
    });
    return out;
  }, [groups, manipRule, C, approvalK, valid]);

  return (
    <LabFrame
      title="Voting Rules & Manipulation Lab"
      subtitle="Edit a preference profile, compare every rule, inspect pairwise majorities, search for profitable lies, and add Sybil voters."
      source="Part 2.2, Slides 6–20"
      actions={<>{Object.entries(PRESETS).map(([k, p]) => <Pill key={k} active={presetKey === k} onClick={() => load(k)}>{p.label}</Pill>)}</>}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="rounded-xl border border-stone-200 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Profile (count × ranking, best first)</span>
              <button onClick={() => setGroups([...groups, { n: 1, ranking: C.join('') }])} className="text-[11px] px-2 py-0.5 rounded border border-stone-300 inline-flex items-center gap-1">+ group</button>
            </div>
            {groups.map((g, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="font-mono text-slate-400 w-6">G{i + 1}</span>
                <input type="number" min={0} value={g.n} onChange={e => setGroups(groups.map((x, j) => (j === i ? { ...x, n: Math.max(0, Number(e.target.value) || 0) } : x)))} className="w-14 border rounded px-1 py-0.5" />
                <span>×</span>
                <input value={g.ranking} onChange={e => setGroups(groups.map((x, j) => (j === i ? { ...x, ranking: e.target.value.toUpperCase().replace(/[^A-E]/g, '') } : x)))} className="w-24 font-mono border rounded px-1.5 py-0.5 tracking-widest" />
                <span className="font-mono text-slate-500">{g.ranking.split('').join(' ≻ ')}</span>
                <button onClick={() => setGroups(groups.filter((_, j) => j !== i))} className="ml-auto text-slate-400 hover:text-rose-600"><X className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            {!valid && <p className="text-xs text-rose-700 font-semibold">Each ranking must list every candidate (letters A–E) exactly once.</p>}
            <p className="text-[11px] text-slate-500">{N} voters · absolute majority needs more than {N / 2}</p>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3 space-y-2 text-xs">
            <div className="font-bold text-rose-800 flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Sybil voters (fake identities)</div>
            <div className="flex items-center gap-2">
              <input type="range" min={0} max={5} value={sybils.n} onChange={e => setSybils({ ...sybils, n: Number(e.target.value) })} className="flex-1 accent-rose-600" />
              <b className="font-mono w-4">{sybils.n}</b> ×
              <input value={sybils.ranking} onChange={e => setSybils({ ...sybils, ranking: e.target.value.toUpperCase().replace(/[^A-E]/g, '') })} className="w-20 font-mono border rounded px-1.5 py-0.5" />
            </div>
          </div>

          {valid && (
            <div className="rounded-xl border border-stone-200 p-3">
              <div className="text-xs font-bold text-slate-700 mb-1">Pairwise majorities (row beats column?)</div>
              <table className="text-xs">
                <thead><tr><th />{C.map(c => <th key={c} className="px-2 font-mono">{c}</th>)}</tr></thead>
                <tbody>
                  {C.map(x => (
                    <tr key={x}>
                      <td className="pr-2 font-mono font-bold">{x}</td>
                      {C.map(y => {
                        if (x === y) return <td key={y} className="px-2 text-center text-slate-300">–</td>;
                        const a = pairwise(bs, x, y), b = pairwise(bs, y, x);
                        return <td key={y} className={`px-2 text-center font-mono ${a > b ? 'text-emerald-700 font-bold' : a < b ? 'text-rose-600' : 'text-slate-500'}`}>{a}–{b}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-stone-200 divide-y divide-stone-100">
            {results.map(res => (
              <div key={res.r} className="p-2.5 text-xs flex items-start gap-3">
                <div className="w-28 font-bold text-slate-700 shrink-0">
                  {RULE_LABEL[res.r]}
                  {res.r === 'approval' && (
                    <div className="font-normal text-[11px] text-slate-500 mt-0.5">
                      approve top <input type="number" min={1} max={C.length} value={approvalK} onChange={e => setApprovalK(Math.min(C.length, Math.max(1, Number(e.target.value) || 1)))} className="w-10 border rounded px-1" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-slate-600 break-words">{res.detail}</div>
                  {res.r === 'plurality' && (
                    <div className="text-[11px] text-slate-500">{Math.max(...C.map(c => pluralityScores(bs, C)[c])) > N / 2 ? 'Winner also has an absolute majority.' : 'No absolute majority: a majority rule would need a run-off.'}</div>
                  )}
                </div>
                <div className={`shrink-0 px-2 py-0.5 rounded-lg font-bold ${res.win.length === 1 ? 'bg-emerald-100 text-emerald-800' : res.win.length === 0 ? 'bg-stone-100 text-slate-500' : 'bg-amber-100 text-amber-800'}`}>
                  {res.win.length === 0 ? 'none' : res.win.length > 1 ? `tie ${res.win.join('=')}` : res.win[0]}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-violet-900">Single-voter manipulation search</span>
              {(['plurality', 'borda', 'irv'] as Rule[]).map(r => <Pill key={r} active={manipRule === r} onClick={() => setManipRule(r)}>{RULE_LABEL[r]}</Pill>)}
            </div>
            {manipulations.length === 0 ? (
              <p className="text-xs text-slate-600">No single voter can obtain an outcome it strictly prefers by lying under {RULE_LABEL[manipRule]} (ties count only if they include a better candidate).</p>
            ) : (
              manipulations.map(m => (
                <p key={m.group} className="text-xs text-slate-700">
                  One voter of <b>G{m.group + 1}</b> ({groups[m.group].ranking.split('').join('≻')}) reports <b className="font-mono">{m.ranking.split('').join('≻')}</b>: winner {m.from} → <b>{m.to}</b>
                  {m.tie ? ' (only a tie: depends on tie-breaking)' : ''}.
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </LabFrame>
  );
};
