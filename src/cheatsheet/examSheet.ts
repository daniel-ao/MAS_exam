/**
 * The one-sheet (recto/verso) revision sheet: every definition, formula and number
 * worth copying by hand onto one A4 sheet. Each item is 1–2 sentences max.
 * `$...$` is rendered with KaTeX.
 */

export interface SheetItem {
  /** Term or label, rendered bold. */
  t: string;
  /** One- or two-sentence definition / formula. */
  d: string;
}

export interface SheetSection {
  title: string;
  /** Chapter number, used for the colour accent. */
  course: 1 | 2 | 3;
  items: SheetItem[];
}

export interface SheetSide {
  label: string;
  sections: SheetSection[];
}

export const examSheet: SheetSide[] = [
  {
    label: 'Recto: Ch. 1 Agents, BDI, Organizations · Ch. 2 Reputation, Voting, Games',
    sections: [
      {
        title: 'MAS & agents',
        course: 1,
        items: [
          { t: 'MAS', d: 'Distributes decision-making among autonomous agents → scalability, robustness, adaptability. 4 pillars: Agent, Environment, Interaction, Organization.' },
          { t: 'Agent', d: 'Autonomous, natural or artificial entity situated in an environment; perceives it, acts in it, interacts with others according to an organization.' },
          { t: '6 properties', d: 'Autonomy, reactivity, proactivity, social ability, adaptability, situatedness. Types: software, physical, mobile.' },
          { t: 'Reactive', d: 'Perception → action, no complex model; simple reflex (thermostat), subsumption (priority layers, higher suppresses lower), flocking.' },
          { t: 'Flocking', d: 'Separation (away, ∝1/d), alignment (avg velocity − v), cohesion (to center − v); $v\\leftarrow$ limit$(v+\\sum w F)$, $p\\leftarrow p+v\\Delta t$. Emergence.' },
          { t: 'Stigmergy', d: 'Indirect coordination via traces in the environment (pheromones), “the work inspires the worker”.' },
          { t: 'Reactive / Cognitive / Hybrid', d: 'Model none / symbolic / partial; speed very fast / slower / balanced; planning low / high / moderate-high; reflexes / reasoning / robotics.' }
        ]
      },
      {
        title: 'BDI',
        course: 1,
        items: [
          { t: 'B, D, I', d: 'Beliefs = representation of the world; Desires = goals wished; Intentions = selected desire + committed plan (Rao & Georgeff 1991).' },
          { t: 'Data', d: 'Belief (name, value, confidence, timestamp); Desire (goal, priority, condition); Intention (desire, plan, step, status).' },
          { t: 'Loop', d: 'Perceive → update beliefs → generate desires → select (highest priority) → find plan → commit intention → execute next action.' },
          { t: 'Reconsider', d: 'Re-deliberate only if no intention or it is impossible; drop it once achieved. UML: BDIAgent owns BeliefBase, List<Desire>, Intention, PlanLibrary.' }
        ]
      },
      {
        title: 'Environment, interaction, organization',
        course: 1,
        items: [
          { t: 'Environment', d: 'Everything that is not the agent. Accessible?, deterministic?, static?, discrete? Chess: A, D, S, Disc. Rover: I, ND, Dyn, Cont. Network: A, D, Dyn, Disc.' },
          { t: 'MAS axes', d: 'Open/closed, homogeneous/heterogeneous, centralized/decentralized.' },
          { t: 'Situations', d: 'Compatible goals: enough res.+skills → independence, else cooperation. Incompatible: pure competition / negotiation (res. OR skills lacking) / conflict (AND).' },
          { t: 'Organization', d: 'Roles, authority, communication, coordination, norms. Centralized (star), hierarchical (tree), P2P (mesh), market (bid), coalition (alliance), holonic (nested).' },
          { t: 'Choose', d: 'Small team → central; stable roles → hierarchy; dynamic partial info → P2P; scarce/uncertain costs → market; independent orgs → coalition; nested → holonic.' }
        ]
      },
      {
        title: 'Reputation',
        course: 2,
        items: [
          { t: 'Anatomy', d: 'Private objective → strategic signal → mechanism → shifted outcome. The mechanism assumes inputs are sincere and identity-valid.' },
          { t: 'Attacks', d: 'Identity: Sybil, whitewashing. Testimony: promotion, self-promotion, defamation. Timing: betrayal. Defences: design, detection, complexity barriers, incentives.' },
          { t: 'Beta', d: '$R_i(j)=\\frac{1+p_{ij}+\\sum_k c_{ik}p_{kj}}{2+p_{ij}+n_{ij}+\\sum_k c_{ik}(p_{kj}+n_{kj})}$; no evidence → 1/2.' },
          { t: 'Alice–Bob', d: '$P=6+3$, $N=4+2$: $10/17\\approx0.588<0.70$ reject. 3 Sybils × 3+: $19/26\\approx0.731$ accept.' },
          { t: 'Seller S', d: '$P=7+3.2+1=11.2$, $N=5+0.8+1=6.8$, $R=12.2/20=0.61<0.65$. Sybil adds $0.4\\cdot4=1.6$: $k=1$ → 0.639, $k=2$ → 0.664 ✓.' }
        ]
      },
      {
        title: 'Voting',
        course: 2,
        items: [
          { t: 'System', d: '$S=(N,O,\\{\\succeq_i\\},f)$; strict order: transitive, irreflexive, total; ordinal.' },
          { t: 'Rules', d: 'Plurality $g(o)=|\\{i: o$ first$\\}|$; majority $g(o)>|N|/2$; approval; Borda $m-1,\\dots,0$; two-round; IRV (eliminate & transfer); Condorcet (may cycle).' },
          { t: 'Borda manip.', d: 'True A6 B7 C4 D1 → B. Agent 1 reports A≻D≻C≻B: A6 B5 C4 D3 → A.' },
          { t: 'Plurality ex.', d: '4 A≻B≻C, 3 B≻C≻A, 2 C≻B≻A: A wins 4–3–2; one G3 lie → 4–4 tie; 2 Sybils for B → B 5. B is Condorcet winner (5–4, 7–2).' }
        ]
      },
      {
        title: 'Games & norms',
        course: 2,
        items: [
          { t: 'Game', d: '$G=(N,\\{S_i\\},\\{\\mu_i\\})$, utilities on joint actions. Taxonomy: #players, (non-)cooperative, simultaneous/sequential, (im)perfect info, (non-)zero-sum.' },
          { t: 'NE', d: '$\\mu_i(s_i,s_{-i})\\ge\\mu_i(s\'_i,s_{-i})\\ \\forall i,s\'_i$. Best responses: P1 reads columns, P2 rows; doubly-marked cell = NE.' },
          { t: 'PD', d: 'CC −2,−2; CB −10,−1; BC −1,−10; BB −5,−5. B dominant → NE (B,B). Stable ≠ optimal.' },
          { t: 'Norms', d: 'Represent, detect, enforce (sanction/reward). Supervisor: (S,H) NE iff $a\\ge c$ & $r\\ge m-p$; unique if $a>c$, $p+r>m$, $b+q>c$.' }
        ]
      }
    ]
  },
  {
    label: 'Verso: Ch. 3 Modal logic, model checking, STIT, neighborhoods, KBE',
    sections: [
      {
        title: 'Syntax & proof',
        course: 3,
        items: [
          { t: 'KBE', d: '$\\varphi::=p\\mid\\neg\\varphi\\mid\\varphi\\lor\\varphi\\mid\\varphi\\land\\varphi\\mid\\varphi\\Rightarrow\\varphi\\mid K_i\\varphi\\mid B_i\\varphi\\mid E_i\\varphi\\mid E^d_i\\varphi$; $L_0=P$, $L_{n+1}$ adds one constructor.' },
          { t: 'Truth / sat / valid', d: 'One valuation / some / all. $p\\land q$ sat not valid; $p\\lor\\neg p$ valid; $p\\land\\neg p$ unsat.' },
          { t: 'Rules', d: 'MP $\\frac{\\varphi\\ \\ \\varphi\\Rightarrow\\psi}{\\psi}$; US $\\frac{\\vdash\\varphi}{\\vdash\\varphi[p:=\\psi]}$; Nec $\\frac{\\vdash\\varphi}{\\vdash K\\varphi}$ (theorems only!).' },
          { t: '⊢ p⇒p', d: 'PC1[p,(p⇒p)], PC1[p,p], PC2[p,(p⇒p),p], MP 1,3, MP 2,4.' }
        ]
      },
      {
        title: 'Kripke & correspondence',
        course: 3,
        items: [
          { t: 'Model', d: '$\\mathcal M=(W,R,V)$, $V:P\\to2^W$. $w\\models\\Box\\varphi$ iff all successors ⊨ φ; $\\Diamond=\\neg\\Box\\neg$: some successor. No successor: □ true, ◇ false.' },
          { t: 'Validity', d: 'In model: all worlds; on frame: all worlds & valuations; $\\mathcal M\\models\\varphi\\not\\Rightarrow F\\models\\varphi$.' },
          { t: 'Axioms', d: 'K all frames; T $\\Box\\varphi\\Rightarrow\\varphi$ refl.; D $\\Box\\varphi\\Rightarrow\\Diamond\\varphi$ serial; 4 $\\Box\\varphi\\Rightarrow\\Box\\Box\\varphi$ trans.; B $\\varphi\\Rightarrow\\Box\\Diamond\\varphi$ sym.; 5 $\\Diamond\\varphi\\Rightarrow\\Box\\Diamond\\varphi$ Eucl.' },
          { t: 'Euclidean', d: '$xRy\\land xRz\\Rightarrow yRz$. Equivalence = refl+sym+trans = refl+trans+Eucl.' },
          { t: 'Proof template', d: '(⇐) axiom false at w ⇒ witnesses break the property. (⇒) property fails ⇒ countermodel: T,4 $V(p)=R(w)$; B $V(p)=\\{w\\}$; 5 $V(p)=R(v)$.' },
          { t: 'K proof', d: 'If $\\neg K\\psi$ at w, some successor has ¬ψ but also φ⇒ψ and φ ⇒ ψ: contradiction. No condition on R.' }
        ]
      },
      {
        title: 'S5 & KD45',
        course: 3,
        items: [
          { t: 'S5', d: 'PC+K+T+4+5, MP, Nec, US; sound & complete for equivalence frames. B derived from T and 5 (7 lines).' },
          { t: 'Derivations', d: '$K(p\\land q)\\Rightarrow Kp$: PC, Nec, K, MP. $Kp\\Leftrightarrow KKp$: 4 & T[Kp]. $\\neg Kp\\Leftrightarrow K\\neg Kp$: 5 & T[¬Kp].' },
          { t: 'p ⇒ Kp invalid', d: '$W=\\{w,v\\}$, $R=W^2$, $V(p)=\\{w\\}$: p at w, Kp false. Truth ≠ theorem.' },
          { t: 'KD45', d: 'Serial+trans+Eucl; D: no B⊥; $B\\varphi\\land\\neg\\varphi$ sat: $W=\\{w,v\\}$, $R=\\{(w,v),(v,v)\\}$, $V(p)=\\{v\\}$. S5 ⊇ KD45.' }
        ]
      },
      {
        title: 'Actions: PDL, DEL, STIT',
        course: 3,
        items: [
          { t: 'PDL', d: '$[\\alpha]\\varphi$ all executions; $[\\alpha;\\beta]=[\\alpha][\\beta]$; $[\\alpha\\cup\\beta]=[\\alpha]\\land[\\beta]$; $\\alpha^*$ refl.-trans. closure; $?\\varphi$ test.' },
          { t: 'DEL', d: 'Keep $(w,e)$ if $w\\models$ pre(e); link iff $wRv\\land eQf$; $V\'=V$. Believed lie: $\\neg p\\land B_bp$ (KD45).' },
          { t: 'STIT', d: '$E_i\\varphi$ iff φ on the whole choice cell $C_i(w)$; S5; $E_i\\top$ valid; $D_i\\varphi=E_i\\varphi\\land\\neg\\Box\\varphi$.' },
          { t: 'Door/alarm', d: 'Rows i, columns j, p {w1,w2}, q {w1,w3}: at w1 $E_ip,\\ \\neg E_iq,\\ E_jq,\\ \\neg E_iE_jq$.' },
          { t: 'TD game', d: '[1]¬q on T-cell; T dominant; NE (T,T) = maximin (min 1 vs 0) but different concepts.' }
        ]
      },
      {
        title: 'Neighborhoods',
        course: 3,
        items: [
          { t: 'Clause', d: '$w\\models\\Box\\varphi$ iff $\\llbracket\\varphi\\rrbracket\\in N(w)$: compute the truth set, test membership. No edges!' },
          { t: 'BIAT', d: 'Success $X\\in N(w)\\Rightarrow w\\in X$; $W\\notin N(w)$; closed under ∩. Not upward closed; K, 4, 5 fail.' },
          { t: 'TD Ex. 4', d: '$\\llbracket\\Box p\\rrbracket=\\llbracket\\Box q\\rrbracket=\\{a\\}$, $\\llbracket\\Box(p\\land q)\\rrbracket=\\varnothing$, $\\llbracket\\Box(p\\lor q)\\rrbracket=\\{b\\}$; aggregation fails at a; $N(c)=\\varnothing$ ⇒ ◇⊥ true at c.' }
        ]
      },
      {
        title: 'KBE & manipulation',
        course: 3,
        items: [
          { t: 'Definition', d: 'Manipulation = deliberate effect of a manipulator to instrumentalize a victim while concealing that effect (premeditation, instrumentalization, concealment).' },
          { t: 'Semantics', d: '$K_i$ refl.+trans.+confluent, $B_i$ KD45, $E_i$ S5; $E^d_i\\varphi$ iff $|\\varphi|\\in E^d_i(w)$; $B_i(w)\\subseteq K_i(w)$.' },
          { t: 'Axioms', d: '$K_i\\varphi\\Rightarrow B_i\\varphi$; $E^d_i\\varphi\\Rightarrow E_i\\varphi$; $\\neg E^d_i\\top$; aggregation; $E^d_i\\varphi\\equiv K_iE^d_i\\varphi$; no Nec for $E^d_i$. Qui facit per alium: $(E^d_iE_j\\varphi\\lor E^d_iE^d_j\\varphi)\\Rightarrow E_i\\varphi$.' },
          { t: 'Forms', d: 'Strong $E^d_iE^d_j\\varphi$, soft $E^d_iE_j\\varphi$, destructive with ¬; concealment epistemic $E^d_i\\neg K_j(\\dots)$ or doxastic $E^d_i\\neg B_j(\\dots)$.' },
          { t: 'Related', d: 'Coercion $E^d_i(E^d_j\\varphi\\land K_jE^d_iE^d_j\\varphi\\land\\psi)$; persuasion $E^d_i(B_j\\varphi\\land\\psi)$; lie $B_i\\neg\\varphi\\land E^d_i(B_j\\varphi\\land\\neg K_jB_i\\neg\\varphi\\land\\psi)$.' }
        ]
      }
    ]
  }
];
