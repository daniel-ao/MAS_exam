import React, { useState } from 'react';
import MathView from './MathView';
import { RichText } from './RichText';
import { COMPARISONS } from '../content/comparisons';
import { GitCompare, ExternalLink, ArrowRight, AlertTriangle, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface ComparisonMatrixViewProps {
  onNavigateToLesson: (lessonId: string) => void;
  onOpenSlide: (deck: number, page: number) => void;
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({
  onNavigateToLesson,
  onOpenSlide
}) => {
  const [activeTab, setActiveTab] = useState<string>(COMPARISONS[0].id);

  const activeTopic = COMPARISONS.find(c => c.id === activeTab) || COMPARISONS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-teal-700 text-sm font-semibold uppercase tracking-wider mb-2">
          <GitCompare className="w-4 h-4" /> Academic Conceptual Synthesis
        </div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
          High-Yield Concept Comparison Matrices
        </h1>
        <p className="text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Direct side-by-side technical comparisons between competing algorithms, mathematical objectives, and paradigms
          frequently contrasted in university exam questions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-stone-200 scrollbar-thin">
        {COMPARISONS.map(comp => (
          <button
            key={comp.id}
            onClick={() => setActiveTab(comp.id)}
            className={`px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === comp.id
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-slate-900'
            }`}
          >
            <span>{comp.title}</span>
          </button>
        ))}
      </div>

      {/* Active Comparison Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Title & Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 mb-6">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-1">
              {activeTopic.title}
            </h2>
            <p className="text-sm text-slate-600">
              {activeTopic.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenSlide(activeTopic.deck, activeTopic.slideNum)}
              className="text-xs text-stone-600 hover:text-teal-700 font-medium flex items-center gap-1.5 bg-stone-100 hover:bg-teal-50 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{activeTopic.lectureRef}</span>
            </button>
            <button
              onClick={() => onNavigateToLesson(activeTopic.lessonId)}
              className="text-xs text-white bg-teal-700 hover:bg-teal-800 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              <span>Study Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Side-by-Side Summary Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-${activeTopic.items.length} gap-4 mb-8`}>
          {activeTopic.items.map((item, idx) => (
            <div
              key={idx}
              className="bg-stone-50 border border-stone-200 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-base text-slate-900 font-serif">
                    {item.name}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 whitespace-nowrap">
                    {item.badge}
                  </span>
                </div>
                <div className="text-xs text-slate-700 mb-3 leading-relaxed">
                  <RichText text={item.summary} inline />
                </div>

                {item.mathFormula && (
                  <div className="bg-white border border-stone-200 rounded-lg p-2.5 my-3 text-center overflow-x-auto text-xs">
                    <MathView math={item.mathFormula} displayMode />
                  </div>
                )}
              </div>

              {/* Pros & Cons */}
              <div className="space-y-3 pt-3 border-t border-stone-200/60 mt-3 text-xs">
                <div>
                  <h4 className="font-semibold text-emerald-800 flex items-center gap-1 mb-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Primary Strengths
                  </h4>
                  <ul className="space-y-1 text-slate-600 pl-4 list-disc marker:text-emerald-500">
                    {item.pros.map((p, pIdx) => (
                      <li key={pIdx}>
                        <RichText text={p} inline />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-rose-800 flex items-center gap-1 mb-1 text-[11px]">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" /> Critical Limitations
                  </h4>
                  <ul className="space-y-1 text-slate-600 pl-4 list-disc marker:text-rose-400">
                    {item.cons.map((c, cIdx) => (
                      <li key={cIdx}>
                        <RichText text={c} inline />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Dimension Matrix Table */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
            Comparative Technical Dimensions
          </h3>
          <div className="border border-stone-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4 w-1/4">Evaluation Criterion</th>
                    <th className="py-3 px-4">{activeTopic.items[0]?.name}</th>
                    <th className="py-3 px-4">{activeTopic.items[1]?.name}</th>
                    {activeTopic.items[2] && (
                      <th className="py-3 px-4">{activeTopic.items[2]?.name}</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {activeTopic.dimensions.map((dim, dIdx) => (
                    <tr key={dIdx} className={dIdx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                      <td className="py-3 px-4 font-semibold text-slate-900 bg-stone-50/80">
                        {dim.criteria}
                      </td>
                      <td className="py-3 px-4 text-slate-700 leading-relaxed">
                        <RichText text={dim.item1Value} inline />
                      </td>
                      <td className="py-3 px-4 text-slate-700 leading-relaxed">
                        <RichText text={dim.item2Value} inline />
                      </td>
                      {activeTopic.items[2] && dim.item3Value && (
                        <td className="py-3 px-4 text-slate-700 leading-relaxed">
                          <RichText text={dim.item3Value} inline />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Exam Pitfall / Trap Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="font-bold text-amber-900 block text-sm mb-1">
              High-Yield Exam Synthesis & Trap
            </strong>
            <div className="text-amber-900/90 leading-relaxed">
              <RichText text={activeTopic.examTrap} inline />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonMatrixView;

