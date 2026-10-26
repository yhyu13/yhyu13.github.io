/**
 * concepts.mjs - the concept index for the CS2680 study site.
 *
 * Every `term` and every `gloss` below is a VERBATIM substring of the course
 * digest in courseware/_digest/part1.md, part2.md, part3.md.  build.mjs
 * validates that at build time and refuses to emit concepts.html if a single
 * string is not in the digest - so no concept on the page can be invented.
 *
 * A concept's `slides` list is editorial: it says which slide of which deck
 * teaches the idea.  Those are the deep links of the form
 * `decks/lecture-04.html#/7` that the concept index is built around.
 *
 * Group order follows the digest's lecture order; the `part` field carries
 * the course's own Part I / Part II split.
 */

/**
 * Short display labels for the 14 decks, used by the concept index and the
 * search page.  These are navigation labels, not course facts.
 */
export const DECK_LABELS = {
  'course-overview': 'Course overview',
  'lecture-01': 'Lecture 1',
  'lecture-02': 'Lecture 2',
  'lecture-03': 'Lecture 3',
  'lecture-04': 'Lecture 4',
  'lecture-05': 'Lecture 5',
  'lecture-06': 'Lecture 6',
  'lecture-07': 'Lecture 7',
  'lecture-08': 'Lecture 8',
  'agent-evaluation': 'Evaluation note',
  'cost-effective-agents': 'Cost note',
  'transformers-llm-foundations': 'Transformers note',
  'assignments-and-project': 'Assignments',
  'part-ii-status': 'Part II status',
};

export const COURSE_ON_ONE_PAGE = {
  thesis:
    'Part I of CS2680 (Modern AI Systems: Agents and System Optimizations, Harvard SEAS, Fall 2026, instructor Juncheng Yang) walks one agentic system from top to bottom.',
  thesisShort:
    'The object of study is the whole agentic serving system, not the model.',
  partIDates: 'Part I spans Sep 2 - Oct 14; Part II spans Oct 19 - Dec 7.',
  parts: [
    {
      h: 'Part I',
      dates: 'Sep 2 - Oct 14',
      topics: [
        'Course overview and logistics',
        'Agents use I: How Claude Code Works',
        'Agents use II: 100x Engineer with Multi-agents',
        'Agents design I: context management and tool design',
        'Agents design II: multi-agent architecture, coordination, and communication',
        'Agents design III: agent memory and reliability',
        'Agent design IV: agent evaluation',
        'Advanced agent design I: Cost and performance',
      ],
      deck: 'lecture-01',
      n: 1,
    },
    {
      h: 'Part II',
      dates: 'Oct 19 - Dec 7',
      topics: [
        'Efficient LLM serving basics I',
        'Efficient LLM serving basics II',
        'Efficient LLM serving basics III',
        'Efficient LLM serving: speculative decoding',
        'Efficient agentic systems: scheduling and prefix caching',
        'Efficient LLM serving: pruning and quantization',
        'Efficient LLM serving: KV-cache optimization and model architectures',
        'Efficient agentic system: routing and load balancing',
        'Efficient agentic systems: others',
      ],
      deck: 'part-ii-status',
      n: 3,
    },
  ],
  assignments: [
    [
      '1',
      'Mads-Lens',
      'Watch the agent work / "Experience a coding agent: build a web UI for Claude Code"',
      '10%',
      'Wed Sep 2',
      'Sun Sep 20, 11:59pm',
      '4-6 hours',
    ],
    [
      '2',
      'Mads-Loop',
      'Build the loop / "Build an agent harness"',
      '10%',
      'Mon Sep 21',
      'Sun Oct 4, 11:59pm',
      '10-12 hours',
    ],
    [
      '3',
      'Mads-Opt',
      'Make every token count / "Harness competition"',
      '20%',
      'Mon Oct 5',
      'Tue Oct 20, 11:59pm',
      '10-15 hours',
    ],
    [
      '4',
      'Mads-Serve',
      'Own the serving engine / "Serve your own agent"',
      '20%',
      'Wed Oct 21',
      'Tue Nov 10, 11:59pm',
      '10-14 hours',
    ],
    [
      '5',
      'Mads-Stack',
      'Optimize the full stack / "Optimize the full stack"',
      '10%',
      'Wed Nov 11',
      'Sun Nov 29, 11:59pm',
      '12-18 hours',
    ],
  ],
  assignmentsNote:
    'Assignments 1, 2, 5 at 10% each; Assignments 3 and 4 at 20% each - 70% for the assignments. The final project is 20%, class participation 10%, bonus up to 10%. There is no exam, midterm, or final. At most 20% of the class receives an A.',
  evaluation:
    'Evaluate the whole stack, not the model: leakage enters through prompt, retrieval, memory, tools, scaffold and developer iteration.',
  evaluationNote:
    'A real-world agent has more than three dimensions: capability, cost, speed and agent usability; Assignment 3 is graded on all three of capability, cost and speed, using Pareto dominance.',
  costTerm: 'Every saving has a counter-cost',
  cost: 'Cost = Users x Sessions / User x Turns / Session x Steps / Turn x Tokens / Step x Price / Token.',
  costNote:
    'Net saving = gross saving - counter-cost, and both must be measured on the same tasks',
};

export const CONCEPT_GROUPS = [
  /* ------------------------------------------------ Part I, week 1 ------ */
  {
    id: 'lecture-1',
    part: 'Part I',
    title: 'Lecture 1 - Course overview and logistics',
    blurb: 'Sep 2, 2026 - the category shift from AI/ML to AI Systems',
    deck: 'lecture-01',
    concepts: [
      {
        term: 'A graduate-level computer systems course on agentic AI systems',
        gloss:
          'expecting one prior graduate-level systems course (OS, networking, databases, architecture) plus real systems experience',
        slides: ['course-overview#3', 'lecture-01#1'],
      },
      {
        term: 'Five assignments',
        gloss:
          'build a web UI for Claude Code, build a simple coding agent, optimize your coding agent, serve your agent, optimize the full stack',
        slides: ['course-overview#7', 'assignments-and-project#2'],
      },
      {
        term: 'Two ladders of agent adoption',
        gloss:
          'AI use levels (1 Chat, 2 Coding agent with MCP/Skills/Plugins/subagent/parallel agent, 3 Customized agent) and Agentic Coding Levels (0 No AI through 5 Parallel agents)',
        slides: ['lecture-01#14'],
      },
      {
        term: 'AI systems means many moving parts',
        gloss:
          'AI/ML asks "what model should we use" and optimizes accuracy and capability, while AI Systems asks "how do we train and serve it at scale"',
        slides: ['lecture-01#2'],
      },
      {
        term: 'Compute differences',
        gloss:
          'heterogeneous work split (CPU for tokenization, kernel launch, data movement, tool calls; GPU for matmul), distinct phases (prefill compute-bound, decode memory-bandwidth-bound)',
        slides: ['lecture-01#3'],
      },
      {
        term: 'Non-determinism',
        gloss:
          'floating-point addition is not associative and a 7th-decimal shift in a matmul can flip the next token',
        slides: ['lecture-01#4'],
      },
      {
        term: 'prefix cache',
        gloss: 'state (weights GBs to TBs, KV-cache 10s-100s KB per token, prefix cache)',
        slides: ['lecture-01#5', 'lecture-08#8'],
      },
      {
        term: 'An agent is an autonomous software system',
        gloss:
          'running plan -> act -> observe -> adapt -> deliver; an LLM is thus a new kind of programmable computer (context window as RAM, tools as peripherals, agent harness as OS, agent as application)',
        slides: ['lecture-01#6'],
      },
      {
        term: 'LLMs are "strange computers"',
        gloss:
          'surprisingly weak at persistent memory, reliably understanding context, avoiding hallucinations, knowing what they do not know, and security/adversarial input',
        slides: ['lecture-01#7'],
      },
      {
        term: 'Agent serving replaces request-inference-response',
        gloss:
          'the objective is to maximize task success subject to latency, cost, resources, reliability and security - throughput is the wrong objective',
        slides: ['lecture-01#8', 'lecture-01#10'],
      },
      {
        term: 'Every agentic workload property names a systems problem',
        gloss:
          'repeated prefixes -> prefix caching; tool dependencies -> dependency-aware scheduling; variable tool latency -> asynchronous execution',
        slides: ['lecture-01#11'],
      },
      {
        term: 'Observability is first-class',
        gloss:
          'the distributed trace becomes a nested trajectory (session, turn, agent step, model request, tool call, tool result, subagent)',
        slides: ['lecture-01#12'],
      },
    ],
  },

  /* ------------------------------------------------ Part I, weeks 2-3 ---- */
  {
    id: 'lecture-2',
    part: 'Part I',
    title: 'Lecture 2 - How Claude Code works',
    blurb: 'Sep 9, 2026 - the agentic loop, context, permissions and memory',
    deck: 'lecture-02',
    concepts: [
      {
        term: 'The agentic loop',
        gloss:
          'every step is conditioned on what the last one returned, so one user prompt is many model calls and many tool executions rather than a single request',
        slides: ['lecture-02#2', 'lecture-04#2'],
      },
      {
        term: 'Context exists before the first keystroke',
        gloss:
          'SYSTEM (Claude Code instructions), PROJECT (environment), MEMORY (persistent project/user notes/CLAUDE.md), TOOLS (Read, Edit, Bash, Glob, Grep, Web, Agent), SKILLS/MCP (names and descriptions only) and USER (the request)',
        slides: ['lecture-02#3'],
      },
      {
        term: 'The model proposes and the harness executes',
        gloss:
          'the model emits a request such as Bash("pytest"), the Claude Code harness resolves it, checks permissions and executes, and the tool_result goes back into the model\'s context',
        slides: ['lecture-02#4', 'lecture-04#3'],
      },
      {
        term: 'Permissions sit between intent and execution',
        gloss:
          'modes Manual, Accept Edits, Bypass permission and Auto (a small model checks it), producing allowed, ask or denied',
        slides: ['lecture-02#5'],
      },
      {
        term: 'Context grows with every step and is then compacted',
        gloss:
          'typical context size is 1M tokens, and context is not free because prefix-cache reads account for most of the cost',
        slides: ['lecture-02#6', 'lecture-08#8'],
      },
      {
        term: 'Agents are stateless between runs',
        gloss:
          'every permanent token is rent paid at the start of every session, and stale memory is worse than none because it actively misleads',
        slides: ['lecture-02#7'],
      },
      {
        term: 'Two systems carry knowledge forward',
        gloss:
          'CLAUDE.md files (written by you; instructions and rules; project, user or org scope) and auto memory (written by Claude; learnings and patterns; per repository, shared across worktrees)',
        slides: ['lecture-02#8'],
      },
      {
        term: 'CLAUDE.md lives broadest-scope-first',
        gloss:
          'It should stay under 200 lines per file and hold commands, hard constraints and facts the agent cannot cheaply infer',
        slides: ['lecture-02#8'],
      },
      {
        term: 'Auto memory lives in ~/.claude/projects/<project>/memory/',
        gloss:
          'retrieval loads the index always and reads topic files only when relevant, and four commands control it - /memory, /context, /init, /doctor',
        slides: ['lecture-02#9', 'lecture-06#2'],
      },
      {
        term: 'The core tool set',
        gloss:
          'Read (open a file, inspect state - the most used tool), Search (grep and glob), Fetch (pull a page or doc - brings untrusted text inside), Edit/Write (change files - the first tool with consequences), Shell (build, test, git - the whole machine unless sandboxed), Delegate (spawn a subagent - a tool that returns a summary)',
        slides: ['lecture-02#10'],
      },
      {
        term: 'Four extension mechanisms that are not interchangeable',
        gloss:
          'a skill decides how, MCP reaches outside, a hook enforces, a plugin distributes',
        slides: ['lecture-02#11', 'lecture-02#15'],
      },
      {
        term: 'MCP (Model Context Protocol)',
        gloss:
          'It has three primitives - Tools, Resources, Prompts - is user-controlled for prompts, and needs least privilege, separated reads and writes, distrust of tool output as instructions, and vetting before installing',
        slides: ['lecture-02#13', 'lecture-02#14'],
      },
    ],
  },

  {
    id: 'lecture-3',
    part: 'Part I',
    title: 'Lecture 3 - Multi-agent and best practice',
    blurb: 'Sep 14, 2026 - two plugin case studies, three axes of scale',
    deck: 'lecture-03',
    concepts: [
      {
        term: 'Superpowers is a software-development plugin',
        gloss:
          'running six stages - clarify the problem, approve a design, write a detailed plan, test-driven build, review and verify, finish or integrate the branch',
        slides: ['lecture-03#3'],
      },
      {
        term: 'A SKILL.md has front matter',
        gloss:
          'a skill file can define six components: entry conditions, required actions, prohibited actions, human approval gates, verification requirements, next applicable skill',
        slides: ['lecture-03#4'],
      },
      {
        term: 'Skills alone are not enough',
        gloss:
          'a SessionStart hook with matcher "startup|clear|compact" guarantees deterministic timing, runs before the agent acts, and re-runs after clear and compaction',
        slides: ['lecture-03#5'],
      },
      {
        term: 'Caveman is a second case study',
        gloss:
          'it compresses because context fills up, every turn costs, and compaction loses detail',
        slides: ['lecture-03#6', 'lecture-03#7'],
      },
      {
        term: 'The proxy is the only mechanism that can transparently rewrite what the model reads',
        gloss:
          'hooks intercept requests but cannot rewrite the request to the LLM, so a proxy is required unless you write your own harness',
        slides: ['lecture-03#8'],
      },
      {
        term: 'Three axes of scaling',
        gloss:
          'parallel agents (breadth - independent tasks each in an isolated working tree, buying wall-clock throughput not answer quality), subagents (breadth and depth - a bounded task in fresh context returning a summary, buying throughput and focus), and long-running agents (duration - a larger job carried across many steps, buying scope)',
        slides: ['lecture-03#9'],
      },
      {
        term: 'Parallel agents by hand means one task per session in its own git worktree',
        gloss:
          'hand-run parallelism breaks down past a few sessions - you hold the plan, sessions cannot see each other, you reconcile the branches, and it does not repeat because nothing is written down to rerun',
        slides: ['lecture-03#10'],
      },
      {
        term: 'Subagents are a specialized assistant with its own context window',
        gloss:
          'built-ins are Explore, Plan and General-purpose, a subagent is a Markdown file with YAML frontmatter whose body becomes the system prompt, nesting requires `Agent` in the tools list, up to 5 levels are allowed with 2 to 3 the sweet spot',
        slides: ['lecture-03#11', 'lecture-03#12'],
      },
      {
        term: 'Agent teams are several Claude Code sessions working together',
        gloss:
          'teams cost more tokens and are worth it only when the work needs discussion, and they are experimental and off by default',
        slides: ['lecture-03#12', 'lecture-03#13'],
      },
      {
        term: 'Programming 3.0',
        gloss:
          'the best-practice groups are DEFINE (state assumptions up front; have the model confirm anything ambiguous before it executes), CONTROL (separate proposal from execution; manage context explicitly, owning memory, provenance and retrieval and expiring stale information; specify outcomes, not prompts) and VERIFY & GOVERN (tighten the generate-verify loop; measure one level deeper)',
        slides: ['lecture-03#15'],
      },
      {
        term: 'The field evidence contrasts conversational AI',
        gloss: 'a five-rung Delegation Ladder from Chatbot to Systematized workflows',
        slides: ['lecture-03#16'],
      },
    ],
  },

  {
    id: 'lecture-4',
    part: 'Part I',
    title: 'Lecture 4 - Context management and tool design',
    blurb: 'Sep 16, 2026 - the harness from first principles',
    deck: 'lecture-04',
    concepts: [
      {
        term: 'The ReAct loop interleaves Thought',
        gloss:
          'reason-only fails because nothing checks the reasoning and small errors compound into confident hallucination, and act-only fails because tool calls with no plan make the model repeat themselves',
        slides: ['lecture-04#2'],
      },
      {
        term: "a harness designer's three jobs",
        gloss:
          'to assemble the context, to validate the request, check permission and run it, and to optionally process the result and manage context',
        slides: ['lecture-04#3'],
      },
      {
        term: 'Four ways to find code',
        gloss: 'In practice - start with grep; reach for an index or LSP when names run out.',
        slides: ['lecture-04#4'],
      },
      {
        term: 'Four edit strategies',
        gloss:
          'whole-file rewrite (no patch syntax to get wrong, but output scales with file size and untouched code can drift), unified diff/patch (compact and reviewable in the format humans and CI already use, but hunks fail when line numbers or context drift), search and replace (output proportional to the change, but fails on ambiguous, stale or whitespace-off anchors), and structured/AST edits (immune to formatting and cannot produce invalid syntax, but per-language tooling and a limited set of expressible edits)',
        slides: ['lecture-04#5'],
      },
      {
        term: 'Shell execution is the most powerful and most dangerous tool',
        gloss:
          'composition (one call can chain, filter, loop and retry), reach (filesystem, network, package managers, installed binaries), persistence (files and processes outlive the call), blast radius (whatever the shell can do, the agent can do)',
        slides: ['lecture-04#6'],
      },
      {
        term: 'Five more commonly used tools',
        gloss:
          'few orthogonal tools (overlapping tools make the model dither), purpose-built rather than generic (search_orders(customer_id) beats a raw run_sql tool), token-cheap output (truncate, paginate, summarize - tool design is context design), errors that teach (return the fix hint, not just "invalid argument"), and idempotent by default',
        slides: ['lecture-04#7'],
      },
      {
        term: 'Prompt Engineering',
        gloss:
          'Context Engineering (2025-2026, "What should the model see?") -> Harness Engineering (2026, "How should the agent operate?") -> Goal Engineering (Now -> Next, "What counts as success?")',
        slides: ['lecture-04#9', 'lecture-04#10'],
      },
      {
        term: 'Context engineering is',
        gloss:
          'context is a finite resource on three axes: cost (every step re-sends the whole window), latency (bigger prompts take longer to prefill and decode) and attention (recall fades as the window fills; the middle gets missed, so more context is not better answers)',
        slides: ['lecture-04#11', 'lecture-04#12'],
      },
      {
        term: 'Admission (targeted retrieval, tool output shaping, truncation only when shaping cannot, isolation to a subagent)',
        gloss:
          'Offloading (progressive tool definition, tool search, tool output offload returning a handle, externalised task list, persistent memory), Transformation (deduplication, observation masking of tool results older than N steps, sliding window) and Compaction (rolling summary, or full summary at the limit, reserving headroom, preserving the system prefix, re-injecting critical facts, persisting key facts outside the window via auto memory)',
        slides: ['lecture-04#14', 'lecture-04#15'],
      },
      {
        term: 'Five ways context fails',
        gloss:
          'Poisoning (a hallucination enters the window and is later cited as fact), Distraction (history grows until the agent imitates its own past actions), Confusion (irrelevant tools and documents steer the answer off course), Clash (new information contradicts old; both stay unresolved) and Drift (the real goal is buried and swapped for a nearby subgoal)',
        slides: ['lecture-04#16'],
      },
      {
        term: 'Agent = Model x Harness',
        gloss:
          'Model capability sets the ceiling; the harness determines realized performance - and the evidence is that changing only the harness doubles accuracy',
        slides: ['lecture-04#17', 'lecture-04#18'],
      },
    ],
  },

  /* ------------------------------------------------ Part I, weeks 4-6 ---- */
  {
    id: 'lecture-5',
    part: 'Part I',
    title: 'Lecture 5 - Multi-agent architecture, coordination, communication',
    blurb: 'Sep 23, 2026 - three graphs, eight architectures, A2A versus MCP',
    deck: 'lecture-05',
    concepts: [
      {
        term: 'Four stated reasons to split work across agents',
        gloss:
          'specialization (different models, prompts and tools), isolation (different privileges per agent), parallelism (independent subtasks run concurrently), and context management (do not give every agent the whole trajectory)',
        slides: ['lecture-05#2'],
      },
      {
        term: 'Every multi-agent architecture is characterized by three graphs',
        gloss:
          'control graph (who coordinates: one supervisor, a hierarchy, or nobody, possibly changing at runtime via handoff), communication graph (how they communicate: direct messages, broadcast, or a shared workspace), task graph (how work is decomposed: up front by a planner, by bidding, or emergently from local rules)',
        slides: ['lecture-05#3'],
      },
      {
        term: 'Eight architectures are enumerated',
        gloss:
          'supervisor-worker, hierarchical, pipeline/DAG, blackboard, committee, market/auction, swarm, dynamic topology',
        slides: ['lecture-05#4', 'lecture-05#5'],
      },
      {
        term: 'Supervisor-worker',
        gloss:
          'Best when subtasks are independent and parallelizable; weakness is the supervisor bottleneck, because it re-reads every result and its context grows fastest',
        slides: ['lecture-05#5'],
      },
      {
        term: 'Blackboard / shared memory',
        gloss:
          'Agents can join or leave without rewiring, and shared state is durable and inspectable; challenges are consistency, concurrency control, provenance, versioning and garbage collection',
        slides: ['lecture-05#6'],
      },
      {
        term: 'Committee / debate and market / auction',
        gloss:
          'failure mode: agreement without independence - same model and context means the same blind spot',
        slides: ['lecture-05#7'],
      },
      {
        term: 'Task decomposition has axes',
        gloss:
          'a sub-task spec with eight required fields (objective, inputs and relevant context, boundaries and exclusions, available tools and permissions, expected output schema, completion test, budget and deadline, dependencies)',
        slides: ['lecture-05#9'],
      },
      {
        term: 'Granularity is a tradeoff',
        gloss:
          'parallelization only helps when the saved sequential work exceeds planning, communication and integration cost',
        slides: ['lecture-05#10'],
      },
      {
        term: 'Communication is specified on four dimensions',
        gloss:
          'Messages should carry semantics: natural language for content, structured protocol for coordination, so the runtime can route, retry and stop without asking an LLM what the message meant',
        slides: ['lecture-05#11', 'lecture-05#12'],
      },
      {
        term: 'Multi-agent systems inherit distributed-systems problems',
        gloss:
          'black-box LLMs add information loss, context pollution, stale information, conflicting beliefs, lost ownership and communication loops',
        slides: ['lecture-05#13'],
      },
      {
        term: 'A2A (agent-to-agent) is the agent-to-agent protocol',
        gloss:
          'It standardizes communication, not orchestration. MCP is the agent-to-capability boundary',
        slides: ['lecture-05#14', 'lecture-05#15'],
      },
      {
        term: 'Closing design principles',
        gloss:
          '(1) is multi-agent really necessary? (2) decide topology, (3) identify information-loss points, (4) identify failure-containment boundaries',
        slides: ['lecture-05#16'],
      },
    ],
  },

  {
    id: 'lecture-6',
    part: 'Part I',
    title: 'Lecture 6 - Agent memory and reliability',
    blurb: 'Sep 28, 2026 - six policy questions, then the reliability arithmetic',
    deck: 'lecture-06',
    concepts: [
      {
        term: 'Agent memory is defined as persistent state beyond the context window',
        gloss:
          'the context window is temporary working state, the memory store is persistent state across interactions',
        slides: ['lecture-06#2'],
      },
      {
        term: 'Memory design is six policy questions',
        gloss:
          'keeping (WRITE OR SKIP), format (ENCODE / ORGANIZE), need (RETRIEVE), lesson (REFLECT / GENERALIZE), valid (KEEP / UPDATE / DELETE), backend (STORE)',
        slides: ['lecture-06#2'],
      },
      {
        term: 'The write decision trades recall against noise',
        gloss:
          'write every interaction (high recall, noisy) vs selective writing (high precision) via explicit user request, deterministic rules, a small classifier, or periodic LLM review',
        slides: ['lecture-06#3'],
      },
      {
        term: 'Four memory representations',
        gloss:
          'raw events/episodes (high fidelity, large and redundant), unstructured summaries (compact, may lose context), structured state (queryable, schema constrains), knowledge graph (linked entities and change over time)',
        slides: ['lecture-06#4'],
      },
      {
        term: 'Four storage classes',
        gloss:
          'plain files (CLAUDE.md, scratchpad - easy to inspect, diff, search), key-value or relational database (Redis, SQLite, Postgres JSONB - exact lookup, filtering, transactions), vector store (pgvector, Chroma, Pinecone - exact or approximate similarity search), graph database (Neo4j, FalkorDB/Graphiti - relationship queries, multi-hop traversal)',
        slides: ['lecture-06#5'],
      },
      {
        term: 'Three usage policies',
        gloss:
          'automatic (every turn: search -> LLM -> add; predictable but adds latency and irrelevant context), runtime-controlled (if memory_needed: search(); if memorable: add(); selective but needs rules or a classifier), model-controlled (search_memory(), add_memory(), update_memory(), forget_memory(); demand-driven but may miss useful reads or writes)',
        slides: ['lecture-06#6'],
      },
      {
        term: 'Retrieval needs more than semantic relevance',
        gloss:
          'semantic match, scope (same user, project, entity or task), importance (cost of missing or including it), validity (true for this task at this time) and provenance (source, confidence, evidence)',
        slides: ['lecture-06#7'],
      },
      {
        term: 'Forgetting is a first-class operation',
        gloss:
          'lifecycle controls (mark invalid, erase permanently, expire after a TTL, tier and evict from active memory) motivated by stale information, incorrect or conflicting information, privacy and security, and storage and retrieval cost',
        slides: ['lecture-06#8'],
      },
      {
        term: 'Memory needs valid time and provenance',
        gloss:
          'the same fact (project serves models with X) is superseded in April 2026 and current in June 2026, with the episode number as the source',
        slides: ['lecture-06#9'],
      },
      {
        term: 'Two ownership models',
        gloss:
          'agent-owned memory (files in the harness - CLAUDE.md, agent scratchpad, task notes, persisted to disk by the harness) vs a dedicated memory system the agent calls (Mem0, Graphiti, supermemory) where memory is an API shared across agents and sessions',
        slides: ['lecture-06#10'],
      },
      {
        term: 'Memory evaluation is four axes',
        gloss:
          'writes and update (precision, recall, stale-memory rate), retrieval (precision, recall), system (latency, token overhead, store growth), governance (deletion compliance and scope isolation). Named benchmarks: LoCoMo, LongMemEval, BEAM, LoCoMo-Refined',
        slides: ['lecture-06#12'],
      },
      {
        term: 'Reliability framing: errors compound',
        gloss:
          'With 95% success per step assumed independent, a 50-step run finishes error-free only about 1 in 13 times',
        slides: ['lecture-06#13'],
      },
      {
        term: 'Reliability is diagnosed by fault origin across five layers',
        gloss:
          'user/task spec (specification failure), agent harness (harness failure), LLM (model failure), tool layer (tool failure), environment (environment failure)',
        slides: ['lecture-06#14'],
      },
    ],
  },

  {
    id: 'lecture-7',
    part: 'Part I',
    title: 'Lecture 7 - Agent evaluation',
    blurb: 'Sep 30, 2026 - what a benchmark actually grades',
    deck: 'lecture-07',
    concepts: [
      {
        term: 'Evaluation splits into component-level',
        gloss:
          'planning, task decomposition, tool use - discovery, selection, parameterization - memory, error recovery',
        slides: ['lecture-07#2'],
      },
      {
        term: 'The deck situates benchmarks in six eras',
        gloss: '2025-2026 (larger scope, less specific instructions, more realistic use cases)',
        slides: ['lecture-07#3'],
      },
      {
        term: 'Five evaluation objectives',
        gloss:
          'predict text (PTB, WikiText), produce a correct answer (MMLU, GSM8K, GPQA, HLE), produce a preferred response (Arena, AlpacaEval, MT-Bench), produce functioning code (HumanEval, LiveCodeBench, SWE-bench), complete an interactive task (WebArena, OSWorld, tau-bench, Terminal-Bench)',
        slides: ['lecture-07#4'],
      },
      {
        term: 'Metric families',
        gloss:
          'cost (mostly LLM cost, with tool calls and other overheads such as LLM cache miss "overlooked"); latency/duration (not just LLM)',
        slides: ['lecture-07#5'],
      },
      {
        term: 'A generic benchmark loop',
        gloss:
          'reset the environment to the task\'s initial state, then loop observe -> act -> execute while not terminated and within budget, then score the agent\'s final answer, the final environment state and the trajectory',
        slides: ['lecture-07#6'],
      },
      {
        term: 'GAIA tests research-and-answer agents end to end',
        gloss:
          '466 human-written questions over web browsing, spreadsheets, PDFs, images, audio and calculation; no fixed tool API (each agent brings its own search, browser, Python, shell), so it tests the whole agent system rather than the LLM',
        slides: ['lecture-07#7'],
      },
      {
        term: 'BFCL (Berkeley Function Calling Leaderboard) tests the tool interface',
        gloss:
          'Whether the model picks the right calls, avoids irrelevant ones, and asks for a missing parameter instead of inventing one',
        slides: ['lecture-07#8'],
      },
      {
        term: 'WebArena scores web workflows',
        gloss:
          'WebArena-Verified replaces LLM-as-a-judge with deterministic checks on HTTP traces',
        slides: ['lecture-07#9'],
      },
      {
        term: 'OSWorld extends the observation/action model to pixels and mouse/keyboard',
        gloss: 'OSWorld 2.0 adds 108 long workflows with partial-credit checkpoints',
        slides: ['lecture-07#10'],
      },
      {
        term: 'SWE-bench scores a patch by applying it to the repo and running the tests',
        gloss:
          'has shipped Verified, Lite, Multilingual, Multimodal and Pro variants',
        slides: ['lecture-07#11'],
      },
      {
        term: 'tau-bench adds a simulated user and a policy',
        gloss:
          'Reward is the product of an action term (final DB matches the annotated goal state) and an output term (the user-facing response includes required information)',
        slides: ['lecture-07#12'],
      },
      {
        term: 'Terminal-Bench packages a task as instruction.md + Dockerfile + tests/test.sh inside a container',
        gloss:
          'it covers domains beyond repo bug fixes (sysadmin, data processing, model training, security, scientific workflows) and is positioned between SWE-bench and OSWorld - no GUI grounding',
        slides: ['lecture-07#13'],
      },
      {
        term: 'TheAgentCompany simulates a company',
        gloss:
          'scores partial progress across a job with checkpoints, not just the final state',
        slides: ['lecture-07#14'],
      },
      {
        term: 'Leakage has four layers, not just training',
        gloss:
          'training leakage, eval-time leakage, environment leakage and benchmark overfitting',
        slides: ['lecture-07#15'],
      },
      {
        term: 'Leakage runs through the whole stack',
        gloss:
          'modern agent performance is roughly P = f(LLM, prompt, scaffold, tools, retriever, memory, environment)',
        slides: ['lecture-07#16'],
      },
      {
        term: 'Challenge - single user turn',
        gloss:
          'most benchmarks give one fully-specified instruction, with no user in the loop, while real work is ambiguous, revised and interrupted',
        slides: ['lecture-07#17'],
      },
      {
        term: 'success rate alone is insufficient',
        gloss: 'a 200-step, $40 run vs a 12-step, $0.30 run',
        slides: ['lecture-07#17'],
      },
      {
        term: 'benchmarks saturate quickly',
        gloss:
          'the frontier caught up remarkably fast on GLUE, MMLU, GPQA Diamond, SWE-bench Verified, ARC-AGI-2 and ARC-AGI-3',
        slides: ['lecture-07#18', 'lecture-07#19'],
      },
      {
        term: 'A real-world agent has more than three dimensions',
        gloss:
          'capability, cost, speed and agent usability; Assignment 3 is graded on all three of capability, cost and speed, using Pareto dominance',
        slides: ['lecture-07#20'],
      },
    ],
  },

  {
    id: 'lecture-8',
    part: 'Part I',
    title: 'Lecture 8 - Cost and performance',
    blurb: 'Oct 7, 2026 - every lever is a term in one equation',
    deck: 'lecture-08',
    concepts: [
      {
        term: 'Cost decomposition',
        gloss:
          'Cost = Users x Sessions / User x Turns / Session x Steps / Turn x Tokens / Step x Price / Token.',
        slides: ['lecture-08#2'],
      },
      {
        term: 'Turn reduction rests on a quadratic fact',
        gloss:
          'turn k re-reads turns 1..k-1, so total cost grows with the square of turn count',
        slides: ['lecture-08#5'],
      },
      {
        term: 'Step reduction',
        gloss:
          'one call per action (4 model calls) becomes plan-then-batch (2 model calls, 3 tools in parallel)',
        slides: ['lecture-08#6'],
      },
      {
        term: 'Token reduction',
        gloss:
          'drop stale results, compact history into state, compress observations keeping errors not full logs, offload big outputs to files, retrieve selectively, isolate exploration in a sub-agent that returns a summary',
        slides: ['lecture-08#7'],
      },
      {
        term: 'The token economics are cache-dominated',
        gloss:
          'output is 5x smaller than fresh prefill, fresh prefill is 100x smaller than cache reads, the typical price ratio is cache read : input : output = 1 : 10 : 50, and 97.6% of tokens in the measured usage were cache reads',
        slides: ['lecture-08#8'],
      },
      {
        term: 'Price reduction has three shapes',
        gloss: 'caching and batching (maintain stable prefixes, batch what can wait',
        slides: ['lecture-08#9'],
      },
      {
        term: 'Every saving has a counter-cost',
        gloss:
          'Net saving = gross saving - counter-cost, and both must be measured on the same tasks',
        slides: ['lecture-08#10'],
      },
      {
        term: 'Budgeting',
        gloss:
          'cap each task (dollars, model calls, tool time, retries per step) and set limits from traced runs, e.g. 2x the p95 of successful tasks',
        slides: ['lecture-08#11'],
      },
      {
        term: 'Before using an LLM at all, check whether the step needs reasoning',
        gloss:
          'same steps every time -> write a script; fixed input format -> parse with rules; narrow label or score -> train a small classifier',
        slides: ['lecture-08#12'],
      },
      {
        term: 'Speed',
        gloss:
          'completion time is the critical path, not the sum of every step (serial ~= sum, parallel ~= critical path). Cheaper can be slower',
        slides: ['lecture-08#13'],
      },
      {
        term: 'Speed levers',
        gloss:
          'speed up LLM serving (every cost technique also cuts latency), improve orchestration (async execution, persistent sessions, stream and pipeline, colocate services), speed up tool calls',
        slides: ['lecture-08#13'],
      },
      {
        term: 'Speculative actions',
        gloss:
          'predict the next action with a cheap model, run it early while the main model thinks, then compare; a match skips the wait, a miss costs one wasted call',
        slides: ['lecture-08#14'],
      },
      {
        term: 'The optimization loop',
        gloss:
          'run and profile, measure, change one thing, re-evaluate on the same tasks (success, spend, p95 latency)',
        slides: ['lecture-08#15'],
      },
      {
        term: 'Three harness architectures',
        gloss:
          'monolithic (everything in one runtime), modular (one controller reaches memory/tools/context/sandbox through interfaces), and agent microkernel',
        slides: ['lecture-08#16'],
      },
      {
        term: 'Eight real harnesses are compared',
        gloss: 'Claude Code (policy layer and typed hooks), Codex CLI (sandbox before approval',
        slides: ['lecture-08#17'],
      },
    ],
  },

  /* ------------------------------------------------ Assignment 3 -------- */
  {
    id: 'assignment-3',
    part: 'Part I',
    title: 'Assignment 3 - MadsOpt, the harness competition',
    blurb: 'The Oct 7 briefing, and the contract it fixes',
    deck: 'assignments-and-project',
    concepts: [
      {
        term: 'The assignment is a harness competition, not a prompt-writing exercise',
        gloss:
          'students ship an agent runtime that solves tasks, and are scored on capability, cost and time simultaneously',
        slides: ['assignments-and-project#6'],
      },
      {
        term: 'The task environment has 26 tasks in 3 types of containers',
        gloss:
          'with the agent and the task in separate containers accessed over HTTP requests',
        slides: ['assignments-and-project#6'],
      },
      {
        term: 'Evaluation is offline and sandboxed',
        gloss: 'the agent can only reach api.cs2680.com',
        slides: ['assignments-and-project#6'],
      },
      {
        term: 'The runtime contract is a dispatcher/agent/evaluator loop',
        gloss: 'At most 5 tasks run in parallel',
        slides: ['assignments-and-project#6'],
      },
      {
        term: 'Three model tiers are available',
        gloss: 'Expert, Standard and Starter',
        slides: ['assignments-and-project#7'],
      },
      {
        term: 'Time and cost limits',
        gloss: '35 min per evaluate() call and 4 h total; $30 per day and $10 per run',
        slides: ['assignments-and-project#7'],
      },
      {
        term: 'A submission is measured by',
        gloss:
          'the number of tasks solved, the cost per solved task and the time per solved task; grading uses a skyline over the three metrics, a baseline of solving 16 tasks',
        slides: ['assignments-and-project#7'],
      },
    ],
  },

  /* ------------------------------------------------ Reference notes ------ */
  {
    id: 'note-agent-evaluation',
    part: 'Reference notes',
    title: 'Reference note - Agent evaluation and benchmarks',
    blurb: 'A method guide in one half, a directory of 48 benchmarks in eight themes in the other',
    deck: 'agent-evaluation',
    concepts: [
      {
        term: 'Cost per successful task',
        gloss:
          'Total runtime cost incl. failed attempts divided by successful task trials',
        slides: ['agent-evaluation#3'],
      },
      {
        term: 'pass@k vs. pass^k',
        gloss:
          'Probability at least one of k attempts succeeds vs. probability all k repeated trials succeed',
        slides: ['agent-evaluation#4', 'agent-evaluation#5'],
      },
      {
        term: 'Tool-call correctness and efficiency',
        gloss:
          'Function selection, argument grounding, call structure, turn count, milestones',
        slides: ['agent-evaluation#4'],
      },
      {
        term: 'Grader (judge) quality',
        gloss: 'Whether the automatic judge is right',
        slides: ['agent-evaluation#14'],
      },
      {
        term: 'METR time horizons',
        gloss:
          'Time Horizon 1.1 current suite as of Sep 27, 2026; released Jan 29, 2026; expanded 170 -> 228 tasks',
        slides: ['agent-evaluation#14'],
      },
      {
        term: 'Contamination and prompt sensitivity',
        gloss:
          'Whether a task/solution was visible to training or the run, and how much of a score belongs to the harness',
        slides: ['agent-evaluation#14'],
      },
      {
        term: 'Uncertainty',
        gloss: 'Variability across trials vs. task coverage',
        slides: ['agent-evaluation#3'],
      },
      {
        term: 'Calibration',
        gloss: 'Whether stated confidence tracks actual correctness',
        slides: ['agent-evaluation#3'],
      },
      {
        term: 'Outcome vs. procedural compliance',
        gloss:
          'Final state versus required process (e.g. confirmation before a write)',
        slides: ['agent-evaluation#3'],
      },
    ],
  },

  {
    id: 'note-cost-effective',
    part: 'Reference notes',
    title: 'Reference note - Cost-effective agents',
    blurb: '13 techniques, each with the cost it removes and the new costs it introduces',
    deck: 'cost-effective-agents',
    concepts: [
      {
        term: 'Measure the whole episode',
        gloss: 'Making cost attributable',
        slides: ['cost-effective-agents#2'],
      },
      {
        term: 'Route model calls by expected value',
        gloss: 'Model price',
        slides: ['cost-effective-agents#3'],
      },
      {
        term: 'Remove model turns from routine control',
        gloss: 'Model calls per task',
        slides: ['cost-effective-agents#4'],
      },
      {
        term: 'Selective context (compression)',
        gloss: 'Repeated prompt tokens',
        slides: ['cost-effective-agents#4'],
      },
      {
        term: 'Pay only for useful collaboration',
        gloss: 'Multi-agent overhead',
        slides: ['cost-effective-agents#5'],
      },
      {
        term: 'Reduce waiting with a separate money budget',
        gloss: 'Latency',
        slides: ['cost-effective-agents#6'],
      },
      {
        term: 'Prevent expensive rework',
        gloss: 'Failure cost',
        slides: ['cost-effective-agents#6'],
      },
      {
        term: 'Approximate break-even tasks',
        gloss:
          'setup and refresh cost / net savings per deployed task',
        slides: ['cost-effective-agents#7'],
      },
    ],
  },

  {
    id: 'note-transformers',
    part: 'Reference notes',
    title: 'Reference note - Transformers and LLM foundations',
    blurb: 'Optional background: a systems reading list, not a model list',
    deck: 'transformers-llm-foundations',
    concepts: [
      {
        term: 'Tokenization',
        gloss:
          'BPE merges frequent adjacent pairs; SentencePiece keeps whitespace in the vocabulary',
        slides: ['transformers-llm-foundations#2', 'transformers-llm-foundations#3'],
      },
      {
        term: 'Fertility',
        gloss:
          'Fertility (tokens per word) is the conversion factor between text and served sequence length',
        slides: ['transformers-llm-foundations#3'],
      },
      {
        term: 'Architecture',
        gloss:
          'RoPE encodes relative position by rotation and is embedded in KV entries; ALiBi extrapolates with a linear penalty and no position embedding',
        slides: ['transformers-llm-foundations#2', 'transformers-llm-foundations#4'],
      },
      {
        term: 'Sparse and alternative architectures',
        gloss:
          'GShard (MoE plus automatic sharding), Switch Transformer (top-1 routing, load-balancing loss, capacity factor)',
        slides: ['transformers-llm-foundations#5'],
      },
      {
        term: 'The scaling-law argument',
        gloss:
          'Kaplan-style power laws, Chinchilla\'s correction and its replication, over-training, data limits, precision as a scaling variable, test-time compute',
        slides: ['transformers-llm-foundations#6'],
      },
      {
        term: 'The level is systems-oriented rather than mathematical',
        gloss:
          'the stated reading rule is "read it for shapes, not for BLEU scores", and the recurring hinge is what one forward pass costs and what a serving stack must keep around',
        slides: ['transformers-llm-foundations#1'],
      },
    ],
  },

  /* ------------------------------------------------ Course mechanics ----- */
  {
    id: 'mechanics',
    part: 'Course mechanics',
    title: 'Assignments, project, policy - and what is not published',
    blurb: 'The rules, the weights, and the two places the course stops short',
    deck: 'assignments-and-project',
    concepts: [
      {
        term: 'One private GitHub repository serves the whole course',
        gloss:
          "each assignment's code, writeup files, benchmark outputs, and session archives live under `assignmentN/`",
        slides: ['assignments-and-project#3'],
      },
      {
        term: 'Every assignment submits three artifacts',
        gloss:
          'code, writeup, and an archive of Claude Code session files. The session files carry no separate weight but are the record behind the writeup\'s process claims',
        slides: ['assignments-and-project#3'],
      },
      {
        term: 'AI use is encouraged, must be disclosed on every submitted artifact, and never replaces authorship',
        gloss:
          'writeups must be your own prose, and you must be able to explain your own work unaided',
        slides: ['assignments-and-project#3', 'assignments-and-project#12'],
      },
      {
        term: 'Four late days for the semester, counted in whole days, spendable across assignments',
        gloss:
          'a submission one minute late consumes a full day; once exhausted, late work loses 20% of its value per day to a floor of zero after five days',
        slides: ['assignments-and-project#12', 'course-overview#12'],
      },
      {
        term: 'Weights',
        gloss:
          'Assignments 1, 2, 5 at 10% each; Assignments 3 and 4 at 20% each - 70% for the assignments. The final project is 20%, class participation 10%, bonus up to 10%. There is no exam, midterm, or final. At most 20% of the class receives an A.',
        slides: ['assignments-and-project#12', 'course-overview#8'],
      },
      {
        term: 'Two tracks',
        gloss:
          'product (build a useful tool) and research (make an original claim) - share the same deadlines, deliverables, and rubric, but the research track is held to a higher standard of novelty and evidence',
        slides: ['assignments-and-project#10', 'course-overview#10'],
      },
      {
        term: 'Assignments 4 and 5 are not published',
        gloss:
          '`course/site/assignments/index.html` links both to `../to_release.html`, whose table marks Assignments 1-3 as "posted" and leaves 4 and 5 without a spec link',
        slides: ['assignments-and-project#9', 'part-ii-status#3'],
      },
      {
        term: 'No PDF exists for any Part II lecture',
        gloss:
          'No PDF exists for any Part II lecture, any student-led session, any guest lecture, or any no-class row.',
        slides: ['part-ii-status#3'],
      },
    ],
  },
];
