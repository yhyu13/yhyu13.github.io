# Part II Digest - CS2680 (slides 5-8 + Assignment 3)

This part of CS2680 moves from "what an agent is made of" to "what it costs to run one and how to know it works". Lecture 5 (multi-agent systems) opens the part: how to split work across agents, which architectures exist, and how they communicate. Lecture 6 adds the two long-horizon concerns - persistent agent memory and reliability, framed as failure attribution across five layers. Lecture 7 turns to evaluation: what to measure, which benchmarks exist, why single-turn scoring and benchmark saturation make the frontier move fast. Lecture 8 closes the loop on cost and performance: a cost decomposition, one slide per lever, budget caps, speculative actions, and a comparison of harness architectures (monolithic, modular, microkernel) with eight real harnesses. The Assignment 3 deck ("MadsOpt: Harness Competition") is the applied capstone: build a harness that is scored on capability, cost and time at once. The through-line is that every structural choice made in Part I (topology, memory, communication) has a measurable cost and a measurable failure mode, so the two halves of the course are read as one argument.

## Agents design II: multi-agent architecture, coordination, and communication (slides: 46 pages)
- **Source PDF**: `course/site/slides/5_agent_design_2.pdf`

### Concepts
- Four stated reasons to split work across agents: specialization (different models, prompts and tools), isolation (different privileges per agent), parallelism (independent subtasks run concurrently), and context management (do not give every agent the whole trajectory). (p6)
- Every multi-agent architecture is characterized by three graphs: control graph (who coordinates: one supervisor, a hierarchy, or nobody, possibly changing at runtime via handoff), communication graph (how they communicate: direct messages, broadcast, or a shared workspace), task graph (how work is decomposed: up front by a planner, by bidding, or emergently from local rules). (p7)
- Eight architectures are enumerated: supervisor-worker, hierarchical, pipeline/DAG, blackboard, committee, market/auction, swarm, dynamic topology; a summary table classifies them as Centralized, Decentralized or Hybrid. (p8, p18)
- Supervisor-worker: one agent plans, delegates and integrates; workers see only their subtask. Best when subtasks are independent and parallelizable; weakness is the supervisor bottleneck, because it re-reads every result and its context grows fastest. (p9)
- Hierarchical: supervisor-worker applied recursively, with supervisors managing sub-supervisors. Fits tasks that already decompose hierarchically (storage, query engine, testing); the open question is where decomposition happens and how much context crosses each boundary. (p10)
- Pipeline/DAG: fixed stages with a typed contract at each boundary. Cheapest topology to debug because errors localize to a stage; weakness is no path backwards, so stage four cannot ask stage one for a better source. Deck maxim: "one retry edge beats one more agent". (p11)
- Blackboard / shared memory: agents coordinate through shared state instead of direct messages; the workspace may be a database, vector store, filesystem, Git repo or task graph. Agents can join or leave without rewiring, and shared state is durable and inspectable; challenges are consistency, concurrency control, provenance, versioning and garbage collection. (p12)
- Committee / debate and market / auction: agents propose and discuss, then a judge or vote resolves (failure mode: agreement without independence - same model and context means the same blind spot); or agents bid for announced tasks on capability, cost and latency, so work lands on the cheapest capable agent with no central planner (failure mode: bids are self-reported, so an agent can win by overstating what it can do). (p13, p14)
- Swarm and dynamic topology: swarm has no permanent coordinator and needs protocols for discovery, addressing, synchronization, termination and trust - communication complexity is O(n^2) and it is rarely used in products; dynamic topology adds, removes or rewires agents while the task runs (a support bot adding billing and log agents only on escalation), so capacity scales with difficulty but failures are hard to reproduce. Real systems are hybrids - the deck's "Planner agent + Coder/Researcher/Tester/Reviewer + Shared Git + dynamic task DAG" combines hierarchy, shared memory, pipeline and re-planning. (p15, p16, p17)
- Task decomposition has axes (data, expertise, stage, hypothesis, tool, authority) and a sub-task spec with eight required fields (objective, inputs and relevant context, boundaries and exclusions, available tools and permissions, expected output schema, completion test, budget and deadline, dependencies). Decomposition can be static, dynamic, recursive or opportunistic, and needs spawning limits, budgets, depth limits and termination conditions or delegation explodes. (p20, p21, p23)
- Granularity is a tradeoff governed by T_multi ~= T_planning + T_critical_path + T_communication + T_merge; parallelization only helps when the saved sequential work exceeds planning, communication and integration cost. Named decomposition failures: overlap, gap, hidden dependency, unmergeable outputs, straggler, lost global context. (p22, p24, p25)
- Communication is specified on four dimensions (topology, medium, format and semantics, channel), with three media (message passing, shared memory, files and artifacts including DB) and six channels (p2p, broadcast, pub-sub, shared blackboard, request-response, artifact passing). Messages should carry semantics: natural language for content, structured protocol for coordination, so the runtime can route, retry and stop without asking an LLM what the message meant. (p27-p32)
- Multi-agent systems inherit distributed-systems problems (partial failure, concurrency and non-determinism, consistency, no global clock, unreliable network, debugging and observability) plus scheduling, state management and resource allocation; black-box LLMs add information loss, context pollution, stale information, conflicting beliefs, lost ownership and communication loops. (p34-p36)
- A2A (agent-to-agent) is the agent-to-agent protocol: a machine-readable agent card at a well-known path, three abstractions (Message, Task, Artifact), a stateful task lifecycle, and three tracking modes (polling, streaming, push notification). It standardizes communication, not orchestration. MCP is the agent-to-capability boundary: tools, resources and prompts, with the host (not the model) deciding what is exposed. (p37-p44)
- Closing design principles: (1) is multi-agent really necessary? (2) decide topology, (3) identify information-loss points, (4) identify failure-containment boundaries - "a dense mesh is rarely the best default. More communication can increase context pressure without increasing useful information." (p44)

### Numbers and named entities
| Item | Value / detail | Slide page |
|---|---|---|
| Deck title | "Agent Design II: Multi-Agent Systems" | p1 |
| Course site | Harvard MaDSys, course.agentic-system.org | p2 |
| Logistics | Assignment 2 due in ~two weeks; office hour next Thursday 3:30-5pm, SEC 4.308; Pre-proposal | p2 |
| Split-work reasons | 4 (specialization, isolation, parallelism, context management) | p6 |
| Architecture graphs | 3 (control, communication, task) | p7 |
| Architecture count | 8 architectures | p8 |
| Architecture categories | Centralized, Decentralized, Hybrid | p18 |
| Bid example | A100 node: $0.20, ETA 3s; T4 node: $0.05, ETA 10s; H100 node: $0.40, ETA 1s; "cheapest bid under 5s wins" - job goes to the A100 node | p14 |
| Swarm complexity | O(n^2) all-to-all communication; rarely used in products | p15 |
| Decomposition axes | 6: Data, Expertise, Stage, Hypothesis, Tool, Authority | p20 |
| Decomposition example | a 200-file PR split by data (files), then by expertise (security, perf) | p20 |
| Sub-task spec fields | 8 (objective, inputs and relevant context, boundaries and exclusions, available tools and permissions, expected output schema, completion test, budget and deadline, dependencies) | p21 |
| Poor vs better sub-task | "Research storage systems" vs "identify storage-related papers published in 2026; return title, date, system contribution, evaluation scale and primary-source URL; exclude database query optimization" | p21 |
| Time model and batching | T_multi ~= T_planning + T_critical_path + T_communication + T_merge; 20 one-line lookups batched into 4 subtasks | p22 |
| Decomposition modes | Static, Dynamic, Recursive, Opportunistic | p23 |
| Decomposition failures | 01 Overlap, 02 Gap, 03 Hidden dependency, 04 Unmergeable outputs, 05 Lost global context, 06 Straggler | p24, p25 |
| Gap example | "2020-2023" plus "2025-2026" skips 2024 | p24 |
| Straggler example | six agents finish in 20s, one takes 4 minutes (labels 20s, 25s, 4 min) | p25 |
| Communication dimensions | 4 (topology, medium, format and semantics, channel) | p27 |
| Communication media | 3 (message passing, shared memory, files and artifacts incl. DB) | p28 |
| Communication channels | 6 (p2p, broadcast, pub-sub, shared blackboard, request-response, artifact passing) | p29 |
| Message formats | natural language (flexible but ambiguous) vs structured (easy to validate, less expressive) | p30 |
| Message example | task_id "T17", type "result", status "complete", confidence 0.82, evidence ["log:2391", "commit:X"], artifact "analysis/T17.json" | p30 |
| Control message and runtime ops | id "msg-381", task_id "t-17", from "planner", to "researcher", type "DELEGATE"; 9 runtime ops: DELEGATE, QUERY, REPORT, HANDOFF, UPDATE, CANCEL, ACK, ERROR, COMPLETE | p31 |
| Failure scenario and semantics | "purchase 8 GPU instances"; network timeout, no reply; at-most-once, at-least-once, "is exactly-once even available here?"; idempotency key on the task_id | p33 |
| A2A example task and peers | "Analyze whether company X should move its inference stack to GPUs Y."; peers: Research Agent, Finance Agent, Search Agent, Coding Agent | p37 |
| A2A agent card | "Travel Agent", skill id "book-flight", capabilities streaming: true; served at GET /.well-known/agent-card.json | p38 |
| A2A abstractions and task | 3 (Message, Task, Artifact); task-42: working -> completed; follow-up "Which date?" -> "Oct 3" | p39 |
| A2A lifecycle states | 8 (Submitted, Working, Input required, Auth required, Completed, Failed, Rejected, Canceled); "Book a flight" -> Input required -> Working again | p40 |
| A2A tracking | 3 modes: polling (short jobs), streaming (interactive), push notification (hours-long jobs) | p41 |
| MCP concepts | tools, resources, prompts; one client speaks to many servers; the host, not the model, decides what is exposed | p42 |
| MCP vs A2A | one A2A remote agent may itself call twenty MCP servers; axes: primary abstraction, relationship, discovery, unit of work, internal state, analogy (device/API vs service-to-service RPC) | p43 |
| Design principles | 4 principles | p44 |

### Teaching points
- The lecturer is not selling multi-agent: the deck opens by saying multi-agent "has decades of research history which we will not get into", and closes with "is multi-agent really necessary?" - multi-agent is presented as a cost, not a default. (p5, p44)
- The conceptual spine is the three-graphs idea (control / communication / task). Every architecture slide ends with the same three-field tag line (Task, Control, Comms), so students are taught to read any multi-agent diagram with that vocabulary. (p7, p9-p16)
- "This is the thing students get wrong" appears repeatedly: committee debate fails through agreement without independence, markets fail because bids are self-reported, and dynamic topology makes failures irreproducible - so each architecture ships with a named weakness. (p13, p14, p16)
- Communication is taught as a distributed-systems problem, not an NLP problem: the "purchase 8 GPU instances" timeout asks about exactly-once semantics and compensation, and the deck insists structured control fields let the runtime act without asking an LLM what a message meant. (p31, p33)
- A2A vs MCP is drawn as a scope boundary (agent-to-agent vs agent-to-tool), with the memorable claim that A2A standardizes communication but not orchestration - delegation, splitting and stopping stay with the harness. (p41, p43)

### Visual opportunities
- Architecture gallery: eight small schematics (star, tree, DAG, shared blackboard, judge-and-peers, auction, mesh, dynamic) with the same three labels (Task / Control / Comms) under each.
- Topology-vs-cost 2x2: x = communication cost (O(n^2) mesh at the right), y = debuggability / failure containment, with the eight architectures placed as points.
- Annotated "information-loss" diagram: a supervisor aggregating four workers' results, marking where detail drops and where a retry edge would be cheaper than another agent.

### Takeaways
- Any multi-agent design is fully described by its control, communication and task graphs - pick the topology deliberately.
- Every architecture has a named weakness; committee, market and dynamic topology fail in characteristic ways.
- Give messages semantics (natural language for content, structured fields for control) and treat agent communication as distributed systems.

### Cross-deck thread
- L5 supplies the vocabulary L6 reuses for memory: the workspace in the blackboard architecture (p12) is the same shared state that the memory deck formalizes as a memory store (L6 p5, p12).
- The A2A/MCP boundary (p42-p43) is the direct ancestor of the L8 harness comparison: MCP is one of the modular harness's providers (RedisMemory, MCPTools, DockerSandbox), and the microkernel is the "A2A with services" shape. (L8 p42-p43)
- The Part I -> Part II transition is set up by the last slide: next class is "Agent design III, Agent memory, Agent reliability, Agent evaluation" - this lecture hands off to the cost-and-serving half of the course. (p45)

## Agents design III: agent memory and reliability (slides: 31 pages)
- **Source PDF**: `course/site/slides/6_agent_design_3.pdf`

### Concepts
- Agent memory is defined as persistent state beyond the context window: the context window is temporary working state, the memory store is persistent state across interactions. (p5)
- Memory design is six policy questions, each with a named decision: keeping (WRITE OR SKIP), format (ENCODE / ORGANIZE), need (RETRIEVE), lesson (REFLECT / GENERALIZE), valid (KEEP / UPDATE / DELETE), backend (STORE). (p6-p7)
- The write decision trades recall against noise: write every interaction (high recall, noisy) vs selective writing (high precision) via explicit user request, deterministic rules, a small classifier, or periodic LLM review. (p7)
- Four memory representations: raw events/episodes (high fidelity, large and redundant), unstructured summaries (compact, may lose context), structured state (queryable, schema constrains), knowledge graph (linked entities and change over time). (p8)
- Four storage classes: plain files (CLAUDE.md, scratchpad - easy to inspect, diff, search), key-value or relational database (Redis, SQLite, Postgres JSONB - exact lookup, filtering, transactions), vector store (pgvector, Chroma, Pinecone - exact or approximate similarity search), graph database (Neo4j, FalkorDB/Graphiti - relationship queries, multi-hop traversal). (p9)
- Three usage policies: automatic (every turn: search -> LLM -> add; predictable but adds latency and irrelevant context), runtime-controlled (if memory_needed: search(); if memorable: add(); selective but needs rules or a classifier), model-controlled (search_memory(), add_memory(), update_memory(), forget_memory(); demand-driven but may miss useful reads or writes). Many systems use a hybrid, and read and write policy may differ. (p10)
- Retrieval needs more than semantic relevance: semantic match, scope (same user, project, entity or task), importance (cost of missing or including it), validity (true for this task at this time) and provenance (source, confidence, evidence). (p11)
- Generalization consolidates episodes into a higher-level fact with a confidence level (e.g. repeated questions about vLLM, SGLang, TRT-LLM and LLM scheduling -> hypothesis "frequent interest in LLM inference systems", confidence medium). Consolidation should happen after enough new evidence (every N events or context fill), when facts conflict or repeat, or in a background job. (p12)
- Forgetting is a first-class operation: lifecycle controls (mark invalid, erase permanently, expire after a TTL, tier and evict from active memory) motivated by stale information, incorrect or conflicting information, privacy and security, and storage and retrieval cost. (p13)
- Memory needs valid time and provenance: the same fact (project serves models with X) is superseded in April 2026 and current in June 2026, with the episode number as the source. (p14)
- Two ownership models: agent-owned memory (files in the harness - CLAUDE.md, agent scratchpad, task notes, persisted to disk by the harness) vs a dedicated memory system the agent calls (Mem0, Graphiti, supermemory) where memory is an API shared across agents and sessions. (p16)
- Three named dedicated memory systems with different granularity: Mem0 (fact-centric, messages scoped by user/agent/run, vector search with filters plus optional graph memory), Graphiti (temporal knowledge graph over episodes, hybrid semantic/keyword/graph search, facts valid from a date), supermemory (maintains a user profile alongside memory and document, with conversations linked to source and time). (p16)
- Memory evaluation is four axes: writes and update (precision, recall, stale-memory rate), retrieval (precision, recall), system (latency, token overhead, store growth), governance (deletion compliance and scope isolation). Named benchmarks: LoCoMo, LongMemEval, BEAM, LoCoMo-Refined. (p19, p20)
- Reliability framing: errors compound. With 95% success per step assumed independent, a 50-step run finishes error-free only about 1 in 13 times; the deck notes that error propagation makes real runs worse than this model. (p22)
- Reliability is diagnosed by fault origin across five layers - user/task spec (specification failure), agent harness (harness failure), LLM (model failure), tool layer (tool failure), environment (environment failure) - and each layer has a table of concrete failure modes paired with a fix. (p24-p30)
- The deck's closing position is candid: "We do not yet understand agents at scale, and there is little formal best practice." Designing for failure means bounding runs (step, cost, time caps), demanding evidence, failing loudly and pinning the environment. (p30)

### Numbers and named entities
| Item | Value / detail | Slide page |
|---|---|---|
| Deck title | "Agent design III: memory, and reliabiltiy" (spelling as in source) | p1 |
| Logistics | office hour this Thursday 3:30pm, SEC 4.308; poster presentation 9am-1pm Dec 7; reference notes https://cs2680.com/notes/agent-evaluation (curated by the instructor, reviewed by instructor and TFs) | p2 |
| Memory design questions | 6: keeping, format, backend, need, lesson, valid | p6, p7 |
| Write-policy options | explicit user request, deterministic rules (heuristics), small classifier, periodic LLM review; high recall vs high precision | p7 |
| Memory formats | 4: raw events/episodes, unstructured summaries, structured state, knowledge graph; examples "We moved serving from vLLM to SGLang.", "Uses SGLang for model serving.", {"serving_engine":"SGLang"}, Project -> USES -> SGLang | p8 |
| Storage backends | plain files (CLAUDE.md, scratchpad); KV/relational (Redis, SQLite, Postgres JSONB); vector store (pgvector, Chroma, Pinecone); graph DB (Neo4j, FalkorDB (Graphiti)) | p9 |
| Use policies | 3: automatic (search -> LLM -> add); runtime-controlled (if memory_needed: search(); if memorable: add()); model-controlled (search_memory(), add_memory(), update_memory(), forget_memory()) | p10 |
| Retrieval signals | 5: semantic match, scope, importance, validity, provenance | p11 |
| Generalization and consolidation | vLLM, SGLang, TRT-LLM, LLM scheduling -> hypothesis "frequent interest in LLM inference systems", confidence medium; consolidate every N events or context fill, on conflict/repeat, or in a background job | p12 |
| Forgetting | controls: mark invalid, erase permanently, expire after a TTL, tiers and evict; reasons: stale information, incorrect or conflicting information, privacy and security, storage and retrieval cost | p13 |
| Valid time and provenance | April 2026 (vLLM, superseded) -> June 2026 (SGLang, current); source: Episode 28; Project -> SERVES_WITH -> SGLang | p14 |
| Memory owners | agent-owned (CLAUDE.md, agent scratchpad, task notes) vs dedicated memory system (Mem0, Graphiti, supermemory) | p15 |
| Dedicated memory systems | Mem0 (fact-centric; vector search with filters, optional graph memory); Graphiti (temporal knowledge graph; hybrid semantic, keyword and graph search); supermemory (profile, memory and document; conversations linked to source and time) | p16 |
| Memory checklist | 7 stages: Observe, Select, Encode/organize, Store, Retrieve, Reflect/consolidate, Forget | p17 |
| Memory failure modes | 8: retrieval miss, context pollution, memory hallucination, staleness, isolation failure, overgeneralization, persistent prompt injection, unbounded growth | p18 |
| Memory evaluation axes | writes and update (precision, recall, stale-memory rate); retrieval (precision, recall); system (latency, token overhead, store growth); governance (deletion compliance, scope isolation) | p19 |
| Memory benchmarks | LoCoMo (ACL 2024) 1,540 questions, 10 long dialogues; LongMemEval (ICLR 2025) 500 questions, 5 memory abilities; BEAM (ICLR 2026) 2,000 questions, up to 10M tokens; LoCoMo-Refined | p20 |
| Reliability headline | 1 in 13 50-step runs finish with no errors; assumes each step succeeds independently with probability 0.95 | p22 |
| Error-free chance by steps | 95% (1 step), 77% (5), 60% (10), 36% (20), 8% (50) | p22 |
| Fault origins | 5: user/task spec (specification failure), agent harness (harness failure), LLM (model failure), tool layer (tool failure), environment (environment failure) | p24 |
| Spec failures | 5: ambiguous goal, proxy objective, unstated constraint, no definition of done, conflicting goals | p25 |
| Harness failures | 5: context truncation, memory error, state corruption, control loop error, blocking fan-out; e.g. "200 steps, no progress" | p26 |
| Model failures | 6: hallucination, instruction violation, faulty reasoning, reasoning-action mismatch, unverified success, long-horizon degradation; e.g. "requests.fetch() exists", "undid its own fix from step 12" | p27 |
| Tool failures | 5: truncated output, silent failure, ambiguous schema, flaky call, misleading error; e.g. first 100 lines of a log missed an error on line 4,000; a date with no time zone scheduled a job 8 hours off; retried with sudo | p28 |
| Environment failures | 4: stale state, version mismatch, random failure, rate limit; e.g. Python 3.8, not 3.12; HTTP 429 after 50 calls; leap year; redesigned checkout page | p29 |
| Closing caveat | "We do not yet understand agents at scale, and there is little formal best practice." | p30 |

### Teaching points
- The through-line is that memory is a pipeline of policy decisions, not a database: every stage (observe, select, encode, store, retrieve, reflect, forget) is a decision the designer must make, and the deck reuses the same "Keeping? Format? Backend? Need it? Lesson? Valid?" navigation on every slide so the design space stays visible. (p6-p7, p17)
- "This is the thing students get wrong": forgetting is a first-class operation and validity/provenance are mandatory, because a memory without a valid time silently overrides newer information. (p13, p14, p18)
- Reliability is reframed as arithmetic first (0.95 per step -> 8% over 50 steps) and then as attribution: locate the fault layer before fixing anything. (p22, p24)
- The lecture is explicit that there is no formal best practice yet, so the deliverable is a checklist of bounds (step/cost/time caps, checkpoints, typed schemas, pinned environments) rather than a recipe. (p30)

### Visual opportunities
- Memory pipeline diagram: Observe -> Select -> Encode/organize -> Store -> Retrieve -> Reflect/consolidate -> Forget, with the six decision questions as annotation bubbles.
- Reliability survival curve: x = steps in trajectory (1, 5, 10, 20, 50), y = chance of an error-free run (95, 77, 60, 36, 8), with the "1 in 13" annotation at 50 steps.
- Five-layer fault stack (spec, harness, model, tool, environment) with each layer's failure-mode chips and the one-line fix.

### Takeaways
- Memory design is a chain of policy decisions: keep, format, store, retrieve, consolidate, forget.
- Reliability compounds: bound every run and attribute every failure to one of five layers.
- Validity time and provenance are part of the data model, not metadata you add later.

### Cross-deck thread
- Memory answers two problems raised in L5: "context management" as a reason to split agents (L5 p6) and the "information-loss points" design principle (L5 p44); the memory deck names the same disease as information loss and context pollution. (p11, p18)
- The L5 shared workspace / blackboard (L5 p12) is the storage half of the memory stack; L6 makes the store a first-class component with its own benchmarks, and L8 later charges money for context tokens, so memory format directly drives cost.
- The failure taxonomy here is the bridge to L7: L6 says failures are layer-attributable, L7 supplies the measurement apparatus (benchmarks, metrics, graders) to check whether a fix worked.

## Agent design IV: agent evaluation (slides: 37 pages)
- **Source PDF**: `course/site/slides/7_agent_design_4.pdf`

### Concepts
- Evaluation splits into component-level (inside the agent: planning, task decomposition, tool use - discovery, selection, parameterization - memory, error recovery) and end-to-end (success rate, cost, latency). (p6)
- The deck situates benchmarks in six eras: before 2018 (language modeling, narrow tasks), 2018-2019 (transfer learning, general NLU), 2020-2022 (foundation-model capability), 2023-2024 (agents and tool use, context, modalities), 2024-2025 (difficulty, robustness, freshness), 2025-2026 (larger scope, less specific instructions, more realistic use cases). (p7)
- Five evaluation objectives with representative benchmarks and a definition of success: predict text (PTB, WikiText), produce a correct answer (MMLU, GSM8K, GPQA, HLE), produce a preferred response (Arena, AlpacaEval, MT-Bench), produce functioning code (HumanEval, LiveCodeBench, SWE-bench), complete an interactive task (WebArena, OSWorld, tau-bench, Terminal-Bench). (p8-p9)
- Metric families: earlier benchmarks (perplexity, accuracy or F1, preference/win rate); capability (Pass@k, and Pass^k - all k solutions pass - introduced by tau-bench); cost (mostly LLM cost, with tool calls and other overheads such as LLM cache miss "overlooked"); latency/duration (not just LLM). (p10)
- A generic benchmark loop: reset the environment to the task's initial state, then loop observe -> act -> execute while not terminated and within budget, then score the agent's final answer, the final environment state and the trajectory. (p11)
- GAIA tests research-and-answer agents end to end: 466 human-written questions over web browsing, spreadsheets, PDFs, images, audio and calculation; no fixed tool API (each agent brings its own search, browser, Python, shell), so it tests the whole agent system rather than the LLM. Only the final answer is scored, and three difficulty levels scale steps and tool count. (p12, p13)
- BFCL (Berkeley Function Calling Leaderboard) tests the tool interface: whether the model picks the right calls, avoids irrelevant ones, and asks for a missing parameter instead of inventing one. Scoring is AST or execution based, with multi-turn checks on state plus reply; V4 adds web search and memory, and category scores should be read individually rather than as a composite. (p14)
- WebArena scores web workflows: an accessibility tree observation, click/type/stop actions, a reset snapshot and trajectory, functional checks, and a binary success; WebArena-Verified replaces LLM-as-a-judge with deterministic checks on HTTP traces. (p15)
- OSWorld extends the observation/action model to pixels and mouse/keyboard, with a setup logic, trajectory, final state and evaluator producing a reward; OSWorld 2.0 adds 108 long workflows with partial-credit checkpoints. (p16)
- SWE-bench scores a patch by applying it to the repo and running the tests, and has shipped Verified, Lite, Multilingual, Multimodal and Pro variants. (p17)
- tau-bench adds a simulated user and a policy: the agent must talk to the user and obey the airline policy while API calls change real database state. Reward is the product of an action term (final DB matches the annotated goal state) and an output term (the user-facing response includes required information); read-only calls may vary but unintended writes cause failure. It also introduced Pass^k, which is deliberately stricter than Pass@k. (p18, p19)
- Terminal-Bench packages a task as instruction.md + Dockerfile + tests/test.sh inside a container and grades the final system state with a test suite; it covers domains beyond repo bug fixes (sysadmin, data processing, model training, security, scientific workflows) and is positioned between SWE-bench and OSWorld - no GUI grounding. (p20, p21)
- TheAgentCompany simulates a company (GitLab, Plane tickets, ownCloud, RocketChat, LLM-simulated coworkers) and scores partial progress across a job with checkpoints, not just the final state. (p22)
- Leakage has four layers, not just training: training leakage, eval-time leakage, environment leakage and benchmark overfitting. Realistic tools enlarge the leakage surface, and a benchmark may be searchable. (p25)
- Leakage runs through the whole stack: modern agent performance is roughly P = f(LLM, prompt, scaffold, tools, retriever, memory, environment), and any one of those components can carry benchmark information - so "the model was not trained on the test set" is nowhere near sufficient. (p26)
- Challenge - single user turn: most benchmarks give one fully-specified instruction, with no user in the loop, while real work is ambiguous, revised and interrupted; single-turn scoring rewards confident guessing because asking a clarifying question costs steps and earns no credit. The three questions to ask instead are clarification, recovery and memory. (p27, p30)
- More challenges: success rate alone is insufficient (a 200-step, $40 run vs a 12-step, $0.30 run), non-determinism makes single-run scores noise rather than signal, and outcome-only scoring passes lucky or unsafe runs while trajectory matching fails valid ones. (p31)
- The deck closes on the economics of benchmarks: benchmarks saturate quickly (frontier reaches the human baseline or top models stop separating), and the frontier caught up remarkably fast on GLUE, MMLU, GPQA Diamond, SWE-bench Verified, ARC-AGI-2 and ARC-AGI-3. Evaluation is therefore still evolving toward stateful, long-horizon, multi-grader, contamination-aware measurement. (p32, p33, p34)
- A real-world agent has more than three dimensions: capability, cost, speed and agent usability; Assignment 3 is graded on all three of capability, cost and speed, using Pareto dominance. (p35)

### Numbers and named entities
| Item | Value / detail | Slide page |
|---|---|---|
| Deck title | "Agent design IV: evaluation" | p1 |
| Reference notes | https://cs2680.com/notes/agent-evaluation | p7 |
| Claude Code session log | ~/.claude/projects/ (MacOS and Linux), C:\Users\<YourUsername>\.claude\projects\ (Windows) | p3 |
| AI-usage disclosure | 17 students used Claude to help with writeup; 6 used to polish writing; 7 wrote a draft and edited it; 4 have almost exact output from Claude; 2 have TODOs from Claude Code; three students tried to erase the history | p3 |
| Era benchmarks | before 2018: Penn Treebank, WikiText, LAMBADA, SQuAD; 2018-2019: GLUE, SuperGLUE, ARC, HellaSwag, WinoGrande; 2020-2022: MMLU, BIG-bench, GSM8K, MATH, HumanEval, TruthfulQA, HELM; 2023-2024: MT-Bench, Chatbot Arena, AlpacaEval, IFEval, LongBench, MMMU, GPQA, AgentBench, WebArena, GAIA, SWE-bench, OSWorld, tau-bench; 2024-2025: MMLU-Pro, LiveBench, LiveCodeBench, MMMU-Pro, FrontierMath, Humanity's Last Exam; 2025-2026: GDPval, BrowseComp, Terminal-Bench, ARC-AGI-3 | p7 |
| Evaluation eras | 6: before 2018, 2018-2019, 2020-2022, 2023-2024, 2024-2025, 2025-2026 | p7 |
| Evaluation objectives | 5 (predict text, correct answer, preferred response, functioning code, interactive task) with their benchmark sets | p8, p9 |
| Metrics | perplexity, accuracy or F1, preference or win rate; Pass@k, Pass^k (introduced by tau-bench); cost (mostly LLM cost; overlooked: tool calls and others, e.g. LLM cache miss); latency/duration (not just LLM) | p10 |
| GAIA | 466 human-written questions; short answers: a number, string or list (e.g. 17.4 or 4,381); Level 1 <= 5 steps, zero or one tool; Level 2 5-10 steps, multiple tools; Level 3 arbitrarily long, many tools; source Mialon et al., GAIA, arXiv 2023 | p12 |
| GAIA scoring | score = (1/N) * sum_i 1[ normalize(y_hat) = normalize(y) ], final answer only; does not measure: send email, book a flight, modify a database, submit a form, update an issue | p13 |
| BFCL | example tools search_flights(origin="BOS", destination="CHI", date=...), book_flight(flight_id=..., passenger_id=...), get_weather(...); V4 adds web search and memory, read category scores not the composite; source Patil et al., Berkeley Function Calling Leaderboard, ICML 2025 | p14 |
| WebArena | 812 tasks; self-hosted shopping, admin, Reddit, GitLab, maps, Wikipedia; scored by reset snapshot, trajectory, final state, functional checks, success 1 / 0; source Zhou et al., WebArena, ICLR 2024; WebArena-Verified, ServiceNow, 2025 | p15 |
| OSWorld | 369 tasks; pixel observations (screenshots), mouse and keyboard actions; OSWorld 2.0 (2026): 108 long workflows (often 1 hr+), hundreds of steps, ~27 checkpoints for partial credit; source Xie et al., OSWorld, NeurIPS 2024; os-world.github.io | p16 |
| SWE-bench | variants Verified (human-checked), Lite (300-task subset), Multilingual (9 languages), Multimodal (image issues), Pro (harder, multi-file); sources Jimenez et al., 2024; OpenAI, 2024; Deng et al., 2025; swebench.com | p17 |
| tau-bench setup | simulated user (an LLM playing the customer), agent bound by airline policy (basic economy can't be modified), tools and airline DB; source Yao et al., tau-bench, arXiv 2024 | p18 |
| tau-bench scoring | r = r_action * r_output (final DB matches the annotated goal state; response includes required information); Pass^k = all k independent runs succeed, Pass@k = one is enough, Pass^k deliberately stricter; tau^3-bench adds corrected tasks, more domains, knowledge retrieval and voice evaluation | p19 |
| Terminal-Bench | packaged as instruction.md, Dockerfile, tests/test.sh; domains programming, sysadmin + server config, data processing, model training, security, scientific workflows; 89 tasks in TB 2.0 -> 66 in TB 4.0; hidden human solutions; 8-hour timeout | p20 |
| Terminal-Bench position | no GUI grounding; source Merrill et al., Terminal-Bench 2.0, arXiv 2026 | p21 |
| TheAgentCompany | 175 tasks (software, PM, data science, HR, finance); apps GitLab, Plane, ownCloud, RocketChat; S_partial = 0.5 * earned/total + 0.5 * S_full; 4/8 incomplete = 0.25, 7/8 incomplete = 0.44, 8/8 complete = 1.00; source Xu et al., TheAgentCompany, arXiv 2024; the-agent-company.com | p22 |
| Agent benchmark landscape | GAIA, WebArena, OSWorld, SWE-bench, BFCL, tau-bench, Terminal-Bench, TheAgentCompany (environment, typical actions, what is graded) | p23 |
| Leakage layers | 4: training leakage, eval-time leakage, environment leakage, benchmark overfitting | p25 |
| Leakage across stack | P = f(LLM, prompt, scaffold, tools, retriever, memory, environment); components base model, fine-tuning, prompt, retrieval, memory, web search, environment, scaffold, agent development | p26 |
| Single-turn cost example | a 200-step, $40 run vs. a 12-step, $0.30 run | p31 |
| Frontier catch-up | GLUE 2018: human level (87.1) in 14 months, 91.1; MMLU 2020: expert level (89.8) in 39 months, 92.3; GPQA Diamond 2023: PhD experts (69.7) in 10 months, 96.0; SWE-bench Verified 2024: 33% -> 95% in 22 months, 95.0; ARC-AGI-2 2025: average human (60) in 11 months, 95.0; ARC-AGI-3 2026: 0.5% -> 62.7% in 6 months*, 62.7 | p32 |
| Saturation | timeline 2016 to 2025 plus "Sep 2026"; saturated list SQuAD 1.1, GLUE, SuperGLUE, ARC-AGI-1, MMLU, MATH, HumanEval, Chatbot Arena, MT-Bench, WebArena, SWE-bench -> Verified, GPQA Diamond, MMMU, OSWorld, FrontierMath, Humanity's Last Exam, ARC-AGI-2, Terminal-Bench, GDPval, SWE-bench Pro, Remote Labor Index, ARC-AGI-3, OSWorld 2.0; definition: frontier reached the human baseline or top models stopped separating | p33 |
| Evaluation shift | 6 dimensions: objective evaluated, interaction, grader, dataset, main metric, primary concern | p34 |
| Real-agent dimensions and Pareto | capability (higher is better), cost (lower is better), speed, agent usability; Assignment 3 is evaluated on all three metrics; A dominates B if A is no worse on any metric and better on at least one; Rank 1 is the Pareto frontier, speed is not drawn | p35 |

### Teaching points
- The lecture's core claim is that evaluation is an economics-of-time problem: the headline evidence is how fast the frontier reaches human baselines (14 months on GLUE, 10 months on GPQA Diamond, 6 months on ARC-AGI-3), and the second headline is that benchmarks saturate and must be retired. (p32, p33)
- "This is the thing students get wrong" is stated twice: leakage is not just a training-set problem (it runs through prompt, retrieval, memory, web search, scaffold and developer iteration), and single-turn scoring rewards confident guessing because a clarifying question earns no credit. (p25, p26, p27)
- The benchmark tour is organized by what the grader inspects - final answer, calls, DB state, patch tests, final system state, checkpoints - so the student learns to ask "what is graded?" rather than "what is the score?". (p13-p23)
- The lecture ends by widening the objective: real agents need capability, cost, speed and usability, and Pareto dominance is introduced as the ranking rule - exactly the rule Assignment 3's leaderboard uses. (p35, p41)

### Visual opportunities
- Benchmark landscape as a matrix: x = observation modality (text, accessibility tree, pixels, shell, API), y = graded artifact (final answer, call sequence, DB state, patch, system state, checkpoints), with the eight benchmarks placed as dots.
- Leakage layer diagram: the stack P = f(LLM, prompt, scaffold, tools, retriever, memory, environment) with the nine leakage entry points marked on the corresponding components.
- Saturation timeline (2016 -> Sep 2026) with the four era bands behind it and "Still open" vs "Saturated" lanes, plus the six frontier-catch-up mini-charts in one row.

### Takeaways
- Evaluate the whole stack, not the model: leakage enters through prompt, retrieval, memory, tools, scaffold and developer iteration.
- Always ask what a benchmark grades; single-turn final-answer scoring misses exactly the behavior real work needs.
- Benchmarks saturate in months, so treat them as a moving target and measure capability, cost and speed together.

### Cross-deck thread
- L6 (memory and reliability) supplies the failure taxonomy that L7 measures, and L7's component-level evaluation is what L6's memory benchmarks (LoCoMo, LongMemEval, BEAM, L6 p20) instantiate. (p6, p19)
- The L5 architecture vocabulary is reused for benchmarks: the same agent that L5 says should be decomposed gets evaluated here at component level (planning, decomposition, tool use, memory, error recovery) and end to end. (p6)
- This deck sets up L8 directly: having established that success rate is not sufficient and that a 200-step/$40 run is a bad outcome, the next lecture attacks cost and latency, and the Pareto rule on p35 is the hinge into Assignment 3's leaderboard. (p31, p35)

## Advanced agent design I: cost and performance (slides: 54 pages)
- **Source PDF**: `course/site/slides/8_agent_design_5.pdf`

### Concepts
- The lecture's stated scope: it focuses on LLM cost while ignoring other compute costs. (p5)
- Cost decomposition: Cost = Users x Sessions / User x Turns / Session x Steps / Turn x Tokens / Step x Price / Token. Adoption and engagement grow the first two factors; agent trajectories and unit price are the shrinkable ones. (p7)
- A session is many turns and a turn is many steps: one user turn = multiple LLM and tool steps. (p6)
- Turn reduction rests on a quadratic fact: turn k re-reads turns 1..k-1, so total cost grows with the square of turn count. Levers: front-load planning, structured task decomposition with a done check per subtask, and self-verification before handoff - the goal is to finish autonomously with no user check-ins. (p9)
- Step reduction: one call per action (4 model calls) becomes plan-then-batch (2 model calls, 3 tools in parallel); batch independent calls, reuse plans and skills, and load context up front, because every model call re-reads the full context so fewer calls cost less. (p11)
- Token reduction splits into "shrink what enters" (drop stale results, compact history into state, compress observations keeping errors not full logs, offload big outputs to files, retrieve selectively, isolate exploration in a sub-agent that returns a summary) and "reduce output" (prompt-level constraints, output-token caps, structured output schemas, adaptive reasoning effort). (p16, p18, p19)
- The token economics are cache-dominated: output is 5x smaller than fresh prefill, fresh prefill is 100x smaller than cache reads, the typical price ratio is cache read : input : output = 1 : 10 : 50, and 97.6% of tokens in the measured usage were cache reads. Tokens that stay in context are paid for again on every later step. (p15, p16)
- Price reduction has three shapes: caching and batching (maintain stable prefixes, batch what can wait; batch+cached input is 0.05x base input price, cached input 0.1x, batch input 0.5x, output 5x), model routing (choose up front, escalate on failure, re-route each step), and later-lecture system techniques (MoE/sparsity, quantization, pruning, distillation, workload-targeted fine-tuning; speculative decoding, KV-cache optimization, better request scheduling; faster kernels, better kernel scheduling, specialized accelerators). (p21-p23)
- Every saving has a counter-cost: compaction vs reconstruction, routing vs longer failures, subagents vs duplicated context, speculation vs wasted work. Net saving = gross saving - counter-cost, and both must be measured on the same tasks. (p25)
- Budgeting: cap each task (dollars, model calls, tool time, retries per step) and set limits from traced runs, e.g. 2x the p95 of successful tasks; stop when the verifier passes, when no new passing test appears in N steps, when the same error repeats, or when a limit hits - then hand off with a summary, because a stopped task with a summary costs less than a runaway one. (p26)
- Before using an LLM at all, check whether the step needs reasoning: same steps every time -> write a script; fixed input format -> parse with rules; narrow label or score -> train a small classifier; fixed workflow with little reasoning -> script the workflow and call the LLM only at the steps that need it. (p27)
- Speed: completion time is the critical path, not the sum of every step (serial ~= sum, parallel ~= critical path). Cheaper can be slower - small models may take more steps, and parallelism costs more tokens for less waiting. (p29)
- Speed levers: speed up LLM serving (every cost technique also cuts latency), improve orchestration (async execution, persistent sessions, stream and pipeline, colocate services), speed up tool calls (cache tool results, faster hardware, better tools, fail fast - measure tool time per step before tuning the model), and parallelize work. (p30-p33)
- Speculative actions: predict the next action with a cheap model, run it early while the main model thinks, then compare; a match skips the wait, a miss costs one wasted call. It pays off when guesses are often right and actions can be undone. What can be speculated ranges from tool intent, to tool call with arguments, to next action, to branches, to a whole multi-step trajectory; predictions come from a model, from an early fork of the same model, or from past traces, and can be lossless (always verify) or lossy. (p34-p36)
- The optimization loop: run and profile, measure, change one thing, re-evaluate on the same tasks (success, spend, p95 latency) - "Remember this for your Assignment 4!". (p38)
- Three harness architectures: monolithic (everything in one runtime), modular (one controller reaches memory/tools/context/sandbox through interfaces), and agent microkernel (a small runtime keeps only state, coordination, scheduling, security while external services supply memory, tools and execution). The shift is responsibility moving out of the agent - from code to interfaces to services. (p39-p40)
- A single Python snippet illustrates the cost of that shift: monolithic executes locally, modular calls SandboxProvider.run(code), microkernel sends an execution request to an execution service that owns allocation, isolation and sandbox lifecycle. The microkernel trades simplicity and low overhead for isolation, sharing and scale. (p44, p45)
- Eight real harnesses are compared, each with a distinctive idea: Claude Code (policy layer and typed hooks), Codex CLI (sandbox before approval; Lark patch grammar matched in four passes), DeepSeek Harness (the loop is a plugin; compare-and-swap edits), OpenCode (harness is a server; nine fuzzy replacers; shadow git for undo), Pi (minimal core, four tools; cache warming with a $0.05 price check; pi-ai supports 42 providers on 10 wire APIs), oh-my-pi (hashline edits, IDE in the process, snapcompact and TTSR), OpenClaw (chat gateway with 27 channels and queue lanes; memory before compaction; fences, taint, sentinels), Hermes Agent (a background fork edits memory and skills; compaction starts at 50% of the window - the earliest of the eight; writes tool-call rows before any side effect). (p46-p53)

### Numbers and named entities
| Item | Value / detail | Slide page |
|---|---|---|
| Deck title | "Agent design V: cost-effective agents" | p1 |
| Assignment logistics | Assignment 3 worth 20% of your grade (treat it like a midterm), limited submissions per day, no late days; Assignment 4 now worth 20 points, Assignment 5 worth 10 points (A5 too hard, overlapped with the course project and other courses' projects) | p2 |
| Cost equation | Cost = Users x Sessions/User x Turns/Session x Steps/Turn x Tokens/Step x Price/Token | p7 |
| Session usage | single-prompt sessions 68% (Assignment 1), 75% (Assignment 2); marathons 100+ turns | p8 |
| Steps per turn | median 3 (Assignment 1), 4 (Assignment 2); some turns run almost 1,000 steps; mostly because effort is set to medium or high | p10 |
| Tokens per step | main agent median 200K-300K (chart medians 208K Assignment 1, 301K Assignment 2), p90 600K-700K; subagent median ~80K, p90 ~200K | p13 |
| Context growth | context at step ~500: 670K (Assignment 1), 650K (Assignment 2) | p14 |
| Token price relations | output is 5x smaller than fresh prefill; fresh prefill is 100x smaller than cache reads; typical price ratio cache read : input : output = 1 : 10 : 50; cache-read token share 97.6% (Assignment 1) | p15 |
| Related work: skill reuse and durable memory | Voyager (2023) stores executable skills; SkillRL (2026) improves skill library and agent policy jointly; ExpeL (2023) extracts reusable insights; ReasoningBank (2025) keeps strategies from successful and failed runs; Test-Time Plan Caching (2025) reuses and adapts plan templates; Mem0 (2025) stores and updates facts; LightMem (2025) consolidates offline; SimpleMem (2026) compresses memory | p12 |
| Related work: context and prompt compression | ACON (2025) peak context cut 26-54%; Active Context Compression (2026) 23% fewer tokens; TRACE (2026) summaries cause rework; MemGPT (2023) context as fast memory; Scroll (2026) lossless external log; LLMLingua (2023) up to 20x fewer tokens; LongLLMLingua, LLMLingua-2 (2024); Prompt Compression in the Wild (2026) pays off only on long prompts | p17 |
| Related work: tool data out of context | Code execution with MCP (2025) 150K -> 2K tokens; Tool Search (2025) 85% fewer tool tokens; Programmatic Tool Calling 37% fewer | p17 |
| Output constraints | "Answer in <= 100 words.", "Return only JSON.", "One sentence. Top 3 items."; caps max_tokens=300 / max_output_tokens=300, but reasoning can use up the cap | p18 |
| Adaptive reasoning effort | lookup: effort="low"; debug: effort="high"; set per call or per step, as reasoning effort or a thinking-token budget | p19 |
| Related work: output budgets | Concise CoT (2024); CCoT (2024); Chain of Draft (2025); TALE (2024); Ares (2026); When to Plan (2025); s1, L1 (2025) | p20 |
| Related work: structured decoding | Let Me Speak Freely? (2024); XGrammar, SGLang (2024); JSONSchemaBench (2025); AdaEdit (2026); CodeStruct (2026); Tool-making agents (2026) cut output tokens 58% | p20 |
| Price per token (Claude API) | batch + cached input 0.05x, cached input 0.1x, batch input 0.5x, base input token 1x, output token 5x | p21 |
| Later-lecture system levers | model optimization: MoE/sparsity, quantization, pruning, distillation, workload-targeted fine-tuning; serving engine: speculative decoding, KV-cache optimization, better request scheduling; hardware: faster kernels, better kernel scheduling, specialized accelerators | p23 |
| Related work: prefix caching and routing | vLLM (2023) PagedAttention; SGLang (2024) RadixAttention prefix cache; Prompt Cache (2024) modular reuse; RouteLLM (2024) learned router; MasRouter (2025) also picks agent roles; FrugalGPT (2023) learned cascade; AutoMix (2023) self-verification; EcoAssistant (2023) execution feedback; ToolOrchestra (2025) small orchestrator; BAAR, MTRouter (2026) budget-aware | p24 |
| Per-task budget | $10, 80 calls, 15 min tool time, 2 retries per step (illustrative); set limits from traced runs, e.g. 2x the p95 of successful tasks | p26 |
| Small-model alternative | "GBM or Jev!" (as extracted; likely garbled) | p27 |
| Parallel speedup | same work, a third of the wait | p33 |
| Speculative work | sources: Speculative Actions (ICLR 2026) [1]; Speculative Tool Calls (arXiv 2025) [2]; SPAgent (arXiv 2025) [3]; PASTE (arXiv 2026) [5]; B-PASTE (arXiv 2026) [6]; SPORK (arXiv 2026) [8]; Speculate with Memory (arXiv 2026) [9]; Speculative Macro Commit (arXiv 2026) [10]; targets: tool intent, tool call, next action, branches, trajectory | p35, p36 |
| SPORK example | think: 2,000 tokens ... early probe -> search(q) | p37 |
| Optimization loop | 4 steps: run and profile, measure, change one thing, re-evaluate (success, spend, p95 latency) | p38 |
| Harness architectures and comparison rows | 3 architectures (monolithic, modular, microkernel); comparison rows: design principle, central controller, component replacement, execution isolation, component deployment, independent scaling, communication cost, typical use case; fit: monolith for standalone agents, microkernel for multi-agent infrastructure | p39, p40, p45 |
| Harness key characteristics | monolithic: the agent owns everything, in one runtime; modular: one controller delegates through interfaces, providers RedisMemory, MCPTools, SlidingWindowContext, DockerSandbox (Docker -> Firecracker swap); microkernel: the runtime coordinates, external services provide capabilities | p41, p42, p43 |
| The eight harnesses | CC Claude Code, CX Codex CLI, DSH DeepSeek Harness, OC OpenCode, PI Pi, OMP oh-my-pi, CLAW OpenClaw, HM Hermes Agent; languages: Anthropic/TypeScript (closed), OpenAI/Rust, DeepSeek AI/TypeScript, Anomaly (SST)/TypeScript+Bun, Mario Zechner / Earendil/TypeScript, Can Boluk / Stencil Labs/TypeScript+Rust, OpenClaw Foundation/TypeScript, Nous Research/Python | p46 |
| Codex CLI | sandbox with no network access, approval only to go out of the sandbox; Lark patch grammar, hunks matched in four passes | p47 |
| OpenCode | TUI, SDKs and web app use the same OpenAPI HTTP server; nine replacers from exact to anchor match; shadow git repository for /undo | p49 |
| Pi | core has four tools and no MCP, sub-agents or approvals; keep-alive requests only when the expected saving is $0.05 or more; pi-ai supports 42 providers on 10 wire APIs; three other projects use Pi code | p50 |
| oh-my-pi | 4-hex file tag plus line numbers per edit; one shell stays open for all calls; snapcompact changes old history into images; TTSR stops and tries again when a regex matches | p51 |
| OpenClaw | 27 chat channels send messages to one lane for each session; first a silent turn writes dated notes; recall uses full-text and vector search together; fences, taint and sentinels | p52 |
| Hermes Agent | background fork edits the memory and the skills; compaction starts at 50% of the window (earliest of the eight); writes tool-call rows to the session database before any side effect | p53 |

### Teaching points
- The cost equation is the spine: every later slide is a lever on exactly one factor (turns, steps, tokens, price), and each lever slide repeats the four-factor progress bar so students can see which factor they are moving. (p7, p9-p24)
- The "students get wrong" point is that cost is dominated by things other than raw output length: cache reads dominate the token bill (97.6% of tokens, priced 1:10:50 against input and output), and each token left in context is re-paid on every later step. (p15, p16)
- Caching and context management are the deep lesson: a stable prefix is worth more than a shorter prompt, and compaction trades tokens now for reconstruction later - hence the explicit rule "net saving = gross saving - counter-cost; measure both on the same tasks". (p21, p25)
- The second half reframes agent quality as a three-way tension rather than a maximization: capability (higher better), cost (lower better), speed, with Pareto dominance as the ranking rule - what Assignment 3's leaderboard implements. (p35, p41)
- The harness comparison is presented as a relocation of responsibility (from code, to interfaces, to services) with a concrete "one Python snippet" test to make the isolation/overhead tradeoff visible rather than abstract. (p40, p44, p45)

### Visual opportunities
- Cost decomposition waterfall or stacked bar: Users x Sessions x Turns x Steps x Tokens x Price, annotated with the measured class values (68% single-prompt sessions, median 3-4 steps/turn, 208K-301K tokens/step) as the empirical instance of each factor.
- Token-cost chart: cache read : input : output = 1 : 10 : 50 as a bar chart with the 97.6% cache-read share overlaid, plus the 150K -> 2K MCP code-execution example as a before/after.
- Critical-path Gantt: serial (queue, setup, prefill, reasoning, tools, orchestration) vs parallel (plan, worker A, worker B, merge) with the critical path highlighted in red, plus the three-panel harness diagram (monolithic / modular / microkernel) with the "one Python snippet" path drawn through each.

### Takeaways
- Cost = Users x Sessions x Turns x Steps x Tokens x Price; only four of those factors are yours to shrink, and turns cost quadratically.
- Every optimization has a counter-cost - measure net saving, not gross saving.
- Better agents are not simply cheaper or faster; they are Pareto-efficient on capability, cost and speed.

### Cross-deck thread
- L5's "turn k re-reads turns 1..k-1" is a restatement of the L5 context-management argument (L5 p6) and its "more communication can increase context pressure" warning (L5 p44): the same context tax, now priced.
- The memory stack from L6 (p21) and the memory systems Mem0, Graphiti, supermemory (L6 p15-p16) reappear here as cost levers (Mem0, LightMem, SimpleMem on p12), and L6's "keep context lean" discipline becomes the "drop what's stale" technique on p16.
- The harness comparison (p39-p45) is the L5 architecture story applied to a single agent: supervisor-worker and shared-memory topologies become MemoryProvider/ToolProvider services, and MCP/A2A from L5 (p42-p43) become the microkernel's standardized protocols; the optimization loop ends in L7's three-metric Pareto view, which is what Assignment 3 scores.

## Assignment 3: MadsOpt - Harness Competition (slides: 7 pages)
- **Source PDF**: `course/site/slides/8_assignment3.pdf`

### Concepts
- The assignment is a harness competition, not a prompt-writing exercise: students ship an agent runtime that solves tasks, and are scored on capability, cost and time simultaneously. (p1, p6)
- The task environment has 26 tasks in 3 types of containers, with the agent and the task in separate containers accessed over HTTP requests. (p2)
- Evaluation is offline and sandboxed: the agent can only reach api.cs2680.com. (p2)
- The runtime contract is a dispatcher/agent/evaluator loop: the dispatcher passes task info to your agent, the agent works on the task and generates a patch, the patch is evaluated and the result is sent back to the agent. At most 5 tasks run in parallel. (p3)
- Three model tiers are available: Expert, Standard and Starter. (p4)
- Time and cost limits: 35 min per evaluate() call and 4 h total; $30 per day and $10 per run. (p4)
- Code structure: init.sh and package_claude_sessions.py generate session logs; src/ holds the agent logic and sandbox requests and is zipped - src.zip is the only file uploaded to the leaderboard; dispatcher and evaluation_scripts are the same code used on the leaderboard and must not be modified for local testing. (p5)
- Leaderboard submission: log in with the Canvas email and the password 'Cs2680-<your 8-digit student ID>', submit src.zip, and cancel a submission that does not look promising because submissions are queued one at a time - a cancelled submission still counts and consumes the daily budget. (p6)
- A submission is measured by the number of tasks solved, the cost per solved task and the time per solved task; grading uses a skyline over the three metrics, a baseline of solving 16 tasks, and a score of max(81 - r, 50) if any submission achieves the baseline, otherwise 81 - r, with the leaderboard accounting for 80 points plus 10 for the writeup and 10 for the video. (p6, p7)

### Numbers and named entities
| Item | Value / detail | Slide page |
|---|---|---|
| Assignment title | "MadsOpt: Harness Competition" | p1 |
| Tasks and containers | 26 tasks; 3 types of containers; agent and task in separate containers, accessed with HTTP requests | p2 |
| Offline evaluation | can only access api.cs2680.com | p2 |
| Runtime loop | dispatcher passes the task info to your agent; agent works on a task and generates a patch; the patch is evaluated with the result sent back to the agent; 5 task in parallel at most | p3 |
| Model tiers | Expert, Standard, Starter | p4 |
| Time limit | 35 min per evaluate(); 4 h in total | p4 |
| Cost limit | $30 per day; $10 per run | p4 |
| Session-log tooling | init.sh, package_claude_sessions.py generate session logs | p5 |
| Submission artifact | src/ holds the agent logic and sandbox requests; zipped, it is the ONLY file uploaded to the leaderboard | p5 |
| Grading code | dispatcher, evaluation_scripts - the same used on the leaderboard, do not modify for local testing | p5 |
| Leaderboard login and queue | log in with the Canvas email and password 'Cs2680-<your 8-digit student ID>'; submit src.zip; one submission in queue at a time, so cancel a submission that does not look promising; a cancelled submission also counts and consumes the daily budget | p6 |
| Submission metrics | the number of tasks solved, the cost per solved task, the time per solved task | p6 |
| Skyline and rank | skyline with the three metrics; at least solve 7 tasks; the ranks count everyone ahead of it: 1,1,1,4,... | p7 |
| Baseline and score | a baseline of solving 16 tasks; score = max(81 - r, 50) if any submission achieves the baseline, otherwise 81 - r | p7 |
| Point split | the leaderboard accounts for 80, with another 10 for the writeup and 10 for the video | p7 |
| Grade weight (stated in L8 p2) | Assignment 3 is worth 20% of the grade | p7 |

### Teaching points
- The assignment forces the L7/L8 lesson into practice: the leaderboard ranks on a three-metric skyline (tasks solved, cost per solved task, time per solved task) with Pareto-style ranks, so a cheaper-but-worse harness can lose to a costlier one that clears the 7-task floor.
- The scoring formula has a deliberate structure - a baseline of 16 solved tasks and a floor of 50 points - so the deck is teaching "clear the baseline, then compete on efficiency", not "maximize the raw score". (p7)
- The framework teaches harness engineering, not agent design: the student owns the agent logic and sandbox requests, while the dispatcher and evaluation scripts are fixed and must not be modified - the same "swap the provider, not the agent" boundary the L8 harness slide draws. (p5, L8 p44)
- Time and money are enforced by the runtime (35 min per evaluate(), 4 h total, $30/day, $10/run), which operationalizes the L6 lesson to bound every run and the L8 lesson to cap per-task budgets. (p4)

### Visual opportunities
- Score pipeline diagram: patch -> apply to repo -> run tests -> resolved or not, mirroring the SWE-bench scoring slide from L7 and closing the loop from harness to grade.
- Budget dashboard mock: 4 h wall clock, 35 min per evaluate(), $30/day, $10/run, 5-way parallelism - a quota bar chart a student could track against.
- Leaderboard skyline mock-up with the 7-task eligibility floor and the 16-task baseline drawn as two horizontal reference lines.

### Takeaways
- You are graded on capability, cost and time at once - the skyline, not the top score, is the objective.
- The runtime contract is fixed: 26 tasks, offline-only, 5-way parallel, 35 min per evaluate(), $10 per run.
- Clear the 16-task baseline, then win on efficiency; a cancelled submission still burns budget.

### Cross-deck thread
- This is the applied form of L7's Pareto view (capability, cost, speed with dominance ranking) and L8's cost decomposition - the leaderboard is the measurement instrument for everything taught so far.
- The "agent logic in src/, fixed dispatcher and evaluation scripts" split is the L8 modular harness in practice: a controller with swappable providers under fixed evaluation. (L8 p42, p45)
- The parallel-submission and cost-cap mechanics echo the L5 critique that more agents mean more duplicated context and overhead; here the same trade-off shows up as cost per solved task. (L5 p15, L8 p25)
- The session-log requirement (init.sh, package_claude_sessions.py) ties back to the L7 academic-integrity slides about Claude Code session logs at ~/.claude/projects/. (L7 p3)

## Source discipline notes
- File naming differs between the two sources: the PDFs are `course/site/slides/<n>_<deck>.pdf` (as cited in each "Source PDF" line), while the extracted text files on disk are `course/slides/slides_<n>_<deck>.txt` (with a `slides_` prefix). Both were read for this digest; the page markers quoted here come from the .txt files.
- Page markers vs on-slide numbers drift. The "Slide page" column in every table uses the "----- page N -----" marker from the .txt files, not the footer number printed on the slide. In deck 5 the footer number is offset from the marker from p33 onward (marker p33 carries slide number 35, marker p46 carries 49); deck 6 is offset from p19 (marker p19 = slide 20); deck 7 is offset from p35 (marker p35 = slide 36); deck 8 is offset from p28 (marker p28 = slide 30) and from p46 (marker p46 = slide 51). A reviewer cross-checking by printed slide number will see an offset.
- Deck 5 p4 and p32, and deck 6 p17 and p24, carry no printed slide number in the extraction; they are identified here only by their page marker. Deck 7 p9 duplicates p8 (the "Evaluation objectives" table appears twice with identical content).
- Deck 5 p18 ("Eight architectures" table): the category cells are merged in the source and linear text extraction does not preserve cell boundaries. Supervisor-worker, Hierarchical and Pipeline/DAG clearly sit under "Centralized" and Blackboard, Committee/debate and Swarm under "Decentralized", but the position of "Market / auction" relative to the "Decentralized" label is ambiguous in the extracted text. I have not guessed a category for it.
- Deck 6 p6 (memory design questions) is a two-column slide; the pairing of each question to its action (WRITE OR SKIP, ENCODE / ORGANIZE, RETRIEVE, REFLECT / GENERALIZE, KEEP / UPDATE / DELETE, STORE) is reconstructed from the ordering of the question/action pairs and from the repeated navigation footer on p7-p14. "Who owns the memory?" appears to be the lead-in question answered on p15, not one of the six.
- Deck 6 p1 title contains the source's typo "reliabiltiy"; one product is spelled "supermemory" (lowercase). Both are preserved as extracted.
- Deck 7 p32: the ARC-AGI-3 row is marked "6 months*" but the asterisk footnote is not present in the extracted text layer. I have not reconstructed what it refers to.
- Deck 7 p28 and p29 are titled "Challenges with Agent Evaluation: a single user turn" but contain no extractable text beyond the title; p28 says only "This is how you used Claude Code in Assignment 1" and p29 appears to hold only images. The content of those two slides (likely screenshots) is not in the text layer and is not covered by this digest.
- Deck 8 p8, p10, p13, p14, p15 and p21 contain bar/line charts whose labels extract as loose fragments ("68%", "75%", "208K", "301K", "670K", "650K", "97.6%", "0.05x", "0.1x", "0.5x", "5x"...). The mapping of each value to Assignment 1 vs Assignment 2 is taken from the adjacent labels on the same page.
- Deck 8 p12, p17, p20, p24, p35 and p36 are explicitly "ADVANCED - skim, or read more on your own" literature slides. Their paper lists are reproduced as name + year + one-line claim exactly as written; I have not verified these papers against their originals.
- Deck 8 p27 contains the string "GBM or Jev!" for the small-classifier alternative. This is almost certainly a garbled extraction of a classifier name; it is reproduced verbatim and flagged rather than guessed.
- Deck 8 p35-p36 use numeric citation keys ([1], [2], [3], [5], [6], [8], [9], [10]); the full source list is on p35 and p36. Keys [4] and [7] are never defined in the extracted text. Deck 8 p53 states Hermes Agent's compaction threshold is "50% of the window" and calls this "the earliest of the eight harnesses", but gives no comparison values for the other seven.
- The Assignment 3 deck has no printed slide numbers, only the 7 page markers. Its "20% of the grade" figure is stated in deck 8 p2, not in the assignment deck itself; that row is flagged accordingly.
- Greek letter tau and superscript 3 in "tau-bench" / "tau^3-bench" have been transliterated to ASCII here, and the approximately-equal sign in the T_multi equation has been written as "~"; the source uses the Greek and math glyphs. No image, screenshot or diagram content outside the text layer was inspected: the decks are heavily diagram-driven, so the visual material in the PDFs is richer than this digest can carry.
