import { ExamQuestion } from '../types';

export const examQuestionsBank: ExamQuestion[] = [
  // ==================== CHAPTER 1 ====================
  {
    id: 'eq-1-01', courseId: 'course-1', deck: 1, category: 'MAS Fundamentals',
    question: 'Which definition of an agent matches the course?',
    type: 'single',
    options: [
      'An autonomous entity situated in an environment, able to perceive it, act in it and interact with other agents according to an organization',
      'A program that executes instructions sent by a central server',
      'Any object with sensors',
      'A neural network trained by reinforcement learning'
    ],
    correctAnswers: [0],
    explanation: 'Slide 5: autonomy, situatedness, perception, action and interaction according to an organization.',
    difficulty: 'foundation', sourceSlide: 5
  },
  {
    id: 'eq-1-02', courseId: 'course-1', deck: 1, category: 'MAS Fundamentals',
    question: 'A thermostat that switches heating on whenever the current temperature is below 19°C is a:',
    type: 'single',
    options: ['Simple reflex (reactive) agent', 'BDI agent', 'Hybrid agent', 'Mobile agent'],
    correctAnswers: [0],
    explanation: 'Condition-action rule on the current perception, no world model (slide 11).',
    difficulty: 'foundation', sourceSlide: 11
  },
  {
    id: 'eq-1-03', courseId: 'course-1', deck: 1, category: 'Reactive vs Cognitive',
    question: 'Which pairs are correct? (Select all.)',
    type: 'multiple',
    options: [
      'Reactive: no or minimal internal model, very fast',
      'Cognitive: explicit symbolic model, strong planning',
      'Hybrid: typical of autonomous robotics',
      'Reactive: high planning capacity'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Slide 46. Reactive agents have low planning capacity.',
    difficulty: 'foundation', sourceSlide: 46
  },
  {
    id: 'eq-1-04', courseId: 'course-1', deck: 1, category: 'BDI',
    question: 'In BDI, what turns a desire into an intention?',
    type: 'single',
    options: ['The agent selects it and commits to a plan for it', 'It becomes true in the world', 'Another agent requests it', 'It is perceived'],
    correctAnswers: [0],
    explanation: 'Intention = selected desire + plan the agent commits to (slides 29, 34, 38).',
    difficulty: 'foundation', sourceSlide: 38
  },
  {
    id: 'eq-1-05', courseId: 'course-1', deck: 1, category: 'BDI',
    question: 'Delivery robot: battery 28%, obstacle detected, package in Room C. Which intention should the improved BDI loop pursue now?',
    type: 'single',
    options: ['avoidCollision (plan: stop → turn → move)', 'deliverPackage', 'returnToBase', 'No intention: wait for the next perception'],
    correctAnswers: [0],
    explanation: 'Slide 35: the obstacle belief makes avoidCollision the selected desire, with plan stop → turn → move.',
    difficulty: 'intermediate', sourceSlide: 35
  },
  {
    id: 'eq-1-06', courseId: 'course-1', deck: 1, category: 'Environment',
    question: 'The course characterizes a computer network environment as:',
    type: 'single',
    options: ['Accessible, deterministic, dynamic, discrete', 'Inaccessible, non-deterministic, dynamic, continuous', 'Accessible, deterministic, static, discrete', 'Partially accessible, non-deterministic, static, continuous'],
    correctAnswers: [0],
    explanation: 'Slide 53. The third option is chess; the second is the exploration robot.',
    difficulty: 'intermediate', sourceSlide: 53
  },
  {
    id: 'eq-1-07', courseId: 'course-1', deck: 1, category: 'Interaction',
    question: 'Two agents have incompatible goals and both have sufficient resources and skills. The situation is:',
    type: 'single',
    options: ['Pure competition', 'Cooperation', 'Conflict', 'Independence'],
    correctAnswers: [0],
    explanation: 'Slide 63: incompatible goals + sufficient resources and skills = pure competition.',
    difficulty: 'intermediate', sourceSlide: 63
  },
  {
    id: 'eq-1-08', courseId: 'course-1', deck: 2, category: 'Organizations',
    question: 'Which organizational form gives scalable delegation and clear accountability, but slower adaptation when information must climb levels?',
    type: 'single',
    options: ['Hierarchical', 'Centralized', 'Peer-to-peer', 'Market-based'],
    correctAnswers: [0],
    explanation: 'Slide 5.',
    difficulty: 'foundation', sourceSlide: 5
  },
  {
    id: 'eq-1-09', courseId: 'course-1', deck: 2, category: 'Organizations',
    question: 'Drones mapping a forest fire adjust their sectors from nearby drones and battery status, with no leader. This is:',
    type: 'single',
    options: ['Peer-to-peer (heterarchical)', 'Holonic', 'Centralized', 'Coalition'],
    correctAnswers: [0],
    explanation: 'Slide 6: local negotiation replaces command; robustness from redundant paths.',
    difficulty: 'foundation', sourceSlide: 6
  },
  // ==================== CHAPTER 2 ====================
  {
    id: 'eq-2-01', courseId: 'course-2', deck: 3, category: 'Reputation',
    question: 'Agent i has 3 positive and 1 negative interactions with j; witness k (credibility 0.5) reports 4 positive and 2 negative. What is R_i(j)?',
    type: 'calculation',
    options: ['6/9 ≈ 0.667', '5/7 ≈ 0.714', '8/13 ≈ 0.615', '6/10 = 0.6'],
    correctAnswers: [0],
    explanation: 'P = 3 + 0.5·4 = 5 and N = 1 + 0.5·2 = 2, so R = (1 + 5)/(2 + 5 + 2) = 6/9 ≈ 0.667. 5/7 forgets the prior (+1/+2).',
    difficulty: 'intermediate', sourceSlide: 7
  },
  {
    id: 'eq-2-02', courseId: 'course-2', deck: 3, category: 'Reputation',
    question: 'Fake identities created by an agent to praise itself are an example of:',
    type: 'single',
    options: ['Self-promotion (via a Sybil attack)', 'Promotion by allies', 'Defamation', 'Whitewashing'],
    correctAnswers: [0],
    explanation: 'Slide 5: self-promotion = fake identities praise you; promotion = real allies inflate your score.',
    difficulty: 'foundation', sourceSlide: 5
  },
  {
    id: 'eq-2-03', courseId: 'course-2', deck: 3, category: 'Reputation',
    question: 'In the Beta formula, what happens to R when a witness with credibility 0 reports 100 positive interactions?',
    type: 'single',
    options: ['Nothing: weight 0 removes the report', 'R increases a lot', 'R decreases', 'R becomes 1'],
    correctAnswers: [0],
    explanation: 'Credibility multiplies the witness counts in both numerator and denominator; c = 0 cancels them. This is why giving new identities zero credibility defeats Sybils.',
    difficulty: 'intermediate', sourceSlide: 7
  },
  {
    id: 'eq-2-04', courseId: 'course-2', deck: 4, category: 'Voting',
    question: 'Profile: 3 voters A≻B≻C, 2 voters B≻C≻A, 2 voters C≻B≻A. Borda winner (2, 1, 0 points)?',
    type: 'calculation',
    options: ['B (9 points)', 'A (6 points)', 'C (6 points)', 'Tie A–B'],
    correctAnswers: [0],
    explanation: 'A = 3·2 = 6. B = 3·1 + 2·2 + 2·1 = 9. C = 2·1 + 2·2 = 6. B wins although A is the plurality winner.',
    difficulty: 'intermediate', sourceSlide: 10
  },
  {
    id: 'eq-2-05', courseId: 'course-2', deck: 4, category: 'Voting',
    question: 'Same profile (3 A≻B≻C, 2 B≻C≻A, 2 C≻B≻A). Is there a Condorcet winner?',
    type: 'single',
    options: ['Yes, B: it beats A 4–3 and C 5–2', 'Yes, A: it has the most first places', 'No, there is a cycle', 'Yes, C'],
    correctAnswers: [0],
    explanation: 'B vs A: 4 voters (2 + 2) prefer B. B vs C: 3 + 2 = 5 prefer B. So B wins every pairwise contest.',
    difficulty: 'advanced', sourceSlide: 12
  },
  {
    id: 'eq-2-06', courseId: 'course-2', deck: 4, category: 'Voting',
    question: 'Which rules use the full ranking of each voter? (Select all.)',
    type: 'multiple',
    options: ['Borda', 'Condorcet', 'Instant-runoff', 'Plurality'],
    correctAnswers: [0, 1, 2],
    explanation: 'Plurality only uses the top preference (slide 14).',
    difficulty: 'foundation', sourceSlide: 14
  },
  {
    id: 'eq-2-07', courseId: 'course-2', deck: 4, category: 'Voting manipulation',
    question: 'Why can changing only the lower part of a ranking change the Borda winner?',
    type: 'single',
    options: [
      'Every rank gives points, so burying a rival removes points from it',
      'Because Borda ignores lower ranks',
      'Because of Sybil votes',
      'It cannot'
    ],
    correctAnswers: [0],
    explanation: 'Agent 1 moved B from 2nd to last, removing 2 points from B (slides 17–18).',
    difficulty: 'intermediate', sourceSlide: 18
  },
  {
    id: 'eq-2-08', courseId: 'course-2', deck: 5, category: 'Game Theory',
    question: 'Consider the game (P1 rows, P2 columns): (U,L) = (3,3), (U,R) = (0,5), (D,L) = (5,0), (D,R) = (1,1). Pure Nash equilibria?',
    type: 'single',
    options: ['(D,R) only', '(U,L) only', '(U,L) and (D,R)', 'None'],
    correctAnswers: [0],
    explanation: 'It is a Prisoner’s Dilemma: D dominates U for P1 (5 > 3, 1 > 0) and R dominates L for P2. (U,L) is better for both but not stable.',
    difficulty: 'intermediate', sourceSlide: 15
  },
  {
    id: 'eq-2-09', courseId: 'course-2', deck: 5, category: 'Game Theory',
    question: 'Coordination game: (A,A) = (2,2), (A,B) = (0,0), (B,A) = (0,0), (B,B) = (1,1). Pure Nash equilibria?',
    type: 'single',
    options: ['(A,A) and (B,B)', '(A,A) only', 'None', 'All four profiles'],
    correctAnswers: [0],
    explanation: 'At (A,A) and (B,B) any unilateral deviation drops to 0. A game can have several NE; uniqueness is not guaranteed.',
    difficulty: 'intermediate', sourceSlide: 13
  },
  {
    id: 'eq-2-10', courseId: 'course-2', deck: 5, category: 'Game Theory',
    question: 'Which statement about Nash equilibria is correct?',
    type: 'single',
    options: [
      'An NE is stable but not necessarily fair, efficient or collectively optimal',
      'An NE always maximizes the sum of utilities',
      'An NE requires cooperation',
      'An NE is always unique'
    ],
    correctAnswers: [0],
    explanation: 'Slide 11, “important warning”.',
    difficulty: 'foundation', sourceSlide: 11
  },
  {
    id: 'eq-2-11', courseId: 'course-2', deck: 5, category: 'Norms',
    question: 'Supervisor game with m = 10, p = 6, r = 5, c = 3, a = 4, b = 2, q = 2. Is (S, H) the unique Nash equilibrium?',
    type: 'single',
    options: ['Yes: a > c (4 > 3), p + r > m (11 > 10), b + q > c (4 > 3)', 'No: m > p', 'No: (S̄, H) is also an NE', 'No: c > b'],
    correctAnswers: [0],
    explanation: 'All three strict conditions hold, so S is strictly dominant for the supervisor and H is the company’s best response.',
    difficulty: 'advanced', sourceSlide: 20
  },
  // ==================== CHAPTER 3 ====================
  {
    id: 'eq-3-01', courseId: 'course-3', deck: 6, category: 'KBE Syntax',
    question: 'Which expressions are KBE well-formed formulas? (Select all.)',
    type: 'multiple',
    options: ['K_i B_j (p ⇒ q)', 'E_i^d ((K_j p ∨ ¬B_j q) ∧ E_j r)', '(p ∧ B_i)', '¬(p ∨)'],
    correctAnswers: [0, 1],
    explanation: 'The last two are missing an argument (slides 9–10).',
    difficulty: 'foundation', sourceSlide: 9
  },
  {
    id: 'eq-3-02', courseId: 'course-3', deck: 6, category: 'Model Checking',
    question: 'W = {w, v, u}, R = {(w,v), (w,u), (v,v), (u,u)}, p true at v only. At w:',
    type: 'single',
    options: ['◇p true, □p false', '□p true', '◇p false', '□¬p true'],
    correctAnswers: [0],
    explanation: 'Successors of w: v (p) and u (¬p). Some successor has p, not all.',
    difficulty: 'foundation', sourceSlide: 17
  },
  {
    id: 'eq-3-03', courseId: 'course-3', deck: 6, category: 'Model Checking',
    question: 'W = {w, v}, R = {(w,v)} only, p false everywhere. At w, which are true? (Select all.)',
    type: 'multiple',
    options: ['□¬p', '◇¬p', '□□p', '◇◇p'],
    correctAnswers: [0, 1, 2],
    explanation: 'v has ¬p, so □¬p and ◇¬p hold at w. v has no successor, so □p is vacuously true at v, hence □□p at w. ◇p is false at v, so ◇◇p is false at w.',
    difficulty: 'advanced', sourceSlide: 17
  },
  {
    id: 'eq-3-04', courseId: 'course-3', deck: 6, category: 'Correspondence',
    question: 'To prove “F ⊨ ¬Kp ⇒ K¬Kp implies R is Euclidean” by contraposition, which countermodel is used given wRv, wRu, ¬vRu?',
    type: 'single',
    options: ['V(p) = R(v)', 'V(p) = R(w)', 'V(p) = {w}', 'V(p) = ∅'],
    correctAnswers: [0],
    explanation: 'Slide 34: p false at u gives ¬Kp at w; Kp at v makes K¬Kp false at w.',
    difficulty: 'advanced', sourceSlide: 34
  },
  {
    id: 'eq-3-05', courseId: 'course-3', deck: 6, category: 'Correspondence',
    question: 'Which axiom is valid on every Kripke frame, without any condition on R?',
    type: 'single',
    options: ['K: □(φ ⇒ ψ) ⇒ (□φ ⇒ □ψ)', 'T: □φ ⇒ φ', 'D: □φ ⇒ ◇φ', '4: □φ ⇒ □□φ'],
    correctAnswers: [0],
    explanation: 'Slide 37.',
    difficulty: 'foundation', sourceSlide: 37
  },
  {
    id: 'eq-3-06', courseId: 'course-3', deck: 6, category: 'S5',
    question: 'Which of the following are inference rules of S5 as required in the exam? (Select all.)',
    type: 'multiple',
    options: ['Modus Ponens', 'Uniform Substitution', 'Necessitation', 'From φ infer Kφ for any assumption φ'],
    correctAnswers: [0, 1, 2],
    explanation: 'Necessitation only applies to theorems, not to assumptions.',
    difficulty: 'foundation', sourceSlide: 39
  },
  {
    id: 'eq-3-07', courseId: 'course-3', deck: 6, category: 'S5',
    question: 'In the S5 derivation of φ ⇒ K¬K¬φ, which two modal axioms are used?',
    type: 'single',
    options: ['T and 5', '4 and 5', 'K and 4', 'T and 4'],
    correctAnswers: [0],
    explanation: 'Slide 40: T with ¬φ gives φ ⇒ ¬K¬φ; 5 with ¬φ gives ¬K¬φ ⇒ K¬K¬φ.',
    difficulty: 'intermediate', sourceSlide: 40
  },
  {
    id: 'eq-3-08', courseId: 'course-3', deck: 7, category: 'KD45',
    question: 'Which formula is satisfiable in KD45 but not in S5?',
    type: 'single',
    options: ['Bp ∧ ¬p', 'Bp ∧ B¬p', 'Bp ∧ ¬BBp', '¬Bp ∧ ¬B¬Bp'],
    correctAnswers: [0],
    explanation: 'False belief is allowed (no reflexivity). The others contradict D, 4 and 5 respectively, which KD45 validates.',
    difficulty: 'intermediate', sourceSlide: 2
  },
  {
    id: 'eq-3-09', courseId: 'course-3', deck: 7, category: 'KD45',
    question: 'Which frame property validates D: Bφ → ¬B¬φ, and what does D exclude?',
    type: 'single',
    options: ['Seriality; it excludes contradictory beliefs (B⊥)', 'Reflexivity; it excludes false beliefs', 'Transitivity; it excludes doubt', 'Euclideanness; it excludes ignorance'],
    correctAnswers: [0],
    explanation: 'Slide 7.',
    difficulty: 'foundation', sourceSlide: 7
  },
  {
    id: 'eq-3-10', courseId: 'course-3', deck: 8, category: 'STIT',
    question: 'In the TD game, P1’s cells are {w₁,w₂} (T) and {w₃,w₄} (C); q is true only at w₃. At w₁, which holds?',
    type: 'single',
    options: ['[1]¬q', '[1]q', '[1]p', '¬[1]¬q'],
    correctAnswers: [0],
    explanation: '¬q holds at w₁ and w₂, i.e. throughout P1’s T-cell.',
    difficulty: 'intermediate', sourceSlide: 14
  },
  {
    id: 'eq-3-11', courseId: 'course-3', deck: 8, category: 'STIT',
    question: 'Why is E_i an S5 modality in the choice-partition semantics?',
    type: 'single',
    options: ['“Being in the same choice cell” is an equivalence relation', 'Because choices are deliberate', 'Because the frame is serial only', 'Because of independence of agents'],
    correctAnswers: [0],
    explanation: 'Slides 14 and 17: partitions induce equivalence relations, which validate T, 4 and 5.',
    difficulty: 'foundation', sourceSlide: 17
  },
  {
    id: 'eq-3-12', courseId: 'course-3', deck: 8, category: 'Neighborhoods',
    question: 'W = {a,b}, p true at a only, N(a) = {{a}}, N(b) = {{a,b}}. Where is □p true?',
    type: 'single',
    options: ['At a only', 'At b only', 'At a and b', 'Nowhere'],
    correctAnswers: [0],
    explanation: '⟦p⟧ = {a}; {a} ∈ N(a) but {a} ∉ N(b).',
    difficulty: 'intermediate', sourceSlide: 24
  },
  {
    id: 'eq-3-13', courseId: 'course-3', deck: 8, category: 'Neighborhoods',
    question: 'Same model (N(a) = {{a}}, N(b) = {{a,b}}): where is □⊤ true?',
    type: 'single',
    options: ['At b only', 'At a only', 'Everywhere', 'Nowhere'],
    correctAnswers: [0],
    explanation: '⟦⊤⟧ = W = {a,b}, a member of N(b) only. Note BIAT would forbid W ∈ N(b).',
    difficulty: 'advanced', sourceSlide: 25
  },
  {
    id: 'eq-3-14', courseId: 'course-3', deck: 9, category: 'KBE',
    question: 'Which formula expresses soft destructive instrumentalization by i of j about φ?',
    type: 'single',
    options: ['E_i^d ¬E_j φ', 'E_i^d E_j φ', 'E_i^d ¬E_j^d φ', 'E_i ¬E_j φ'],
    correctAnswers: [0],
    explanation: 'Slide 14: destructive = negation; soft = E_j; deliberate = E_i^d.',
    difficulty: 'intermediate', sourceSlide: 14
  },
  {
    id: 'eq-3-15', courseId: 'course-3', deck: 9, category: 'KBE',
    question: 'Which formula is a credible lie by i to j about φ (with ψ ∈ Σ)?',
    type: 'single',
    options: [
      'B_i ¬φ ∧ ⋁ E_i^d(B_j φ ∧ ¬K_j B_i ¬φ ∧ ψ)',
      '⋁ E_i^d(B_j φ ∧ ψ)',
      '⋁ E_i^d(E_j^d φ ∧ K_j E_i^d E_j^d φ ∧ ψ)',
      'B_i φ ∧ E_i^d B_j φ'
    ],
    correctAnswers: [0],
    explanation: 'Slide 16. The second is persuasion and the third coercion.',
    difficulty: 'intermediate', sourceSlide: 16
  },
  {
    id: 'eq-3-16', courseId: 'course-3', deck: 9, category: 'KBE',
    question: 'Doxastic concealment is stronger than epistemic concealment because:',
    type: 'single',
    options: ['K_j ψ ⇒ B_j ψ, so ¬B_j ψ implies ¬K_j ψ', 'B_j ψ ⇒ K_j ψ', 'Belief is factive', 'They are equivalent'],
    correctAnswers: [0],
    explanation: 'KBE has K_i φ ⇒ B_i φ; by contraposition, not even believing implies not knowing.',
    difficulty: 'advanced', sourceSlide: 12
  },
  {
    id: 'eq-3-17', courseId: 'course-3', deck: 10, category: 'TD',
    question: 'TD Ex. 1: why is □p → p false at w₃?',
    type: 'single',
    options: ['w₃ has no successor so □p is vacuously true, while p is false at w₃', 'Because p is true at w₃', 'Because w₃ has a loop', 'It is true at w₃'],
    correctAnswers: [0],
    explanation: 'V(p) = {w₀, w₁}; w₃ ∉ V(p) and Succ(w₃) = ∅.',
    difficulty: 'intermediate', sourceSlide: 1
  }
];
