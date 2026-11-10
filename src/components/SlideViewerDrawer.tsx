import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ExternalLink, Image as ImageIcon, GripVertical, Maximize2, Minimize2 } from 'lucide-react';
import { DECKS, getDeck, slideImagePath as deckImagePath } from '../content/decks';

interface SlideViewerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Deck number (see content/decks.ts). */
  deck: number;
  initialPage?: number;
  /** Changes every time the drawer is (re)opened so the page re-syncs even if `initialPage` is unchanged. */
  openNonce?: number;
  /** Docked = shares the screen with the content (desktop). Otherwise it floats over the content. */
  docked: boolean;
  width: number;
  onWidthChange: (w: number) => void;
}

export const SLIDE_PANEL_MIN = 360;
export const clampPanelWidth = (w: number) =>
  Math.round(Math.min(Math.max(w, SLIDE_PANEL_MIN), Math.max(SLIDE_PANEL_MIN, window.innerWidth * 0.65)));

export const SlideViewerDrawer: React.FC<SlideViewerDrawerProps> = ({
  isOpen,
  onClose,
  deck,
  initialPage = 1,
  openNonce,
  docked,
  width,
  onWidthChange
}) => {
  const [activeDeck, setActiveDeck] = useState<number>(deck);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageDraft, setPageDraft] = useState<string>(String(initialPage));
  const [zoom, setZoom] = useState<number>(100);
  const [imgFailed, setImgFailed] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<boolean>(false);

  // Re-sync whenever the drawer is asked to show a particular slide.
  useEffect(() => {
    setActiveDeck(deck);
    setCurrentPage(initialPage || 1);
  }, [deck, initialPage, openNonce]);

  const lecture = getDeck(activeDeck);
  const maxPages = lecture.pages;

  useEffect(() => {
    setPageDraft(String(currentPage));
    setImgFailed(false);
  }, [currentPage, activeDeck]);

  const goTo = (p: number) => setCurrentPage(Math.min(maxPages, Math.max(1, p)));

  // Keyboard: Esc closes; arrows flip slides while the pointer/focus is inside the panel.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (e.key === 'Escape' && !typing) {
        onClose();
        return;
      }
      const inside = hoverRef.current || (panelRef.current?.contains(document.activeElement) ?? false);
      if (!inside || typing) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentPage(p => Math.min(maxPages, p + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentPage(p => Math.max(1, p - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, maxPages, onClose]);

  // Drag-to-resize from the left edge.
  const startDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const onMove = (ev: PointerEvent) => onWidthChange(clampPanelWidth(window.innerWidth - ev.clientX));
    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  if (!isOpen) return null;

  const slideImagePath = deckImagePath(lecture.num, currentPage);
  const isWide = docked && width >= window.innerWidth * 0.6;

  const commitDraft = () => {
    const val = parseInt(pageDraft, 10);
    if (!Number.isNaN(val)) goTo(val);
    else setPageDraft(String(currentPage));
  };

  return (
    <>
      {/* On small screens the panel floats over content: add a dismissable scrim. */}
      {!docked && (
        <div className="fixed inset-0 top-16 z-40 bg-slate-900/30 animate-in fade-in" onClick={onClose} aria-hidden />
      )}

      <aside
        ref={panelRef}
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
        aria-label="Original lecture slides"
        className={`fixed top-16 bottom-0 right-0 z-40 bg-white border-l border-stone-200 flex flex-col animate-in slide-in-from-right ${
          docked ? 'shadow-[-8px_0_24px_-16px_rgba(15,23,42,0.35)]' : 'shadow-2xl w-full sm:w-[560px]'
        }`}
        style={docked ? { width } : undefined}
      >
        {/* Resize handle */}
        {docked && (
          <div
            onPointerDown={startDrag}
            onDoubleClick={() => onWidthChange(clampPanelWidth(window.innerWidth * 0.42))}
            className={`absolute left-0 top-0 bottom-0 -translate-x-1/2 w-3 cursor-col-resize z-10 flex items-center justify-center group ${
              isDragging ? 'bg-teal-500/10' : ''
            }`}
            title="Drag to resize · double-click to reset"
          >
            <div className={`h-12 w-1.5 rounded-full flex items-center justify-center transition-colors ${
              isDragging ? 'bg-teal-600' : 'bg-stone-300 group-hover:bg-teal-500'
            }`}>
              <GripVertical className="w-3 h-3 text-white opacity-0 group-hover:opacity-100" />
            </div>
          </div>
        )}

        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2 min-w-0">
            <ImageIcon className="w-4 h-4 text-teal-700 shrink-0" />
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide truncate">Original Course Slides</h3>
              <p className="text-[11px] text-slate-500 truncate">{lecture.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Deck switcher */}
            <select
              value={activeDeck}
              onChange={e => {
                setActiveDeck(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-stone-200 rounded-lg px-1.5 py-1 text-[11px] font-bold text-slate-700 max-w-[9.5rem]"
              title="Switch lecture part"
            >
              {DECKS.map(d => (
                <option key={d.num} value={d.num}>
                  {d.short === 'TD' ? 'TD' : `Part ${d.short}`} · {d.pages} slides
                </option>
              ))}
            </select>

            <div className="hidden sm:flex items-center bg-white border border-stone-200 rounded-lg p-0.5 text-xs text-slate-600">
              <button
                onClick={() => setZoom(prev => Math.max(70, prev - 15))}
                className="p-1 hover:bg-stone-100 rounded disabled:opacity-40"
                disabled={zoom <= 70}
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="px-1 font-mono text-[11px] font-bold hover:bg-stone-100 rounded"
                title="Reset zoom"
              >
                {zoom}%
              </button>
              <button
                onClick={() => setZoom(prev => Math.min(220, prev + 15))}
                className="p-1 hover:bg-stone-100 rounded disabled:opacity-40"
                disabled={zoom >= 220}
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {docked && (
              <button
                onClick={() => onWidthChange(clampPanelWidth(isWide ? window.innerWidth * 0.42 : window.innerWidth * 0.65))}
                className="hidden lg:block p-1.5 text-slate-400 hover:text-slate-700 hover:bg-stone-200 rounded-lg transition-all"
                title={isWide ? 'Shrink panel' : 'Widen panel'}
              >
                {isWide ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-stone-200 rounded-lg transition-all"
              title="Close slides (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Canvas Area */}
        <div className="flex-1 min-h-0 overflow-auto bg-stone-900/95 p-4">
          <div className="min-h-full flex items-center justify-center">
            <div className="transition-[width] duration-150" style={{ width: `${zoom}%` }}>
              {imgFailed ? (
                <div className="aspect-[4/3] w-full rounded-lg border border-white/10 flex items-center justify-center text-sm text-stone-300">
                  Slide {currentPage} preview unavailable
                </div>
              ) : (
                <img
                  key={slideImagePath}
                  src={slideImagePath}
                  alt={`Slide ${currentPage} of ${lecture.title}`}
                  className="w-full h-auto rounded-lg shadow-2xl border border-white/10 select-none bg-white"
                  draggable={false}
                  onError={() => setImgFailed(true)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation Toolbar */}
        <div className="px-3 py-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`px-2 py-1.5 rounded-lg border flex items-center gap-1 text-xs font-semibold ${
                currentPage <= 1
                  ? 'opacity-40 cursor-not-allowed bg-stone-100 border-stone-200 text-slate-400'
                  : 'bg-white hover:bg-stone-100 border-stone-300 text-slate-700'
              }`}
              title="Previous slide (←)"
            >
              <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Prev</span>
            </button>
            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage >= maxPages}
              className={`px-2 py-1.5 rounded-lg border flex items-center gap-1 text-xs font-semibold ${
                currentPage >= maxPages
                  ? 'opacity-40 cursor-not-allowed bg-stone-100 border-stone-200 text-slate-400'
                  : 'bg-white hover:bg-stone-100 border-stone-300 text-slate-700'
              }`}
              title="Next slide (→)"
            >
              <span className="hidden sm:inline">Next</span> <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Page Jumper */}
          <form
            className="flex items-center gap-2 text-xs"
            onSubmit={e => {
              e.preventDefault();
              commitDraft();
            }}
          >
            <span className="text-slate-500">Slide</span>
            <input
              type="text"
              inputMode="numeric"
              value={pageDraft}
              onChange={e => setPageDraft(e.target.value.replace(/[^0-9]/g, ''))}
              onBlur={commitDraft}
              className="w-12 px-2 py-1 bg-white border border-stone-300 rounded font-mono font-bold text-center focus:outline-none focus:ring-1 focus:ring-teal-600"
              aria-label="Slide number"
            />
            <span className="text-slate-500 font-mono">/ {maxPages}</span>
          </form>

          <a
            href={slideImagePath}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            Raw <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>
    </>
  );
};
