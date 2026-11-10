import { Lesson, Module } from '../types';

/** Raw template tag: keeps LaTeX backslashes; \` yields a literal backtick for inline code. */
const r = (s: TemplateStringsArray, ...v: unknown[]) => String.raw(s, ...v).replace(/\\`/g, '`');
type LessonInput = Omit<Lesson, 'courseId'>;
const L = (l: LessonInput): Lesson => ({ ...l, courseId: 'course-3' });

/** Chapter 3, second half: KD45 belief, action logics (PDL, DEL, STIT, BIAT), KBE manipulation, TD. */
export const course3ModulesB: Module[] = [
  // =====================================================================
  {
    id: 'mod-3-6',
    courseId: 'course-3',
    title: 'Module 3.6: Beliefs with KD45',
    description: 'Doxastic models, serial/transitive/Euclidean frames, axioms D, 4, 5, false beliefs, and KD45 vs S5.',
    sourcePagesRange: 'Part 3.2 · Slides 1–13',
    lessons: [
      L({
        id: 'lesson-3-6-1',
        moduleId: 'mod-3-6',
        deck: 7,
        title: 'Doxastic Semantics and KD45 Frames',
        sourcePages: [1, 2, 3, 4, 5],
        summary: 'Bφ is true at w iff φ holds in every doxastic alternative R_B(w). KD45 frames are serial, transitive and Euclidean, but not necessarily reflexive, so Bφ ∧ ¬φ is satisfiable: a consistent agent can be wrong.',
        understand: {
          overview: 'How can an agent reason consistently and still be wrong about the world? Knowledge is factive (Kφ → φ); belief is not.',
          detailedExplanation: r`### Belief semantics (slide 3)
$\mathcal M=(W,R_B,V)$ with $W\neq\varnothing$, $R_B\subseteq W\times W$ and $V:W\to2^{\mathcal P}$ (here the valuation lists the atoms true at each world).
$$\mathcal M,w\models B\varphi\iff\forall v\in W\,(wR_Bv\Rightarrow\mathcal M,v\models\varphi)$$
$R_B(w)$ is the set of worlds compatible with the agent's beliefs at $w$. **The actual world need not belong to $R_B(w)$**: this allows $B\varphi\land\neg\varphi$.

### KD45 frames (slide 4)
| Property | Definition | Schema |
|---|---|---|
| **Serial** | $\forall w\,\exists v\ wR_Bv$ | **D**: $B\varphi\to\neg B\neg\varphi$ |
| **Transitive** | $(wR_Bv\land vR_Bu)\Rightarrow wR_Bu$ | **4**: $B\varphi\to BB\varphi$ |
| **Euclidean** | $(wR_Bv\land wR_Bu)\Rightarrow vR_Bu$ | **5**: $\neg B\varphi\to B\neg B\varphi$ |
Reflexivity is **not** required (self-loops are allowed).

### A consistent agent with a false belief (slide 5)
$\mathcal P=\{p,q\}$, $W=\{w,u,v\}$, actual world $w$.
| World | $V$ | $R_B$ |
|---|---|---|
| $w$ (actual) | $\varnothing$ | $\{u,v\}$ |
| $u$ | $\{p,q\}$ | $\{u,v\}$ |
| $v$ | $\{p\}$ | $\{u,v\}$ |
Every successor set is the same non-empty set: serial, transitive, Euclidean ✓.
- $\mathcal M,w\models Bp\land\neg p$: $p$ at both alternatives, false at $w$. **False belief.**
- $\mathcal M,w\models\neg Bq\land\neg B\neg q$: $q$ false at $v$, $\neg q$ false at $u$. **Not believing $q$ is not believing $\neg q$**: the agent suspends judgment.`,
          keyPoints: [
            'Bφ at w ⟺ φ at every world of R_B(w); w itself need not be in R_B(w).',
            'KD45 frames: serial (D), transitive (4), Euclidean (5); no reflexivity.',
            'Bφ ∧ ¬φ is satisfiable: beliefs can be false.',
            '¬Bq ∧ ¬B¬q: suspending judgment is possible.'
          ]
        },
        labId: 'kripke-lab#kd45',
        checkpoints: [
          {
            id: 'cp-3-6-1-1',
            question: 'Which frame property is NOT required for KD45?',
            type: 'single',
            options: ['Reflexivity', 'Seriality', 'Transitivity', 'Euclideanness'],
            correctAnswers: [0],
            explanation: 'Slide 4: KD45 frames are serial, transitive and Euclidean; reflexivity is not required, which is why beliefs can be false.',
            difficulty: 'foundation',
            sourceSlide: 4
          },
          {
            id: 'cp-3-6-1-2',
            question: 'In the slide 5 model (R_B(x) = {u, v} for all x; p at u, v; q at u only), what holds at w?',
            type: 'single',
            options: ['Bp ∧ ¬p and ¬Bq ∧ ¬B¬q', 'Kp', 'B¬q', 'Bq'],
            correctAnswers: [0],
            explanation: 'p holds at both alternatives but not at w; q fails at v and ¬q fails at u.',
            difficulty: 'intermediate',
            sourceSlide: 5
          }
        ]
      }),
      L({
        id: 'lesson-3-6-2',
        moduleId: 'mod-3-6',
        deck: 7,
        title: 'The KD45 Axioms: D, 4 and 5',
        sourcePages: [6, 7, 8, 9],
        summary: 'KD45 = PC + K_B + D_B + 4_B + 5_B with MP and theorem-only Nec. Seriality validates D (no contradictory beliefs, ¬B⊥); transitivity validates 4; Euclideanness validates 5.',
        understand: {
          overview: 'KD45 is a normal Hilbert system for belief, sound and complete for serial, transitive, Euclidean frames.',
          detailedExplanation: r`### The system (slide 6)
| Schema | Formula | Reading |
|---|---|---|
| $K_B$ | $B(\varphi\to\psi)\to(B\varphi\to B\psi)$ | distribution |
| $D_B$ | $B\varphi\to\neg B\neg\varphi$ | consistency of beliefs |
| $4_B$ | $B\varphi\to BB\varphi$ | positive introspection |
| $5_B$ | $\neg B\varphi\to B\neg B\varphi$ | negative introspection |
Rules: **MP** and **Nec (theorems only)**: $\frac{\vdash\varphi}{\vdash B\varphi}$, which does NOT assert $\varphi\to B\varphi$. Soundness and completeness: $\vdash_{KD45}\varphi$ iff $\varphi$ holds in every model on every serial, transitive, Euclidean frame.

### D ⟸ seriality (slide 7)
Take $w$ with $B\varphi$. Seriality gives some $v$ with $wR_Bv$; $\varphi$ holds at $v$, so $\neg\varphi$ fails at $v$, so $B\neg\varphi$ is false at $w$: $\neg B\neg\varphi$.
Without seriality: if $R_B(w)=\varnothing$, every universal statement is vacuously true: $Bp\land B\neg p$ holds at $w$ and D fails. **KD45 validates $\neg B\bot$**: no inconsistent beliefs, but false beliefs are allowed.

### 4 ⟸ transitivity (slide 8)
$B\varphi$ at $w$; for $wR_Bv$ and $vR_Bu$, transitivity gives $wR_Bu$, so $\varphi$ at $u$. Thus $B\varphi$ at every $v$, i.e. $BB\varphi$ at $w$. (In slide 5's model, $Bp$ and $BBp$ hold at $w$ although $p$ is false there.)

### 5 ⟸ Euclideanness (slide 9)
$\neg B\varphi$ at $w$ gives $u$ with $wR_Bu$, $\neg\varphi$. For any $v$ with $wR_Bv$, Euclideanness gives $vR_Bu$, so $\neg B\varphi$ at $v$. Hence $B\neg B\varphi$ at $w$. Check: $\neg Bq$ and $B\neg Bq$ at $w$ in slide 5's model, yet $B\neg q$ is false.

### TD 3.3: proving D and $Bp\leftrightarrow BBp$
- $Bp\to\neg B\neg p$ is **immediately** an instance of axiom D.
- $Bp\to BBp$ is axiom 4. The converse $BBp\to Bp$ is **not** immediate (there is no T for belief!). Semantic argument: for any $v$ with $wR_Bv$, Euclideanness applied to $wR_Bv$ and $wR_Bv$ gives $vR_Bv$: every alternative of $w$ sees itself. $BBp$ at $w$ gives $Bp$ at each such $v$, and since $vR_Bv$, $p$ holds at $v$. So $p$ holds on all of $R_B(w)$: $Bp$ at $w$. (Syntactically, $BB\varphi\to B\varphi$ is a KD45 theorem derived with D and 5.)`,
          keyPoints: [
            'KD45 = PC + K + D + 4 + 5 for B, with MP and Nec (theorems only).',
            'Serial ⇒ D: B is consistent, ¬B⊥; with no successor, Bp ∧ B¬p would hold vacuously.',
            'Transitive ⇒ 4 (positive introspection); Euclidean ⇒ 5 (negative introspection).',
            'BBφ → Bφ holds in KD45 but needs reasoning: Euclideanness makes every alternative reflexive.'
          ]
        },
        labId: 'proof-lab',
        examPitfalls: [
          'D needs seriality, not reflexivity. Reflexivity would validate T (Bφ → φ), making belief factive.',
          'Bp → BBp is axiom 4, but the converse is NOT an axiom of KD45; justify it semantically or derive it.'
        ],
        checkpoints: [
          {
            id: 'cp-3-6-2-1',
            question: 'Which frame property validates D: Bφ → ¬B¬φ?',
            type: 'single',
            options: ['Seriality', 'Reflexivity', 'Symmetry', 'Transitivity'],
            correctAnswers: [0],
            explanation: 'Slide 7: seriality guarantees a successor, which cannot satisfy both φ and ¬φ.',
            difficulty: 'foundation',
            sourceSlide: 7
          },
          {
            id: 'cp-3-6-2-2',
            question: 'If R_B(w) = ∅, which is true at w?',
            type: 'single',
            options: ['Bp ∧ B¬p', '¬Bp', 'B¬p is false', 'D holds'],
            correctAnswers: [0],
            explanation: 'With no doxastic alternative, every belief is vacuously true, including contradictory ones: D fails.',
            difficulty: 'intermediate',
            sourceSlide: 7
          }
        ]
      }),
      L({
        id: 'lesson-3-6-3',
        moduleId: 'mod-3-6',
        deck: 7,
        title: 'KD45 vs S5, the Minimal False-Belief Model, and Idealizations',
        sourcePages: [10, 11, 12, 13],
        summary: 'S5 adds T (reflexivity) to KD45: every S5 frame is a KD45 frame. The smallest model of Bp ∧ ¬p has two worlds: W = {w, v}, R_B = {(w,v), (v,v)}, p true at v only. KD45 idealizes logical omniscience and perfect introspection.',
        understand: {
          overview: 'Belief need not be factive. Adding axiom T to KD45 yields S5 for the same operator.',
          detailedExplanation: r`### KD45 vs S5 (slide 10)
| Feature | KD45: belief $B$ | S5: knowledge $K$ |
|---|---|---|
| Frames | serial, transitive, Euclidean | reflexive, transitive, Euclidean (equivalence) |
| Consistency | $B\varphi\to\neg B\neg\varphi$ | $K\varphi\to\neg K\neg\varphi$ |
| Positive introspection | $B\varphi\to BB\varphi$ | $K\varphi\to KK\varphi$ |
| Negative introspection | $\neg B\varphi\to B\neg B\varphi$ | $\neg K\varphi\to K\neg K\varphi$ |
| **Factivity** | $B\varphi\to\varphi$ **not valid** | $K\varphi\to\varphi$ **valid** |
| Actual world self-accessible? | not required | required |
Every S5 frame is a KD45 frame (reflexive ⇒ serial). To reason about knowledge and belief together, use two operators and two relations; an interaction such as $K\varphi\to B\varphi$ requires an extra assumption (it is an axiom of KBE).

### Exercise: construct a KD45 model (slide 11), solution
**Part 1.** One world cannot work: seriality forces $wR_Bw$ (the only world), then $Bp$ at $w$ forces $p$ at $w$, contradicting $\neg p$. Two worlds suffice:
$$W=\{w,v\},\quad R_B=\{(w,v),(v,v)\},\quad V(p)=\{v\}$$
Serial ✓ (both have a successor). Transitive ✓ ($wR_Bv,vR_Bv\Rightarrow wR_Bv$). Euclidean ✓ ($R_B(w)=R_B(v)=\{v\}$ and $vR_Bv$). At $w$: $Bp$ (only $v$, $p$ true) and $\neg p$.

**Part 2.** At both worlds $Bp$ is true.
| Formula | $w$ | $v$ |
|---|---|---|
| $Bp\to p$ | **F** | T |
| $Bp\to\neg B\neg p$ | T | T |
| $Bp\to BBp$ | T | T |
| $\neg Bp\to B\neg Bp$ | T (antecedent false) | T (antecedent false) |
The last implication is true *because its antecedent is false*. The countermodel at $w$ disproves the validity of $Bp\to p$; truth in one model does not establish validity of D, 4, 5 (those follow from the frame proofs).

### Idealizations (slide 12)
- **Logical closure**: all theorems are believed; distribution closes beliefs under MP (logical omniscience).
- **Perfect introspection**: the agent believes it has each of its beliefs and lacks each absent one.
- **Static**: no degrees of confidence and no belief change. To model an agent who misses consequences of its beliefs, relax closure (e.g. awareness, Fagin & Halpern 1987).

Appendix (slide 13): the finite Boolean Hilbert base H1, H2, R plus conjunction, disjunction and constant axioms, with MP; substitute belief formulas and add $K_B, D_B, 4_B, 5_B$ and theorem-only Nec.`,
          keyPoints: [
            'S5 = KD45 + T; knowledge is factive, belief is not.',
            'Minimal false belief: W = {w, v}, R_B = {(w,v),(v,v)}, V(p) = {v}; one world is impossible by seriality.',
            'At w: Bp → p is false, D, 4, 5 are true (5 vacuously).',
            'KD45 idealizes: logical omniscience, perfect introspection, static beliefs.'
          ]
        },
        labId: 'kripke-lab#kd45-min',
        checkpoints: [
          {
            id: 'cp-3-6-3-1',
            question: 'What is the minimum number of worlds for a KD45 pointed model of Bp ∧ ¬p?',
            type: 'single',
            options: ['2', '1', '3', '4'],
            correctAnswers: [0],
            explanation: 'One world would have to see itself (seriality), forcing p. With W = {w, v}, R_B = {(w,v),(v,v)}, V(p) = {v}, it works.',
            difficulty: 'intermediate',
            sourceSlide: 11
          },
          {
            id: 'cp-3-6-3-2',
            question: 'Which formula is valid in S5 but not in KD45 (for the same operator)?',
            type: 'single',
            options: ['□φ → φ', '□φ → □□φ', '¬□φ → □¬□φ', '□φ → ¬□¬φ'],
            correctAnswers: [0],
            explanation: 'Factivity (T) needs reflexivity, which KD45 does not require. The other three are valid in both.',
            difficulty: 'foundation',
            sourceSlide: 10
          }
        ]
      })
    ]
  },
  // =====================================================================
  {
    id: 'mod-3-7',
    courseId: 'course-3',
    title: 'Module 3.7: Action Logics: PDL, DEL, STIT and BIAT',
    description: 'Program modalities, epistemic updates and product update, choice partitions and E_i (STIT), and neighborhood semantics for bringing-it-about.',
    sourcePagesRange: 'Part 3.3 · Slides 1–31',
    lessons: [
      L({
        id: 'lesson-3-7-1',
        moduleId: 'mod-3-7',
        deck: 8,
        title: 'Three Views of Action and PDL',
        sourcePages: [1, 2, 3, 4, 5],
        summary: 'PDL asks what holds after executing a program: [α]φ (every terminating execution ends in φ) and ⟨α⟩φ (some execution does). Complex programs: α;β, α∪β, α*, ?φ. Action modalities need not satisfy [α]φ → φ.',
        understand: {
          overview: 'Three perspectives on actions: PDL (what holds after a program?), DEL (how does an event change knowledge?), STIT (what does an agent’s choice guarantee?). KBE’s Eᵢ abstracts away the action itself to focus on its guaranteed effect.',
          detailedExplanation: r`### Three perspectives (slide 3)
| Approach | Central question | Ingredients |
|---|---|---|
| **PDL** (Propositional Dynamic Logic) | What holds after executing a program? | state transitions, structured programs |
| **DEL** (Dynamic Epistemic Logic) | How does an event change knowledge? | epistemic models and model updates |
| **STIT** ("seeing to it that") | What does an agent's choice guarantee? | choices and compatible outcomes |
$E_i\varphi$: "agent $i$ performs actions that lead to $\varphi$", precisely: **the choice performed by $i$ guarantees $\varphi$ across all outcomes compatible with that choice**.

### PDL (slide 4)
Each action $\alpha$ has a relation $R_\alpha$; $wR_\alpha v$ is a terminating execution from $w$ to $v$.
$$\mathcal M,w\models[\alpha]\varphi\iff\forall v\,(wR_\alpha v\Rightarrow\mathcal M,v\models\varphi),\qquad \langle\alpha\rangle\varphi:=\neg[\alpha]\neg\varphi$$
$[\alpha]\varphi$ is vacuously true if $\alpha$ cannot terminate. Example: a door is unlocked but every execution of *lock* leaves it locked: $[\mathit{lock}]p\land\neg p$. So **$[\alpha]\varphi\to\varphi$ is not valid** for actions.

### Complex programs (slide 5)
| Program | Meaning | Semantics |
|---|---|---|
| $\alpha;\beta$ | $\alpha$ then $\beta$ | $\exists v\,(wR_\alpha v\land vR_\beta u)$ |
| $\alpha\cup\beta$ | nondeterministic choice | $R_\alpha\cup R_\beta$ |
| $\alpha^*$ | zero or more repetitions | reflexive transitive closure of $R_\alpha$ |
| $?\varphi$ | test, no state change | $\{(w,w):\mathcal M,w\models\varphi\}$ |
Valid equivalences: $[\alpha;\beta]\varphi\leftrightarrow[\alpha][\beta]\varphi$ and $[\alpha\cup\beta]\varphi\leftrightarrow([\alpha]\varphi\land[\beta]\varphi)$ (Fischer & Ladner, 1979).`,
          keyPoints: [
            'PDL: [α]φ = every terminating execution of α ends in φ; ⟨α⟩φ = some does.',
            '[α]φ → φ is not valid ([lock]p ∧ ¬p).',
            'Programs: sequence α;β, choice α∪β, iteration α*, test ?φ.',
            '[α;β]φ ↔ [α][β]φ and [α∪β]φ ↔ [α]φ ∧ [β]φ.'
          ]
        },
        checkpoints: [
          {
            id: 'cp-3-7-1-1',
            question: 'Which equivalence holds in PDL?',
            type: 'single',
            options: ['[α ∪ β]φ ↔ ([α]φ ∧ [β]φ)', '[α ∪ β]φ ↔ ([α]φ ∨ [β]φ)', '[α;β]φ ↔ [β][α]φ', '[α]φ ↔ φ'],
            correctAnswers: [0],
            explanation: 'Slide 5: a nondeterministic choice guarantees φ only if both branches do.',
            difficulty: 'intermediate',
            sourceSlide: 5
          }
        ]
      }),
      L({
        id: 'lesson-3-7-2',
        moduleId: 'mod-3-7',
        deck: 8,
        title: 'DEL: Announcements, Event Models and Product Update',
        sourcePages: [6, 7, 8, 9, 10, 11, 12],
        summary: 'A truthful announcement of p deletes ¬p-worlds. In general, the product update M ⊗ A keeps world–event pairs whose precondition holds, links pairs related in both models, and copies valuations. A false announcement believed by b gives ¬p ∧ B_b p (KD45, not S5).',
        understand: {
          overview: 'Actions can change knowledge without changing facts. DEL models this by updating the epistemic model.',
          detailedExplanation: r`### Public announcement (slide 6)
$W=\{w,v\}$, $p$ at $w$ only, $j$ cannot distinguish them. At $w$: $p\land\neg K_jp\land\neg K_j\neg p$. A truthful announcement of $p$ removes $\neg p$-worlds; only $w$ remains, so $\mathcal M|_p,w\models K_jp$.
$$\mathcal M,w\models[!\psi]\varphi\iff(\mathcal M,w\models\psi\Rightarrow\mathcal M|_\psi,w\models\varphi)$$
The announcement changes **information**, not the truth of atoms.

### Event models (slides 7–8)
Epistemic model $(W,(R^K_k),V)$; **action model** $\mathcal A=(\mathsf{Ev},(Q_k),\mathrm{pre})$: events, uncertainty about events, preconditions.
Private observation: $\mathsf{Ev}=\{e_+,e_-\}$, $\mathrm{pre}(e_+)=p$, $\mathrm{pre}(e_-)=\neg p$; $Q_i$ = identity (i sees the result), $Q_j=\mathsf{Ev}\times\mathsf{Ev}$ (j does not).

### Product update $\mathcal M\otimes\mathcal A$ (slide 9)
1. **Keep executable pairs**: $W'=\{(w,e):\mathcal M,w\models\mathrm{pre}(e)\}$.
2. **Combine uncertainties**: $(w,e)R'_k(v,f)\iff wR_kv\land eQ_kf$.
3. **Preserve facts**: $V'(w,e)=V(w)$.

### Calculation (slide 11)
Pairs: $(w_+,e_+)$ kept ($x$), $(w_+,e_-)$ no, $(w_-,e_+)$ no, $(w_-,e_-)$ kept ($y$). $R'_i=\{(x,x),(y,y)\}$, $R'_j=W'\times W'$. At $x$: $K_ip$; $\neg K_jp\land\neg K_j\neg p$; and $j$ knows that $i$ knows whether $p$.

### A lie (slide 10)
$p$: "the door is locked", actually $\neg p$; a speaker says "$p$" and listener $b$ trusts it. $W=\{w_0(\neg p),w_1(p)\}$, $R_b=W\times W$. Events $e_L$ (false statement, $\mathrm{pre}=\neg p$, actual) and $e_T$ (truthful, $\mathrm{pre}=p$), $Q_b=\{(e_L,e_T),(e_T,e_T)\}$. Kept pairs: $x=(w_0,e_L)$, $y=(w_1,e_T)$; $R'_b=\{(x,y),(y,y)\}$ (no $xR'_bx$ since $\neg e_LQ_be_L$). At $x$: $\neg p\land B_bp$: **the door stays unlocked; the listener's belief changes.** The updated relation is KD45 but not S5.

### Beyond (slide 12)
Epistemic planning (find actions achieving a knowledge goal; decidability depends on restrictions) and quantifying over information change. KBE abstracts this: what does the agent's choice guarantee?`,
          keyPoints: [
            'Truthful public announcement of p deletes the ¬p-worlds.',
            'Product update: keep (w,e) with M,w ⊨ pre(e); (w,e)R′(v,f) iff wRv and eQf; V′(w,e) = V(w).',
            'Private observation: i learns p, j learns only that i knows whether p.',
            'A believed lie yields ¬p ∧ B_b p: a KD45 (not S5) relation.'
          ]
        },
        checkpoints: [
          {
            id: 'cp-3-7-2-1',
            question: 'In the product update, when is (w, e) kept?',
            type: 'single',
            options: ['When M, w ⊨ pre(e)', 'Always', 'When e is the actual event', 'When w is the actual world'],
            correctAnswers: [0],
            explanation: 'Slide 9: keep executable world–event pairs, those whose world satisfies the event’s precondition.',
            difficulty: 'foundation',
            sourceSlide: 9
          },
          {
            id: 'cp-3-7-2-2',
            question: 'After the false announcement “p” (slide 10), what holds at the actual updated world x?',
            type: 'single',
            options: ['¬p ∧ B_b p', 'p ∧ K_b p', '¬p ∧ K_b ¬p', 'p ∧ ¬B_b p'],
            correctAnswers: [0],
            explanation: 'Facts do not change (¬p), but x only accesses y where p holds, so b believes p.',
            difficulty: 'intermediate',
            sourceSlide: 10
          }
        ]
      }),
      L({
        id: 'lesson-3-7-3',
        moduleId: 'mod-3-7',
        deck: 8,
        title: 'STIT: Choice Partitions and the S5 Modality Eᵢ',
        sourcePages: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
        summary: 'Each agent’s choices partition the outcomes; Eᵢφ holds at w iff φ holds throughout the choice cell Cᵢ(w). The relation “same cell” is an equivalence, so Eᵢ is S5. Door/alarm: at w₁, Eᵢp ∧ ¬Eᵢq and Eⱼq ∧ ¬Eⱼp.',
        understand: {
          overview: 'A world records a possible outcome of one decision situation. For each agent, outcomes compatible with the same choice form a cell. The agent’s choice guarantees φ when φ holds across its cell (Chellas-STIT style).',
          detailedExplanation: r`### Choice partitions (slides 13–14)
$\mathcal M=(W,(\mathcal C_i)_{i},V)$; each $\mathcal C_i$ partitions $W$ into non-empty **choice cells**; $C_i(w)$ is the cell containing $w$. Other agents' choices and the environment may vary inside a cell.
$$wR_iv\iff v\in C_i(w),\qquad \mathcal M,w\models E_i\varphi\iff\forall v\in C_i(w),\ \mathcal M,v\models\varphi$$
Every $R_i$ is reflexive, symmetric, transitive. These relations compare outcomes of **one** decision situation; they are not successive steps.

### Door and alarm (slide 15)
$p$: door locked ($i$ controls the door), $q$: alarm armed ($j$ controls it).
| $i$ \ $j$ | arm | disarm |
|---|---|---|
| **lock** | $w_1: p,q$ (actual) | $w_2: p,\neg q$ |
| **leave unlocked** | $w_3: \neg p,q$ | $w_4: \neg p,\neg q$ |
$\mathcal C_i$ = rows $\{\{w_1,w_2\},\{w_3,w_4\}\}$, $\mathcal C_j$ = columns $\{\{w_1,w_3\},\{w_2,w_4\}\}$. At $w_1$: **$E_ip\land\neg E_iq$** and **$E_jq\land\neg E_jp$**. Both facts are true, but each choice guarantees a different one.

### An S5 system for each $E_i$ (slides 16–17)
$K_i$: $E_i(\varphi\to\psi)\to(E_i\varphi\to E_i\psi)$; $T_i$: $E_i\varphi\to\varphi$; $4_i$; $5_i$; MP; Nec ($\vdash\varphi\Rightarrow\vdash E_i\varphi$). Why: if $v\in C_i(w)$ then $C_i(v)=C_i(w)$, so T (actual effect: $w\in C_i(w)$), 4 (same guarantee across the cell) and 5 (same counterexample accessible from the whole cell). $E_iE_i\varphi$ does **not** mean acting twice.

### Commitments of the abstraction (slide 18)
$E_i\top$ is valid and $\neg E_i\bot$ is valid: every choice guarantees a tautology, so $E_i\top$ shows no distinctive intervention. The modality says nothing about time, intention, causal mechanism or a change from $\neg\varphi$ to $\varphi$. Nec is theorem-preserving; it does **not** validate $\varphi\to E_i\varphi$.

### STIT variants (slide 19)
- S5 choice modality: $E_i\varphi$ iff $C_i(w)\subseteq\llbracket\varphi\rrbracket$.
- **Deliberative STIT**: $D_i\varphi:=E_i\varphi\land\neg\Box\varphi$ (the outcome was not already settled; $\Box\varphi$ = true at every outcome).
- Neighborhood BIAT: $\mathsf{BA}_i\varphi$ iff $\llbracket\varphi\rrbracket\in N_i(w)$.
Neighborhood forms: $N^E_i(w)=\{X:C_i(w)\subseteq X\}$, $N^D_i(w)=\{X:C_i(w)\subseteq X,\ X\neq W\}$.

### Several agents (slide 20)
$E_i\varphi\to E_j\varphi$ is not valid. Optional **independence**: every combination of individual choices is jointly feasible, $\bigcap_iC_i\neq\varnothing$ (door/alarm satisfies it).

### Proof and exercise (slides 21–22)
$\vdash E_i(p\land q)\to E_ip$: (1) $(p\land q)\to p$ PC; (2) $E_i((p\land q)\to p)$ Nec; (3) instance of $K_i$; (4) MP 2, 3. Same model as door/alarm, at $w_1$: $E_ip$ **T**, $E_iq$ **F** ($w_2$), $E_jq$ **T**, $E_jp$ **F** ($w_3$), $E_iE_ip$ **T**, $E_i\neg E_iq$ **T** ($E_iq$ fails at $w_1$ and $w_2$), $E_iE_jq$ **F** ($E_jq$ fails at $w_2$). $q\to E_iq$ is **false** at $w_1$: a countermodel, so it is not valid. $\neg E_iq\to E_i\neg E_iq$ holds at every world, but one model does not establish validity (the S5 frame proof does).`,
          keyPoints: [
            'Choice cells partition W; Eᵢφ at w ⟺ φ holds on the whole cell Cᵢ(w).',
            '“Same cell” is an equivalence relation, so Eᵢ obeys S5 (K, T, 4, 5, MP, Nec).',
            'Door/alarm at w₁: Eᵢp ∧ ¬Eᵢq, Eⱼq ∧ ¬Eⱼp; EᵢEⱼq false.',
            'Eᵢ⊤ valid, ¬Eᵢ⊥ valid; φ → Eᵢφ not valid.',
            'Deliberative STIT: Dᵢφ = Eᵢφ ∧ ¬□φ (not already settled).'
          ]
        },
        labId: 'agency-lab#stit',
        examPitfalls: [
          'Eᵢφ looks at agent i’s CELL (row), not at the actual world alone: q true at w₁ does not give Eᵢq.',
          'For EᵢEⱼq, check Eⱼq at every world of i’s cell, each with its own j-cell.'
        ],
        checkpoints: [
          {
            id: 'cp-3-7-3-1',
            question: 'Door/alarm model, at w₁ (i rows {w₁,w₂}, {w₃,w₄}; j columns {w₁,w₃}, {w₂,w₄}; p at w₁,w₂; q at w₁,w₃). Which are true? (Select all.)',
            type: 'multiple',
            options: ['E_i p', 'E_j q', 'E_i q', 'E_i E_j q'],
            correctAnswers: [0, 1],
            explanation: 'E_i p: p on {w₁,w₂} ✓. E_j q: q on {w₁,w₃} ✓. E_i q fails at w₂. E_i E_j q needs E_j q at w₂, whose j-cell {w₂,w₄} has no q.',
            difficulty: 'intermediate',
            sourceSlide: 22
          },
          {
            id: 'cp-3-7-3-2',
            question: 'Why does the choice-cell semantics validate T: E_i φ → φ?',
            type: 'single',
            options: ['Because w ∈ C_i(w): the actual outcome belongs to its own cell', 'Because cells are singletons', 'Because of independence', 'It does not validate T'],
            correctAnswers: [0],
            explanation: 'Slide 17: if φ holds throughout C_i(w), it holds at w, since w ∈ C_i(w).',
            difficulty: 'foundation',
            sourceSlide: 17
          },
          {
            id: 'cp-3-7-3-3',
            question: 'How is deliberative STIT D_i φ defined?',
            type: 'single',
            options: ['E_i φ ∧ ¬□φ', 'E_i φ ∧ □φ', '¬E_i φ', 'E_i^d φ ∧ K_i φ'],
            correctAnswers: [0],
            explanation: 'Slide 19: the choice guarantees an outcome that was not already settled.',
            difficulty: 'intermediate',
            sourceSlide: 19
          }
        ]
      }),
      L({
        id: 'lesson-3-7-4',
        moduleId: 'mod-3-7',
        deck: 8,
        title: 'BIAT: Neighborhood Semantics for Bringing-It-About',
        sourcePages: [23, 24, 25, 26, 27, 28, 29, 30, 31],
        summary: 'In neighborhood semantics, BAᵢφ is true at w iff the truth set ⟦φ⟧ belongs to Nᵢ(w). Constraints: success (X ∈ N(w) ⇒ w ∈ X), W ∉ N(w), closure under intersection. Unlike Eᵢ, BAᵢ is not closed under logical consequence and ¬BAᵢ⊤ is valid.',
        understand: {
          overview: 'A neighborhood is a collection of propositions (sets of worlds). Model checking: first compute the truth set of the argument, then test its membership in Nᵢ(w).',
          detailedExplanation: r`### STIT vs BIAT (slide 23)
| | STIT guaranteed effect $E_i\varphi$ | Bringing-it-about $\mathsf{BA}_i\varphi$ |
|---|---|---|
| Reading | $i$'s choice guarantees $\varphi$ | $i$ brings about $\varphi$ as an attributed goal-directed achievement |
| Semantics | equivalence relations / choice cells | neighborhood functions |
| Tautologies | $E_i\top$ valid | $\neg\mathsf{BA}_i\top$ valid |
| Consequences | guaranteed consequences stay guaranteed | consequences are not automatically attributed |

### Neighborhood models (slide 24)
$\mathcal M=(W,(N_i),V)$ with $N_i:W\to2^{2^W}$. Truth set $\llbracket\varphi\rrbracket=\{v:\mathcal M,v\models\varphi\}$.
$$\mathcal M,w\models\mathsf{BA}_i\varphi\iff\llbracket\varphi\rrbracket\in N_i(w)$$
$N_i(w)$ contains **propositions** (sets of worlds), not individual accessible worlds.

### Constraints for successful, non-trivial agency (slide 25)
| Condition | Neighborhood requirement | Principle |
|---|---|---|
| Success | $X\in N_i(w)\Rightarrow w\in X$ | $\mathsf{BA}_i\varphi\to\varphi$ |
| No tautological achievement | $W\notin N_i(w)$ | $\neg\mathsf{BA}_i\top$ |
| Aggregation | $X,Y\in N_i(w)\Rightarrow X\cap Y\in N_i(w)$ | $(\mathsf{BA}_i\varphi\land\mathsf{BA}_i\psi)\to\mathsf{BA}_i(\varphi\land\psi)$ |
| Replacement of equivalents | rule | $\vdash\varphi\leftrightarrow\psi\ \Rightarrow\ \vdash\mathsf{BA}_i\varphi\leftrightarrow\mathsf{BA}_i\psi$ |
Success also excludes $\varnothing$, so $\neg\mathsf{BA}_i\bot$. $N_i(w)=\varnothing$ is allowed. No necessitation.

### Example (slides 26–27)
$p$: door locked, $q$: light on. $V(w_1)=\{p,q\}$, $V(w_2)=\{p\}$, $V(w_3)=\{q\}$, $V(w_4)=\varnothing$; $N_i(w_1)=\{\{w_1,w_2\}\}$, others $\varnothing$.
- $\llbracket p\rrbracket=\{w_1,w_2\}\in N_i(w_1)$: $\mathsf{BA}_ip$ ✓.
- $\llbracket q\rrbracket=\{w_1,w_3\}\notin N_i(w_1)$: $q\land\neg\mathsf{BA}_iq$. Truth alone is insufficient.
- $\llbracket p\lor q\rrbracket=\{w_1,w_2,w_3\}\notin N_i(w_1)$: $\mathsf{BA}_ip\land\neg\mathsf{BA}_i(p\lor q)$ although $\models p\to(p\lor q)$. **Membership is not upward closed.** With an S5 cell $C_i(w_1)=\{w_1,w_2\}$, $E_ip\to E_i(p\lor q)$ would be valid.

### Exercise (slide 28), solutions at $w_1$
$\mathsf{BA}_ip$ **T**; $\mathsf{BA}_iq$ **F**; $\mathsf{BA}_i(p\lor q)$ **F**; $\mathsf{BA}_i(p\land q)$: $\llbracket p\land q\rrbracket=\{w_1\}$ **F**; $\mathsf{BA}_i\top$: $W\notin N_i(w_1)$ **F**; $\mathsf{BA}_i\mathsf{BA}_ip$: $\llbracket\mathsf{BA}_ip\rrbracket=\{w_1\}$ **F**.
4 fails at $w_1$ ($\mathsf{BA}_ip$ true, $\mathsf{BA}_i\mathsf{BA}_ip$ false). 5 at $w_2$: $\neg\mathsf{BA}_ip$ true; $\llbracket\neg\mathsf{BA}_ip\rrbracket=\{w_2,w_3,w_4\}\notin N_i(w_2)=\varnothing$, so 5 **fails** too. Axioms 4 and 5 cannot be imported into the BIAT core.

### Repair exercise (slide 29)
Proposal $N_i(w_1)=\{\{w_1,w_2\},\{w_1,w_3\},W\}$: success ✓ ($w_1$ in each), but $W$ violates **no tautological achievement**, and intersection closure needs $\{w_1,w_2\}\cap\{w_1,w_3\}=\{w_1\}$. Repair: $N_i(w_1)=\{\{w_1,w_2\},\{w_1,w_3\},\{w_1\}\}$. Then $\mathsf{BA}_i(p\land q)$ **must** hold ($\{w_1\}$ is there) but $\mathsf{BA}_i(p\lor q)$ need **not** ($\{w_1,w_2,w_3\}$ absent).

### Why KBE keeps $E_i$ as S5 (slide 30)
$E_i$ describes the guaranteed effect, supporting normal reasoning ($E_i(\varphi\to\psi)\to(E_i\varphi\to E_i\psi)$) and effects on others' attitudes ($E_iB_jp$). Deliberateness is expressed by a separate neighborhood modality ($E^d_i$ in KBE, the analogue of $\mathsf{BA}_i$).`,
          keyPoints: [
            'BAᵢφ at w ⟺ ⟦φ⟧ ∈ Nᵢ(w): compute the truth set, then test membership.',
            'Constraints: success (w ∈ X), W ∉ N(w) (¬BA⊤), closure under ∩ (aggregation); no necessitation.',
            'Not upward closed: BAᵢp ∧ ¬BAᵢ(p ∨ q) is possible.',
            'Axioms 4 and 5 fail in the BIAT core; K is not valid on neighborhood structures.',
            'Repair: drop W and add the intersection {w₁}.'
          ]
        },
        labId: 'agency-lab#biat',
        examPitfalls: [
          'Neighborhoods contain SETS of worlds. Do not look for "accessible worlds": compare the whole truth set with each member.',
          'To evaluate a nested formula like BAᵢBAᵢp, first compute ⟦BAᵢp⟧ at every world.'
        ],
        checkpoints: [
          {
            id: 'cp-3-7-4-1',
            question: 'With N_i(w₁) = {{w₁, w₂}}, ⟦p⟧ = {w₁, w₂}, ⟦q⟧ = {w₁, w₃}, which is true at w₁?',
            type: 'single',
            options: ['BA_i p ∧ ¬BA_i(p ∨ q)', 'BA_i q', 'BA_i ⊤', 'BA_i(p ∧ q)'],
            correctAnswers: [0],
            explanation: '{w₁, w₂} is in N_i(w₁) but ⟦p ∨ q⟧ = {w₁, w₂, w₃} is not: neighborhoods are not upward closed.',
            difficulty: 'intermediate',
            sourceSlide: 28
          },
          {
            id: 'cp-3-7-4-2',
            question: 'Which neighborhood condition validates ¬BA_i ⊤?',
            type: 'single',
            options: ['W ∉ N_i(w)', 'Success: X ∈ N_i(w) ⇒ w ∈ X', 'Closure under intersection', 'N_i(w) ≠ ∅'],
            correctAnswers: [0],
            explanation: '⟦⊤⟧ = W, so excluding W from every neighborhood makes BA_i ⊤ false everywhere.',
            difficulty: 'foundation',
            sourceSlide: 25
          },
          {
            id: 'cp-3-7-4-3',
            question: 'Repair N_i(w₁) = {{w₁,w₂}, {w₁,w₃}, W} while keeping BA_i p and BA_i q. Minimal fix:',
            type: 'single',
            options: ['{{w₁,w₂}, {w₁,w₃}, {w₁}}', '{{w₁,w₂}, {w₁,w₃}}', '{{w₁,w₂}, {w₁,w₃}, W, {w₁}}', '{{w₁}}'],
            correctAnswers: [0],
            explanation: 'Remove W (no tautological achievement) and add the intersection {w₁} (aggregation).',
            difficulty: 'advanced',
            sourceSlide: 29
          }
        ]
      })
    ]
  },
  // =====================================================================
  {
    id: 'mod-3-8',
    courseId: 'course-3',
    title: 'Module 3.8: KBE Logic and the Formal Theory of Manipulation',
    description: 'KBE models and constraints, the axiom system, its theorems, and the formulas for manipulation, coercion, persuasion and credible lies.',
    sourcePagesRange: 'Part 3.4 · Slides 1–18',
    lessons: [
      L({
        id: 'lesson-3-8-1',
        moduleId: 'mod-3-8',
        deck: 9,
        title: 'KBE Semantics: Relations, Neighborhoods and Constraints',
        sourcePages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        summary: 'A KBE model has relations Bᵢ, Kᵢ, Eᵢ and a neighborhood function Eᵢᵈ. Kᵢ is S4.2 (reflexive, transitive, confluent), Bᵢ KD45, Eᵢ S5, and the constraints link them: Bᵢ(w) ⊆ Kᵢ(w), Eᵢᵈφ ⇒ Eᵢφ, ¬Eᵢᵈ⊤, closure under ∩, Eᵢᵈ known.',
        understand: {
          overview: 'KBE combines knowledge, belief, effects and deliberate effects in one model: M = (W, {Bᵢ}, {Kᵢ}, {Eᵢ}, {Eᵢᵈ}, V).',
          detailedExplanation: r`### Models (slides 4–5)
$$\mathcal M=(W,\{B_i\},\{K_i\},\{E_i\},\{E_i^d\},V),\qquad V:P\to2^W$$
$B_i,K_i,E_i$ are **binary relations**; $E_i^d$ is a **neighborhood function** $E_i^d(w)\in2^{2^W}$. Truth at a world, satisfiability and validity as usual.

### Truth conditions (slides 6–8)
- Boolean clauses as usual.
- $K_i\varphi$, $B_i\varphi$, $E_i\varphi$: $\varphi$ at every $K_i$-/$B_i$-/$E_i$-successor.
- **Deliberate effect**: $\mathcal M,w\models E_i^d\varphi\iff|\varphi|\in E_i^d(w)$ where $|\varphi|=\{v:\mathcal M,v\models\varphi\}$: a **non-normal** modality.

Slide 8 example: $E^d_i(w_2)=\{\{w_2,w_3,w_4\},\{w_2\}\}$, $p$ at $w_2,w_3,w_4$: $|p|=\{w_2,w_3,w_4\}\in E^d_i(w_2)$, so $E^d_ip$ at $w_2$. (Slide 7 example: $K_i(w_2)=\{w_2,w_3,w_4\}$ and $K_ip$ at $w_2$.)

### Constraints on relations (slides 9–10)
| Name | Constraint | Axiom |
|---|---|---|
| SK | $K_i$ reflexive, transitive, **confluent** | S4.2 for $K_i$ (labelled S5 on the slide) |
| SB | $B_i$ serial, transitive, Euclidean | KD45 for $B_i$ |
| KB1 | $B_i(w)\subseteq K_i(w)$ | $K_i\varphi\Rightarrow B_i\varphi$ |
| KB2 | $wK_iu\land uB_iv\Rightarrow wB_iv$ | $B_i\varphi\Rightarrow K_iB_i\varphi$ |
| KB3 | $wK_iu\land wB_iv\Rightarrow uB_iv$ | $\neg B_i\varphi\Rightarrow K_i\neg B_i\varphi$ |
| $T_E$, $4_E$, $5_E$ | $E_i$ reflexive, transitive, Euclidean | S5 for $E_i$ (STIT without time) |
**Confluence**: $wRu\land wRv\Rightarrow\exists z\,(uRz\land vRz)$ (Stalnaker, 2006).

### Constraints on deliberate effects (slide 11)
| Name | Constraint | Axiom |
|---|---|---|
| $E^d_{Nec}$ | $W\notin E_i^d(w)$ | $\neg E_i^d\top$ |
| $E^dE$ | $S\in E_i^d(w)\Rightarrow E_i(w)\subseteq S$ | $E_i^d\varphi\Rightarrow E_i\varphi$ |
| $E_{\Rightarrow,\land}$ | $S,T\in E_i^d(w)\Rightarrow S\cap T\in E_i^d(w)$ | $E^d_i\varphi\land E^d_i\psi\Rightarrow E^d_i(\varphi\land\psi)$ |
| $E^d_{KP+KN}$ | $E_i^d(w)=\bigcap_{v:wK_iv}E_i^d(v)$ | $E_i^d\varphi\equiv K_iE_i^d\varphi$ |
Reading: a deliberate effect is an actual effect; nothing trivial is deliberate; deliberate effects aggregate; the agent knows what it deliberately does.`,
          keyPoints: [
            'KBE model: relations Kᵢ, Bᵢ, Eᵢ and neighborhood function Eᵢᵈ.',
            'Eᵢᵈφ at w ⟺ |φ| ∈ Eᵢᵈ(w) (non-normal, like BIAT).',
            'Kᵢ: reflexive, transitive, confluent; Bᵢ: KD45; Eᵢ: S5 (equivalence).',
            'Bᵢ(w) ⊆ Kᵢ(w) gives Kᵢφ ⇒ Bᵢφ; KB2/KB3 give introspection about beliefs.',
            'Eᵢᵈφ ⇒ Eᵢφ, ¬Eᵢᵈ⊤, closure under ∩, Eᵢᵈφ ≡ KᵢEᵢᵈφ.'
          ]
        },
        labId: 'manipulation-lab',
        examPitfalls: [
          'E_i^d uses neighborhoods (membership of |φ|), not successors: model-check it like BIAT.',
          'K_i φ ⇒ B_i φ comes from B_i(w) ⊆ K_i(w): fewer belief alternatives than epistemic ones.'
        ],
        checkpoints: [
          {
            id: 'cp-3-8-1-1',
            question: 'How is E_i^d φ evaluated at w?',
            type: 'single',
            options: ['|φ| ∈ E_i^d(w)', 'φ holds at every E_i-successor of w', 'φ holds at w', 'φ holds at some K_i-successor'],
            correctAnswers: [0],
            explanation: 'Slide 8: the deliberate-effect modality is interpreted by a neighborhood function.',
            difficulty: 'foundation',
            sourceSlide: 8
          },
          {
            id: 'cp-3-8-1-2',
            question: 'Which constraint yields the axiom E_i^d φ ⇒ E_i φ?',
            type: 'single',
            options: ['S ∈ E_i^d(w) ⇒ E_i(w) ⊆ S', 'W ∉ E_i^d(w)', 'S, T ∈ E_i^d(w) ⇒ S ∩ T ∈ E_i^d(w)', 'B_i(w) ⊆ K_i(w)'],
            correctAnswers: [0],
            explanation: 'Slide 11 (E^dE): every deliberately achieved proposition contains all E_i-alternatives, so it is also an effect.',
            difficulty: 'intermediate',
            sourceSlide: 11
          }
        ]
      }),
      L({
        id: 'lesson-3-8-2',
        moduleId: 'mod-3-8',
        deck: 9,
        title: 'The KBE Axiom System and Its Theorems',
        sourcePages: [12, 13],
        summary: 'KBE: PC, MP, RE for all four modalities, Generalization for Kᵢ, Bᵢ, Eᵢ (not Eᵢᵈ); Kᵢ S4.2, Bᵢ KD45, Eᵢ S5; interaction axioms. Sound and complete. Theorem: ⊢ (EᵢᵈEⱼφ ∨ EᵢᵈEⱼᵈφ) ⇒ Eᵢφ: whoever acts through another does the act himself.',
        understand: {
          overview: 'KBE is a sound and complete axiomatic system that proves intuitive relationships between manipulation-related notions.',
          detailedExplanation: r`### Rules and modal systems (slide 12)
- **PC**: all theorems of propositional calculus. **MP**.
- **RE** (replacement of equivalents): from $\vdash\varphi\Leftrightarrow\psi$ infer $\vdash\Box\varphi\Leftrightarrow\Box\psi$, for $\Box\in\{K_i,B_i,E_i,E_i^d\}$.
- **Generalization (Nec)**: from $\vdash\varphi$ infer $\vdash\Box\varphi$ for $\Box\in\{K_i,B_i,E_i\}$, **not** $E_i^d$ (otherwise $E^d_i\top$, contradicting $\neg E^d_i\top$).
- $K_i$: **S4** + $\langle K_i\rangle K_i\varphi\Rightarrow K_i\langle K_i\rangle\varphi$ (axiom .2, confluence). $B_i$: **KD45**. $E_i$: **S5**.

**Interaction axioms**
| Axiom | Meaning |
|---|---|
| $K_i\varphi\Rightarrow B_i\varphi$ | knowledge implies belief |
| $B_i\varphi\Rightarrow K_iB_i\varphi$ | the agent knows its beliefs |
| $\neg B_i\varphi\Rightarrow K_i\neg B_i\varphi$ | the agent knows its non-beliefs |
| $E_i^d\varphi\Rightarrow E_i\varphi$ | a deliberate effect is an effect |
| $E_i^d\varphi\land E_i^d\psi\Rightarrow E_i^d(\varphi\land\psi)$ | aggregation |
| $\neg E_i^d\top$ | tautologies are not deliberate effects |
| $E_i^d\varphi\Rightarrow K_iE_i^d\varphi$, $\neg E_i^d\varphi\Rightarrow K_i\neg E_i^d\varphi$ | the agent knows what it does (or does not do) deliberately |

### System properties (slide 13)
- **Soundness and completeness**: $\vdash\varphi$ iff $\models\varphi$.
- **Qui facit per alium facit per se** ("he who acts through another does the act himself"):
$$\vdash(E_i^dE_j\varphi\lor E_i^dE_j^d\varphi)\Rightarrow E_i\varphi$$
Derivation sketch: $E^d_iE_j\varphi\Rightarrow E_iE_j\varphi$ (axiom $E^d\Rightarrow E$). Since $\vdash E_j\varphi\Rightarrow\varphi$ (T for $E_j$), Nec for $E_i$ and axiom K give $\vdash E_iE_j\varphi\Rightarrow E_i\varphi$. For the other disjunct, $\vdash E^d_j\varphi\Rightarrow\varphi$ (via $E^d_j\varphi\Rightarrow E_j\varphi$ and T), so the same steps give $E^d_iE^d_j\varphi\Rightarrow E_i\varphi$. The instigator's choice itself guarantees $\varphi$.
- Other theorems: $\vdash\neg E_i^d\bot$; $\vdash E_i^dB_j\varphi\Rightarrow\neg E_i^dB_jK_k\neg\varphi$; $\vdash E_i^d\neg B_j\varphi\Rightarrow\neg E_i^dB_jK_k\varphi$ (you cannot deliberately make $j$ believe $\varphi$ and at the same time make $j$ believe that someone knows $\neg\varphi$).`,
          keyPoints: [
            'Rules: PC, MP, RE for all four modalities, Necessitation for Kᵢ, Bᵢ, Eᵢ only.',
            'Kᵢ: S4.2; Bᵢ: KD45; Eᵢ: S5; plus interaction axioms (Kᵢφ ⇒ Bᵢφ, Eᵢᵈφ ⇒ Eᵢφ, ¬Eᵢᵈ⊤, …).',
            'KBE is sound and complete.',
            'Qui facit per alium: ⊢ (EᵢᵈEⱼφ ∨ EᵢᵈEⱼᵈφ) ⇒ Eᵢφ.'
          ]
        },
        labId: 'manipulation-lab',
        checkpoints: [
          {
            id: 'cp-3-8-2-1',
            question: 'Why is Necessitation NOT allowed for E_i^d in KBE?',
            type: 'single',
            options: ['It would give E_i^d ⊤, contradicting the axiom ¬E_i^d ⊤', 'Because E_i^d is S5', 'Because E_i^d has no semantics', 'It is allowed'],
            correctAnswers: [0],
            explanation: '⊤ is a theorem; necessitation would derive E_i^d ⊤, but tautologies are never deliberate effects.',
            difficulty: 'advanced',
            sourceSlide: 12
          },
          {
            id: 'cp-3-8-2-2',
            question: 'What does the theorem (E_i^d E_j φ ∨ E_i^d E_j^d φ) ⇒ E_i φ express?',
            type: 'single',
            options: [
              'He who acts through another does the act himself',
              'Knowledge implies belief',
              'Deliberate effects aggregate',
              'Every agent is a manipulator'
            ],
            correctAnswers: [0],
            explanation: 'Slide 13: “Qui facit per alium facit per se”.',
            difficulty: 'foundation',
            sourceSlide: 13
          }
        ]
      }),
      L({
        id: 'lesson-3-8-3',
        moduleId: 'mod-3-8',
        deck: 9,
        title: 'Formalizing Manipulation, Coercion, Persuasion and Lying',
        sourcePages: [14, 15, 16, 17, 18],
        summary: 'Manipulation = deliberate instrumentalization + concealment: Eᵢᵈ(instrumentalization ∧ concealment). Constructive/destructive × strong (Eⱼᵈ)/soft (Eⱼ) × epistemic (¬Kⱼ)/doxastic (¬Bⱼ). Coercion replaces concealment by Kⱼ; persuasion is Eᵢᵈ Bⱼφ; a credible lie adds Bᵢ¬φ and ¬KⱼBᵢ¬φ.',
        understand: {
          overview: 'The KBE definitions translate the informal definition word by word: deliberate effect (Eᵢᵈ), instrumentalization (the victim’s effect Eⱼ or deliberate effect Eⱼᵈ), concealment (the victim does not know / believe it).',
          detailedExplanation: r`### The 8 forms of manipulation (slide 14)
| | Instrumentalization | Concealment |
|---|---|---|
| **Constructive, strong** | $E_i^dE_j^d\varphi$ | epistemic $E_i^d\neg K_jE_i^dE_j^d\varphi$ |
| **Constructive, soft** | $E_i^dE_j\varphi$ | doxastic $E_i^d\neg B_jE_i^dE_j\varphi$ |
| **Destructive, strong** | $E_i^d\neg E_j^d\varphi$ | epistemic $E_i^d\neg K_jE_i^d\neg E_j^d\varphi$ |
| **Destructive, soft** | $E_i^d\neg E_j\varphi$ | doxastic $E_i^d\neg B_jE_i^d\neg E_j\varphi$ |
Each instrumentalization type can be combined with either concealment type.
- **Constructive**: the victim is made to bring about $\varphi$. **Destructive**: the victim is prevented from bringing about $\varphi$.
- **Strong**: acts on the victim's **deliberate** effects ($E_j^d$): the victim *intends* it. **Soft**: acts on the victim's mere effects ($E_j$).
- **Epistemic concealment**: the victim does not **know** ($\neg K_j$). **Doxastic concealment**: the victim does not even **believe** ($\neg B_j$), which is stronger (since $K_j\to B_j$, $\neg B_j\to\neg K_j$).

### Full definitions (slide 15)
$\Sigma$: a finite, closed set of formulas agents can reason about (linked to awareness, Schipper 2014).
**Soft constructive manipulation with epistemic concealment**
$$\mathrm{MCEK}^\Sigma_{i,j}\varphi=\bigvee_{\psi\in\Sigma}E_i^d\big(E_j\varphi\land\neg K_jE_i^dE_j\varphi\land\psi\big)$$
**Strong destructive manipulation with doxastic concealment**
$$\mathrm{MDE^dB}^\Sigma_{i,j}\varphi=\bigvee_{\psi\in\Sigma}E_i^d\big(\neg E_j^d\varphi\land\neg B_jE_i^d\neg E_j^d\varphi\land\psi\big)$$
The $\psi$ and the disjunction over $\Sigma$ let the manipulator deliberately bring about the conjunction together with some other goal $\psi$ (aggregation under one $E^d_i$).

### Related concepts (slide 16)
| Concept | Formula | What differs |
|---|---|---|
| **Coercion** | $\bigvee_\psi E_i^d(E_j^d\varphi\land K_jE_i^dE_j^d\varphi\land\psi)$ | the victim **knows** it is forced ($K_j$ instead of $\neg K_j$) |
| **Persuasion** | $\bigvee_\psi E_i^d(B_j\varphi\land\psi)$ | only a deliberate change of belief, no concealment |
| **Credible lie** | $B_i\neg\varphi\land\bigvee_\psi E_i^d(B_j\varphi\land\neg K_jB_i\neg\varphi\land\psi)$ | $i$ believes $\neg\varphi$, deliberately makes $j$ believe $\varphi$, and $j$ does not know $i$ believes $\neg\varphi$ |

### Conclusion (slide 17)
KBE is sound and complete, expresses manipulation and its strategies, and proves intuitive relationships. Perspectives: awareness, emotion-based manipulation, implementation in real systems, and the open question **how do we infer deliberate effects?**`,
          keyPoints: [
            'Manipulation = Eᵢᵈ(instrumentalization ∧ concealment ∧ ψ).',
            'Constructive (Eⱼ / Eⱼᵈ φ) vs destructive (¬Eⱼ / ¬Eⱼᵈ φ); strong uses Eⱼᵈ, soft uses Eⱼ.',
            'Epistemic concealment ¬Kⱼ(…); doxastic concealment ¬Bⱼ(…).',
            'Coercion: Kⱼ instead of ¬Kⱼ. Persuasion: Eᵢᵈ(Bⱼφ ∧ ψ). Credible lie: Bᵢ¬φ ∧ Eᵢᵈ(Bⱼφ ∧ ¬KⱼBᵢ¬φ ∧ ψ).'
          ]
        },
        labId: 'manipulation-lab',
        formulas: [
          {
            name: 'Soft constructive manipulation with epistemic concealment',
            latex: r`\mathrm{MCEK}^{\Sigma}_{i,j}\varphi=\bigvee_{\psi\in\Sigma}E_i^d\big(E_j\varphi\land\neg K_jE_i^dE_j\varphi\land\psi\big)`,
            explanation: 'i deliberately makes j’s actions lead to φ while making sure j does not know that i deliberately did so.',
            variables: [
              { symbol: '\\Sigma', description: 'finite closed set of formulas agents reason about' },
              { symbol: 'E_i^d', description: 'deliberate effect of the manipulator i' },
              { symbol: 'E_j', description: 'effect of the victim j' }
            ]
          },
          {
            name: 'Credible lie',
            latex: r`\mathrm{cre}^{\Sigma}_{i,j}\varphi=B_i\neg\varphi\land\bigvee_{\psi\in\Sigma}E_i^d\big(B_j\varphi\land\neg K_jB_i\neg\varphi\land\psi\big)`,
            explanation: 'i believes ¬φ, deliberately makes j believe φ, and j does not know that i believes ¬φ.',
            variables: []
          }
        ],
        examPitfalls: [
          'Coercion is NOT concealed: it has K_j (the victim knows), manipulation has ¬K_j or ¬B_j.',
          'Persuasion has no concealment and only targets a belief B_jφ; a lie additionally requires B_i¬φ.'
        ],
        checkpoints: [
          {
            id: 'cp-3-8-3-1',
            question: 'Which formula is soft constructive instrumentalization?',
            type: 'single',
            options: ['E_i^d E_j φ', 'E_i^d E_j^d φ', 'E_i^d ¬E_j φ', 'E_i^d ¬E_j^d φ'],
            correctAnswers: [0],
            explanation: 'Slide 14: soft uses E_j (mere effect); constructive has no negation. E_i^d E_j^d φ is strong constructive.',
            difficulty: 'intermediate',
            sourceSlide: 14
          },
          {
            id: 'cp-3-8-3-2',
            question: 'What distinguishes coercion from strong constructive manipulation with epistemic concealment?',
            type: 'single',
            options: [
              'In coercion the victim knows: K_j E_i^d E_j^d φ instead of ¬K_j E_i^d E_j^d φ',
              'Coercion has no deliberate effect',
              'Coercion uses B_j instead of E_j',
              'There is no difference'
            ],
            correctAnswers: [0],
            explanation: 'Slide 16: coercion keeps the instrumentalization but replaces concealment by knowledge.',
            difficulty: 'intermediate',
            sourceSlide: 16
          },
          {
            id: 'cp-3-8-3-3',
            question: 'Which formula defines persuasion?',
            type: 'single',
            options: ['⋁_{ψ∈Σ} E_i^d(B_j φ ∧ ψ)', 'B_i ¬φ ∧ ⋁ E_i^d(B_j φ ∧ ¬K_j B_i ¬φ ∧ ψ)', '⋁ E_i^d(E_j^d φ ∧ K_j E_i^d E_j^d φ ∧ ψ)', 'E_i φ'],
            correctAnswers: [0],
            explanation: 'Slide 16. The second option is the credible lie and the third is coercion.',
            difficulty: 'foundation',
            sourceSlide: 16
          }
        ]
      })
    ]
  },
  // =====================================================================
  {
    id: 'mod-3-9',
    courseId: 'course-3',
    title: 'Module 3.9: TD: Modal Logics, Neighborhoods and STIT',
    description: 'The full TD with solutions: Kripke model checking, countermodels, S5/KD45 derivations, neighborhood model checking, and the betray-or-cooperate STIT game.',
    sourcePagesRange: 'TD · Pages 1–4',
    lessons: [
      L({
        id: 'lesson-3-9-1',
        moduleId: 'mod-3-9',
        deck: 10,
        title: 'TD Ex. 1: Model Checking a Kripke Model',
        sourcePages: [1],
        summary: 'W = {w₀..w₃}, R = {(w₀,w₁),(w₀,w₂),(w₁,w₁),(w₁,w₃),(w₂,w₃)}, p at w₀,w₁, q at w₁,w₃. Full satisfaction table, the dead-end w₃ (□p true, ◇p false), and □◇q vs ◇□q.',
        understand: {
          overview: 'Justify every evaluation by the semantic clause used. □φ: all successors; ◇φ = ¬□¬φ: some successor.',
          detailedExplanation: r`### The model
$W=\{w_0,w_1,w_2,w_3\}$, $R=\{(w_0,w_1),(w_0,w_2),(w_1,w_1),(w_1,w_3),(w_2,w_3)\}$, $V(p)=\{w_0,w_1\}$, $V(q)=\{w_1,w_3\}$. $w_3$ has no successor.
$\mathrm{Succ}(w_0)=\{w_1,w_2\}$, $\mathrm{Succ}(w_1)=\{w_1,w_3\}$, $\mathrm{Succ}(w_2)=\{w_3\}$, $\mathrm{Succ}(w_3)=\varnothing$.

### 1.1 Satisfaction table
| Formula | $w_0$ | $w_1$ | $w_2$ | $w_3$ |
|---|---|---|---|---|
| $p\to q$ | 0 | 1 | 1 | 1 |
| $\Box p$ | 0 | 0 | 0 | 1 |
| $\Diamond q$ | 1 | 1 | 1 | 0 |
| $\Box\Diamond q$ | 1 | 0 | 0 | 1 |
| $\Diamond\Box p$ | 0 | 1 | 1 | 0 |
| $\Box(p\to\Diamond q)$ | 1 | 1 | 1 | 1 |
| $\Diamond(p\land\Box q)$ | 1 | 1 | 0 | 0 |
| $\Box p\to p$ | 1 | 1 | 1 | 0 |
Key steps: $\Box p$ at $w_0$ fails ($w_2$ has $\neg p$), at $w_1$ fails ($w_3$), at $w_2$ fails ($w_3$), at $w_3$ vacuous. $\Box\Diamond q$ at $w_0$: $\Diamond q$ holds at $w_1$ and $w_2$ ✓; at $w_1$: $\Diamond q$ fails at $w_3$. $\Diamond\Box p$ at $w_1$: successor $w_3$ has $\Box p$ (vacuous) ✓. $\Diamond(p\land\Box q)$: $p\land\Box q$ holds only at $w_1$ ($\Box q$ at $w_1$: $q$ at $w_1,w_3$ ✓); $w_0$ and $w_1$ see $w_1$.

### 1.2 Satisfiable in M / valid in M
All eight are **satisfiable in $\mathcal M$** (each has at least one 1). Only $\Box(p\to\Diamond q)$ satisfies **$\mathcal M\models\varphi$** (true at every world). This does **not** establish general validity.

### 1.3 Why $\mathcal M,w_3\models\Box p$ but $\not\models\Diamond p$
$w_3$ has no successor: "$p$ at every successor" is vacuously true, "$p$ at some successor" is false. (On a serial frame this cannot happen: D $\Box p\to\Diamond p$.)

### 1.4 $\Box\Diamond q$ vs $\Diamond\Box q$
$\Diamond\Box q$ row: $w_0{:}1$, $w_1{:}1$, $w_2{:}1$, $w_3{:}0$. They differ at $w_1$ ($\Box\Diamond q$ = 0, $\Diamond\Box q$ = 1), at $w_2$ (0 vs 1) and at $w_3$ (1 vs 0). So $\mathcal M$ distinguishes them: **not equivalent**, in neither direction.`,
          keyPoints: [
            'Successors: w₀→{w₁,w₂}, w₁→{w₁,w₃}, w₂→{w₃}, w₃→∅.',
            '□p true only at w₃ (vacuously); ◇q false only at w₃.',
            'Only □(p → ◇q) is true at every world of M; all eight formulas are satisfiable in M.',
            '□◇q and ◇□q differ at w₁, w₂ and w₃: not equivalent.'
          ]
        },
        labId: 'kripke-lab#td1',
        checkpoints: [
          {
            id: 'cp-3-9-1-1',
            question: 'TD Ex. 1: at which worlds is □◇q true?',
            type: 'single',
            options: ['w₀ and w₃', 'w₀ only', 'w₁ and w₂', 'Everywhere'],
            correctAnswers: [0],
            explanation: 'At w₀ both successors satisfy ◇q; w₃ is vacuous; w₁ and w₂ see w₃ where ◇q fails.',
            difficulty: 'intermediate',
            sourceSlide: 1
          },
          {
            id: 'cp-3-9-1-2',
            question: 'TD Ex. 1: which formula is true at every world of M?',
            type: 'single',
            options: ['□(p → ◇q)', '□p → p', '◇q', 'p → q'],
            correctAnswers: [0],
            explanation: 'Every successor where p holds (w₁) satisfies ◇q; successors without p satisfy the implication trivially; w₃ is vacuous. □p → p fails at w₃.',
            difficulty: 'advanced',
            sourceSlide: 2
          }
        ]
      }),
      L({
        id: 'lesson-3-9-2',
        moduleId: 'mod-3-9',
        deck: 10,
        title: 'TD Ex. 2–3: Countermodels, S5 and KD45 Derivations',
        sourcePages: [2],
        summary: 'Minimal countermodels on arbitrary frames: □p → p (1 world, no loop), □p → □□p (3 worlds), ◇p → □◇p (3 worlds), □(p ∨ q) → □p ∨ □q (3 worlds); K is valid. S5 proofs of Kp ↔ KKp and ◇Kp → Kp; KD45 proofs and the countermodel to Bp → p.',
        understand: {
          overview: 'For each non-valid formula, give a minimal finite countermodel and justify every edge and valuation.',
          detailedExplanation: r`### Exercise 2: countermodels on all Kripke frames
| Formula | Valid on all frames? | Minimal countermodel | Comparison |
|---|---|---|---|
| 2.1 $\Box p\to p$ | No | $W=\{w\}$, $R=\varnothing$, $V(p)=\varnothing$: $\Box p$ vacuous, $p$ false | valid on **reflexive** frames; still fails on serial frames ($w\to v$, $p$ only at $v$) |
| 2.2 $\Box p\to\Box\Box p$ | No | $w\to v\to u$, $V(p)=\{v\}$: $\Box p$ at $w$, $\Box p$ fails at $v$ | valid on transitive frames |
| 2.3 $\Diamond p\to\Box\Diamond p$ | No | $w\to v$, $w\to u$, $V(p)=\{v\}$, $u$ has no successor: $\Diamond p$ at $w$, $\Diamond p$ fails at $u$ | valid on Euclidean frames (it is axiom 5 in dual form) |
| 2.4 $\Box(p\lor q)\to(\Box p\lor\Box q)$ | No | $w\to v$, $w\to u$, $V(p)=\{v\}$, $V(q)=\{u\}$ | fails even on reflexive frames (add loops, make $w$ satisfy $p$ and $q$) |
| 2.5 $\Box(p\to q)\to(\Box p\to\Box q)$ | **Yes** | none: a successor with $\neg q$ would satisfy $p\to q$ and $p$, hence $q$ | axiom K, valid on every frame |
One world is enough for 2.1 and impossible for 2.2–2.4 (they need two distinct behaviours among successors).

### Exercise 3: S5 (K: S5 operator) and KD45 (B)
**3.1** $\vdash_{S5}Kp\leftrightarrow KKp$: $Kp\to KKp$ is **4**; $KKp\to Kp$ is **T** with $Kp$ substituted for $\varphi$; combine with PC and MP.
**3.2** $\Diamond Kp\to Kp$ (semantic, equivalence relation $\sim$): $\Diamond Kp$ at $w$ gives $v\sim w$ with $Kp$ at $v$, i.e. $p$ on the class $[v]$. Since $\sim$ is an equivalence, $[v]=[w]$, so $p$ holds on $[w]$: $Kp$ at $w$. Conversely $Kp\to\Diamond Kp$: $Kp\to KKp$ (4) and $KKp\to\Diamond Kp$ (T: $\Box\psi\to\psi$ then $\psi\to\Diamond\psi$). Hence $\Diamond Kp\leftrightarrow Kp$.
**3.3** KD45: $Bp\to\neg B\neg p$ is **immediately** axiom D. $Bp\to BBp$ is axiom 4; $BBp\to Bp$ needs **reasoning**: Euclideanness on $wRv$ and $wRv$ gives $vRv$, so each alternative $v$ of $w$ sees itself; $BBp$ gives $Bp$ at $v$, hence $p$ at $v$; so $Bp$ at $w$.
**3.4** $\neg Bp\to B\neg Bp$ is axiom **5**. $Bp\to p$ is **not** derivable: countermodel $W=\{w,v\}$, $R=\{(w,v),(v,v)\}$, $V(p)=\{v\}$ (serial, transitive, Euclidean), $Bp$ at $w$ but $\neg p$.
**3.5** Every equivalence frame is reflexive (hence **serial**), transitive and Euclidean, so it validates D, 4, 5: S5 ⊇ KD45. The converse is false: the countermodel of 3.4 is a KD45 frame that is not reflexive.`,
          keyPoints: [
            '□p → p fails with one world and no loop; valid exactly on reflexive frames.',
            '□p → □□p, ◇p → □◇p, □(p ∨ q) → □p ∨ □q fail with 3 worlds; K is valid on all frames.',
            'S5: Kp ↔ KKp from 4 and T[Kp]; ◇Kp ↔ Kp because classes coincide.',
            'KD45: D immediate; BBp → Bp needs Euclideanness; Bp → p has a 2-world countermodel.',
            'Every equivalence frame is a KD45 frame; not conversely.'
          ]
        },
        labId: 'kripke-lab#td1',
        checkpoints: [
          {
            id: 'cp-3-9-2-1',
            question: 'Which formula from TD Ex. 2 is valid on every Kripke frame?',
            type: 'single',
            options: ['□(p → q) → (□p → □q)', '□p → p', '□p → □□p', '□(p ∨ q) → (□p ∨ □q)'],
            correctAnswers: [0],
            explanation: 'It is axiom K. The others need reflexivity, transitivity, or are invalid even then.',
            difficulty: 'foundation',
            sourceSlide: 2
          },
          {
            id: 'cp-3-9-2-2',
            question: 'Countermodel to □(p ∨ q) → (□p ∨ □q):',
            type: 'single',
            options: ['w → v, w → u, p only at v, q only at u', 'One world with a loop where p is true', 'w → v with p and q at v', 'An empty model'],
            correctAnswers: [0],
            explanation: 'Every successor has p ∨ q, but neither p nor q holds at all successors.',
            difficulty: 'intermediate',
            sourceSlide: 2
          }
        ]
      }),
      L({
        id: 'lesson-3-9-3',
        moduleId: 'mod-3-9',
        deck: 10,
        title: 'TD Ex. 4: Neighborhood Model Checking',
        sourcePages: [3],
        summary: 'W = {a,b,c}, ⟦p⟧ = {a,b}, ⟦q⟧ = {b,c}, N(a) = {{a,b},{b,c}}, N(b) = {W}, N(c) = ∅. ⟦□p⟧ = ⟦□q⟧ = {a}, ⟦□(p∧q)⟧ = ∅, ⟦□(p∨q)⟧ = {b}. Aggregation fails at a; K can fail; ◇ is not “some accessible world”.',
        understand: {
          overview: 'A neighborhood model checker never follows edges: it computes the extension ⟦φ⟧, then asks whether that set is a member of N(w).',
          detailedExplanation: r`### 4.1 Extensions
$\llbracket p\rrbracket=\{a,b\}$, $\llbracket q\rrbracket=\{b,c\}$, $\llbracket p\land q\rrbracket=\{b\}$, $\llbracket p\lor q\rrbracket=\{a,b,c\}=W$.
- $\llbracket\Box p\rrbracket=\{w:\{a,b\}\in N(w)\}=\{a\}$.
- $\llbracket\Box q\rrbracket=\{w:\{b,c\}\in N(w)\}=\{a\}$.
- $\llbracket\Box(p\land q)\rrbracket=\{w:\{b\}\in N(w)\}=\varnothing$.
- $\llbracket\Box(p\lor q)\rrbracket=\{w:W\in N(w)\}=\{b\}$.

### 4.2 Aggregation
$\Box p\land\Box q$ is true only at $a$. At $a$, $\Box(p\land q)$ is false, so $(\Box p\land\Box q)\to\Box(p\land q)$ **fails at $a$** (true at $b$ and $c$, where the antecedent is false). $N(a)$ is not closed under intersection.

### 4.3 Axiom K is not valid on neighborhood structures
In this model K happens to hold everywhere ($\llbracket p\to q\rrbracket=\{b,c\}$, so $\Box(p\to q)$ holds at $a$ and $\Box q$ too). A countermodel: $W=\{a,b\}$, $V(p)=\{a\}$, $V(q)=\varnothing$, $N(a)=\{\{a\},\{b\}\}$. Then $\llbracket p\to q\rrbracket=\{b\}\in N(a)$ and $\llbracket p\rrbracket=\{a\}\in N(a)$, but $\llbracket q\rrbracket=\varnothing\notin N(a)$: $\Box(p\to q)\land\Box p\land\neg\Box q$ at $a$.

### 4.4 Why ◇ is not "some accessible world"
$\Diamond\varphi:=\neg\Box\neg\varphi$ is true at $w$ iff $W\setminus\llbracket\varphi\rrbracket\notin N(w)$. There are no accessible worlds at all. Example: $N(c)=\varnothing$, so $\Box$ of anything is false at $c$ and $\Diamond$ of anything is true there, including $\Diamond\bot$ (since $\llbracket\neg\bot\rrbracket=W\notin N(c)$). Here $\Diamond p$ and $\Diamond q$ hold at all three worlds.

### 4.5 Model-checking pseudo-code
| Step | Pseudo-code |
|---|---|
| 1 | \`ext(φ)\` computed bottom-up: atoms from V; ¬, ∧, ∨ by set operations |
| 2 | \`ext(□φ) = { w ∈ W : ext(φ) ∈ N(w) }\` |
| 3 | membership test = set equality against each member of N(w) |
Architectural difference: the relational checker iterates over **successors** of $w$ ($\forall v\in R(w)$); the neighborhood checker first builds the **whole extension** of $\varphi$ and compares **sets**. Truth of $\Box\varphi$ at $w$ depends on $\varphi$ everywhere, not just at successors.`,
          keyPoints: [
            '⟦□φ⟧ = {w : ⟦φ⟧ ∈ N(w)}: compute the extension, then test membership.',
            '⟦□p⟧ = ⟦□q⟧ = {a}, ⟦□(p ∧ q)⟧ = ∅, ⟦□(p ∨ q)⟧ = {b}.',
            '(□p ∧ □q) → □(p ∧ q) fails at a: no closure under intersection.',
            'K countermodel: N(a) = {{a},{b}}, p = {a}, q = ∅.',
            'With N(c) = ∅, every □ is false and every ◇ true at c, even ◇⊥.'
          ]
        },
        labId: 'agency-lab#td4',
        examPitfalls: ['In neighborhood semantics ◇⊥ can be true (N(w) = ∅). Never read ◇ as “there is an accessible world”.'],
        checkpoints: [
          {
            id: 'cp-3-9-3-1',
            question: 'TD Ex. 4: what is ⟦□(p ∨ q)⟧?',
            type: 'single',
            options: ['{b}', '{a}', '∅', '{a, b, c}'],
            correctAnswers: [0],
            explanation: '⟦p ∨ q⟧ = W, and only N(b) contains W.',
            difficulty: 'intermediate',
            sourceSlide: 3
          },
          {
            id: 'cp-3-9-3-2',
            question: 'TD Ex. 4: where does (□p ∧ □q) → □(p ∧ q) fail?',
            type: 'single',
            options: ['At a', 'At b', 'At c', 'Nowhere'],
            correctAnswers: [0],
            explanation: '□p and □q hold at a, but {b} ∉ N(a).',
            difficulty: 'intermediate',
            sourceSlide: 3
          },
          {
            id: 'cp-3-9-3-3',
            question: 'With N(c) = ∅, what is the truth value of ◇⊥ at c?',
            type: 'single',
            options: ['True', 'False', 'Undefined', 'Depends on V'],
            correctAnswers: [0],
            explanation: '◇⊥ = ¬□¬⊥ = ¬□⊤; ⟦⊤⟧ = W ∉ N(c), so □⊤ is false and ◇⊥ true.',
            difficulty: 'advanced',
            sourceSlide: 3
          }
        ]
      }),
      L({
        id: 'lesson-3-9-4',
        moduleId: 'mod-3-9',
        deck: 10,
        title: 'TD Ex. 5: Betray So as Not to Be the Pigeon? A STIT Game',
        sourcePages: [3, 4],
        summary: 'Two players choose T (betray) or C (cooperate). Choice₁ = rows {w₁,w₂},{w₃,w₄}, Choice₂ = columns. [1]¬q holds where player 1 betrays: betraying guarantees never being the pigeon. T is dominant; (T,T) is both the unique Nash equilibrium and the maximin choice, for different reasons.',
        understand: {
          overview: 'A single-step STIT game: p = player 1 gains a unilateral advantage, q = player 2 does, r = nobody was taken for the other’s pigeon (both made the same choice).',
          detailedExplanation: r`### The game
| | P2: T | P2: C |
|---|---|---|
| **P1: T** | $w_1: \neg p\land\neg q\land r$ | $w_2: p\land\neg q\land\neg r$ |
| **P1: C** | $w_3: \neg p\land q\land\neg r$ | $w_4: \neg p\land\neg q\land r$ |
Preferences: $p\succ_1 r\succ_1(\neg p\land\neg r)$, utilities 2, 1, 0 (same for P2 with $q$).

### 5.1 Partitions
$\mathrm{Choice}_1=\{\{w_1,w_2\},\{w_3,w_4\}\}$ (rows), $\mathrm{Choice}_2=\{\{w_1,w_3\},\{w_2,w_4\}\}$ (columns). **Independence**: each row meets each column in exactly one world ✓. "Same choice of $i$" is an equivalence relation (its classes are the cells), so $[i]$ is an **S5** modality.

### 5.2 STIT evaluations
| Formula | $w_1$ | $w_2$ | $w_3$ | $w_4$ |
|---|---|---|---|---|
| $[1]p$ | 0 | 0 | 0 | 0 |
| $[2]q$ | 0 | 0 | 0 | 0 |
| $[1]\neg q$ | **1** | **1** | 0 | 0 |
| $[2]\neg p$ | **1** | 0 | **1** | 0 |
| $[1]r$ | 0 | 0 | 0 | 0 |
Betraying **guarantees never being the pigeon**: $[1]\neg q$ holds on P1's T-cell. No choice guarantees exploiting the other ($[1]p$ nowhere) or that nobody is a pigeon ($[1]r$ nowhere). **Guarantee ≠ preference**: STIT says what a choice ensures, not what the agent prefers.

### 5.3 Utilities and maximin
| | $u_1$ | $u_2$ |
|---|---|---|
| $w_1$ (T,T) | 1 | 1 |
| $w_2$ (T,C) | 2 | 0 |
| $w_3$ (C,T) | 0 | 2 |
| $w_4$ (C,C) | 1 | 1 |
$m_1(T)=\min(1,2)=1$, $m_1(C)=\min(0,1)=0$; $m_2(T)=\min(1,2)=1$, $m_2(C)=\min(0,1)=0$. **Maximin choice: T for both.**

### 5.4 Nash equilibria
P1: vs T, $u_1(T)=1>u_1(C)=0$; vs C, $2>1$: **T always**. Same for P2. Unique pure NE: **(T,T)**. It coincides with the maximin choice here, but the criteria differ: maximin compares **sets of outcomes ex ante** (worst case of each cell); Nash compares **responses to a fixed opposing strategy**.

### 5.5 Why $r$ at $w_1$ and $w_4$ is not "the same"
$r$ only says no-one was exploited. The **actions** differ ((T,T) vs (C,C)) and the agents are not indifferent between all profiles ($u$ depends on $p$, $q$, not only $r$). To distinguish collective consequences, add information: e.g. a proposition $s$ = "both get the lighter sentence" true only at $w_4$, or explicit payoffs/preference orders.

### 5.6 Formalization challenge
With choice atoms $t_i$, $c_i$ (constant on $i$'s cells): $w_1$ is characterized by $t_1\land t_2$ (equivalently $t_1\land t_2\land\neg p\land\neg q\land r$). With $\rho^T_i$ = "maximin selects T for $i$", the maximin profile is $(t_1\leftrightarrow\rho^T_1)\land(t_2\leftrightarrow\rho^T_2)$, here $t_1\land t_2$. $\rho^T_i$ is **not definable** from STIT operators and $p,q,r$ alone: maximin needs a **preference/utility ordering** over outcomes and a min/max comparison across cells, which the STIT language does not contain.`,
          keyPoints: [
            'Choice₁ = rows, Choice₂ = columns; independence holds; [i] is S5.',
            '[1]¬q true at w₁, w₂ (betraying guarantees not being the pigeon); [1]p, [2]q, [1]r false everywhere.',
            'Maximin: m(T) = 1 > m(C) = 0 for both players.',
            'T is dominant; (T,T) is the unique pure NE; it coincides with maximin, but the criteria differ.',
            'Maximin selection needs preference structure: not definable from STIT + p, q, r.'
          ]
        },
        labId: 'game-lab#td5',
        checkpoints: [
          {
            id: 'cp-3-9-4-1',
            question: 'TD Ex. 5: at which histories is [1]¬q true?',
            type: 'single',
            options: ['w₁ and w₂', 'w₁ and w₃', 'w₃ and w₄', 'Nowhere'],
            correctAnswers: [0],
            explanation: 'P1’s T-cell is {w₁, w₂}, where q is false at both: betraying guarantees P2 gets no unilateral advantage.',
            difficulty: 'intermediate',
            sourceSlide: 3
          },
          {
            id: 'cp-3-9-4-2',
            question: 'TD Ex. 5: what are P1’s maximin values m₁(T) and m₁(C)?',
            type: 'single',
            options: ['1 and 0', '2 and 1', '1 and 1', '0 and 1'],
            correctAnswers: [0],
            explanation: 'T-cell utilities {1, 2} → min 1; C-cell utilities {0, 1} → min 0.',
            difficulty: 'intermediate',
            sourceSlide: 3
          },
          {
            id: 'cp-3-9-4-3',
            question: 'Do Nash equilibrium and maximin mean the same thing?',
            type: 'single',
            options: [
              'No: maximin compares worst outcomes of each choice ex ante; Nash compares best responses to a fixed opponent strategy',
              'Yes: they always coincide',
              'Yes: both maximize the sum of utilities',
              'No: maximin is only for zero-sum games, so it is undefined here'
            ],
            correctAnswers: [0],
            explanation: 'TD discussion: both select (T,T) here without being conceptually equivalent.',
            difficulty: 'intermediate',
            sourceSlide: 4
          }
        ]
      })
    ]
  }
];
