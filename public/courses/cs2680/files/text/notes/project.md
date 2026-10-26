---
title: Final project
source: https://cs2680.seas.harvard.edu/project.html
fetched: 2026-10-19T16:28:00+00:00
source_kind: harvard-cs2680-official
---

# Final project
CS2680 Modern AI Systems — Final Project

CS2680 Modern AI Systems: Agents and System Optimizations

Final project

# Final project

In the final project, you choose a problem, build a system or an experiment to address it, and support one claim with measurements.

In the assignments, the course specifies the problem and the evaluation. In the project, you choose both. You can take one of two tracks: the [product track](#product-track), in which you build a tool that solves a practical problem, or the [research track](#research-track), in which you make an original claim about agents or the systems that run them. Both tracks have the same deadlines, deliverables, and rubric. The research track is held to a higher standard of novelty and evidence.

The project is individual and is worth **20% of the course grade**. Each student submits one proposal, presents one poster and demo, and publishes one blog post and repository. You can start before the proposal deadline. Email the instructor if you want feedback on an idea or its scope, need a compute allocation, or want someone to read a draft.

## Deliverables and deadlines

| Due | Deliverable | Weight | How to submit |
| --- | --- | --- | --- |
| **Wed Oct 28**, 11:59pm | [Proposal](#proposal) | 2% | One PDF on Canvas |
| **Mon Dec 7**, 9:00am–1:00pm | [Poster and demo](#poster), including [peer evaluation](#peer-review) | 10% | In person, SEC 1.402 |
| **Tue Dec 8**, 11:59pm | [Blog post and repository](#blog) | 8% | Pull request to the course blog repository |

---

# Choose a track

Choose the track that matches the claim you want to make, and name it in the proposal. You can switch later by emailing the instructor.

## Product track: build a useful tool

Build an AI system that solves a real problem better than the strongest available alternative. The gap can come from missing context, poor reliability, high cost, slow response, privacy constraints, or a workflow that existing tools do not support.

Suitable directions include:

* **Research workflows.** Automate experiments, reproduce results, analyze papers, or manage research artifacts.
* **Learning.** Build a grounded study tool or a system for practicing a skill.
* **Personal workflows.** Improve a repetitive task in your own work or daily life.
* **A course extension.** Take an assignment substantially beyond its graded requirements. Your submitted work is the starting point, and the proposal must state what is new.

## Research track: conduct original research

The research track requires an original, falsifiable claim about agents or AI systems. The work must establish a result that the closest published work does not provide, explain why the result occurs, and define the conditions under which it holds. A polished implementation, a reproduction, a benchmark, or a set of measurements does not meet this bar by itself.

You can work on either side of the course:

* **Agent-side research.** Study or improve planning, tool use, memory, context management, verification, multi-agent coordination, evaluation, or another part of the agent loop. The quantity you measure is the agent's behavior, capability, reliability, or cost.
* **Systems-side research.** Study or improve inference, batching, scheduling, caching, routing, quantization, compression, kernels, or another layer that runs the agent or model. The quantity you measure is system performance, efficiency, scalability, or reliability.

On either side, the contribution can take one of four forms:

* **Measurement.** Report a behavior, bottleneck, or tradeoff that prior work does not report, then explain its cause and the conditions under which it appears. Running an existing benchmark on a different model or machine does not count unless it leads to a new conclusion.
* **Mechanism.** Propose a method, policy, or design and compare it with the strongest published alternative. Isolate the mechanism with an ablation, and explain when it helps, when it does not, and why.
* **Reproduction and boundary.** Reproduce a published result, then identify the workload or condition under which the claim stops holding. The reproduction alone does not count as a contribution.
* **Instrument.** Build a benchmark, trace, or measurement harness that makes a previously unanswered question answerable. Validate the instrument, then use it to answer the question.

#### Which track to choose

If the main contribution is a useful application, choose the product track and evaluate it rigorously. Choose the research track if you can state the new claim, name the closest published claim, and design a controlled experiment that distinguishes the two.

---

# Proposal

|  |  |
| --- | --- |
| Due | **Wed Oct 28, 11:59pm** |
| Weight | 2% of the course grade |
| Submit | One PDF on Canvas |
| Length | No page limit |

The proposal lets the course staff check that the project is specific, can be completed in five weeks, and will be evaluated against the right baselines before most of the work begins. Include the nine sections below, in this order. Each section lists what it must contain for both tracks and, where they differ, for each track.

1. **Title and summary.** Give a title, your name, and your track. For the research track, also state whether the work is agent-side or systems-side. Then summarize in one paragraph the problem, your approach, and how you will evaluate it.
2. **Problem.** Describe the problem you will solve or the question you will answer, who has it, and why it matters. For the product track, describe the current workflow and what it costs in time, money, or errors. For the research track, state the question in terms of a quantity you can measure.
3. **Existing work and the gap.** Identify the closest existing systems or published results and report what you tested. For the product track, run at least three of the closest commercial tools, open-source systems, or research prototypes on your own task, give the same input directly to a frontier model, and describe how each one fails. For the research track, cite the closest published work, state what it leaves unsettled, and report what you have reproduced so far or how you will reproduce the closest result in your setup. End the section with the gap in one testable sentence. For the product track, the sentence states what your system will do that the strongest alternative cannot. For the research track, it states what your experiment will establish that the closest published result does not. [Finding the gap](#the-gap) explains how to do this survey.
4. **Claim.** State the claim that the evaluation will test. For the product track, state the improvement you expect over the baselines in terms of a metric. For the research track, state a falsifiable hypothesis: the result you expect, the conditions under which you expect it, and the result that would show the hypothesis is wrong.
5. **Design.** Describe the system or experiment you will build: its main components, which parts you will write and which you will reuse (models, frameworks, or assignment code), and the technical challenges you expect. For a course extension, state what is new beyond the assignment's graded requirements. For the research track, describe the mechanism, measurement, or instrument and how you will isolate its effect.
6. **Evaluation plan.** Name the two baselines for your track (see [Use the right baselines](#baselines)), the workload or task set and its size, the metrics and how each one relates to the claim, and the protocol, including the number of repeated trials and the ablation. If you will tune on examples, name the held-out set. For the research track, also name the boundary condition you will test and explain how the plan meets the [research evidence bar](#research-bar).
7. **Goals.** State three levels of outcome, each as a concrete artifact or measurement. The **75% goal** is the minimum result you are confident you can deliver even if the main idea does not work, such as a working end-to-end prototype with baseline measurements. The **100% goal** is the result you plan to deliver. The **125% goal** is an extension you will attempt if you reach the 100% goal early. The blog post reports which goal you reached.
8. **Plan and resources.** Give a week-by-week plan for the five weeks (see [Plan for five weeks](#pacing)), including the week of the first end-to-end measurement. Name the compute resource from the [compute table](#resources), the models, and an estimate of API cost or GPU hours. Describe the data you will use, where it goes if you call a hosted API, and any restrictions on it. List the main risks and what you will do if each one occurs.
9. **References.** Cite every system, paper, and dataset named in the proposal.

The proposal is graded on completeness and specificity: whether all nine sections are present, whether the gap is supported by tests or reproductions you report, and whether the baselines, workload, and metrics are specific enough to run. The track and plan are not binding. If the project changes direction after the proposal, email the instructor with the new track or plan.

---

# Poster and demo

**Mon Dec 7, 9:00am–1:00pm, SEC 1.402** · 10%

Present the project as a poster at the poster session after classes end. A visitor should be able to find the problem, the gap, the system or experiment, and the main result within a few minutes. Include at least one figure that is legible from two meters away. If a live demonstration suits the project, prepare a version that runs reliably in about two minutes.

## Peer evaluation

The poster session includes peer evaluation, and peer scores count toward the project grade. Each student reviews several other projects, and the reviews are part of the deliverable.

**Late days do not apply to the poster session.** If you have a conflict you cannot move, such as a religious observance, illness, or required travel, email the instructor in advance. See the [late-day policy](policy.html#late-days).

---

# Blog post and repository

**Tue Dec 8, 11:59pm** · 8%

Publish the write-up on the [course blog](https://blog.cs2680.com/) by opening a pull request to the course blog repository, following the [publishing guide](https://blog.cs2680.com/publish/). The deadline is the time the pull request is opened. It does not need to be merged by then.

## Blog post

Write for a general technical audience, using the assignment write-ups as a model. There is no length requirement. The post must cover eight items:

1. The problem or question, and the gap relative to the closest existing systems or published results.
2. The design of the system or experiment.
3. The evaluation method: baselines, workload, metrics, and protocol.
4. The results, including comparisons in which your system or hypothesis did worse.
5. The limitations, failure modes, and threats to validity.
6. Which of the proposal's goals (75%, 100%, or 125%) you reached, and what changed since the proposal.
7. Links to the repository and to any public demo.
8. The note required by the [AI use policy](policy.html#ai-policy): what you delegated to AI, what you did yourself, where AI helped, where it misled you, how you detected the problem, and what it cost.

## Repository

The repository must let another person reproduce the main result. Include an installation and execution guide, the raw measurements behind each figure, the scripts that generate the figures, and the hardware, software versions, and workload used for every reported number. Label all axes and units, and keep figures legible in print and in grayscale.

---

# Grading

The proposal is graded as described in [Proposal](#proposal), and the poster session is partly scored by peers. The blog post and repository are graded on the four dimensions below, weighted equally. Both tracks use the same dimensions. Research projects are held to a higher standard of novelty, experimental control, reproducibility, and engagement with published work because they claim to add to the published record.

| Dimension | What strong work shows | Warning sign |
| --- | --- | --- |
| **Problem and motivation** | A clear problem or question, a thorough review of what already exists, and a testable gap | An existing tool already solves the problem, or a paper already reports the answer |
| **Technical execution** | A substantial, technically sound implementation or measurement | Code that works only on one machine, one input, or one run |
| **Evaluation** | Appropriate baselines and metrics, controlled comparisons, and conclusions supported by the experiments | Single-run numbers, a weak baseline, or a comparison between your run and an unreproduced number from a paper |
| **Reporting** | Clear claims, reproducible evidence, and an accurate account of limitations and negative results | A figure or claim that the underlying measurements do not support |

A project whose main idea does not work can still earn nearly full credit if the blog post explains what you expected, what you measured, and why the two differ. A claim that your measurements do not support loses credit whether the result is favorable or unfavorable.

---

# Finding the gap

Before building, find out what already exists and state its limitation in one testable sentence. Do this before the proposal, so that you can change the project early if an existing tool or paper already covers it.

## For a product project

Run the closest commercial tools, open-source systems, and research prototypes on your own task. Also give the same input directly to a frontier model; this counts as a baseline even if it seems too simple. Record the specific failure you observe. For example, “It cannot read my cluster's job queue” is a testable gap, whereas “Nothing like this exists” is not.

## For a research project

Read the closest published work on the agent side or the systems side and identify the claim it leaves unsettled. Research gaps commonly come from three sources. First, nobody has measured the behavior on your workload, model, or hardware. Second, a published result depends on conditions that should change the answer under yours. Third, two published results disagree. A plan to try an idea and see whether it works is not yet a research question; state the result you expect and why.

**Reproduce the closest result first.** A number reported in a paper was measured with a different model, prompt, task set, GPU, software version, or workload. Comparing your run against that number confounds your change with those differences, so reproduce the closest result in your own setup before you try to improve on it. If the published artifact cannot be reproduced, document why and build the closest comparison you can justify.

**Know where your data goes.** A hosted API sends your data off your machine. Before using unpublished results, collaborators' data, human-subjects data, or private communications, check your lab's rules and any IRB conditions. If the data cannot leave your machine, serve a model yourself as in [Assignment 4](assignments/index.html#assignment-4).

---

# Evaluation

## Use the right baselines

| Track | Baseline 1 | Baseline 2 |
| --- | --- | --- |
| **Product** | The strongest existing system, run on your tasks | The current by-hand workflow, timed before your tool changes it |
| **Research** | The unmodified agent or system | The strongest published method or result, reproduced in your setup |

If you introduce a mechanism, isolate it with an ablation or another controlled comparison. Report the configurations that perform worse as well as those that perform better, and include the strongest comparison even if your system loses to it.

## The research evidence bar

A research result must hold beyond the run that produced it. Before the main experiment, state the hypothesis and fix the protocol. Then run repeated trials, report variation or uncertainty, isolate the proposed cause, test at least one boundary condition, and keep the artifacts needed to reproduce the result.

For **agent-side research**, fix the model version, prompts, tools, task set, and success criteria. Use held-out tasks if you tuned the method on examples, and separate capability from token cost, latency, and run-to-run variation. For **systems-side research**, fix the hardware and software stack, describe the workload, measure under controlled load, and report both central and tail behavior where applicable.

A single benchmark score, one favorable prompt example, or one throughput number does not meet this bar.

## Choose metrics that match the claim

Agent projects may need success rate, latency, cost, token usage, number of steps, resource use, and human effort. Serving projects may need throughput, time to first token, per-token latency, tail latency, memory use, cache hit ratio, and prefill work avoided. A latency result must state the request rate at which it was measured.

**Measure one level deeper.** Break the top-line result into the components that explain it. For example, “The agent took 60 seconds” reports what happened, while “Tool calls took 40 seconds, including one 30-second call that could run in parallel” shows what to change. Ousterhout's [Always Measure One Level Deeper](https://cacm.acm.org/research/always-measure-one-level-deeper/) explains this practice.

Fix the workload, task set, and metrics before the main experiment. For the product track, time the by-hand workflow before your tool changes it. For the research track, do not choose the workload after seeing which one gives the strongest result.

---

# Plan for five weeks

1. **Week 1.** Fix the problem or question. Test the closest systems or reproduce the closest result, and record the baseline.
2. **Week 2.** Run an end-to-end prototype or a small version of the complete experiment.
3. **Weeks 3 and 4.** Improve the system and run the controlled experiments.
4. **Week 5.** Analyze the results and prepare the poster, demo, blog post, and repository.

Run the complete path once and take the first measurement before building more infrastructure. If the project needs a GPU, include queue time and reruns in the plan.

The project overlaps with [Assignment 4](assignments/index.html#assignment-4) (due Tue Nov 10) and [Assignment 5](assignments/index.html#assignment-5) (due Sun Nov 29). The poster session is Mon Dec 7 and the blog post is due Tue Dec 8, so start the poster and the blog post before the final week.

---

# Choose the compute you need

The [computing setup](computing/index.html) page has access instructions. Choose the simplest resource that can run the experiment. Most projects fit on a laptop, model API access, or a small number of GPUs. Contact the instructor early if the project needs hardware that is not listed here or a large amount of compute.

| Resource | Use it when | Plan for |
| --- | --- | --- |
| [Course model API](computing/api.html) | You need a hosted frontier model but do not need to control the serving stack | Request cost and data leaving your machine |
| [Course HPC](computing/cluster.html) | You need CPU or RTX PRO 6000 Blackwell GPU resources; this is the default for most serving projects | A three-day CPU job limit, a two-day GPU job limit, and a shared GPU pool |
| AWS | You need cloud resources covered by an announced course allocation | Do not depend on credits until the allocation is confirmed |
| [FASRC](https://www.rc.fas.harvard.edu/) | You already have or can obtain access to research CPU nodes or GPUs such as H100 and H200 | Access approval and queue time |
| [CloudLab](computing/cloudlab.html) | You need bare metal, kernel or network access, or isolation from a shared cluster | Environment setup and experiment reproducibility |

Start with the least expensive model and the smallest complete experiment. Set a spending cap before each API run, stop cloud jobs when they finish, and run a small sweep before the full one. A late GPU allocation is not grounds for an extension, but the course staff can help you debug access and adjust the scope.

---
