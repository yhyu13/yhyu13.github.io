---
title: CS2680 Modern AI Systems — Policy & FAQ
source: https://cs2680.seas.harvard.edu/policy.html
fetched: 2026-10-19T16:28:00+00:00
source_kind: harvard-cs2680-official
---

# CS2680 Modern AI Systems — Policy & FAQ
CS2680 Modern AI Systems — Policy & FAQ

CS2680 Modern AI Systems: Agents and System Optimizations

Course policy and FAQ

## Background we assume

This is a graduate-level computer systems course. The first few meetings do not touch systems, but the second half is system-heavy. Some students read computer systems as a synonym for computer science, and the two are not interchangeable here.

If you are not familiar with most of the terms below, this course might not be a good fit for you: latency, throughput, tail latency, scalability, Amdahl’s law, process, threads, coroutine, concurrency, mutex, atomic operation, race condition, deadlock, starvation, cache coherence, false sharing, virtual memory, page fault, context switch, system call, interrupt, DMA, copy-on-write, NUMA, IOPS, locality, working set, LRU, write-ahead log, durability, transaction, ACID, serializability, B-tree, RPC, partitioning, fault tolerance, load balancing, congestion control, NIC, RDMA, batching, pipelining, asynchronous execution.

A few unfamiliar terms are not a problem, and the [background reading](index.html#overview) on the home page covers the usual gaps. The warning is about the case where most of the list is new to you.

---

## Grading breakdown

| Component | Weight |
| --- | --- |
| Assignment 1 — experience a coding agent: build a web UI for Claude Code | 10% |
| Assignment 2 — build an agent | 10% |
| Assignment 3 — make the agent smarter, faster, cheaper | 20% |
| Assignment 4 — serve your own agent | 20% |
| Assignment 5 — optimize the full stack | 10% |
| [Final project](project.html) | 20% |
| Class Participation | 10% |
| **Bonus** (optional presentations, course feedback & problems AI cannot solve) | up to 10% |

**We enforce a 20% A policy.** No more than 20% of the class receives an A, as announced in class.

---

## Leaderboard grading for Assignments 3 and 5

Assignment 3 and Assignment 5 are scored on a leaderboard. Each is scored out of 100 points, which scale to 20% of the course grade for Assignment 3 and 10% for Assignment 5 in the [breakdown above](#grading). Of those 100 points, 80 are for system performance and 20 are for the write-up (a published blog post) and the video.

The two assignments rank on different metrics. Assignment 3 ranks on task solve rate and cost. Assignment 5 ranks on task solve rate, API and GPU cost, and latency.

**Performance score.** The 80 performance points come from your rank on the leaderboard, and the provided baseline sets a floor under them:

performance score = max(80 − rank, 50 if you beat the baseline)

Beating the baseline therefore guarantees at least 50 of the 80 points, and the baseline is designed to be relatively easy to beat. At rank 30 the two terms are equal, so the floor changes nothing inside the top 30 and your score there is 80 − rank. Your score for the assignment is the performance score plus the write-up and video score.

Four cases, each with a write-up and video score of 18 out of 20:

| Rank | Baseline beaten | Performance | Assignment score |
| --- | --- | --- | --- |
| 35 | no | 45 | 63 |
| 35 | yes | 50 | 68 |
| 20 | yes | 60 | 78 |
| 5 | yes | 75 | 93 |

Most of you will not score 80 or higher on these two assignments. There are [bonus points](#bonus) available throughout the semester to make that up.

---

## Late days

You have **four late days** for the semester, to spend as you like across the assignments. Late days are counted in whole days: a submission one minute past the deadline consumes one full late day.

For Assignment 3, Assignment 5 and the project, the write-up is a published blog post and the deadline is the moment the **pull request is open** — not the moment it is merged.

* Late days are per student.
* Once your late days are exhausted, late work loses 20% of its value per day, to a floor of zero after five days.
* Late days **cannot** be applied to the student sharing sessions or the final project poster session.
* If something serious comes up (illness, family emergency, accommodation needs), email the instructor and TFs.

---

## Attending guest speakers' lectures

We plan to host guest speakers from industry who build the systems we study. These are among the most valuable sessions of the course and attendance is expected. Please come with questions — the speakers are giving up their time and a silent room is a wasted opportunity.

Recording, photographing, or redistributing guest lectures is not permitted unless the speaker explicitly agrees.

We will arrange meetings with the speakers to ensure that all students have the opportunity to interact with them. There will also be an optional lunch for anyone who wants to meet the speakers in a more relaxed setting.

---

## Bonus points

Bonus credit is capped at 10% overall, even when the activities below add up to more.

* **Optional presentations up to 4% each.** Present your Assignment 1 frontend at the sharing session or volunteer to present a paper during a discussion meeting. Each presentation can earn up to four bonus percentage points; the [presentation feedback criteria](discussion.html#presentation-feedback) explain how.
* **Course feedback up to 4%.** Substantive feedback on lectures, readings, assignments, or the pacing of the course, submitted during the semester. Critical feedback is worth the same as praise; it is usually worth more.
* **Problems current AI cannot solve, 2% each.** Find a question in this course's subject area that ChatGPT, Claude, and Gemini all get wrong — either they cannot solve it, or they answer confidently from expired knowledge.

### What counts as an AI-stumper submission

This field moves faster than model training runs, so a great deal of what these systems "know" about GPUs,
serving frameworks, and kernel APIs is quietly out of date. Finding those gaps is a genuinely useful skill
and it is the point of this exercise. A submission needs all four of:

* The **exact prompt**, reproducible verbatim.
* The **responses** from all three models, with the date and the model version you used.
* The **correct answer**, with evidence: a primary source, a specification, or a
  measurement you took yourself.
* A sentence on **why** the models failed: genuinely unsolved, out-of-date training data,
  a plausible-sounding fabrication, or a reasoning failure.

**The bar:** your answer must be right. A submission where the models were correct and you
were not earns nothing, and checking that carefully before submitting is most of the exercise.
Questions that are merely obscure trivia do not count; the question should matter to someone building
these systems.

---

## AI use policy

You are encouraged to use AI tools in this course.

**Disclose.** Every submitted artifact must include a short note describing which tools you used and for what: a couple of sentences is enough. Undisclosed AI use is an integrity violation; you will not be penalized for using AI tools in your assignments.

**Hand in the record.** Assignment 1 takes three artifacts: your code, the write-up, and an [archive of your Claude Code session files](computing/claude-code.html#export). Claude Code is required in every assignment, so each of the five takes the same three artifacts. We read these to see how the class is working with an agent and to give you feedback on it, and they may be used in grading as the evidence behind the process claims in your write-up. They add no separate weight to the [breakdown above](#grading).

**Own it.** You are responsible for everything you submit. If an AI tool generates code with a subtle bug, a benchmark with a methodological flaw, or a claim about a paper that the paper does not make, that is your error. In discussion, in your presentation, and in questions afterwards, you will be expected to explain your own work without assistance.

---

## Attendance, participation, and laptop use

Attendance is expected. Participation is 10% of the grade and cannot be earned from an empty seat. Paper presentations are optional and can earn bonus credit; participation can be earned throughout class discussions and student sharing sessions.

**The participation score is for active participation.** Many of you are already doing this well. However, we do not track attendance, so showing up is not participation on its own, and no participation means a participation score of zero.

Laptops and tablets are welcome for note-taking and learning. Please keep them closed during student presentations and guest lectures; presenting to a wall of screens is dispiriting, and your classmates deserve the same attention you will want when it is your turn.

If you must miss a class, no permission is needed. However, let the instructor and TFs know in advance.

---

## Religious and spiritual observance

Harvard supports students in observing their religious and spiritual traditions while participating fully in their academic work. If a religious or spiritual observance conflicts with a class meeting, an assignment, or any other course requirement, please contact me as early as possible so that we can try to identify an appropriate academic flexibility consistent with course requirements and University policies.

Because observances and practices vary across traditions and individuals, you do not need to limit requests to dates included on a published religious calendar. Students are encouraged to review the [Harvard Multifaith Calendar](https://www.hds.harvard.edu/community-life/religious-and-spiritual-life/multifaith-calendar) and the [Harvard Chaplains](https://chaplains.harvard.edu/) resources at the beginning of the semester, and to communicate anticipated conflicts early whenever possible.

---

## Academic integrity

Discussing ideas with classmates is encouraged. Reading papers together, arguing about a design, and debugging alongside each other are all part of how systems work gets done.

What is not acceptable: submitting work you did not do, copying text or code without attribution, fabricating experimental results, or misrepresenting what a measurement shows. Fabricated numbers are the one thing in this course that will be treated as a serious violation without exception — a systems paper whose evaluation cannot be trusted is worthless, and the same holds here.

The poster session, which carries half the final project grade, is partly peer-scored, and that puts two more items on that list: agreeing with somebody to trade favorable scores, and marking somebody down over a critical review you believe was theirs. Reviews are anonymous to the presenter and signed to the instructor for exactly that reason.

Cite your sources: papers, blog posts, repositories, and AI tools alike. All work is subject to the [Harvard College Honor Code](https://honorcouncil.fas.harvard.edu/honor-code) and to GSAS academic integrity policy where applicable.

---

## All students welcome

This course is intended for students of all backgrounds. Students come to AI systems from machine learning, from operating systems, from computational biology, and from industry, and the mix is what makes the discussions interesting. Nobody arrives knowing all of it.

Students needing academic accommodations should contact the [Disability Access Office](https://dao.fas.harvard.edu/) and let the instructor know as early in the semester as possible, ideally within the first two weeks.

---

## Auditing the course

Auditors are welcome if there is room. Please email the instructor before the first class. Auditors are expected to do the reading for discussion sessions they attend — the discussion format depends on it — but do not submit assignments and are not graded.

---

## Well-being and mental health

Graduate systems courses have a way of expanding to fill all available time. The five assignments are substantial, and the [final project](project.html) runs on top of the last of them — so scope the project to what the weeks actually hold rather than to what you would like it to be. If the workload is becoming unmanageable, talk to the instructor before it becomes a crisis; project scope in particular can usually be adjusted.

Harvard has resources available at any hour:

* [Counseling and Mental Health Services (CAMHS)](https://camhs.huhs.harvard.edu/). 617-495-2042, available 24/7
* [FAS Academic Resource Center](https://academicresourcecenter.harvard.edu/)

Your health matters more than any deadline on this page.

---

## Frequently asked questions

Questions that come up most often. If yours is not here, email the [course staff](index.html#staff) or come to office hours. If it is a good question it will end up on this page.

### Do I need to know CUDA?

No. No assignment requires it, and we do not assume prior CUDA experience. You can go further on your own if you want the kernel-level optimization path in Assignment 5.

### Is this a machine learning course?

No. Model quality matters here as a constraint and a measured outcome, not as the course's central object of study. We ask what it costs to serve an agent, and how an agent and system change moves cost, latency, throughput, or task success. If you want to study model architectures, or learning theory, this is the wrong course. If you want to know why inference is memory-bound and what anyone can do about it, this is the right one.

### What programming languages will be used?

You need to know Python and shell. You may touch JavaScript, C/C++, Rust or other programming languages during the course, but your agent should be able to help you navigate it.

### Is attendance mandatory?

Attendance is expected and participation is part of your grade.

### Will lectures be recorded?

No, the lectures will not be recorded.

### Can I audit the course?

Yes, if there is room. Email the instructor before the first class. We are not able to provide access to computing for auditing students.

### Is there an exam?

No. There is no midterm and no final.

### Do I need my own GPUs or pay for API costs?

No. We will cover all costs for the course as long as it is reasonable use for the course.

### How much work is this course?

Plan on reading a few papers each week, plus the five assignments. Expect to spend a significant amount of time learning and experimenting on your own after class. If you want an A, plan on it.

### My question is not here.

Email the [course staff](index.html#staff) or come to office hours. If it is a good question it will end up on this page.
