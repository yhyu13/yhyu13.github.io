---
title: Announcement
source: https://cs2680.seas.harvard.edu/index.html
fetched: 2026-10-19T16:28:00+00:00
source_kind: harvard-cs2680-official
---

# Announcement
CS2680 Modern AI Systems: Agents and System Optimizations

CS2680 Modern AI Systems: Agents and System Optimizations

Fall 2026

# Announcement

* Oct 8, 2026[Assignment Leaderboard](https://leaderboard.cs2680.com) is live.
* Sept 4, 2026We have
  increased capacity to 80 students.
* Aug 28, 2026Audit policy:
  everyone is free to audit as long as it is permitted by school policy and the classroom has space.
  However, we do not have computing resources for auditing students.
* Aug 17, 2026Welcome to
  CS2680 Modern AI Systems: Agents and System Optimizations! Class meets Monday and Wednesday in SEC
  LL2.229.

---

# Overview

This course follows one agentic system from the agent loop down through the serving stack. You first use a
modern coding
agent (Claude Code), then design your own agent using provided API access, measure it, and optimize it.
Then you serve an open-weight model yourself and take responsibility for the layers underneath: batching and
scheduling, KV-cache and prefix reuse, routing, quantization, and speculative decoding.

Class time and location

**Monday and Wednesday**
11:15am – 12:30pm
SEC LL2.229

Prerequisites

**CS61**, and at least one graduate-level course in computer systems.
Comfort with Python and PyTorch is assumed. See [the background we assume](policy.html#background).

Assessment

Five [assignments](assignments/index.html) and a [final project](project.html).
Class participation throughout the semester.
There is no exam.

**Format.** The course runs in two parts.

* **Part I — Introduction to LLMs and agents.** You will learn about how to use coding
  agents (Claude Code) and how to design an agent. You will also explore various agent architectures, use
  cases and optimizations.
* **Part II — Systems for LLMs and agents.** We will talk about LLM serving (batching,
  scheduling, routing, caching, quantization, and speculative decoding) and agentic systems.

The assignments walk down that stack in five steps. First, Mads-Lens[1](#mads-name-footnote) lets you watch the agent work (Assignment
1). Second, you build the loop in Mads-Loop (Assignment 2). Third, you make every token count in Mads-Opt
(Assignment 3). Fourth, you own the serving engine in Mads-Serve and run a model on the provided GPUs (Assignment 4).
Fifth, you optimize the full stack in Mads-Stack (Assignment 5).

1 “Mads” abbreviates Modern Agent Design and
Systems, the arc of this course, and nods to [MaDSys](https://madsys.seas.harvard.edu/), Harvard’s Measurement and Design of Systems research group, which
teaches and supports it.

**What this course expects.** This course will not teach you every piece of knowledge you need
for the assignments. It focuses instead on the skills to learn with, and points you in directions worth
going. Expect to spend a significant amount of time learning and experimenting on your own after class. If you
want an A, plan on it.

**Grading.**

* Assignment 1 Mads-Lens: watch the agent
  work10%
* Assignment 2 Mads-Loop: build the
  loop10%
* Assignment 3 Mads-Opt: make every token
  count20%
* Assignment 4 Mads-Serve: own the
  serving engine20%
* Assignment 5 Mads-Stack: optimize the
  full
  stack10%
* [Project](project.html)20%
* Class participation10%
* Bonus optional
  presentations up to 4% each; course feedback up
  to 6%; problems current AI cannot solve, 2% eachup to 10%

See [policy page](policy.html) for details.

**Course website.** <https://cs2680.com>

---

# Staff

![Juncheng Yang](staff/juncheng-yang.jpg)

[Juncheng Yang](https://juncheng.seas.harvard.edu)

Instructor

![Yiyu Liu](staff/yiyu-liu.jpg)

[Yiyu Liu](https://lau.yeeyu.org/)

TF

![Advaith Ravishankar](staff/AdvaithRavishankar.jpg)

Advaith Ravishankar

TF

![Charles Wang](staff/charles.jpg)

Charles Wang

TF

![Yunjia Zheng](staff/yunjia-zheng.jpg)

[Yunjia Zheng](https://scholar.google.com/citations?user=6o4Er-UAAAAJ)

TF

**Contact:** [cs2680-staff@g.harvard.edu](mailto:cs2680-staff@g.harvard.edu) Please use this address for all
course-related questions. We only respond to emails from Harvard students. Due to the large number of emails we receive, we do not respond to external inquiries.

**Office hours:**

* Instructor: Appointment only
* TFs: See Ed + by appointment

---

# Schedule

*Tentative and subject to change.*

Rows with
**Students** as the speaker are student-led: either a paper discussion (see the
[paper discussion page](discussion.html)) or an assignment sharing session. Paper
presentations are optional and can earn up to four bonus percentage points each.

| Week | Date | Speaker | Topic | Readings | Notes |
| --- | --- | --- | --- | --- | --- |
| **Part I — Introduction to LLMs and agents** | | | | | |
| 1 | 2026-09-02 | Juncheng Yang | Course overview and logistics [[slide]](slides/1_intro.pdf) |  | **[Assignment 1](assignments/assignment1.html) out** (Mads-Lens: Watch the agent work); Sign up for AWS |
| 2 | 2026-09-07 | *No class — Labor Day* | | | |
| 2 | 2026-09-09 | Juncheng Yang | Agents use I: How Claude Code Works [[slide]](slides/2_agent_use_1.pdf) | [How I use LLMs](https://www.youtube.com/watch?v=EWvNQjAaOHw); [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices); [Agentic Engineering Patterns](https://simonwillison.net/guides/agentic-engineering-patterns/); [more reading →](readings/sep-09.html) |  |
| 3 | 2026-09-14 | Juncheng Yang | Agents use II: 100x Engineer with Multi-agents [[slide]](slides/3_agent_use_2.pdf) | [Claude Code agent teams](https://code.claude.com/docs/en/agent-teams); [Software is changing (again)](https://www.youtube.com/watch?v=LCEmiRjPEtQ); [Research acceleration: The view inside OpenAI](https://openai.com/index/research-acceleration-view-inside-openai/); [more reading →](readings/sep-14.html) |  |
| 3 | 2026-09-16 | Juncheng Yang | Agents design I: context management and tool design [[slide]](slides/4_agent_design_1.pdf) | [ReAct](https://arxiv.org/abs/2210.03629); [A practical guide to building agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents); [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent); [more reading →](readings/sep-16.html) | **[Assignment 1](assignments/assignment1.html) due** Sun Sep 20, 11:59pm |
| 4 | 2026-09-21 | Students | Student sharing I | What you learned from using an agent (Assignment 1): surprises, failures, lessons, insights, new tools/skills/plugins | **[Assignment 2](assignments/index.html#assignment-2) out** (Mads-Loop: Build the loop) |
| 4 | 2026-09-23 | Juncheng Yang | Agents design II: multi-agent architecture, coordination, and communication [[slide]](slides/5_agent_design_2.pdf) | [multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system); [scaling agent systems](https://arxiv.org/pdf/2512.08296); [don’t build multi-agents](https://cognition.com/blog/dont-build-multi-agents); [more reading →](readings/sep-23.html) |  |
| 5 | 2026-09-28 | Juncheng Yang | Agents design III: agent memory and reliability [[slide]](slides/6_agent_design_3.pdf) | [where agents fail](https://arxiv.org/abs/2509.25370); [MemGPT](https://arxiv.org/abs/2310.08560); [more reading →](readings/sep-28.html) |
| 5 | 2026-09-30 | Juncheng Yang | Agent design IV: agent evaluation [[slide]](slides/7_agent_design_4.pdf) | [Agent evaluation and benchmarks](notes/agent-evaluation.html) | **[Assignment 2](assignments/index.html#assignment-2) due** Sun Oct 4, 11:59pm |
| 6 | 2026-10-05 | Harsh Nilesh Pathak (Snowflake) | Guest lecture: Developing and Evaluating Agents in Enterprise Setting |  | **[Assignment 3](assignments/index.html#assignment-3) out** (Mads-Opt: Make every token count) |
| 6 | 2026-10-07 | Juncheng Yang | Advanced agent design I: Cost and performance [[slide]](slides/8_agent_design_5.pdf) [[Assignment3 slide]](slides/8_assignment3.pdf) | [Cost-effective agents](notes/cost-effective-agents.html) | Pre-proposal due (optional and only submit if you want to discuss your ideas) |
| 7 | 2026-10-12 | *No class — Indigenous Peoples’ Day* | | | |
| 7 | 2026-10-14 | Students | Advanced agent design II: agent safety, self-evolving harness | [OWASP agentic top 10](https://genai.owasp.org/download/52117/?tmstv=1765059207); [more reading →](readings/oct-14.html) |  |
| **Part II — Systems for LLMs and agents** | | | | | |
| 8 | 2026-10-19 | Juncheng Yang | Efficient LLM serving basics I |  | **[Assignment 3](assignments/index.html#assignment-3) due** Tue Oct 20, 11:59pm |
| 8 | 2026-10-21 | Juncheng Yang | Efficient LLM serving basics II |  | **[Assignment 4](assignments/index.html#assignment-4) out** (Mads-Serve: Own the serving engine) |
| 9 | 2026-10-26 | Juncheng Yang and Students | Assignment Feedback and Student sharing II | Common pitfalls in your submission; Assignment 3 lessons sharing. |  |
| 9 | 2026-10-28 | Juncheng Yang | Efficient LLM serving basics III |  | **[Project proposal due](project.html#proposal)** |
| 10 | 2026-11-02 | Juncheng Yang | Efficient LLM serving: speculative decoding |  |  |
| 10 | 2026-11-04 | Juncheng Yang | Efficient agentic systems: scheduling and prefix caching |  | This lecture is earlier because of Assignment 4. |
| 11 | 2026-11-09 | Xianzheng Kou (Meta) | Guest lecture: Why Infrastructure sets the pace of AI |  | **[Assignment 4](assignments/index.html#assignment-4) due** Tue Nov 10, 11:59pm |
| 11 | 2026-11-11 | Juncheng Yang | Efficient LLM serving: pruning and quantization |  | **[Assignment 5](assignments/index.html#assignment-5) out** (Mads-Stack: Optimize the full stack) |
| 12 | 2026-11-16 | Students | Efficient LLM serving: KV-cache optimization and model architectures |  |  |
| 12 | 2026-11-18 | Students | Student sharing III | Demonstrate your agent-engine co-design (Assignment 4) |  |
| 13 | 2026-11-23 | Juncheng Yang | Efficient agentic system: routing and load balancing |  | **[Assignment 5](assignments/index.html#assignment-5) due** Sun Nov 29, 11:59pm |
| 13 | 2026-11-25 | *No class — Thanksgiving recess* | | | |
| 14 | 2026-11-30 | Juncheng Yang | Efficient agentic systems: others |

  |  |
| 14 | 2026-12-02 | Students | Student sharing IV | Showcase your full stack optimizations (Assignment 5) |  |
| 14 | 2026-12-07 | Students | Final project poster and demo | Present your final project as a poster and a live demo.     **Location: SEC 1.402 from 9:00 AM to 1:00 PM** | **Final project due** Tue Dec 8, 11:59pm |

---

# Reference pages

* [Agent evaluation and benchmarks](notes/agent-evaluation.html). Evaluation design, metrics, reliability, cost, and benchmark selection.
* [Cost-effective agents](notes/cost-effective-agents.html). Techniques for allocating models, reasoning, context, collaboration, and serving resources across complete tasks.

---

# Compute resources

Setup instructions for every environment the course uses are on the
[computing setup](computing/index.html) page. Compute for the assignments and the
[final project](project.html) comes from:

* [Claude Code](computing/claude-code.html). Required for Assignment 1.
* [Model API access](computing/api.html). Required for Assignments 2 and 3.
* [The course HPC](computing/cluster.html). Required for Assignments 4 and 5.
* [AWS](computing/aws.html). Register in week one; using the account is optional.

---

**Textbook.** No textbook is required. Background reading:

* Computer systems:
  [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/)
* Machine learning systems:
  [Machine Learning Systems](https://mlsysbook.ai)
* Large language models:
  [Foundations of Large Language Models](https://arxiv.org/abs/2501.09223)
* Deep learning:
  [The Little Book of Deep Learning](https://fleuret.org/francois/lbdl.html)

# Sponsors

We are grateful for the support of our sponsors.

[![Harvard Faculty of Arts and Sciences](sponsors/harvard-fas.svg)](https://www.fas.harvard.edu/)

The Claude license behind [Claude Code](computing/claude-code.html).

[![Harvard University Information Technology, Academic Technology for the Faculty of Arts and Sciences](sponsors/fas-atg.png)](https://atg.fas.harvard.edu/)

The [course HPC](computing/cluster.html), 72 CPU servers and 120
dedicated RTX PRO 6000 Blackwell servers. API access for OpenAI, Anthropic and Gemini models.

[![Amazon Web Services](sponsors/aws.png)](https://aws.amazon.com/)

[![Harvard University MaDSys: Measurement and Design of Systems](sponsors/madsys.png)](https://madsys.seas.harvard.edu/)

Software system, data and hardware support.

---
