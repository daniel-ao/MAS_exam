import React, { useState, useMemo } from 'react';
import { glossaryData } from '../content/glossary';
import { parseSlideRef } from '../content/decks';
import { GlossaryItem } from '../types';
import MathView from './MathView';
import { RichText } from './RichText';
import { Search, BookOpen, Layers, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';

interface GlossaryViewProps {
  onNavigateToLesson: (lessonId: string) => void;
  onOpenSlide: (deck: number, page: number) => void;
}

const CATEGORIES: ('All' | GlossaryItem['category'])[] = [
  'All',
  'Agents & Architectures',
  'Organizations',
  'Reputation',
  'Voting',
  'Games & Norms',
  'Logic Foundations',
  'Knowledge & Belief',
  'Action & Agency',
  'Manipulation'
];

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  onNavigateToLesson,
  onOpenSlide
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | GlossaryItem['category']>('All');

  const filteredItems = useMemo(() => {
    return glossaryData.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q ||
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        (item.sourceSlideRef && item.sourceSlideRef.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleSlideClick = (slideRef?: string) => {
    const parsed = parseSlideRef(slideRef);
    if (parsed && parsed.pages.length > 0) onOpenSlide(parsed.deck, parsed.pages[0]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-teal-700 text-sm font-semibold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" /> Comprehensive Academic Glossary
        </div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Course Terminology & Mathematical Concepts
        </h1>
        <p className="text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Alphabetical dictionary of all theoretical, algorithmic, and mathematical terminology across the three chapters.
          Includes formal definitions, equations, associated source slides, and direct curriculum links.
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
            placeholder="Search terms, concepts, definitions, formulas..."
            className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-slate-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-sm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-xs font-semibold text-stone-500 mr-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Category:
          </span>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Stats counter */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-4 px-1">
        <span>Showing <strong>{filteredItems.length}</strong> of {glossaryData.length} terms</span>
        {selectedCategory !== 'All' && <span>Filtered by: <span className="font-semibold text-teal-800">{selectedCategory}</span></span>}
      </div>

      {/* Terms Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200 rounded-xl">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No glossary terms found</h3>
          <p className="text-sm text-stone-500 mt-1">Try modifying your search or choosing "All" categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item, idx) => (
            <div
              key={`${item.term}-${idx}`}
              className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base font-bold text-slate-900 font-serif leading-snug">
                    <RichText text={item.term} inline />
                  </h3>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 whitespace-nowrap shrink-0 border border-stone-200">
                    {item.category}
                  </span>
                </div>

                <div className="text-sm text-slate-700 leading-relaxed mb-3">
                  <RichText text={item.definition} inline />
                </div>

                {item.formula && (
                  <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 my-3 overflow-x-auto text-center">
                    <MathView math={item.formula} displayMode />
                  </div>
                )}
              </div>

              {/* Footer references & actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs mt-2">
                {item.sourceSlideRef ? (
                  <button
                    onClick={() => handleSlideClick(item.sourceSlideRef)}
                    className="text-stone-500 hover:text-teal-700 flex items-center gap-1 font-medium group transition-colors"
                    title="Click to view original slide"
                  >
                    <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-teal-700" />
                    <span>{item.sourceSlideRef}</span>
                  </button>
                ) : (
                  <span />
                )}

                {item.relatedLessonId && (
                  <button
                    onClick={() => onNavigateToLesson(item.relatedLessonId!)}
                    className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 group transition-colors ml-auto"
                  >
                    <span>Go to lesson</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlossaryView;

