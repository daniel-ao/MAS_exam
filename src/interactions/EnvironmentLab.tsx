import React, { useState } from 'react';
import { LabFrame, Pill } from './LabFrame';
import { CheckCircle2, XCircle } from 'lucide-react';

type Axis = 'accessible' | 'deterministic' | 'static' | 'discrete';
const AXES: { id: Axis; yes: string; no: string }[] = [
  { id: 'accessible', yes: 'Accessible', no: 'Inaccessible' },
  { id: 'deterministic', yes: 'Deterministic', no: 'Non-deterministic' },
  { id: 'static', yes: 'Static', no: 'Dynamic' },
  { id: 'discrete', yes: 'Discrete', no: 'Continuous' }
];

interface Case { name: string; emoji: string; answer: Record<Axis, boolean | 'either'>; note: string }
const CASES: Case[] = [
  { name: 'Exploration robot (rover)', emoji: '🛰️', answer: { accessible: false, deterministic: false, static: false, discrete: false }, note: 'Slide 52: limited sensors, uncertain terrain, things change, continuous space.' },
  { name: 'Computer network', emoji: '🖧', answer: { accessible: true, deterministic: true, static: false, discrete: true }, note: 'Slide 53: observable state, deterministic protocols, but traffic changes constantly.' },
  { name: 'Chess game', emoji: '♟️', answer: { accessible: true, deterministic: true, static: true, discrete: true }, note: 'Slide 54: full board visible, unique move results, nothing changes while thinking (ignoring the clock).' },
  { name: 'Vacuum cleaner robot', emoji: '🧹', answer: { accessible: false, deterministic: false, static: false, discrete: 'either' }, note: 'Slide 55: partially accessible, non-deterministic, dynamic; discrete or continuous depending on the model.' }
];

const situation = (compatible: boolean, res: boolean, skills: boolean) => {
  if (compatible) return res && skills ? { name: 'Independence', tone: 'bg-sky-100 text-sky-900' } : { name: 'Cooperation', tone: 'bg-emerald-100 text-emerald-900' };
  if (res && skills) return { name: 'Pure competition', tone: 'bg-amber-100 text-amber-900' };
  if (!res && !skills) return { name: 'Conflict', tone: 'bg-rose-100 text-rose-900' };
  return { name: 'Negotiation', tone: 'bg-orange-100 text-orange-900' };
};

export const EnvironmentLab: React.FC = () => {
  const [tab, setTab] = useState<'env' | 'inter'>('env');
  const [answers, setAnswers] = useState<Record<string, Partial<Record<Axis, boolean>>>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [goals, setGoals] = useState(true);
  const [res, setRes] = useState(false);
  const [skills, setSkills] = useState(true);
  const sit = situation(goals, res, skills);

  return (
    <LabFrame
      title="Environment & Interaction Classifier"
      subtitle="Classify the four environments of the course, then explore how goals, resources and skills determine the interaction situation."
      source="Part 1.1, Slides 49–63"
      actions={
        <>
          <Pill active={tab === 'env'} onClick={() => setTab('env')}>Environments</Pill>
          <Pill active={tab === 'inter'} onClick={() => setTab('inter')}>Interaction situations</Pill>
        </>
      }
    >
      {tab === 'env' ? (
        <div className="grid md:grid-cols-2 gap-3">
          {CASES.map(c => {
            const mine = answers[c.name] || {};
            const shown = revealed[c.name];
            return (
              <div key={c.name} className="rounded-xl border border-stone-200 p-3 text-xs space-y-2">
                <div className="font-bold text-slate-800 text-sm">{c.emoji} {c.name}</div>
                {AXES.map(a => {
                  const truth = c.answer[a.id];
                  const pick = mine[a.id];
                  const ok = truth === 'either' ? pick !== undefined : pick === truth;
                  return (
                    <div key={a.id} className="flex items-center gap-1.5">
                      {[true, false].map(v => (
                        <button
                          key={String(v)}
                          onClick={() => setAnswers({ ...answers, [c.name]: { ...mine, [a.id]: v } })}
                          className={`flex-1 px-2 py-1 rounded border text-[11px] font-semibold ${pick === v ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-stone-300 text-slate-600'}`}
                        >
                          {v ? a.yes : a.no}
                        </button>
                      ))}
                      {shown && (ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-500 shrink-0" />)}
                    </div>
                  );
                })}
                <button onClick={() => setRevealed({ ...revealed, [c.name]: true })} className="text-[11px] font-bold text-teal-700">Check →</button>
                {shown && <p className="text-slate-600">{c.note}</p>}
              </div>
            );
          })}
          <p className="md:col-span-2 text-[11px] text-slate-500">Some answers depend on the assumptions about sensors, actuators and abstraction level: in the exam, state your assumption.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5 text-xs">
          <div className="space-y-3">
            {[
              ['Goals', goals, setGoals, 'compatible', 'incompatible'],
              ['Resources', res, setRes, 'sufficient', 'insufficient'],
              ['Skills', skills, setSkills, 'sufficient', 'insufficient']
            ].map(([label, val, set, yes, no]) => (
              <div key={label as string} className="flex items-center gap-2">
                <span className="w-20 font-bold text-slate-700">{label as string}</span>
                <Pill active={val as boolean} onClick={() => (set as (v: boolean) => void)(true)}>{yes as string}</Pill>
                <Pill active={!(val as boolean)} onClick={() => (set as (v: boolean) => void)(false)}>{no as string}</Pill>
              </div>
            ))}
            <div className={`rounded-xl p-4 text-lg font-bold text-center ${sit.tone}`}>{sit.name}</div>
          </div>
          <table className="w-full border border-stone-200 rounded-xl overflow-hidden">
            <thead className="bg-stone-50">
              <tr><th className="p-2 text-left">Goals</th><th className="p-2 text-left">Resources & skills</th><th className="p-2 text-left">Situation</th></tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {[
                ['compatible', 'sufficient res. AND skills', 'Independence'],
                ['compatible', 'insufficient res. OR skills', 'Cooperation'],
                ['incompatible', 'sufficient res. AND skills', 'Pure competition'],
                ['incompatible', 'insufficient res. OR skills', 'Negotiation'],
                ['incompatible', 'insufficient res. AND skills', 'Conflict']
              ].map(row => (
                <tr key={row[2]} className={row[2] === sit.name ? 'bg-teal-50 font-bold' : ''}>
                  {row.map((c, i) => <td key={i} className="p-2">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </LabFrame>
  );
};
