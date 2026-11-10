import { Course, Lesson } from '../types';

/** Raw template tag: keeps LaTeX backslashes; \` yields a literal backtick for inline code. */
const r = (s: TemplateStringsArray, ...v: unknown[]) => String.raw(s, ...v).replace(/\\`/g, '`');
type LessonInput = Omit<Lesson, 'courseId'>;
const L = (l: LessonInput): Lesson => ({ ...l, courseId: 'course-1' });

export const course1Data: Course = {
  id: 'course-1',
  title: 'Agents, Architectures & Organizations',
  code: 'SMEIA305 · ECUE Multiagent systems',
  subtitle: 'Chapter 1: foundations, taxonomy, reactive and BDI architectures, environments, interactions and organizational forms',
  instructor: 'Christopher Leturc',
  ects: 0,
  totalPages: 77,
  modules: [
    // =====================================================================
    {
      id: 'mod-1-1',
      courseId: 'course-1',
      title: 'Module 1.1: What Is a Multi-Agent System?',
      description: 'Why we distribute decision-making, the four pillars of a MAS, the definition of an agent and its six properties.',
      sourcePagesRange: 'Part 1.1 · Slides 1–7',
      lessons: [
        L({
          id: 'lesson-1-1-1',
          moduleId: 'mod-1-1',
          deck: 1,
          title: 'Why MAS? The Four Pillars',
          sourcePages: [1, 2, 3, 4],
          summary: 'A multi-agent system distributes decision-making among several autonomous entities. It rests on four pillars: agents, environment, interaction and organization.',
          understand: {
            overview: 'Classical AI usually builds one centralized decision-maker. Many real problems are naturally distributed (limited resources, local information, many stakeholders), so MAS split the decision among autonomous agents.',
            detailedExplanation: r`### From centralized AI to distributed decisions
Classical AI often relies on **centralized** decision-making: one program sees everything and decides everything. Many problems instead need to be **distributed**, because resources (computation, sensing, communication, authority) are limited and spread out.

A MAS **distributes decision-making among several autonomous entities**. The payoff announced in the course:
- **Scalability**: adding agents adds capacity without redesigning a central brain.
- **Robustness**: no single point of failure; other agents keep working if one breaks.
- **Adaptability**: agents react locally to local changes.

### The four pillars of a MAS
| Pillar | Meaning |
|---|---|
| **Agent** | An autonomous entity capable of perceiving, deciding and acting. |
| **Environment** | The physical or virtual space in which agents operate. |
| **Interaction** | Communication, coordination, cooperation or competition. |
| **Organization** | Roles, relationships and rules that structure the collective. |

A good exam answer to "what is a MAS?" names all four: *a set of autonomous agents situated in an environment, interacting with each other, and structured by an organization.*`,
            keyPoints: [
              'MAS distribute decision-making among several autonomous entities instead of one central controller.',
              'Expected benefits: scalability, robustness and adaptability.',
              'Four pillars: Agent, Environment, Interaction, Organization.',
              'The core of a MAS is not only the agent, but what agents do together.'
            ]
          },
          visualize: {
            title: 'The four pillars',
            description: 'Four cards on slide 4: 🤖 Agent (perceive, decide, act), 🌐 Environment (where agents live), 🔁 Interaction (communication, coordination, cooperation, competition), and Organization (roles, relationships, rules).'
          },
          examPitfalls: [
            'Do not define a MAS as "many agents". Without interaction and organization it is just a set of independent programs.',
            'Robustness comes from the absence of a single point of failure, not from each agent being individually smarter.'
          ],
          checkpoints: [
            {
              id: 'cp-1-1-1-1',
              question: 'Which list gives the four pillars of a multi-agent system as presented in the course?',
              type: 'single',
              options: [
                'Agent, Environment, Interaction, Organization',
                'Perception, Decision, Action, Learning',
                'Beliefs, Desires, Intentions, Plans',
                'Sensors, Actuators, Network, Database'
              ],
              correctAnswers: [0],
              explanation: 'Slide 4 lists exactly Agent, Environment, Interaction and Organization.',
              whyOptionsIncorrect: {
                1: 'This is the internal cycle of one agent, not the pillars of a MAS.',
                2: 'These are the components of the BDI architecture of a single cognitive agent.',
                3: 'These are implementation details of robots, not conceptual pillars.'
              },
              difficulty: 'foundation',
              sourceSlide: 4
            },
            {
              id: 'cp-1-1-1-2',
              question: 'Which benefits does the course attribute to distributing decision-making in a MAS? (Select all that apply.)',
              type: 'multiple',
              options: ['Scalability', 'Robustness', 'Adaptability', 'Guaranteed global optimality'],
              correctAnswers: [0, 1, 2],
              explanation: 'Slide 3: MAS improve scalability, robustness and adaptability. Nothing guarantees a globally optimal outcome; decentralized decisions can even be collectively worse (see the Prisoner’s Dilemma in Chapter 2).',
              difficulty: 'foundation',
              sourceSlide: 3
            }
          ]
        }),
        L({
          id: 'lesson-1-1-2',
          moduleId: 'mod-1-1',
          deck: 1,
          title: 'What Is an Agent? Definition, Six Properties, Three Types',
          sourcePages: [5, 6, 7],
          summary: 'An agent is an autonomous, situated entity that perceives, acts and interacts according to an organization. Six properties characterize it: autonomy, reactivity, proactivity, social ability, adaptability and situatedness.',
          understand: {
            overview: 'An agent is an autonomous, natural or artificial entity situated in an environment, capable of perceiving it, acting within it, and interacting with other agents according to an organization.',
            detailedExplanation: r`### The definition to learn by heart
> An **agent** is an *autonomous*, natural or artificial entity *situated in an environment*, capable of *perceiving* it, *acting* within it, and *interacting* with other agents according to an *organization*.

Consequences listed on slide 5:
- It pursues **its own objectives**.
- It has a **perception** of the world (usually partial).
- It acts through **actions** or **messages**.

### Six essential properties (slide 6)
| Property | What it means |
|---|---|
| **Autonomy** | Decides and acts without permanent control from a user or central supervisor. |
| **Reactivity** | Perceives changes in the environment and responds to them quickly. |
| **Proactivity** | Takes the initiative to achieve its own objectives (goal-directed, not only stimulus-driven). |
| **Social ability** | Communicates, cooperates, negotiates or competes with other agents. |
| **Adaptability** | Adjusts its behavior to the context or to accumulated experience. |
| **Situatedness** | Exists in an environment, constrained by local perceptions and actions. |

Reactivity vs proactivity is a classic exam contrast: a reactive response is *triggered by a perception*; a proactive action is *triggered by the agent's own goal*.

### Three types of agents (slide 7)
- 💻 **Software agents**: autonomous programs in a digital environment (a trading bot, a chatbot).
- 🦾 **Physical agents**: robots or devices with sensors and mechanical actuators.
- 🛰️ **Mobile agents**: code or an entity able to move between environments or machines.`,
            keyPoints: [
              'Agent = autonomous + situated + perceives + acts + interacts according to an organization.',
              'Six properties: autonomy, reactivity, proactivity, social ability, adaptability, situatedness.',
              'Reactivity responds to perceptions; proactivity takes initiative toward the agent’s own goals.',
              'Three types: software, physical (robots), mobile (code that moves between machines).'
            ]
          },
          examPitfalls: [
            'Situatedness is not the same as reactivity: situatedness says the agent lives in an environment with local perception; reactivity says it responds to changes in it.',
            'Autonomy means no *permanent* external control, not that the agent ignores other agents.'
          ],
          checkpoints: [
            {
              id: 'cp-1-1-2-1',
              question: 'A cleaning robot notices its battery is at 20% and, without any command, heads to its charging station to keep cleaning later. Which property does this best illustrate?',
              type: 'single',
              options: ['Proactivity', 'Social ability', 'Situatedness only', 'Mobility'],
              correctAnswers: [0],
              explanation: 'It takes the initiative to secure its own objective (keep cleaning). That is proactivity. Autonomy is also involved, but the key point is goal-directed initiative.',
              whyOptionsIncorrect: {
                1: 'No other agent is involved.',
                2: 'Situatedness describes living in an environment with local perception; it does not explain the initiative.',
                3: 'A mobile agent is code that moves between machines, not a robot moving in a room.'
              },
              difficulty: 'intermediate',
              sourceSlide: 6
            },
            {
              id: 'cp-1-1-2-2',
              question: 'Which property is defined as "decide and act without permanent control from a user or central supervisor"?',
              type: 'single',
              options: ['Autonomy', 'Reactivity', 'Adaptability', 'Situatedness'],
              correctAnswers: [0],
              explanation: 'That is the exact definition of autonomy on slide 6.',
              difficulty: 'foundation',
              sourceSlide: 6
            }
          ]
        })
      ]
    },
    // =====================================================================
    {
      id: 'mod-1-2',
      courseId: 'course-1',
      title: 'Module 1.2: Reactive Architectures',
      description: 'Perception → action agents: simple reflexes, the subsumption architecture, flocking and stigmergy.',
      sourcePagesRange: 'Part 1.1 · Slides 8–27',
      lessons: [
        L({
          id: 'lesson-1-2-1',
          moduleId: 'mod-1-2',
          deck: 1,
          title: 'Reactive Agents: Simple Reflexes & Subsumption',
          sourcePages: [8, 9, 10, 11, 12, 13, 14],
          summary: 'Reactive agents map perception directly to action with no complex world model. Subsumption stacks behaviors in priority layers where higher layers suppress lower ones.',
          understand: {
            overview: 'Agent architectures go from immediate reaction to reasoned planning. A reactive architecture works directly as perception → action, without a complex internal model of the world.',
            detailedExplanation: r`### Reactive architecture (slide 9)
- Direct operation: **perception → action**.
- **No complex internal model** of the world.
- Very useful in **strongly dynamic** environments, where there is no time to plan.
- Examples: thermostat, obstacle-avoiding robot, drone swarm.

### Three classical reactive architectures (slide 10)
1. **Simple reflexes**: condition-action rules triggered by the *current* perception. Example: a thermostat that reacts only to the current temperature ("if T < 19°C then heat").
2. **Subsumption** (Brooks): behaviors organized into **priority layers**: avoid, explore, reach.
3. **Flocking**: emergent collective behavior from separation, alignment and cohesion (next lesson).

### Subsumption architecture (slides 12–14)
A behavior-based architecture where:
- **Reactive control**: agents respond directly to stimuli.
- **Hierarchical layers**: higher-priority layers can **subsume (override) lower layers**.
- **No central control**: each layer runs independently; the overall behavior *emerges*.

Robot example: Layer 1 *avoid obstacles*, Layer 2 *wander randomly*, Layer 3 *head toward a target*. The obstacle layer has the highest priority: when a collision is detected it suppresses everything else.

The solution given on slide 14:
| Line | Pseudo-code |
|---|---|
| 1 | \`while True:\` |
| 2 | \`if detect_collision(): avoid_obstacle()\` |
| 3 | \`elif goal_visible(): move_to_goal()\` |
| 4 | \`else: wander()\` |

Read the \`if / elif / else\` order as the priority order: the first condition that fires wins.`,
            keyPoints: [
              'Reactive = perception → action, no complex world model; fast and suited to dynamic environments.',
              'Simple reflex agents use condition-action rules on the current perception only (thermostat).',
              'Subsumption: priority layers, higher layers suppress lower ones, no central controller.',
              'Slide 14 solution: if collision → avoid; elif goal visible → go to goal; else → wander.'
            ]
          },
          visualize: {
            title: 'Priority layers',
            description: 'Stack the layers: avoid obstacle (top, highest priority) → reach goal → wander (bottom). An arrow from a higher layer into a lower one means "suppress". The lab shows which layer wins at every tick.'
          },
          labId: 'subsumption-lab',
          examPitfalls: [
            'In the robot example the *obstacle* layer has priority, even though the slides list it as "Layer 1". Priority is about which behavior suppresses which, not the numbering.',
            'Subsumption has no central planner; do not describe it as a hierarchy of managers.'
          ],
          checkpoints: [
            {
              id: 'cp-1-2-1-1',
              question: 'In the subsumption robot of slide 13, the robot sees its goal but also detects an imminent collision. What does it do?',
              type: 'single',
              options: ['It avoids the obstacle', 'It moves toward the goal', 'It wanders randomly', 'It stops and plans a path'],
              correctAnswers: [0],
              explanation: 'Obstacle avoidance is the highest-priority layer: it suppresses "move to goal" when a collision is detected (the `if detect_collision()` branch is checked first).',
              difficulty: 'foundation',
              sourceSlide: 14
            },
            {
              id: 'cp-1-2-1-2',
              question: 'Which statement about reactive architectures is FALSE?',
              type: 'single',
              options: [
                'They rely on an explicit symbolic model of the world.',
                'They map perceptions directly to actions.',
                'They are well suited to strongly dynamic environments.',
                'A thermostat is a typical simple reflex agent.'
              ],
              correctAnswers: [0],
              explanation: 'Reactive agents have no complex internal model. An explicit symbolic model is the hallmark of cognitive (deliberative) agents.',
              difficulty: 'foundation',
              sourceSlide: 9
            }
          ]
        }),
        L({
          id: 'lesson-1-2-2',
          moduleId: 'mod-1-2',
          deck: 1,
          title: 'Flocking: Separation, Alignment, Cohesion',
          sourcePages: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
          summary: 'Flocking simulates birds or fish with three local forces: separation (avoid crowding), alignment (match neighbors’ heading) and cohesion (move toward the neighbors’ center). Simple local rules produce complex collective motion.',
          understand: {
            overview: 'Each flocking agent only sees its neighbors. Three local steering forces, weighted and summed, update its velocity and position. No agent knows the shape of the flock.',
            detailedExplanation: r`### Model assumptions (slide 20)
- Agent state: \`position[i] = (x, y)\`, \`velocity[i] = (vx, vy)\` in a 2D Cartesian plane.
- \`neighbors(i)\` returns the agents close to $i$; \`distance(a, b)\` is the Euclidean distance.
- \`normalize(v)\` returns a unit vector $\left(\frac{v_x}{\ell}, \frac{v_y}{\ell}\right)$ with $\ell=\sqrt{v_x^2+v_y^2}$.

### The three methods (slides 22–24)
**1. Separation**: move away from nearby agents to avoid collisions. For every neighbor $j$ at distance $0<d<$ \`separation_radius\`, add $\frac{\text{normalize}(p_i-p_j)}{d}$, then average. Closer neighbors push harder (division by $d$).

**2. Alignment**: match the average direction of neighbors. Average their velocities, normalize and scale to \`max_speed\` to get a *desired velocity*, and return $v_{desired}-v_i$ (a steering force).

**3. Cohesion**: move toward the center of nearby agents: $c=\frac1n\sum_j p_j$, desired velocity $=$ normalize$(c-p_i)\cdot$ \`max_speed\`, return $v_{desired}-v_i$.

### Complete update (slide 25)
$$F_i = w_s\,F^{sep}_i + w_a\,F^{ali}_i + w_c\,F^{coh}_i$$
$$v_i \leftarrow \text{limit}(v_i + F_i,\ \text{max\_speed}),\qquad p_i \leftarrow p_i + v_i\,\Delta t$$

Tuning the weights: increase **separation** to avoid collisions, **alignment** to synchronize direction, **cohesion** to keep the group compact.

### Key idea (slide 26)
**Simple local rules can produce complex collective motion.** This is *emergence*: the flock is a global pattern that no single agent represents or controls.`,
            keyPoints: [
              'Separation: steer away from close neighbors, weighted by 1/distance.',
              'Alignment: steer toward the neighbors’ average velocity (desired − current).',
              'Cohesion: steer toward the neighbors’ center of mass (desired − current).',
              'Total force = weighted sum; velocity is capped at max_speed; position += velocity·Δt.',
              'Emergence: complex global motion from simple local rules, with no leader.'
            ]
          },
          visualize: {
            title: 'Three local forces',
            description: 'Slides 16–18 show a focal bird (red) with its neighborhood circle: separation arrows point away from close birds, alignment matches the average heading, cohesion points toward the local center. Try each force alone in the lab.'
          },
          labId: 'flocking-lab',
          formulas: [
            {
              name: 'Flocking velocity update',
              latex: r`v_i \leftarrow \mathrm{limit}\big(v_i + w_sF^{sep}_i + w_aF^{ali}_i + w_cF^{coh}_i,\ v_{max}\big),\quad p_i\leftarrow p_i+v_i\Delta t`,
              explanation: 'Each tick, the three steering forces are weighted, added to the velocity, the velocity is capped, and the position integrates it.',
              variables: [
                { symbol: 'w_s, w_a, w_c', description: 'separation, alignment and cohesion weights' },
                { symbol: 'v_{max}', description: 'maximum speed' },
                { symbol: '\\Delta t', description: 'time step' }
              ]
            }
          ],
          workedExample: {
            title: 'Cohesion force for one agent',
            problem: r`Agent $i$ is at $p_i=(0,0)$ with velocity $v_i=(1,0)$ and max_speed $=2$. Its neighbors are at $(4,0)$ and $(0,4)$. Compute the cohesion force.`,
            steps: [
              { title: 'Center of neighbors', explanation: 'Average the neighbor positions.', math: r`c=\tfrac12\big((4,0)+(0,4)\big)=(2,2)` },
              { title: 'Direction and normalization', explanation: 'Point from the agent to the center, then make it unit length.', math: r`c-p_i=(2,2),\ \ \|(2,2)\|=2\sqrt2,\ \ \text{normalize}=\left(\tfrac{1}{\sqrt2},\tfrac{1}{\sqrt2}\right)` },
              { title: 'Desired velocity', explanation: 'Scale to max_speed = 2.', math: r`v_{des}=2\cdot\left(\tfrac{1}{\sqrt2},\tfrac{1}{\sqrt2}\right)=(\sqrt2,\sqrt2)\approx(1.41,1.41)` },
              { title: 'Steering force', explanation: 'Return desired minus current velocity.', math: r`F^{coh}_i=(1.41-1,\ 1.41-0)=(0.41,\ 1.41)` }
            ],
            conclusion: r`The force turns the agent up and slightly forward, toward the group’s center: $F^{coh}_i\approx(0.41, 1.41)$.`
          },
          examPitfalls: [
            'Alignment and cohesion return desired velocity MINUS current velocity (a steering force), not the desired velocity itself.',
            'Separation divides by the distance d, so closer neighbors contribute more.'
          ],
          checkpoints: [
            {
              id: 'cp-1-2-2-1',
              question: 'Which flocking rule makes an agent steer toward the average position of its neighbors?',
              type: 'single',
              options: ['Cohesion', 'Alignment', 'Separation', 'Subsumption'],
              correctAnswers: [0],
              explanation: 'Cohesion moves toward the center of nearby agents to keep the group together (slide 24). Alignment matches velocities; separation pushes away.',
              difficulty: 'foundation',
              sourceSlide: 24
            },
            {
              id: 'cp-1-2-2-2',
              question: 'Agents keep colliding in your simulation. Which weight should you increase first?',
              type: 'single',
              options: ['The separation weight', 'The cohesion weight', 'The alignment weight', 'max_speed'],
              correctAnswers: [0],
              explanation: 'Slide 25: increase separation to avoid collisions, alignment to synchronize direction, cohesion to keep the group compact. Raising max_speed would make collisions worse.',
              difficulty: 'intermediate',
              sourceSlide: 25
            }
          ]
        }),
        L({
          id: 'lesson-1-2-3',
          moduleId: 'mod-1-2',
          deck: 1,
          title: 'Inspired by Life: Stigmergy & Emergence',
          sourcePages: [27],
          summary: 'Stigmergy is indirect coordination through traces left in the environment, like ant pheromones. Partial vision and simple local behaviors yield emergent collective behavior.',
          understand: {
            overview: '“The work inspires the worker” (Grassé). Ants do not talk to each other about the shortest path: they read and reinforce pheromone traces in the environment.',
            detailedExplanation: r`### Stigmergy (slide 27)
**Stigmergy** is coordination through the **environment**: an agent's action leaves a trace (pheromone, mark, modified object) that stimulates later actions by other agents. Pierre-Paul Grassé coined it while studying termites: *"the work inspires the worker"*.

The anthill recipe:
1. **Partial vision** of space: each ant perceives only its surroundings.
2. **Simple local behaviors**: follow stronger pheromone, deposit pheromone when carrying food.
3. **Influence of pheromones**: traces evaporate unless reinforced, so short, frequently used paths win.
4. **Emergent collective behavior**: the colony finds short paths although no ant knows the map.

"The whole is greater than the sum of its parts" (attributed to Confucius on the slide) is the slogan of emergence.

### Why it matters for MAS
- It shows **indirect interaction**: agents interact by modifying the environment, not by sending messages. This links to the environment pillar ("traces and signals", slide 49).
- It is the reactive answer to coordination: no plans, no symbolic model, yet robust and adaptive.`,
            keyPoints: [
              'Stigmergy = indirect coordination through traces left in the environment (pheromones).',
              '“The work inspires the worker” (Grassé).',
              'Recipe: partial vision + simple local behaviors + pheromone influence → emergent behavior.',
              'Emergence: global order that no individual agent represents or controls.'
            ]
          },
          examPitfalls: ['Stigmergy is not direct communication: there is no message between ants, only environmental traces.'],
          checkpoints: [
            {
              id: 'cp-1-2-3-1',
              question: 'Ants find the shortest path to food by depositing and following pheromones. This form of coordination is called:',
              type: 'single',
              options: ['Stigmergy', 'Negotiation', 'Subsumption', 'Deliberation'],
              correctAnswers: [0],
              explanation: 'Indirect coordination through traces in the environment is stigmergy (slide 27).',
              difficulty: 'foundation',
              sourceSlide: 27
            }
          ]
        })
      ]
    },
    // =====================================================================
    {
      id: 'mod-1-3',
      courseId: 'course-1',
      title: 'Module 1.3: Cognitive Agents & the BDI Architecture',
      description: 'Deliberative agents, Beliefs–Desires–Intentions, the BDI control loop, its UML design, and reactive vs cognitive vs hybrid.',
      sourcePagesRange: 'Part 1.1 · Slides 28–46',
      lessons: [
        L({
          id: 'lesson-1-3-1',
          moduleId: 'mod-1-3',
          deck: 1,
          title: 'Deliberative Agents & the BDI Model',
          sourcePages: [28, 29, 30, 31, 32, 33, 34, 35],
          summary: 'Cognitive agents plan their actions from goals. BDI (Rao & Georgeff, 1991) separates Beliefs (what the agent holds true), Desires (goals it would like) and Intentions (the goal and plan it has committed to).',
          understand: {
            overview: 'Deliberative (cognitive) agents are capable of planning their actions based on specific goals. The BDI model structures their mind into beliefs, desires and intentions.',
            detailedExplanation: r`### BDI (Rao and Georgeff, 1991)
| Component | Definition | Smart-home example |
|---|---|---|
| **Beliefs** | Representations of the world: what the agent knows or believes. | Weather data, current temperature. |
| **Desires** | Goals the agent wishes to achieve. | User preferences: keep the room at 21°C. |
| **Intentions** | The plans the agent commits to in order to achieve a selected desire. | Adjust the heating now. |

The pipeline on slide 30: **Perceptions → Beliefs → Desires → Intentions → Actions**.

Security-agent example (slide 29): patrol based on *high-risk areas* (beliefs) to *ensure safety* (desire), with a *list of prioritized patrol routes* (intentions).

### Representing BDI concepts in a program (slides 32–35)
One possible representation with simple Java-like objects:
| Concept | Meaning | Representation |
|---|---|---|
| **Belief** | Information the agent currently holds about the world. | (name, value, confidence, timestamp) |
| **Desire** | A goal the agent may want to satisfy. | (goal, priority, condition) |
| **Intention** | A selected desire with an associated plan. | (desire, plan, current step, status) |

Delivery robot:
- *Beliefs*: robotLocation = Room A, battery = 28%, obstacleDetected = true, packageLocation = Room C.
- *Desires*: deliverPackage, avoidCollision, rechargeBattery, returnToBase.
- *Intention*: selected desire **avoidCollision**, plan **stop → turn → move**, status **running**.

Note how the obstacle belief makes *avoidCollision* the most urgent desire: desires are many and may conflict, but the agent commits to one intention at a time.`,
            keyPoints: [
              'Beliefs = what the agent holds true about the world (may be wrong).',
              'Desires = goals it would like to achieve (several, possibly conflicting).',
              'Intentions = the selected desire plus the plan the agent is committed to.',
              'Pipeline: Perceptions → Beliefs → Desires → Intentions → Actions.',
              'Belief (name, value, confidence, timestamp); Desire (goal, priority, condition); Intention (desire, plan, step, status).'
            ]
          },
          visualize: {
            title: 'Perceptions → Beliefs → Desires → Intentions → Actions',
            description: 'Slide 30 draws BDI as a left-to-right flow of five boxes. Perceptions update beliefs; beliefs generate desires; one desire is selected and committed to as an intention; the intention emits actions.'
          },
          labId: 'bdi-lab',
          examPitfalls: [
            'Desire ≠ intention: a desire is something wanted; an intention is a desire the agent has COMMITTED to, with a plan.',
            'Beliefs are not knowledge: they can be false (formalized later by KD45 vs S5).'
          ],
          checkpoints: [
            {
              id: 'cp-1-3-1-1',
              question: 'A smart home assistant adjusts the temperature based on weather data and user preferences. Match correctly: “adjusting the temperature” is a…',
              type: 'single',
              options: ['Intention', 'Belief', 'Desire', 'Perception'],
              correctAnswers: [0],
              explanation: 'Slide 31: adjusting temperature (intention) based on weather data (beliefs) and user preferences (desires).',
              difficulty: 'foundation',
              sourceSlide: 31
            },
            {
              id: 'cp-1-3-1-2',
              question: 'In the course’s representation, which attributes describe an Intention?',
              type: 'single',
              options: ['(desire, plan, current step, status)', '(name, value, confidence, timestamp)', '(goal, priority, condition)', '(perception, action)'],
              correctAnswers: [0],
              explanation: 'Slide 34: Intention = a selected desire with an associated plan: (desire, plan, current step, status). The second tuple is a Belief, the third a Desire.',
              difficulty: 'intermediate',
              sourceSlide: 34
            }
          ]
        }),
        L({
          id: 'lesson-1-3-2',
          moduleId: 'mod-1-3',
          deck: 1,
          title: 'The BDI Control Loop, Reconsideration & UML Design',
          sourcePages: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
          summary: 'The BDI loop: perceive, update beliefs, generate desires, select an intention, execute its next action. A realistic agent reconsiders its intention when it becomes impossible or is achieved.',
          understand: {
            overview: 'The BDI control loop connects beliefs, desires, intentions and actions in a cycle that runs while the agent is alive.',
            detailedExplanation: r`### BDI in a nutshell (slide 38)
| Step | Pseudo-code |
|---|---|
| 0 | \`perceptions = perceive_environment()\` |
| 1 | \`belief_base.update(perceptions)\` — update beliefs |
| 2 | \`desires = generate_desires(belief_base)\` |
| 3 | \`selected_desire = choose_desire(desires, belief_base)\` |
| 4 | \`plan = plan_library.find_plan(selected_desire, belief_base)\` |
| 5 | \`intention = create_intention(selected_desire, plan)\` — commit |
| 6 | \`action = intention.next_action(); execute(action)\` |

### Improved loop: reconsideration (slide 39)
The naive loop re-deliberates every cycle. A realistic agent **keeps its intention** and only reconsiders when needed:
- if \`current_intention\` is **null** or **is_impossible(beliefs)** → generate desires, \`select_highest_priority\`, find a plan, create a new intention;
- execute the next action;
- if \`current_intention.is_achieved(beliefs)\` → drop it (set to null).

This answers the guiding questions of slide 37: when the world changes, beliefs are updated and the intention is checked for impossibility; priorities decide which desire becomes the intention; and **yes, an intention can be interrupted** when it becomes impossible.

### UML design (slides 40–43)
- **BDIAgent**: beliefs: BeliefBase, desires: List<Desire>, intention: Intention, plans: PlanLibrary; \`+runCycle()\`, \`+deliberate()\`.
- **BeliefBase**: \`Map<String, Belief>\`; \`update(perceptions)\`, \`get(name)\`, \`contains(name)\`.
- **Belief**: name, value, confidence, timestamp (data only).
- **Desire**: goal, priority; \`isSatisfied(beliefs)\`, \`isRelevant(beliefs)\`.
- **Intention**: desire, plan, currentStep; \`nextAction()\`, \`isAchieved(beliefs)\`.
- **Plan**: \`Queue<Action>\`; \`nextAction()\`, \`isFinished()\`.
- **PlanLibrary** provides plans for desires.

Design question: *data-only classes* (Belief, Plan's queue) vs *decision-logic classes* (BDIAgent.deliberate, Desire relevance tests).

### Takeaway (slide 45)
**BDI separates what the agent believes, what it wants, and what it has committed to doing.** Open discussion points (slide 44): beliefs as facts, probabilities or time-stamped observations? Should every goal become a desire, or only relevant ones? When to keep vs reconsider a plan?`,
            keyPoints: [
              'Loop: perceive → update beliefs → generate desires → select desire → find plan → commit intention → execute next action.',
              'Improved loop: only re-deliberate when there is no intention or it has become impossible; drop it once achieved.',
              'Intentions can be interrupted; priorities decide which desire is selected.',
              'UML: BDIAgent owns BeliefBase, List<Desire>, Intention and PlanLibrary; Intention = Desire + Plan + current step.'
            ]
          },
          labId: 'bdi-lab',
          examPitfalls: [
            'The naive loop re-plans at every cycle (costly, unstable). The improved loop commits: that commitment is what makes it an *intention*.',
            'Do not forget the "is_achieved → drop the intention" step: otherwise the agent keeps executing a finished plan.'
          ],
          checkpoints: [
            {
              id: 'cp-1-3-2-1',
              question: 'In the improved BDI loop (slide 39), when does the agent select a new intention?',
              type: 'single',
              options: [
                'When it has no current intention or the current one has become impossible',
                'At every cycle, whatever happens',
                'Only when a new perception arrives',
                'Never: the first intention is kept forever'
              ],
              correctAnswers: [0],
              explanation: 'The condition is `current_intention is null or current_intention.is_impossible(belief_base)`. Otherwise the agent stays committed.',
              difficulty: 'intermediate',
              sourceSlide: 39
            },
            {
              id: 'cp-1-3-2-2',
              question: 'Order the BDI loop correctly.',
              type: 'single',
              options: [
                'Perceive → update beliefs → generate desires → select intention → execute action',
                'Generate desires → perceive → execute action → update beliefs → select intention',
                'Select intention → perceive → generate desires → update beliefs → execute action',
                'Perceive → execute action → update beliefs → generate desires → select intention'
              ],
              correctAnswers: [0],
              explanation: 'Slide 37 lists the structure: Perceive, Update beliefs, Generate desires, Select intention, Execute action.',
              difficulty: 'foundation',
              sourceSlide: 37
            }
          ]
        }),
        L({
          id: 'lesson-1-3-3',
          moduleId: 'mod-1-3',
          deck: 1,
          title: 'Reactive, Cognitive or Hybrid?',
          sourcePages: [46],
          summary: 'Reactive agents are fast with no model; cognitive agents plan with an explicit symbolic model but are slower; hybrid agents combine layers to balance both.',
          understand: {
            overview: 'The choice of architecture is a trade-off between speed and reasoning depth.',
            detailedExplanation: r`### Comparison table (slide 46)
| Criterion | Reactive | Cognitive | Hybrid |
|---|---|---|---|
| **Internal model** | Absent or minimal | Explicit and symbolic | Partial, depending on the layers |
| **Speed** | Very fast | Slower | Balanced |
| **Planning** | Low | High | Moderate to high |
| **Typical use** | Real-time, reflexes | Complex reasoning | Autonomous robotics |

A hybrid agent typically puts a reactive layer underneath (fast reflexes such as emergency braking) and a deliberative layer on top (route planning). An autonomous car is the canonical example.`,
            keyPoints: [
              'Reactive: no/minimal model, very fast, little planning, real-time reflexes.',
              'Cognitive: explicit symbolic model, slower, strong planning, complex reasoning.',
              'Hybrid: partial model, balanced speed, moderate-to-high planning, autonomous robotics.'
            ]
          },
          examPitfalls: ['Hybrid is not "half as fast": it is balanced because the reactive layer handles urgent events while the deliberative layer plans.'],
          checkpoints: [
            {
              id: 'cp-1-3-3-1',
              question: 'Which architecture does the course associate with autonomous robotics?',
              type: 'single',
              options: ['Hybrid', 'Reactive', 'Cognitive', 'Subsumption only'],
              correctAnswers: [0],
              explanation: 'Slide 46: typical use of hybrid agents is autonomous robotics; reactive → real-time reflexes; cognitive → complex reasoning.',
              difficulty: 'foundation',
              sourceSlide: 46
            }
          ]
        })
      ]
    },
    // =====================================================================
    {
      id: 'mod-1-4',
      courseId: 'course-1',
      title: 'Module 1.4: MAS Structure, Environment & Interaction',
      description: 'Classification axes, environment properties and the exercises, and the interaction situations (independence, cooperation, competition).',
      sourcePagesRange: 'Part 1.1 · Slides 47–65',
      lessons: [
        L({
          id: 'lesson-1-4-1',
          moduleId: 'mod-1-4',
          deck: 1,
          title: 'Classifying MAS: Openness, Diversity, Control',
          sourcePages: [47, 48],
          summary: 'A MAS is characterized by three axes: open or closed, homogeneous or heterogeneous agents, centralized or decentralized control.',
          understand: {
            overview: 'MAS can be characterized by their openness, agent diversity, and mode of control.',
            detailedExplanation: r`| Axis | Option 1 | Option 2 | Key idea |
|---|---|---|---|
| **Openness** | Closed | Open | Agents are fixed, or can enter and leave. |
| **Diversity** | Homogeneous | Heterogeneous | Agents have the same capabilities, or complementary roles. |
| **Control** | Centralized | Decentralized | Decision-making is concentrated or distributed. |

Examples: a robot soccer team is closed and mostly homogeneous; an online marketplace is **open** (sellers join and leave), **heterogeneous** (buyers, sellers, platform) and largely **decentralized**. Openness is exactly what makes Sybil attacks and whitewashing possible in reputation systems (Chapter 2).`,
            keyPoints: [
              'Openness: closed (fixed agents) vs open (agents enter and leave).',
              'Diversity: homogeneous (same capabilities) vs heterogeneous (complementary roles).',
              'Control: centralized vs decentralized decision-making.'
            ]
          },
          checkpoints: [
            {
              id: 'cp-1-4-1-1',
              question: 'A peer-to-peer file-sharing network where anyone can join or leave at any time is, on the openness axis:',
              type: 'single',
              options: ['Open', 'Closed', 'Homogeneous', 'Centralized'],
              correctAnswers: [0],
              explanation: 'Openness concerns whether agents can enter and leave. Homogeneous is a diversity value and centralized is a control value.',
              difficulty: 'foundation',
              sourceSlide: 48
            }
          ]
        }),
        L({
          id: 'lesson-1-4-2',
          moduleId: 'mod-1-4',
          deck: 1,
          title: 'The Environment and Its Properties',
          sourcePages: [49, 50, 51, 52, 53, 54, 55, 56],
          summary: 'The environment is everything that is not the agent. It is classified as accessible or not, deterministic or not, static or dynamic, discrete or continuous.',
          understand: {
            overview: 'The environment is everything that is not the agent: action space, resources, constraints, traces and signals. It determines what agents perceive, what they can modify, and how they interact indirectly.',
            detailedExplanation: r`### Four environment properties (slide 50)
| Property | Values | Test |
|---|---|---|
| **Observability (accessibility)** | Fully observable / partially observable (non-accessible) | Does the agent perceive the entire state? |
| **Determinism** | Deterministic / stochastic (non-deterministic) | Does an action produce a unique result? |
| **Dynamics** | Static / dynamic | Can things change while the agent is deciding? |
| **Topology** | Discrete / continuous | Finite/countable states, perceptions and actions, or a continuum? |

### The four exercises (slides 52–55) with the course answers
| Situation | Accessible? | Deterministic? | Static? | Discrete? |
|---|---|---|---|---|
| Exploration robot (Mars rover) | Inaccessible | Non-deterministic | Dynamic | Continuous |
| Computer network | Accessible | Deterministic | Dynamic | Discrete |
| Chess game | Accessible | Deterministic | Static | Discrete |
| Vacuum cleaner robot | Partially accessible | Non-deterministic | Dynamic | Discrete or continuous depending on the model |

**Discussion (slide 56)**: some answers depend on the assumptions about sensors, actuators and the level of abstraction. In an exam, *state your assumption* ("if we model the room as a grid, it is discrete").`,
            keyPoints: [
              'Environment = everything that is not the agent (actions, resources, constraints, traces, signals).',
              'Four properties: accessible/inaccessible, deterministic/stochastic, static/dynamic, discrete/continuous.',
              'Chess: accessible, deterministic, static, discrete. Mars rover: inaccessible, non-deterministic, dynamic, continuous.',
              'Answers depend on modelling assumptions: say which ones you make.'
            ]
          },
          labId: 'environment-lab',
          examPitfalls: [
            'Static means nothing changes WHILE the agent decides. Chess is static (ignoring the clock); a network is dynamic.',
            'Deterministic concerns the effect of actions, not whether the agent sees everything.'
          ],
          checkpoints: [
            {
              id: 'cp-1-4-2-1',
              question: 'According to the course, chess is:',
              type: 'single',
              options: [
                'Accessible, deterministic, static, discrete',
                'Accessible, stochastic, dynamic, discrete',
                'Inaccessible, deterministic, static, continuous',
                'Partially accessible, deterministic, dynamic, discrete'
              ],
              correctAnswers: [0],
              explanation: 'Slide 54: the whole board is visible, moves have unique results, nothing changes while thinking (ignoring clocks), and there are finitely many positions.',
              difficulty: 'foundation',
              sourceSlide: 54
            },
            {
              id: 'cp-1-4-2-2',
              question: 'Why is the exploration robot’s environment “inaccessible”?',
              type: 'single',
              options: [
                'Its sensors only perceive part of the terrain',
                'Its actions always have the same effect',
                'The terrain never changes',
                'It moves in a grid'
              ],
              correctAnswers: [0],
              explanation: 'Inaccessible (partially observable) means the agent’s perception is limited and it cannot see the entire state.',
              difficulty: 'foundation',
              sourceSlide: 52
            }
          ]
        }),
        L({
          id: 'lesson-1-4-3',
          moduleId: 'mod-1-4',
          deck: 1,
          title: 'Interaction Situations: Independence, Cooperation, Competition',
          sourcePages: [57, 58, 59, 60, 61, 62, 63, 64, 65],
          summary: 'Interaction situations are classified by goals (compatible or not), resources and skills (sufficient or not). Compatible goals give independence or cooperation; incompatible goals give pure competition, negotiation or conflict.',
          understand: {
            overview: 'The core of a MAS is what agents do together: communication, coordination, cooperation, competition, negotiation and delegation.',
            detailedExplanation: r`### Forms of interaction (slide 58)
Communication, coordination, cooperation, competition, plus:
- **Negotiation & compromise**: resolve conflicts over objectives or resources to find an acceptable solution.
- **Delegation & allocation**: distribute tasks according to agents' skills, resources or availability.

Purpose of interactions (slide 60): enable coordination, achieve a coherent global behavior, exchange knowledge and beliefs. Challenges: *identify* interaction situations and *manage* them.

### Classifying a situation (slides 61–63)
| Goals | Resources & skills | Situation |
|---|---|---|
| Compatible | Sufficient resources **and** skills | **Independence** |
| Compatible | Insufficient resources **or** skills | **Cooperation** |
| Incompatible | Sufficient resources **and** skills | **Pure competition** |
| Incompatible | Insufficient resources **or** skills | **Negotiation** (competition type) |
| Incompatible | Insufficient resources **and** skills | **Conflict** (competition type) |

Read it as two questions: *Do our goals clash?* and *Can each of us succeed alone?*

### Key takeaways (slide 64)
**Autonomy** (each agent decides locally) → **Interaction** (agents communicate, negotiate, coordinate) → **Organization** (the collective produces global behavior).`,
            keyPoints: [
              'Compatible goals + sufficient resources and skills → independence.',
              'Compatible goals + insufficient resources or skills → cooperation.',
              'Incompatible goals → competition: pure (sufficient), negotiation (insufficient resources OR skills), conflict (insufficient resources AND skills).',
              'Autonomy → Interaction → Organization produces global behavior.'
            ]
          },
          labId: 'environment-lab',
          examPitfalls: ['Cooperation requires COMPATIBLE goals. Two agents lacking resources but with incompatible goals are in negotiation or conflict, not cooperation.'],
          checkpoints: [
            {
              id: 'cp-1-4-3-1',
              question: 'Two delivery robots share the same goal (deliver all parcels) but neither can carry the heaviest parcel alone. The situation is:',
              type: 'single',
              options: ['Cooperation', 'Independence', 'Pure competition', 'Conflict'],
              correctAnswers: [0],
              explanation: 'Compatible goals + insufficient resources/skills = cooperation (slide 62).',
              difficulty: 'intermediate',
              sourceSlide: 62
            },
            {
              id: 'cp-1-4-3-2',
              question: 'Incompatible goals with insufficient resources AND insufficient skills is called:',
              type: 'single',
              options: ['Conflict', 'Negotiation', 'Pure competition', 'Cooperation'],
              correctAnswers: [0],
              explanation: 'Slide 63: pure competition = sufficient resources and skills; negotiation = insufficient resources or skills; conflict = insufficient resources and skills.',
              difficulty: 'intermediate',
              sourceSlide: 63
            }
          ]
        })
      ]
    },
    // =====================================================================
    {
      id: 'mod-1-5',
      courseId: 'course-1',
      title: 'Module 1.5: Organizations in MAS',
      description: 'What an organization defines, the six organizational forms, and how to choose one.',
      sourcePagesRange: 'Part 1.2 · Slides 1–12',
      lessons: [
        L({
          id: 'lesson-1-5-1',
          moduleId: 'mod-1-5',
          deck: 2,
          title: 'What Is an Organization? Six Forms',
          sourcePages: [1, 2, 3],
          summary: 'An organization defines how autonomous agents relate: roles, authority, communication, coordination and norms. Six common forms: centralized, hierarchical, peer-to-peer, market-based, coalition/federation, holonic.',
          understand: {
            overview: 'In a MAS, an organization defines how autonomous agents relate to each other. The organizational form determines who can decide, who can request help, who can veto, and how the system responds to change.',
            detailedExplanation: r`### What an organization specifies (slide 2)
**Roles**, **authority**, **communication**, **coordination** and **norms**.

### Six common forms (slide 3)
| Form | One-line definition | Shape |
|---|---|---|
| **Centralized** | One coordinator has global visibility and assigns actions. | star |
| **Hierarchical** | Decisions flow through strategic, tactical and operational levels. | tree |
| **Peer-to-peer** | Agents coordinate locally without a permanent leader. | mesh |
| **Market-based** | Tasks are allocated through bids, prices, auctions or contracts. | auction |
| **Coalition / Federation** | Groups form around temporary shared goals. | alliance |
| **Holonic** | Nested part-whole structures: autonomous and coordinated at once. | nested |

Learn the shape keyword with each form: it is the fastest way to draw them in an exam.`,
            keyPoints: [
              'An organization specifies roles, authority, communication, coordination and norms.',
              'It determines who can decide, request help, veto, and how the system adapts.',
              'Six forms: centralized (star), hierarchical (tree), peer-to-peer (mesh), market (auction), coalition (alliance), holonic (nested).'
            ]
          },
          labId: 'organization-lab',
          checkpoints: [
            {
              id: 'cp-1-5-1-1',
              question: 'Which organizational form is described as “nested part-whole structures: autonomous and coordinated at once”?',
              type: 'single',
              options: ['Holonic', 'Hierarchical', 'Coalition', 'Peer-to-peer'],
              correctAnswers: [0],
              explanation: 'Slide 3: holonic = nested part-whole structures. Hierarchical is a tree of levels, not nested wholes.',
              difficulty: 'foundation',
              sourceSlide: 3
            }
          ]
        }),
        L({
          id: 'lesson-1-5-2',
          moduleId: 'mod-1-5',
          deck: 2,
          title: 'Centralized and Hierarchical Organizations',
          sourcePages: [4, 5],
          summary: 'Centralized: one controller optimizes globally but is a bottleneck and single point of failure. Hierarchical: layered delegation scales and clarifies accountability but adapts slowly.',
          understand: {
            overview: 'Both forms concentrate authority, at one node (centralized) or along levels (hierarchical).',
            detailedExplanation: r`### Centralized organization (slide 4)
One **controller** collects state, optimizes a plan and sends instructions to agents.
- ✅ **Good**: simple global optimization and conflict resolution.
- ❌ **Risk**: bottleneck, single point of failure, less autonomy.
- **Example**: a supervisor agent assigns customer-support tickets to billing, technical, legal and escalation agents.
- Caption: *every dependency is visible, but every decision also waits on the center.*

### Hierarchical organization (slide 5)
Agents are arranged in **layers**. Higher levels set goals; lower levels execute and report back.
- ✅ **Good**: scalable delegation and clear accountability.
- ⚠️ **Trade-off**: slower adaptation when information must climb levels.
- **Example**: warehouse robots by zone: global scheduler → zone manager → robot navigation (Strategic Planner → Zone Leads → R1…R4).
- Caption: *delegation creates scale: goals descend; status and exceptions ascend.*`,
            keyPoints: [
              'Centralized: global optimization and easy conflict resolution, but bottleneck and single point of failure.',
              'Hierarchical: scalable delegation and accountability, but information climbing levels slows adaptation.',
              'In a hierarchy, goals descend and status/exceptions ascend.'
            ]
          },
          labId: 'organization-lab',
          checkpoints: [
            {
              id: 'cp-1-5-2-1',
              question: 'What is the main risk of a centralized organization?',
              type: 'single',
              options: ['A bottleneck and single point of failure', 'Agents cannot be assigned tasks', 'Conflicts cannot be resolved', 'Too much local autonomy'],
              correctAnswers: [0],
              explanation: 'Slide 4: risk = bottleneck, single point of failure, less autonomy.',
              difficulty: 'foundation',
              sourceSlide: 4
            }
          ]
        }),
        L({
          id: 'lesson-1-5-3',
          moduleId: 'mod-1-5',
          deck: 2,
          title: 'Peer-to-Peer, Market, Coalition and Holonic Organizations',
          sourcePages: [6, 7, 8, 9],
          summary: 'Peer-to-peer coordinates locally and is resilient; markets allocate tasks by bids; coalitions are temporary alliances of independent organizations; holons are wholes that are also parts.',
          understand: {
            overview: 'These four forms distribute authority: through local negotiation, prices, temporary alliances or nesting.',
            detailedExplanation: r`### Peer-to-peer / heterarchical (slide 6)
No permanent leader; agents negotiate directly and coordinate through local rules.
- **Locality**: use neighbor information. **Resilience**: redundant paths keep the system alive. **Emergence**: global order arises locally.
- Example: drones mapping a forest fire adjust their sectors from nearby drones and battery status.
- *Local negotiation replaces command; robustness comes from redundant paths.*

### Market-based (slide 7)
Agents compete or negotiate for tasks using **prices, utilities, bids or contracts**: **Announce** (task appears) → **Bid** (estimate cost) → **Award** (choose winner).
- Example: delivery robots bid for parcels based on distance, battery, load and deadline. Agent B wins with the best bid (8 min vs 12 and 15).
- *Allocation emerges from offers, costs, deadlines and constraints.* This is the Contract Net idea.

### Coalition / federated (slide 8)
Separate organizations form **temporary alliances** for a shared task.
- ✅ Local autonomy across departments or platforms. ⚠️ Challenge: interoperability, trust, protocols, conflict resolution.
- Example: police, hospitals, drones and logistics agents cooperate during a flood without merging into one central system (shared protocol between fire, medical and logistics teams).

### Holonic (slide 9)
A **holon** is simultaneously a **whole and a part**. Holonic MAS combine autonomy with nested coordination: machine → cell → factory → supply network.
- Example: a product holon negotiates with machine holons; each production cell is itself a larger holon.`,
            keyPoints: [
              'Peer-to-peer: no leader, local rules, resilience through redundant paths, emergence.',
              'Market: announce → bid → award; agents reveal costs through bids (e.g. delivery robots bidding minutes).',
              'Coalition: temporary alliance of independent organizations; challenges are interoperability, trust and protocols.',
              'Holonic: each holon is a whole and a part (machine → cell → factory).'
            ]
          },
          labId: 'organization-lab',
          checkpoints: [
            {
              id: 'cp-1-5-3-1',
              question: 'Police, hospitals and drones cooperate during a flood without merging into one system. Which form is this?',
              type: 'single',
              options: ['Coalition / federation', 'Centralized', 'Holonic', 'Market-based'],
              correctAnswers: [0],
              explanation: 'Slide 8: independent organizations align temporarily without surrendering local control.',
              difficulty: 'foundation',
              sourceSlide: 8
            },
            {
              id: 'cp-1-5-3-2',
              question: 'In a market-based organization, three robots bid 12, 8 and 15 minutes for a parcel. Who gets the task, and why?',
              type: 'single',
              options: ['The robot bidding 8 minutes: lowest cost', 'The robot bidding 15 minutes: highest bid', 'The coordinator decides arbitrarily', 'All three share it'],
              correctAnswers: [0],
              explanation: 'Slide 7: Agent B wins with "bid: 8 min ✓". Bids estimate cost, so the lowest estimated time wins.',
              difficulty: 'foundation',
              sourceSlide: 7
            }
          ]
        }),
        L({
          id: 'lesson-1-5-4',
          moduleId: 'mod-1-5',
          deck: 2,
          title: 'Choosing an Organizational Form',
          sourcePages: [10, 11, 12],
          summary: 'Match the form to the situation: knowledge location, who decides, what can fail, and how the system adapts. Organizational structure is a coordination mechanism.',
          understand: {
            overview: 'Pick the form that matches information, autonomy, uncertainty and failure tolerance.',
            detailedExplanation: r`### Decision table (slide 10)
| Situation | Best fit | Why |
|---|---|---|
| Small team, clear global objective | **Centralized** | Simple control and easy debugging. |
| Many agents with stable responsibilities | **Hierarchical** | Delegation and monitoring scale naturally. |
| Dynamic environment, partial information | **Peer-to-peer** | Robust local adaptation; no single failure point. |
| Uncertain costs or scarce resources | **Market-based** | Agents reveal preferences through bids. |
| Independent organizations must cooperate | **Coalition** | Shared action without loss of autonomy. |
| Nested physical or organizational systems | **Holonic** | Autonomy at every level of aggregation. |

### Four design questions (slide 11)
1. **Where is knowledge?** Global, local, private or distributed?
2. **Who can decide?** Leader, team lead, market winner, or all peers?
3. **What can fail?** Coordinator, links, incentives or trust?
4. **How does it adapt?** Replanning, negotiation, self-organization, coalition change?

Practice: an organization for **autonomous taxis during a city marathon**. A good answer mixes forms: a market to allocate rides (scarce cars, uncertain costs), peer-to-peer rerouting around closed streets (dynamic, partial information), and a central authority for safety constraints (closed roads).

### Key takeaway (slide 12)
**Organizational structure is a coordination mechanism.**`,
            keyPoints: [
              'Small clear team → centralized; many stable roles → hierarchical; dynamic and partial info → peer-to-peer.',
              'Scarce resources/uncertain costs → market; independent organizations → coalition; nested systems → holonic.',
              'Four questions: where is knowledge, who decides, what can fail, how does it adapt.',
              'Organizational structure is a coordination mechanism.'
            ]
          },
          labId: 'organization-lab',
          checkpoints: [
            {
              id: 'cp-1-5-4-1',
              question: 'A dynamic environment with only partial information and no tolerance for a single point of failure best fits which form?',
              type: 'single',
              options: ['Peer-to-peer', 'Centralized', 'Hierarchical', 'Holonic'],
              correctAnswers: [0],
              explanation: 'Slide 10: dynamic environment, partial information → peer-to-peer: robust local adaptation, no single failure point.',
              difficulty: 'intermediate',
              sourceSlide: 10
            },
            {
              id: 'cp-1-5-4-2',
              question: 'Why does the course recommend a market-based organization when costs are uncertain or resources scarce?',
              type: 'single',
              options: ['Agents reveal their preferences and costs through bids', 'A coordinator knows every cost in advance', 'Markets never fail', 'It removes the need for communication'],
              correctAnswers: [0],
              explanation: 'Slide 10: market-based fits because agents reveal preferences through bids.',
              difficulty: 'intermediate',
              sourceSlide: 10
            }
          ]
        })
      ]
    }
  ]
};
