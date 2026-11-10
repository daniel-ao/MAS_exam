/**
 * A small modal-logic engine: parser, pretty-printer, Kripke and neighborhood model checking.
 *
 * Syntax accepted (ASCII or Unicode):
 *   atoms      p, q, r, s (any lowercase word that is not an operator)
 *   constants  T, ⊤, true  |  F, ⊥, false
 *   negation   ¬φ, ~φ, !φ
 *   binary     ∧ & /\   ∨ | \/   → -> => ⇒   ↔ <-> <=> ⇔   (right-assoc implication)
 *   modal      □φ, []φ, ◇φ, <>φ, and K/B/E/D/M/N with an optional agent subscript:
 *              K_a φ, Kp, B φ, E_i φ, E^d_i φ, BA_i φ (subscripts need `_`).  `M` / `◇` is the dual (¬□¬).
 * Modalities name a relation: K_a → relation "a"; K → relation "K" (or the default relation).
 */

export type Formula =
  | { kind: 'atom'; name: string }
  | { kind: 'top' }
  | { kind: 'bot' }
  | { kind: 'not'; f: Formula }
  | { kind: 'and' | 'or' | 'imp' | 'iff'; a: Formula; b: Formula }
  | { kind: 'box' | 'dia'; op: string; agent: string; f: Formula };

// ----------------------------------------------------------------- tokenizer
type Tok = { t: string; v?: string };

const MODAL_RE = /^(BA|E\^d|Ed|K|B|E|D|N)(?:_\{?([a-z0-9]+)\}?)?(\^d)?/;

const tokenize = (src: string): Tok[] => {
  const out: Tok[] = [];
  let i = 0;
  const s = src.replace(/\s+/g, ' ');
  while (i < s.length) {
    const rest = s.slice(i);
    const c = s[i];
    if (c === ' ') { i++; continue; }
    if (c === '(' || c === ')') { out.push({ t: c }); i++; continue; }
    const two = rest.slice(0, 3);
    if (rest.startsWith('<->') || rest.startsWith('<=>') || c === '↔' || c === '⇔') {
      out.push({ t: 'iff' }); i += c === '↔' || c === '⇔' ? 1 : 3; continue;
    }
    if (rest.startsWith('->') || rest.startsWith('=>') || c === '→' || c === '⇒') {
      out.push({ t: 'imp' }); i += c === '→' || c === '⇒' ? 1 : 2; continue;
    }
    if (rest.startsWith('/\\') || c === '∧' || c === '&') { out.push({ t: 'and' }); i += c === '/' ? 2 : 1; continue; }
    if (rest.startsWith('\\/') || c === '∨' || c === '|') { out.push({ t: 'or' }); i += c === '\\' ? 2 : 1; continue; }
    if (c === '¬' || c === '~' || c === '!') { out.push({ t: 'not' }); i++; continue; }
    if (c === '⊤') { out.push({ t: 'top' }); i++; continue; }
    if (c === '⊥') { out.push({ t: 'bot' }); i++; continue; }
    if (rest.startsWith('[]') || c === '□' || rest.startsWith('<>') || c === '◇' || c === '♢') {
      const isBox = rest.startsWith('[]') || c === '□';
      i += rest.startsWith('[]') || rest.startsWith('<>') ? 2 : 1;
      const m = s.slice(i).match(/^_?\{?([a-z0-9]+)\}?/);
      let agent = '';
      if (m && s[i] === '_') { agent = m[1]; i += m[0].length; }
      out.push({ t: isBox ? 'box' : 'dia', v: `□|${agent}` });
      continue;
    }
    // Dual modality M (possibility) with optional agent.
    const dm = rest.match(/^M(?:_\{?([a-z0-9]+)\}?)?/);
    if (dm) { out.push({ t: 'dia', v: `M|${dm[1] || ''}` }); i += dm[0].length; continue; }
    const mm = rest.match(MODAL_RE);
    if (mm) {
      const op = mm[1] === 'E^d' || mm[1] === 'Ed' || (mm[1] === 'E' && mm[3]) ? 'Ed' : mm[1];
      out.push({ t: 'box', v: `${op}|${mm[2] || ''}` });
      i += mm[0].length;
      continue;
    }
    const w = rest.match(/^[A-Za-z][A-Za-z0-9]*/);
    if (w) {
      const word = w[0];
      if (word === 'T' || word === 'true') out.push({ t: 'top' });
      else if (word === 'F' || word === 'false') out.push({ t: 'bot' });
      else if (word === 'and') out.push({ t: 'and' });
      else if (word === 'or') out.push({ t: 'or' });
      else if (word === 'not') out.push({ t: 'not' });
      else out.push({ t: 'atom', v: word });
      i += word.length;
      continue;
    }
    throw new Error(`Unexpected symbol “${two[0]}” at position ${i + 1}`);
  }
  return out;
};

// ----------------------------------------------------------------- parser (precedence: ¬,modal > ∧ > ∨ > → > ↔)
export const parseFormula = (src: string): Formula => {
  const toks = tokenize(src);
  let pos = 0;
  const peek = () => toks[pos];
  const eat = (t: string) => {
    if (toks[pos]?.t !== t) throw new Error(`Expected “${t === ')' ? ')' : t}” ${toks[pos] ? 'before “' + (toks[pos].v || toks[pos].t) + '”' : 'at the end'}`);
    pos++;
  };
  const parseIff = (): Formula => {
    let a = parseImp();
    while (peek()?.t === 'iff') { pos++; a = { kind: 'iff', a, b: parseImp() }; }
    return a;
  };
  const parseImp = (): Formula => {
    const a = parseOr();
    if (peek()?.t === 'imp') { pos++; return { kind: 'imp', a, b: parseImp() }; }
    return a;
  };
  const parseOr = (): Formula => {
    let a = parseAnd();
    while (peek()?.t === 'or') { pos++; a = { kind: 'or', a, b: parseAnd() }; }
    return a;
  };
  const parseAnd = (): Formula => {
    let a = parseUnary();
    while (peek()?.t === 'and') { pos++; a = { kind: 'and', a, b: parseUnary() }; }
    return a;
  };
  const parseUnary = (): Formula => {
    const t = peek();
    if (!t) throw new Error('Formula ends too early');
    if (t.t === 'not') { pos++; return { kind: 'not', f: parseUnary() }; }
    if (t.t === 'box' || t.t === 'dia') {
      pos++;
      const [op, agent] = (t.v || '□|').split('|');
      return { kind: t.t, op, agent, f: parseUnary() };
    }
    if (t.t === '(') { pos++; const f = parseIff(); eat(')'); return f; }
    if (t.t === 'top') { pos++; return { kind: 'top' }; }
    if (t.t === 'bot') { pos++; return { kind: 'bot' }; }
    if (t.t === 'atom') { pos++; return { kind: 'atom', name: t.v! }; }
    throw new Error(`Unexpected “${t.v || t.t}”`);
  };
  if (toks.length === 0) throw new Error('Type a formula');
  const f = parseIff();
  if (pos < toks.length) throw new Error(`Unexpected “${toks[pos].v || toks[pos].t}” after a complete formula`);
  return f;
};

// ----------------------------------------------------------------- printing
const OP_SYMBOL: Record<string, string> = { '□': '□', K: 'K', B: 'B', E: 'E', Ed: 'Eᵈ', D: 'D', N: '□', BA: 'BA', M: '◇' };
const SUBSCRIPT: Record<string, string> = {
  a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', o: 'ₒ', p: 'ₚ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
};
const sub = (a: string) => (!a ? '' : [...a].every(c => SUBSCRIPT[c]) ? [...a].map(c => SUBSCRIPT[c]).join('') : `_${a}`);
export const formatFormula = (f: Formula, top = true): string => {
  const wrap = (s: string) => (top ? s : `(${s})`);
  switch (f.kind) {
    case 'atom': return f.name;
    case 'top': return '⊤';
    case 'bot': return '⊥';
    case 'not': return `¬${formatFormula(f.f, false)}`;
    case 'and': return wrap(`${formatFormula(f.a, false)} ∧ ${formatFormula(f.b, false)}`);
    case 'or': return wrap(`${formatFormula(f.a, false)} ∨ ${formatFormula(f.b, false)}`);
    case 'imp': return wrap(`${formatFormula(f.a, false)} → ${formatFormula(f.b, false)}`);
    case 'iff': return wrap(`${formatFormula(f.a, false)} ↔ ${formatFormula(f.b, false)}`);
    case 'box': return `${OP_SYMBOL[f.op] || f.op}${sub(f.agent)}${formatFormula(f.f, false)}`;
    case 'dia': return `◇${sub(f.agent)}${formatFormula(f.f, false)}`;
  }
};

/** Subformulas in evaluation order (inner first), without duplicates. */
export const subformulas = (f: Formula): Formula[] => {
  const out: Formula[] = [];
  const seen = new Set<string>();
  const go = (g: Formula) => {
    if (g.kind === 'not' || g.kind === 'box' || g.kind === 'dia') go(g.f);
    if (g.kind === 'and' || g.kind === 'or' || g.kind === 'imp' || g.kind === 'iff') { go(g.a); go(g.b); }
    const k = formatFormula(g);
    if (!seen.has(k)) { seen.add(k); out.push(g); }
  };
  go(f);
  return out;
};

// ----------------------------------------------------------------- Kripke models
export interface KripkeModel {
  worlds: string[];
  /** relation name → list of [from, to] edges */
  relations: Record<string, [string, string][]>;
  /** atom → worlds where it is true */
  valuation: Record<string, string[]>;
}

/** Which relation a modality refers to in a given model. */
export const relationFor = (op: string, agent: string, model: { relations: Record<string, unknown> }): string => {
  const names = Object.keys(model.relations);
  if (agent && names.includes(agent)) return agent;
  if (agent) return agent; // unknown agent → empty relation (reported by the UI)
  if (op !== '□' && op !== 'M' && names.includes(op)) return op;
  return names[0] || 'R';
};

export const successors = (m: KripkeModel, rel: string, w: string): string[] =>
  (m.relations[rel] || []).filter(([a]) => a === w).map(([, b]) => b);

export const evalKripke = (f: Formula, m: KripkeModel, w: string): boolean => {
  switch (f.kind) {
    case 'atom': return (m.valuation[f.name] || []).includes(w);
    case 'top': return true;
    case 'bot': return false;
    case 'not': return !evalKripke(f.f, m, w);
    case 'and': return evalKripke(f.a, m, w) && evalKripke(f.b, m, w);
    case 'or': return evalKripke(f.a, m, w) || evalKripke(f.b, m, w);
    case 'imp': return !evalKripke(f.a, m, w) || evalKripke(f.b, m, w);
    case 'iff': return evalKripke(f.a, m, w) === evalKripke(f.b, m, w);
    case 'box': return successors(m, relationFor(f.op, f.agent, m), w).every(v => evalKripke(f.f, m, v));
    case 'dia': return successors(m, relationFor(f.op, f.agent, m), w).some(v => evalKripke(f.f, m, v));
  }
};

// ----------------------------------------------------------------- frame properties
export interface FrameProps {
  reflexive: boolean;
  serial: boolean;
  symmetric: boolean;
  transitive: boolean;
  euclidean: boolean;
  /** first counterexample for each failing property, as readable text */
  witnesses: Partial<Record<keyof Omit<FrameProps, 'witnesses'>, string>>;
}

export const frameProperties = (worlds: string[], edges: [string, string][]): FrameProps => {
  const has = (a: string, b: string) => edges.some(([x, y]) => x === a && y === b);
  const succ = (a: string) => worlds.filter(b => has(a, b));
  const witnesses: FrameProps['witnesses'] = {};
  const noRefl = worlds.find(w => !has(w, w));
  if (noRefl) witnesses.reflexive = `no loop at ${noRefl}`;
  const noSucc = worlds.find(w => succ(w).length === 0);
  if (noSucc) witnesses.serial = `${noSucc} has no successor`;
  for (const [a, b] of edges) {
    if (!has(b, a) && !witnesses.symmetric) witnesses.symmetric = `${a}→${b} but not ${b}→${a}`;
  }
  outerT: for (const [a, b] of edges) for (const c of succ(b)) if (!has(a, c)) { witnesses.transitive = `${a}→${b}→${c} but not ${a}→${c}`; break outerT; }
  outerE: for (const a of worlds) for (const b of succ(a)) for (const c of succ(a)) if (!has(b, c)) { witnesses.euclidean = `${a}→${b}, ${a}→${c} but not ${b}→${c}`; break outerE; }
  return {
    reflexive: !witnesses.reflexive,
    serial: !witnesses.serial,
    symmetric: !witnesses.symmetric,
    transitive: !witnesses.transitive,
    euclidean: !witnesses.euclidean,
    witnesses
  };
};

// ----------------------------------------------------------------- neighborhood models
export interface NeighborhoodModel {
  worlds: string[];
  /** relation name → world → list of sets (each set = sorted list of worlds) */
  neighborhoods: Record<string, Record<string, string[][]>>;
  valuation: Record<string, string[]>;
}

export const setKey = (s: string[]) => [...s].sort().join(',');

/** Truth set ⟦φ⟧ under neighborhood semantics (□ ⇔ ⟦φ⟧ ∈ N(w); ◇ = ¬□¬). */
export const extension = (f: Formula, m: NeighborhoodModel): string[] => {
  const W = m.worlds;
  const holds = (g: Formula) => new Set(extension(g, m));
  switch (f.kind) {
    case 'atom': return W.filter(w => (m.valuation[f.name] || []).includes(w));
    case 'top': return [...W];
    case 'bot': return [];
    case 'not': { const s = holds(f.f); return W.filter(w => !s.has(w)); }
    case 'and': { const a = holds(f.a), b = holds(f.b); return W.filter(w => a.has(w) && b.has(w)); }
    case 'or': { const a = holds(f.a), b = holds(f.b); return W.filter(w => a.has(w) || b.has(w)); }
    case 'imp': { const a = holds(f.a), b = holds(f.b); return W.filter(w => !a.has(w) || b.has(w)); }
    case 'iff': { const a = holds(f.a), b = holds(f.b); return W.filter(w => a.has(w) === b.has(w)); }
    case 'box':
    case 'dia': {
      const rel = relationFor(f.op, f.agent, { relations: m.neighborhoods });
      const nb = m.neighborhoods[rel] || {};
      const inner = f.kind === 'box' ? extension(f.f, m) : W.filter(w => !extension(f.f, m).includes(w));
      const key = setKey(inner);
      const boxTrue = W.filter(w => (nb[w] || []).some(X => setKey(X) === key));
      return f.kind === 'box' ? boxTrue : W.filter(w => !boxTrue.includes(w));
    }
  }
};

/** Hand-checkable constraints on a neighborhood function. */
export const neighborhoodConstraints = (m: NeighborhoodModel, rel: string) => {
  const nb = m.neighborhoods[rel] || {};
  const W = m.worlds;
  const allKey = setKey(W);
  const issues: { name: string; ok: boolean; detail: string }[] = [];
  const success = W.flatMap(w => (nb[w] || []).filter(X => !X.includes(w)).map(X => `${w}: {${X.join(',')}} ∌ ${w}`));
  issues.push({ name: 'Success (X ∈ N(w) ⇒ w ∈ X)', ok: success.length === 0, detail: success[0] || 'every member contains its world' });
  const hasW = W.filter(w => (nb[w] || []).some(X => setKey(X) === allKey));
  issues.push({ name: 'No tautology (W ∉ N(w))', ok: hasW.length === 0, detail: hasW.length ? `W ∈ N(${hasW[0]})` : 'W never appears' });
  let inter = '';
  for (const w of W) {
    const sets = nb[w] || [];
    for (const X of sets) for (const Y of sets) {
      const I = X.filter(x => Y.includes(x));
      if (!sets.some(Z => setKey(Z) === setKey(I)) && !inter) inter = `${w}: {${X.join(',')}} ∩ {${Y.join(',')}} = {${I.join(',')}} missing`;
    }
  }
  issues.push({ name: 'Closed under ∩', ok: !inter, detail: inter || 'all pairwise intersections present' });
  let mono = '';
  for (const w of W) {
    const sets = nb[w] || [];
    for (const X of sets) {
      const sup = W.filter(x => !X.includes(x));
      if (sup.length > 0) {
        const bigger = [...X, sup[0]];
        if (!sets.some(Z => setKey(Z) === setKey(bigger)) && !mono) mono = `${w}: {${X.join(',')}} ∈ N but {${setKey(bigger)}} ∉ N`;
      }
    }
  }
  issues.push({ name: 'Upward closed (monotonic)', ok: !mono, detail: mono || 'supersets of members are members' });
  return issues;
};
