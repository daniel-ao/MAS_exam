import { Course, Lesson } from '../types';

/** Raw template tag: keeps LaTeX backslashes; \` yields a literal backtick for inline code. */
const r = (s: TemplateStringsArray, ...v: unknown[]) => String.raw(s, ...v).replace(/\\`/g, '`');
type LessonInput = Omit<Lesson, 'courseId'>;
const L = (l: LessonInput): Lesson => ({ ...l, courseId: 'course-2' });

export const course2Data: Course = {
  id: 'course-2',
  title: 'Reputation, Voting & Normative Games',
  code: 'SMEIA305 · ECUE Multiagent systems',
  subtitle: 'Chapter 2: modelling specific MAS: reputation systems, voting systems, game theory and normative systems, and how each can be manipulated',
  instructor: 'Christopher Leturc',
  ects: 0,
  totalPages: 53,
  modules: [
    // =====================================================================
    {
      id: 'mod-2-1',
      courseId: 'course-2',
      title: 'Module 2.1: Reputation Systems',
      description: 'The anatomy of manipulation, reputation and its fragilities, the Beta reputation formula, and Sybil attacks.',
      sourcePagesRange: 'Part 2.1 · Slides 1–13',
      lessons: [
        L({
          id: 'lesson-2-1-1',
          moduleId: 'mod-2-1',
          deck: 3,
          title: 'Why Manipulation Matters: Its Anatomy',
          sourcePages: [1, 2, 3],
          summary: 'In a MAS, agents’ beliefs, reports, identities, preferences and alliances become inputs to a mechanism. A manipulator feeds strategic signals that the mechanism treats as sincere, shifting the outcome.',
          understand: {
            overview: 'A MAS is not just “many agents”. It is many agents whose beliefs, reports, identities, preferences and alliances become inputs to a mechanism.',
            detailedExplanation: r`### Three actors (slide 2)
- **Agents**: rational entities acting to improve their own utility, trust, satisfaction or outcome.
- **Mechanisms**: rules that aggregate signals: ratings, votes, norms or coalition preferences.
- **Manipulators**: agents that exploit the mechanism's assumptions while hiding the strategic deviation.

The course assumes **cognitive, rational agents** and explicitly allows **malevolent/manipulative** agents.

### The anatomy of manipulation (slide 3)
**Private objective → Strategic signal → Mechanism → Shifted outcome**

- *What is manipulated?* Often not the victim directly but the **information environment**: identity, testimony, preference profile, or coalition report.
- *Why does it work?* The mechanism treats a strategic input **as if it were sincere, persistent, truthful, or identity-valid**. That assumption is the soft spot.

This pattern repeats in every system of Chapter 2: fake testimonies (reputation), misreported rankings (voting), profitable deviations (games).`,
            keyPoints: [
              'Mechanisms aggregate signals (ratings, votes, norms, coalition preferences).',
              'Anatomy: private objective → strategic signal → mechanism → shifted outcome.',
              'What is manipulated is often the information environment: identity, testimony, preferences, coalition reports.',
              'It works because the mechanism assumes inputs are sincere, truthful and identity-valid.'
            ]
          },
          checkpoints: [
            {
              id: 'cp-2-1-1-1',
              question: 'Why does manipulation of a mechanism work, according to the course?',
              type: 'single',
              options: [
                'The mechanism treats a strategic input as if it were sincere and identity-valid',
                'The mechanism’s formula is mathematically wrong',
                'The manipulator hacks the code of the mechanism',
                'Other agents are irrational'
              ],
              correctAnswers: [0],
              explanation: 'Slide 3: the soft spot is the assumption that inputs are sincere, persistent, truthful or identity-valid. The function itself is correct.',
              difficulty: 'foundation',
              sourceSlide: 3
            }
          ]
        }),
        L({
          id: 'lesson-2-1-2',
          moduleId: 'mod-2-1',
          deck: 3,
          title: 'Reputation Systems: Attacks and Defenses',
          sourcePages: [4, 5, 6],
          summary: 'A reputation system aggregates past interaction outcomes to decide whom to trust. It is fragile on identity (Sybil, whitewashing), testimony (promotion, self-promotion, defamation) and timing (betrayal).',
          understand: {
            overview: 'Reputation converts distributed past experience into a present choice: “Should I interact with this agent?”',
            detailedExplanation: r`### Definitions (slide 4)
- **Reputation system**: a mechanism where agents interact, collect, share and aggregate outcomes of past interactions to decide whom they can trust in future interactions (Sabater & Sierra; Wang & Vassileva).
- **Reputation**: an agent's belief about another agent's **ability**, **honesty** and **reliability**, based on received testimonials.

### Where reputation systems are fragile (slide 5)
| Target | Attack | How |
|---|---|---|
| **Identity** | **Sybil attack** | Create false identities. |
| | **Whitewashing** | Leave and re-enter with a clean identity. |
| **Testimony** | **Promotion** | Allies inflate your score. |
| | **Self-promotion** | Fake identities praise you. |
| | **Defamation** | False reports harm rivals. |
| **Timing** | **Betrayal / planned attack** | Build trust through good interactions, then exploit it at the decisive moment. |

> The manipulator does not break the reputation function. It feeds the function inputs that make the wrong conclusion look mathematically justified.

### Defending reputation mechanisms (slide 6)
| Strategy | Examples |
|---|---|
| **Robustness by design** | Forgetfulness, certified message origins, disposable identifiers, stronger identity checks. |
| **Detection** | Statistical anomaly detection, or logical reasoning over inconsistent testimonies and suspicious patterns. |
| **Complexity barriers** | Make manipulation harder or costlier, e.g. authentication against Sybil identities. |
| **Incentives** | Reward truthful behavior and punish false testimony or dishonest actions. |`,
            keyPoints: [
              'Reputation = belief about another agent’s ability, honesty and reliability, built from testimonials.',
              'Identity attacks: Sybil (fake identities), whitewashing (re-enter with clean identity).',
              'Testimony attacks: promotion, self-promotion (via fakes), defamation (false negative reports).',
              'Timing attack: betrayal after building trust.',
              'Defenses: robustness by design, detection, complexity barriers, incentives.'
            ]
          },
          labId: 'reputation-lab',
          examPitfalls: [
            'Self-promotion uses FAKE identities praising you; promotion uses real ALLIES. A Sybil attack used for praise is self-promotion.',
            'Whitewashing is an identity attack (new identity), not a testimony attack.'
          ],
          checkpoints: [
            {
              id: 'cp-2-1-2-1',
              question: 'A seller with terrible ratings closes their account and opens a new one to start with a clean slate. This is:',
              type: 'single',
              options: ['Whitewashing', 'Defamation', 'Promotion', 'Betrayal'],
              correctAnswers: [0],
              explanation: 'Slide 5: whitewashing = leave and re-enter with a clean identity.',
              difficulty: 'foundation',
              sourceSlide: 5
            },
            {
              id: 'cp-2-1-2-2',
              question: 'An agent behaves honestly for months to build trust, then defrauds a partner during a very large transaction. This is:',
              type: 'single',
              options: ['A betrayal / planned attack', 'A Sybil attack', 'Self-promotion', 'Whitewashing'],
              correctAnswers: [0],
              explanation: 'Timing attack: build trust through good interactions, then exploit it at the decisive moment (slide 5).',
              difficulty: 'foundation',
              sourceSlide: 5
            },
            {
              id: 'cp-2-1-2-3',
              question: 'Which defenses target Sybil attacks most directly? (Select all that apply.)',
              type: 'multiple',
              options: ['Stronger identity checks / authentication', 'Certified message origins', 'Forgetfulness of old evidence', 'Rewarding truthful testimony'],
              correctAnswers: [0, 1],
              explanation: 'Sybil attacks forge identities, so identity checks (robustness by design / complexity barriers) and certified origins hit them directly. Forgetfulness mainly limits old evidence; incentives target false testimony in general.',
              difficulty: 'intermediate',
              sourceSlide: 6
            }
          ]
        }),
        L({
          id: 'lesson-2-1-3',
          moduleId: 'mod-2-1',
          deck: 3,
          title: 'The Beta Reputation Formula and the Alice–Bob Example',
          sourcePages: [7, 8, 9, 10, 11],
          summary: 'Agent i rates j by combining its direct positive/negative interactions with witness reports weighted by credibility: R = (1 + P)/(2 + P + N). Alice gets R(Bob) = 10/17 ≈ 0.588 < 0.70, so she rejects Bob.',
          understand: {
            overview: 'A minimal Beta-style reputation system (Jøsang & Ismail, 2002) turns counts of good and bad interactions into an expected probability of a successful interaction.',
            detailedExplanation: r`### The model (slide 7)
Agent $i$ evaluates agent $j$. Each past interaction produces an outcome $x^t_{ij}\in\{0,1\}$ (1 = successful).
- **Direct evidence**: $p_{ij}$ positive and $n_{ij}$ negative interactions.
- **Witness evidence**: witness $k$ reports $p_{kj}, n_{kj}$; $c_{ik}\in[0,1]$ is the **credibility** $i$ assigns to $k$.

$$R_i(j)=\frac{1+p_{ij}+\sum_k c_{ik}\,p_{kj}}{2+p_{ij}+n_{ij}+\sum_k c_{ik}\,(p_{kj}+n_{kj})}\in[0,1]$$

A larger value means $i$ expects a higher probability of a successful interaction with $j$. Writing $P=p_{ij}+\sum_k c_{ik}p_{kj}$ and $N=n_{ij}+\sum_k c_{ik}n_{kj}$:
$$R_i(j)=\frac{1+P}{2+P+N}$$
The "+1" and "+2" are a uniform prior: with no evidence at all, $R=\frac12$.

### Alice and Bob (slides 8–11)
Alice interacts with Bob only if $R_A(B)\ge 0.70$.
- Direct: $p_{AB}=6$, $n_{AB}=4$. Carol (witness) reports $p_{CB}=3$, $n_{CB}=2$, with full credibility $c_{AC}=1$.
- $P_A(B)=6+3=9$, $N_A(B)=4+2=6$.
- $R_A(B)=\frac{1+9}{2+9+6}=\frac{10}{17}\approx 0.588 < 0.70$ → **Alice does not interact with Bob.**

What the example shows (slide 11): the mechanism is **transparent** (a known aggregation rule) and the decision is **rational** given the evidence. This baseline measures the effect of manipulation next.`,
            keyPoints: [
              'R_i(j) = (1 + p_ij + Σ c_ik p_kj) / (2 + p_ij + n_ij + Σ c_ik (p_kj + n_kj)), in [0,1].',
              'Witness reports are weighted by the credibility c_ik ∈ [0,1].',
              'No evidence gives R = 1/2 (uniform prior).',
              'Alice–Bob: P = 9, N = 6, R = 10/17 ≈ 0.588 < 0.70 → reject Bob.'
            ]
          },
          visualize: {
            title: 'Evidence in, probability out',
            description: 'Positive evidence adds to the numerator and denominator; negative evidence only to the denominator. Credibility scales how much each witness counts. Play with it in the lab.'
          },
          labId: 'reputation-lab',
          formulas: [
            {
              name: 'Beta reputation with witnesses',
              latex: r`R_i(j)=\frac{1+p_{ij}+\sum_k c_{ik}p_{kj}}{2+p_{ij}+n_{ij}+\sum_k c_{ik}(p_{kj}+n_{kj})}`,
              explanation: 'Expected probability of a successful interaction with j, from direct and credibility-weighted witness evidence.',
              variables: [
                { symbol: 'p_{ij}, n_{ij}', description: 'positive / negative direct interactions of i with j' },
                { symbol: 'p_{kj}, n_{kj}', description: 'positive / negative interactions reported by witness k' },
                { symbol: 'c_{ik}', description: 'credibility i gives to witness k, in [0,1]' }
              ]
            }
          ],
          workedExample: {
            title: 'Alice decides about Bob',
            problem: r`Alice: 6 positive, 4 negative with Bob. Carol (credibility 1): 3 positive, 2 negative. Threshold 0.70.`,
            steps: [
              { title: 'Positive evidence', explanation: 'Direct + weighted witness positives.', math: r`P_A(B)=6+1\cdot3=9` },
              { title: 'Negative evidence', explanation: 'Direct + weighted witness negatives.', math: r`N_A(B)=4+1\cdot2=6` },
              { title: 'Reputation', explanation: 'Apply the Beta formula.', math: r`R_A(B)=\frac{1+9}{2+9+6}=\frac{10}{17}\approx0.588` },
              { title: 'Decision', explanation: 'Compare to the threshold.', math: r`0.588<0.70\ \Rightarrow\ \text{reject Bob}` }
            ],
            conclusion: 'Bob is rejected. This is the baseline that a Sybil attack will try to overturn.'
          },
          examPitfalls: [
            'Credibility multiplies BOTH the witness’s positives and negatives (in the denominator, c·(p+n)).',
            'Do not forget the +1 / +2: R = P/(P+N) is a different (prior-free) formula and gives 9/15 = 0.6 here.'
          ],
          checkpoints: [
            {
              id: 'cp-2-1-3-1',
              question: 'Alice has 6 positive and 4 negative interactions with Bob; Carol (credibility 1) reports 3 positive and 2 negative. What is R_A(B)?',
              type: 'calculation',
              options: ['10/17 ≈ 0.588', '9/15 = 0.600', '10/15 ≈ 0.667', '19/26 ≈ 0.731'],
              correctAnswers: [0],
              explanation: 'R = (1+9)/(2+9+6) = 10/17 ≈ 0.588 (slide 10). 0.600 forgets the prior; 0.731 is after the Sybil attack.',
              difficulty: 'foundation',
              sourceSlide: 10
            },
            {
              id: 'cp-2-1-3-2',
              question: 'With no evidence at all about j, what reputation does the formula give?',
              type: 'single',
              options: ['1/2', '0', '1', 'Undefined'],
              correctAnswers: [0],
              explanation: 'All counts are 0, so R = 1/2: the uniform prior of the Beta model.',
              difficulty: 'intermediate',
              sourceSlide: 7
            }
          ]
        }),
        L({
          id: 'lesson-2-1-4',
          moduleId: 'mod-2-1',
          deck: 3,
          title: 'Sybil Attacks on Reputation (with the Seller Exercise)',
          sourcePages: [12, 13],
          summary: 'Same agent, same behavior, same rule, different information environment: three Sybil identities each reporting 3 positives push Bob from 10/17 to 19/26 ≈ 0.731 and get him selected. In the exercise, seller S needs 2 Sybils.',
          understand: {
            overview: 'The mechanism is correct. The evidence is not. A Sybil attack injects fake witnesses whose positive reports inflate the score.',
            detailedExplanation: r`### Bob's Sybil attack (slide 12)
Bob creates **3 identities**, each reporting **3 positive** interactions (counted with credibility 1): $3\times3=9$ fake positives.
$$R'_A(B)=\frac{1+9+9}{2+9+9+6}=\frac{19}{26}\approx0.731\ \ge 0.70\ \Rightarrow\ \text{select Bob}$$
> Same agent. Same real behaviour. Same aggregation rule. **Different information environment.**

This is **self-promotion through a Sybil attack** (identity + testimony manipulation).

### Exercise: can seller S manipulate the system? (slide 13)
A buyer selects $S$ only if $R(S)\ge0.65$.
- Direct: 7 positive, 5 negative. Witness 1: $c_1=0.8$, 4 positive, 1 negative. Witness 2: $c_2=0.5$, 2 positive, 2 negative.
- Each Sybil: credibility $0.4$, reports **4 positive, 0 negative**.

**1. Honest reputation.**
$P=7+0.8\cdot4+0.5\cdot2=7+3.2+1=11.2$; $N=5+0.8\cdot1+0.5\cdot2=5+0.8+1=6.8$.
$$R(S)=\frac{1+11.2}{2+11.2+6.8}=\frac{12.2}{20}=0.61$$
**2.** $0.61<0.65$: the buyer **does not** select $S$.

**3. Sybils needed.** Each Sybil adds $0.4\times4=1.6$ to $P$ (and nothing to $N$):
$$R_k=\frac{12.2+1.6k}{20+1.6k}\ge0.65 \iff 12.2+1.6k\ge13+1.04k\iff 0.56k\ge0.8\iff k\ge1.43$$
So **$k=2$ Sybils**: $R_1=\frac{13.8}{21.6}\approx0.639$ (not enough), $R_2=\frac{15.4}{23.2}\approx0.664\ge0.65$ ✓.

**4. Type**: a Sybil attack used for **self-promotion** (fake identities praising the seller).

**5. Countermeasures**: give new or unverified identities credibility 0 (or decay it), require authentication/identity checks, cap the total weight of witnesses, or detect anomalous patterns (many new witnesses with only positive reports).`,
            keyPoints: [
              'Bob: 3 Sybils × 3 positives → R = 19/26 ≈ 0.731 ≥ 0.70 → selected.',
              'Seller S honest: P = 11.2, N = 6.8, R = 12.2/20 = 0.61 < 0.65 → rejected.',
              'Each Sybil (c = 0.4, 4 positive) adds 1.6 to P; 2 Sybils give ≈ 0.664 ≥ 0.65.',
              'It is a Sybil attack used for self-promotion; defend with identity checks or zero credibility for new identities.'
            ]
          },
          labId: 'reputation-lab',
          workedExample: {
            title: 'How many Sybils does seller S need?',
            problem: r`Honest totals: $P=11.2$, $N=6.8$. Each Sybil adds $1.6$ to $P$. Threshold $0.65$.`,
            steps: [
              { title: 'Honest score', explanation: 'Apply the formula.', math: r`R=\frac{1+11.2}{2+11.2+6.8}=\frac{12.2}{20}=0.61` },
              { title: 'With k Sybils', explanation: 'Both numerator and denominator grow by 1.6k.', math: r`R_k=\frac{12.2+1.6k}{20+1.6k}` },
              { title: 'Solve the threshold', explanation: 'Cross-multiply.', math: r`12.2+1.6k\ge 0.65(20+1.6k)\iff 0.56k\ge0.8\iff k\ge 1.43` },
              { title: 'Check integers', explanation: 'k must be a whole number of identities.', math: r`R_1\approx0.639<0.65,\qquad R_2\approx0.664\ge0.65` }
            ],
            conclusion: 'Two Sybil identities are enough to cross the threshold.'
          },
          examPitfalls: [
            'Sybil positives are multiplied by the Sybil credibility (0.4 here): 4 positives count as 1.6, not 4.',
            'Round UP the number of identities: k ≥ 1.43 means k = 2.'
          ],
          checkpoints: [
            {
              id: 'cp-2-1-4-1',
              question: 'Seller S: direct 7+/5−, witness 1 (c = 0.8) 4+/1−, witness 2 (c = 0.5) 2+/2−. What is the honest reputation R(S)?',
              type: 'calculation',
              options: ['0.61', '0.58', '0.65', '0.70'],
              correctAnswers: [0],
              explanation: 'P = 7 + 3.2 + 1 = 11.2, N = 5 + 0.8 + 1 = 6.8, R = 12.2/20 = 0.61.',
              difficulty: 'intermediate',
              sourceSlide: 13
            },
            {
              id: 'cp-2-1-4-2',
              question: 'Each Sybil has credibility 0.4 and reports 4 positive, 0 negative. How many Sybils does S need to reach R ≥ 0.65?',
              type: 'calculation',
              options: ['2', '1', '3', '5'],
              correctAnswers: [0],
              explanation: 'R_1 = 13.8/21.6 ≈ 0.639 < 0.65 and R_2 = 15.4/23.2 ≈ 0.664 ≥ 0.65, so 2.',
              difficulty: 'advanced',
              sourceSlide: 13
            },
            {
              id: 'cp-2-1-4-3',
              question: 'After Bob’s attack (3 identities × 3 positive reports, credibility 1), his reputation for Alice becomes:',
              type: 'calculation',
              options: ['19/26 ≈ 0.731', '10/17 ≈ 0.588', '18/24 = 0.75', '19/17'],
              correctAnswers: [0],
              explanation: '(1 + 9 + 9)/(2 + 9 + 9 + 6) = 19/26 ≈ 0.731 (slide 12).',
              difficulty: 'foundation',
              sourceSlide: 12
            }
          ]
        })
      ]
    },
    // =====================================================================
    {
      id: 'mod-2-2',
      courseId: 'course-2',
      title: 'Module 2.2: Voting Systems',
      description: 'Social choice theory, preferences, voting rules (plurality, majority, approval, Borda, runoff/IRV, Condorcet) and voting manipulation.',
      sourcePagesRange: 'Part 2.2 · Slides 1–20',
      lessons: [
        L({
          id: 'lesson-2-2-1',
          moduleId: 'mod-2-2',
          deck: 4,
          title: 'Social Choice, Voting Systems and Preferences',
          sourcePages: [1, 2, 3, 4, 5],
          summary: 'A voting system is a tuple S = (N, O, {≿ᵢ}, f): agents, outcomes, preference relations and a social choice function. Preferences are total strict orders: transitive, irreflexive, total.',
          understand: {
            overview: 'Social choice theory studies how individual opinions can be combined to produce, at the collective level, a ranking or a choice among alternatives. A voting rule is not just a calculation: it also shapes agents’ incentives.',
            detailedExplanation: r`### Social choice theory (slide 3)
**Input**: individual preferences → **Aggregation**: a rule → **Output**: a winner, a ranking, or sometimes an allocation.

### Formal voting system (slide 4)
$$S=(N,\ O,\ \{\succeq_i\}_{i\in N},\ f)$$
- $N$: a non-empty set of **agents** (voters, robots, users, decision-makers).
- $O$: a non-empty set of **outcomes** (candidates, projects, plans, resources).
- $\succeq_i$: the **preference relation** of agent $i$ over $O$.
- $f$: the **social choice function**: it maps a profile of preferences to a collective result (a winner or a ranking).

### Preference orders (slide 5)
$A\succ_i B$: agent $i$ strictly prefers A to B. A **total strict order** is:
- **Transitive**: $A\succ B$ and $B\succ C$ imply $A\succ C$.
- **Irreflexive**: $A$ is never strictly preferred to $A$.
- **Total**: every pair of distinct alternatives can be compared.

Example: $A\succ_1 B\succ_1 C\succ_1 D$. The ranking is **ordinal**: it gives an order, not an intensity.`,
            keyPoints: [
              'Voting system S = (N, O, {≿ᵢ}, f): agents, outcomes, preference relations, social choice function.',
              'f maps a preference profile to a winner or ranking.',
              'Strict preference order: transitive, irreflexive, total.',
              'Rankings are ordinal (order, no intensity).',
              'Guiding idea: a voting rule also shapes the incentives of the agents.'
            ]
          },
          checkpoints: [
            {
              id: 'cp-2-2-1-1',
              question: 'In S = (N, O, {≿ᵢ}, f), what is f?',
              type: 'single',
              options: [
                'The social choice function mapping a preference profile to a collective result',
                'The set of candidates',
                'The preference relation of the first voter',
                'The number of voters'
              ],
              correctAnswers: [0],
              explanation: 'Slide 4: f is the social choice function; O is the set of outcomes and ≿ᵢ the preferences of agent i.',
              difficulty: 'foundation',
              sourceSlide: 4
            },
            {
              id: 'cp-2-2-1-2',
              question: 'Which property is NOT required of a total strict preference order?',
              type: 'single',
              options: ['Reflexivity', 'Transitivity', 'Irreflexivity', 'Totality'],
              correctAnswers: [0],
              explanation: 'A strict order is irreflexive (A is never strictly preferred to A), so it is NOT reflexive.',
              difficulty: 'intermediate',
              sourceSlide: 5
            }
          ]
        }),
        L({
          id: 'lesson-2-2-2',
          moduleId: 'mod-2-2',
          deck: 4,
          title: 'Plurality, Majority and Approval Voting',
          sourcePages: [6, 7, 8, 9],
          summary: 'Three families: majoritarian (reach a threshold), plurality (most votes wins), proportional (seats follow vote shares). Plurality counts first choices; absolute majority needs more than |N|/2; approval lets voters approve any number of options.',
          understand: {
            overview: 'The three broad families of voting systems differ on what it takes to win.',
            detailedExplanation: r`### Three families (slide 6)
| Family | Rule | Example |
|---|---|---|
| **Majoritarian** | A candidate must reach a majority threshold. | Absolute majority, more than 50%. |
| **Plurality** | The candidate with the most votes wins, even without an absolute majority. | A = 40%, B = 35%, C = 25% → A wins. |
| **Proportional** | Divisions in the electorate are reflected proportionally. | Seats allocated by vote shares. |

### Plurality (slide 7)
Each agent gives 1 point to one alternative, usually its first choice:
$$g(o)=\big|\{i\in N:\ o\text{ is first in }\succ_i\}\big|$$
Votes A = 4, **B = 5**, C = 3 → B wins without an absolute majority. Simple, but it uses **very little information: only the first choice**.

### Majority (slide 8)
An alternative wins if it reaches a threshold, usually more than half the votes. **Absolute majority**: $g(o)>\frac{|N|}{2}$.
With 12 agents: **A = 7**, B = 4, C = 1 → $7>6$, A wins. If nobody reaches the threshold, an additional rule is needed: run-off, elimination or tie-breaking.

### Approval (slide 9)
Each agent approves **as many alternatives as it wants**; most approvals wins. Ballot: "I approve A and C, but not B." Approvals A = 6, **B = 8**, C = 7, D = 2 → B wins. The result depends on each voter's **personal acceptance threshold**.`,
            keyPoints: [
              'Plurality: g(o) = number of voters ranking o first; most points wins (no majority needed).',
              'Absolute majority: g(o) > |N|/2; if nobody reaches it, a run-off, elimination or tie-break is needed.',
              'Approval: approve any number of options; most approvals wins; depends on acceptance thresholds.',
              'Proportional: outcome reflects vote shares (seats).'
            ]
          },
          labId: 'voting-lab',
          formulas: [
            {
              name: 'Plurality score and absolute majority',
              latex: r`g(o)=\big|\{i\in N : o \text{ is first in } \succ_i\}\big|,\qquad \text{majority: } g(o)>\tfrac{|N|}{2}`,
              explanation: 'Plurality counts first places; absolute majority additionally requires more than half the voters.',
              variables: [
                { symbol: 'g(o)', description: 'score of alternative o' },
                { symbol: '|N|', description: 'number of voters' }
              ]
            }
          ],
          examPitfalls: ['“More than 50%” is strict: with 12 voters, 6 votes is NOT an absolute majority; 7 is.'],
          checkpoints: [
            {
              id: 'cp-2-2-2-1',
              question: 'With 12 voters, which score gives an absolute majority?',
              type: 'single',
              options: ['7 or more', '6 or more', 'The highest score, whatever it is', '4 or more'],
              correctAnswers: [0],
              explanation: 'Absolute majority requires g(o) > |N|/2 = 6, so at least 7 (slide 8).',
              difficulty: 'foundation',
              sourceSlide: 8
            },
            {
              id: 'cp-2-2-2-2',
              question: 'Votes: A = 4, B = 5, C = 3. Under plurality the winner is B. Does B have an absolute majority?',
              type: 'single',
              options: ['No: 5 is not more than 12/2 = 6', 'Yes: B has the most votes', 'Yes: 5 > 4', 'It depends on the approvals'],
              correctAnswers: [0],
              explanation: 'Slide 7: B wins under plurality "even without an absolute majority".',
              difficulty: 'foundation',
              sourceSlide: 7
            }
          ]
        }),
        L({
          id: 'lesson-2-2-3',
          moduleId: 'mod-2-2',
          deck: 4,
          title: 'Borda, Two-Round, Instant-Runoff and Condorcet',
          sourcePages: [10, 11, 12, 13, 14],
          summary: 'Borda gives m−1, m−2, …, 0 points by rank. Two-round voting keeps the best candidates for a run-off; IRV eliminates the last and transfers votes. A Condorcet winner beats every other alternative head-to-head, but may not exist.',
          understand: {
            overview: 'Rules that use more of each ballot than the first choice: full rankings (Borda, IRV, Condorcet).',
            detailedExplanation: r`### Borda count (slide 10)
With $m$ alternatives, each agent gives $m-1$ points to its first choice, $m-2$ to the second, …, $0$ to the last. Winner: $\arg\max_{o\in O} g(o)$.
Ballot A ≻ C ≻ B ≻ D with 4 alternatives gives **A = 3, C = 2, B = 1, D = 0**.

### Two-round and instant-runoff (slide 11)
- **Two-round**: count first choices; if nobody satisfies the winning condition, the best-performing candidates go to a second round. A = 42%, B = 34%, C = 24% → **A and B** go to round two.
- **Instant-runoff (IRV)**: agents rank alternatives; the lowest candidate is **eliminated** and its votes are **transferred** to the next available preference; repeat until a winner.

### Condorcet (slide 12)
Compare alternatives **two by two** with majority. A **Condorcet winner** beats every other alternative head-to-head. A vs B → A, A vs C → A, B vs C → B: **A is the Condorcet winner**.
⚠️ A Condorcet winner **does not always exist**: collective preferences may form a **cycle** (A beats B, B beats C, C beats A).

### Comparison (slides 13–14)
| Rule | Ballot | Winning criterion | Information captured |
|---|---|---|---|
| Plurality | Choose one | Most first-choice votes | Only the top preference |
| Majority | Choose one (or compare two) | Reaches a threshold | Top preference |
| Approval | Approve any number | Most approvals | Which options are acceptable |
| Borda | Rank all | Highest total score | All ranks |
| Condorcet | Rank all | Wins every head-to-head majority | Pairwise majorities |

Classroom questions: what is lost when lower preferences are ignored? Where should voters set their approval threshold? Can changing lower ranks alter the winner (Borda: **yes**, see manipulation)? What happens when pairwise majorities cycle?`,
            keyPoints: [
              'Borda: m−1, m−2, …, 0 points by rank; highest total wins.',
              'Two-round: top candidates go to a run-off; IRV: eliminate the last, transfer its ballots, repeat.',
              'Condorcet winner beats every other alternative in pairwise majority contests.',
              'A Condorcet winner may not exist: pairwise majorities can cycle (Condorcet paradox).',
              'Plurality uses only top choices; Borda uses all ranks; approval uses acceptability.'
            ]
          },
          labId: 'voting-lab',
          formulas: [
            {
              name: 'Borda score',
              latex: r`g(o)=\sum_{i\in N}\big(m-\mathrm{rank}_i(o)\big),\qquad \text{winner}\in\arg\max_{o\in O} g(o)`,
              explanation: 'Each voter gives m − rank points: m−1 to its first choice down to 0 for its last.',
              variables: [
                { symbol: 'm', description: 'number of alternatives' },
                { symbol: '\\mathrm{rank}_i(o)', description: 'position of o in voter i’s ranking (1 = first)' }
              ]
            }
          ],
          examPitfalls: [
            'Borda gives 0 (not 1) to the last-ranked alternative: with 4 alternatives the points are 3, 2, 1, 0.',
            'The plurality winner can lose every pairwise contest (be a Condorcet LOSER): check it in the voting lab with the slide 20 profile.'
          ],
          checkpoints: [
            {
              id: 'cp-2-2-3-1',
              question: 'With 4 alternatives, how many Borda points does a ballot give its third choice?',
              type: 'single',
              options: ['1', '2', '3', '0'],
              correctAnswers: [0],
              explanation: 'Points are 3, 2, 1, 0 for ranks 1–4 (slide 10).',
              difficulty: 'foundation',
              sourceSlide: 10
            },
            {
              id: 'cp-2-2-3-2',
              question: 'Which statement about Condorcet winners is true?',
              type: 'single',
              options: [
                'A Condorcet winner may not exist because pairwise majorities can form a cycle',
                'Every profile has exactly one Condorcet winner',
                'The plurality winner is always the Condorcet winner',
                'The Condorcet winner always has an absolute majority of first choices'
              ],
              correctAnswers: [0],
              explanation: 'Slide 12: "A Condorcet winner does not always exist: collective preferences may form a cycle."',
              difficulty: 'intermediate',
              sourceSlide: 12
            },
            {
              id: 'cp-2-2-3-3',
              question: 'First round: A = 42%, B = 34%, C = 24%, and a majority is needed. Under two-round voting:',
              type: 'single',
              options: ['A and B go to a second round', 'A wins immediately', 'C is elected as compromise', 'B and C go to a second round'],
              correctAnswers: [0],
              explanation: 'No candidate exceeds 50%, so the two best-performing candidates, A and B, proceed (slide 11).',
              difficulty: 'foundation',
              sourceSlide: 11
            }
          ]
        }),
        L({
          id: 'lesson-2-2-4',
          moduleId: 'mod-2-2',
          deck: 4,
          title: 'Voting Manipulation: Borda Misreporting and Sybil Votes',
          sourcePages: [15, 16, 17, 18, 19, 20],
          summary: 'Strategic voting: declare a profile different from your true preferences to obtain a better outcome. Agent 1 makes A win under Borda by burying B last; Sybil votes add fake voters. In the plurality exercise, A wins truthfully, one lie only creates a tie, two Sybils for B make B win.',
          understand: {
            overview: 'Strategic voting manipulation: an agent declares a profile different from its true preferences in order to obtain an outcome it prefers.',
            detailedExplanation: r`### Two kinds of manipulation (slide 15)
**True preferences → Declared profile → Function $f$ → Outcome.**
- **Preference misreporting**: change the reported ranking to change the winner.
- **Sybil attack**: create fake identities to add favorable votes. This manipulates the **electorate**, not just a preference.

### Borda example (slides 16–18)
$N=\{1,2,3\}$, $O=\{A,B,C,D\}$, Borda points 3, 2, 1, 0.
| Agent | True ranking |
|---|---|
| 1 | A ≻ B ≻ C ≻ D |
| 2 | C ≻ B ≻ A ≻ D |
| 3 | B ≻ A ≻ D ≻ C |

Truthful totals: **A = 6, B = 7, C = 4, D = 1** → **B wins**. Agent 1 prefers A to B.

Manipulation: agent 1 keeps A first but **buries B last**: declares **A ≻ D ≻ C ≻ B** (A = 3, D = 2, C = 1, B = 0).
New totals: **A = 6, B = 5, C = 4, D = 3** → **A wins**. Changing only *lower* ranks changed the winner.

### Sybil attack in plurality (slide 19)
Truthful count A = **4**, B = 3, C = 2 → A wins. Add **two Sybil votes for B**: A = 4, **B = 5** → B wins, because fake identities are counted as independent voters.

### Exercise: model and manipulate plurality (slide 20)
| Group | Number | Preference |
|---|---|---|
| G1 | 4 | A ≻ B ≻ C |
| G2 | 3 | B ≻ C ≻ A |
| G3 | 2 | C ≻ B ≻ A |

1. **Truthful winner**: first choices A = 4, B = 3, C = 2 → **A wins** (9 voters, no absolute majority).
2. **Counting function**: $g(o)=|\{i\in N : o \text{ is first in } \succ_i\}|$, winner $\in\arg\max_o g(o)$.
3. **Can a single lie change the result?** The voters who prefer B to A are in G2 (already vote B) and G3. If one G3 voter declares B ≻ C ≻ A: A = 4, B = 4, C = 1 → only a **tie**. A single lie cannot make B win outright; it only changes the result if ties are broken in B's favour. Two G3 voters must lie (B = 5).
4. **Sybil manipulation**: add two fake voters who report B first → A = 4, B = 5 → B wins (exactly slide 19).

Bonus insight: B beats A 5–4 and beats C 7–2 head-to-head: **B is the Condorcet winner**, and **A, the plurality winner, loses both pairwise contests** (A is a Condorcet loser).`,
            keyPoints: [
              'Manipulation = declaring a profile different from true preferences to get a preferred outcome.',
              'Borda: agent 1 reports A ≻ D ≻ C ≻ B; totals go from B = 7 (wins) to A = 6, B = 5 → A wins.',
              'Sybil attack manipulates the electorate: two fake B votes turn A 4–B 3 into B 5–A 4.',
              'Exercise: truthful plurality winner A; one G3 lie only yields a 4–4 tie; two Sybils for B make B win.',
              'In that profile B is the Condorcet winner and A (plurality winner) is a Condorcet loser.'
            ]
          },
          labId: 'voting-lab',
          workedExample: {
            title: 'Agent 1 manipulates Borda',
            problem: 'True profile: 1: A≻B≻C≻D, 2: C≻B≻A≻D, 3: B≻A≻D≻C. Agent 1 wants A to win.',
            steps: [
              { title: 'Truthful scores', explanation: 'Agent 1: A3 B2 C1 D0; agent 2: C3 B2 A1 D0; agent 3: B3 A2 D1 C0.', math: r`A=6,\ B=7,\ C=4,\ D=1\Rightarrow B` },
              { title: 'Strategy', explanation: 'Keep A first (3 points) and give B, the main rival, 0 points.', math: r`A\succ D\succ C\succ B` },
              { title: 'New scores', explanation: 'Agent 1 now gives A3 D2 C1 B0.', math: r`A=6,\ B=5,\ C=4,\ D=3\Rightarrow A` }
            ],
            conclusion: 'By misreporting only the lower part of its ranking, agent 1 obtains its preferred outcome: Borda is manipulable.'
          },
          examPitfalls: [
            'A Sybil attack is not preference misreporting: it adds voters rather than changing a ranking.',
            'In the plurality exercise, say explicitly that one lie produces a TIE; whether it changes the winner depends on the tie-breaking rule.'
          ],
          checkpoints: [
            {
              id: 'cp-2-2-4-1',
              question: 'In the Borda example, after agent 1 declares A ≻ D ≻ C ≻ B, what are the totals?',
              type: 'calculation',
              options: ['A = 6, B = 5, C = 4, D = 3', 'A = 6, B = 7, C = 4, D = 1', 'A = 7, B = 5, C = 4, D = 2', 'A = 6, B = 6, C = 4, D = 2'],
              correctAnswers: [0],
              explanation: 'Agent 1 gives A3 D2 C1 B0; agents 2 and 3 are unchanged (A1+2, B2+3, C3+0, D0+1). Totals A6 B5 C4 D3 (slide 18).',
              difficulty: 'intermediate',
              sourceSlide: 18
            },
            {
              id: 'cp-2-2-4-2',
              question: 'Plurality exercise (G1: 4 × A≻B≻C, G2: 3 × B≻C≻A, G3: 2 × C≻B≻A). If ONE G3 voter lies and votes B, what happens?',
              type: 'single',
              options: ['A and B tie at 4 votes each', 'B wins with 5 votes', 'A still wins 4 to 3', 'C wins'],
              correctAnswers: [0],
              explanation: 'B goes from 3 to 4 and C from 2 to 1: A 4, B 4, C 1. Only a tie, so one lie is not enough for B to win outright.',
              difficulty: 'advanced',
              sourceSlide: 20
            },
            {
              id: 'cp-2-2-4-3',
              question: 'Creating fake identities that vote for your candidate is:',
              type: 'single',
              options: ['A Sybil attack (manipulation of the electorate)', 'Preference misreporting', 'Approval voting', 'A Condorcet cycle'],
              correctAnswers: [0],
              explanation: 'Slide 19: it is no longer only a lie about preferences: it is a manipulation of the electorate.',
              difficulty: 'foundation',
              sourceSlide: 19
            }
          ]
        })
      ]
    },
    // =====================================================================
    {
      id: 'mod-2-3',
      courseId: 'course-2',
      title: 'Module 2.3: Game Theory & Normative Systems',
      description: 'Normative MAS, the formal definition of a game, the Prisoner’s Dilemma, Nash equilibria, and norms as game redesign.',
      sourcePagesRange: 'Part 2.3 · Slides 1–20',
      lessons: [
        L({
          id: 'lesson-2-3-1',
          moduleId: 'mod-2-3',
          deck: 5,
          title: 'Normative Multi-Agent Systems',
          sourcePages: [1, 2, 3, 4],
          summary: 'A normative MAS represents, communicates, distributes, detects, creates, modifies and enforces norms, and reasons about violation and fulfilment. Norms are not magic: a rational agent complies only if compliance pays at least as much as violation.',
          understand: {
            overview: 'A norm works when it changes the game so that the desired behavior becomes strategically stable.',
            detailedExplanation: r`### Definition (slide 3)
A **Normative Multi-Agent System** is a MAS organized through mechanisms that **represent, communicate, distribute, detect, create, modify and enforce norms**. It also reasons about **norm violation and fulfilment**.

Three jobs:
- **Represent norms**: make obligations, prohibitions, permissions, sanctions and rewards explicit.
- **Detect behavior**: observe agents and decide whether a norm is fulfilled or violated.
- **Enforce incentives**: modify payoffs through penalties, bonuses, loss of access or reputation effects.

### Norms are not magic (slide 4)
- **Technical issue**: detecting violations can be difficult and costly (time, energy, monitoring infrastructure, evidence, institutional authority).
- **Strategic issue**: a rational agent follows a norm **only if following it gives at least as much utility as violating it, given what others do**.

Central question: *how can we ensure that agents have an interest in adhering to norms?* That is exactly what game theory lets us analyze.`,
            keyPoints: [
              'Normative MAS: mechanisms to represent, communicate, distribute, detect, create, modify and enforce norms.',
              'Norm components: obligations, prohibitions, permissions, sanctions, rewards.',
              'Detection is technically costly; compliance is strategic (utility of complying ≥ violating).',
              'Guiding idea: a norm works when the desired behavior becomes strategically stable.'
            ]
          },
          checkpoints: [
            {
              id: 'cp-2-3-1-1',
              question: 'According to the course, when does a rational agent follow a norm?',
              type: 'single',
              options: [
                'When following it gives at least as much utility as violating it, given what others do',
                'Always, because norms are binding',
                'Only when it is monitored at every step',
                'Never, because rational agents are selfish'
              ],
              correctAnswers: [0],
              explanation: 'Slide 4, strategic issue: compliance must be at least as profitable as violation.',
              difficulty: 'foundation',
              sourceSlide: 4
            }
          ]
        }),
        L({
          id: 'lesson-2-3-2',
          moduleId: 'mod-2-3',
          deck: 5,
          title: 'What Is a Game? Formal Definition and Taxonomy',
          sourcePages: [5, 6, 7],
          summary: 'A game G = (N, {Sᵢ}, {μᵢ}) has players, strategy sets and utility functions over joint actions. Games are classified by number of players, cooperation, timing, information and conflict (zero-sum or not).',
          understand: {
            overview: 'Game theory is a mathematical framework for modeling interactions between rational agents, where rational means each agent tries to maximize its own utility.',
            detailedExplanation: r`### Formal definition (slide 6)
$$G=\big(N,\ \{S_i\}_{i\in N},\ \{\mu_i\}_{i\in N}\big)$$
- $N$: the non-empty set of **players** (agents).
- $S_i$: the **strategies** available to agent $i$ (here, a strategy is an action).
- $\mu_i$: the **utility function** of agent $i$: it assigns a payoff to each **joint action** $(a_1,\dots,a_n)$.

A **joint action** is a complete combination of all agents' choices. Utility is subjective: it represents gains or losses for each agent.

Pipeline (slide 5): **Players → Strategies → Utilities → Equilibrium**. Uses: resource sharing, contracts, security, voting, reputation, markets, negotiation and norm systems. It predicts which behavior is stable once agents compare consequences.

### Taxonomy of games (slide 7)
| Dimension | Values |
|---|---|
| **Number of players** | Two-player, $n$-player, large-population |
| **Cooperation** | **Cooperative** (binding coalitions allowed) vs **non-cooperative** (individual choices) |
| **Timing** | **Simultaneous** (choose without observing current moves) vs **sequential** (move in order) |
| **Information** | **Perfect** (actions and payoffs known) vs **imperfect** (some actions, motivations or gains hidden) |
| **Conflict** | **Zero-sum** (one's gain is another's loss) vs **non-zero-sum** (mutual gain or loss possible) |

The Prisoner's Dilemma is a two-player, non-cooperative, simultaneous, **non-zero-sum** game.`,
            keyPoints: [
              'G = (N, {Sᵢ}, {μᵢ}): players, strategy sets, utility functions over joint actions.',
              'Rational = maximizes its own utility.',
              'Taxonomy: number of players, cooperative/non-cooperative, simultaneous/sequential, perfect/imperfect information, zero-sum/non-zero-sum.',
              'Prisoner’s Dilemma: 2 players, non-cooperative, simultaneous, non-zero-sum.'
            ]
          },
          checkpoints: [
            {
              id: 'cp-2-3-2-1',
              question: 'The Prisoner’s Dilemma (both prisoners can lose together) is:',
              type: 'single',
              options: ['A non-zero-sum game', 'A zero-sum game', 'A cooperative game with binding coalitions', 'A sequential game'],
              correctAnswers: [0],
              explanation: 'Mutual loss (−5, −5) or mutual gain is possible, so it is non-zero-sum. The prisoners are interrogated separately and choose simultaneously, without binding agreements.',
              difficulty: 'intermediate',
              sourceSlide: 7
            },
            {
              id: 'cp-2-3-2-2',
              question: 'In G = (N, {Sᵢ}, {μᵢ}), μᵢ assigns a payoff to:',
              type: 'single',
              options: ['Each joint action of all agents', 'Each strategy of agent i alone', 'Each player', 'Each equilibrium'],
              correctAnswers: [0],
              explanation: 'Slide 6: the utility function assigns a payoff to each joint action (a₁, …, aₙ). One agent’s payoff depends on everybody’s choices.',
              difficulty: 'foundation',
              sourceSlide: 6
            }
          ]
        }),
        L({
          id: 'lesson-2-3-3',
          moduleId: 'mod-2-3',
          deck: 5,
          title: 'The Prisoner’s Dilemma and Nash Equilibrium',
          sourcePages: [8, 9, 10, 11, 12, 13, 14, 15, 16],
          summary: 'A Nash equilibrium is a profile where no agent can improve by changing strategy alone. Using best responses, (Betray, Betray) with (−5, −5) is the unique NE of the Prisoner’s Dilemma, although (Silent, Silent) gives (−2, −2) to both: stable does not mean optimal.',
          understand: {
            overview: 'The Prisoner’s Dilemma shows how individually rational choices can lead to a collectively worse outcome.',
            detailedExplanation: r`### The story (slide 8)
Two prisoners are interrogated separately. Each can **betray** (B) or **stay silent** (C). Years in prison are negative utility.
- One betrays, the other stays silent: betrayer **1 year**, silent **10 years**.
- Both silent: **2 years** each. Both betray: **5 years** each.

### Payoff matrix (slides 9–10), cells $(\mu_1,\mu_2)$
| P1 \ P2 | Silent $C$ | Betray $B$ |
|---|---|---|
| **Silent $C$** | $-2,-2$ | $-10,-1$ |
| **Betray $B$** | $-1,-10$ | $-5,-5$ ✓ NE |

Less negative is better: $-1>-2>-5>-10$.

### Nash equilibrium (slides 11–12)
A strategy profile is a **Nash equilibrium** when **no agent can improve its own utility by changing strategy alone**, the others keeping theirs fixed:
$$\mu_i(s_i,s_{-i})\ \ge\ \mu_i(s'_i,s_{-i})\quad\text{for every agent } i \text{ and every } s'_i$$
$s_i$: current strategy of $i$; $s'_i$: an alternative; $s_{-i}$: the strategies of **everyone except $i$**. For the profile $(B,C)$: $s_1=B$, $s_{-1}=C$; $s_2=C$, $s_{-2}=B$.
Intuition: *"given what everyone else is doing, I cannot do better by changing only my own move."* ⚠️ An NE is **stable, not necessarily fair, efficient, moral or collectively optimal**.

### Best-response method (slides 13–15)
1. Fix the other player's strategy. 2. Compare the payoffs of the player who can change. 3. Mark the best response(s). 4. Repeat for every strategy of the other player. 5. Do the same for the second player. 6. **A cell marked for both players is a Nash equilibrium.**

- P1 (read columns): if P2 is silent, $-1>-2$ → Betray; if P2 betrays, $-5>-10$ → Betray. **Betray is always P1's best response** (a dominant strategy).
- P2 (read rows): symmetric → Betray.
- Only $(B,B)$ is marked twice → **$(B,B)$ is the unique Nash equilibrium**.

"Pessimistic rationality": each asks "what if the other betrays?" (betraying limits the loss, $-5$ vs $-10$), and even if the other stays silent, betrayal is still better ($-1>-2$).

### Stable does not mean optimal (slide 16)
At $(B,B)$ each gets $-5$; switching alone to silence gives $-10$. At $(C,C)$ each gets $-2$, **better for both**, but it requires coordination and trust. **Lesson: manipulation may persist not because it is socially good, but because it is individually stable.**`,
            keyPoints: [
              'PD payoffs: (C,C) = (−2,−2), (C,B) = (−10,−1), (B,C) = (−1,−10), (B,B) = (−5,−5).',
              'NE: μᵢ(sᵢ, s₋ᵢ) ≥ μᵢ(s′ᵢ, s₋ᵢ) for all i and s′ᵢ; no profitable unilateral deviation.',
              'Best-response method: mark each player’s best response to each strategy of the other; doubly-marked cells are NE.',
              'Betray is a dominant strategy for both; (B,B) is the unique NE.',
              '(C,C) is better for both but not stable: an NE is stable, not necessarily optimal.'
            ]
          },
          labId: 'game-lab',
          formulas: [
            {
              name: 'Nash equilibrium condition',
              latex: r`\mu_i(s_i,s_{-i})\ \ge\ \mu_i(s'_i,s_{-i})\qquad \forall i\in N,\ \forall s'_i\in S_i`,
              explanation: 'No agent can increase its utility by unilaterally switching strategy while the others keep theirs.',
              variables: [
                { symbol: 's_i', description: 'current strategy of agent i' },
                { symbol: "s'_i", description: 'any alternative strategy of agent i' },
                { symbol: 's_{-i}', description: 'strategies of every agent except i' }
              ]
            }
          ],
          workedExample: {
            title: 'Finding the NE of the Prisoner’s Dilemma',
            problem: 'Matrix (P1 rows, P2 columns): (C,C) = (−2,−2), (C,B) = (−10,−1), (B,C) = (−1,−10), (B,B) = (−5,−5).',
            steps: [
              { title: 'P1 vs P2 silent', explanation: 'Compare P1’s payoffs in column C.', math: r`\mu_1(B,C)=-1>\mu_1(C,C)=-2\Rightarrow \text{mark }(B,C)` },
              { title: 'P1 vs P2 betrays', explanation: 'Compare P1’s payoffs in column B.', math: r`\mu_1(B,B)=-5>\mu_1(C,B)=-10\Rightarrow \text{mark }(B,B)` },
              { title: 'P2 vs P1 silent / betrays', explanation: 'Compare P2’s payoffs in each row.', math: r`-1>-2\Rightarrow(C,B);\qquad -5>-10\Rightarrow(B,B)` },
              { title: 'Intersect', explanation: 'Only one cell is marked for both players.', math: r`\text{NE}=(B,B),\ \text{payoffs }(-5,-5)` }
            ],
            conclusion: 'Betrayal is dominant for both players, so (B,B) is the unique Nash equilibrium, even though (C,C) is Pareto-better.'
          },
          examPitfalls: [
            'Read COLUMNS for player 1’s best responses (P2’s strategy fixed) and ROWS for player 2’s.',
            'Being a Nash equilibrium says nothing about fairness or social optimality: (B,B) is worse for both than (C,C).',
            'Compare negative payoffs carefully: −1 is better than −2.'
          ],
          checkpoints: [
            {
              id: 'cp-2-3-3-1',
              question: 'What is the Nash equilibrium of the Prisoner’s Dilemma in the course?',
              type: 'single',
              options: ['(Betray, Betray) with (−5, −5)', '(Silent, Silent) with (−2, −2)', '(Betray, Silent) with (−1, −10)', 'There is no pure Nash equilibrium'],
              correctAnswers: [0],
              explanation: 'Betray is each player’s best response whatever the other does, so (B,B) is the unique NE (slide 15).',
              difficulty: 'foundation',
              sourceSlide: 15
            },
            {
              id: 'cp-2-3-3-2',
              question: 'Why is (Silent, Silent) NOT a Nash equilibrium?',
              type: 'single',
              options: [
                'Each prisoner can unilaterally switch to Betray and get −1 instead of −2',
                'Because −2 is worse than −5',
                'Because both prisoners would rather get 10 years',
                'Because it is a zero-sum game'
              ],
              correctAnswers: [0],
              explanation: 'From (C,C), a unilateral deviation to B improves the deviator from −2 to −1: a profitable unilateral deviation exists.',
              difficulty: 'intermediate',
              sourceSlide: 16
            },
            {
              id: 'cp-2-3-3-3',
              question: 'In the formula μᵢ(sᵢ, s₋ᵢ) ≥ μᵢ(s′ᵢ, s₋ᵢ), what does s₋ᵢ denote?',
              type: 'single',
              options: ['The strategies of all agents except i', 'The worst strategy of i', 'The strategy i will play next', 'The negation of sᵢ'],
              correctAnswers: [0],
              explanation: 'Slides 11–12: −i means "everyone other than i".',
              difficulty: 'foundation',
              sourceSlide: 12
            }
          ]
        }),
        L({
          id: 'lesson-2-3-4',
          moduleId: 'mod-2-3',
          deck: 5,
          title: 'Norms as Game Redesign: the Supervisor–Company Exercise',
          sourcePages: [17, 18, 19, 20],
          summary: 'A good norm makes manipulation a bad best response. With monitoring, sanctions and rewards, (Supervise, Honest) is a Nash equilibrium iff a ≥ c and r ≥ m − p, and the unique NE when a > c, r > m − p and b + q > c.',
          understand: {
            overview: 'Normative systems change payoffs through detection, sanctions, rewards, access control or reputation, so that a new equilibrium appears.',
            detailedExplanation: r`### Game redesign (slide 17)
**Manipulation profitable → Norm created → Violation detected → Payoffs changed → New NE.** Mechanism-design intuition: **a good norm makes manipulation a bad best response.**

### Design levers (slide 18)
**Monitoring** (raise the detection probability, but it consumes resources), **Sanctions** (fines, exclusion, reputation loss, reduced access), **Rewards** (trusted status, priority access, bonuses, lower future monitoring), **Credibility** (the supervisor must have an incentive to supervise when it matters), **Robustness** (reduce damage even before detection).

### Exercise (slides 19–20)
Supervisor $a_s$ (rows): Supervise $S$ / Not supervise $\bar S$. Company $a_c$ (columns): Manipulate $M$ / Honest $H$.
| | $M$ | $H$ |
|---|---|---|
| $S$ | $b-c,\ m-p$ (detected) | $a-c,\ r$ (verified honesty) |
| $\bar S$ | $-q,\ m$ (succeeds) | $0,\ 0$ |
with $m,p,r,c,b,q>0$ and $a\ge0$.

**1. Best responses.**
- Company vs $S$: $H$ iff $r\ge m-p$ (i.e. $p+r\ge m$). Company vs $\bar S$: $M$, since $m>0$.
- Supervisor vs $M$: $S$ iff $b-c\ge -q$ (i.e. $b+q\ge c$). Supervisor vs $H$: $S$ iff $a-c\ge0$ (i.e. $a\ge c$).

**2. $(S,H)$ is a Nash equilibrium iff** $a\ge c$ (supervisor doesn't want to stop supervising) **and** $r\ge m-p$ (company doesn't want to manipulate).

**3. Unique NE.** Take strict versions $a>c$, $p+r>m$, and add $b+q>c$:
- $(S,M)$ fails: the company would switch to $H$ since $r>m-p$.
- $(\bar S,H)$ fails: the company would switch to $M$ since $m>0$ (this cell is never an NE).
- $(\bar S,M)$ fails: the supervisor would switch to $S$ since $b-c>-q$.
Then $S$ is strictly dominant for the supervisor and $H$ is the company's best response: **$(S,H)$ is the unique NE**.

**4. How the norm fights manipulation**: the sanction $p$ and the reward $r$ make honesty the best response to supervision ($p+r>m$); the detection bonus $b$ and the loss $q$ make supervising credible even against manipulators; and the institutional value $a$ keeps supervision worthwhile when everyone is honest.`,
            keyPoints: [
              'A good norm makes manipulation a bad best response; levers: monitoring, sanctions, rewards, credibility, robustness.',
              'Company best response: H vs S iff r ≥ m − p; M vs S̄ always (m > 0).',
              'Supervisor best response: S vs M iff b + q ≥ c; S vs H iff a ≥ c.',
              '(S,H) is an NE iff a ≥ c and p + r ≥ m.',
              'Unique NE with a > c, p + r > m and b + q > c; (S̄,H) is never an NE.'
            ]
          },
          labId: 'game-lab',
          examPitfalls: [
            'Do not forget the supervisor’s side: (S,H) also needs a ≥ c, otherwise the supervisor stops supervising honest companies.',
            '(S̄, H) can never be an NE: against no supervision, manipulation pays m > 0.'
          ],
          checkpoints: [
            {
              id: 'cp-2-3-4-1',
              question: 'In the supervisor–company game, (Supervise, Honest) is a Nash equilibrium if and only if:',
              type: 'single',
              options: ['a ≥ c and r ≥ m − p', 'b + q ≥ c only', 'm > p only', 'a ≥ 0 and r ≥ 0'],
              correctAnswers: [0],
              explanation: 'Supervisor vs H: a − c ≥ 0. Company vs S: r ≥ m − p. Both deviations must be unprofitable.',
              difficulty: 'advanced',
              sourceSlide: 20
            },
            {
              id: 'cp-2-3-4-2',
              question: 'Why can (Not supervise, Honest) never be a Nash equilibrium?',
              type: 'single',
              options: [
                'The company would deviate to Manipulate and earn m > 0 instead of 0',
                'The supervisor would deviate to Supervise and earn a − c > 0',
                'Because q > 0',
                'Because it is a zero-sum game'
              ],
              correctAnswers: [0],
              explanation: 'Against S̄, M gives m > 0 versus 0 for H: a profitable unilateral deviation always exists.',
              difficulty: 'advanced',
              sourceSlide: 19
            },
            {
              id: 'cp-2-3-4-3',
              question: 'Which design lever is about the supervisor having an incentive to supervise when it matters?',
              type: 'single',
              options: ['Credibility', 'Robustness', 'Rewards', 'Monitoring'],
              correctAnswers: [0],
              explanation: 'Slide 18: credibility = the supervisor must also have an incentive to supervise when it matters.',
              difficulty: 'foundation',
              sourceSlide: 18
            }
          ]
        })
      ]
    }
  ]
};
