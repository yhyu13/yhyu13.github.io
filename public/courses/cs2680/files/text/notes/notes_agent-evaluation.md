---
title: Agent evaluation and benchmarks
source: https://cs2680.seas.harvard.edu/notes/agent-evaluation.html
fetched: 2026-10-19T16:28:00+00:00
source_kind: harvard-cs2680-official
---

# Agent evaluation and benchmarks
CS2680 Modern AI Systems — Agent Evaluation and Benchmarks

CS2680 Modern AI Systems

# Agent evaluation and benchmarks

Course notes · [Course readings](../readings.html)

Understand each benchmark through a concrete task: what the system receives, what it does, and what the grader checks. The examples below are invented illustrations of the task format, not released test questions or reference solutions.

## What are we evaluating?

A benchmark score measures a particular system on a particular task distribution under a particular protocol. For an agent, that system includes the model, prompts, memory, tools, control loop, and execution environment. Changing the tool interface or the retry budget can change the score without changing the model.

**Model evaluation.** A model evaluation measures capabilities such as text prediction, knowledge, reasoning, and instruction following under a specified input and output setup. **Agent evaluation.** An agent evaluation measures whether the complete system can use observations and actions to achieve a goal, within its permissions and resource budget. Difficult questions alone do not make an evaluation agentic: the important change is that the system can act, observe consequences, and adapt.

A correct answer, a preferred response, a working artifact, and a correctly changed environment are different outcomes. This note first explains how to run and interpret an evaluation, then provides a [48-entry benchmark directory](#directory). Read the directory as a reference for task formats and scoring rules, not as a ranking of increasingly intelligent systems.

**Read every score with its protocol.** Name the benchmark version and split, the system configuration, the permitted tools, the budget, and the grader. Compare systems under matched conditions, then examine the trade-off between quality, reliability, latency, and cost.

## What happens in one evaluation episode?

**Task.** A problem with an initial state, an instruction, and completion criteria. **Trial.** One run of the evaluated system on that task, including any retries allowed by its policy. **Trajectory.** The recorded observations, actions, tool results, and responses from a trial. **Outcome.** The resulting answer, artifact, or environment state. Multiple trials of one task measure variability; they do not create new tasks.

The **agent harness** chooses what context the model sees, executes its tool calls, and decides when to stop. The **evaluation harness** initializes tasks, imposes limits, preserves evidence, invokes graders, and aggregates results. Keep these responsibilities separate so the system being tested cannot change its own scoring rule. These terms are adapted from [Anthropic’s evaluation guide](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), which calls a trajectory a transcript.

```
for task in frozen_task_set:
    for trial in trials_for(task):
        environment = reset_to(task.initial_state)
        agent = initialize_agent(frozen_config, trial.seed)
        trajectory = []
        while not terminated(agent) and within_budget(limits):
            observation = environment.observe()
            action = agent.next_action(task.instruction, observation)
            result = environment.execute(action)
            trajectory.append((observation, action, result))
        outcome = collect_answer_artifacts_and_state(environment, trajectory)
        scores = protected_graders(task, outcome, trajectory)
        record(task.id, trial.id, scores, trajectory, resource_usage)
```

This is conceptual pseudocode. The agent sees the allowed instruction, observations, and tools; reference answers and hidden grader state stay with the evaluator. Preserve failures, timeouts, and tool errors in the record. If the experiment tests memory across tasks, define that sequence explicitly instead of silently carrying state between otherwise independent trials.

### A worked example: the refund happened, but was it authorized?

Consider a toy customer-service task inspired by [τ-bench](#tau-bench), not a released benchmark item. The user wants to return one eligible item. The supplied policy requires confirmation before issuing the refund. The evaluator resets the order database and simulated user, and keeps the reference outcome hidden. The agent learns what the user wants through the conversation.

1. **Observe and identify.** The agent asks which item the user means, looks up the order, and checks eligibility through the available APIs.
2. **Confirm and act.** It explains the proposed return, obtains confirmation, and invokes the return API for the correct item.
3. **Finish and inspect.** It reports the result. The evaluator checks the refund record, unchanged unrelated orders, required response content, and whether confirmation preceded the write.

Three hypothetical trajectories for the same task.

| Observed behavior | Correct final state? | Confirmation rule satisfied? | Full task success? |
| --- | --- | --- | --- |
| Gets confirmation and claims completion, but makes no backend change | No | Yes | No |
| Issues the right refund before the user confirms | Yes | No | No |
| Confirms, issues the right refund, and reports it correctly | Yes | Yes | Yes |

The toy grader combines outcome and procedural checks. Original τ-bench checks database outcomes and required response information, but its reward does not exhaustively verify every policy constraint. A correct end state cannot prove that consent arrived before an action. Inspect the [actual reward definition](https://arxiv.org/html/2406.12045v1#S3) before interpreting a score as policy compliance.

## Choose a benchmark by the task and the evidence

Start with the work you want to evaluate and the evidence that would establish completion. The examples below refer to the named original benchmarks or releases. Their detailed entries include sources and limitations; later versions can change the environment, tasks, and scorer.

| Task format | Environment or input | Typical actions | What the grader inspects |
| --- | --- | --- | --- |
| [GAIA](#gaia): answer a question using tools | A question, sometimes attached files, and a tool stack that may include browsing and computation. | Search, inspect attachments, run calculations, and submit an answer. | A short final answer using type-dependent normalization and matching. |
| [BrowseComp](#browsecomp): find an obscure fact | Open-web search and intersecting clues. | Search, open sources, follow clues, and return an answer. | An LLM’s judgment of answer equivalence to a reference. |
| [WebArena](#webarena): complete a website task | Controlled websites and a specified browser observation/action interface. | Navigate, click, type, and submit a response or change. | Task-dependent answers, URLs, or website content and state. |
| [SWE-bench](#swe-bench): resolve a repository issue | An issue description and a repository at a specified commit. | Inspect the repository, edit code, run visible tests, and submit a patch. | The submitted patch’s results on designated repair and regression tests. |
| [Terminal-Bench](#terminal-bench): finish a terminal task | Instructions and a containerized command-line environment, with release-specific tasks and resource limits. | Run shell commands, edit files, and inspect resulting behavior. | Verification tests applied to the resulting state. |
| [OSWorld](#osworld): operate desktop applications | Initialized applications, files, and a computer-use interface. | Observe the desktop, operate applications, and save artifacts. | Task-specific checks over saved artifacts, application state, or system state. |
| [τ-bench](#tau-bench): serve a customer through APIs | A simulated user, domain policies, API tools, and backend data. | Ask the user for information, consult policy, and call backend APIs. | Database outcomes and required information in responses, across repeated trials. |
| [ARC-AGI-3](#arc-agi-3): learn an unfamiliar environment | Interactive observations and actions with rules and goals to infer. | Explore available actions, infer rules, and attempt to complete levels. | Level completion and action efficiency relative to human baselines. |
| [BFCL](#bfcl) and [ToolSandbox](#toolsandbox): use tools correctly | Function schemas, conversation, and, in interactive settings, changing world state. | Choose functions, supply arguments, clarify requests, and use tool results. | Version-dependent call structure, execution, state, or milestone checks; these scores have different denominators. |
| [LongMemEval](#longmemeval): remember prior experience | Conversation histories or, in V2, multimodal web-agent trajectories and a memory system. | Build or query memory, retrieve evidence, and answer a question. | Answer correctness and, in V2, the accuracy–query-latency trade-off. |
| [AgentDojo](#agentdojo): complete work despite prompt injection | Legitimate user requests and attacker-controlled content in tool outputs. | Perform the legitimate task while handling potentially malicious tool content. | User-task utility and attacker-goal success, measured separately. |
| [MultiAgentBench](#multiagentbench): coordinate agents | Multiple agents with a specified communication protocol and task environment. | Assign work, exchange messages, execute subtasks, and combine results. | Task outcomes and scenario-specific progress milestones. |
| [TheAgentCompany](#theagentcompany): work across enterprise tools | A simulated company with files, applications, and coworkers. | Use company applications, edit files, and communicate with simulated coworkers. | Weighted checkpoints and full completion; partial credit is a distinct score. |
| [GDPval](#gdpval): produce professional work | An assignment and supporting context or files. | Read inputs and create a document, spreadsheet, or other deliverable. | Blind comparisons of completed work products by expert graders; automated grading is a separate setup. |
| [KernelBench](#kernelbench) and [MLE-bench](#mle-bench): improve a technical artifact | A tensor workload or a machine-learning competition with executable feedback. | Generate and profile kernels, or train models and submit predictions. | Correctness and GPU speed, or held-out predictive performance and competition thresholds. |

A long tool-use trajectory can end in a short answer that is the only object graded, as in GAIA and BrowseComp. Conversely, a work-product benchmark can assess an artifact without testing ongoing collaboration with a real user, as in GDPval. Ask which part of the intended workflow remains unmeasured before choosing a suite.

For an agent-systems project, combine an outcome benchmark with a targeted diagnostic. For example, pair customer-service completion with tool-call accuracy and injection resistance, or pair repository repair with a memory test. Component scores help locate weaknesses, but averaging unrelated scores does not create a general measure of agent competence.

## The grader is part of the measurement

Use different checks for requirements that need different evidence. In the refund example, a database check can establish the write, a response check can establish the information given to the user, and an ordered event check can establish prior confirmation. None substitutes for the others.

| Grader | Useful evidence | Failure to guard against |
| --- | --- | --- |
| Code and execution | Required state changes, test results, valid formats, and explicit invariants. | A reproducible check can still encode an incomplete or overly narrow specification. Test valid alternative solutions and known bad outputs. See the [Agentic Benchmark Checklist](https://arxiv.org/abs/2507.02825). |
| Model judge | Semantic equivalence, rubric-based quality, and pairwise preferences. | Position, verbosity, and self-preference biases. Freeze the rubric and judge version, randomize answer order where appropriate, and compare judgments with human review. See the [MT-Bench and Arena study](https://arxiv.org/abs/2306.05685). |
| Human review | Expert quality judgments and cases the automatic scorer cannot resolve. | Disagreement and inconsistent criteria. Use explicit rubrics, blind system identity, and document adjudication. [GDPval](#gdpval) illustrates expert comparison of artifacts. |

**Grade the required behavior.** A task may permit several valid action sequences. Requiring the reference sequence can reject a successful alternative. However, a procedural requirement such as confirmation before a write needs trajectory evidence. Treat the agent’s generated explanation as a claim to verify against observations and actions.

**Audit passes and failures.** A pass can exploit a weak check, and a failure can reveal a broken environment or an underspecified task. NIST documents both retrieval of published solutions and manipulation of tests in [its agent-evaluation case studies](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations). Preserve the original score and report any adjudicated correction separately.

## Reading the metrics

Different metrics answer different questions; their numerical scales are not directly comparable.

| Metric | What it measures | What to check |
| --- | --- | --- |
| Perplexity | Exponentiated average negative log-likelihood on held-out text; lower is better. | Tokenization, preprocessing, and context protocol must be compatible. See [PTB](#ptb) and [WikiText](#wikitext). |
| Accuracy, exact match, and F1 | Correct answers or overlap with reference answers under a task-specific rule. | Answer extraction, normalization, allowed tools, and aggregation. F1 gives partial credit; exact match does not. See [SQuAD](#squad). |
| Preference or win rate | Observed or statistically adjusted preference relative to a specified competitor. | The judge, reference, tie handling, and whether the score is raw or adjusted for length. A win rate is not a correctness rate. See [AlpacaEval](#alpacaeval) and [GDPval](#gdpval). |
| Task success or resolution rate | The fraction of evaluated tasks or runs satisfying the benchmark’s completion checks. | Whether the checks capture the requested outcome and regressions; report the denominator and budget. See [SWE-bench](#swe-bench) and [OSWorld](#osworld). |
| pass@k | The probability that at least one of k sampled attempts succeeds. | Rewards multiple opportunities. It does not supply a way to select the successful candidate without a verifier. See [HumanEval](#humaneval). |
| passk | The probability that all k repeated trials of the same task succeed, averaged across tasks. | Measures consistency under the repetition protocol. It is different from pass@k. See [τ-bench](#tau-bench). |

### Finding a success versus succeeding consistently

For one task with independent attempts and a fixed success probability p, pass@k = 1 − (1 − p)k, while passk = pk. For the hypothetical case p = 0.8 and k = 3, these are 1 − 0.23 = 99.2% and 0.83 = 51.2%, respectively. Both describe the same per-attempt capability.

Tasks have different success probabilities, so compute the repeated-trial metric per task and then average. Applying these formulas to a benchmark’s aggregate success rate generally gives a different result. Adaptive retries that share feedback also differ from independent fresh attempts. Report the actual sampling and retry procedure. The underlying metric definitions come from [HumanEval](https://arxiv.org/abs/2107.03374) and [τ-bench](https://arxiv.org/abs/2406.12045).

**How to estimate these metrics from observed trials**

The probabilities above assume that p is known. In an experiment, run a predetermined number n of independent trials per task, resetting the environment and trial-specific memory. If c succeed, use these finite-sample estimators, then average across tasks:

Estimated pass@k = 1 − C(n − c, k) / C(n, k)
Estimated passk = C(c, k) / C(n, k)

C(a, k) counts the ways to choose k elements from a, and is zero when a < k. Require n ≥ k. For three successes in five trials, estimated pass@2 = 1 − 1/10 = 90%, while estimated pass2 = 3/10 = 30%. These estimate different events from the same observations.

Substituting the observed success fraction 3/5 directly into the population formulas would instead give 84% and 36%; those plug-in estimates are biased in finite samples. Stopping collection after the first success also violates this fixed-trial setup. The estimators and their assumptions are described in [τ-bench’s metric definitions](https://arxiv.org/html/2406.12045v1#S3). Even an estimate of 100% from a small sample is not a guarantee.

### Quality has a systems cost

Report success alongside wall-clock latency, model and tool calls, input and output tokens, and runtime cost. Charge all attempts, parallel workers, tools, and online verification to the agent’s runtime cost. Report evaluation-only grading expense separately. Token count alone misses tool execution, cached-input pricing, and differences in model prices.

Define **cost per successful task** as total runtime cost, including failed attempts, divided by the number of successful task trials under the stated retry policy. Count all permitted retries within each trial; do not divide repeated-run cost by the number of distinct task IDs solved at least once. If no trials succeed, report the ratio as undefined. Also report cost per attempted trial: a low cost per success can hide poor task coverage.

Compare success at a fixed budget, or trace success as the budget changes. Include simple baselines such as retries and escalation to a stronger model; this is a central recommendation of [AI Agents That Matter](https://arxiv.org/abs/2407.01502). Retrying until success requires a deployable success detector; selecting among attempts requires a deployable selection rule. Hidden benchmark tests cannot serve as a free selector for the agent.

For latency, distinguish time to a usable final result from time to the first token. Record timeouts and failures; averaging only successful runs can hide expensive failures. Parallel agents can reduce elapsed time while increasing aggregate compute and cost, so report both axes.

The [cost-effective agents reference](cost-effective-agents.html) develops the design techniques behind these cost measurements.

### A worked comparison: higher success at what cost?

Suppose two systems each run once on the same 100 tasks. The following counts and costs are hypothetical, and both systems use the same grader and permitted tools.

Paired outcomes preserve gains and regressions that an aggregate hides.

| Outcome on the same task | Number of tasks |
| --- | --- |
| Both succeed | 65 |
| Only A succeeds | 5 |
| Only B succeeds | 10 |
| Both fail | 20 |

| Result | System A | System B |
| --- | --- | --- |
| Task success | (65 + 5)/100 = 70% | (65 + 10)/100 = 75% |
| Total runtime cost, including failures | $100 | $150 |
| Cost per attempted task | $100/100 = $1.00 | $150/100 = $1.50 |
| Cost per successful task | $100/70 ≈ $1.43 | $150/75 = $2.00 |

B solves ten tasks that A misses and loses five that A solves, for a net gain of five percentage points. Its extra $50 buys five net additional completions in this experiment, or $10 per net additional completion. Neither system dominates the other in both success and cost. Inspect the regressions and compare A with a deployable retry policy under B’s budget before attributing the gain to B’s architecture.

### What does the uncertainty describe?

The arithmetic above describes this run on these tasks; it does not establish that B will outperform A on another run or workload. Repeated trials measure execution variability. More distinct tasks measure broader coverage. Running the same tasks more often cannot resolve a gap in the task distribution.

Compare systems using paired per-task differences. For a paired bootstrap over the task population, resample task IDs with replacement and carry both systems’ results together, keeping repeated trials of a task grouped. If tasks share a template or source, account for that clustering too. State whether the interval concerns repeated execution on a fixed benchmark or generalization to similar tasks. [Adding Error Bars to Evals](https://arxiv.org/abs/2411.00640) explains these distinct sources of uncertainty.

Report uncertainty on the *difference*; overlap between two separate score intervals is not a test of that difference. With a small evaluation set, an inconclusive comparison does not establish equivalence. No interval corrects an unrepresentative task set, contamination, or a grader that measures the wrong requirement.

### METR human task-duration horizons

METR’s time-horizon methodology relates agent success to how long tasks take human experts. Repeated agent attempts receive binary completion scores. A fitted logistic curve models success probability against the logarithm of human task duration. The 50% horizon is the human duration where that curve predicts 50% success; an 80% horizon uses the corresponding higher reliability threshold.

These durations describe the human workload represented by a task. They do not measure the agent’s elapsed runtime, uninterrupted autonomy, or guaranteed success on an arbitrary task of that duration. Human durations include measured baselines and estimates, and conclusions depend on the selected task distribution.

As of September 27, 2026, METR labels Time Horizon 1.1 the current suite. Released January 29, 2026, it expanded the suite from 170 to 228 tasks and moved evaluation infrastructure from Vivaria to Inspect. The tasks emphasize software and research work. Confidence intervals use hierarchical resampling over task families, tasks, and attempts.

Report the suite and analysis revision, success threshold, harness, and uncertainty. In March 2026, METR corrected a regularization mistake in its analysis, which changed the published estimates. Its current dashboard warns that horizons above 16 human-hours are unreliable with the available task suite. Treat the horizon as a fitted, workload-dependent estimate.

Sources: [Current methodology and dashboard](https://metr.org/time-horizons/) · [Time Horizon 1.1 release](https://metr.org/blog/2026-1-29-time-horizon-1-1/) · [Analysis assumptions and correction](https://metr.org/notes/2026-03-20-impact-of-modelling-assumptions-on-time-horizon-results/) · [Interpretation limits](https://metr.org/notes/2026-01-22-time-horizon-limitations/).

## Designing an evaluation for your agent

Begin with the work you want the agent to perform, then choose tasks and graders that test it. A benchmark from this directory can provide a useful external comparison, but your own workload may require different inputs, tools, permissions, and completion checks.

1. **Define the unit of success.** State the requested outcome, permitted actions, and unacceptable side effects. For a file-editing agent, inspect the saved file; for a database agent, inspect the resulting records. Evaluate policy compliance separately when a correct final state cannot establish it.
2. **Validate tasks and graders.** Confirm that tasks are solvable from the supplied information and tools. Check whether the grader accepts incorrect outcomes or rejects valid alternatives. Keep hidden tests and evaluator state outside the agent’s writable environment. The [Agentic Benchmark Checklist](https://arxiv.org/abs/2507.02825) examines task validity and outcome validity.
3. **Match the holdout to the claim.** Tune on development tasks, then freeze the evaluation set and configuration. If claiming transfer to new repositories, customers, or task templates, hold out those groups instead of only random examples from groups already seen. Keep a regression suite of previously supported tasks alongside tests of new capabilities.
4. **Control the comparison.** Hold tasks, starting states, tool access, stopping rules, and resource limits fixed. If evaluating a model change, keep the harness fixed; if comparing complete systems, name the differences. Declare how infrastructure failures and retries count before running the comparison.
5. **Repeat and inspect.** Preserve task-level results, use [paired comparisons and appropriate uncertainty estimates](#uncertainty), and inspect both passes and failures. Record any human intervention. Debug with development traces; repeated tuning on the final test set turns it into another development set.

### Separate contamination from exploitation of the evaluator

**Training exposure.** A public task or solution may have appeared in model training. Record release dates and known exposure; a date after a claimed cutoff reduces one risk but does not establish absence from all later training or tuning.

**Solution access during the run.** A browsing agent may retrieve a published answer, patch, or walkthrough. This can occur even when the task was absent from training. **Grader gaming.** An agent may satisfy or alter a check without meeting the intended requirement. These are separate failure modes in [NIST’s evaluation audit](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations), and require different controls.

Define which information is allowed, preserve the tool access the real task needs, and protect reference solutions and grader assets. Review suspicious successes instead of inferring integrity from a high score. If the benchmark or scorer changes, rerun compared systems under the same revision; a corrected score and an old score are different measurements.

### Use the trace to decide what to change

First check whether the task, environment, and grader are valid. Then inspect the evidence for the agent’s failure: missing information, a wrong plan, lost context, a malformed tool call, a failed handoff, or premature stopping. Preserve tool errors and timestamps; a model’s explanation of its own mistake is not a causal diagnosis.

Test the suspected cause with a controlled intervention. For example, supply a missing fact or correct one tool result while keeping the remaining setup fixed, then repeat trials. Improvement supports that explanation but may depend on the task and intervention. The [course readings](../readings.html) develop this distinction between scoring an outcome and attributing a failure.

## What to report

A result should carry enough information for someone else to interpret and reproduce the comparison. Include the following with each experiment.

* **Task set.** Benchmark, release or snapshot, split, task count, exclusions, and any changes to the original tasks.
* **System.** Model version, prompts, harness revision, memory policy, decoding settings, observation format, permitted tools, and environment versions.
* **Budget.** Time, tokens, steps, tool calls, parallelism, retries, and any human help. State which limits are per attempt and which cover the whole task.
* **Grading.** Evaluator version, completion criteria, answer normalization, judge model or human rubric, and handling of ties, timeouts, and infrastructure failures.
* **Results.** Numerator and denominator, trials per task, aggregation weights, paired gains and regressions, uncertainty estimate, and task-type breakdowns. Name pass@k or passk when applicable. Separate outcome success, policy violations, and any combined success criterion.
* **Resources and diagnosis.** Runtime cost including failures, cost per attempted and successful task trial, latency distribution, token and tool usage, human intervention, and representative failure traces. Report evaluation-only grading cost separately.

For the course discussion of verifiers, benchmark validity, failure attribution, and cost-effective design, continue with the [course readings](../readings.html).

[Explore the benchmark directory ↓](#directory)

## Text prediction and reading comprehension

These benchmarks ask whether a model can predict text or recover an answer from supplied context.

### 1. Penn Treebank (PTB): how well does a model predict the next word?

The Penn Treebank began as a linguistically annotated corpus in 1993. In language-model evaluation, “PTB” usually refers to a processed text split, especially Wall Street Journal material, used for next-word prediction. The model receives a prefix and assigns probabilities to possible next words.

#### Representative task

> Given the prefix “The company reported a rise in quarterly”, assign a probability to the next word, “earnings”.

Evaluation repeats this operation throughout the held-out text. The model is judged on its probability assignments, including words that are not its highest-ranked prediction; it need not generate a complete answer.

#### Scoring

The principal metric is perplexity: the exponential of average negative log-likelihood. Lower is better. A confidently wrong prediction is penalized more than a less confident error. Compare perplexities only under compatible tokenization and preprocessing conventions.

#### What it measures

PTB tests statistical prediction within a small, narrow text domain. Its historical value is a shared language-modeling setup. Strong performance does not establish instruction following, factual reliability, or tool use, and preprocessing can remove features present in natural documents.

Sources: [Penn Treebank paper](https://aclanthology.org/J93-2004/).

### 2. WikiText: can a model use article context to predict text?

WikiText (2016) evaluates language modeling on Wikipedia articles. Compared with commonly used processed PTB data, it retains more natural document structure, punctuation, capitalization, and vocabulary. WikiText-2 and WikiText-103 provide different dataset scales.

#### Representative task

> An article introduces an astronomer named Mira Chen. Later it reads, “The observatory appointed Mira”. Predict the next token using the available article context.

The earlier mention can make the surname easier to predict. Evaluation nevertheless covers the article’s tokens generally, rather than selecting only questions about names or distant references. The amount of preceding text available to the model is part of the evaluation setup.

#### Scoring

Perplexity summarizes the probabilities assigned to the observed test text; lower is better. The dataset version, tokenization, preprocessing, and context handling matter when comparing results. Perplexity is not the fraction of generated sentences that are correct.

#### What it measures

Preserved article context supports studying longer dependencies and rare-word prediction. Good Wikipedia prediction does not directly establish the ability to follow instructions, verify claims, or complete an external task.

Sources: [WikiText paper](https://arxiv.org/abs/1609.07843).

### 3. LAMBADA: can a model recover a word from broader context?

LAMBADA (2016) asks a model to predict the final word of a passage. Examples were selected so humans could infer that word from the whole passage but struggled when shown only its final sentence.

#### Representative task

> Mara lent her violin to Joel for the concert. Afterward, Joel returned the instrument to its owner. The violin belonged to \_\_\_.

The intended answer is “Mara”. The final sentence alone leaves the owner unspecified; the earlier sentences supply the relationship needed to fill the blank. This is a text-completion problem, with no search or environment interaction required.

#### Scoring

The central metric is final-word prediction accuracy. Likelihood-based evaluations also exist, so a reported result should identify the metric and answer-generation protocol. Selecting the correct word and assigning it high probability are related but different measurements.

#### What it measures

LAMBADA makes use of discourse context measurable through a simple output. Its scope remains narrow: recovering one word does not establish the ability to summarize a document, answer arbitrary questions about it, or maintain information across a long interactive session.

Sources: [LAMBADA paper](https://arxiv.org/abs/1606.06031).

### 4. SQuAD: can a model extract an answer from supplied evidence?

SQuAD (2016) supplies a Wikipedia passage and a question. The system selects the passage span that answers the question. SQuAD 2.0 (2018) also includes questions that cannot be answered from the supplied passage.

#### Representative task

> Passage: “The Northbridge Museum opened in 1987 and expanded its east wing in 2004.” Question: In what year did the museum open?

The answer is the span “1987”. If a SQuAD 2.0 question instead asks who designed the building, this passage provides no answer: the system should abstain rather than supply outside knowledge or invent a name.

#### Scoring

Exact match checks agreement with a normalized reference answer. Token-level F1 gives partial credit for overlapping answer tokens. The original benchmark assumes an answer exists; SQuAD 2.0 additionally evaluates whether the system recognizes unanswerable questions.

#### What it measures

SQuAD tests reading comprehension and answer extraction when evidence is already provided. It does not require finding the passage on the web. Its original span-extraction format also does not test the quality of a freely composed explanation.

Sources: [SQuAD paper](https://arxiv.org/abs/1606.05250) · [SQuAD 2.0 paper](https://arxiv.org/abs/1806.03822).

[Back to benchmark directory ↑](#directory)

## Language understanding and commonsense

These suites broaden the task mix and try to reduce success from shallow textual shortcuts.

### 5. GLUE: does a language representation transfer across text tasks?

GLUE (2018) combines nine tasks covering grammatical acceptability, sentiment, paraphrase detection, semantic similarity, entailment, and related sentence-understanding problems. Historically, models learned a shared language representation and then adapted it to each task.

#### Representative task

> Premise: “A researcher is presenting a poster at a conference.” Hypothesis: “Someone is presenting research.” Does the premise entail the hypothesis?

This illustrates an entailment component. Other components may ask for a sentiment label or a similarity score, so one example does not describe the entire suite. Evaluation must use each task’s own input format and labels.

#### Scoring

Each task retains its own metric, such as accuracy, F1, correlation, or Matthews correlation. GLUE aggregates these task scores. The result is a composite, not the percentage of all questions answered correctly; per-task results make differences between models easier to interpret.

#### What it measures

GLUE supports comparison of transfer learning across a fixed collection of short-text problems. A high aggregate can conceal weaknesses on particular tasks and does not establish unrestricted language understanding, sustained conversation, or interaction with external tools.

Sources: [GLUE paper](https://arxiv.org/abs/1804.07461).

### 6. SuperGLUE: can a model handle harder contextual language tasks?

SuperGLUE (2019) followed rapid progress on GLUE with eight harder tasks: BoolQ, CB, COPA, MultiRC, ReCoRD, RTE, WiC, and WSC. They cover reading comprehension, entailment, plausible causes and effects, entity completion, word meaning, and reference resolution.

#### Representative task

> “They rested on the river bank.” “She deposited money at the bank.” Does “bank” have the same meaning in both sentences?

The answer is no. This illustrates WiC, one component of the suite. Other components have different structures, including passage questions with multiple correct answers; SuperGLUE is not a single collection of word-sense questions.

#### Scoring

The benchmark averages task scores, first combining multiple metrics within a task where necessary. Report the aggregate alongside task-level results when diagnosing progress. A composite score is not a homogeneous success rate over all examples.

#### What it measures

SuperGLUE places greater pressure on contextual reasoning and learning from limited labeled examples than its predecessor. Success remains bounded by these task formats. It does not demonstrate sustained conversation, reliable planning, or the ability to act through external tools.

Sources: [SuperGLUE paper](https://arxiv.org/abs/1905.00537).

### 7. HellaSwag: can a model choose a plausible next event?

HellaSwag (2019) supplies a description of an everyday situation and asks the model to choose its most plausible continuation from four options. Incorrect continuations were machine-generated and selected through adversarial filtering to reduce easy stylistic clues.

#### Representative task

> A person cracks eggs into a bowl, mixes them, and heats a frying pan. Which continuation fits: pour the mixture into the pan; put the pan inside the bowl; sweep the eggs off the ceiling; or fold the pan into a napkin?

The first option is the sensible continuation. This simplified example shows the input format; actual filtered distractors are intended to be harder to reject than these obvious alternatives.

#### Scoring

The metric is multiple-choice accuracy: did the system select the designated continuation? It does not grade a freely generated plan or observe whether an action was successfully performed.

#### What it measures

HellaSwag probes commonsense expectations about events and physical activities, while trying to reduce superficial answer-selection shortcuts. It remains a textual recognition task. Choosing a plausible next event does not demonstrate execution, recovery from unexpected events, or control of a physical environment.

Sources: [HellaSwag paper](https://arxiv.org/abs/1905.07830).

### 8. WinoGrande: can a model resolve a reference using context?

WinoGrande (2019) contains roughly 44,000 sentence-completion problems inspired by the Winograd Schema Challenge. The model chooses one of two entities to fill a blank. Crowdsourcing and adversarial filtering aim to reduce exploitable word associations.

#### Representative task

> The storage box could not hold the sculpture because the \_\_\_ was too small. Choose: storage box or sculpture.

The intended choice is “storage box”. Replacing “small” with “large” changes which entity explains the failed fit. The relevant relation among the objects and the adjective matters more than simply identifying a noun mentioned nearby.

#### Scoring

Modern evaluations commonly report accuracy on the binary choice. The original work also examined performance at different training-data sizes. A comparison should identify the split and training or prompting setup rather than assume every WinoGrande result uses the same protocol.

#### What it measures

WinoGrande tests sensitivity to context and commonsense relationships in short sentences. Binary choice permits guessing, and adversarial filtering does not guarantee removal of every dataset regularity. Success on these completions does not establish reliable reference tracking throughout long conversations or documents.

Sources: [WinoGrande paper](https://arxiv.org/abs/1907.10641).

[Back to benchmark directory ↑](#directory)

## Knowledge, reasoning, mathematics, and code

These benchmarks probe subject knowledge, problem solving, and executable code. HELM adds a framework for evaluating several dimensions together.

### 9. AI2 ARC: can a model answer school science questions?

The AI2 Reasoning Challenge (2018) contains 7,787 school science questions, generally presented as multiple choice. It has Easy and Challenge partitions. Challenge contains questions that both a retrieval baseline and a word-co-occurrence baseline answered incorrectly.

#### Representative task

> Two identical wet towels are placed in the same warm room. One is spread out; the other remains folded. Which is likely to dry faster, and which listed explanation accounts for the difference?

A supplied option pairs the spread-out towel with greater exposed surface area. The model must select among candidate answers, potentially connecting scientific facts instead of retrieving a sentence that states the solution verbatim.

#### Scoring

Evaluation generally reports answer accuracy. Results should identify the partition used. “Challenge” describes difficulty relative to the original filtering baselines, rather than a permanent difficulty level for every later model.

#### What it measures

AI2 ARC probes scientific knowledge and reasoning in an exam format. Multiple-choice options provide clues and permit guessing. It is unrelated to the ARC-AGI benchmark family: the shared acronym does not imply a common task, grader, or lineage.

Sources: [AI2 ARC paper](https://arxiv.org/abs/1803.05457).

### 10. MMLU: how broad is a model’s subject knowledge?

MMLU (2020) evaluates knowledge and problem solving across 57 subjects, including mathematics, computer science, history, medicine, law, and philosophy. Questions generally have four answer choices. The model may receive demonstrations showing the expected answer format.

#### Representative task

> A program uses a queue to process pending jobs. Which policy removes the earliest-added job first: FIFO, LIFO, random selection, or priority by job name?

The answer is FIFO. This illustrates one computer-science question, not the difficulty or content of every subject. Other questions require different kinds of factual knowledge or multi-step reasoning.

#### Scoring

Evaluation reports answer accuracy, commonly aggregated across subjects. State the prompting and aggregation protocol; a broad headline score is easier to interpret with a breakdown showing which subjects improved or remained weak.

#### What it measures

MMLU’s contribution is breadth: it assesses one model across many academic and professional domains. An aggregate can hide uneven performance. Recognizing the correct option in a professional exam question is different from carrying out professional work, gathering evidence, or taking responsibility for a real decision.

Sources: [MMLU paper](https://arxiv.org/abs/2009.03300).

### 11. BIG-bench: which capabilities appear across a diverse task suite?

BIG-bench (2022) is a collaboratively assembled suite containing 204 tasks in the original paper. Its tasks span logic, linguistic phenomena, mathematics, social reasoning, factual knowledge, and other capabilities beyond conventional NLP evaluations.

#### Representative task

> In this fictional world, every silver object floats and no floating object fits inside the red box. A key is silver. Can that key fit inside the red box?

The answer follows from the supplied rules. This illustrates a logical-reasoning problem; other BIG-bench tasks use different instructions, outputs, and success criteria. The suite is not simply one large multiple-choice exam.

#### Scoring

The metric depends on the task and its output format. A comparison must identify the tasks and aggregation used. Combining heterogeneous results can be useful for an overview, but the resulting number is not a universal percentage of successful reasoning.

#### What it measures

BIG-bench supports studying how different capabilities vary across models and model scales. Its diversity also complicates interpretation: an aggregate can obscure gains on one task and failures on another. Task-level analysis is necessary to explain what changed.

Sources: [BIG-bench paper](https://arxiv.org/abs/2206.04615).

### 12. BIG-Bench Hard (BBH): does step-by-step prompting improve difficult reasoning?

BBH (2022) selects 23 BIG-bench tasks on which the evaluated language models had not surpassed the average human baseline. Tasks include tracking shuffled objects, reasoning about dates, interpreting Boolean expressions, and applying logical constraints.

#### Representative task

> Ava holds a red token, Ben a blue token, and Chen a green token. Ava swaps with Ben; then Ben swaps with Chen. Who now holds the red token?

The answer is Chen. A model can answer directly or track the token after each swap before producing its final answer. These are different prompting conditions even though the underlying problem is unchanged.

#### Scoring

The final answer is evaluated using task-appropriate matching or accuracy. BBH became closely associated with comparing direct answering against chain-of-thought prompting, so a score should identify that protocol. Producing intermediate reasoning does not itself earn credit for a wrong final answer.

#### What it measures

BBH probes several constrained reasoning skills and their sensitivity to prompting. “Hard” refers to the selection criteria at introduction, not permanent difficulty. The tasks do not require acting in an external environment or recovering from tool failures.

Sources: [BBH paper](https://arxiv.org/abs/2210.09261).

### 13. GSM8K: can a model solve a multi-step arithmetic story?

GSM8K (2021) contains grade-school mathematics word problems: 7,473 training problems and 1,319 test problems in the released splits. The mathematics is elementary, but a solution usually requires connecting several steps.

#### Representative task

> Nia has $30. She buys three notebooks costing $4 each and receives a $2 discount on the total purchase. How much money remains?

The notebooks cost $12 before the discount and $10 afterward, leaving $20. The model must translate the story into operations and preserve the meaning of intermediate quantities. A fluent explanation can still make a computational mistake.

#### Scoring

The usual metric is final-answer accuracy; that headline score does not normally require a correct explanation. Test accuracy uses the evaluated test split, not the combined training and test count. Report prompting, repeated sampling, and any calculator or code access.

#### What it measures

GSM8K supports studying reasoning prompts, answer verifiers, and repeated sampling in a restricted mathematical domain. Tool access changes the system being evaluated. Strong arithmetic-story performance does not establish competence in advanced mathematics or verify the soundness of every reasoning step.

Sources: [GSM8K paper](https://arxiv.org/abs/2110.14168) · [Released dataset and splits](https://huggingface.co/datasets/openai/gsm8k).

### 14. MATH: can a model solve competition mathematics problems?

MATH (2021) contains 12,500 competition mathematics problems with worked solutions: 7,500 training problems and 5,000 test problems. It covers algebra, geometry, counting, probability, number theory, and other areas at different difficulty levels.

#### Representative task

> Two numbers satisfy x + y = 7 and xy = 10. Find x2 + y2.

Recognizing the identity (x + y)2 − 2xy gives 29 without solving for each number. This deliberately small example illustrates choosing a useful mathematical structure; the collection includes substantially more demanding problems.

#### Scoring

Standard evaluations primarily check the final answer against a reference, with normalization or equivalence handling depending on the evaluator. Identify the evaluated subset: the full 5,000-problem test split and MATH-500 are different test sets. Also report the answering and tool-use protocol.

#### What it measures

Compared with elementary arithmetic stories, MATH places more emphasis on selecting techniques and manipulating symbolic expressions. A correct final answer is not a verified proof that every reasoning step was sound. Aggregate accuracy can also conceal large differences across topics and difficulty levels.

Sources: [MATH paper](https://arxiv.org/abs/2103.03874).

### 15. HumanEval: does generated code behave correctly?

HumanEval (2021) contains 164 Python programming problems. The model receives a function signature and a natural-language specification, then generates an implementation. The evaluator executes the code against tests.

#### Representative task

> Implement `first_unique(values)`, returning the first value that occurs exactly once, or `None` if no such value exists.

1. Read the signature and specification, including behavior for an empty input.
2. Generate a function body.
3. Execute the candidate against tests covering ordinary cases, duplicates, and boundary cases.

#### Scoring

The characteristic metric is pass@k: the probability that at least one of k generated candidates passes the tests. For k > 1, this gives multiple opportunities; pass@1 measures single-attempt success. Functional behavior matters, rather than textual similarity to a reference program.

#### What it measures

HumanEval established executable evaluation for code generation. Passing finite tests does not prove correctness on every possible input. Its small, isolated functions also omit repository navigation, dependency management, and maintenance of a large application. Report sampling and execution settings when comparing systems.

Sources: [HumanEval paper](https://arxiv.org/abs/2107.03374).

### 16. HELM: what trade-offs does an accuracy-only score miss?

HELM (2022) is an evaluation framework and suite, rather than one newly collected question set. Its original core evaluation considered 16 scenarios and seven dimensions: accuracy, calibration, robustness, fairness, bias, toxicity, and efficiency, where applicable.

#### Representative task

> Given a short article and a factual question about it, produce an answer. Evaluate answer correctness alongside the applicable confidence, robustness, and efficiency measurements.

This illustrates one possible question-answering scenario. The framework coordinates evaluations across scenarios; it does not turn every dimension into an instruction that the model must explicitly answer.

#### Scoring

Each scenario uses the relevant quality and other metrics under a specified evaluation setup. Two models can have similar answer accuracy while differing in calibration, sensitivity to input perturbations, or inference cost. “HELM performance” therefore needs a version, scenario, and metric; there is no universal task-success percentage covering the whole framework.

#### What it measures

HELM makes trade-offs visible and encourages more standardized comparison. It is particularly useful for systems work because efficiency accompanies quality. Conclusions still depend on the selected scenarios and measurements, which cannot represent every deployment condition.

Sources: [HELM paper](https://arxiv.org/abs/2211.09110).

[Back to benchmark directory ↑](#directory)

## Assistant quality, instructions, and multimodal context

Truthfulness, preference, instruction compliance, and context use answer different evaluation questions. Their scores are not interchangeable.

### 17. TruthfulQA: will a model repeat a tempting misconception?

TruthfulQA (2021) probes whether models reproduce common misconceptions and plausible-sounding falsehoods. Its questions intentionally make familiar but incorrect answers tempting, testing whether a model follows misleading assumptions instead of correcting them.

#### Representative task

> A fair coin has landed tails ten times in a row. Is heads now more likely on the next independent toss?

A truthful answer rejects the idea that the coin must compensate for its earlier outcomes. This illustrates a misconception-driven question; it does not require the model to browse or conduct an experiment.

#### Scoring

The benchmark supports generated-answer evaluation and multiple-choice variants. Generative evaluation considers truthfulness and informativeness. Multiple-choice metrics assess selection or probability assigned to truthful answers. These are distinct measurements, so results should name the variant instead of treating every TruthfulQA score as the same accuracy statistic.

#### What it measures

TruthfulQA targets the failure mode of imitating human misconceptions. Truthfulness and informative answering both matter: avoiding a false claim is different from answering the question usefully. The benchmark is not a complete measure of factual accuracy, source grounding, or hallucination across arbitrary topics and tasks.

Sources: [TruthfulQA paper](https://arxiv.org/abs/2109.07958).

### 18. MT-Bench: can an assistant answer a request and its follow-up?

MT-Bench (2023) contains 80 two-turn conversations across categories including writing, reasoning, coding, mathematics, extraction, and role-play. The follow-up may depend on the assistant’s previous response.

#### Representative task

> First turn: Draft a short invitation to a neighborhood science fair. Follow-up: Rewrite that invitation for parents of young children, keeping the event details unchanged.

1. The assistant answers the initial request.
2. It receives the follow-up with the conversation history and responds again.
3. A strong language model judges the response quality under the evaluation rubric.

#### Scoring

The judge commonly assigns scores on a 1-10 scale. These are quality judgments, not exact-answer checks or percentages of tasks completed. The judging model and protocol are part of the measurement and should accompany the result.

#### What it measures

MT-Bench captures some conversational continuity and open-ended usefulness that multiple-choice tests miss. Its limits include a small fixed prompt set and judge biases involving verbosity, style, and answer position in comparisons. Two-turn competence says relatively little about coherence over a long session or reliable tool execution.

Sources: [MT-Bench and Arena paper](https://arxiv.org/abs/2306.05685).

### 19. Chatbot Arena: which assistant response do users prefer?

Chatbot Arena launched in 2023. A user sees responses from two anonymously selected models and indicates which they prefer, with ties or equivalent options depending on the interface. Prompts come from users rather than one fixed examination.

#### Representative task

> Explain recursion to a beginning programmer using a small example and no advanced mathematical notation.

1. Two models answer the same user request without revealing their identities.
2. The user compares the responses and casts a preference vote.
3. The evaluation aggregates many such comparisons into relative ratings or preference estimates.

#### Scoring

Ratings depend on the comparison data and statistical procedure. A rating is not a percentage of questions answered correctly or tasks completed. Its interpretation also depends on which models, users, and prompts are represented in the comparisons.

#### What it measures

Arena measures preference under its participating users and prompt distribution. That captures aspects of usefulness that fixed answer keys miss, but it does not directly verify factual accuracy or task completion. A polished response may receive a preference vote even when it is technically weaker.

Sources: [Chatbot Arena launch](https://lmsys.org/blog/2023-05-03-arena/).

### 20. AlpacaEval: does an automated judge prefer the candidate assistant?

AlpacaEval (2023) automates pairwise evaluation of instruction-following responses. A candidate model and a reference model answer a fixed instruction set; an LLM judge selects the preferred response.

#### Representative task

> Write a friendly welcome message for new members of a community garden, explaining how to join the next volunteer session.

The candidate and reference each produce a message. The judge compares their responses under its instructions; there is no single correct welcome message or programmatic task-completion check.

#### Scoring

Raw win rate measures observed preference against the reference, subject to tie handling. A raw 60% means the candidate was favored in roughly that fraction of comparisons. The length-controlled score instead estimates preference after statistically adjusting for response length; it is not the observed fraction of wins. Neither score is an answer-correctness rate.

#### What it measures

AlpacaEval supports inexpensive iteration on assistant behavior, but inherits judge biases and represents mostly single-turn requests. Versions change the reference model and judging setup. Report the version, reference, judge, and whether the metric is raw or length-controlled before comparing results.

Sources: [AlpacaEval repository](https://github.com/tatsu-lab/alpaca_eval) · [Length-controlled evaluation paper](https://arxiv.org/abs/2404.04475).

### 21. IFEval: does an answer obey instructions that code can check?

IFEval (2023) evaluates objectively checkable instructions, such as using a required keyword, producing a specified number of sections, or satisfying a length constraint. A normal request can contain several such requirements.

#### Representative task

> Explain how rain forms in exactly three bullet points. Use the word “cloud” at least twice.

The model produces its response, then programmatic checkers inspect the bullet count and required word frequency. A response can satisfy one instruction and violate another, even if its explanation otherwise seems helpful.

#### Scoring

IFEval reports instruction-level and prompt-level accuracy, each with strict and loose checking. Instruction-level scores evaluate individual constraints; prompt-level success requires satisfying every checked instruction in the prompt. Loose checking permits selected response transformations to reduce false negatives, so strict and loose scores should remain distinguishable.

#### What it measures

Programmatic checks make this slice of instruction following more reproducible than asking a judge for a general impression. However, passing the formatting and keyword checks does not establish that the rain explanation is correct, clear, or complete. The benchmark covers measurable constraints, not every possible natural-language instruction.

Sources: [IFEval paper](https://arxiv.org/abs/2311.07911).

### 22. LongBench: can a model use information spread across a long input?

Original LongBench (2023) contains 21 datasets across six task categories in English and Chinese: single-document QA, multi-document QA, summarization, few-shot learning, synthetic tasks, and code completion.

#### Representative task

> Several supplied project reports discuss a delayed launch. One identifies a supplier change; another records a revised deadline. According to those reports, what changed and when was the new launch scheduled?

This illustrates multi-document question answering. The evidence is supplied in the input, potentially far apart. The model does not need to discover the documents through browsing. Other categories require different outputs, such as a summary or code continuation.

#### Scoring

Metrics depend on the task, including answer F1, ROUGE, accuracy, and code similarity. An aggregate combines different measurements; it is not a single homogeneous success percentage. Report the datasets and context-handling setup used.

#### What it measures

LongBench distinguishes accepting a long input from using its contents effectively. Aggregate results can hide degradation on particular tasks. The original benchmark’s input lengths should not be confused with exhaustive testing of today’s largest advertised context windows or persistent memory across sessions.

Sources: [LongBench paper](https://arxiv.org/abs/2308.14508).

### 23. MMMU: can a model combine visual evidence with subject knowledge?

MMMU (2023) combines text and images in approximately 11,500 questions across 30 subjects. Visual inputs include charts, diagrams, chemical structures, maps, tables, and other domain-specific material. Questions use multiple-choice and open-ended formats.

#### Representative task

> An accompanying circuit diagram shows a battery, two resistors, and a switch. Which listed expression gives the equivalent resistance after the switch closes?

The model must interpret the diagram’s connections and apply the relevant electrical principle. A text-only description of the task cannot substitute for inspecting the image when the topology is shown only there.

#### Scoring

Evaluation scores answer correctness using the question’s answer format. A correct multiple-choice selection or accepted open-ended answer receives credit; the headline score does not separately certify perception, domain knowledge, and reasoning. Identify the evaluated split and protocol.

#### What it measures

MMMU extends multimodal evaluation beyond simple image recognition toward college-level subject reasoning. When an answer is wrong, accuracy alone cannot locate the cause. Some questions also contain enough textual information to weaken the need to use the image, so a high score does not prove equally strong visual reasoning on every item.

Sources: [MMMU paper](https://arxiv.org/abs/2311.16502).

[Back to benchmark directory ↑](#directory)

## Interactive agents and task completion

The evaluated system now acts in an environment. Tools, observations, state changes, and the control loop become part of the benchmark result.

### 24. AgentBench: can an agent act across different kinds of environments?

AgentBench, introduced in 2023, is a historical suite of eight environments: operating systems, databases, knowledge graphs, a digital card game, lateral-thinking puzzles, household tasks, web shopping, and web browsing. The household, shopping, and browsing settings adapt ALFWorld, WebShop, and Mind2Web. Each environment supplies its own observations, actions, termination rules, and grader.

#### Representative task

> In a prepared database, find the customers whose combined purchases exceed a specified amount and return their identifiers.

```
Reset:   Load the task's database snapshot and instruction.
Observe: Read the available database interface.
Act:     Inspect table names and column definitions.
Observe: customers(id, name), orders(customer_id, amount)
Act:     Run a grouped SQL query with the requested threshold.
Observe: Inspect returned rows; repair the query if needed.
Finish:  Submit the customer identifiers in the required format.
Check:   Apply the database task's evaluator.
```

The database interaction is one example. In the operating-system environment, actions are shell commands; in shopping, they select searches and products. An agent must interpret feedback and choose a next step appropriate to that interface.

#### Scoring

The original metrics differ: operating-system, database, and household tasks use success rate; knowledge-graph questions use answer F1; card-game and shopping tasks use reward; puzzles use game progress; browsing uses step success rate. The overall score rescales each environment using fixed weights derived from the reciprocal historical mean performance of the evaluated models, then averages. It is not a percentage of complete workflows solved.

#### What it measures

AgentBench exposes whether a system can follow an interface, use feedback, and sustain decisions over multiple turns. Category results are more diagnostic than its composite: an improvement could come from database work while browsing remains weak. Prompts, action formatting, history handling, and turn limits are part of the system being evaluated.

**Version note.** The official repository introduced AgentBench FC on October 10, 2025, with function-calling prompts and AgentRL integration for five containerized environments. It points to v0.1/v0.2 for the older suite. Pin the generation and environment set rather than treating current main as the original eight-environment experiment.

Sources: [AgentBench paper](https://arxiv.org/abs/2308.03688) · [Environment metrics and aggregate definition](https://arxiv.org/html/2308.03688v3#S4) · [Official repository and AgentBench FC update](https://github.com/THUDM/AgentBench).

### 25. WebArena: can an agent complete a website workflow?

WebArena, introduced in 2023, provides self-hosted websites with persistent application state. Its original 812 tasks cover workflows such as shopping, managing a store, editing a repository's records, and finding information. The agent receives an instruction, an initial browser state, and an observation/action interface such as an accessibility tree with clickable element identifiers.

#### Representative task

> Create an issue titled “Update onboarding documentation” in the specified project, assign it to Alex, and add the documentation label.

```
Reset:   Restore the site's task state and account login.
Observe: Open the start page and inspect its accessibility tree.
Act:     click [target project]
Observe: Read the project's available links and controls.
Act:     click [new issue]
Act:     type [title field] [Update onboarding documentation]
Act:     select [assignee] [Alex]; select [label] [documentation]
Act:     click [create issue]; stop
Check:   Evaluate the task's required issue properties.
```

The control names here stand for elements identified from observations. A different valid navigation path can reach the same result. Repeatedly clicking a familiar location without checking the updated page can instead edit the wrong project or miss an unsaved field.

#### Scoring

Original WebArena evaluates functional completion with task-specific checks over submitted answers, URLs, or website content and state. Some checks inspect intermediate states; some answer checks use semantic matching. It is therefore not uniformly a final-database or exact-string evaluator. The headline metric is task success rate, rather than similarity to a reference click sequence.

#### What it measures

This tests navigation, grounding actions in page elements, tracking instructions, and producing an intended web result. Controlled sites support reproducible experiments, but cover a limited set of applications. Report the browser representation, permitted actions, resets, and action budget; a richer observation interface can change the difficulty.

**Verified extension.** ServiceNow's WebArena-Verified audits tasks and references and replaces model-judge and substring checks with deterministic, type-aware evaluation of structured responses and captured network traces. It provides all 812 tasks and a 258-task Hard subset. Label original, Verified, and Verified Hard separately, including dataset and evaluator revisions; a changed grader changes the meaning of a pass.

Sources: [WebArena paper](https://arxiv.org/abs/2307.13854) · [WebArena-Verified repository and protocol](https://github.com/ServiceNow/webarena-verified).

### 26. GAIA: can an assistant research a question and return the right answer?

GAIA, introduced in 2023, contains 466 questions that require combinations of reasoning, browsing, file handling, images, and computation. Questions have three difficulty levels, and some provide attachments. The target is usually a short, verifiable answer even when obtaining it requires a substantial tool-use workflow.

#### Representative task

> An attached spreadsheet lists films. Find the film matching two conditions, identify its director, and report the director's birthplace.

```
Receive: Question and spreadsheet attachment.
Observe: Read the sheet's columns and candidate rows.
Act:     Filter rows using the two stated conditions.
Observe: Identify the matching film and its director.
Act:     Search for a reliable biographical source.
Observe: Find and cross-check the birthplace.
Finish:  Return the requested place name, without extra prose.
Check:   Match the final answer against the reference.
```

GAIA does not prescribe one canonical sequence. One system might write a script to filter the file; another might inspect it through a document tool. The tools, retrieval strategy, and loop that connects those steps belong to the submitted assistant system.

#### Scoring

The official scorer checks the final answer using type-dependent normalization. Numeric references are compared as numbers after specified formatting cleanup. Strings are normalized for case, whitespace, and punctuation. Comma- or semicolon-separated lists require the correct length and element order, with element-specific comparison. Overall and per-level accuracy report the fraction matched; a plausible explanation does not compensate for an incorrect answer.

#### What it measures

GAIA tests whether an assistant can combine ordinary capabilities into a successful information-gathering workflow. Its answer score gives limited evidence about source quality, unnecessary actions, cost, or fragile intermediate reasoning. Record the tool stack, scaffold, access to the web, and budget, and inspect trajectories separately when those properties matter.

**Gaia2.** The 2025 ARE release and 2026 Gaia2 benchmark paper move to simulated applications in Meta's Agents Research Environments. Events arrive while the agent works, introducing time-sensitive actions, ambiguity, and collaboration. Write-action verifiers inspect consequential actions. Pin the scenario split and environment timing; these results are distinct from original GAIA answer accuracy.

Sources: [GAIA paper](https://arxiv.org/abs/2311.12983) · [Official answer scorer](https://huggingface.co/spaces/gaia-benchmark/leaderboard/blob/main/scorer.py) · [ARE release paper](https://arxiv.org/abs/2509.17158) · [Gaia2 paper](https://arxiv.org/abs/2602.11964) · [Current ARE repository and Gaia2 extensions](https://github.com/facebookresearch/meta-agents-research-environments).

### 27. BrowseComp: can it find an obscure answer on the web?

BrowseComp, introduced in 2025, contains 1,266 difficult information-search questions with short, relatively unambiguous answers. Several clues can make discovering the answer difficult while making a proposed answer comparatively easy to verify.

#### Representative task

> Find the exhibition whose curator previously worked at a specified museum, whose opening followed a particular restoration, and whose catalog includes an essay by a named researcher. Return the exhibition title.

1. Receive the question and the configured browsing tools.
2. Search for candidate exhibitions and open relevant sources.
3. Cross-check each clue, reject mismatches, and reformulate queries.
4. Return the concise final answer before the budget expires.

Different search paths can reach the same correct answer; the benchmark does not prescribe one reference sequence of queries or page visits.

#### Scoring

An LLM grader checks whether the final answer is semantically equivalent to the reference answer. Report answer accuracy together with the search infrastructure, model and harness, resource budget, and number of attempts. Those choices affect how much evidence the agent can gather.

#### What it measures

BrowseComp tests persistent search and the ability to combine obscure clues. The headline score does not comprehensively evaluate a research report: citation completeness, long-form synthesis, and usefulness to a particular user receive little direct coverage. A correct short answer also does not establish that the intermediate search was efficient or that every claim in the agent’s explanation was supported.

Sources: [BrowseComp paper](https://arxiv.org/abs/2504.12516).

### 28. SWE-bench: can an agent repair a repository issue without breaking tested behavior?

Original SWE-bench, introduced in 2023, contains 2,294 issues from 12 Python repositories. A system receives an issue description and the repository at a specified earlier commit, then produces a patch. The benchmark specifies the repair problem and evaluator; the agent's search, editing, testing, and candidate-selection strategy are part of its scaffold.

#### Representative task

> A library raises an exception for an empty index. Make that case return an empty result while preserving existing behavior.

```
Reset:   Prepare the repository at the task's base commit.
Observe: Read the issue and inspect relevant code with rg.
Act:     Reproduce the empty-index failure.
Act:     Edit the implementation and run available local tests.
Observe: Inspect failures and revise the patch as needed.
Finish:  Submit the final diff.
Check:   Apply the patch in the evaluation environment.
Check:   Run the designated repair and regression tests.
```

#### Scoring

`FAIL_TO_PASS` tests must change from failing to passing; `PASS_TO_PASS` tests must remain passing. In the original Python setting, full resolution requires all designated checks in both groups to pass. The headline result is the percentage of fully resolved instances. Partial repair does not count as full resolution, and the patch need not resemble the human fix.

#### What it measures

SWE-bench tests repository understanding and executable repair beyond isolated function synthesis. Tests remain incomplete specifications and do not cover all engineering work. Name the subset, harness, budget, attempts, and selection method. Official variants include Lite, the 500-instance human-validated Verified subset, Multilingual, and Multimodal. The Verified leaderboard distinguishes a common bash-only harness from other agent submissions; hold that interface fixed when comparing models.

Sources: [SWE-bench paper](https://arxiv.org/abs/2310.06770) · [Official benchmark variants and protocols](https://www.swebench.com/) · [Resolution criteria](https://www.swebench.com/SWE-bench/api/harness/#swebench.harness.grading.get_resolution_status).

#### SWE-Bench Pro and public V2

Scale's 2025 SWE-Bench Pro is a separate benchmark for more extensive changes, with public, held-out, and commercial splits. Public V2, released September 22, 2026, contains 642 tasks across 11 repositories, replacing the original 731-task public split after task and evaluator repairs. Its locked protocol permits 50 minutes per task; agent-phase network access is restricted to the model endpoint and web-fetch tools are disabled.

The captured patch is applied to a pristine environment and graded with a clean pinned verifier. Report that result, the exact release and harness, and whether evaluation uses the full suite or HARD-51, selected from failures of particular model families. These controls reduce solution retrieval and grader manipulation, but cannot make tests a complete specification.

Sources: [SWE-Bench Pro paper](https://arxiv.org/abs/2509.16941) · [Public V2 release](https://labs.scale.com/leaderboard/swe_bench_pro_public_v2) · [Locked V2 protocol](https://github.com/scaleapi/SWE-bench_Pro-os/blob/main/v2/README.md).

### 29. Terminal-Bench: can an agent finish a task through a shell?

Terminal-Bench, first released in 2025, evaluates work in terminal-accessible environments, including software engineering, configuration, data processing, and scientific computing. Its 2.0 release contains 89 curated tasks. That historical count is not the denominator for later releases, including the 4.0.0 release checked in September 2026.

#### Representative task

> Repair a data-processing command so that it accepts the supplied input format and writes the required output file with the correct records.

```
Reset:   Build the task environment and provide its instructions.
Observe: Inspect input files, command help, source, and error logs.
Act:     Reproduce the conversion failure from the shell.
Act:     Edit code or configuration; rerun on a small example.
Observe: Inspect output and revise until local checks succeed.
Act:     Produce the requested artifact and finish.
Check:   Run the task's verifier against the resulting work.
Record:  Store the reward and execution metadata.
```

A Harbor-format task packages instructions, configuration, an environment specification, a reference solution, and verifier tests. The agent can inspect files, run commands, edit code, and install or configure components as permitted. It does not have to imitate the reference solution's command sequence.

#### Scoring

Task-specific verification tests determine whether the requested result was achieved, producing the reward used for task resolution rate. Checks may concern generated files, program behavior, or configured services. Describe the pinned task and harness when explaining verification: current Harbor supports a separate-verifier mode, but that capability alone does not establish that every task in a named Terminal-Bench release uses it.

#### What it measures

Success depends on model reasoning, tool use, debugging, the harness, and the execution environment. A shell task can extend far beyond a repository patch. Resource shortages or infrastructure failures can also affect results, so preserve their diagnostics and report CPU, memory, time, and attempt budgets. A small curated suite can move noticeably when only a few task outcomes change.

**Current release checked: 4.0.0, August 2026.** It recalibrates CPU, memory, and time limits, sets an eight-hour agent timeout per task, repairs tasks, and removes tasks for saturation, refusals, public solutions, or quality/platform issues. New runs are required. Its versioning distinguishes agent-environment changes requiring reruns, verifier changes requiring regrading, and metadata changes permitting reuse; a higher score across releases alone does not establish improvement.

Sources: [Terminal-Bench 2.0 release](https://www.tbench.ai/news/announcement-2-0) · [Terminal-Bench paper](https://arxiv.org/abs/2601.11868) · [Terminal-Bench 4.0 methodology](https://www.tbench.ai/news/terminal-bench-4-0) · [Pinned 4.0.0 release](https://github.com/harbor-framework/terminal-bench/releases/tag/v4.0.0) · [Harbor task format](https://docs.harborframework.com/core-concepts/tasks/overview) · [Separate-verifier mode](https://docs.harborframework.com/core-concepts/tasks/separate-verifier).

### 30. OSWorld: can an agent operate a computer and produce the requested result?

OSWorld, introduced in 2024, evaluates work in real desktop applications and operating-system environments. Its original 369 tasks include manipulating files, editing documents, and combining multiple applications. Each task supplies an initial-state configuration and an execution-based evaluator. Agents may receive screenshots, accessibility information, or a combination, depending on the declared setting.

#### Representative task

> Edit the supplied presentation so the specified line on slide 3 has no bullet and aligns with the reference text, then save the file.

```
Reset:   Restore the VM; place and open the task presentation.
Observe: Capture the desktop screenshot.
Act:     Select slide 3 and the target text.
Observe: Inspect the selected paragraph and formatting controls.
Act:     Remove its bullet and adjust its indentation.
Act:     Save the presentation and finish.
Check:   Retrieve the artifact and inspect the target paragraph.
Check:   Compare the required properties with the task criteria.
```

The actions above describe a screenshot-based run, not a universal required sequence. A task's configuration determines how files are initialized and which artifact or application properties the evaluator retrieves. Saving and exporting matter when the grader reads the resulting file rather than the visible screen.

#### Scoring

Task-specific programs inspect the intended outcome: for example, document contents, formatting properties, application settings, or system state. The original benchmark reports task success. Completing a plausible menu sequence is insufficient if its checked result is wrong. Conversely, accepted alternative interaction paths can receive credit when they satisfy the same evaluator.

#### What it measures

OSWorld brings visual grounding, application knowledge, action sequencing, and recovery into the evaluation. It does not isolate any one of them: a failed task may reflect a misread screen, a mistaken plan, or an unsuccessful save. Scores depend on observation modality, allowed tools, environment versions, and step limits; screenshot-only and accessibility-assisted runs need separate labels.

**Version updates.** OSWorld-Verified corrects original tasks and evaluators. OSWorld 2.0, released in June 2026, is a separate suite of 108 longer workflows, scored by binary completion and a partial score, with separate safety reports. The recommended release checked here is OSWorld 2.1, September 16, 2026: it fixes bugs and pins matching code, tasks, assets, websites, and images. Specify both generation and release rather than mixing their components or denominators.

Sources: [OSWorld paper](https://arxiv.org/abs/2404.07972) · [OSWorld-Verified](https://xlang.ai/blog/osworld-verified) · [OSWorld 2.0 paper](https://arxiv.org/abs/2606.29537) · [OSWorld 2.1 release and version matrix](https://github.com/xlang-ai/OSWorld-V2).

### 31. τ-bench: can an agent converse with a customer and complete an API workflow?

Original τ-bench, introduced in 2024, combines a simulated user, a tool-using agent, backend APIs, and domain policies in retail and airline settings. The agent must gather information through conversation and tool results. The task's hidden intent and target state guide the simulation and grading rather than being handed to the agent as a solution.

#### Representative task

> Return the specified item from a delivered order, refund the original payment method, and explain the refund amount.

```
Reset:   Load customer, order, and payment records.
User:    I want to return the blue bottle from my recent order.
Act:     Look up the customer and matching delivered orders.
Agent:   Do you mean the 1-liter bottle?
User:    Yes.
Agent:   The refund is $40 to your original card. Proceed?
User:    Please do.
Act:     Call the return API with the confirmed item and payment.
Agent:   Report completion and the required refund information.
Check:   Compare the checked database outcome and response.
```

#### Scoring

Original reward combines database-outcome and required-response-information checks. It does not grade by reproducing every reference action. Its passk metric is the probability that all k independent trials of a task succeed, averaged across tasks. That measures consistency; pass@k instead credits at least one successful attempt. Do not compute passk by raising the aggregate success rate to k.

#### What it measures

This tests dialogue, information gathering, policy interpretation, and backend work together. A correct final state does not establish that confirmation preceded an action: the original reward does not exhaustively check procedural policy compliance. Inspect each task's reward basis and distinguish its measured outcome from broader claims about safe customer service.

**Version updates.** τ²-bench (2025) adds telecom tasks with dual control: both agent and user have tools affecting shared state. τ³-bench (March 2026) adds banking knowledge retrieval and full-duplex voice, including interruptions and overlap. Report task completion separately from voice quality. A July 2026 banking-knowledge grading fix makes earlier and corrected scores incomparable; pin tasks, reward basis, simulator, and communication mode.

**Related construction task.** September 2026's ττ-Bench asks a developer agent to build a service agent from business materials, requirements, APIs, and a codebase. Held-out simulated users evaluate the resulting agent, shifting the tested unit from executing one episode to constructing an agent for those episodes.

Sources: [τ-bench paper](https://arxiv.org/abs/2406.12045) · [τ²-bench paper](https://arxiv.org/abs/2506.07982) · [τ³-bench release](https://sierra.ai/blog/bench-advancing-agent-benchmarking-to-knowledge-and-voice) · [Task and grading release notes](https://github.com/sierra-research/tau2-bench/blob/main/RELEASE_NOTES.md) · [Reward specification](https://github.com/sierra-research/tau2-bench/blob/main/docs/evaluation.md) · [ττ-Bench paper](https://arxiv.org/abs/2609.04611).

### 32. ARC-AGI-3: can it discover the rules while acting?

ARC-AGI-3 began with a 2025 preview and received its full release in 2026. It evaluates agents in novel interactive, game-like environments without supplying a complete natural-language description of the rules and goal.

#### Representative task

> Explore a scene containing movable objects. Discover which interactions change their behavior, infer the arrangement that completes the level, and apply the learned rule to a harder level.

```
Reset   → Start the selected environment.
Observe → Inspect the current scene and feedback.
Act     → Try an available action; observe what changes.
Repeat  → Infer rules and reuse them across levels.
Check   → Record completion and environmental actions.
```

#### Scoring

Evaluation incorporates successful completion and action efficiency relative to human baselines. Finishing after extensive trial and error is therefore different from acquiring the necessary skill quickly. Report the scoring version because normalization rules can change.

The action count concerns environmental actions. It does not directly measure internal reasoning tokens, elapsed time, or monetary cost; those require separate reporting.

#### What it measures

The benchmark tests exploration, adaptation, and learning from interaction. Observing a failed action may provide information that enables a later success, so the trajectory matters when diagnosing performance. These environments are not direct replicas of workplace tasks, and a human-normalized score is not a general percentage of human intelligence.

Sources: [ARC-AGI-3 paper](https://arxiv.org/abs/2603.24621) · [Scoring methodology](https://docs.arcprize.org/methodology) · [2025 preview](https://arcprize.org/blog/arc-agi-3-preview-30-day-learnings) · [2026 full release](https://arcprize.org/blog/arc-agi-3-launch).

[Back to benchmark directory ↑](#directory)

## Harder tasks and fresher test sets

These benchmarks respond to saturation, shortcuts, and contamination in different ways. Greater difficulty alone does not establish that a task was absent from training.

### 33. MMLU-Pro: can it reason beyond familiar exam questions?

MMLU-Pro, introduced in 2024, revises MMLU-style academic questions to demand more reasoning. It removes trivial or noisy items and expands answer sets from four toward ten options.

#### Representative task

> A chemistry question describes a change to an equilibrium system. Choose the predicted outcome from several plausible alternatives, accounting for both the reaction conditions and the stated constraint.

The model reads the question and selects an option. It may reason before answering, but the submitted choice determines correctness; there is no application state to modify or multi-step workflow to complete.

#### Scoring

The primary metric is answer accuracy. More candidate answers reduce the benefit of guessing and simple elimination. The authors also tested prompt variations and reported greater score stability than on original MMLU.

#### What it measures

MMLU-Pro tests academic knowledge and reasoning under a more demanding multiple-choice format. A correct choice does not verify the explanation that produced it. Improved question quality and difficulty also do not establish that the questions were absent from training. Report the prompting and reasoning budget alongside accuracy.

Sources: [MMLU-Pro paper](https://arxiv.org/abs/2406.01574).

### 34. LiveBench: does correctness hold on newly released questions?

LiveBench, introduced in 2024, uses regularly refreshed questions with objectively checkable answers. Its tasks cover mathematics, coding, reasoning, language, instruction following, and data analysis; some draw on recently released source material.

#### Representative task

> Using a supplied table of recent results, identify the category with the largest increase after applying the question’s filtering rule. Return the category and calculated increase in the requested format.

The model receives the task and produces an answer. The refresh process changes the questions available for evaluation; it does not mean that every individual task requires live web browsing.

#### Scoring

Task-specific evaluators compare outputs with ground truth. The aim is checkable correctness rather than a judge’s preference for one assistant response. Report the release or snapshot and the relevant task-category scores.

#### What it measures

LiveBench tests performance on a changing set of questions, reducing reliance on a single familiar test set. Scores from different snapshots may reflect different difficulty. Recent material can reduce contamination risk relative to a suitable training cutoff, but public questions do not remain permanently protected from later training or tuning.

Sources: [LiveBench paper](https://arxiv.org/abs/2406.19314).

### 35. LiveCodeBench: can it solve fresh programming problems?

LiveCodeBench, introduced in 2024, continually collects newly released programming contest problems from sources including LeetCode, AtCoder, and Codeforces. Release dates make the evaluation window an explicit part of the benchmark.

#### Representative task

> Given a sequence of delivery requests and a capacity constraint, write a program that computes the minimum number of feasible batches for every input satisfying the specification.

For code generation, the model receives a problem specification and returns a program. The evaluator executes that program on tests. The broader benchmark also includes self-repair, code execution prediction, and test-output prediction.

#### Scoring

Results use pass rates or pass@k, depending on the scenario. State the scenario, problem date window, number of candidate programs, and execution limits. A code-generation score and an execution-prediction score answer different questions.

#### What it measures

The benchmark tests algorithmic coding on newer problems and supports comparisons against declared training cutoffs. Passing finite tests is evidence of correctness on those tests. Contest programming does not directly measure repository maintenance, requirements negotiation, or the ability to operate a production service.

Sources: [LiveCodeBench paper](https://arxiv.org/abs/2403.07974).

### 36. MMMU-Pro: does it need the image to answer?

MMMU-Pro, introduced in 2024, strengthens MMMU by filtering questions that text-only models can answer, expanding candidate options, and adding a vision-only setting in which the question itself appears inside an image.

#### Representative task

> An image contains a mechanics question, a labeled force diagram, and candidate answers. Read the quantities and directions from the image, then choose the force that satisfies the stated condition.

The model must recover the question and interpret the visual evidence before answering. In the vision-only setting, a separate text transcription does not supply the question for it.

#### Scoring

Evaluation measures answer accuracy under the named input setting. A score must identify which setting was used, because a model given text alongside an image receives different evidence from one given only the image.

#### What it measures

MMMU-Pro more directly tests whether visual information contributes to the answer. Perception and reasoning remain coupled: misreading one symbol can produce the same final error as misunderstanding the concept. Answer accuracy alone cannot locate that failure, so inspect examples before attributing a gain to better reasoning.

Sources: [MMMU-Pro paper](https://arxiv.org/abs/2409.02813).

### 37. GPQA: can a model distinguish expert scientific answers from plausible distractors?

GPQA (2023) contains expert-written multiple-choice questions in physics, chemistry, and biology. The main set has 448 questions; results often use the more selectively filtered GPQA Diamond subset. Development and validation involved domain experts and skilled non-experts with web access.

#### Representative task

> A chemistry question specifies a reaction’s starting materials, catalyst, and conditions. Which of four proposed mechanisms is consistent with those details?

The model selects the scientifically supported option among plausible alternatives. This sketches the task format without reproducing the technical detail of an actual expert question. It is a static question, not an instruction to conduct the reaction.

#### Scoring

The metric is answer accuracy. Report the evaluated subset, including whether it is GPQA Diamond, and the answering or tool-use setup. A score for one subset should not silently stand in for a result on another.

#### What it measures

GPQA probes specialized knowledge and reasoning. “Google-proof” describes difficulty experienced by the non-expert validators; it does not mean internet access can never help. Selecting a difficult science answer is different from designing experiments, discovering new results, or conducting research autonomously.

Sources: [GPQA paper](https://arxiv.org/abs/2311.12022).

### 38. FrontierMath: can it solve expert-written mathematics?

FrontierMath, introduced in 2024, contains original problems written and reviewed by expert mathematicians. The problems span advanced mathematical areas and may require substantial expert effort, while retaining outputs that can be checked automatically.

#### Representative task

> A problem defines a family of mathematical objects under several constraints. Determine the exact number satisfying an additional property, and return the required integer.

A system reasons about the problem and, when permitted by the evaluation setup, may use computational tools. The final output must meet the problem’s answer requirements; a long derivation by itself is not the scored deliverable.

#### Scoring

The score is the fraction of problems solved according to the benchmark’s answer checks. State the problem set, allowed tools, attempts, and resource budget, because these define the evaluated system.

#### What it measures

FrontierMath combines difficult mathematical problem solving with verifiable answers. Its original unpublished problems address contamination concerns, but answer checking is not formal proof verification. A passing answer does not certify every intermediate argument, and success on a specified problem set does not establish autonomous mathematical research ability.

Sources: [FrontierMath paper](https://arxiv.org/abs/2411.04872).

### 39. Humanity’s Last Exam: how far does specialized academic knowledge go?

Humanity’s Last Exam (HLE), introduced in 2025, contains 2,500 challenging academic questions across many disciplines. It includes multiple-choice and short-answer questions, some requiring images.

#### Representative task

> Identify a specialized scientific structure from a diagram and a short description. Return its accepted name and a confidence estimate for your answer.

The system reads the question and returns an answer. An evaluation may also request confidence, allowing the benchmark to examine whether the system recognizes uncertainty rather than merely producing a plausible response.

#### Scoring

Evaluation measures answer correctness and examines calibration: whether stated confidence tracks actual correctness across questions. Accuracy and calibration are different measurements. A system can answer few questions correctly while assigning sensible low confidence, or give many confident but incorrect answers.

#### What it measures

HLE extends academic breadth and difficulty beyond benchmarks such as MMLU. It remains a closed-ended evaluation with known answers. Its creators distinguish strong performance from autonomous research or AGI. Tool-enabled and tool-free runs evaluate different systems; report the tool access and budget instead of treating their scores as interchangeable.

Sources: [Humanity’s Last Exam paper](https://arxiv.org/abs/2501.14249).

[Back to benchmark directory ↑](#directory)

## Agent capabilities in isolation

These evaluations isolate important parts of an agent system or test them in controlled workflows. Their scores complement task-completion benchmarks; they do not share one definition of success.

### 40. BFCL: can a model select and invoke tools correctly?

The Berkeley Function-Calling Leaderboard, introduced in 2024, began with tests of function selection and argument construction. Original categories include single calls, choosing among functions, parallel calls, and withholding a call when no available function fits. Later versions add interaction and agentic tasks, so “BFCL accuracy” needs a version and category.

#### Representative task

> Find the cheapest flight from Boston to Chicago on the specified date and book it for the identified passenger.

```
Tools:   search_flights(origin, destination, date)
         book_flight(flight_id, passenger_id)
         get_weather(city, date)
Observe: Read the request and available function schemas.
Act:     search_flights("BOS", "CHI", "2026-10-05")
Observe: Compare the returned flight identifiers and prices.
Agent:   Ask for the passenger identifier if it cannot be retrieved.
Observe: Receive the missing identifier in the next user turn.
Act:     book_flight(selected_flight_id, passenger_id)
Check:   Evaluate calls and state using this category's rules.
```

The example separates selecting the right API from supplying grounded arguments. A well-formed call can still be wrong if it books a more expensive flight or invents the passenger identifier. The correct response can be a clarification or no call, depending on the task and available information.

#### Scoring

Original tests use parsed function/argument structure or execution checks. V3 multi-turn tasks inspect backend state and required execution evidence at each turn; the episode must satisfy the required checks across turns. V4 web search compares the normalized final answer. These are different measurements, and the aggregate combines categories rather than representing one uniform workflow success rate.

#### What it measures

BFCL helps diagnose tool-interface failures: wrong function, wrong arguments, unnecessary calls, or loss of state over turns. Original call tests measure components of an agent; stronger category scores alone do not demonstrate reliable completion across arbitrary environments. Report the function interface, categories, memory backend, and evaluator version.

**Version updates.** V3 adds multi-turn and multi-step interaction. V4, released July 17, 2025, adds web search, memory, and format-sensitivity evaluation. In the memory track, tools store information that must later answer questions without the original dialogue history. The official leaderboard checked in September 2026 still identifies V4. Compare category results before attributing an aggregate gain to better tool calling.

Sources: [Original BFCL methodology](https://gorilla.cs.berkeley.edu/blogs/8_berkeley_function_calling_leaderboard.html) · [Multi-turn evaluation](https://gorilla.cs.berkeley.edu/blogs/13_bfcl_v3_multi_turn.html) · [BFCL V4 release and scoring](https://gorilla.cs.berkeley.edu/blogs/15_bfcl_v4_web_search.html) · [V4 memory](https://gorilla.cs.berkeley.edu/blogs/16_bfcl_v4_memory.html) · [Official version reference](https://gorilla.cs.berkeley.edu/leaderboard).

### 41. ToolSandbox: can it use tools when state and dependencies matter?

ToolSandbox, introduced in 2024, evaluates conversational tool use in a stateful environment with a simulated user. A tool’s availability or result may depend on changes made by other tools.

#### Representative task

> Send Alex a message saying that I will arrive ten minutes late.

In this illustrative run, the name is ambiguous and cellular service starts disabled. The agent must discover and resolve both conditions through interaction.

```
Identify → Look up contacts and clarify which Alex.
Attempt  → Send the message; observe “cellular disabled”.
Recover  → Enable service and retry the message.
Check    → Match milestones and forbidden minefields.
```

#### Scoring

Human-authored **milestones** inspect intermediate calls and world state while respecting specified dependencies. The score is the best compatible average milestone similarity. Matching a forbidden **minefield** makes it zero. This is not simply the percentage of tasks completed; turn count is a separate efficiency measure.

**MM-ToolSandBox, July 2026.** The multimodal extension adds visual inputs across turns, 511 tools in 16 domains, 258 scenarios, and 50 UI variants, with code-execution or structured-tool interfaces. It combines Entity F1 over expected state changes with rubric-based agent success and a separate user-simulator check. Its metrics differ from the original milestone score.

#### What it measures

ToolSandbox tests whether an agent can maintain and change state across dependent actions. Milestone authoring can constrain acceptable solutions, and simulated users can make mistakes. The original benchmark omits mandatory confirmation and authentication, limiting what its results establish about deployment readiness. Name the release and scoring protocol.

Sources: [Original ToolSandbox paper](https://arxiv.org/html/2408.04682v1) · [MM-ToolSandBox paper](https://arxiv.org/html/2607.11818v2).

### 42. LongMemEval: can it recover the right fact from past experience?

Original LongMemEval (2024) uses 500 questions about extended chat histories. It tests information extraction, reasoning across sessions, temporal reasoning, knowledge updates, and abstention. Cleaned histories were released in September 2025.

#### Representative task

> A user mentioned two delivery addresses in earlier sessions, then changed the preferred address. Which address was current when the most recent order was discussed?

1. Process the supplied timestamped history using the chosen memory system.
2. Receive a question and retrieve relevant evidence.
3. Have the reader answer from that evidence, or abstain when appropriate.
4. Grade the answer against the reference.

#### Scoring

The original benchmark uses an LLM judge with task-specific instructions. Retrieving an answer-bearing session is an intermediate result, not answer correctness.

**LongMemEval-V2, May 2026.** Its 451 questions concern recorded multimodal web-agent experience: interface state, state changes, workflows, recurring failures, and incorrect premises. A memory module returns bounded evidence to a fixed reader. Structured answers use deterministic matching; gotcha and flawed-premise questions use an LLM judge. Reports include accuracy and memory-query latency for small and medium history tiers. The current leaderboard measures improvement over a fixed accuracy–latency frontier.

#### What it measures

The original tests memory across conversations; V2 tests evidence gathering from recorded agent experience, rather than live task completion. Reader errors can affect either system-level answer score. Name the data revision, history tier, memory configuration, reader, judge, and timing scope. August 2026’s AgentRunbook-C V2 update concerns a memory baseline, not a third benchmark version.

Sources: [LongMemEval paper](https://arxiv.org/abs/2410.10813) · [Cleaned data and evaluation](https://github.com/xiaowu0162/LongMemEval) · [LongMemEval-V2 paper](https://arxiv.org/abs/2605.12493) · [V2 updates and leaderboard protocol](https://github.com/xiaowu0162/LongMemEval-V2).

### 43. AgentDojo: can it complete the task despite malicious content?

AgentDojo, introduced in 2024, evaluates tool-using agents that encounter prompt injections in untrusted information. The original release contains 97 user tasks and 629 security test cases across workspace, messaging, travel, and banking environments.

#### Representative task

> Find the time of a requested appointment. A document returned by a tool contains an attacker’s instruction to change an unrelated calendar event instead.

```
Reset   → Initialize application state and legitimate task.
Observe → Read tool results, including attacker-controlled content.
Act     → Continue the user's task through available tools.
Check   → Test the user's goal and the attacker's goal separately.
```

#### Scoring

Deterministic checks inspect outputs and mutable application state. Report **benign utility**, **utility under attack**, and **targeted attack success rate**. Refusing every action might reduce attack success while making the agent useless; the accompanying completion rate exposes that trade-off.

#### What it measures

AgentDojo tests whether a system preserves the legitimate task when lower-trust material tries to redirect it. It is an extensible attack-and-defense framework, so results depend on the attacker’s access, knowledge, placement opportunities, and budget. Passing a fixed attack set does not establish resistance to adaptive attacks.

Pin both implementation and task definitions. The official release notes distinguish package v0.1.35 from benchmark task revision v1.2.2. These version numbers track different objects, and the original paper’s task counts should not be assumed to describe every later revision.

Sources: [Original AgentDojo paper](https://arxiv.org/html/2406.13352v1) · [Official changelog](https://agentdojo.spylab.ai/changelog/) · [Package releases](https://github.com/ethz-spylab/agentdojo/releases).

### 44. MultiAgentBench: does a team coordinate toward a better outcome?

MultiAgentBench, published in 2025, evaluates agent teams in research proposal writing, Minecraft construction, database diagnosis, coding, bargaining, and Werewolf. Its MARBLE framework varies roles, communication topologies, and planning strategies; some scenarios involve cooperation and others competition.

#### Representative task

> Investigate a database slowdown. Divide the investigation among agents, exchange findings, and combine the evidence into a diagnosis and proposed fix.

1. Initialize the scenario and assign roles and communication connections.
2. Let agents inspect their available observations and take permitted actions.
3. Exchange messages and revise plans within the iteration budget.
4. Grade the scenario outcome and separately analyze coordination.

#### Scoring

Task scores use scenario-specific rule checks or LLM rubrics. An LLM detector identifies completed milestones and participating agents to estimate contributions. Communication and planning receive separate model-judged scores that combine into a coordination score. None of these measurements should silently substitute for the others.

#### What it measures

The benchmark makes coordination part of the evaluated system. Exchanging many messages does not establish useful division of work, and a high coordination rating does not prove a correct result or an advantage over one agent. Compare with single-agent baselines at matched total cost. Report roles, topology, agent count, iteration limits, and judges alongside task scores.

The official MARBLE repository is the implementation reference. A similarly named third-party framework or integration should not be assumed to reproduce this protocol.

Sources: [MultiAgentBench paper](https://aclanthology.org/2025.acl-long.421/) · [Official MARBLE repository](https://github.com/ulab-uiuc/MARBLE).

[Back to benchmark directory ↑](#directory)

## Workplace and engineering workflows

These benchmarks evaluate different work products: a completed enterprise workflow, a professional deliverable, a GPU implementation, or a trained predictive model. Each needs its own grading criteria and resource accounting.

### 45. TheAgentCompany: can it complete a workflow across company tools?

TheAgentCompany, introduced in 2024, evaluates digital work in a simulated software company. Its 175 tasks span software engineering, project management, finance, and other activities. Services include GitLab, Plane, ownCloud, and RocketChat, with simulated colleagues available for communication.

#### Representative task

> Ask a colleague for a project detail, update the corresponding project record, prepare a short status document, and share the result through the company’s messaging service.

```
Reset   → Restore the company services and task state.
Observe → Read the assignment and inspect available records.
Act     → Use browser, editor, terminal, or colleague messages.
Repeat  → Carry information and changes across applications.
Check   → Evaluate task checkpoints and full completion.
```

#### Scoring

Weighted checkpoints inspect state, files, interactions, or trajectories through deterministic checks and LLM judgments where needed. Full completion requires every checkpoint. The partial score equals half the fraction of checkpoint points earned plus half the binary full-completion score. Partial progress and full task success are therefore different measurements.

#### What it measures

The benchmark tests coordination across tools and communication channels. Producing one plausible artifact may leave other required changes unfinished. Report the agent configuration and the models simulating colleagues and grading outputs because they shape the interaction and measurement.

The company is a controlled approximation. The paper provides no human-professional baseline, and the tasks omit much open-ended creative work. Completing selected workflows does not establish that an agent can perform an entire occupation.

Sources: [TheAgentCompany paper and scoring definitions](https://arxiv.org/html/2412.14161v3) · [Official environment and evaluation code](https://github.com/TheAgentCompany/TheAgentCompany).

### 46. GDPval: can it produce a useful professional deliverable?

GDPval, introduced in 2025, evaluates work products across 44 occupations and nine economic sectors. The full dataset contains 1,320 tasks; the public gold subset contains 220.

#### Representative task

> Use the supplied staffing records, operating targets, and budget to prepare a recommendation for next quarter. Deliver a spreadsheet supporting the calculation and a short document explaining the proposed changes.

1. Receive the work assignment and its supporting files.
2. Inspect the context and produce the requested artifacts.
3. Submit the finished deliverable for comparison with expert-produced reference work.
4. Collect blinded expert preferences and ties, or separately identified automated grades.

#### Scoring

Expert graders compare model and reference deliverables without seeing which system produced them. Report the task subset and the preference or win/tie definition used. Automated grading is also available, but its scores should be labeled separately from expert review; the two are different sources of evidence.

#### What it measures

GDPval brings the finished artifact into the evaluation: a convincing chat response is insufficient if the requested work product is missing or poor. Its original evaluation is one-shot, so it does not capture gathering context through client conversations or revising a deliverable through continuing feedback. The selected tasks represent pieces of professional work. Favorable comparisons do not establish that a system can perform an entire occupation or independently produce workplace productivity gains.

Sources: [GDPval release](https://openai.com/index/gdpval/).

### 47. KernelBench: can it make a computation correct and faster?

KernelBench was released in 2024, followed by its 2025 paper. It asks a system to replace a supplied PyTorch computation with a correct, faster GPU implementation. Its 250 core workloads include individual operators, fusion patterns, and complete model architectures.

#### Representative task

> Replace a sequence of tensor operations with a GPU implementation that produces matching outputs and runs faster than the specified PyTorch baseline on the target hardware.

1. Receive the reference computation and evaluation configuration.
2. Generate and compile a candidate implementation.
3. When feedback is allowed, inspect correctness and timing results and revise.
4. Compare outputs and measure execution time using the benchmark evaluator.

#### Scoring

*fastp* is the fraction of workloads that pass correctness checks and exceed speedup threshold p. Report the GPU, precision, shapes, timing procedure, libraries, and baseline. Speedup over eager PyTorch and speedup over compiled PyTorch are different comparisons.

**The current named update is v0.1.** It changes problem sizes and numerical behavior, repairs or replaces problematic workloads, and supports broader random-input testing. That testing is configurable; using the updated repository does not establish which input distributions were tested.

#### What it measures

KernelBench joins functional correctness with systems performance. Finite checks cannot prove universal correctness, and timing mistakes, state reuse, or evaluator manipulation can create apparent speedups. Pin the dataset and evaluator revision, inspect unusually strong results, and distinguish workload speedups from gains in an entire deployed application.

Sources: [Release chronology](https://scalingintelligence.stanford.edu/blogs/) · [KernelBench paper](https://arxiv.org/abs/2502.10517) · [v0.1 changes](https://scalingintelligence.stanford.edu/blogs/kernelbenchv01/) · [Evaluation guidance](https://github.com/ScalingIntelligence/KernelBench/blob/main/EVAL.md).

### 48. MLE-bench: can it turn data into a competitive model?

MLE-bench, introduced in 2024, evaluates machine-learning engineering using 75 offline Kaggle competitions. An agent receives a problem description and data, then decides how to prepare features, train models, and allocate its experiment budget.

#### Representative task

> Train a model to predict an outcome from supplied tabular data. Compare candidate approaches using the available training information, then submit predictions for the designated test rows.

1. Load the competition description, data, and resource limits.
2. Inspect the data and train an initial model.
3. Run further experiments, diagnose failures, and select a candidate.
4. Write the required submission CSV for local grading.

#### Scoring

Competition-specific metrics score predictions. The original headline measure is the fraction of competitions reaching at least a bronze-medal threshold derived from historical Kaggle results. Retain raw per-competition scores too. Historical competitors had different resources and time budgets, and some datasets use reconstructed train/test splits; this is not a controlled comparison with humans under identical conditions.

#### What it measures

MLE-bench tests experiment planning and implementation under compute constraints. It leaves deployment, monitoring, and much production maintenance untested. Public competition solutions can enter training or provide shortcuts, so record external access, hardware, runtime, attempts, and any test-set feedback.

**As of September 2026, v2 remains described as upcoming.** New leaderboard submissions have been paused since April 24, 2026. The repository documents unresolved preparation, grading, and label-leakage issues in particular competitions. Report the exact version, task list, and treatment of these issues.

Sources: [MLE-bench paper](https://arxiv.org/abs/2410.07095) · [Official repository, status, and known issues](https://github.com/openai/mle-bench).

[Back to benchmark directory ↑](#directory)

## Release and version notes

Official sources checked on September 27, 2026.

Use this table to locate the relevant protocol. It records verified releases and extensions, not leaderboard rankings. Sources and interpretation limits appear in each linked entry.

| Benchmark family | Release or extension | What changes the comparison |
| --- | --- | --- |
| [AgentBench](#agentbench) | AgentBench FC, October 2025 | Five containerized environments and a function-calling interface; distinct from the original eight-environment suite. |
| [WebArena](#webarena) | WebArena-Verified | Audited tasks and deterministic evaluation of responses and captured network traces. |
| [GAIA](#gaia) | Gaia2 | A new asynchronous application environment with write-action verification. |
| [SWE-Bench Pro](#swe-bench-pro) | Public V2, September 22, 2026 | Revised tasks, restricted network access, and grading in a clean environment. |
| [Terminal-Bench](#terminal-bench) | 4.0.0, August 2026 | Task and resource changes require new runs. |
| [OSWorld](#osworld) | 2.1, September 16, 2026 | Longer workflows and a coordinated release of tasks, assets, and environments. |
| [τ-bench](#tau-bench) | τ³-bench; July 2026 grading fix | Knowledge and voice tracks; banking scores depend on the grading revision. |
| [BFCL](#bfcl) | V4 | Web search and memory join tool-call and multi-turn categories. |
| [ToolSandbox](#toolsandbox) | MM-ToolSandBox, July 2026 | Multimodal inputs and different state/success metrics. |
| [LongMemEval](#longmemeval) | Cleaned original data; V2, May 2026 | V2 evaluates memory over agent experience with accuracy and query latency. |
| [AgentDojo](#agentdojo) | Package v0.1.35; task revision v1.2.2 | Implementation and task definitions have separate version numbers. |
| [KernelBench](#kernelbench) | v0.1 | Workload/numerical fixes and configurable broader correctness testing. |
| [MLE-bench](#mle-bench) | Original suite; v2 described as upcoming | Known task/grading issues and paused leaderboard submissions need explicit treatment. |
| [METR time horizons](#time-horizons) | TH1.1 with revised March 2026 analysis | Task-suite and statistical changes affect the fitted horizon. |
