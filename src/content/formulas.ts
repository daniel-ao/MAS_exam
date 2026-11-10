const r = String.raw;

export interface FormulaDetail {
  id: string;
  name: string;
  course: 'course-1' | 'course-2' | 'course-3';
  /** Source reference, e.g. "Part 2.1, Slide 7". */
  lectureSlide: string;
  latex: string;
  explanation: string;
  variables: { symbol: string; meaning: string; dimension?: string }[];
  examTips: string;
}

export const formulasData: FormulaDetail[] = [
  // ------------------------------------------------------------------ Chapter 1
  {
    id: 'form-flocking',
    name: 'Flocking update (separation, alignment, cohesion)',
    course: 'course-1',
    lectureSlide: 'Part 1.1, Slide 25',
    latex: r`v_i \leftarrow \mathrm{limit}\big(v_i + w_sF^{sep}_i + w_aF^{ali}_i + w_cF^{coh}_i,\ v_{max}\big),\qquad p_i \leftarrow p_i + v_i\,\Delta t`,
    explanation: 'Three local steering forces are weighted and added to the velocity, which is capped; the position integrates the velocity.',
    variables: [
      { symbol: r`F^{sep}_i`, meaning: 'average of normalize(pᵢ − pⱼ)/d over close neighbors' },
      { symbol: r`F^{ali}_i`, meaning: 'normalize(mean neighbor velocity)·v_max − vᵢ' },
      { symbol: r`F^{coh}_i`, meaning: 'normalize(neighbor center − pᵢ)·v_max − vᵢ' }
    ],
    examTips: 'Alignment and cohesion return desired MINUS current velocity. Raise separation against collisions, alignment to synchronize, cohesion to keep the group compact.'
  },
  // ------------------------------------------------------------------ Chapter 2
  {
    id: 'form-reputation',
    name: 'Beta reputation with credibility-weighted witnesses',
    course: 'course-2',
    lectureSlide: 'Part 2.1, Slide 7',
    latex: r`R_i(j)=\frac{1+p_{ij}+\sum_k c_{ik}\,p_{kj}}{2+p_{ij}+n_{ij}+\sum_k c_{ik}\,(p_{kj}+n_{kj})}=\frac{1+P}{2+P+N}`,
    explanation: 'Expected probability that an interaction of i with j succeeds, from direct evidence and witness reports weighted by credibility.',
    variables: [
      { symbol: r`p_{ij},\,n_{ij}`, meaning: 'direct positive / negative interactions' },
      { symbol: r`p_{kj},\,n_{kj}`, meaning: 'witness k’s reported positives / negatives' },
      { symbol: r`c_{ik}\in[0,1]`, meaning: 'credibility of witness k for i' }
    ],
    examTips: 'Alice–Bob: 10/17 ≈ 0.588. After 3 Sybils × 3 positives: 19/26 ≈ 0.731. Seller S: 12.2/20 = 0.61; each Sybil (c = 0.4, 4+) adds 1.6 to P; 2 Sybils → ≈ 0.664.'
  },
  {
    id: 'form-sybil-threshold',
    name: 'Number of Sybils to cross a threshold τ',
    course: 'course-2',
    lectureSlide: 'Part 2.1, Slide 13',
    latex: r`\frac{1+P+k\,c\,s}{2+P+N+k\,c\,s}\ \ge\ \tau\iff k\ \ge\ \frac{\tau(2+P+N)-(1+P)}{c\,s\,(1-\tau)}`,
    explanation: 'Each Sybil identity with credibility c reporting s positives (and no negatives) adds c·s to both numerator and denominator.',
    variables: [
      { symbol: 'k', meaning: 'number of Sybil identities (round up)' },
      { symbol: 'c, s', meaning: 'Sybil credibility and positives reported per Sybil' },
      { symbol: r`\tau`, meaning: 'selection threshold' }
    ],
    examTips: 'Seller S: τ = 0.65, P = 11.2, N = 6.8, c·s = 1.6 → k ≥ (13 − 12.2)/(1.6·0.35) ≈ 1.43 → k = 2.'
  },
  {
    id: 'form-voting-system',
    name: 'Voting system and plurality / majority',
    course: 'course-2',
    lectureSlide: 'Part 2.2, Slides 4, 7–8',
    latex: r`S=(N,O,\{\succeq_i\}_{i\in N},f),\qquad g(o)=\big|\{i\in N : o\text{ first in }\succ_i\}\big|,\qquad \text{majority: } g(o)>\tfrac{|N|}{2}`,
    explanation: 'A voting system is agents, outcomes, preferences and a social choice function. Plurality counts first places; absolute majority needs more than half.',
    variables: [
      { symbol: 'f', meaning: 'social choice function: profile → winner or ranking' },
      { symbol: 'g(o)', meaning: 'score of o' }
    ],
    examTips: '12 voters: 6 is not a majority, 7 is. Plurality winner B = 5 of 12 has no absolute majority.'
  },
  {
    id: 'form-borda',
    name: 'Borda count',
    course: 'course-2',
    lectureSlide: 'Part 2.2, Slide 10',
    latex: r`g(o)=\sum_{i\in N}\big(m-\mathrm{rank}_i(o)\big),\qquad \text{winner}\in\arg\max_{o\in O} g(o)`,
    explanation: 'With m alternatives, each voter gives m−1 points to its first choice, down to 0 for its last.',
    variables: [
      { symbol: 'm', meaning: 'number of alternatives' },
      { symbol: r`\mathrm{rank}_i(o)`, meaning: 'position of o in i’s ranking (1 = first)' }
    ],
    examTips: 'Slide example truthful: A6 B7 C4 D1 (B wins). Agent 1 reports A≻D≻C≻B: A6 B5 C4 D3 (A wins).'
  },
  {
    id: 'form-game',
    name: 'Normal-form game',
    course: 'course-2',
    lectureSlide: 'Part 2.3, Slide 6',
    latex: r`G=\big(N,\{S_i\}_{i\in N},\{\mu_i\}_{i\in N}\big),\qquad \mu_i:\prod_{j\in N}S_j\to\mathbb R`,
    explanation: 'Players, strategy sets and utility functions over joint actions.',
    variables: [
      { symbol: r`S_i`, meaning: 'strategies (actions) of agent i' },
      { symbol: r`\mu_i`, meaning: 'utility of agent i for each joint action' }
    ],
    examTips: 'A joint action is a complete combination of all agents’ choices.'
  },
  {
    id: 'form-nash',
    name: 'Nash equilibrium',
    course: 'course-2',
    lectureSlide: 'Part 2.3, Slide 11',
    latex: r`\mu_i(s_i,s_{-i})\ \ge\ \mu_i(s'_i,s_{-i})\qquad\forall i\in N,\ \forall s'_i\in S_i`,
    explanation: 'No agent can improve its utility by changing its own strategy alone.',
    variables: [
      { symbol: r`s_{-i}`, meaning: 'strategies of everyone except i' },
      { symbol: r`s'_i`, meaning: 'any alternative strategy of i' }
    ],
    examTips: 'Prisoner’s Dilemma: (B,B) with (−5,−5) is the unique NE; (C,C) with (−2,−2) is better for both but not stable.'
  },
  {
    id: 'form-supervisor',
    name: 'Supervisor–company norm: equilibrium conditions',
    course: 'course-2',
    lectureSlide: 'Part 2.3, Slide 20',
    latex: r`(S,H)\text{ NE}\iff a\ge c\ \land\ r\ge m-p;\qquad \text{unique NE if } a>c,\ p+r>m,\ b+q>c`,
    explanation: 'Supervision must pay against honest companies, and honesty must beat manipulation under supervision; detection payoffs b + q > c rule out the other equilibria.',
    variables: [
      { symbol: 'm, p, r', meaning: 'manipulation gain, penalty, reward for verified honesty' },
      { symbol: 'c, b, q, a', meaning: 'supervision cost, detection bonus, loss for missed manipulation, value of verified honesty' }
    ],
    examTips: '(S̄, H) is never an NE: against no supervision, manipulating pays m > 0.'
  },
  // ------------------------------------------------------------------ Chapter 3
  {
    id: 'form-kbe-syntax',
    name: 'KBE language',
    course: 'course-3',
    lectureSlide: 'Part 3.1, Slide 7',
    latex: r`\varphi ::= p\mid\neg\varphi\mid\varphi\lor\varphi\mid\varphi\land\varphi\mid\varphi\Rightarrow\varphi\mid K_i\varphi\mid B_i\varphi\mid E_i\varphi\mid E_i^d\varphi`,
    explanation: 'Propositional logic plus knowledge, belief, effect and deliberate effect for each agent.',
    variables: [
      { symbol: r`K_i,\ B_i`, meaning: 'knowledge (S4.2/S5), belief (KD45)' },
      { symbol: r`E_i,\ E_i^d`, meaning: 'effect (S5 choice), deliberate effect (neighborhood)' }
    ],
    examTips: 'Each modality takes exactly ONE formula: B_i(p, q) and (p ∧ B_i) are not wffs.'
  },
  {
    id: 'form-kripke-box',
    name: 'Kripke truth of □ / K and its dual ◇',
    course: 'course-3',
    lectureSlide: 'Part 3.1, Slide 17',
    latex: r`\mathcal M,w\models\Box\varphi\iff\forall v\,(wRv\Rightarrow\mathcal M,v\models\varphi),\qquad \Diamond\varphi:=\neg\Box\neg\varphi`,
    explanation: '□φ: φ at every successor; ◇φ: φ at some successor. Connectives are evaluated at the same world.',
    variables: [
      { symbol: r`\mathcal M=(W,R,V)`, meaning: 'worlds, accessibility, valuation V : P → 2^W' }
    ],
    examTips: 'A world without successors makes every □φ true (vacuously) and every ◇φ false.'
  },
  {
    id: 'form-validity-levels',
    name: 'Truth, model validity, frame validity',
    course: 'course-3',
    lectureSlide: 'Part 3.1, Slide 18',
    latex: r`\mathcal M\models\varphi\iff\forall w,\ \mathcal M,w\models\varphi;\qquad F\models\varphi\iff\forall V\,\forall w,\ (W,R,V),w\models\varphi`,
    explanation: 'Validity in a model fixes R and V; validity on a frame quantifies over all valuations too.',
    variables: [],
    examTips: 'M ⊨ φ does not give F ⊨ φ: change the valuation.'
  },
  {
    id: 'form-frame-properties',
    name: 'Frame properties',
    course: 'course-3',
    lectureSlide: 'Part 3.1, Slides 20, 28',
    latex: r`\begin{array}{ll}\text{reflexive} & \forall x\,xRx\\ \text{symmetric} & xRy\Rightarrow yRx\\ \text{transitive} & xRy\land yRz\Rightarrow xRz\\ \text{Euclidean} & xRy\land xRz\Rightarrow yRz\\ \text{serial} & \forall x\exists y\,xRy\end{array}`,
    explanation: 'Equivalence = reflexive + symmetric + transitive = reflexive + transitive + Euclidean.',
    variables: [],
    examTips: 'Transitivity completes a chain xRy, yRz; Euclideanness connects two successors of the same x.'
  },
  {
    id: 'form-correspondence',
    name: 'Axioms and their frame conditions',
    course: 'course-3',
    lectureSlide: 'Part 3.1, Slides 31–34',
    latex: r`\begin{array}{lll}\mathbf K & \Box(\varphi\Rightarrow\psi)\Rightarrow(\Box\varphi\Rightarrow\Box\psi) & \text{all frames}\\ \mathbf T & \Box\varphi\Rightarrow\varphi & \text{reflexive}\\ \mathbf D & \Box\varphi\Rightarrow\neg\Box\neg\varphi & \text{serial}\\ \mathbf 4 & \Box\varphi\Rightarrow\Box\Box\varphi & \text{transitive}\\ \mathbf B & \varphi\Rightarrow\Box\neg\Box\neg\varphi & \text{symmetric}\\ \mathbf 5 & \neg\Box\varphi\Rightarrow\Box\neg\Box\varphi & \text{Euclidean}\end{array}`,
    explanation: 'Each axiom is valid on a frame iff its relation has the matching property (K holds on every frame).',
    variables: [],
    examTips: 'Countermodel valuations: T and 4 use V(p) = R(w); B uses V(p) = {w}; 5 uses V(p) = R(v).'
  },
  {
    id: 'form-s5-rules',
    name: 'S5 system: axioms and rules',
    course: 'course-3',
    lectureSlide: 'Part 3.1, Slide 39',
    latex: r`\mathrm{S5}=\mathrm{PC}+\mathbf K+\mathbf T+\mathbf 4+\mathbf 5;\quad \frac{\varphi\quad\varphi\Rightarrow\psi}{\psi}\ (\mathrm{MP}),\quad \frac{\vdash\varphi}{\vdash K\varphi}\ (\mathrm{Nec}),\quad \frac{\vdash\varphi}{\vdash\varphi[p:=\psi]}\ (\mathrm{US})`,
    explanation: 'Sound and complete for equivalence frames: ⊢_S5 φ ⟺ ⊨_S5 φ.',
    variables: [],
    examTips: 'Nec only applies to theorems: p ⇒ Kp is NOT valid (W = {w,v}, R = W×W, V(p) = {w}).'
  },
  {
    id: 'form-kd45',
    name: 'KD45 belief',
    course: 'course-3',
    lectureSlide: 'Part 3.2, Slide 6',
    latex: r`\mathrm{KD45}=\mathrm{PC}+\mathbf K_B+(B\varphi\to\neg B\neg\varphi)+(B\varphi\to BB\varphi)+(\neg B\varphi\to B\neg B\varphi)`,
    explanation: 'Serial, transitive, Euclidean frames; no reflexivity, so Bφ ∧ ¬φ is satisfiable.',
    variables: [],
    examTips: 'Minimal false belief: W = {w,v}, R_B = {(w,v),(v,v)}, V(p) = {v}.'
  },
  {
    id: 'form-pdl',
    name: 'PDL program modalities',
    course: 'course-3',
    lectureSlide: 'Part 3.3, Slides 4–5',
    latex: r`[\alpha]\varphi\iff\forall v\,(wR_\alpha v\Rightarrow v\models\varphi);\quad [\alpha;\beta]\varphi\leftrightarrow[\alpha][\beta]\varphi;\quad [\alpha\cup\beta]\varphi\leftrightarrow[\alpha]\varphi\land[\beta]\varphi`,
    explanation: 'Every terminating execution of α ends in φ. Sequence, choice, iteration (reflexive transitive closure) and test build complex programs.',
    variables: [],
    examTips: '[α]φ → φ is not valid: [lock]p ∧ ¬p.'
  },
  {
    id: 'form-product-update',
    name: 'DEL product update',
    course: 'course-3',
    lectureSlide: 'Part 3.3, Slide 9',
    latex: r`W'=\{(w,e):\mathcal M,w\models\mathrm{pre}(e)\},\quad (w,e)R'_k(v,f)\iff wR_kv\land eQ_kf,\quad V'(w,e)=V(w)`,
    explanation: 'Keep executable pairs, link pairs related in both the epistemic and the event model, keep facts.',
    variables: [],
    examTips: 'A believed lie gives ¬p ∧ B_b p: the updated relation is KD45, not S5.'
  },
  {
    id: 'form-stit',
    name: 'STIT choice modality Eᵢ',
    course: 'course-3',
    lectureSlide: 'Part 3.3, Slide 14',
    latex: r`\mathcal M,w\models E_i\varphi\iff\forall v\in C_i(w),\ \mathcal M,v\models\varphi;\qquad D_i\varphi:=E_i\varphi\land\neg\Box\varphi`,
    explanation: 'φ holds across agent i’s choice cell; deliberative STIT adds that φ was not already settled.',
    variables: [{ symbol: r`C_i(w)`, meaning: 'the cell of i’s choice partition containing w' }],
    examTips: 'Door/alarm at w₁: Eᵢp ∧ ¬Eᵢq, Eⱼq ∧ ¬Eⱼp, EᵢEⱼq false.'
  },
  {
    id: 'form-neighborhood',
    name: 'Neighborhood semantics',
    course: 'course-3',
    lectureSlide: 'Part 3.3, Slide 24',
    latex: r`\mathcal M,w\models\Box\varphi\iff\llbracket\varphi\rrbracket\in N(w),\qquad \llbracket\varphi\rrbracket=\{v\in W:\mathcal M,v\models\varphi\}`,
    explanation: 'Compute the truth set of φ, then test whether it is a member of N(w). Used for BAᵢ (BIAT) and Eᵢᵈ (KBE).',
    variables: [{ symbol: 'N(w)', meaning: 'set of propositions (sets of worlds)' }],
    examTips: 'TD Ex. 4: ⟦□p⟧ = ⟦□q⟧ = {a}, ⟦□(p∧q)⟧ = ∅, ⟦□(p∨q)⟧ = {b}; with N(c) = ∅, ◇⊥ is true at c.'
  },
  {
    id: 'form-biat-constraints',
    name: 'BIAT neighborhood constraints',
    course: 'course-3',
    lectureSlide: 'Part 3.3, Slide 25',
    latex: r`X\in N_i(w)\Rightarrow w\in X;\qquad W\notin N_i(w);\qquad X,Y\in N_i(w)\Rightarrow X\cap Y\in N_i(w)`,
    explanation: 'Success (BAφ → φ), no tautological achievement (¬BA⊤), aggregation.',
    variables: [],
    examTips: 'Not upward closed: BAᵢp ∧ ¬BAᵢ(p ∨ q) is possible.'
  },
  {
    id: 'form-kbe-deliberate',
    name: 'KBE deliberate effect',
    course: 'course-3',
    lectureSlide: 'Part 3.4, Slide 8',
    latex: r`\mathcal M,w\models E_i^d\varphi\iff|\varphi|\in E_i^d(w);\quad E_i^d\varphi\Rightarrow E_i\varphi;\quad\neg E_i^d\top;\quad E_i^d\varphi\equiv K_iE_i^d\varphi`,
    explanation: 'Deliberate effects are neighborhoods; constraints tie them to effects and to knowledge.',
    variables: [],
    examTips: 'No necessitation for Eᵢᵈ (it would yield Eᵢᵈ⊤).'
  },
  {
    id: 'form-manipulation',
    name: 'Manipulation (soft constructive, epistemic concealment)',
    course: 'course-3',
    lectureSlide: 'Part 3.4, Slide 15',
    latex: r`\mathrm{MCEK}^{\Sigma}_{i,j}\varphi=\bigvee_{\psi\in\Sigma}E_i^d\big(E_j\varphi\land\neg K_jE_i^dE_j\varphi\land\psi\big)`,
    explanation: 'Deliberate instrumentalization of j’s effect, together with concealment from j’s knowledge.',
    variables: [],
    examTips: 'Strong: Eⱼᵈ; soft: Eⱼ; destructive: ¬Eⱼ / ¬Eⱼᵈ; doxastic concealment: ¬Bⱼ.'
  },
  {
    id: 'form-coercion-persuasion-lie',
    name: 'Coercion, persuasion, credible lie',
    course: 'course-3',
    lectureSlide: 'Part 3.4, Slide 16',
    latex: r`\begin{array}{l}\mathrm{coe}=\bigvee_\psi E_i^d(E_j^d\varphi\land K_jE_i^dE_j^d\varphi\land\psi)\\ \mathrm{per}=\bigvee_\psi E_i^d(B_j\varphi\land\psi)\\ \mathrm{cre}=B_i\neg\varphi\land\bigvee_\psi E_i^d(B_j\varphi\land\neg K_jB_i\neg\varphi\land\psi)\end{array}`,
    explanation: 'Coercion: not concealed (Kⱼ). Persuasion: deliberate belief change. Credible lie: believing ¬φ, making j believe φ, hiding one’s belief.',
    variables: [],
    examTips: 'Persuasion has no concealment and no B_i¬φ; that is what separates it from lying.'
  }
];
