---
title: CS2680 Modern AI Systems — Paper Discussion
source: https://cs2680.seas.harvard.edu/discussion.html
fetched: 2026-10-19T16:28:00+00:00
source_kind: harvard-cs2680-official
---

# CS2680 Modern AI Systems — Paper Discussion
CS2680 Modern AI Systems — Paper Discussion

CS2680 Modern AI Systems: Agents and System Optimizations

Paper Discussion

## Paper discussion preparations

The two paper discussions are on Oct 14 (agent safety and self-evolving harnesses) and Nov 16 (KV-cache optimization and model architectures). Paper presentations are optional, and each can earn up to four bonus percentage points; students who want to present may volunteer individually or as a team. Everyone reads for every discussion, and the room comes prepared to test the papers' claims.

Read the assigned papers before class. You are not expected to understand every detail. You are
expected to have formed an opinion. Come with at least one thing you did not believe and one thing you
would have done differently.

Which papers are assigned for which meeting is on the [schedule](index.html#schedule). The
supplementary literature on each problem is announced alongside the meeting, and it is where to look when
you want the surrounding work or are choosing a paper to present voluntarily.

#### Questions to consider when reading each paper:

* What problem is this solving, and who actually has that problem?
* What changed in the hardware, the workload, or the models that made this problem worth solving now?
* What is the key insight, in one sentence, without jargon?
* What does the design give up in exchange? Every system trades something.
* Is the baseline fair? What baseline would have made the result look worse?
* What workload is being evaluated, and how representative is it?
* Which numbers would change if you doubled the model size, the context length, or the request rate?
* What would break this system in production that the paper does not discuss?
* Is the result still true on today's hardware, or was it a fact about a specific GPU generation?

## Class structure

Most discussion meetings cover two papers. When students volunteer, each paper is taken by an individual or team; otherwise the instructor supplies the opening context and leads the discussion. The usual shape is:

5 min

Instructor gives a brief context.

20 min

First presentation.

15 min

Open discussion.

20 min

Second presentation.

15 min

Open discussion.

A meeting with three assigned papers keeps the same shape with shorter slots. The instructor confirms the paper and timing with any volunteer presenters in advance.

## For presenters

If you volunteer, you or your team has about 20 minutes in a two-paper meeting. Structure the time roughly like this.

### 1. Background & motivation — about 5 minutes

Why should the room care?

#### Cover:

* The problem, stated concretely, ideally with a number that shows it hurts.
* What people did before this paper, and why it was not good enough.
* What changed to make this the right moment for this idea.

**Tip:** assume the audience read the paper. Do not spend five minutes explaining what a
KV cache is. Spend them explaining why this paper's authors thought the existing approach was
broken.

### 2. Key idea & design — about 8 minutes

What is the insight, and how is it realized?

#### Cover:

* The central idea in one sentence, before any mechanism.
* The mechanism: how the system is put together, using the paper's own figures where they are good
  and your own where they are not.
* The one hard part. Every systems paper has a place where the idea meets reality and gets
  complicated. Find it and explain it.

**Tip:** if you cannot explain the key idea without the paper's diagram, you probably do
not have it yet. Try explaining it to someone outside the course first.

### 3. Evaluation — about 5 minutes

Do the numbers support the claims?

#### Cover:

* The setup: hardware, models, workloads. Say it out loud, because it is often where the story is.
* The two or three figures that actually matter. Skip the rest.
* The baseline. Is it the strongest available alternative, or a convenient one?
* What is *not* measured.

#### Evaluation lens

For AI systems papers specifically: check whether throughput gains come at the cost of tail latency,
whether the workload's request-length distribution is realistic, whether "GPU utilization" means
occupancy or useful FLOPs, and whether the comparison holds the accuracy of the model fixed.

### 4. Discussion & takeaways — about 2 minutes

Hand the room something to argue about.

#### Cover:

* What you would keep from this paper if you were building a system tomorrow.
* What has been superseded since publication.
* **Two or three prepared discussion questions**, open-ended rather than factual. The
  goal is disagreement, not recall.

**Tip:** before you build the slides, read Patterson's [How to Give a Bad Talk](https://people.eecs.berkeley.edu/~pattrsn/talks/BadTalk.pdf) (circa 1983, with annotations by Mark D. Hill). It states ten rules for ruining a talk, and each one inverts into something you can act on: write large, use color, illustrate instead of describing, keep your eyes on the room, and cut slides rather than talk faster when you run long. Patterson names the tenth as the one that matters most, and it is the one this course asks of you. Practice out loud, against a clock, at least once.

## Presentation feedback

Each optional presentation can earn up to four bonus percentage points, one from each criterion. Two kinds of presentation qualify: a paper presentation at a discussion meeting, and the Assignment 1 frontend presentation at its sharing session. In the criteria below, the work is the paper you present or the system you built.

* **Content and understanding, up to 1%:** explain the work's problem, approach, and contribution accurately.
* **Slides and delivery, up to 1%:** use effective figures, organize the argument, and keep to the agreed time.
* **Critical analysis, up to 1%:** identify important strengths, weaknesses, assumptions, and missing evidence.
* **Discussion leadership, up to 1%:** bring questions that help the room test the work's claims.

Send slides to the instructor at least **24 hours before** the session if you would like feedback before presenting.

## For the audience

Participation is 10% of your grade. It is earned across class discussions and
[student sharing sessions](index.html#schedule); volunteering for a paper presentation is
welcome but not required.

#### How to participate effectively:

* Read the paper. Not the abstract. The paper.
* Arrive with one question written down. Having it on paper makes it far more likely you will ask it.
* Ask about the thing you did not understand. You are reliably not the only one.
* Push on evaluation claims. "What was the baseline configured to do?" is almost always a good question.
* Connect papers to each other and to the lectures, because this is where the good discussions come from.
* Disagree with the paper, with the presenter, and with the instructor. Do it about the ideas.

Quality counts more than volume. One sharp question is worth more than five comments.

## Effective paper reading strategy

Adapted from Keshav's three-pass approach. Budget your attention, because not every paper
deserves the same depth.

### Pass 1 (10–30 min): triage and mental map

Decide whether and how to keep reading.

#### Do:

* Read the title, abstract, and introduction carefully.
* Read section headings; ignore the body.
* Look at every figure and read its caption.
* Read the conclusion. Skim the references for what you recognize.

#### Outcome:

* You can state the category, the context, the core claim, and whether the evaluation looks
  credible.

**Tip:** if you cannot say what problem the paper solves after pass 1, that is usually a
fact about the paper's writing, not about you.

### Pass 2 (1–2 hrs): understand & evaluate

Grasp the design and judge the evidence.

#### Identify:

* The system's architecture and the one or two mechanisms doing the real work.
* Every assumption the design depends on, about the workload, the hardware, and the model.
* The experimental setup, and which claims each figure actually supports.
* What the authors chose not to measure.

#### Outcome:

* You could summarize the paper to a colleague and defend or attack its central claim.

### Pass 3 (deep dive): re-derive & stress-test

Read as though you were the author, and then as the reviewer.

#### Do:

* Reconstruct the design yourself before reading how they did it; compare your choices to theirs.
* Sanity-check the headline numbers against a back-of-the-envelope estimate: bandwidth,
  FLOPs, memory capacity. Do they even make sense?
* Look for the unstated assumption that makes the result work.
* Ask what the paper would look like if the result had been negative.

#### Outcome:

* You could reimplement the system, and you know exactly where it would fall over.

Use pass 1 on everything, pass 2 on the papers assigned for discussion, and pass 3 on the paper you are
presenting and on anything close to your own work. **Reading fewer papers more carefully beats
skimming many.**

#### Additional resources:

* [Keshav: How to Read a Paper](https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf)
* [Ousterhout: Always Measure One Level Deeper](https://cacm.acm.org/research/always-measure-one-level-deeper/)
* [Orca (OSDI '22)](https://www.usenix.org/conference/osdi22/presentation/yu) — a good model of a well-argued systems evaluation
