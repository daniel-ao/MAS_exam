import React, { useState } from 'react';
import { LabFrame, Pill } from './LabFrame';
import { MathView } from '../components/MathView';
import { CheckCircle2, XCircle } from 'lucide-react';

type Dir = 'constructive' | 'destructive';
type Force = 'strong' | 'soft';
type Conceal = 'epistemic' | 'doxastic';

const build = (dir: Dir, force: Force, conceal: Conceal) => {
  const eff = force === 'strong' ? 'E_j^d\\varphi' : 'E_j\\varphi';
  const instr = dir === 'constructive' ? eff : `\\neg ${eff}`;
  const att = conceal === 'epistemic' ? 'K_j' : 'B_j';
  const instrFull = `E_i^d${dir === 'destructive' ? '\\neg ' : ''}${force === 'strong' ? 'E_j^d' : 'E_j'}\\varphi`;
  const name = `M${dir === 'constructive' ? 'C' : 'D'}E${force === 'strong' ? '^d' : ''}${conceal === 'epistemic' ? 'K' : 'B'}`;
  return {
    instrumentalization: instrFull,
    concealment: `E_i^d\\neg ${att}${instrFull}`,
    full: `\\mathrm{${name}}^{\\Sigma}_{i,j}\\varphi=\\bigvee_{\\psi\\in\\Sigma}E_i^d\\big(${instr}\\land\\neg ${att}${instrFull}\\land\\psi\\big)`,
    reading:
      `i deliberately ${dir === 'constructive' ? 'makes' : 'prevents'} j ${dir === 'constructive' ? '' : 'from '}${force === 'strong' ? 'deliberately ' : ''}${dir === 'constructive' ? 'bring' : 'bringing'} about φ, ` +
      `while making sure j does not ${conceal === 'epistemic' ? 'know' : 'even believe'} that i deliberately did so.`
  };
};

interface Scenario { text: string; answer: string; why: string }
const CATEGORIES = ['Manipulation', 'Coercion', 'Persuasion', 'Credible lie'];
const SCENARIOS: Scenario[] = [
  { text: 'A seller creates fake accounts that praise him, so that a buyer (who does not suspect anything) chooses to buy from him.', answer: 'Manipulation', why: 'Deliberate instrumentalization of the buyer’s choice (Eⱼ / Eⱼᵈ) with concealment (¬Kⱼ).' },
  { text: 'A robber openly threatens a clerk to make her open the safe; she knows exactly what is happening.', answer: 'Coercion', why: 'Instrumentalization of the clerk’s deliberate action, but NOT concealed: Kⱼ instead of ¬Kⱼ.' },
  { text: 'An agent presents accurate statistics to convince a colleague that a protocol is safe.', answer: 'Persuasion', why: 'A deliberate effect on j’s belief, Eᵢᵈ(Bⱼφ ∧ ψ), with no concealment and no belief in ¬φ.' },
  { text: 'An agent who believes the door is unlocked tells a guard “the door is locked”, and the guard does not know what the agent really believes.', answer: 'Credible lie', why: 'Bᵢ¬φ ∧ Eᵢᵈ(Bⱼφ ∧ ¬KⱼBᵢ¬φ ∧ ψ).' },
  { text: 'A node secretly makes another node believe it is alone in the P2P network, so that it stops forwarding messages.', answer: 'Manipulation', why: 'Destructive instrumentalization (¬Eⱼ…) hidden from the victim.' },
  { text: 'A voter reveals a false ranking so that the electoral committee unknowingly declares her favourite the winner.', answer: 'Manipulation', why: 'The committee’s effect is instrumentalized and the deviation is concealed.' }
];

export const ManipulationLab: React.FC = () => {
  const [dir, setDir] = useState<Dir>('constructive');
  const [force, setForce] = useState<Force>('soft');
  const [conceal, setConceal] = useState<Conceal>('epistemic');
  const [picks, setPicks] = useState<Record<number, string>>({});
  const f = build(dir, force, conceal);

  return (
    <LabFrame
      title="KBE Manipulation Formula Builder"
      subtitle="Compose the eight forms of manipulation and compare them with coercion, persuasion and the credible lie."
      source="Part 3.4, Slides 14–16"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2"><span className="w-28 font-bold text-slate-700">Direction</span>
              <Pill active={dir === 'constructive'} onClick={() => setDir('constructive')}>constructive</Pill>
              <Pill active={dir === 'destructive'} onClick={() => setDir('destructive')}>destructive</Pill></div>
            <div className="flex items-center gap-2"><span className="w-28 font-bold text-slate-700">Instrumentalization</span>
              <Pill active={force === 'strong'} onClick={() => setForce('strong')}>strong (Eⱼᵈ)</Pill>
              <Pill active={force === 'soft'} onClick={() => setForce('soft')}>soft (Eⱼ)</Pill></div>
            <div className="flex items-center gap-2"><span className="w-28 font-bold text-slate-700">Concealment</span>
              <Pill active={conceal === 'epistemic'} onClick={() => setConceal('epistemic')}>epistemic (¬Kⱼ)</Pill>
              <Pill active={conceal === 'doxastic'} onClick={() => setConceal('doxastic')}>doxastic (¬Bⱼ)</Pill></div>
          </div>
          <div className="rounded-xl border border-stone-200 p-3 space-y-2 text-xs">
            <div><b>Instrumentalization</b> <MathView math={f.instrumentalization} /></div>
            <div><b>Concealment</b> <MathView math={f.concealment} /></div>
            <div className="bg-violet-50 border border-violet-100 rounded-lg p-2 overflow-x-auto"><MathView math={f.full} displayMode /></div>
            <p className="text-slate-700">{f.reading}</p>
            <p className="text-slate-500">Doxastic concealment is stronger: since Kⱼψ ⇒ Bⱼψ, not even believing implies not knowing.</p>
          </div>
          <div className="rounded-xl border border-stone-200 p-3 space-y-1.5 text-xs">
            <div className="font-bold text-slate-700">Related concepts (slide 16)</div>
            <div><b>Coercion</b> <MathView math={String.raw`\bigvee_{\psi}E_i^d(E_j^d\varphi\land K_jE_i^dE_j^d\varphi\land\psi)`} /> not concealed</div>
            <div><b>Persuasion</b> <MathView math={String.raw`\bigvee_{\psi}E_i^d(B_j\varphi\land\psi)`} /> belief change only</div>
            <div><b>Credible lie</b> <MathView math={String.raw`B_i\neg\varphi\land\bigvee_{\psi}E_i^d(B_j\varphi\land\neg K_jB_i\neg\varphi\land\psi)`} /></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700">Classify each scenario</div>
          {SCENARIOS.map((s, i) => {
            const pick = picks[i];
            return (
              <div key={i} className="rounded-xl border border-stone-200 p-2.5 text-xs space-y-1.5">
                <p className="text-slate-700">{s.text}</p>
                <div className="flex flex-wrap gap-1">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setPicks({ ...picks, [i]: c })}
                      className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${pick === c ? (c === s.answer ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-rose-600 text-white border-rose-600') : 'bg-white border-stone-300 text-slate-600'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {pick && (
                  <p className={`flex items-start gap-1 ${pick === s.answer ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {pick === s.answer ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                    <span>{pick === s.answer ? '' : `Answer: ${s.answer}. `}{s.why}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </LabFrame>
  );
};
