---
title: Cost-effective agents
source: https://cs2680.seas.harvard.edu/notes/cost-effective-agents.html
fetched: 2026-10-19T16:28:00+00:00
source_kind: harvard-cs2680-official
---

# Cost-effective agents
CS2680 Modern AI Systems — Cost-effective Agents

CS2680 Modern AI Systems

# Cost-effective agents

Course notes · [Agent evaluation](agent-evaluation.html) · [Course readings](../readings.html)

An efficient agent spends computation where it changes the chance or value of a successful outcome. The relevant unit is the complete task, including planning, tool use, retries, verification, and human correction. This page organizes the available techniques by the cost they remove and the new costs they introduce.

## Measure the whole episode

Start with a cost ledger for each attempted task. Add every model call from the main agent, planners, routers, compressors, workers, and verifiers. Price uncached input, cached input, and output or reasoning tokens under the actual provider rules. Add tool fees, execution, memory storage and retrieval, and human review. For a self-hosted model, use the provisioned infrastructure cost instead of an API price; do not count the same compute twice.

Episode cost = all model calls + tools + memory services + execution + human review

Keep offline costs in a separate project ledger: teacher trajectories, fine-tuning, workflow search, evaluation, and refresh. A deployed policy may be cheap per task but expensive to discover or maintain. Its lifetime cost depends on how many tasks will use it.

**Report together:** verified success rate, total spend divided by verified successful task trials, cost per attempted trial, p50 and p95 time to a usable result, and the distribution of cost across tasks. The cost-per-success ratio is undefined when no tasks succeed. It does not say which tasks regressed or whether a minimum success or latency requirement was met.

For example, on the same 100 tasks, a baseline that costs $120 and succeeds 80 times costs $1.50 per success. A candidate that costs $90 and succeeds 75 times costs $1.20 per success, but loses five completions. If the deployment requires at least 80% success, the candidate is ineligible despite the better ratio. Compare the full quality-cost frontier and the particular tasks gained and lost.

Sources: [AI Agents That Matter](https://arxiv.org/abs/2407.01502) · [Cost-of-Pass](https://arxiv.org/abs/2504.13359) · [Agent evaluation guide: systems cost](agent-evaluation.html#systems-metrics).

## Find the expensive path

Record model, role, input and output tokens, cache hits, tool calls, elapsed time, retries, and outcome on each step. Group traces by successful, failed, and timed-out episodes. The longest trace, the most expensive trace, and the typical trace may have different bottlenecks.

| Observed cost | First lever to test | What must remain true |
| --- | --- | --- |
| Routine steps use an expensive model | [Per-step routing](#routing) or [specialists](#specialize) | Hard steps and downstream task success remain covered. |
| Many short model turns | [Executable control, batched tools, or a simpler workflow](#control) | Unexpected observations can still trigger replanning. |
| Long repeated prompts or tool results | [Selective context](#context) and [prefix reuse](#serving) | Important state stays available without costly reacquisition. |
| The same subtask is solved repeatedly | [Plans, facts, or executable skills](#reuse) | Reuse conditions and freshness can be checked. |
| Several agents repeat the same reasoning | [Fewer roles or messages](#collaboration) | Complementary evidence and necessary checks survive. |
| Long waits between dependent steps | [Parallelism or safe speculation](#latency) | Time saved is worth any extra work performed. |

## Route model calls by expected value

**Mechanism.** Choose a cheap or capable model separately for each request, role, or agent step. A prompt-only router predicts when a stronger answer is worth its price before either model runs. A cascade tries a cheap model first, then pays for a stronger model if a usable verifier or confidence signal recommends escalation. A budget-aware controller also sees trajectory state and remaining spend.

The decision should estimate the *incremental benefit of the intervention*: whether this stronger model, extra worker, or second attempt will improve the final result enough to justify its cost. Merely labeling a prompt as difficult is weaker. In a long run, one early weak action can change later observations and create retries. A policy evaluated by swapping model answers into a fixed transcript may therefore misprice the trajectory it would actually generate.

**Best fit.** Many calls are routine, a minority need stronger reasoning, and the router has a cheap signal that separates them. Start with fixed cheap, fixed strong, and simple threshold baselines. Charge the router, failed cheap attempts in a cascade, and any resulting recovery work. Validate the policy by running it in the environment through task completion.

Sources: [RouteLLM](https://arxiv.org/abs/2406.18665) · [Budget-Aware Agentic Routing](https://arxiv.org/abs/2602.21227) · [LLMRouterBench](https://arxiv.org/abs/2601.07206) · [The Replay Gap](https://arxiv.org/abs/2608.08239).

## Turn repeated narrow work into small-model capabilities

**Mechanism.** Collect verified trajectories and train a smaller model for a stable role: classify the next tool, extract fields, summarize an observation, plan a subgoal, or execute a familiar procedure. Training on actions and subgoals gives the specialist the behavior an agent needs, rather than only the teacher's final answer. A small orchestrator can still call stronger models for exceptional steps.

**Best fit.** High-volume tasks with repeated structure and an objective check of specialist output. Keep an escape route for unfamiliar cases and measure calibration on held-out task families. Count teacher calls, data filtering, training, evaluation, hosting, and refresh. The break-even question is whether lifetime per-call savings exceed those setup costs without shifting mistakes into later agent steps.

Sources: [FireAct](https://arxiv.org/abs/2310.05915) · [Agent Distillation](https://arxiv.org/abs/2505.17612) · [ToolOrchestra](https://arxiv.org/abs/2511.21689).

## Budget reasoning, sampling, and search

**Mechanism.** Set the amount of deliberation, candidate generation, and search expansion according to the task and the evidence already obtained. Stop sampling when additional candidates are unlikely to change the decision. Use concise intermediate notes where they preserve the necessary state. Give the agent a remaining budget for both tokens and tools, then let it decide whether the next useful step is to think, act, retrieve, verify, or stop.

A hard token cap only ends work when the cap is reached. It does not identify low-value work earlier. For an interactive agent, repeated thought can substitute for obtaining a fresh observation; more reasoning tokens can coexist with lower task success. Search and research agents benefit from explicit value-of-information rules: expand a branch only when its expected contribution exceeds the cost of another call or tool action.

**Measure.** Track task success, reasoning tokens, model turns, useful external actions, premature stopping, and failure recovery. Many efficient-reasoning results come from static questions; rerun the policy on full tool-using trajectories before treating token savings as agent savings.

Sources: [The Danger of Overthinking](https://arxiv.org/abs/2502.08235) · [Adaptive-Consistency](https://arxiv.org/abs/2305.11860) · [BATS](https://arxiv.org/abs/2511.17006) · [ExTS](https://arxiv.org/abs/2608.23848).

## Remove model turns from routine control

**Mechanism.** Put deterministic decisions in code, not in a model call. A plan can refer to future tool outputs, and its independent branches can run together. A code action can combine several tool operations into one model turn. A fixed pipeline can handle a task whose phases are stable, while a smaller tool menu avoids presenting an entire catalog on every step.

For example, a repository agent can search for candidate files, run tests, and collect diagnostics in one scripted operation. The agent still decides how to interpret the results and can replan when a test fails or the repository differs from expectations. Batching dependent actions blindly can hide intermediate failures and force a more expensive restart.

**Measure.** Model turns removed, tool calls added, time to recover from an unexpected observation, and task success. Parallel work reduces the critical path only for genuinely independent branches; it need not reduce total compute.

Sources: [ReWOO](https://arxiv.org/abs/2305.18323) · [LLMCompiler](https://arxiv.org/abs/2312.04511) · [CodeAct](https://arxiv.org/abs/2402.01030) · [Agentless](https://arxiv.org/abs/2407.01489).

## Keep context small without losing actionable state

**Mechanism.** Filter tool output to the fields needed for the next decision, retrieve relevant records instead of pasting a whole store, summarize completed branches, and keep durable facts in structured memory. Preserve constraints, stable identifiers, unresolved errors, current external state, and access to original evidence. The compressor's own calls belong in the cost ledger.

Different measures answer different questions. *Peak active context* determines whether a request fits and affects prefill memory. *Cumulative billed input* sums repeated prompts over the entire run. A smaller active context can require extra retrieval or tool calls to recover discarded facts; task completion may remain unchanged while cost rises. If a provider discounts a stable cached prefix, shortening or reordering it can also remove a discount.

**Best fit.** Long histories with completed branches, verbose observations, or documents that are consulted selectively. Compare no compression, simple truncation, and task-aware compression at the same success requirement. Record reacquisition calls and failures caused by missing state, not just the prompt length after compression.

Sources: [ACON](https://arxiv.org/abs/2510.00615) · [CoACT](https://arxiv.org/abs/2607.02911) · [TACO](https://arxiv.org/abs/2604.19572) · [Interaction costs of compression](https://arxiv.org/abs/2608.16370).

## Reuse facts, plans, and executable skills

Choose the reusable object before choosing a cache. A retrieved fact saves repeated reading; a plan template saves planning; an executable skill can eliminate several model decisions. Reuse works when the new task satisfies the stored object's preconditions and the current environment still agrees with its assumptions.

| Store | Cost it can avoid | Check before use |
| --- | --- | --- |
| Facts and structured memory | Repeated document reading and long prompts | Source, freshness, permissions, and relevance |
| Plan or workflow template | Repeated decomposition and tool-choice turns | Task shape, tool availability, and live data |
| Executable skill | Repeated reasoning and action sequences | Inputs, side effects, environment version, and tests |
| Cached answer | An entire model call | Semantic equivalence, state, identity, and time sensitivity |

Memory writes, indexing, retrieval, consolidation, and invalidation are real work. Loading a long skill on every turn may cost more than retrieving it on demand, while repeated short skills may benefit from a cached prefix. Measure reuse frequency and the complete payback period. A cache hit rate alone does not show whether hits were correct or whether maintenance cost was recovered.

Sources: [Agentic Plan Caching](https://arxiv.org/abs/2506.14852) · [Voyager](https://arxiv.org/abs/2305.16291) · [Memory serving costs](https://arxiv.org/abs/2608.11879) · [Skill Blocks](https://arxiv.org/abs/2608.14943).

## Pay only for useful collaboration

**Mechanism.** Reduce the number of agents, messages, or edges in a collaboration graph; narrow what each role receives; choose a cheaper model for routine roles; or invoke a specialist only when its expected contribution is distinct. These choices change different terms of the bill. Fewer agents removes whole model calls, sparse communication shortens prompts, and role assignment changes per-call price.

Compare against a capable single agent given the same tools and total budget. Several agents can repeat the same evidence or reinforce one mistake, while their communication adds input tokens and waiting. Prune a role only after checking whether it contributes a unique observation, a useful independent check, or an action the remaining system cannot perform.

**Measure.** Final task success, total model calls and tokens across every worker, distinct evidence contributed, and wall-clock time. Report both total cost and latency when parallel roles run at once.

Sources: [AgentPrune](https://arxiv.org/abs/2410.02506) · [AgentSlimming](https://arxiv.org/abs/2605.08813) · [OneFlow](https://arxiv.org/abs/2601.12307) · [RCR-Router](https://arxiv.org/abs/2508.04903).

## Amortize workflow and prompt optimization

**Mechanism.** Search over prompts, demonstrations, tool interfaces, or executable workflows on development tasks. The result may let a cheaper runtime policy solve the task, remove unnecessary steps, or improve success at the same budget. The optimizer's model calls, evaluations, human work, and later refreshes are part of the project cost.

Approximate break-even tasks = setup and refresh cost / net savings per deployed task

This approximation assumes stable traffic, prices, and quality. If a workflow costs $2,000 to discover and saves $0.02 per task after all runtime overhead, it needs roughly 100,000 tasks to repay the setup cost. Short experiments may never reach that volume. Reevaluate after model, tool, or task changes; a previously tuned workflow can become brittle or less economical than a simpler one.

The improvement loop has its own levers: reuse verified trajectories instead of collecting each demonstration again, focus development evaluations on tasks likely to reveal a regression, and reduce the number of optimization rollouts. Keep a separate held-out final test. Savings in training or evaluation do not imply savings in deployed inference, so report the two ledgers separately.

**Measure.** Report the cost and number of optimization trials, the held-out performance of the selected workflow, and savings against the best simple policy at equal quality. Keep optimization-set gains separate from the final test result.

Sources: [DSPy](https://arxiv.org/abs/2310.03714) · [AFlow](https://arxiv.org/abs/2410.10762) · [TopoPrior](https://arxiv.org/abs/2605.17359) · [Tool-R1](https://arxiv.org/abs/2509.12867) · [PTA-IRT](https://arxiv.org/abs/2609.01603).

## Lower serving cost without confusing it with fewer tokens

**API deployments.** Keep reusable instructions and tool schemas in a stable prefix when the provider offers cached-input pricing. Avoid moving timestamps and per-run state into that prefix. Measure actual cached-token charges; a shorter prompt is not necessarily a cheaper prompt if it destroys a valuable cache hit.

**Self-hosted deployments.** Prefix and KV-cache reuse avoid repeated prefill; batching and scheduling improve GPU utilization; phase-aware serving can keep short decodes from waiting behind long prefills. Multi-turn agents introduce tool gaps, so retaining a cache forever wastes capacity, while evicting it too early forces recomputation. The right retention policy depends on reuse probability, memory pressure, and reload cost.

Quantization and speculative token decoding can improve throughput or latency, but they do not by themselves reduce the agent's logical tool calls. Price them through provisioned hardware, goodput under the required latency target, and complete task success. Quantization may change decisions even when average language-model quality looks similar. Provider billing may not pass a self-hosted speedup on to an API customer.

Sources: [vLLM](https://arxiv.org/abs/2309.06180) · [SGLang](https://arxiv.org/abs/2312.07104) · [Continuum](https://arxiv.org/abs/2511.02230) · [AWQ](https://arxiv.org/abs/2306.00978).

## Reduce waiting with a separate money budget

Run independent tools concurrently and schedule work by dependency. Speculation goes further: launch a likely next action or observation before the current result arrives, then validate the draft before using or committing it. This can shorten the critical path while increasing total work when predictions are wrong.

Speculative work needs an isolation rule. Read-only or idempotent operations are easier to cancel; writes may require snapshots, validation, and rollback. A system that is 20% faster but 30% more expensive has purchased latency rather than reduced cost. That may be the correct choice under a response-time requirement, but the two outcomes should be reported separately.

Sources: [LLMCompiler](https://arxiv.org/abs/2312.04511) · [Speculative Actions](https://arxiv.org/abs/2510.04371) · [Speculative Macro Commit](https://arxiv.org/abs/2609.03236).

## Prevent expensive rework

Clear task specifications and model-facing tool interfaces can save more than a shorter prompt if they prevent wandering, malformed actions, or late failures. A targeted verifier can catch a cheap-to-fix error before the agent builds further work on it. Verification pays when the expected cost of errors it catches exceeds the cost of running the check.

Choose checks by what they can observe: a syntax test, state inspection, policy check, or human review each catches a different failure. Run costly checks where a mistake is consequential or likely, and allow a handoff when the system cannot meet a reliability requirement. Count human minutes, waiting, and review errors in the same ledger as model and tool work.

Sources: [SWE-agent](https://arxiv.org/abs/2405.15793) · [Task specification study](https://arxiv.org/abs/2608.25399) · [Verification surface study](https://arxiv.org/abs/2608.28795) · [Budgeted Act-or-Defer](https://arxiv.org/abs/2606.29654).

## Run a fair cost experiment

1. **Fix the outcome.** Define a verified final state, unacceptable side effects, a minimum success rate, and latency or budget limits before tuning. Use the same task starting states and grader for every policy.
2. **Trace the baseline.** Record full-episode cost and latency, including failures, retries, auxiliary models, tools, and human work. Inspect the expensive paths to pick one change with a plausible causal mechanism.
3. **Use simple comparators.** Include fixed cheap and fixed strong models, a static workflow, retries or escalation, and an equal-budget single agent when evaluating teams. A sophisticated router or optimizer must beat these policies on the target workload.
4. **Run the changed policy through the environment.** Routing, compression, and early stopping alter later observations. Evaluate complete trajectories, not only substituted answers or successful steps from logged runs.
5. **Compare several budgets.** Plot success against total cost and report p95 latency, hard-task regressions, and paired per-task outcomes. Count cache misses, state reacquisition, and failed speculative work where relevant.
6. **Hold out final tasks.** Tune on development traces and freeze the policy before the final comparison. If claiming transfer to new repositories, customers, or task types, hold out those groups rather than random rows from familiar ones.

Published savings are demonstrations under particular models, prices, workloads, and baselines. Token reduction, peak-context reduction, throughput, latency, and dollars are different measurements. A nonsignificant success difference does not establish equal quality. Keep the metric attached to each claim, and use the [agent evaluation guide](agent-evaluation.html#evaluation-design) for task validity, uncertainty, and reporting details.

Selected sources from the supplied literature map, reviewed September 27, 2026. The linked papers provide examples and evidence for the mechanisms; the page is organized by design decisions.
