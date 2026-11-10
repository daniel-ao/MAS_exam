import { Lesson, Module } from '../types';

/** Raw template tag: keeps LaTeX backslashes; \` yields a literal backtick for inline code. */
const r = (s: TemplateStringsArray, ...v: unknown[]) => String.raw(s, ...v).replace(/\\`/g, '`');
type LessonInput = Omit<Lesson, 'courseId'>;
const L = (l: LessonInput): Lesson => ({ ...l, courseId: 'course-3' });

/** Chapter 3, first half: manipulation, KBE syntax, Boolean semantics, Kripke/S5 knowledge, correspondence, S5 axiomatics. */
export const course3ModulesA: Module[] = [
  // =====================================================================
  {
    id: 'mod-3-1',
    courseId: 'course-3',
    title: 'Module 3.1: Manipulation and the KBE Language',
    description: 'What manipulation is (premeditation, instrumentalization, concealment) and the syntax of the KBE language.',
    sourcePagesRange: 'Part 3.1 · Slides 1–10',
    lessons: [
      L({
        id: 'lesson-3-1-1',
        moduleId: 'mod-3-1',
        deck: 6,
        title: 'What Is Manipulation?',
        sourcePages: [1, 2, 3, 4, 5, 6],
        summary: 'Manipulation is the deliberate effect of a manipulator to instrumentalize a victim while making sure to conceal that effect. Its three characteristics: premeditation, instrumentalization, concealment.',
        understand: {
          overview: 'Cognitive agents reason about mental states (beliefs, knowledge, intentions). Some are manipulative. The goal is a logical definition of manipulation to design robust systems, detect manipulation and characterize new strategies.',
          detailedExplanation: r`### Manipulation in computer systems (slide 2)
- **Reputation systems**: lying about one's identity to self-promote.
- **Voting systems**: revealing a false preference profile to influence an outcome.
- **Peer-to-peer networks**: making a node believe it is alone in the network.

### Context (slide 3)
Agents are cognitive (they reason about beliefs, knowledge, intentions), rational, assumed to be **perfect reasoners**, and some are manipulative. Research objectives: help design **robust** systems, **detect** manipulation, **characterize** new strategies. Questions: what is manipulation in the abstract, and how can we describe and reason about it logically?

### Views from other sciences (slide 4)
| Field | View |
|---|---|
| Psychiatry (Kligman, 1992) | Instrumentalizing a victim in the interest of the manipulator. |
| Politics & marketing (Sunstein, 2015) | Altering judgment, depriving people of some of their deliberate choices. |
| Economics (Ettinger, 2010) | Influencing an opponent's beliefs and behavior to alter a game's outcome while concealing one's true intentions. |

> "Manipulation is not exactly coercion, not precisely persuasion, and not entirely similar to deception." (Handelman, 2009)

### Three characteristics (slide 5)
1. **Premeditation**: a deliberate intention of the manipulator.
2. **Instrumentalization**: an influence exercised on a victim.
3. **Concealment**: manipulation is invisible to the victim when it happens.

### The definition to know (slide 6, Leturc & Bonnet, AAMAS 2020)
> We call a **manipulation** the **deliberate effect** of an agent, called **the manipulator**, to **instrumentalize** another agent, called **the victim**, while making sure to **conceal that effect**.

Each word maps to a KBE operator later: *deliberate effect* → $E^d_i$, *instrumentalize* → $E_j$ / $E^d_j$ of the victim, *conceal* → $\neg K_j$ or $\neg B_j$.`,
          keyPoints: [
            'Definition: the deliberate effect of a manipulator to instrumentalize a victim while concealing that effect.',
            'Three characteristics: premeditation, instrumentalization, concealment.',
            'Manipulation ≠ coercion (no concealment), ≠ persuasion (only belief change), ≠ deception (only lying).',
            'Examples: Sybil self-promotion, false preference profiles, isolating a P2P node.'
          ]
        },
        examPitfalls: ['Without concealment it is not manipulation: an open threat that the victim knows about is coercion.'],
        checkpoints: [
          {
            id: 'cp-3-1-1-1',
            question: 'Which three characteristics define manipulation in the course?',
            type: 'single',
            options: [
              'Premeditation, instrumentalization, concealment',
              'Lying, coercion, persuasion',
              'Belief, desire, intention',
              'Monitoring, sanctions, rewards'
            ],
            correctAnswers: [0],
            explanation: 'Slide 5: premeditation (deliberate intention), instrumentalization (influence on a victim), concealment (invisible to the victim).',
            difficulty: 'foundation',
            sourceSlide: 5
          },
          {
            id: 'cp-3-1-1-2',
            question: 'An agent openly threatens another so that it acts, and the victim fully knows it is being forced. Why is this not manipulation under the course definition?',
            type: 'single',
            options: ['The effect is not concealed', 'There is no deliberate effect', 'There is no victim', 'The victim acts'],
            correctAnswers: [0],
            explanation: 'The definition requires the manipulator to conceal the effect. Known forcing is coercion (formalized later with K_j instead of ¬K_j).',
            difficulty: 'intermediate',
            sourceSlide: 6
          }
        ]
      }),
      L({
        id: 'lesson-3-1-2',
        moduleId: 'mod-3-1',
        deck: 6,
        title: 'KBE Syntax: Building Well-Formed Formulas',
        sourcePages: [7, 8, 9, 10],
        summary: 'KBE extends propositional logic with four modalities: Kᵢ (knowledge), Bᵢ (belief), Eᵢ (effect of i’s actions) and Eᵢᵈ (deliberate effect). Formulas are built in finitely many steps L₀ ⊆ L₁ ⊆ …; each modality takes exactly one formula.',
        understand: {
          overview: 'The KBE language: φ ::= p | ¬φ | φ∨φ | φ∧φ | φ⇒φ | Kᵢφ | Bᵢφ | Eᵢφ | Eᵢᵈφ.',
          detailedExplanation: r`### The grammar (slide 7)
$$\varphi ::= p\mid\neg\varphi\mid\varphi\lor\varphi\mid\varphi\land\varphi\mid\varphi\Rightarrow\varphi\mid K_i\varphi\mid B_i\varphi\mid E_i\varphi\mid E_i^d\varphi$$
| Operator | Reading |
|---|---|
| $K_i\varphi$ | Agent $i$ **knows** that $\varphi$. |
| $B_i\varphi$ | Agent $i$ **believes** that $\varphi$. |
| $E_i\varphi$ | Actions performed by $i$ **lead to** $\varphi$ (effect). |
| $E_i^d\varphi$ | $\varphi$ is a **deliberate effect** intended by $i$. |

Reading the BNF: \`::=\` means "is constructed as", each \`|\` introduces another permitted construction, and $\varphi$ stands for any formula already constructed.

### Building the language step by step (slide 8)
$L_0=P$ (atoms), and
$$L_{n+1}=L_n\cup\{\neg\varphi\}\cup\{(\varphi\circ\psi)\mid\circ\in\{\land,\lor,\Rightarrow\}\}\cup\{K_i\varphi,B_i\varphi,E_i\varphi,E_i^d\varphi\}\quad(\varphi,\psi\in L_n,\ i\in N)$$
The language is $\mathcal L_{KBE}=\bigcup_{n\ge0}L_n$. $L_n$ contains formulas of construction depth at most $n$. Every wff is obtained after **finitely many** rule applications. Example: $p,q\in L_0$, $\neg q\in L_1$, $(p\land\neg q)\in L_2$, $K_i(p\land\neg q)\in L_3$.

### Exercise: which expressions are wffs? (slide 9)
| # | Expression | Verdict |
|---|---|---|
| 1 | $K_i(p\land\neg q)$ | ✅ outermost operator $K_i$ |
| 2 | $B_i(p,q)$ | ❌ $B_i$ takes ONE formula; "$p,q$" is not a formula |
| 3 | $E_i^dB_j(p\Rightarrow q)$ | ✅ outermost $E_i^d$ |
| 4 | $(K_ip\lor E_j\neg q)$ | ✅ outermost $\lor$ |
| 5 | $(p\land B_i)$ | ❌ $B_i$ has no formula to apply to |
| 6 | $\neg(p\lor)$ | ❌ $\lor$ is missing its right-hand formula |
Assess syntax independently of truth.

### Structural proofs (slide 10)
Prove membership by a numbered derivation, naming the rule at each step. For $\varphi_2=K_iB_j(p\Rightarrow q)$: $p,q\in L_0$; $(p\Rightarrow q)\in L_1$ (binary connective); $B_j(p\Rightarrow q)\in L_2$ (modality); $K_iB_j(p\Rightarrow q)\in L_3$ (modality). The **innermost** construction comes first.
For $\varphi_3=E_i^d((K_jp\lor\neg B_jq)\land E_jr)$: build $K_jp\in L_1$, $B_jq\in L_1$, $\neg B_jq\in L_2$, $(K_jp\lor\neg B_jq)\in L_3$; separately $E_jr\in L_1\subseteq L_3$; then the conjunction $\in L_4$ and finally $E^d_i(\ldots)\in L_5$.`,
          keyPoints: [
            'KBE = propositional logic + Kᵢ (knowledge), Bᵢ (belief), Eᵢ (effect), Eᵢᵈ (deliberate effect).',
            'L₀ = P; L_{n+1} adds negations, binary connectives and modalities applied to L_n formulas; L_KBE = ⋃ L_n.',
            'Each modality applies to exactly one formula; binary connectives need two.',
            'Prove membership by building from the innermost subformula outward, naming the rule at each step.'
          ]
        },
        examPitfalls: [
          'Syntax is independent of truth: K_i(p ∧ ¬q) is a wff even if it is false in every model you can think of.',
          'Since L_n ⊆ L_{n+1}, a formula in L_1 is also in L_3: you can combine branches of different depths.'
        ],
        checkpoints: [
          {
            id: 'cp-3-1-2-1',
            question: 'Which of these is NOT a KBE well-formed formula?',
            type: 'single',
            options: ['B_i(p, q)', 'K_i(p ∧ ¬q)', 'E_i^d B_j(p ⇒ q)', '(K_i p ∨ E_j ¬q)'],
            correctAnswers: [0],
            explanation: 'B_i takes exactly one formula; the comma-separated pair "p, q" is not a formula (slide 9).',
            difficulty: 'foundation',
            sourceSlide: 9
          },
          {
            id: 'cp-3-1-2-2',
            question: 'What is the smallest n such that K_i B_j(p ⇒ q) ∈ L_n?',
            type: 'single',
            options: ['3', '2', '1', '4'],
            correctAnswers: [0],
            explanation: 'p, q ∈ L₀; (p ⇒ q) ∈ L₁; B_j(p ⇒ q) ∈ L₂; K_i B_j(p ⇒ q) ∈ L₃.',
            difficulty: 'intermediate',
            sourceSlide: 10
          },
          {
            id: 'cp-3-1-2-3',
            question: 'What is the outermost operator of E_i^d B_j(p ⇒ q)?',
            type: 'single',
            options: ['E_i^d', 'B_j', '⇒', 'E_i'],
            correctAnswers: [0],
            explanation: 'The formula is E_i^d applied to B_j(p ⇒ q) (slide 9, answer for expression 3).',
            difficulty: 'foundation',
            sourceSlide: 9
          }
        ]
      })
    ]
  },
  // =====================================================================
  {
    id: 'mod-3-2',
    courseId: 'course-3',
    title: 'Module 3.2: Boolean Semantics and Hilbert Proofs',
    description: 'Valuations, truth, satisfiability and validity; the propositional axiom schemes, modus ponens and the formal proof of p ⇒ p.',
    sourcePagesRange: 'Part 3.1 · Slides 11–15',
    lessons: [
      L({
        id: 'lesson-3-2-1',
        moduleId: 'mod-3-2',
        deck: 6,
        title: 'Truth, Satisfiability and Validity',
        sourcePages: [11, 12, 13],
        summary: 'A valuation v assigns 0/1 to atoms and extends to formulas through the connectives. Truth fixes a valuation, satisfiability requires one, validity requires all. The axiom schemes PC1–PC10 are all valid (tautologies).',
        understand: {
          overview: 'Syntax tells us which expressions are formulas. Semantics tells us how to evaluate them under an interpretation.',
          detailedExplanation: r`### Boolean interpretation (slide 11)
A valuation $v:P\to\{0,1\}$ extends to an interpretation $I_v:\mathcal L_{PC}\to\{0,1\}$:
- $I_v(p)=1\iff v(p)=1$; $I_v(\neg\varphi)=1\iff I_v(\varphi)=0$; $I_v(\varphi\land\psi)=1\iff I_v(\varphi)=1$ and $I_v(\psi)=1$.

For $\varphi=p\land\neg q$: true only when $v(p)=1, v(q)=0$. We write $v\models\varphi$ when $\varphi$ is true under $v$.

### Three notions (slide 12)
| Notion | Definition | Question |
|---|---|---|
| **Truth under $v$** | $I_v\models\varphi\iff I_v(\varphi)=1$ | True under this valuation? |
| **Satisfiability** | $\exists I_v:\ I_v\models\varphi$ | Is there at least one valuation making it true? |
| **Validity** | $\models\varphi\iff\forall I_v,\ I_v\models\varphi$ | True under every valuation? |

| Formula | Satisfiable? | Valid? |
|---|---|---|
| $p\land q$ | Yes | No |
| $p\lor\neg p$ | Yes | Yes |
| $p\land\neg p$ | No | No |

**Watch the quantifier**: truth fixes a valuation, satisfiability requires one, validity requires all. A valuation making $\varphi$ true **witnesses satisfiability**; one making it false is a **counterexample to validity**. Valid ⇒ satisfiable; unsatisfiable means no valuation works.

### The axiom schemes (slide 13)
All of PC1–PC10 are **valid** (hence satisfiable): e.g. PC1 $p\Rightarrow(q\Rightarrow p)$, PC4 $(p\land q)\Rightarrow p$, PC7 $p\Rightarrow(p\lor q)$, PC10 $(\neg p\Rightarrow q)\Rightarrow((\neg p\Rightarrow\neg q)\Rightarrow p)$. To check PC1: it can only be false if $p=1$ and $(q\Rightarrow p)=0$, which needs $p=0$: impossible. Together with modus ponens, these schemes generate all classical tautologies.`,
          keyPoints: [
            'Truth: under one valuation. Satisfiable: under at least one. Valid: under all.',
            'p ∧ q: satisfiable, not valid; p ∨ ¬p: valid; p ∧ ¬p: unsatisfiable.',
            'A falsifying valuation is a counterexample to validity.',
            'The propositional axiom schemes PC1–PC10 are all valid.'
          ]
        },
        checkpoints: [
          {
            id: 'cp-3-2-1-1',
            question: 'p ∧ q is:',
            type: 'single',
            options: ['Satisfiable but not valid', 'Valid', 'Unsatisfiable', 'Neither a formula nor satisfiable'],
            correctAnswers: [0],
            explanation: 'v(p) = v(q) = 1 makes it true (satisfiable); v(q) = 0 is a counterexample to validity (slide 12).',
            difficulty: 'foundation',
            sourceSlide: 12
          },
          {
            id: 'cp-3-2-1-2',
            question: 'Why is p ⇒ (q ⇒ p) (PC1) valid?',
            type: 'single',
            options: [
              'To be false, p must be 1 and q ⇒ p must be 0, which requires p = 0: impossible',
              'Because q is always true',
              'Because it is an axiom, so it is true by decision',
              'Because p ⇒ p'
            ],
            correctAnswers: [0],
            explanation: 'An implication is false only when the antecedent is true and the consequent false; that forces contradictory values for p.',
            difficulty: 'intermediate',
            sourceSlide: 13
          }
        ]
      }),
      L({
        id: 'lesson-3-2-2',
        moduleId: 'mod-3-2',
        deck: 6,
        title: 'Hilbert Proofs: Axiom Schemes and Modus Ponens',
        sourcePages: [14, 15],
        summary: 'A Hilbert system has axiom schemes and inference rules. With PC1–PC3 and modus ponens, ⊢ p ⇒ p is proved in 5 lines. A proof is a finite sequence of axiom instances or MP consequences.',
        understand: {
          overview: 'A Hilbert proof system consists of axiom schemes and inference rules. For ¬ and ⇒, three schemes and modus ponens suffice.',
          detailedExplanation: r`### The system (slide 14)
| Scheme | Formula |
|---|---|
| PC1 | $\varphi\Rightarrow(\psi\Rightarrow\varphi)$ |
| PC2 | $(\varphi\Rightarrow(\psi\Rightarrow\chi))\Rightarrow((\varphi\Rightarrow\psi)\Rightarrow(\varphi\Rightarrow\chi))$ |
| PC3 | $(\neg\varphi\Rightarrow\neg\psi)\Rightarrow(\psi\Rightarrow\varphi)$ |

**Axiom instances**: replace each metavariable **consistently** by a formula, e.g. $\varphi:=p,\ \psi:=\neg q$ in PC1 gives $p\Rightarrow(\neg q\Rightarrow p)$.

**Modus ponens**: $\dfrac{\varphi\qquad\varphi\Rightarrow\psi}{\psi}$.

A **proof of $\theta$** is a finite sequence $\theta_1,\dots,\theta_n=\theta$ where each line is an axiom instance or follows from two earlier lines by MP. If one exists without premises, write $\vdash_{PC}\theta$: $\theta$ is a **theorem**.

### Uniform substitution
Schemes contain substitution implicitly. Equivalently, a system can state its axioms as single formulas ($p\Rightarrow(q\Rightarrow p)$) and add the rule **Uniform Substitution (US)**: from $\vdash\varphi$ infer $\vdash\varphi[p:=\psi]$, replacing **every** occurrence of the atom $p$ by the same formula $\psi$. This is the presentation listed in the exam scope (MP, US, Nec).

### Proving $\vdash p\Rightarrow p$ (slide 15)
| # | Formula | Justification |
|---|---|---|
| 1 | $p\Rightarrow((p\Rightarrow p)\Rightarrow p)$ | PC1, $\varphi:=p,\ \psi:=(p\Rightarrow p)$ |
| 2 | $p\Rightarrow(p\Rightarrow p)$ | PC1, $\varphi:=p,\ \psi:=p$ |
| 3 | $(p\Rightarrow((p\Rightarrow p)\Rightarrow p))\Rightarrow((p\Rightarrow(p\Rightarrow p))\Rightarrow(p\Rightarrow p))$ | PC2, $\varphi:=p,\ \psi:=(p\Rightarrow p),\ \chi:=p$ |
| 4 | $(p\Rightarrow(p\Rightarrow p))\Rightarrow(p\Rightarrow p)$ | MP 1, 3 |
| 5 | $p\Rightarrow p$ | MP 2, 4 |

How it works: line 3 has the shape $A\Rightarrow(B\Rightarrow C)$; line 1 gives $A$, so line 4 gives $B\Rightarrow C$; line 2 gives $B$, so line 5 gives $C$. We proved $p\Rightarrow p$ **without assuming $p$**, and by uniform substitution $\vdash\theta\Rightarrow\theta$ for every $\theta$.`,
          keyPoints: [
            'Hilbert system = axiom schemes + inference rules; PC1–PC3 + MP suffice for ¬ and ⇒.',
            'An axiom instance replaces metavariables consistently; Uniform Substitution does the same for atoms of a theorem.',
            'A proof is a finite sequence where each line is an axiom instance or follows by MP from earlier lines.',
            '⊢ p ⇒ p: PC1, PC1, PC2, MP, MP (5 lines).'
          ]
        },
        labId: 'proof-lab',
        examPitfalls: [
          'A truth table shows validity; it is NOT a Hilbert derivation. When asked for a proof, write numbered lines with justifications.',
          'In line 3, substitute (p ⇒ p) for ψ everywhere it occurs in PC2, consistently.'
        ],
        checkpoints: [
          {
            id: 'cp-3-2-2-1',
            question: 'In the proof of p ⇒ p, which justification gives line 3?',
            type: 'single',
            options: ['PC2 with φ := p, ψ := (p ⇒ p), χ := p', 'PC1 with φ := p, ψ := p', 'MP on lines 1 and 2', 'PC3'],
            correctAnswers: [0],
            explanation: 'Line 3 is the PC2 instance that lets MP detach (p ⇒ (p ⇒ p)) ⇒ (p ⇒ p) using line 1.',
            difficulty: 'intermediate',
            sourceSlide: 15
          },
          {
            id: 'cp-3-2-2-2',
            question: 'What does ⊢_PC θ mean?',
            type: 'single',
            options: [
              'There is a Hilbert proof of θ without premises (θ is a theorem)',
              'θ is true under the current valuation',
              'θ is satisfiable',
              'θ is an atom'
            ],
            correctAnswers: [0],
            explanation: 'Slide 14: if a proof exists without premises, write ⊢_PC θ and call θ a theorem.',
            difficulty: 'foundation',
            sourceSlide: 14
          }
        ]
      })
    ]
  },
  // =====================================================================
  {
    id: 'mod-3-3',
    courseId: 'course-3',
    title: 'Module 3.3: Kripke Semantics and S5 Knowledge',
    description: 'Possible worlds, truth at a world, validity in a model or frame, equivalence relations and epistemic model checking.',
    sourcePagesRange: 'Part 3.1 · Slides 16–25',
    lessons: [
      L({
        id: 'lesson-3-3-1',
        moduleId: 'mod-3-3',
        deck: 6,
        title: 'Kripke Models: Truth at a World',
        sourcePages: [16, 17, 18],
        summary: 'A Kripke model M = (W, R, V) has worlds, an accessibility relation and a valuation V: P → 2^W. Kφ is true at w iff φ is true at every world accessible from w. Validity in a model fixes R and V; validity on a frame quantifies over all valuations.',
        understand: {
          overview: 'Whether p is true and whether an agent knows p are different questions. To evaluate knowledge we must also consider the situations the agent cannot rule out.',
          detailedExplanation: r`### The Kripke idea (slide 16)
- **Knowledge $K_i\varphi$**: examine every world compatible with $i$'s information; $\varphi$ must hold throughout.
- **Belief $B_i\varphi$**: examine every world compatible with $i$'s beliefs; these need **not** include the actual world (beliefs can be wrong).
- **Effect $E_i\varphi$**: examine the alternatives selected by the action-effect relation.
- $E_i^d$ needs **neighborhood semantics** (later).

$$\mathcal M=(W,\{R_i\}_{i\in N},V),\qquad V:P\to2^W$$

### Truth at a world (slide 17), recursively
| Construction | Truth condition |
|---|---|
| Constants | $\mathcal M,w\models\top$; $\mathcal M,w\not\models\bot$ |
| Atom | $\mathcal M,w\models p\iff w\in V(p)$ |
| Negation | $\mathcal M,w\models\neg\varphi\iff\mathcal M,w\not\models\varphi$ |
| $\land$, $\lor$, $\Rightarrow$ | Boolean, evaluated at the **same** world $w$ |
| **Knowledge** | $\mathcal M,w\models K\varphi\iff\forall v\in W,\ (wRv\Rightarrow\mathcal M,v\models\varphi)$ |

Each clause reduces a formula to **strictly smaller subformulas**. Connectives stay at $w$; $K$ moves to every accessible $v$. Dual: $\hat K\varphi:=\neg K\neg\varphi$ ("possible"), true iff **some** accessible world satisfies $\varphi$ (written $\Diamond$ with $\Box$ for $K$ in the TD).

### Levels of validity (slide 18)
A **frame** $F=(W,R)$; a **model** $\mathcal M=(W,R,V)$, with $W\neq\varnothing$.
| Notion | Definition | What varies? |
|---|---|---|
| Truth at a world | $\mathcal M,w\models\varphi$ | Nothing |
| Validity in a model | $\mathcal M\models\varphi\iff\forall w,\ \mathcal M,w\models\varphi$ | The world |
| Validity on a frame | $F\models\varphi\iff\forall V\,\forall w,\ (W,R,V),w\models\varphi$ | Valuation and world |
| Satisfiability | $\exists\mathcal M\,\exists w:\ \mathcal M,w\models\varphi$ | Choose both |

Example: $W=\{w\}$, $R=\{(w,w)\}$, $V(p)=\{w\}$: $\mathcal M\models p$, but with $V'(p)=\varnothing$ on the same frame $p$ fails, so $F\not\models p$. **Validity in one model does not imply frame validity.** For S5, restrict to frames where $R$ is an equivalence relation; $\models_{S5}\varphi$ means validity on every such frame.

**Vacuous truth**: if $w$ has **no** successor, every $K\varphi$ (even $K\bot$) is true at $w$.`,
          keyPoints: [
            'M = (W, R, V); atoms are true at w iff w ∈ V(p); connectives are evaluated at the same world.',
            'Kφ (□φ) at w: φ at EVERY R-successor of w. ◇φ = ¬□¬φ: φ at SOME successor.',
            'No successors → □φ vacuously true and ◇φ false.',
            'Truth at a world < validity in a model (all worlds) < validity on a frame (all worlds, all valuations).'
          ]
        },
        labId: 'kripke-lab',
        examPitfalls: [
          'A world with no successor makes □p TRUE (vacuously) and ◇p FALSE. This is TD question 1.3.',
          '“M ⊨ φ” does not establish general validity: you must quantify over all valuations (frame) or all frames (class).'
        ],
        checkpoints: [
          {
            id: 'cp-3-3-1-1',
            question: 'World w has no accessible world at all. Which is true at w?',
            type: 'single',
            options: ['□p is true and ◇p is false', '□p is false and ◇p is true', 'Both are false', 'Both are true'],
            correctAnswers: [0],
            explanation: '□p quantifies universally over an empty set (vacuously true); ◇p needs an existing successor where p holds (false).',
            difficulty: 'intermediate',
            sourceSlide: 17
          },
          {
            id: 'cp-3-3-1-2',
            question: 'Validity on a frame F = (W, R) means:',
            type: 'single',
            options: [
              'True at every world under every valuation on that frame',
              'True at the actual world under one valuation',
              'True at some world of some model',
              'True at every world of one particular model'
            ],
            correctAnswers: [0],
            explanation: 'Slide 18: on a frame, the valuation and the world vary; only (W, R) is fixed.',
            difficulty: 'foundation',
            sourceSlide: 18
          }
        ]
      }),
      L({
        id: 'lesson-3-3-2',
        moduleId: 'mod-3-3',
        deck: 6,
        title: 'S5 Knowledge: Indistinguishability as an Equivalence Relation',
        sourcePages: [19, 20, 21, 22],
        summary: 'In S5 epistemic models, w ∼ᵢ v means agent i receives the same information in both worlds: an equivalence relation (reflexive, symmetric, transitive). The agent knows φ iff φ holds throughout its equivalence class.',
        understand: {
          overview: 'Write w ∼ᵢ v when agent i cannot distinguish w from v. Knowledge is truth in every indistinguishable world.',
          detailedExplanation: r`### Epistemic model (slide 19)
$$\mathcal M=(W,\{\sim_i\}_{i\in N},V),\qquad \mathcal M,w\models K_i\varphi\iff\forall v,\ (w\sim_iv\Rightarrow\mathcal M,v\models\varphi)$$
A **pointed model** $(\mathcal M,w)$ fixes where we evaluate. **How to check $K_i\varphi$**: list the worlds indistinguishable from the current one; check $\varphi$ at each; **one counterexample makes $K_i\varphi$ false.**

### Equivalence relations (slide 20)
$R\subseteq A\times A$ is an equivalence relation if:
- **Reflexive**: $\forall x\ R(x,x)$.
- **Symmetric**: $\forall x,y\ (R(x,y)\Rightarrow R(y,x))$.
- **Transitive**: $\forall x,y,z\ ((R(x,y)\land R(y,z))\Rightarrow R(x,z))$.

Same parity on $\{1..6\}$: classes $O=\{1,3,5\}$, $E=\{2,4,6\}$, $R=(O\times O)\cup(E\times E)$. The class $[x]_R=\{y: R(x,y)\}$; classes **partition** $A$; the quotient set is $A/R=\{\{1,3,5\},\{2,4,6\}\}$.

### Why indistinguishability is an equivalence (slide 21)
If $o_i(w)$ is $i$'s observation, define $w\sim_iv\iff o_i(w)=o_i(v)$. Equality of observations is reflexive, symmetric and transitive. Two coins, only the first visible: $[HH]=[HT]=\{HH,HT\}$, $[TH]=[TT]=\{TH,TT\}$. At $HH$ the agent knows the first coin is heads but not the second.

### Worked example (slide 22)
$p$: "the key is in the drawer", $q$: "the door is locked". $W=\{w_1,w_2,w_3\}$, $V(p)=\{w_1,w_2\}$, $V(q)=\{w_1,w_3\}$, classes $\{w_1,w_2\}$ and $\{w_3\}$. At $w_1$:
- $K_ip$ **true** ($p$ at $w_1$ and $w_2$);
- $K_iq$ **false** ($w_2$ has $\neg q$);
- $K_i\neg q$ **false** ($w_1$ has $q$).
So $\neg K_iq\land\neg K_i\neg q$: **the agent does not know whether $q$**.`,
          keyPoints: [
            'S5: ∼ᵢ is an equivalence relation (reflexive, symmetric, transitive) = a partition into information classes.',
            'Kᵢφ at w ⟺ φ holds at every world of w’s class; one counterexample falsifies it.',
            'w ∼ᵢ v iff oᵢ(w) = oᵢ(v): same observation.',
            '“Does not know whether q”: ¬Kᵢq ∧ ¬Kᵢ¬q.'
          ]
        },
        labId: 'kripke-lab#key-door',
        checkpoints: [
          {
            id: 'cp-3-3-2-1',
            question: 'Slide 22 model, at w₁ (classes {w₁, w₂}, {w₃}; p at w₁, w₂; q at w₁, w₃). Which is true?',
            type: 'single',
            options: ['K_i p ∧ ¬K_i q ∧ ¬K_i ¬q', 'K_i q', 'K_i ¬q', '¬K_i p'],
            correctAnswers: [0],
            explanation: 'p holds at both accessible worlds; q fails at w₂ and ¬q fails at w₁.',
            difficulty: 'foundation',
            sourceSlide: 22
          },
          {
            id: 'cp-3-3-2-2',
            question: 'Which three properties make a relation an equivalence relation?',
            type: 'single',
            options: ['Reflexive, symmetric, transitive', 'Serial, transitive, Euclidean', 'Reflexive, serial, symmetric', 'Irreflexive, transitive, total'],
            correctAnswers: [0],
            explanation: 'Slide 20. (Serial, transitive, Euclidean characterizes KD45 belief frames.)',
            difficulty: 'foundation',
            sourceSlide: 20
          }
        ]
      }),
      L({
        id: 'lesson-3-3-3',
        moduleId: 'mod-3-3',
        deck: 6,
        title: 'Model-Checking Exercises: Two Agents, and Building a Model',
        sourcePages: [23, 24, 25],
        summary: 'Agent a confuses worlds in the same row, b in the same column. At w₁: Kₐp true, K_bq true, Kₐq false, ¬Kₐq true, Kₐ¬q false, KₐK_bq false. Building a model for given knowledge: accessible worlds must satisfy every known formula, with a witness for every ¬K.',
        understand: {
          overview: 'Model checking means evaluating formulas at worlds by applying the truth clauses, inside-out, and nested modalities world by world.',
          detailedExplanation: r`### Exercise: what do a and b know? (slide 23)
$W=\{w_1,w_2,w_3,w_4\}$, $V(p)=\{w_1,w_2\}$, $V(q)=\{w_1,w_3\}$. $a$ cannot distinguish worlds in the same **row** ($w_1\sim_aw_2$, $w_3\sim_aw_4$); $b$ in the same **column** ($w_1\sim_bw_3$, $w_2\sim_bw_4$). Reflexive loops everywhere.

| # | Formula at $w_1$ | Value | Justification |
|---|---|---|---|
| 1 | $K_ap$ | **True** | $a$-class $\{w_1,w_2\}$, $p$ at both |
| 2 | $K_bq$ | **True** | $b$-class $\{w_1,w_3\}$, $q$ at both |
| 3 | $K_aq$ | **False** | counterexample $w_2$ ($\neg q$) |
| 4 | $\neg K_aq$ | **True** | negation of 3 |
| 5 | $K_a\neg q$ | **False** | counterexample $w_1$ ($q$) |
| 6 | $K_aK_bq$ | **False** | at $w_2$, $b$-class $\{w_2,w_4\}$ has no $q$, so $K_bq$ fails at $w_2$ |

Method for nested modalities: evaluate the inner $K_bq$ **at each $a$-accessible world** ($w_1$: true, $w_2$: false), then apply $K_a$.

### Exercise: construct a model (slides 24–25)
$\Sigma_1=\{K(p\Rightarrow q),\ \neg q,\ p\lor r,\ \neg Ks\}$, $\Gamma=\Sigma_1\cup\{K(\bigwedge\Sigma_1)\}$: the agent knows every formula of $\Sigma_1$. Requirements for every world $v$ accessible from $w_0$:
- $\neg q$ holds at every accessible world; with $K(p\Rightarrow q)$, $p$ must be false there too ($p\Rightarrow q$ and $\neg q$ give $\neg p$);
- $p\lor r$ with $\neg p$ forces $r$ everywhere accessible;
- $\neg Ks$ known everywhere: **every** accessible world must see an $s$-false world → in an equivalence class it suffices that **one** world of the class has $\neg s$.

One solution: $W=\{w_0,w_1\}$, $R=W\times W$ (one class), $V(p)=\varnothing$, $V(q)=\varnothing$, $V(r)=\{w_0,w_1\}$, $V(s)=\{w_1\}$. Then $\neg s$ at $w_0$ gives $\neg Ks$ at both worlds, so $K\neg Ks$ holds at $w_0$ (it is $K$ of something true throughout the class). Checking: $K(p\Rightarrow q)$ ✓ (p false everywhere), $K\neg q$ ✓, $K(p\lor r)$ ✓, $K\neg Ks$ ✓. (A one-world model also works if $s$ is false there.)`,
          keyPoints: [
            'At w₁: Kₐp ✓, K_bq ✓, Kₐq ✗ (w₂), ¬Kₐq ✓, Kₐ¬q ✗ (w₁), KₐK_bq ✗ (K_bq fails at w₂).',
            'For a false Kφ, give an accessible counterexample world.',
            'For nested KₐK_bφ: evaluate K_bφ at each a-accessible world first.',
            'To build a model satisfying K-facts: every accessible world must satisfy them; ¬Kφ needs an accessible ¬φ witness.'
          ]
        },
        labId: 'kripke-lab#two-agents',
        examPitfalls: ['K_aK_bq is not K_bq: you must check K_bq at EVERY a-accessible world, including ones different from the actual world.'],
        checkpoints: [
          {
            id: 'cp-3-3-3-1',
            question: 'In the slide 23 model (a: rows, b: columns), is K_a K_b q true at w₁?',
            type: 'single',
            options: ['False: at w₂ (a-accessible), b considers w₄ where q is false', 'True: q holds at w₁', 'True: K_b q holds at w₁', 'Undefined'],
            correctAnswers: [0],
            explanation: 'K_a needs K_b q at w₁ and w₂. At w₂, b’s class {w₂, w₄} contains no q-world, so K_b q fails there.',
            difficulty: 'advanced',
            sourceSlide: 23
          },
          {
            id: 'cp-3-3-3-2',
            question: 'Same model: which formulas are true at w₁? (Select all.)',
            type: 'multiple',
            options: ['K_a p', 'K_b q', '¬K_a q', 'K_a ¬q'],
            correctAnswers: [0, 1, 2],
            explanation: 'K_a p and K_b q hold; K_a q fails at w₂ so ¬K_a q holds; K_a ¬q fails at w₁.',
            difficulty: 'intermediate',
            sourceSlide: 23
          }
        ]
      })
    ]
  },
  // =====================================================================
  {
    id: 'mod-3-4',
    courseId: 'course-3',
    title: 'Module 3.4: Frame Properties and Correspondence Theorems',
    description: 'Reflexivity ↔ T, transitivity ↔ 4, symmetry ↔ B, Euclideanness ↔ 5, and axiom K valid on every frame.',
    sourcePagesRange: 'Part 3.1 · Slides 26–37',
    lessons: [
      L({
        id: 'lesson-3-4-1',
        moduleId: 'mod-3-4',
        deck: 6,
        title: 'Exercises: Reflexivity, Transitivity, Symmetry, Euclideanness',
        sourcePages: [26, 27, 28, 29, 30],
        summary: 'Reflexive frames make Kφ ⇒ φ (T) hold; transitive frames make Kφ ⇒ KKφ (4) hold; symmetric frames make φ ⇒ K¬K¬φ (B) hold; Euclidean frames make ¬Kφ ⇒ K¬Kφ (5) hold. Equivalence = reflexive + symmetric + transitive = reflexive + transitive + Euclidean.',
        understand: {
          overview: 'Each frame property guarantees one principle about knowledge. The exercises check instances in small models before the general proofs.',
          detailedExplanation: r`### Reflexivity and T (slide 26)
$W=\{a,b,c\}$, $V(p)=\{b,c\}$, $R=\{(a,a),(b,b),(c,c),(a,b),(b,c)\}$.
| World | Accessible | $p$ | $Kp$ |
|---|---|---|---|
| $a$ | $\{a,b\}$ | F | **F** ($a$ itself) |
| $b$ | $\{b,c\}$ | T | **T** |
| $c$ | $\{c\}$ | T | **T** |
No world has $Kp$ true and $p$ false: the self-loop puts $w$ among its own successors, so $K\varphi$ at $w$ forces $\varphi$ at $w$. **T: $K\varphi\Rightarrow\varphi$.** Remove $(a,a)$: now $a$ sees only $b$, so $Kp$ is true at $a$ while $p$ is false: T fails.

### Transitivity and 4 (slide 27, model A)
$R_A=\{(a,b),(a,c),(b,c),(c,c)\}$, $V_A(p)=\{b,c\}$: $Kp$ and $KKp$ are **true at a, b, c**. Argument: if $K\varphi$ at $w$ and $wRvRu$, transitivity gives $wRu$, so $\varphi$ at $u$; hence $K\varphi$ at every $v$, i.e. $KK\varphi$. **4: $K\varphi\Rightarrow KK\varphi$** (positive introspection).

### Symmetry and B (slide 27, model B)
$R_B=\{(a,b),(b,a),(b,c),(c,b)\}$, $V_B(p)=\{a,c\}$:
| World | $p$ | $K\neg p$ | $K\neg K\neg p$ |
|---|---|---|---|
| $a$ | T | T (sees only $b$) | T |
| $b$ | F | F (sees $a$, $c$) | F |
| $c$ | T | T | T |
If $\varphi$ at $w$ and $wRv$, symmetry gives $vRw$, so $K\neg\varphi$ cannot hold at $v$. **B: $\varphi\Rightarrow K\neg K\neg\varphi$.**

### Euclideanness and 5 (slides 28–30)
**Euclidean**: $\forall x,y,z\ ((xRy\land xRz)\Rightarrow yRz)$: two successors of the same world are related (y and z may be equal, so successors also loop).
$$\text{equivalence}\iff\text{reflexive+symmetric+transitive}\iff\text{reflexive+transitive+Euclidean}$$
- Symmetric + transitive ⇒ Euclidean: from $xRy$, symmetry gives $yRx$; compose with $xRz$ by transitivity: $yRz$.
- Reflexive + Euclidean ⇒ symmetric: from $xRy$ and $xRx$, Euclideanness gives $yRx$.
Keep them distinct: **transitivity completes a chain** $xRy,yRz$; **Euclideanness connects successors sharing a source** $xRy,xRz$.

Slide 30 model: $W=\{a,b,c,d\}$, $V(p)=\{b,d\}$, $R=\{(a,b),(a,c),(b,b),(b,c),(c,b),(c,c),(d,d)\}$.
| World | $p$ | $Kp$ | $\neg Kp$ | $K\neg Kp$ |
|---|---|---|---|---|
| $a$ | F | F | T | **T** |
| $b$ | T | F | T | **T** |
| $c$ | F | F | T | **T** |
| $d$ | T | T | F | F |
Whenever $\neg Kp$ is true, $K\neg Kp$ is true. **5: $\neg K\varphi\Rightarrow K\neg K\varphi$** (negative introspection): the counterexample $u$ to $\varphi$ seen from $w$ is also seen from every successor $v$ of $w$.`,
          keyPoints: [
            'Reflexive ⇒ T: Kφ ⇒ φ (knowledge is truthful).',
            'Transitive ⇒ 4: Kφ ⇒ KKφ (positive introspection).',
            'Symmetric ⇒ B: φ ⇒ K¬K¬φ.',
            'Euclidean ⇒ 5: ¬Kφ ⇒ K¬Kφ (negative introspection).',
            'Equivalence ⟺ reflexive + symmetric + transitive ⟺ reflexive + transitive + Euclidean.'
          ]
        },
        labId: 'kripke-lab#reflexive',
        examPitfalls: [
          'Euclidean (xRy ∧ xRz ⇒ yRz) is not transitivity (xRy ∧ yRz ⇒ xRz): different shapes.',
          'Checking a formula in ONE model only checks an instance; validity on a class of frames needs the general argument with arbitrary worlds and valuations.'
        ],
        checkpoints: [
          {
            id: 'cp-3-4-1-1',
            question: 'Slide 26 model without the loop (a, a): what happens at a?',
            type: 'single',
            options: ['Kp is true but p is false, so T fails', 'Kp is false, so T still holds', 'p becomes true', 'Nothing changes'],
            correctAnswers: [0],
            explanation: 'a then only sees b, where p holds: Kp is true at a while p is false at a.',
            difficulty: 'intermediate',
            sourceSlide: 26
          },
          {
            id: 'cp-3-4-1-2',
            question: 'Which property is defined by ∀x,y,z ((xRy ∧ xRz) ⇒ yRz)?',
            type: 'single',
            options: ['Euclideanness', 'Transitivity', 'Symmetry', 'Seriality'],
            correctAnswers: [0],
            explanation: 'Slide 28: two worlds accessible from the same world must be related.',
            difficulty: 'foundation',
            sourceSlide: 28
          },
          {
            id: 'cp-3-4-1-3',
            question: 'In the slide 30 model, at which world is ¬Kp false?',
            type: 'single',
            options: ['d', 'a', 'b', 'c'],
            correctAnswers: [0],
            explanation: 'd only sees itself and p holds at d, so Kp is true at d. At a, b, c, the world c (¬p) is accessible.',
            difficulty: 'intermediate',
            sourceSlide: 30
          }
        ]
      }),
      L({
        id: 'lesson-3-4-2',
        moduleId: 'mod-3-4',
        deck: 6,
        title: 'Correspondence Theorems: Proving T, 4, B and 5',
        sourcePages: [31, 32, 33, 34],
        summary: 'For each axiom, F ⊨ axiom ⟺ property of R. Direction 1: assume the axiom fails at w and derive that the property fails. Direction 2: if the property fails, build a countermodel with V(p) = R(w) (or {w}, or R(v)).',
        understand: {
          overview: 'Correspondence theorems prove frame validity in both directions. This is a core exam skill: “prove the validity of modal axioms with respect to properties of accessibility relations”.',
          detailedExplanation: r`Notation: $R(w)=\{v: wRv\}$. Each proof has two directions, both by contraposition.

### T ⟺ reflexivity (slide 31)
**(⇐) property ⇒ validity.** Suppose $\mathcal M,w\models Kp$ but $\mathcal M,w\not\models p$. Every successor of $w$ satisfies $p$ but $w$ does not, so $w\notin R(w)$: $\neg wRw$. Contraposition: every reflexive frame validates T.
**(⇒) validity ⇒ property.** If $\neg wRw$ for some $w$, set $V(p)=R(w)$. Then $Kp$ holds at $w$ but $w\notin R(w)$ so $p$ is false at $w$: T fails. *Countermodel idea: $p$ true at every accessible world, false at the actual world; a missing self-loop makes it possible.*

### 4 ⟺ transitivity (slide 32)
**(⇐)** If $Kp$ at $w$ and $KKp$ fails, some $v$ with $wRv$ has $\neg Kp$, so some $u$ with $vRu$ has $\neg p$. As $Kp$ at $w$, $u\notin R(w)$: $wRv$, $vRu$, $\neg wRu$, transitivity fails.
**(⇒)** Given $wRv$, $vRu$, $\neg wRu$, set $V(p)=R(w)$: $Kp$ at $w$; $p$ false at $u$, so $Kp$ false at $v$, so $KKp$ false at $w$. *A world reached in two steps escapes the worlds reached in one step.*

### B ⟺ symmetry (slide 33)
**(⇐)** If $p$ at $w$ and $K\neg K\neg p$ fails, some $v$ with $wRv$ has $K\neg p$; since $p$ at $w$, $\neg vRw$: symmetry fails.
**(⇒)** Given $wRv$, $\neg vRw$, set $V(p)=\{w\}$: $p$ at $w$; $v$ cannot see $w$, so $K\neg p$ at $v$; hence $K\neg K\neg p$ fails at $w$.

### 5 ⟺ Euclideanness (slide 34)
**(⇐)** If $\neg Kp$ at $w$: some $u$, $wRu$, $\neg p$. If $K\neg Kp$ fails: some $v$, $wRv$, $Kp$ at $v$. Then $v$ cannot see $u$: $wRv$, $wRu$, $\neg vRu$.
**(⇒)** Given $wRv$, $wRu$, $\neg vRu$, set $V(p)=R(v)$: $p$ false at $u$ so $\neg Kp$ at $w$; $Kp$ at $v$, so $K\neg Kp$ fails at $w$.

### Template to reuse in the exam
1. State: "$R$ has property X $\iff F\models$ axiom".
2. (⇐) Assume the axiom is false at some $w$ in some model; unfold the truth clauses to find witnesses; show they violate X.
3. (⇒) Assume X fails, take its witnesses, **choose the valuation** ($R(w)$, $\{w\}$ or $R(v)$), and show the axiom fails.`,
          keyPoints: [
            'Each correspondence is proved in two directions, both by contraposition.',
            'T: countermodel V(p) = R(w) on a world without self-loop.',
            '4: witnesses wRv, vRu, ¬wRu; V(p) = R(w).',
            'B: witnesses wRv, ¬vRw; V(p) = {w}.',
            '5: witnesses wRv, wRu, ¬vRu; V(p) = R(v).'
          ]
        },
        labId: 'proof-lab',
        formulas: [
          {
            name: 'Correspondence table',
            latex: r`\begin{array}{ll}\text{T: }K\varphi\Rightarrow\varphi & \text{reflexive}\\ \text{4: }K\varphi\Rightarrow KK\varphi & \text{transitive}\\ \text{B: }\varphi\Rightarrow K\neg K\neg\varphi & \text{symmetric}\\ \text{5: }\neg K\varphi\Rightarrow K\neg K\varphi & \text{Euclidean}\\ \text{D: }K\varphi\Rightarrow\neg K\neg\varphi & \text{serial}\end{array}`,
            explanation: 'Each axiom is valid on a frame iff its accessibility relation has the matching property.',
            variables: []
          }
        ],
        examPitfalls: [
          'Prove BOTH directions when the question says “iff”. The direction “property ⇒ axiom valid” alone is the soundness half.',
          'Choose the countermodel valuation from the witnesses: R(w) for T and 4, {w} for B, R(v) for 5.'
        ],
        checkpoints: [
          {
            id: 'cp-3-4-2-1',
            question: 'To show that validity of 4 forces transitivity, which valuation is chosen given wRv, vRu, ¬wRu?',
            type: 'single',
            options: ['V(p) = R(w)', 'V(p) = {w}', 'V(p) = R(v)', 'V(p) = W'],
            correctAnswers: [0],
            explanation: 'Slide 32: p true on R(w) makes Kp true at w; u ∉ R(w) falsifies Kp at v, hence KKp at w.',
            difficulty: 'advanced',
            sourceSlide: 32
          },
          {
            id: 'cp-3-4-2-2',
            question: 'Which axiom corresponds to Euclidean frames?',
            type: 'single',
            options: ['5: ¬Kφ ⇒ K¬Kφ', '4: Kφ ⇒ KKφ', 'T: Kφ ⇒ φ', 'B: φ ⇒ K¬K¬φ'],
            correctAnswers: [0],
            explanation: 'Slide 34: R Euclidean ⟺ F ⊨ ¬Kp ⇒ K¬Kp.',
            difficulty: 'foundation',
            sourceSlide: 34
          },
          {
            id: 'cp-3-4-2-3',
            question: 'Proving “reflexive ⇒ T valid” by contraposition, you assume Kp true and p false at w. What follows?',
            type: 'single',
            options: ['w is not one of its own successors: ¬wRw', 'w has no successors', 'R is transitive', 'p is true everywhere'],
            correctAnswers: [0],
            explanation: 'All successors satisfy p and w does not, so w ∉ R(w).',
            difficulty: 'intermediate',
            sourceSlide: 31
          }
        ]
      }),
      L({
        id: 'lesson-3-4-3',
        moduleId: 'mod-3-4',
        deck: 6,
        title: 'Axiom K: Valid on Every Frame',
        sourcePages: [35, 36, 37],
        summary: 'K(φ ⇒ ψ) ⇒ (Kφ ⇒ Kψ) holds on every Kripke frame, with no condition on R: both premises hold at every successor, so the conclusion does too (even vacuously with no successors).',
        understand: {
          overview: 'If the agent knows an implication and knows its premise, must it know the conclusion? Yes, on every frame.',
          detailedExplanation: r`### The model check (slide 35)
$W=\{a,b,c,d\}$, $R=\{(a,b),(a,c),(b,b),(c,c),(d,d)\}$, $V(p)=\{b,d\}$, $V(q)=\{c,d\}$.
| World | $K(p\Rightarrow q)$ | $Kp$ | $Kq$ | Axiom K |
|---|---|---|---|---|
| $a$ | F ($b$: $p$, $\neg q$) | F ($c$) | F ($b$) | T |
| $b$ | F | T | F | T |
| $c$ | T | F | T | T |
| $d$ | T | T | T | T |

### Trying to build a countermodel
To falsify K at $w$ we need $K(p\Rightarrow q)$, $Kp$ and $\neg Kq$ at $w$. The last gives a successor $v$ with $\neg q$; the first two give $p\Rightarrow q$ and $p$ at that same $v$, hence $q$: contradiction. **No countermodel exists.**

### Semantic proof (slide 37)
For arbitrary $\varphi,\psi$: $\models K(\varphi\Rightarrow\psi)\Rightarrow(K\varphi\Rightarrow K\psi)$, **with no restriction on $R$**. Suppose it fails at $w$; then $\mathcal M,w\models K(\varphi\Rightarrow\psi)$, $\mathcal M,w\models K\varphi$, $\mathcal M,w\not\models K\psi$. So some $v$ with $wRv$ has $\neg\psi$, but $\varphi\Rightarrow\psi$ and $\varphi$ hold at $v$, so $\psi$ at $v$: contradiction. If $w$ has no successor, all three $K$ statements are vacuously true and the axiom still holds.

This is why K is the base of every **normal** modal logic (K, KD45, S5…). It fails only in non-normal (neighborhood) semantics, see TD exercise 4.3.`,
          keyPoints: [
            'Axiom K: K(φ ⇒ ψ) ⇒ (Kφ ⇒ Kψ), knowledge is closed under known implication.',
            'Valid on EVERY Kripke frame: no property of R is needed.',
            'Proof: a successor falsifying ψ would satisfy φ ⇒ ψ and φ, hence ψ: contradiction.',
            'K can fail in neighborhood semantics (non-normal modalities).'
          ]
        },
        labId: 'kripke-lab#axiom-k',
        examPitfalls: ['Axiom K does not depend on reflexivity, transitivity, symmetry or Euclideanness. Saying it needs any of them is a classic mistake.'],
        checkpoints: [
          {
            id: 'cp-3-4-3-1',
            question: 'On which frames is axiom K valid?',
            type: 'single',
            options: ['On every Kripke frame', 'Only on reflexive frames', 'Only on equivalence frames', 'Only on serial frames'],
            correctAnswers: [0],
            explanation: 'Slide 37: no restriction on the accessibility relation is required.',
            difficulty: 'foundation',
            sourceSlide: 37
          }
        ]
      })
    ]
  },
  // =====================================================================
  {
    id: 'mod-3-5',
    courseId: 'course-3',
    title: 'Module 3.5: The S5 System and Necessitation',
    description: 'Soundness and completeness, the Hilbert system KT45 (PC, K, T, 4, 5, MP, Nec, US), derived theorems, and why p ⇒ Kp is not valid.',
    sourcePagesRange: 'Part 3.1 · Slides 38–45',
    lessons: [
      L({
        id: 'lesson-3-5-1',
        moduleId: 'mod-3-5',
        deck: 6,
        title: 'The S5 Hilbert System: Axioms, Rules, Soundness and Completeness',
        sourcePages: [38, 39, 40, 41],
        summary: 'S5 = PC + K + T + 4 + 5 with Modus Ponens, Necessitation (and Uniform Substitution). It is sound and complete for equivalence frames: ⊢_S5 φ ⟺ ⊨_S5 φ. The symmetry formula φ ⇒ K¬K¬φ is derived from T and 5.',
        understand: {
          overview: 'An axiomatic system derives formulas from axioms using rules. The S5 system matches exactly the formulas valid on equivalence frames.',
          detailedExplanation: r`### Syntax vs semantics (slide 38)
- **Semantic validity** $\models_{S5}\varphi$: true at every world, under every valuation, on every frame whose relation is an equivalence.
- **Syntactic derivability** $\vdash_{S5}\varphi$: there is a finite Hilbert proof ending in $\varphi$.
- **Soundness**: every provable formula is valid ($\vdash\ \Rightarrow\ \models$). **Completeness**: every valid formula is provable ($\models\ \Rightarrow\ \vdash$). For S5: $\vdash_{S5}\varphi\iff\models_{S5}\varphi$.

### The S5 system (slide 39), presentation KT45
| Name | Axiom | Semantics |
|---|---|---|
| PC | all instances of classical tautologies | classical truth conditions |
| **K** | $K(\varphi\Rightarrow\psi)\Rightarrow(K\varphi\Rightarrow K\psi)$ | all Kripke frames |
| **T** | $K\varphi\Rightarrow\varphi$ | reflexivity |
| **4** | $K\varphi\Rightarrow KK\varphi$ | transitivity |
| **5** | $\neg K\varphi\Rightarrow K\neg K\varphi$ | Euclideanness |

**Rules**
- **Modus Ponens (MP)**: from $\varphi$ and $\varphi\Rightarrow\psi$ infer $\psi$.
- **Necessitation (Nec)**: from $\vdash_{S5}\varphi$ infer $\vdash_{S5}K\varphi$, **only for theorems** (no undischarged assumptions).
- **Uniform Substitution (US)**: from $\vdash\varphi$ infer $\vdash\varphi[p:=\psi]$. With axiom *schemes* (as on the slides) US is built in; with axioms stated for atoms, US is the explicit third rule. The exam asks for **MP, US and Nec**.

Reflexive + transitive + Euclidean characterizes equivalence relations, so B (symmetry) is a **derived** theorem. (Note KT45 = KTB4 = KT5: 4 is in fact derivable from T and 5.)

### Deriving B (slide 40)
Abbreviate $A:=\varphi$, $B:=\neg K\neg\varphi$, $C:=K\neg K\neg\varphi$.
| # | Formula | Justification |
|---|---|---|
| 1 | $K\neg\varphi\Rightarrow\neg\varphi$ | T with $\neg\varphi$ for $\varphi$ |
| 2 | $(K\neg\varphi\Rightarrow\neg\varphi)\Rightarrow(A\Rightarrow B)$ | PC: contraposition |
| 3 | $A\Rightarrow B$ | MP 1, 2 |
| 4 | $B\Rightarrow C$ | 5 with $\neg\varphi$ for $\varphi$ |
| 5 | $(A\Rightarrow B)\Rightarrow((B\Rightarrow C)\Rightarrow(A\Rightarrow C))$ | PC: composition |
| 6 | $(B\Rightarrow C)\Rightarrow(A\Rightarrow C)$ | MP 3, 5 |
| 7 | $A\Rightarrow C$, i.e. $\varphi\Rightarrow K\neg K\neg\varphi$ | MP 4, 6 |
Uses only PC, T, 5 and MP, mirroring "reflexive + Euclidean ⇒ symmetric".

### Exercises (slide 41), solutions
1. $\vdash K(p\lor\neg p)$: (1) $p\lor\neg p$ PC; (2) $K(p\lor\neg p)$ Nec 1.
2. $\vdash K(p\land q)\Rightarrow Kp$: (1) $(p\land q)\Rightarrow p$ PC; (2) $K((p\land q)\Rightarrow p)$ Nec 1; (3) $K((p\land q)\Rightarrow p)\Rightarrow(K(p\land q)\Rightarrow Kp)$ K; (4) $K(p\land q)\Rightarrow Kp$ MP 2, 3.
3. $\vdash Kp\Leftrightarrow KKp$: $Kp\Rightarrow KKp$ is 4; $KKp\Rightarrow Kp$ is T with $Kp$ for $\varphi$; combine with the PC tautology $(a\Rightarrow b)\Rightarrow((b\Rightarrow a)\Rightarrow(a\Leftrightarrow b))$ and MP twice.
4. $\vdash\neg Kp\Leftrightarrow K\neg Kp$: $\Rightarrow$ is 5; $\Leftarrow$ is T with $\neg Kp$ for $\varphi$: $K\neg Kp\Rightarrow\neg Kp$; combine as in 3.

**Proof-writing rule**: a semantic explanation is not a Hilbert derivation. Each line must be an axiom instance or follow by MP or Nec, and you may derive $K\varphi$ by Nec **only if $\varphi$ is already a theorem**.`,
          keyPoints: [
            'S5 = PC + K + T + 4 + 5; rules: Modus Ponens, Necessitation (theorems only), Uniform Substitution.',
            'Soundness ⊢ ⇒ ⊨; completeness ⊨ ⇒ ⊢; S5 is sound and complete for equivalence frames.',
            'B (φ ⇒ K¬K¬φ) is derivable from T and 5 in 7 lines.',
            'K(p ∧ q) ⇒ Kp: PC, Nec, K, MP. Kp ⟺ KKp: 4 and T[Kp/φ]. ¬Kp ⟺ K¬Kp: 5 and T[¬Kp/φ].'
          ]
        },
        labId: 'proof-lab',
        formulas: [
          {
            name: 'Inference rules of S5',
            latex: r`\text{MP: }\frac{\varphi\quad \varphi\Rightarrow\psi}{\psi}\qquad \text{Nec: }\frac{\vdash\varphi}{\vdash K\varphi}\qquad \text{US: }\frac{\vdash\varphi}{\vdash\varphi[p:=\psi]}`,
            explanation: 'Modus ponens, necessitation (only on theorems) and uniform substitution (replace every occurrence of an atom by the same formula).',
            variables: []
          }
        ],
        examPitfalls: [
          'Necessitation applies to THEOREMS only. From the assumption p you cannot infer Kp.',
          'When defining S5, list axioms (K, T, 4, 5 + PC) AND rules (MP, Nec, US), and state soundness/completeness for equivalence frames.'
        ],
        checkpoints: [
          {
            id: 'cp-3-5-1-1',
            question: 'Which list defines the S5 system?',
            type: 'single',
            options: [
              'PC + K + T + 4 + 5, with Modus Ponens, Necessitation and Uniform Substitution',
              'PC + K + D + 4 + 5, with Modus Ponens only',
              'PC + T + B, with Necessitation only',
              'K + 4 + 5 without propositional tautologies'
            ],
            correctAnswers: [0],
            explanation: 'Slide 39 (KT45). KD45 (with D) is the belief system.',
            difficulty: 'foundation',
            sourceSlide: 39
          },
          {
            id: 'cp-3-5-1-2',
            question: 'Derive K(p ∧ q) ⇒ Kp. Which sequence of justifications is correct?',
            type: 'single',
            options: ['PC, Nec, K, MP', 'T, 4, MP', 'Nec, PC, MP', 'PC, MP, Nec, T'],
            correctAnswers: [0],
            explanation: '(p∧q)⇒p by PC; necessitate it; instantiate K; detach with MP.',
            difficulty: 'intermediate',
            sourceSlide: 41
          },
          {
            id: 'cp-3-5-1-3',
            question: 'What does completeness of S5 state?',
            type: 'single',
            options: ['Every formula valid on equivalence frames is provable in S5', 'Every provable formula is valid', 'Every formula is provable', 'S5 has no theorems'],
            correctAnswers: [0],
            explanation: 'Completeness: ⊨ ⇒ ⊢. Soundness is the converse direction.',
            difficulty: 'foundation',
            sourceSlide: 38
          }
        ]
      }),
      L({
        id: 'lesson-3-5-2',
        moduleId: 'mod-3-5',
        deck: 6,
        title: 'Necessitation: Knowing a Theorem vs Knowing Every Truth',
        sourcePages: [42, 43, 44, 45],
        summary: 'Nec turns theorems (true everywhere) into known theorems. It does not validate p ⇒ Kp: in W = {w, v}, R = W×W, V(p) = {w}, p is true at w but Kp is false. Truth at one world does not authorize necessitation.',
        understand: {
          overview: 'Necessitation concerns provability; the implication φ ⇒ Kφ concerns truth at a world. They are very different.',
          detailedExplanation: r`### Why Nec is sound (slide 42)
If $\vdash_{S5}\varphi$, by soundness $\models_{S5}\varphi$: $\varphi$ holds at **every world of every S5 model**, in particular at every world accessible from $w$, so $K\varphi$ holds at $w$. Example: $\vdash K(p\lor\neg p)$.

Is $\varphi\Rightarrow K\varphi$ a theorem? **No**: truth at $w$ says nothing about the other accessible worlds. A proposition can be true without the agent having enough information to know it.

> $\mathcal M,w\models\varphi$ does not establish $\vdash_{S5}\varphi$. **Truth at one world does not authorize necessitation.** (slide 43)

### Truth without knowledge (slide 44)
$W=\{w,v\}$, $R=W\times W$, $V(p)=\{w\}$.
| World | $p$ | $Kp$ | $p\Rightarrow Kp$ |
|---|---|---|---|
| $w$ | T | F | **F** |
| $v$ | F | F | T |
So $\not\models_{S5}p\Rightarrow Kp$. Also, $p$ is false at $v$, so $\not\models_{S5}p$ and by contraposition of soundness $\nvdash_{S5}p$: the premise of Nec is missing. Because $vRv$, $p$ false at $v$ forces $Kp$ false there too (axiom T at work).

### Final question (slide 45)
With $V(p)=W$: $p$ holds at both worlds, so $Kp$ becomes **true everywhere**, and $\mathcal M\models Kp$. But that is validity in **this model**, not $\vdash p$: still no Nec on $p$.`,
          keyPoints: [
            'Nec: from ⊢ φ infer ⊢ Kφ; it is sound because theorems hold at every world.',
            'φ ⇒ Kφ is NOT valid: countermodel W = {w, v}, R = W×W, V(p) = {w}.',
            'Truth at one world (or in one model) does not authorize necessitation.',
            'With V(p) = W, Kp becomes true at every world of that model.'
          ]
        },
        labId: 'kripke-lab#no-nec',
        checkpoints: [
          {
            id: 'cp-3-5-2-1',
            question: 'Is p ⇒ Kp valid in S5?',
            type: 'single',
            options: [
              'No: in W = {w, v}, R = W×W, V(p) = {w}, it is false at w',
              'Yes: by necessitation',
              'Yes: by axiom T',
              'Only on reflexive frames'
            ],
            correctAnswers: [0],
            explanation: 'Slide 44: p is true at w but the accessible world v falsifies p, so Kp is false at w.',
            difficulty: 'intermediate',
            sourceSlide: 44
          },
          {
            id: 'cp-3-5-2-2',
            question: 'Why can we not apply Necessitation to p in that model?',
            type: 'single',
            options: ['p is not a theorem (it is false at v, so not valid, so not provable)', 'Because p is an atom', 'Because R is not reflexive', 'Because Nec only applies to K-formulas'],
            correctAnswers: [0],
            explanation: 'Nec needs ⊢ p. Since p fails at v, ⊭ p, and by soundness ⊬ p.',
            difficulty: 'intermediate',
            sourceSlide: 44
          }
        ]
      })
    ]
  }
];
