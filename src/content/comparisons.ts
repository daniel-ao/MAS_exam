const r = String.raw;

export interface ComparisonTopic {
  id: string;
  title: string;
  subtitle: string;
  lectureRef: string;
  deck: number;
  slideNum: number;
  lessonId: string;
  items: {
    name: string;
    badge: string;
    summary: string;
    mathFormula?: string;
    pros: string[];
    cons: string[];
  }[];
  dimensions: {
    criteria: string;
    item1Value: string;
    item2Value: string;
    item3Value?: string;
  }[];
  examTrap: string;
}

export const COMPARISONS: ComparisonTopic[] = [
  {
    id: 'reactive-cognitive-hybrid',
    title: 'Reactive vs Cognitive vs Hybrid Agents',
    subtitle: 'The speed / reasoning trade-off of agent architectures',
    lectureRef: 'Part 1.1, Slide 46',
    deck: 1,
    slideNum: 46,
    lessonId: 'lesson-1-3-3',
    items: [
      { name: 'Reactive', badge: 'perception → action', summary: 'Condition-action rules, subsumption layers or flocking forces, with no world model.', pros: ['Very fast', 'Robust in dynamic environments', 'Emergent collective behavior'], cons: ['Little planning', 'Hard to pursue long-term goals'] },
      { name: 'Cognitive (BDI)', badge: 'beliefs → desires → intentions', summary: 'Explicit symbolic model; deliberates and commits to plans.', pros: ['Goal-directed planning', 'Explainable decisions'], cons: ['Slower', 'Needs a reliable world model'] },
      { name: 'Hybrid', badge: 'layers', summary: 'A reactive layer for urgencies under a deliberative layer for planning.', pros: ['Balanced speed', 'Moderate to high planning'], cons: ['More complex to design and arbitrate'] }
    ],
    dimensions: [
      { criteria: 'Internal model', item1Value: 'Absent or minimal', item2Value: 'Explicit and symbolic', item3Value: 'Partial, depending on the layers' },
      { criteria: 'Speed', item1Value: 'Very fast', item2Value: 'Slower', item3Value: 'Balanced' },
      { criteria: 'Planning', item1Value: 'Low', item2Value: 'High', item3Value: 'Moderate to high' },
      { criteria: 'Typical use', item1Value: 'Real-time, reflexes', item2Value: 'Complex reasoning', item3Value: 'Autonomous robotics' }
    ],
    examTrap: 'A BDI agent is cognitive, not reactive, even if its loop reacts to perceptions: what matters is the explicit belief base and plan commitment.'
  },
  {
    id: 'organizations',
    title: 'Centralized vs Hierarchical vs Peer-to-Peer',
    subtitle: 'Where authority lives (see also market, coalition and holonic forms)',
    lectureRef: 'Part 1.2, Slides 4–6, 10',
    deck: 2,
    slideNum: 10,
    lessonId: 'lesson-1-5-4',
    items: [
      { name: 'Centralized', badge: 'star', summary: 'One coordinator with global visibility assigns actions.', pros: ['Simple global optimization', 'Easy conflict resolution and debugging'], cons: ['Bottleneck', 'Single point of failure', 'Less autonomy'] },
      { name: 'Hierarchical', badge: 'tree', summary: 'Goals descend through strategic, tactical and operational levels; status ascends.', pros: ['Scalable delegation', 'Clear accountability'], cons: ['Slower adaptation when information must climb levels'] },
      { name: 'Peer-to-peer', badge: 'mesh', summary: 'No permanent leader; local negotiation and rules.', pros: ['Resilience through redundant paths', 'Local adaptation, emergence'], cons: ['No global optimum guaranteed', 'Coordination overhead'] }
    ],
    dimensions: [
      { criteria: 'Best fit', item1Value: 'Small team, clear global objective', item2Value: 'Many agents with stable responsibilities', item3Value: 'Dynamic environment, partial information' },
      { criteria: 'Knowledge', item1Value: 'Global at the center', item2Value: 'Aggregated by level', item3Value: 'Local and distributed' },
      { criteria: 'What can fail', item1Value: 'The coordinator', item2Value: 'Upper levels, slow escalation', item3Value: 'Links (but redundant)' },
      { criteria: 'Example', item1Value: 'Supervisor dispatching support tickets', item2Value: 'Warehouse: scheduler → zone lead → robot', item3Value: 'Drones mapping a forest fire' }
    ],
    examTrap: 'Market-based fits uncertain costs/scarce resources (agents reveal preferences through bids); coalition fits independent organizations; holonic fits nested systems.'
  },
  {
    id: 'voting-rules',
    title: 'Plurality vs Borda vs Condorcet',
    subtitle: 'What information each voting rule uses, and how it can be manipulated',
    lectureRef: 'Part 2.2, Slides 13–14',
    deck: 4,
    slideNum: 13,
    lessonId: 'lesson-2-2-3',
    items: [
      { name: 'Plurality', badge: 'top choice only', summary: 'One point to each voter’s first choice; most points wins.', mathFormula: r`g(o)=|\{i: o\text{ first in }\succ_i\}|`, pros: ['Simple', 'No absolute majority needed'], cons: ['Ignores lower preferences', 'Can elect a Condorcet loser', 'Sybil votes shift it directly'] },
      { name: 'Borda', badge: 'all ranks', summary: 'm−1, …, 0 points by rank; highest total wins.', mathFormula: r`g(o)=\sum_i (m-\mathrm{rank}_i(o))`, pros: ['Uses the full ranking', 'Rewards consensus candidates'], cons: ['Manipulable by burying a rival in lower ranks'] },
      { name: 'Condorcet', badge: 'pairwise majorities', summary: 'Winner beats every other alternative head-to-head.', pros: ['Strong majoritarian justification'], cons: ['A Condorcet winner may not exist (cycles)'] }
    ],
    dimensions: [
      { criteria: 'Ballot', item1Value: 'Choose one', item2Value: 'Rank all', item3Value: 'Rank all' },
      { criteria: 'Winning criterion', item1Value: 'Most first-choice votes', item2Value: 'Highest total score', item3Value: 'Wins every pairwise contest' },
      { criteria: 'Slide 20 profile (4 A≻B≻C, 3 B≻C≻A, 2 C≻B≻A)', item1Value: 'A (4 votes)', item2Value: 'B (A 8, B 12, C 7)', item3Value: 'B (beats A 5–4, C 7–2)' },
      { criteria: 'Typical manipulation', item1Value: 'Sybil votes, voting for a viable second choice', item2Value: 'Burying the main rival last', item3Value: 'Creating or breaking a cycle' }
    ],
    examTrap: 'In the slide 20 profile, the plurality winner A loses BOTH pairwise contests: plurality can elect a Condorcet loser.'
  },
  {
    id: 'nash-vs-maximin',
    title: 'Nash Equilibrium vs Maximin vs Social Optimum',
    subtitle: 'Three different reasons to pick an action',
    lectureRef: 'Part 2.3, Slides 11–16 · TD Ex. 5',
    deck: 5,
    slideNum: 16,
    lessonId: 'lesson-2-3-3',
    items: [
      { name: 'Nash equilibrium', badge: 'no unilateral gain', summary: 'Each strategy is a best response to the others.', mathFormula: r`\mu_i(s_i,s_{-i})\ge\mu_i(s'_i,s_{-i})`, pros: ['Predicts stable behavior'], cons: ['May be inefficient (PD)', 'May not be unique'] },
      { name: 'Maximin', badge: 'best worst case', summary: 'Pick the choice whose worst outcome is best, comparing sets of outcomes ex ante.', mathFormula: r`\arg\max_{A}\min_{w\in A}u_i(w)`, pros: ['Needs no prediction of the opponent'], cons: ['Very pessimistic'] },
      { name: 'Social optimum', badge: 'best for the group', summary: 'Outcome that no alternative improves for everyone (e.g. mutual silence).', pros: ['Collectively efficient'], cons: ['Often not stable without norms or trust'] }
    ],
    dimensions: [
      { criteria: 'Compares', item1Value: 'Responses to a FIXED opposing strategy', item2Value: 'Worst outcomes of each own choice', item3Value: 'Collective outcomes' },
      { criteria: 'Prisoner’s Dilemma', item1Value: '(B,B): (−5,−5)', item2Value: 'B (worst −5 vs −10)', item3Value: '(C,C): (−2,−2)' },
      { criteria: 'TD game (T/C)', item1Value: '(T,T)', item2Value: 'T (min 1 vs 0)', item3Value: '(C,C) shares r with (T,T); needs extra info to compare' }
    ],
    examTrap: 'Nash and maximin both pick (T,T) in the TD game, but they are NOT the same concept: maximin is ex ante worst-case, Nash is a fixed-point of best responses.'
  },
  {
    id: 's5-vs-kd45',
    title: 'Knowledge (S5) vs Belief (KD45)',
    subtitle: 'Two normal modal logics for two mental attitudes',
    lectureRef: 'Part 3.2, Slide 10',
    deck: 7,
    slideNum: 10,
    lessonId: 'lesson-3-6-3',
    items: [
      { name: 'S5 knowledge', badge: 'equivalence relation', summary: 'Reflexive, transitive, Euclidean (= reflexive, symmetric, transitive). Knowledge is factive.', mathFormula: r`K\varphi\to\varphi`, pros: ['Truthful', 'Full introspection'], cons: ['Logical omniscience', 'Cannot model mistakes'] },
      { name: 'KD45 belief', badge: 'serial, transitive, Euclidean', summary: 'Consistent, introspective, but possibly false.', mathFormula: r`B\varphi\to\neg B\neg\varphi`, pros: ['Models false beliefs (Bφ ∧ ¬φ)', 'Allows suspension of judgment'], cons: ['Still logically omniscient and perfectly introspective'] }
    ],
    dimensions: [
      { criteria: 'Frames', item1Value: 'Reflexive + transitive + Euclidean', item2Value: 'Serial + transitive + Euclidean' },
      { criteria: 'Consistency (D)', item1Value: r`$K\varphi\to\neg K\neg\varphi$ valid`, item2Value: r`$B\varphi\to\neg B\neg\varphi$ valid` },
      { criteria: 'Positive introspection (4)', item1Value: r`$K\varphi\to KK\varphi$`, item2Value: r`$B\varphi\to BB\varphi$` },
      { criteria: 'Negative introspection (5)', item1Value: r`$\neg K\varphi\to K\neg K\varphi$`, item2Value: r`$\neg B\varphi\to B\neg B\varphi$` },
      { criteria: 'Factivity (T)', item1Value: 'Valid', item2Value: 'NOT valid' },
      { criteria: 'Minimal model of a false belief', item1Value: 'Impossible', item2Value: r`$W=\{w,v\}$, $R=\{(w,v),(v,v)\}$, $p$ at $v$` }
    ],
    examTrap: 'D needs SERIALITY, not reflexivity. Every S5 frame is KD45, but not conversely.'
  },
  {
    id: 'stit-vs-biat',
    title: 'STIT Eᵢ (Kripke) vs BIAT / Eᵢᵈ (Neighborhoods)',
    subtitle: 'Guaranteed effects vs attributed deliberate achievements',
    lectureRef: 'Part 3.3, Slide 23',
    deck: 8,
    slideNum: 23,
    lessonId: 'lesson-3-7-4',
    items: [
      { name: 'STIT Eᵢ', badge: 'choice cells', summary: 'φ holds throughout agent i’s choice cell.', mathFormula: r`E_i\varphi\iff C_i(w)\subseteq\llbracket\varphi\rrbracket`, pros: ['Normal S5 logic (K, T, 4, 5)', 'Closed under consequence'], cons: ['Eᵢ⊤ valid: tautologies count as effects', 'Says nothing about intention'] },
      { name: 'BIAT BAᵢ / KBE Eᵢᵈ', badge: 'neighborhoods', summary: 'The truth set of φ must be a member of N(w).', mathFormula: r`\mathsf{BA}_i\varphi\iff\llbracket\varphi\rrbracket\in N_i(w)`, pros: ['¬BA⊤: no trivial achievements', 'Selective attribution (not upward closed)'], cons: ['Non-normal: K, 4, 5 fail', 'Extensional: same truth set, same verdict'] }
    ],
    dimensions: [
      { criteria: 'Semantics', item1Value: 'Equivalence relations / partitions', item2Value: 'Neighborhood functions' },
      { criteria: 'Tautologies', item1Value: r`$E_i\top$ valid`, item2Value: r`$\neg\mathsf{BA}_i\top$ valid` },
      { criteria: 'Consequence', item1Value: r`$E_ip\to E_i(p\lor q)$ valid`, item2Value: r`$\mathsf{BA}_ip\land\neg\mathsf{BA}_i(p\lor q)$ possible` },
      { criteria: 'Model checking', item1Value: 'Check φ on every world of the cell', item2Value: 'Compute ⟦φ⟧, test membership in N(w)' }
    ],
    examTrap: 'In neighborhood semantics ◇ is not “some accessible world”: with N(w) = ∅, every □ is false and ◇⊥ is true.'
  },
  {
    id: 'manipulation-family',
    title: 'Manipulation vs Coercion vs Persuasion',
    subtitle: 'KBE separates them by what is deliberate and what is concealed',
    lectureRef: 'Part 3.4, Slides 14–16',
    deck: 9,
    slideNum: 16,
    lessonId: 'lesson-3-8-3',
    items: [
      { name: 'Manipulation', badge: 'instrumentalize + conceal', summary: 'Deliberately makes j (not) bring about φ while j does not know/believe it.', mathFormula: r`E_i^d(E_j\varphi\land\neg K_jE_i^dE_j\varphi\land\psi)`, pros: ['Premeditation: Eᵢᵈ', 'Instrumentalization: Eⱼ / Eⱼᵈ (or their negation)'], cons: ['Concealment: ¬Kⱼ or ¬Bⱼ is required'] },
      { name: 'Coercion', badge: 'instrumentalize, NOT concealed', summary: 'Same instrumentalization, but the victim knows it.', mathFormula: r`E_i^d(E_j^d\varphi\land K_jE_i^dE_j^d\varphi\land\psi)`, pros: ['Deliberate and instrumentalizing'], cons: ['Not concealed: Kⱼ replaces ¬Kⱼ'] },
      { name: 'Persuasion / lie', badge: 'belief change', summary: 'Persuasion: deliberately make j believe φ. A credible lie adds Bᵢ¬φ and hides it.', mathFormula: r`E_i^d(B_j\varphi\land\psi)`, pros: ['Acts on beliefs only'], cons: ['Persuasion has no concealment', 'A lie requires Bᵢ¬φ ∧ ¬KⱼBᵢ¬φ'] }
    ],
    dimensions: [
      { criteria: 'Target', item1Value: 'j’s effects / deliberate effects', item2Value: 'j’s deliberate effects', item3Value: 'j’s beliefs' },
      { criteria: 'Concealment', item1Value: r`$\neg K_j$ (epistemic) or $\neg B_j$ (doxastic)`, item2Value: r`None: $K_j$`, item3Value: r`Persuasion: none; lie: $\neg K_jB_i\neg\varphi$` },
      { criteria: 'Manipulator’s own belief', item1Value: 'Not required', item2Value: 'Not required', item3Value: r`Lie: $B_i\neg\varphi$` }
    ],
    examTrap: 'Strong = Eⱼᵈ, soft = Eⱼ; constructive = no negation, destructive = ¬Eⱼ / ¬Eⱼᵈ. Doxastic concealment (¬Bⱼ) is stronger than epistemic (¬Kⱼ).'
  }
];
