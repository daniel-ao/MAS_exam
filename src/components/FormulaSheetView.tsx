import React, { useState, useMemo } from 'react';
import { formulasData, FormulaDetail } from '../content/formulas';
import { parseSlideRef } from '../content/decks';
import MathView from './MathView';
import { RichText } from './RichText';
import { Calculator, Search, ExternalLink, AlertTriangle, Copy, Check, Filter } from 'lucide-react';

interface FormulaSheetViewProps {
  onOpenSlide: (deck: number, page: number) => void;
}

export const FormulaSheetView: React.FC<FormulaSheetViewProps> = ({ onOpenSlide }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<'all' | 'course-1' | 'course-2' | 'course-3'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFormulas = useMemo(() => {
    return formulasData.filter(item => {
      const matchesCourse = selectedCourse === 'all' || item.course === selectedCourse;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q ||
        item.name.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q) ||
        item.examTips.toLowerCase().includes(q) ||
        item.lectureSlide.toLowerCase().includes(q) ||
        item.variables.some(v => v.symbol.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q));
      return matchesCourse && matchesQuery;
    });
  }, [searchQuery, selectedCourse]);

  const handleCopyLatex = (id: string, latex: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSlideClick = (slideRef?: string) => {
    const parsed = parseSlideRef(slideRef);
    if (parsed && parsed.pages.length > 0) onOpenSlide(parsed.deck, parsed.pages[0]);
  };

  const courseBadge = (course: string) => {
    switch (course) {
      case 'course-1':
        return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Chapter 1: Agents & Organizations</span>;
      case 'course-2':
        return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Chapter 2: Reputation, Voting & Games</span>;
      case 'course-3':
        return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">Chapter 3: Modal Logic & Manipulation</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-teal-700 text-sm font-semibold uppercase tracking-wider mb-2">
          <Calculator className="w-4 h-4" /> University Exam Mathematical Reference
        </div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Master Formula Sheet & Dimensional Analysis
        </h1>
        <p className="text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Every formula across the three chapters—including exact definitions, variable dimensional specifications,
          calculus Jacobians, and high-yield arithmetic traps to watch out for in university examinations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm mb-8 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search formulas (e.g., 'reputation', 'Borda', 'Nash', 'Euclidean', 'product update')..."
            className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-slate-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-sm"
          />
        </div>

        {/* Course Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Scope:
          </span>
          <button
            onClick={() => setSelectedCourse('all')}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              selectedCourse === 'all'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Chapters ({formulasData.length})
          </button>
          <button
            onClick={() => setSelectedCourse('course-1')}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              selectedCourse === 'course-1'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Ch. 1: Agents & Organizations
          </button>
          <button
            onClick={() => setSelectedCourse('course-2')}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              selectedCourse === 'course-2'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Ch. 2: Reputation, Voting & Games
          </button>
          <button
            onClick={() => setSelectedCourse('course-3')}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              selectedCourse === 'course-3'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Ch. 3: Modal Logic
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-stone-500 mb-4 px-1">
        Showing <strong>{filteredFormulas.length}</strong> mathematical specifications
      </div>

      {/* Formulas List */}
      <div className="space-y-6">
        {filteredFormulas.map((formula) => (
          <div
            key={formula.id}
            className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:border-teal-300 transition-all"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold font-serif text-slate-900">
                  {formula.name}
                </h2>
                {courseBadge(formula.course)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSlideClick(formula.lectureSlide)}
                  className="text-xs text-stone-600 hover:text-teal-700 font-medium flex items-center gap-1 bg-stone-100 hover:bg-teal-50 px-2.5 py-1 rounded-md transition-colors border border-stone-200"
                  title="View original slide"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{formula.lectureSlide}</span>
                </button>
                <button
                  onClick={() => handleCopyLatex(formula.id, formula.latex)}
                  className="text-xs text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-md transition-colors border border-stone-200"
                  title="Copy LaTeX formula"
                >
                  {copiedId === formula.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>Copy LaTeX</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Main LaTeX equation display */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 my-4 overflow-x-auto text-center">
              <MathView math={formula.latex} displayMode />
            </div>

            {/* Explanation */}
            <div className="text-sm text-slate-700 leading-relaxed mb-4">
              <RichText text={formula.explanation} inline />
            </div>

            {/* Variable Table & Dimensions */}
            {formula.variables && formula.variables.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Variable Definitions & Dimensions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formula.variables.map((v, vIdx) => (
                    <div
                      key={vIdx}
                      className="bg-stone-50/70 border border-stone-100 rounded-lg p-2.5 flex items-start gap-2.5 text-xs"
                    >
                      <span className="font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded text-[11px] shrink-0">
                        {v.symbol}
                      </span>
                      <div className="flex-1">
                        <span className="text-slate-700">
                          <RichText text={v.meaning} inline />
                        </span>
                        {v.dimension && (
                          <span className="ml-1 text-stone-600 font-mono text-[10px] bg-stone-100 px-1 py-0.5 rounded">
                            [{v.dimension}]
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* High-yield Exam Tips Alert */}
            {formula.examTips && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-amber-900 block mb-0.5">
                    Exam Calculation Trap & Gotcha:
                  </strong>
                  <span className="text-amber-800 leading-relaxed">
                    <RichText text={formula.examTips} inline />
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormulaSheetView;

