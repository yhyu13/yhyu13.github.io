/**
 * content.mjs - the slide content model for the CS2680 study site.
 *
 * Every fact below is taken from the course digest in courseware/_digest/
 * (part1.md, part2.md, part3.md).  Page markers such as (p42) refer to the
 * digest's own page markers for the upstream PDF.  Nothing here is authored
 * from outside the digest: slide titles, section labels and one-line summaries
 * are connective tissue; numbers, names, dates, benchmarks, paper titles and
 * quoted phrases are quoted from the digest.
 */

const S = 'https://cs2680.seas.harvard.edu';

export const DECKS = [
  /* ==================================================================== */
  /* 1. course-overview                                                    */
  /* ==================================================================== */
  {
    id: 'course-overview',
    slug: 'course-overview',
    title: 'Course overview',
    navTitle: 'Course overview',
    navBlurb: 'The thesis, the two halves of the course, the 14-week map, the five assignments and the grading.',
    footerLabel: 'CS2680 · Course overview',
    source: `${S}/index.html`,
    sources: [
      { url: `${S}/index.html`, label: 'course home - schedule, grading list, announcements' },
      { url: `${S}/slides/1_intro.pdf`, label: 'Lecture 1 - course overview and logistics' },
      { url: `${S}/assignments/index.html`, label: 'the five assignments and their weights' },
      { url: `${S}/project.html`, label: 'final project specification' },
      { url: `${S}/policy.html`, label: 'course policy' },
    ],
    slides: [
      {
        layout: 'cover',
        kicker: 'Harvard SEAS · CS2680 · Fall 2026 · Juncheng Yang',
        title: 'Modern AI Systems: Agents and System Optimizations',
        lede: 'One course, two halves: what an agent is made of, and what it costs to run one and how to know it works.',
        pills: ['14-week course', '8 published lecture decks', '3 reference notes', '5 assignments', 'No exam'],
        meta: 'Course site: https://cs2680.seas.harvard.edu/ · MaDSys Group, Harvard SEAS',
        notes:
          'Landing deck for the course. The object of study is the whole agentic serving system, not the model. Everything in this site restates published Harvard material; the final slide of every deck names its upstream URL.',
      },
      {
        layout: 'quote',
        text: 'This is where capability becomes product ... and it is harder than the AI itself.',
        attribution: 'Lecture 1, PDF page 29 - Juncheng Yang',
        notes:
          'The category shift the lecture opens with: students arrive asking "which model" and are told the interesting problem is how you train and serve it at scale. The course inherits the MaDSys framing - efficiency, reliability, performance, sustainability.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'What kind of course this is',
        title: 'A systems course about agents',
        cards: [
          {
            h: 'Background assumed',
            p: 'A graduate computer systems course: one prior graduate-level systems course (operating systems, networking, databases, architecture) plus real systems experience.',
          },
          {
            h: 'Shape of the course',
            p: 'Foundations in the first few classes, then Systems for LLMs & agents for the majority: GPU programming and kernels, batching, scheduling and memory management, load balancing and routing, KV-cache and prefix cache, agent serving systems.',
          },
          {
            h: 'Where the money goes',
            p: 'Inference, not training, is the cost center. The lecture is explicit that throughput is the wrong objective for an agent.',
          },
        ],
        notes:
          'Background poll on the Lecture 1 slides covers operating systems, distributed systems, databases, computer networking, computer architecture, transformer architecture, TP/PP/DP/EP, iteration-level scheduling and pagedAttention, linear attention, GPU programming and the Linux kernel. CUDA is not required; comfort with Python and PyTorch is.',
      },
      {
        layout: 'compare',
        kicker: 'Two halves',
        title: 'Part I and Part II',
        lede: 'Part I spans Sep 2 - Oct 14, 2026. Part II spans Oct 19 - Dec 7, 2026.',
        left: {
          h: 'Part I - what an agent is made of',
          li: [
            'Agents use I and II: how Claude Code works, then multi-agent practice',
            'Agent design I to IV: context management and tool design, multi-agent architecture, memory and reliability, evaluation',
            'Advanced agent design I: cost and performance',
            'Nine published slide PDFs: eight lecture decks plus the Assignment 3 briefing',
          ],
        },
        right: {
          h: 'Part II - serving, and what is not published',
          li: [
            'Efficient LLM serving basics I to III',
            'Speculative decoding, pruning and quantization, KV-cache optimization and model architectures',
            'Efficient agentic systems: scheduling and prefix caching, routing and load balancing, others',
            'No slide deck has been published for any Part II lecture',
          ],
        },
        notes:
          'Part I is published and mirrored. Part II has dates and topics on the schedule but no slide decks - the "part-ii-status" deck states exactly what is and is not published.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Curriculum map · 1 of 2',
        title: 'The 14 weeks, Part I',
        lede: 'Every row below is a row of the published course schedule.',
        cols: ['Week', 'Date', 'Topic', 'Session type', 'Slides'],
        rows: [
          ['1', '2026-09-02', 'Course overview and logistics', 'Instructor lecture', 'Yes - 1_intro.pdf'],
          ['2', '2026-09-07', 'No class - Labor Day', 'No class', 'No'],
          ['2', '2026-09-09', 'Agents use I: How Claude Code Works', 'Instructor lecture', 'Yes - 2_agent_use_1.pdf'],
          ['3', '2026-09-14', 'Agents use II: 100x Engineer with Multi-agents', 'Instructor lecture', 'Yes - 3_agent_use_2.pdf'],
          ['3', '2026-09-16', 'Agents design I: context management and tool design', 'Instructor lecture', 'Yes - 4_agent_design_1.pdf'],
          ['4', '2026-09-21', 'Student sharing I (Assignment 1)', 'Student-led', 'No'],
          ['4', '2026-09-23', 'Agents design II: multi-agent architecture, coordination, and communication', 'Instructor lecture', 'Yes - 5_agent_design_2.pdf'],
          ['5', '2026-09-28', 'Agents design III: agent memory and reliability', 'Instructor lecture', 'Yes - 6_agent_design_3.pdf'],
          ['5', '2026-09-30', 'Agent design IV: agent evaluation', 'Instructor lecture', 'Yes - 7_agent_design_4.pdf'],
          ['6', '2026-10-05', 'Guest lecture: Developing and Evaluating Agents in Enterprise Setting (Harsh Nilesh Pathak, Snowflake)', 'Guest lecture', 'No'],
          ['6', '2026-10-07', 'Advanced agent design I: Cost and performance', 'Instructor lecture', 'Yes - 8_agent_design_5.pdf and 8_assignment3.pdf'],
          ['7', '2026-10-12', 'No class - Indigenous Peoples\' Day', 'No class', 'No'],
          ['7', '2026-10-14', 'Advanced agent design II: agent safety, self-evolving harness', 'Student-led (paper discussion)', 'No'],
        ],
        notes:
          'The Oct 7 row is the only row with two slide files attached: the cost and performance deck and the Assignment 3 briefing. The schedule may change during the semester, and grading may change as well.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Curriculum map · 2 of 2',
        title: 'The 14 weeks, Part II',
        lede: 'Part II has dates and topics, but no published slide deck and no published assignment 4 or 5 spec.',
        cols: ['Week', 'Date', 'Topic', 'Session type', 'Slides'],
        rows: [
          ['8', '2026-10-19', 'Efficient LLM serving basics I', 'Instructor lecture', 'No - Part II, slides not published'],
          ['8', '2026-10-21', 'Efficient LLM serving basics II', 'Instructor lecture', 'No - Part II, slides not published'],
          ['9', '2026-10-26', 'Assignment Feedback and Student sharing II', 'Instructor + students', 'No'],
          ['9', '2026-10-28', 'Efficient LLM serving basics III', 'Instructor lecture', 'No - Part II, slides not published'],
          ['10', '2026-11-02', 'Efficient LLM serving: speculative decoding', 'Instructor lecture', 'No - Part II, slides not published'],
          ['10', '2026-11-04', 'Efficient agentic systems: scheduling and prefix caching', 'Instructor lecture', 'No - Part II, slides not published'],
          ['11', '2026-11-09', 'Guest lecture: Why Infrastructure sets the pace of AI (Xianzheng Kou, Meta)', 'Guest lecture', 'No'],
          ['11', '2026-11-11', 'Efficient LLM serving: pruning and quantization', 'Instructor lecture', 'No - Part II, slides not published'],
          ['12', '2026-11-16', 'Efficient LLM serving: KV-cache optimization and model architectures', 'Student-led (paper discussion)', 'No'],
          ['12', '2026-11-18', 'Student sharing III (Assignment 4: agent-engine co-design)', 'Student-led', 'No'],
          ['13', '2026-11-23', 'Efficient agentic system: routing and load balancing', 'Instructor lecture', 'No - Part II, slides not published'],
          ['13', '2026-11-25', 'No class - Thanksgiving recess', 'No class', 'No'],
          ['14', '2026-11-30', 'Efficient agentic systems: others', 'Instructor lecture', 'No - Part II, slides not published'],
          ['14', '2026-12-02', 'Student sharing IV (Assignment 5: full stack optimizations)', 'Student-led', 'No'],
          ['14', '2026-12-07', 'Final project poster and demo (SEC 1.402, 9:00 AM to 1:00 PM)', 'Student-led', 'No'],
        ],
        notes:
          'Fifteen rows for Part II and no slide PDF for any of them. The Nov 30 row is reconstructed from the published site because its readings cell contains only HTML comments.',
      },
      {
        layout: 'table',
        kicker: 'Deliverables',
        title: 'The five Mads assignments',
        lede: 'Mads abbreviates Modern Agent Design and Systems, and nods to Harvard\'s MaDSys group. All five are individual.',
        cols: ['#', 'Codename', 'Title', 'Weight', 'Out', 'Due', 'Effort'],
        rows: [
          ['1', 'Mads-Lens', 'Watch the agent work - "Experience a coding agent: build a web UI for Claude Code"', '10%', 'Wed Sep 2', 'Sun Sep 20, 11:59pm', '4-6 hours'],
          ['2', 'Mads-Loop', 'Build the loop - "Build an agent harness"', '10%', 'Mon Sep 21', 'Sun Oct 4, 11:59pm', '10-12 hours'],
          ['3', 'Mads-Opt', 'Make every token count - "Harness competition"', '20%', 'Mon Oct 5', 'Tue Oct 20, 11:59pm', '10-15 hours'],
          ['4', 'Mads-Serve', 'Own the serving engine - "Serve your own agent"', '20%', 'Wed Oct 21', 'Tue Nov 10, 11:59pm', '10-14 hours'],
          ['5', 'Mads-Stack', 'Optimize the full stack - "Optimize the full stack"', '10%', 'Wed Nov 11', 'Sun Nov 29, 11:59pm', '12-18 hours'],
        ],
        notes:
          'The sequence walks down the stack: use an agent, replace the runtime with your own loop, optimize everything around a black-box API, remove the API and own the serving engine, then optimize the whole stack. Only assignments 1 to 3 have a published full specification.',
      },
      {
        layout: 'table',
        kicker: 'Grading',
        title: 'How the grade is built',
        lede: 'As published on the assignments index and the policy page, cross-checked against the home page grading list, the to_release table and the assignment 1 to 3 spec headers.',
        cols: ['Component', 'Weight'],
        rows: [
          ['Assignment 1 - Mads-Lens', '10%'],
          ['Assignment 2 - Mads-Loop', '10%'],
          ['Assignment 3 - Mads-Opt', '20%'],
          ['Assignment 4 - Mads-Serve', '20%'],
          ['Assignment 5 - Mads-Stack', '10%'],
          ['Final project', '20%'],
          ['Class participation', '10%'],
          ['Bonus', 'up to 10%'],
        ],
        note: 'No exam, midterm or final. At most 20% of the class receives an A. The five assignments together are 70% of the grade.',
        notes:
          'The weights here are the ones the digest cross-checked in four published places. The next slide shows the one place where a published page prints a different split, and how it was resolved.',
      },
      {
        layout: 'compare',
        kicker: 'A published disagreement',
        title: 'Two printed weightings of the same course',
        lede: 'The Lecture 1 slide printed one split; the assignments index and policy page print another. Both are published, so both are shown here rather than one being chosen silently.',
        left: {
          h: 'Lecture 1, PDF page 16 (Sep 2, 2026)',
          li: [
            'Five assignments 70%: 1, 2 and 4 at 10% each; 3 and 5 at 20% each',
            'Project 16%',
            'Presentation 10% (paper + Assignment 1)',
            'Participation 4%',
            'Bonus 10%',
          ],
        },
        right: {
          h: 'Assignments index and policy page',
          li: [
            'Five assignments 70%: 1, 2 and 5 at 10% each; 3 and 4 at 20% each',
            'Final project 20%',
            'Class participation 10%',
            'Bonus up to 10%',
            'No exam, midterm or final',
          ],
        },
        note: 'Lecture 2, PDF page 2 records the change one week later: LLM background moves later, two extra lectures on agent design, fewer GPU lectures, no mandatory paper presentation, score goes to participation and project, Assignment 1 sharing is now a bonus. The right-hand column is the split that the assignments index, the to_release table, the home page grading list and the Assignment 1 to 3 spec headers all agree on.',
        notes:
          'Do not paper over this. The digest records both published statements. The right-hand column is the one the assignment specs, the leaderboard page and the policy page agree on, and the Lecture 2 slide documents the change.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Final project',
        title: 'One problem, one claim, one set of measurements',
        cards: [
          {
            h: 'Two tracks',
            p: 'Product (build an AI system that solves a real problem better than the strongest available alternative) or research (make an original, falsifiable claim). Same deadlines, deliverables and rubric; the research track is held to a higher standard of novelty and evidence.',
          },
          {
            h: 'The gap requirement',
            p: 'Product: run at least three of the closest commercial tools, open-source systems or research prototypes on your own task, give the same input directly to a frontier model, describe how each one fails, and end with the gap in one testable sentence.',
          },
          {
            h: 'Goals ladder',
            p: '75% is the minimum result you are confident you can deliver even if the main idea fails; 100% is what you plan to deliver; 125% is an extension attempted if you reach 100% early. The blog post reports which level you reached.',
          },
          {
            h: 'Rubric',
            p: 'Four dimensions weighted equally for both tracks: problem and motivation, technical execution, evaluation, reporting. A project whose main idea fails can still earn nearly full credit if the blog explains what you expected, what you measured, and why they differ.',
          },
        ],
        notes:
          'The project is the same skill set as the assignments with the problem inverted: students must choose the evaluation rather than receive it. The full spec is on the course project page.',
      },
      {
        layout: 'table',
        kicker: 'Final project',
        title: 'Project milestones',
        cols: ['When', 'What', 'Weight'],
        rows: [
          ['Wed Oct 28, 11:59pm', 'Proposal PDF on Canvas - nine sections, no page limit', '2%'],
          ['Mon Dec 7, 9:00am-1:00pm', 'Poster and live demo, SEC 1.402, in person, with peer evaluation', '10%'],
          ['Tue Dec 8, 11:59pm', 'Blog post pull request to the course blog repository, plus the repository', '8%'],
        ],
        note: 'Individual, 20% of the course grade in total. The project overlaps Assignment 4 (due Tue Nov 10) and Assignment 5 (due Sun Nov 29), so the poster and blog post must start before the final week. Late days do not apply to the poster session.',
        notes:
          'A visitor at the poster should find problem, gap, system or experiment, and main result in a few minutes; include at least one figure legible from two meters, and a live demo that runs reliably in about two minutes.',
      },
      {
        layout: 'bullets',
        kicker: 'House rules',
        title: 'Late days, bonus, and the A policy',
        items: [
          {
            h: 'Four late days for the semester',
            p: 'Counted in whole days and spendable across assignments. A submission one minute late consumes a full day. Once they are exhausted, late work loses 20% of its value per day, to a floor of zero after five days.',
          },
          {
            h: 'Bonus, capped at 10% overall',
            p: 'Optional presentations up to 4% each; course feedback up to 4% - the home page says up to 6%; problems current AI cannot solve at 2% each. An AI-stumper submission needs the exact prompt, the responses from ChatGPT, Claude and Gemini with date and model version, the correct answer with evidence, and a sentence on why the models failed.',
          },
          {
            h: 'At most 20% of the class receives an A',
            p: 'There is no exam, midterm or final. Lectures are not recorded. Auditing is allowed if there is room; auditors do not submit assignments and are not graded.',
          },
        ],
        notes:
          'Auditors do the reading for sessions they attend, do not submit assignments, are not graded, and are not provided computing. Attendance is not tracked for participation; participation is earned for active participation.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'What this site contains',
        title: 'Fourteen decks, one visual system',
        cards: [
          {
            h: 'Eight lecture decks',
            p: 'One deck per published lecture, in order, each with its speaker notes and its upstream PDF URL.',
          },
          {
            h: 'Three reference notes',
            p: 'Agent evaluation and benchmarks, cost-effective agents, and the optional transformers background.',
          },
          {
            h: 'Course mechanics',
            p: 'The five assignments, the final project, the policy, and a deck that states plainly which Part II material is not published yet.',
          },
        ],
        notes:
          'The site is a static artifact: no build step, no server, no network. Every deck names the upstream URL it was generated from, and the generator checks every number on every page against the course digest.',
      },
    ],
  },

  /* ==================================================================== */
  /* 2. lecture-01                                                         */
  /* ==================================================================== */
  {
    id: 'lecture-01',
    slug: 'lecture-01',
    title: 'Lecture 1 - Course overview and logistics',
    navTitle: 'Lecture 1 - Course overview',
    navBlurb: 'The category shift from AI/ML to AI Systems, what makes agent serving different, and the systems problems the course will solve.',
    footerLabel: 'CS2680 · Lecture 1 · 1_intro.pdf',
    source: `${S}/slides/1_intro.pdf`,
    sources: [
      { url: `${S}/slides/1_intro.pdf`, label: 'Lecture 1 slide deck - 50 pages' },
      { url: `${S}/index.html`, label: 'course home - schedule and announcements' },
    ],
    slides: [
      {
        layout: 'cover',
        kicker: 'Lecture 1 · Sep 2, 2026 · 50 slides',
        title: 'Course overview and logistics',
        lede: 'A graduate systems course on agentic AI systems. The object of study is the whole agentic serving system, not the model.',
        pills: ['AI/ML vs AI Systems', 'What makes agent serving different', 'The systems problems ahead'],
        meta: 'Instructor: Juncheng Yang · slides/1_intro.pdf',
        notes:
          'Lecture 1 is the map for the whole course. Two things to hold on to: the model sets the ceiling, and the harness plus the serving system decide what you actually get.',
      },
      {
        layout: 'compare',
        kicker: 'The category shift',
        title: 'AI/ML asks one question, AI Systems asks another',
        left: {
          h: 'AI/ML',
          p: '"What model should we use?"',
          li: ['Optimizes accuracy', 'Optimizes capability'],
        },
        right: {
          h: 'AI Systems',
          p: '"How do we train and serve it at scale?"',
          li: ['Optimizes GPU utilization', 'Optimizes resource waste', 'Optimizes downtime', 'Optimizes carbon'],
        },
        notes:
          'The deck contrasts the two questions and the four optimization targets under each. This is the framing the MaDSys group brings: efficiency, reliability, performance, sustainability.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'Compute differences',
        title: 'An agentic workload is not a transformer workload',
        cards: [
          {
            h: 'Heterogeneous work split',
            p: 'CPU lane: tokenization, kernel launch, data movement, tool calls. GPU lane: matmul.',
          },
          {
            h: 'Distinct phases',
            p: 'Prefill is compute-bound; decode is memory-bandwidth-bound.',
          },
          {
            h: 'Output-length-dependent runtime',
            p: 'Execution time depends on how long the answer is, which complicates scheduling.',
          },
        ],
        notes:
          'Why this matters for a course about agents: the tool-call phase runs on the CPU while the model phase runs on the GPU, and the two cannot be batched the same way.',
      },
      {
        layout: 'twocol',
        kicker: 'Non-determinism',
        title: 'The same request does not always give the same answer',
        left: {
          h: 'Where it comes from',
          li: [
            'Runtime: warp and block scheduling, memory ordering, async streams, batch size',
            'Software: fused multiply-add, autotuning, subnormals',
            'Hardware: CUDA vs tensor core, Hopper FP8 vs Blackwell micro-scaling tiles',
          ],
        },
        right: {
          h: 'Why it matters',
          p: 'Floating-point addition is not associative, so a shift in the 7th decimal of a matmul can flip the next token.',
          li: ['Approximate computing is acceptable', 'The consequence is that single runs are not measurements'],
        },
        notes:
          'Do not let students treat a single run as a result. This is the same argument the evaluation lecture later makes about non-determinism making single-run scores noise rather than signal.',
      },
      {
        layout: 'table',
        kicker: 'The remaining differences',
        title: 'State, communication, churn, reliability and power',
        cols: ['Dimension', 'What the deck records'],
        rows: [
          ['State', 'Model weights GBs to TBs; KV-cache 10s-100s KB per token; prefix cache reuses KV across requests'],
          ['Communication', 'Pipeline, tensor, expert and context parallelism; NCCL, UCCL; NVLink, Ethernet/InfiniBand, RDMA'],
          ['Churn', 'MHA, GQA, MLA, NSA, linear attention; workloads: multi-turn chat, problem solving, RAG, agents'],
          ['Reliability', '9% AFR, 50,000hr MTBF; one GPU fails every 3 hours in a 16K-GPU cluster'],
          ['Power', 'CPU 100-300W, GPU 700-1000W, 4-8 GPUs per server; server power 800W to 6,000W, an 8x increase'],
        ],
        notes:
          'The lecture walks these as structural differences, not incidental ones. The 9% AFR figure and the 50,000hr MTBF set the bar that a serving system has to clear.',
      },
      {
        layout: 'flow',
        kicker: 'The agent',
        title: 'A new kind of programmable computer',
        lede: 'An agent is an autonomous software system that uses an AI model to reason about a goal, use external tools, and execute multi-step actions until the task is finished.',
        nodes: [
          { h: 'Plan', p: 'step 1' },
          { h: 'Act', p: 'step 2' },
          { h: 'Observe', p: 'step 3' },
          { h: 'Adapt', p: 'step 4', hl: true },
          { h: 'Deliver', p: 'step 5' },
        ],
        note: 'The computer analogy: context window as RAM, tools as peripherals, agent harness as OS, agent as application - a different programming model and a different failure model.',
        notes:
          'The five steps are printed on the deck as 1 plan, 2 act, 3 observe, 4 adapt, 5 deliver. The computer analogy is what makes the systems framing work: if the harness is the OS, then everything the OS is responsible for is on the table.',
      },
      {
        layout: 'twocol',
        kicker: 'Why agents',
        title: 'LLMs are strange computers',
        left: {
          h: 'Superhuman at',
          li: ['Recalling factual knowledge', 'Language', 'Pattern matching', 'Generating code', 'Operating across many domains'],
        },
        right: {
          h: 'Surprisingly weak at',
          li: ['Persistent memory', 'Reliably understanding context', 'Avoiding hallucinations', 'Knowing what they do not know', 'Security and adversarial input'],
        },
        note: 'The deck links a video on LLM strengths and weaknesses: https://www.youtube.com/watch?v=LCEmiRjPEtQ&t=874',
        notes:
          'The framing the lecture uses twice: LLMs are superhuman and incompetent at the same time. The weaknesses on the right are exactly the problems the harness has to solve.',
      },
      {
        layout: 'compare',
        kicker: 'Serving',
        title: 'Agent serving replaces request-inference-response',
        left: {
          h: 'Classic serving',
          li: ['Request', 'Inference', 'Response'],
        },
        right: {
          h: 'Agent serving',
          li: ['Infer', 'Tool', 'Infer', 'Tool', 'Retrieval', 'Infer'],
        },
        note: 'The critical path now spans GPU, CPU, storage, network and external services.',
        notes:
          'This is the structural difference the whole course is built on. Once a tool call sits between two inference calls, no single model call owns the latency budget.',
      },
      {
        layout: 'arch',
        kicker: 'The stack',
        title: 'Where the agent sits in the serving stack',
        tiers: [
          {
            name: 'Application',
            cells: [{ h: 'User', p: 'the request' }],
          },
          {
            name: 'Agent / Harness',
            hl: true,
            cells: [
              { h: 'Planning', p: 'and re-planning' },
              { h: 'Context', p: 'window management' },
              { h: 'Memory', p: 'across sessions' },
              { h: 'Tools', p: 'and subagents' },
            ],
          },
          {
            name: 'Model',
            cells: [{ h: 'Inference', p: 'the only part that was already a system' }],
          },
          {
            name: 'Serving system',
            cells: [
              { h: 'Batching', p: 'and scheduling' },
              { h: 'Routing', p: 'across models' },
              { h: 'Caching', p: 'KV and prefix' },
            ],
          },
          {
            name: 'Runtime / Kernels',
            cells: [{ h: 'CUDA, Triton', p: 'and collectives' }],
          },
          {
            name: 'Hardware',
            cells: [{ h: 'GPUs and CPUs', p: 'and an external environment' }],
          },
        ],
        note: 'The external environment is where tools live; the stack runs from application down to hardware, with the environment alongside it.',
        notes:
          'Walk the stack from the top: the interesting work is in the agent and harness tier, and the serving system below it has to be shaped around what the harness does.',
      },
      {
        layout: 'compare',
        kicker: 'The objective',
        title: 'Throughput is the wrong objective for an agent',
        left: {
          h: 'Useful but insufficient',
          li: ['TTFT / TPOT', 'Tool-call latency', 'GPU utilization'],
        },
        right: {
          h: 'Actually optimized',
          li: [
            'Task success / accuracy',
            'End-to-end latency',
            'Tokens per task',
            'Dollars per successful task',
            'Energy per successful task',
          ],
        },
        note: 'The objective is to maximize task success subject to latency, cost, resources, reliability and security. More tokens per second can still mean a slower, costlier agent.',
        notes:
          'This is the scoreboard the rest of the course tries to move. Everything in Part II - cost decomposition, Pareto ranking, the leaderboard - is an attempt to move one of the numbers on the right.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'The syllabus in disguise',
        title: 'Every agentic workload property is a systems problem',
        lede: 'The lecture calls this table the effective syllabus: each row is a lecture topic later in the course.',
        cols: ['Workload property', 'Systems problem it names'],
        rows: [
          ['Long trajectories', 'State and context management'],
          ['Repeated prefixes', 'Prefix caching'],
          ['Tool dependencies', 'Dependency-aware scheduling'],
          ['Variable tool latency', 'Asynchronous execution'],
          ['Multiple agents', 'Orchestration and communication'],
          ['Huge context', 'Memory hierarchy and retrieval'],
          ['Branching reasoning', 'Speculative execution'],
          ['Different models', 'Routing'],
          ['External side effects', 'Security and isolation'],
          ['Long-running tasks', 'Checkpointing and fault tolerance'],
        ],
        notes:
          'Ten rows, ten problems. Point out that the first two rows are the subject of Lecture 2, the fifth is Lecture 3, and the seventh is the speculative-decoding lecture in Part II.',
      },
      {
        layout: 'flow',
        kicker: 'Observability',
        title: 'The trace becomes a nested trajectory',
        lede: '"You cannot optimize what you cannot observe."',
        nodes: [
          { h: 'Session', p: 'the whole run' },
          { h: 'Turn', p: 'one user turn' },
          { h: 'Agent step', p: 'one loop iteration' },
          { h: 'Model request', p: 'one inference', hl: true },
          { h: 'Tool call', p: 'and tool result' },
        ],
        note: 'The subagent is a recursive branch of the same structure.',
        notes:
          'The distributed trace becomes a trajectory with nesting: session, turn, agent step, model request, tool call, tool result, subagent. This is the instrumentation the assignment session logs are the student-side version of.',
      },
      {
        layout: 'twocol',
        kicker: 'Scope',
        title: 'What this course does not cover',
        left: {
          h: 'Explicitly out of scope',
          li: [
            'Training and the data pipeline',
            'Checkpoints',
            'Pre-training, fine-tuning, post-training, RL rollout',
            'Cluster management',
            'Model architecture design and communication',
            'Power and energy; new hardware design',
          ],
        },
        right: {
          h: 'In scope',
          li: [
            'Inference and serving',
            'The agent harness',
            'Context and memory management',
            'Scheduling, caching, routing and batching',
            'Observability and fault tolerance',
          ],
        },
        notes:
          'The exclusions are printed on the deck. It is worth saying out loud that Part II is where the serving material lands.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Adoption',
        title: 'Two ladders of agent adoption',
        cards: [
          {
            h: 'AI use levels',
            li: [
              '1 - Chat',
              '2 - Coding agent with MCP, Skills or Plugins, subagent, parallel agent',
              '3 - Customized agent',
            ],
          },
          {
            h: 'Agentic Coding Levels',
            li: ['0 - No AI', '1 to 5, ending at parallel agents'],
          },
        ],
        notes:
          'The lecture asks the room where it sits on both ladders, so students can see which parts of the course they already have intuition about.',
      },
      {
        layout: 'bullets',
        kicker: 'The course questions',
        title: 'Nine questions the course is built to answer',
        lede: 'Printed on the deck as the questions the course will work through.',
        items: [
          {
            h: 'Serving and scheduling',
            li: [
              'Why does batching improve throughput but hurt agent latency?',
              'When should we use a larger model?',
              'Where should KV and prefix state live?',
              'Can tool calls overlap with inference?',
            ],
          },
          {
            h: 'Agents and operations',
            li: [
              'When should we spawn a subagent?',
              'How do we route across heterogeneous GPUs and models?',
              'How do we recover a 30-minute agent?',
              'How do we optimize dollars per successful task?',
            ],
          },
        ],
        notes:
          'Nine questions. Every later lecture answers one or two of them. Keep this slide in mind when the course returns to cost, evaluation and serving.',
      },
    ],
  },

  /* ==================================================================== */
  /* 3. lecture-02                                                         */
  /* ==================================================================== */
  {
    id: 'lecture-02',
    slug: 'lecture-02',
    title: 'Lecture 2 - How Claude Code works',
    navTitle: 'Lecture 2 - How Claude Code works',
    navBlurb: 'The agentic loop, the six layers of context, the permission layer, memory as rented context, and the four extension mechanisms.',
    footerLabel: 'CS2680 · Lecture 2 · 2_agent_use_1.pdf',
    source: `${S}/slides/2_agent_use_1.pdf`,
    sources: [
      { url: `${S}/slides/2_agent_use_1.pdf`, label: 'Lecture 2 slide deck - 53 pages' },
      { url: `${S}/notes/agent-evaluation.html`, label: 'reference note - agent evaluation and benchmarks' },
    ],
    slides: [
      {
        layout: 'cover',
        kicker: 'Lecture 2 · Sep 9, 2026 · 53 slides',
        title: 'Agent from a user\'s perspective I: how Claude Code works',
        lede: 'The concrete artifact of the course: one user prompt, many model calls, many tool executions - and a harness that owns context, permissions and memory.',
        pills: ['The agentic loop', 'Context', 'Permissions', 'Memory', 'Skill / MCP / Hook / Plugin'],
        meta: 'slides/2_agent_use_1.pdf',
        notes:
          'Lecture 2 takes the user-side view of the same system Lecture 4 will design from first principles. The separating idea is "the model proposes, the harness executes".',
      },
      {
        layout: 'steps',
        kicker: 'The agentic loop',
        title: 'Three steps, repeated',
        lede: 'Every step is conditioned on what the last one returned, so one user prompt is many model calls and many tool executions rather than a single request.',
        steps: [
          { n: '1', h: 'Gather context', p: 'Prompt, files, tool results.', tag: 'step 1' },
          { n: '2', h: 'Generate action', p: 'Run a tool: bash, read, edit.', tag: 'step 2' },
          { n: '3', h: 'Run tool', p: 'Tests, output, re-read state.', tag: 'step 3' },
          { n: '4', h: 'Repeat', p: 'The chain continues until the task is done.', tag: 'loop' },
        ],
        notes:
          'The chain printed on the deck: U prompt, M1 inference, T1 tool, M2 inference, T2 tool, Mn inference, A answer. Every request is conditioned on the previous inference and the previous tool result.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'Context',
        title: 'Context exists before the first keystroke',
        lede: 'Already 10+k tokens, before the user has typed anything.',
        cards: [
          {
            h: 'SYSTEM and PROJECT',
            p: 'Claude Code instructions, and the environment.',
          },
          {
            h: 'MEMORY and USER',
            p: 'Persistent project and user notes including CLAUDE.md, and the request itself.',
          },
          {
            h: 'TOOLS, SKILLS / MCP',
            p: 'Read, Edit, Bash, Glob, Grep, Web, Agent - plus skill and MCP entries, which start as names and descriptions only and load in full when the agent reaches for them.',
          },
        ],
        notes:
          'The six layers are SYSTEM, PROJECT, MEMORY, TOOLS, SKILLS / MCP, USER. The name-only-then-full behaviour of skills and MCP is the preview of the tool-offloading technique in Lecture 8.',
      },
      {
        layout: 'compare',
        kicker: 'The trust boundary',
        title: 'The model proposes, the harness executes',
        left: {
          h: 'The model',
          li: ['Emits a request such as Bash("pytest")', 'Decides whether to make the call'],
        },
        right: {
          h: 'The Claude Code harness',
          li: [
            'Resolves the request',
            'Checks permissions',
            'Executes',
            'Sends the tool_result back into the model context',
          ],
        },
        note: 'The repository itself never leaves disk: Claude pulls slices of it on demand.',
        notes:
          'This is the pedagogical spine of the lecture. An agent is a loop plus a trust boundary, not a smarter completion.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'Permissions',
        title: 'A tool request is a proposal, not an action',
        cards: [
          { h: 'Manual', p: 'You approve each request.' },
          { h: 'Accept Edits', p: 'Edits go through without a prompt.' },
          { h: 'Bypass permission', p: 'Requests run unchecked.' },
          { h: 'Auto', p: 'A small model checks it.' },
        ],
        notes:
          'The outcomes are allowed, ask or denied. The permission layer is the mechanism side of what Lecture 4 later calls tools and guardrails.',
      },
      {
        layout: 'twocol',
        kicker: 'Context growth',
        title: 'Context grows, then it is compacted',
        left: {
          h: 'How it grows',
          li: [
            'Every step adds to the window',
            'Compaction summarizes the old trajectory and re-injects CLAUDE.md and memory',
            'Typical context size: 1M tokens (Sonnet / Opus / Fable, GPT 5.6); 256K was common earlier this year',
          ],
        },
        right: {
          h: 'Why it is not free',
          p: 'Prefix-cache reads account for most of the cost.',
          li: ['Tokens that stay in context are re-paid on every later step', 'This is the context tax Lecture 8 prices'],
        },
        notes:
          'The "1M tokens" and the "Fable" and "GPT 5.6" names were checked against the rendered PDF and are genuine. The same "context is not free" point returns in Lecture 8 as a token-cost share.',
      },
      {
        layout: 'quote',
        text: 'Every memory creation is a decision about what gets re-read forever.',
        attribution: 'Lecture 2, PDF page 16 - on agents being stateless between runs',
        notes:
          'Paired with "every permanent token is rent paid at the start of every session". The lecture also says stale memory is worse than none because it actively misleads, and that memory should be treated like code and kept in version control.',
      },
      {
        layout: 'compare',
        kicker: 'Memory',
        title: 'Two systems carry knowledge forward',
        left: {
          h: 'CLAUDE.md files',
          p: 'Written by you.',
          li: [
            'Instructions and rules',
            'Project, user or org scope',
            'Managed policy first, closest file read last',
            'Under 200 lines per file',
          ],
        },
        right: {
          h: 'Auto memory',
          p: 'Written by Claude.',
          li: [
            'Learnings and patterns',
            'Per repository, shared across worktrees',
            'First 200 lines / 25KB',
            'Both load at the start of every session',
          ],
        },
        note: 'Long CLAUDE.md files should split into .claude/rules/ with a paths: frontmatter, so each rule loads only when matching files are touched.',
        notes:
          'CLAUDE.md locations, broadest scope first: .../ClaudeCode/CLAUDE.md (managed policy, org-wide, cannot be excluded), ~/.claude/CLAUDE.md, ./CLAUDE.md or ./.claude/CLAUDE.md, and ./CLAUDE.local.md (personal, gitignored).',
      },
      {
        layout: 'steps',
        kicker: 'Auto memory',
        title: 'How memory is retrieved',
        lede: 'Retrieval loads the index always and reads topic files only when relevant.',
        steps: [
          { n: '1', h: 'Session starts', p: 'Everything loads at session start.', tag: 'start' },
          { n: '2', h: 'Load MEMORY.md', p: 'The index, at ~/.claude/projects/<project>/memory/.', tag: 'index' },
          { n: '3', h: 'Identify topic', p: 'Pick the relevant topic file.', tag: 'select' },
          { n: '4', h: 'Read on demand', p: 'Read the topic file, then apply it.', tag: 'apply' },
        ],
        note: 'Four commands control it: /memory, /context, /init, /doctor. Auto memory is on by default; disable it with /memory.',
        notes:
          'The layout the deck prints: MEMORY.md plus per-topic files, a type field tagging every file, and an example set of user_role.md, feedback_testing.md and other topic files.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'Tools',
        title: 'The core tool set',
        cards: [
          { h: 'Read', p: 'Open a file, inspect state - the most used tool.' },
          { h: 'Search', p: 'Grep and glob.' },
          { h: 'Fetch', p: 'Pull a page or doc - brings untrusted text inside.' },
          { h: 'Edit / Write', p: 'Change files - the first tool with consequences.' },
          { h: 'Shell', p: 'Build, test, git - the whole machine unless sandboxed.' },
          { h: 'Delegate', p: 'Spawn a subagent - a tool that returns a summary.' },
        ],
        notes:
          'The built-in list printed on the slides is Read, Edit, Bash, Glob, Grep, Web, Agent; the core-set view of the same tools is Read, Search, Fetch, Edit/Write, Shell, Delegate.',
      },
      {
        layout: 'table',
        kicker: 'The key slide of the lecture',
        title: 'Four extension mechanisms that are not interchangeable',
        cols: ['Mechanism', 'The question it answers', 'What it is'],
        rows: [
          ['Skill', 'How should the agent perform a task?', 'A folder whose description controls discovery and whose body holds the procedure'],
          ['MCP', 'Which external data and actions can it reach?', 'A standard protocol to external services'],
          ['Hook', 'What happens automatically at a lifecycle event?', 'Enforcement at a named point in the loop'],
          ['Plugin', 'How are the extensions packaged and distributed?', 'Installation, versioning, namespacing, team reuse'],
        ],
        note: 'A skill decides how, MCP reaches outside, a hook enforces, a plugin distributes - and each attaches at a different point in the agent loop.',
        notes:
          'The hook lifecycle events printed on the deck: Session start, User prompt, Model reasoning, Tool call, Tool result, Stop; and Before tool use, After tool use, Before stopping. This is the extension-surface taxonomy Lecture 3 builds real cases on.',
      },
      {
        layout: 'twocol',
        kicker: 'Skill and plugin',
        title: 'Discovery, body, packaging',
        left: {
          h: 'A skill',
          li: [
            'A folder such as .claude/skills/release/ with SKILL.md, references/ and scripts/',
            'Front matter carries name and description; the body holds the procedure',
            'Model-invoked when the description matches the task, or user-invoked with /<skill-name>',
            'Descriptions load at session start; the full body loads only when the skill runs',
          ],
        },
        right: {
          h: 'A plugin',
          li: [
            'The packaging layer: installation, versioning, namespacing, team reuse, distribution',
            'plugin/ with skills/, hooks/, agents/, .mcp.json, .lsp.json and .claude-plugin/plugin.json',
            'Side-effecting workflows usually require explicit invocation',
          ],
        },
        notes:
          'The deck gives a worked example: name release, description "Prepare a release", and a five-step procedure - read release notes, confirm version, run tests, prepare commit, ask before publishing.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'MCP',
        title: 'The agent-to-capability boundary',
        cards: [
          {
            h: 'Why it exists',
            p: 'Before MCP there were NxM implementations. MCP is an open, stateless protocol for discovery and use of external capabilities.',
          },
          {
            h: 'How a call works',
            p: 'Six steps: identify the action, the MCP client uses the tool, the server handles the connection, the external service performs the operation, structured results return, Claude evaluates. A call is almost identical to a local tool - "it just runs in another process".',
          },
          {
            h: 'Primitives',
            p: 'Tools, Resources and Prompts. The host, not the model, decides what is exposed. Protocol: https://modelcontextprotocol.io',
          },
        ],
        notes:
          'The architecture: Host (Claude Code), MCP client (one connection per server, run by the host), MCP server, external system (GitHub, Slack, PostgreSQL).',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'MCP',
        title: 'Security rules and the gateway',
        cards: [
          {
            h: 'Four security rules',
            li: ['Least privilege', 'Separate reads from writes', 'Distrust tool output as instructions', 'Vet before installing'],
          },
          {
            h: 'The gateway',
            li: [
              'Aggregate, route, enforce policy, broker identity, observe, scale',
              'Protocol surface: tools/list, tools/call, resources, prompts, schemas, protocol versions',
              'Mcp-Method headers route without reading the body',
            ],
          },
        ],
        note: 'MCP Spec 2026-07-28 - the largest revision of MCP since launch: stateless core, routing, and extensions (Tasks, MCP Apps).',
        notes:
          'The MCP material sits in an "OPTIONAL - extra reading, not required" block on the slides. The graded core of the lecture is the harness, not the protocol.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Classification exercise',
        title: 'Name the problem, then pick the mechanism',
        cols: ['Requirement', 'Mechanism the deck assigns'],
        rows: [
          ['Company API conventions', 'Skill'],
          ['Read an issue from Jira', 'MCP'],
          ['Run formatting after every edit', 'Hook'],
          ['Guide a multi-step deployment', 'Skill'],
          ['Send a completion notification', 'Hook plus MCP'],
          ['Block writes to production', 'Hook or policy'],
          ['Share everything across repositories', 'Plugin'],
        ],
        notes:
          'The teaching device of the whole lecture: do not guess, classify. Skill, MCP, Hook and Plugin solve four different problems and must not be confused.',
      },
    ],
  },
  /* ==================================================================== */
  /* 4. lecture-03                                                         */
  /* ==================================================================== */
  {
    id: 'lecture-03',
    slug: 'lecture-03',
    title: 'Lecture 3 - Multi-agent and best practice',
    navTitle: 'Lecture 3 - Multi-agent and best practice',
    navBlurb: 'Two case studies - Superpowers and Caveman - then the three axes of scaling and what the field evidence says.',
    footerLabel: 'CS2680 · Lecture 3 · 3_agent_use_2.pdf',
    source: `${S}/slides/3_agent_use_2.pdf`,
    sources: [
      { url: `${S}/slides/3_agent_use_2.pdf`, label: 'Lecture 3 slide deck - 72 pages' },
      {
        url: 'https://github.com/obra/superpowers',
        label: 'the Superpowers plugin used as case study 1',
      },
      {
        url: 'https://www.anthropic.com/engineering/building-c-compiler',
        label: 'the 16-agent C compiler case, the stated source of its figures',
      },
    ],
    slides: [
      {
        layout: 'cover',
        kicker: 'Lecture 3 · Sep 14, 2026 · 72 slides',
        title: 'Agent from a user\'s perspective II: multi-agent and best practice',
        lede: 'Two real plugin case studies, then the three independent axes you can scale on - and what the field evidence says about delegating work to agents.',
        pills: ['Superpowers', 'Caveman', 'Parallel agents', 'Subagents', 'Agent teams'],
        meta: 'slides/3_agent_use_2.pdf',
        notes:
          'Lecture 2 taught the four extension mechanisms in the abstract. Lecture 3 shows real teams shipping them, and then asks what multi-agent actually buys.',
      },
      {
        layout: 'compare',
        kicker: 'The hinge of the lecture',
        title: 'Same model, different workflow',
        lede: 'Two agents sharing the same model and the same tools behave differently, because only the instructions differ.',
        left: {
          h: 'The default workflow',
          li: ['Feature request', 'Start coding', 'Fix by iteration'],
        },
        right: {
          h: 'The Superpowers workflow',
          li: [
            'PLAN',
            'BUILD',
            'SHIP',
            'With a HUMAN at step 0',
          ],
        },
        note: 'The instructions are the design surface. A plugin is the distribution container; skills and hooks supply the behaviour.',
        notes:
          'The Superpowers case: a software-development plugin, obra/superpowers, installed with /plugin install superpowers@claude-plugins-official.',
      },
      {
        layout: 'steps',
        kicker: 'Case study 1 · Superpowers',
        title: 'Six stages, nine skills',
        lede: 'The plugin puts a human approval gate at the front of a six-stage pipeline.',
        steps: [
          { n: '1', h: 'Clarify', p: 'Clarify the problem.' },
          { n: '2', h: 'Approve', p: 'Approve a design.' },
          { n: '3', h: 'Plan', p: 'Write a detailed plan.' },
          { n: '4', h: 'Build', p: 'Test-driven build.' },
          { n: '5', h: 'Review', p: 'Review and verify.' },
          { n: '6', h: 'Finish', p: 'Finish or integrate the branch.' },
        ],
        note: 'Nine skills ship with it: using-superpowers, brainstorming, writing-plans, using-git-worktrees, test-driven-development, systematic-debugging, requesting-code-review, verification-before-completion and finishing-a-development-branch. The repository holds .claude-plugin/plugin.json, hooks/hooks.json with a session-start hook, skills/ and tests/.',
        notes:
          'The layout is superpowers/ with .claude-plugin/plugin.json, hooks/hooks.json (session-start), skills/ and tests/.',
      },
      {
        layout: 'twocol',
        kicker: 'Skill anatomy',
        title: 'Front matter, body, and the six components',
        left: {
          h: 'A SKILL.md',
          li: [
            'Front matter: metadata - name and description',
            'Body: the procedure',
            'The brainstorming skill: inspect project, classify scope, clarify requirements, compare approaches, present a design, wait for user approval, invoke writing-plans',
          ],
        },
        right: {
          h: 'Six components a skill file can define',
          li: [
            'Entry conditions',
            'Required actions',
            'Prohibited actions',
            'Human approval gates',
            'Verification requirements',
            'Next applicable skill',
          ],
        },
        notes:
          'The seven-step brainstorming procedure is printed on the deck; the six components are what a skill file may define. Both are shown here so students can read a real skill file against the template.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'The "students get this wrong" slide',
        title: 'Skills alone are not enough',
        cards: [
          {
            h: 'Availability is not compliance',
            p: 'A skill being present does not guarantee the agent checks it. Skills have to be invoked.',
          },
          {
            h: 'The SessionStart hook',
            p: 'A hook with matcher "startup|clear|compact", type "command", async false guarantees deterministic timing: it runs before the agent acts and re-runs after clear and compaction.',
          },
          {
            h: 'How it injects',
            p: 'The session-start script locates the plugin, reads the bootstrap SKILL.md, escapes the Markdown for JSON and returns it as additionalContext for Claude Code to add to context.',
          },
          {
            h: 'Why it matters',
            p: 'Hooks and skills solve different problems. A skill decides how; a hook enforces.',
          },
        ],
        notes:
          'This is the mechanism distinction Lecture 2 introduced, now in a working repository. The hook is the part that makes the behaviour deterministic.',
      },
      {
        layout: 'twocol',
        kicker: 'Case study 2 · Caveman',
        title: 'Compress the context you have to pay for',
        left: {
          h: 'Why it exists',
          li: [
            'Context fills up',
            'Every turn costs',
            'Compaction loses detail',
          ],
        },
        right: {
          h: 'The worked example',
          p: 'BEFORE: 786 lines, reading "... 776 more lines ... 3 failed, 214 passed".',
          li: [
            'AFTER: "3 tests fail: ETIMEDOUT at client.ts:88"',
            'The original stays available for retrieval',
          ],
        },
        note: 'Installed with claude plugin marketplace add JuliusBrussee/caveman, then claude plugin install caveman@caveman. The repository holds caveman/ with .claude-plugin/plugin.json, skills/ (caveman, -commit, -review, -compress, -stats), commands/, src/hooks/, mcp/, proxy/, engine/ and agents/.',
        notes:
          'Caveman is a second case study with five extension mechanisms plus a local proxy. The point is that the compressed form is what the model sees, and the byte-exact original is still retrievable.',
      },
      {
        layout: 'twocol',
        kicker: 'Caveman',
        title: 'Compression in two directions',
        left: {
          h: 'What it saves',
          p: 'Reported: 65% fewer output tokens.',
          li: [
            'The skill itself adds input tokens, so whole-session savings are lower',
            'Seven-step flow, ending with MCP retrieving the original on demand',
          ],
        },
        right: {
          h: 'What it preserves',
          p: 'A response skill preserves technical terms, commands, paths, code, errors, numbers, units and negation, while removing filler, repetition, pleasantries and hedging.',
          li: [
            'Eight commands from /caveman to /caveman-help',
            'SessionStart and UserPromptSubmit hooks make a prompt-time choice persistent',
          ],
        },
        note: 'Five MCP tools: caveman_compress (compress plus a recovery handle), caveman_retrieve (byte-exact original), caveman_stats, caveman_toon_encode and caveman_toon_decode. The server command is "npx" with args ["-y","caveman-mcp"]; a result example is "compressed": "3 tests fail. Root error: timeout.", "ratio": 0.72, "recovery_handle": "ccr_abc123". Packaged as a plugin.',
        notes:
          'The reported 65% figure was checked against the rendered PDF and is genuine, but it is an output-token figure, not a whole-session one. The lecture says so on the slide.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'The proxy',
        title: 'The only mechanism that can rewrite what the model reads',
        cards: [
          {
            h: 'Why a proxy is required',
            p: 'Hooks intercept requests but cannot rewrite the request to the LLM. A proxy is required unless you write your own harness.',
          },
          {
            h: 'Where it sits',
            p: 'The proxy sits between the agent and the model provider, while MCP sits beside it. It applies type-aware compression per content type: logs, code, diffs, JSON, search, HTML/text.',
          },
        ],
        notes:
          'This is the literal implementation of the Transformation stage of context management in Lecture 4: the same goal, at a different layer. It is also the architecture that a custom harness buys you.',
      },
      {
        layout: 'table',
        kicker: 'Scaling',
        title: 'Three independent axes',
        cols: ['Axis', 'What it buys', 'Shape'],
        rows: [
          ['Parallel agents', 'Breadth - wall-clock throughput, not answer quality', 'Independent tasks, each in an isolated working tree'],
          ['Subagents', 'Breadth and depth - throughput and focus', 'A bounded task in fresh context returning a summary'],
          ['Long-running agent', 'Duration - scope', 'A larger job carried across many steps'],
        ],
        note: 'Agent teams and dynamic workflow combine them.',
        notes:
          'The rule to remember: scale has three independent axes, and each multi-agent mechanism buys a different one at a different cost.',
      },
      {
        layout: 'twocol',
        kicker: 'Parallel agents by hand',
        title: 'One task per session, in its own worktree',
        left: {
          h: 'The setup',
          li: [
            'One task per session in its own git worktree',
            'A separate working directory and branch sharing the repository history',
            'For example claude -w feature-payments, claude -w bugfix-auth',
            '../repo-main (main), ../feat-auth (feature/auth), ../fix-flaky (fix/flaky-test)',
          ],
        },
        right: {
          h: 'Where it breaks down',
          li: [
            'You hold the plan',
            'Sessions cannot see each other',
            'You reconcile the branches',
            'It does not repeat, because nothing is written down to rerun',
            '3 sessions you can hold the plan; 20 sessions you need a clone',
          ],
        },
        notes:
          'Hand-run parallelism is where most teams start, and where the coordination cost first shows up. The "3 sessions vs 20 sessions" line is the deck\'s own way of putting a number on it.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Subagents',
        title: 'A specialized assistant with its own window',
        cards: [
          {
            h: 'Why',
            li: [
              'Preserve context',
              'Enforce constraints',
              'Reuse anywhere',
              'Parallelize - the slowest subtask sets the total time',
              'Control cost by routing to a cheaper model such as Haiku',
            ],
          },
          {
            h: 'How',
            li: [
              'Built-ins: Explore, Plan and General-purpose. Explore and Plan skip CLAUDE.md and git status.',
              'A subagent is a Markdown file with YAML frontmatter whose body becomes the system prompt',
              'Example: .claude/agents/code-reviewer.md with tools Read/Glob/Grep, model sonnet',
              'Nesting requires Agent in the tools list; up to 5 levels are allowed, 2 to 3 the sweet spot',
              'A nested example: my-orchestrator, tools Read/Grep/Agent, model claude-sonnet-5-0',
            ],
          },
        ],
        note: 'Three invocation styles, giving increasing control: natural language (one-off), @-mention (one task) and the --agent flag (whole session). Docs: code.claude.com/docs/en/sub-agents',
        notes:
          'Routing to a cheaper model is the first cost lever a student can pull: model: haiku in the subagent frontmatter.',
      },
      {
        layout: 'table',
        kicker: 'Subagents vs agent teams',
        title: 'A coordination-cost decision, not a capability decision',
        cols: ['', 'Subagents', 'Agent teams'],
        rows: [
          ['Context', 'Own window; result to caller', 'Own window; independent'],
          ['Communication', 'Back to the caller only', 'Teammate to teammate'],
          ['Coordination', 'Lead', 'Shared task list'],
          ['Token cost', 'Lower', 'Higher'],
        ],
        note: 'Agent teams are several Claude Code sessions working together - one lead, several teammates - for review, independent modules, debugging and cross-layer work. They are experimental and off by default, and they cost more tokens, so they are worth it only when the work needs discussion. Wiring: team lead, teammates, task list, and a mailbox (a JSON inbox per agent). Docs: code.claude.com/docs/en/agent-teams',
        notes:
          'The lecture explicitly names this as one of the things students get wrong: teams are not a capability upgrade, they are a coordination purchase.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'Beyond hand-run parallelism',
        title: 'Dynamic workflow and long-running agents',
        cards: [
          {
            h: 'Dynamic workflow',
            p: 'A JavaScript script orchestrating many subagents in the background. Entered by typing "ultracode" or running /effort ultracode. The deck\'s example is a 500-file migration.',
          },
          {
            h: '/goal',
            p: 'Runs until a verifiable end state holds - for example /goal "npm run lint exits with zero errors" - and stops when it is met or when --max-tries runs out.',
          },
          {
            h: '/loop',
            p: 'Re-runs a prompt on a schedule until you stop it - for example /loop 5m "check CI, fix whatever broke", with the default prompt in .claude/loop.md. Press Esc to end.',
          },
        ],
        note: 'Four ways to amplify - parallel agents by hand, subagents, agent teams, workflows - and two ways to keep one running: /goal and /loop.',
        notes:
          'The distinction between amplifying (many) and sustaining (one long run) is the practical takeaway of this slide.',
      },
      {
        layout: 'twocol',
        kicker: 'Field case',
        title: 'The 16-agent C compiler',
        left: {
          h: 'Scale',
          li: [
            '16 agents, ~2,000 sessions over two weeks',
            '2B input / 140M output tokens, just under $20,000 API cost',
            '~100,000 lines of code',
            'Linux 6.9 on x86, ARM and RISC-V',
            'QEMU, FFmpeg, Postgres, Redis, Doom',
            '~99% pass rate on major test suites',
          ],
        },
        right: {
          h: 'Limits',
          li: [
            'Merge conflicts were frequent',
            'Parallelism stopped helping on a shared kernel failure',
            'It still leaned on GCC for part of the 16-bit x86',
            'Generated code was less efficient than GCC output',
          ],
        },
        note: 'Coordination: isolated container plus Git checkout, lock files, Git as the coordination layer, fresh sessions read progress docs, specialist agents, automated tests as a progress signal. Source: https://www.anthropic.com/engineering/building-c-compiler',
        notes:
          'The lecture spends as much space on the limitations as on the results. This is a cost-and-limit case, not a victory lap.',
      },
      {
        layout: 'twocol',
        kicker: 'The uncertainty argument',
        title: 'Programming 3.0, and how to live with it',
        left: {
          h: 'The vocabulary',
          li: [
            'Programming 1.0 - programming hardware; 2.0 - programming the language; 3.0 - expressing the goal',
            'Programming 3.0 is the lecturer\'s own coinage, explicitly different from Andrej Karpathy\'s definition',
            'Software 3.0 is attributed to Andrej Karpathy, "Software Is Changing (Again)"',
            'Uncertainty is not new: Programming 2.0 already had 32-bit vs 64-bit architecture, endianness, concurrency, unreliable networks, compiler versions and dependency drift',
          ],
        },
        right: {
          h: 'The best-practice groups',
          li: [
            'DEFINE - state assumptions up front; have the model confirm anything ambiguous before it executes',
            'CONTROL - separate proposal from execution; manage context explicitly, owning memory, provenance and retrieval, and expiring stale information; specify outcomes, not prompts',
            'VERIFY & GOVERN - tighten the generate-verify loop; measure one level deeper',
          ],
        },
        note: 'The rule the deck states: "Do not expect the agent to be deterministic; make the surrounding system dependable", and "match autonomy to risk: the more autonomy the higher uncertainty and risk".',
        notes:
          'Programming 2.0 problems were solved with fixed-width types, cross-compilation, virtualization, a memory consistency model, idempotent APIs and comprehensive testing. The 3.0 answer is the same discipline, pointed at a nondeterministic collaborator.',
      },
      {
        layout: 'table',
        kicker: 'Field evidence',
        title: 'What the adoption numbers say',
        cols: ['Observation', 'Figure'],
        rows: [
          ['Codex active users', 'Grew more than 5x in the first half of 2026'],
          ['Delegated tasks of at least 1 human-hour', '35.4% (December 2025) to 70.2% (May 2026)'],
          ['Delegated tasks of at least 8 human-hours', '2.1% (December 2025) to 25.6% (May 2026) - a 12x rise in users tackling full-day tasks'],
          ['Users running 5+ agents at once in a week', '28.6% of OpenAI users'],
          ['Agent-hours per day', '~2.5 for the median OpenAI employee; ~71 at the 99th percentile (+88% since April)'],
          ['Agent work vs human work', 'An agent does 3.14x more work than a human; engineers are shipping almost 8x faster'],
        ],
        note: 'The Delegation Ladder has five rungs: Chatbot, Assistant, Agent, Multi-agent worker, Systematized workflows. OpenAI\'s workforce sits near the bottom.',
        notes:
          'The digest notes that most researchers have 4+ concurrent workflows, and that this is not shown on the slides - so do not put it on a slide either.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'The landscape',
        title: 'CLI coding agents, mid-2026',
        cards: [
          {
            h: 'Five axes',
            li: [
              'Open vs closed',
              'Locked vs BYOK',
              'Sandbox vs prompt',
              'Local vs cloud',
              'Maximal vs minimal',
            ],
          },
          {
            h: 'Model labs',
            p: 'Claude Code, Codex CLI, Antigravity CLI, Grok Build, Mistral Vibe, Kimi Code, Qwen Code.',
          },
          {
            h: 'Platform CLIs',
            p: 'Copilot CLI, Cursor CLI, Amp, Auggie, Droid, Junie CLI, Qoder, CodeBuddy.',
          },
          {
            h: 'Open source and minimal cores',
            p: 'OpenCode, Crush, Goose, Aider, Cline, Kilo, Continue, OpenHands, Reasonix, Codebuff; minimal cores such as Deepseek Harness, Pi, oh-my-pi, mini-SWE-agent, gptme, Open Interpreter. OpenCode 75+ providers, Kilo 500+ models, mini-SWE-agent ~100 lines of Python. Source: "State of CLI Coding Agents, Mid-2026 (July 2026)".',
          },
        ],
        notes:
          'This slide is a survey, not a recommendation. It is useful for the project: pick a base that fits the claim you want to make.',
      },
    ],
  },

  /* ==================================================================== */
  /* 5. lecture-04                                                         */
  /* ==================================================================== */
  {
    id: 'lecture-04',
    slug: 'lecture-04',
    title: 'Lecture 4 - Context management and tool design',
    navTitle: 'Lecture 4 - Context and tools',
    navBlurb: 'The ReAct loop as code, four ways to find code, four edit strategies, the context ladder, and the evidence that the harness doubles accuracy.',
    footerLabel: 'CS2680 · Lecture 4 · 4_agent_design_1.pdf',
    source: `${S}/slides/4_agent_design_1.pdf`,
    sources: [
      { url: `${S}/slides/4_agent_design_1.pdf`, label: 'Lecture 4 slide deck - 56 pages' },
      {
        url: 'https://arxiv.org/pdf/2210.03629',
        label: 'ReAct, the paper the reference loop is taken from',
      },
    ],
    slides: [
      {
        layout: 'cover',
        kicker: 'Lecture 4 · Sep 16, 2026 · 56 slides',
        title: 'Agent design I: context management and tool design',
        lede: 'The harness from first principles: the loop, the tools, the context ladder - and the claim that changing only the harness doubles accuracy.',
        pills: ['ReAct', 'Tool design', 'Context engineering', 'Agent = Model x Harness'],
        meta: 'slides/4_agent_design_1.pdf',
        notes:
          'This is the first lecture in the design half of the course. Everything here is a design decision a student will have to make in Assignment 2 and defend in the writeup.',
      },
      {
        layout: 'twocol',
        kicker: 'The loop',
        title: 'ReAct: Thought, Action, Observation',
        left: {
          h: 'The three parts',
          li: [
            'Thought - what do I know, what is missing, what next',
            'Action - emit a structured call the environment can run',
            'Observation - the environment answers with facts',
          ],
        },
        right: {
          h: 'Two broken variants',
          li: [
            'Reason-only fails: nothing checks the reasoning, and small errors compound into confident hallucination',
            'Act-only fails: tool calls with no plan make the model repeat themselves',
          ],
        },
        note: 'Source: https://arxiv.org/pdf/2210.03629',
        notes:
          'The same loop Lecture 2 demonstrated with Claude Code, now written as code. Point out the two failure modes: they are the two things students tend to build.',
      },
      {
        layout: 'twocol',
        kicker: 'The reference implementation',
        title: 'A message-list loop, and the three jobs of a harness designer',
        left: {
          h: 'The loop',
          li: [
            'System and user messages, then for step in range(MAX_STEPS) call the model with tools',
            'Append the response; return the final answer if present',
            'Otherwise validate arguments, execute the tool, and append a role "tool" message with tool_call_id and content',
            'Exceeding the step limit raises RuntimeError("Agent exceeded its step limit")',
          ],
        },
        right: {
          h: 'A harness designer has three jobs',
          li: [
            'Assemble the context',
            'Validate the request, check permission and run it',
            'Optionally process the result and manage context',
          ],
        },
        note: 'That is what a coding agent is made of: model + agent loop, tools and guardrails, and state - sharing one context window.',
        notes:
          '"An agent is a model plus a loop" and "tools set capability; guardrails keep it safe". The three jobs map directly onto the three components of a coding agent.',
      },
      {
        layout: 'table',
        kicker: 'Finding code',
        title: 'Four ways to find code',
        cols: ['Approach', 'Strength', 'Cost'],
        rows: [
          ['Glob and grep', 'Always reflects the live repo', 'Burning turns and context; misses paraphrase'],
          ['Semantic / structural search', 'Fast at query time', 'Building and re-syncing the index'],
          ['Extrinsic signals', 'The highest-precision signal when debugging - stack traces, failing tests, git history', 'Useful only when such a signal exists'],
          ['Language server (LSP)', 'Resolves imports, overloads and renames that grep only guesses at', 'A live server per language, and a slow cold start'],
        ],
        note: 'The comparison rule from the deck: "In practice - start with grep; reach for an index or LSP when names run out." Examples on the slides: grep -rn "timeout" src/ gives 37 hits in 12 files; a textDocument/references query returns 42 call sites across 7 files; Aider\'s repo map is the structural-search example.',
        notes:
          'The point for the students: a semantic index is a build cost, and an LSP is a runtime cost. Both are worth it only when the names run out.',
      },
      {
        layout: 'table',
        kicker: 'Changing code',
        title: 'Four edit strategies',
        cols: ['Strategy', 'Strength', 'Failure mode'],
        rows: [
          ['Whole-file rewrite', 'No patch syntax to get wrong', 'Output scales with file size; untouched code can drift'],
          ['Unified diff / patch', 'Compact and reviewable in the format humans and CI already use', 'Hunks fail when line numbers or context drift'],
          ['Search and replace', 'Output proportional to the change', 'Fails on ambiguous, stale or whitespace-off anchors'],
          ['Structured / AST edit', 'Immune to formatting; cannot produce invalid syntax', 'Per-language tooling and a limited set of expressible edits'],
        ],
        note: 'Examples on the slides: a whole-file rewrite reads client.ts (120 lines) into context and changes 4 lines; a unified diff is 6 lines in two hunks applied with git apply patch.diff; search and replace turns retries = 3 into retries = 5; an AST edit adds a parameter with a 5s timeout default and rewrites the signature and all 18 callers, valid by construction.',
        notes:
          'The AST and LSP background links are https://pierce.dev/notes/how-language-servers-work and the "Abstract syntax trees" video. The four-row comparison is the summary table the deck prints.',
      },
      {
        layout: 'twocol',
        kicker: 'The most powerful tool',
        title: 'Shell execution',
        left: {
          h: 'Why it is powerful',
          li: [
            'Composition - one call can chain, filter, loop and retry',
            'Reach - filesystem, network, package managers, installed binaries',
            'Persistence - files and processes outlive the call',
            'Blast radius - whatever the shell can do, the agent can do',
          ],
        },
        right: {
          h: 'Five design questions',
          li: [
            'Failure signal',
            'Output',
            'Duration',
            'Budgets - when to stop retrying and hand back',
            'Isolation - where the code runs and what it can reach',
          ],
        },
        notes:
          'These five questions are the agenda for the tool-design part of the project: the blast-radius question is the one that decides whether the shell is allowed at all.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'The rest of the tool set',
        title: 'Five more tools, five design rules',
        cards: [
          {
            h: 'Five more commonly used tools',
            li: [
              'Browser and visual feedback',
              'Memory and notes - write findings to a file so plans survive compaction',
              'Asking the user - one cheap question beats a confident wrong patch',
              'Subagents and delegation',
              'Web search and fetch',
            ],
          },
          {
            h: 'Five best practices',
            li: [
              'Few orthogonal tools - overlapping tools make the model dither',
              'Purpose-built rather than generic - search_orders(customer_id) beats a raw run_sql tool',
              'Token-cheap output: truncate, paginate, summarize. Tool design is context design',
              'Errors that teach - return the fix hint, not just "invalid argument"',
              'Idempotent by default',
            ],
          },
        ],
        notes:
          'The "token-cheap output" line is the hinge into the context section: a tool\'s output is context, so tool design and context design are the same problem.',
      },
      {
        layout: 'table',
        kicker: 'The question the assignment asks',
        title: 'Can we just provide the shell tool?',
        lede: 'A benchmark on the slide asks how much of the result the tool set explains.',
        cols: ['Condition', 'Result'],
        rows: [
          ['Purpose-built SWE-agent', '18.0%'],
          ['Full interaction history', '15.0%'],
          ['Full-file view', '12.7%'],
          ['Shell only', '11.0%'],
          ['No specialized editor', '10.3%'],
        ],
        note: 'The slide gives no benchmark name, no model name and no source for these figures, so they are reproduced as shown and are not attributed to anything. The slide itself says "Find out when you work on the assignment!". A red annotation reading "No on GPT-4" is drawn physically on top of the Shell only row and partially covers the 11.0% label, so which row it refers to is not resolvable from the PDF.',
        notes:
          'This is the slide the lecturer is openly skeptical about. Several prompting techniques in the same deck are labelled expired, and students are told to find out for themselves in the assignment. The point is to measure, not to memorise.',
      },
      {
        layout: 'roadmap',
        kicker: 'Vocabulary',
        title: 'Four eras of engineering',
        lede: 'The deck is explicit that it coins these terms so you know what they mean when you meet them - not because it agrees with or likes them.',
        cols: [
          {
            tag: '2023-2024',
            h: 'Prompt Engineering',
            li: ['"How should we instruct the model?"'],
          },
          {
            tag: '2025-2026',
            h: 'Context Engineering',
            li: ['"What should the model see?"'],
          },
          {
            tag: '2026',
            h: 'Harness Engineering',
            li: ['"How should the agent operate?"'],
          },
          {
            tag: 'Now to Next',
            h: 'Goal Engineering',
            li: ['"What counts as success?"'],
          },
        ],
        notes:
          'Keep this honest: the lecturer says outright that people love coining terms, and he uses them so students know what they mean, not to endorse them.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Prompting',
        title: 'Eight techniques, four rules',
        cards: [
          {
            h: 'Eight techniques',
            li: [
              'Zero-shot',
              'Few-shot',
              'Role and persona',
              'Chain-of-thought',
              'Tree-of-thoughts',
              'Self-consistency',
              'Prompt chaining',
              'Meta prompting',
            ],
          },
          {
            h: 'Four prompt-design rules',
            li: [
              'Instruction, delimiter, data - in that order',
              'Start simple then iterate',
              'Partition into sections',
              'Be specific and concise; split big tasks into subtasks',
            ],
          },
        ],
        note: 'The deck gives each technique a "use it when" and a "move on when". Self-consistency is illustrated with 5 samples at T = 0.7 voting 4/5 = 0.8, a floor of 0.8, and 3/5 routed to a human. Meta prompting is illustrated by turning 8/10 into 10/10 on an eval set.',
        notes:
          'Chain-of-thought is shown as 3 features/week for 4 weeks then 5/week for 2 weeks, giving 12, 10 and ANSWER: 22. Tree-of-thoughts scores 3 ways to cut checkout latency from 1 to 5, expands C then B and prunes A.',
      },
      {
        layout: 'quote',
        text: 'The delicate art and science of filling the context window with just the right information for the next step.',
        attribution: 'Andrej Karpathy - cited in Lecture 4, PDF page 41',
        notes:
          'Context is a finite resource on three axes: cost (every step re-sends the whole window), latency (bigger prompts take longer to prefill and decode) and attention (recall fades as the window fills, and the middle gets missed). More context is not better answers.',
      },
      {
        layout: 'table',
        kicker: 'The evidence',
        title: 'Both length and position cost accuracy',
        cols: ['Observation', 'Figure'],
        rows: [
          ['Accuracy at the largest input size shown', 'Simple lookup 73%, with distractors 46%'],
          ['Input sizes on that axis', '1K, 10K, 30K, 60K, 100K, 200K, 400K'],
          ['Accuracy by position among 20 documents', '1st 76%, 5th 61%, 10th 55%, 15th 59%, 20th 71%'],
        ],
        note: 'Sources printed on the slide: Context Rot (Chroma) and Liu et al., "Lost in the Middle," TACL 12 (2024). Only the two end points of the first chart are recoverable from the PDF, so the intermediate points are not reproduced here.',
        notes:
          'This is the empirical justification for the ladder on the next slides: the curve is U-shaped, so filling the window is not free.',
      },
      {
        layout: 'table',
        kicker: 'Anatomy of a context window',
        title: 'Where the tokens are, for one agent turn',
        cols: ['Component', 'Illustrative budget'],
        rows: [
          ['System prompt', '~2K'],
          ['Tool definitions', '~6K'],
          ['Retrieved context', '~25K'],
          ['Project environment', '~8K'],
          ['Message history (User + LLM + tool-call result)', '~80K and growing'],
        ],
        note: 'The slide labels this an illustrative token budget for a single agent turn, not a measurement.',
        notes:
          'The numbers extract as an unlabelled list; the mapping is the one given on the rendered PDF. The message history dominates, and it is the one that grows.',
      },
      {
        layout: 'steps',
        kicker: 'The ladder',
        title: 'Four escalating stages of context management',
        lede: 'The stages run from preventive and lossless to lossy and irreversible.',
        steps: [
          {
            n: '1',
            h: 'Admission',
            p: 'Targeted retrieval, tool output shaping, truncation only when shaping cannot, isolation to a subagent.',
          },
          {
            n: '2',
            h: 'Offloading',
            p: 'Progressive tool definition, tool search, tool output offload returning a handle, externalised task list, persistent memory.',
          },
          {
            n: '3',
            h: 'Transformation',
            p: 'Deduplication, observation masking of tool results older than N steps, sliding window.',
          },
          {
            n: '4',
            h: 'Compaction',
            p: 'Rolling summary, or full summary at the limit, reserving headroom, preserving the system prefix, re-injecting critical facts, persisting key facts outside the window via auto memory.',
          },
        ],
        notes:
          'The order matters, and the lecture says so: admission, offloading, transformation, then compaction. Compaction is the one that is lossy and irreversible, so it is the last resort.',
      },
      {
        layout: 'table',
        kicker: 'The ladder, measured',
        title: 'Three savings, one per stage',
        cols: ['Stage', 'Before', 'After', 'Result'],
        rows: [
          ['Admission', 'Raw DOM, 48,000 tokens', 'Prices and headings only, 900 tokens', '98% smaller, same answer'],
          ['Offloading', '60 schemas resident, 42,000 tokens', 'Index plus 3 schemas, 3,100 tokens', '93% smaller, all 60 reachable'],
          ['Transformation', 'Every result kept, 96,000 tokens', 'Newest state kept, 24,000 tokens', '75% smaller, nothing summarized'],
        ],
        notes:
          'Notice what each stage refuses to do: admission shapes rather than truncates, offloading keeps everything reachable, transformation summarises nothing. The savings come from structure, not from dropping information.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'How context fails',
        title: 'Five failure modes - and the fix follows from the name',
        cards: [
          { h: 'Poisoning', p: 'A hallucination enters the window and is later cited as fact.' },
          { h: 'Distraction', p: 'History grows until the agent imitates its own past actions.' },
          { h: 'Confusion', p: 'Irrelevant tools and documents steer the answer off course.' },
          { h: 'Clash', p: 'New information contradicts old; both stay unresolved.' },
          { h: 'Drift', p: 'The real goal is buried and swapped for a nearby subgoal.' },
        ],
        note: 'Source printed on the slide: Breunig, "How Contexts Fail and How to Fix Them" (2025). The deck\'s rule: "Name the failure and the fix becomes obvious."',
        notes:
          'The diagnostic skill here is the one the project rubric rewards: break the 60-second result into the 40 seconds of tool calls and see which of the five you are in.',
      },
      {
        layout: 'stat',
        kicker: 'The thesis',
        value: '2x',
        caption: 'accuracy, from changing only the harness',
        lede: 'Model capability sets the ceiling; the harness determines realized performance. "Some apparent \'model failures\' are actually context- and control-loop failures."',
        notes:
          'The evidence on the next slide. This is the single number the whole lecture is built to defend.',
      },
      {
        layout: 'table',
        kicker: 'The evidence',
        title: 'Changing the harness improves accuracy by 2x',
        cols: ['Benchmark', 'Before', 'After'],
        rows: [
          ['SWE-bench Verified', '43 / 169', '72 / 169'],
          ['SWE-bench Pro', '31 / 316', '72 / 316'],
        ],
        note: 'The four harness changes listed on the slide: old tool outputs compacted; recent observations kept visible; repetition and stalls detected; interventions when stuck. Source: Lewis, S., "Same Model, Different Harness: Different Coding-Agent Results" (arXiv:2608.26218, 2026).',
        notes:
          'Same model, same tools, same tasks - only the harness changes. This is the bridge to Lecture 3\'s "same model, different workflow" and to Assignment 3, where the harness is the deliverable.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'Beyond ReAct',
        title: 'Three other loop shapes',
        cards: [
          {
            h: 'Reflexion',
            p: 'Loops after a failure: Attempt, Evaluate, Critique, Retry.',
          },
          {
            h: 'Plan-and-execute',
            p: 'Loops on deviation: Plan, Execute steps, Re-plan.',
          },
          {
            h: 'Tree search',
            p: 'No loop - one pass, wide: State, Branch A/B/C, Keep best.',
          },
        ],
        note: 'Next class topics, as printed on the slides: Agent design II; Agent (persistent) memory; Cost-effective agents; Safety and security; Multi-agent designs.',
        notes:
          'End the lecture by pointing forward: the next four lectures are the ones this deck names.',
      },
    ],
  },

  /* ==================================================================== */
  /* 6. lecture-05                                                         */
  /* ==================================================================== */
  {
    id: 'lecture-05',
    slug: 'lecture-05',
    title: 'Lecture 5 - Multi-agent architecture, coordination, and communication',
    navTitle: 'Lecture 5 - Multi-agent architecture',
    navBlurb: 'Three graphs, eight architectures, task decomposition, communication as a distributed-systems problem, and A2A versus MCP.',
    footerLabel: 'CS2680 · Lecture 5 · 5_agent_design_2.pdf',
    source: `${S}/slides/5_agent_design_2.pdf`,
    sources: [
      { url: `${S}/slides/5_agent_design_2.pdf`, label: 'Lecture 5 slide deck - 46 pages' },
      { url: `${S}/notes/cost-effective-agents.html`, label: 'reference note - cost-effective agents' },
    ],
    slides: [
      {
        layout: 'cover',
        kicker: 'Lecture 5 · Sep 23, 2026 · 46 slides',
        title: 'Agents design II: multi-agent architecture, coordination, and communication',
        lede: 'When to split work across agents, which topologies exist, how they talk - and what each one costs.',
        pills: ['3 graphs', '8 architectures', 'Decomposition', 'A2A vs MCP'],
        meta: 'slides/5_agent_design_2.pdf',
        notes:
          'The lecture opens by saying multi-agent has decades of research history which it will not get into, and closes by asking whether it is really necessary. Multi-agent is presented as a cost, not a default.',
      },
      {
        layout: 'cards',
        cols: 4,
        kicker: 'Why split at all',
        title: 'Four stated reasons',
        cards: [
          { h: 'Specialization', p: 'Different models, prompts and tools.' },
          { h: 'Isolation', p: 'Different privileges per agent.' },
          { h: 'Parallelism', p: 'Independent subtasks run concurrently.' },
          { h: 'Context management', p: 'Do not give every agent the whole trajectory.' },
        ],
        notes:
          'If none of the four apply, the closing question - "is multi-agent really necessary?" - usually answers itself.',
      },
      {
        layout: 'flow',
        kicker: 'The vocabulary',
        title: 'Three graphs describe any multi-agent system',
        lede: 'Every architecture slide in the deck ends with the same three-field tag line: Task, Control, Comms.',
        nodes: [
          { h: 'Control graph', p: 'Who coordinates: one supervisor, a hierarchy, or nobody - possibly changing at runtime via handoff', hl: true },
          { h: 'Communication graph', p: 'How they communicate: direct messages, broadcast, or a shared workspace' },
          { h: 'Task graph', p: 'How work is decomposed: up front by a planner, by bidding, or emergently from local rules' },
        ],
        notes:
          'Students are taught to read any multi-agent diagram with this vocabulary. The three graphs are the spine of the lecture.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'The gallery',
        title: 'Eight architectures',
        cols: ['Architecture', 'Shape', 'Named weakness'],
        rows: [
          ['Supervisor-worker', 'One agent plans, delegates and integrates; workers see only their subtask', 'The supervisor bottleneck - it re-reads every result and its context grows fastest'],
          ['Hierarchical', 'Supervisor-worker applied recursively', 'Where decomposition happens, and how much context crosses each boundary'],
          ['Pipeline / DAG', 'Fixed stages with a typed contract at each boundary', 'No path backwards: stage four cannot ask stage one for a better source'],
          ['Blackboard / shared memory', 'Agents coordinate through shared state', 'Consistency, concurrency control, provenance, versioning, garbage collection'],
          ['Committee / debate', 'Agents propose and discuss; a judge or vote resolves', 'Agreement without independence - same model and context means the same blind spot'],
          ['Market / auction', 'Agents bid for announced tasks on capability, cost and latency', 'Bids are self-reported, so an agent can win by overstating what it can do'],
          ['Swarm', 'No permanent coordinator', 'Communication complexity is O(n^2); rarely used in products'],
          ['Dynamic topology', 'Agents are added, removed or rewired while the task runs', 'Capacity scales with difficulty, but failures are hard to reproduce'],
        ],
        note: 'The summary table classifies architectures as Centralized, Decentralized or Hybrid. Supervisor-worker, Hierarchical and Pipeline/DAG sit clearly under Centralized, and Blackboard, Committee/debate and Swarm under Decentralized; the position of Market / auction relative to the Decentralized label is ambiguous in the extracted text and is not guessed here.',
        notes:
          'The deck maxim for the pipeline case: "one retry edge beats one more agent". Every architecture ships with a named weakness - that pairing is the point of the slide.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'Three topologies in detail',
        title: 'Centralized, mostly',
        cards: [
          {
            h: 'Supervisor-worker',
            p: 'Best when subtasks are independent and parallelizable. The supervisor plans, delegates and integrates; workers see only their subtask.',
          },
          {
            h: 'Hierarchical',
            p: 'Fits tasks that already decompose hierarchically - storage, query engine, testing. The open question is where decomposition happens and how much context crosses each boundary.',
          },
          {
            h: 'Pipeline / DAG',
            p: 'The cheapest topology to debug, because errors localise to a stage. But there is no path backwards.',
          },
        ],
        note: 'Real systems are hybrids: the deck\'s "Planner agent + Coder/Researcher/Tester/Reviewer + Shared Git + dynamic task DAG" combines hierarchy, shared memory, pipeline and re-planning.',
        notes:
          'The hybrid example is the one to quote when students ask what to actually build.',
      },
      {
        layout: 'twocol',
        kicker: 'Shared state',
        title: 'Blackboard architecture',
        left: {
          h: 'What it gives you',
          li: [
            'Agents coordinate through shared state instead of direct messages',
            'The workspace may be a database, vector store, filesystem, Git repo or task graph',
            'Agents can join or leave without rewiring',
            'Shared state is durable and inspectable',
          ],
        },
        right: {
          h: 'What it costs',
          li: [
            'Consistency',
            'Concurrency control',
            'Provenance',
            'Versioning',
            'Garbage collection',
          ],
        },
        note: 'This workspace is the same shared state that the Lecture 6 memory deck formalises as a memory store.',
        notes:
          'The blackboard is the storage half of the memory stack, and it reappears in Lecture 8 as a provider inside a modular harness.',
      },
      {
        layout: 'twocol',
        kicker: 'Markets and committees',
        title: 'Two ways to resolve without a planner',
        left: {
          h: 'Market / auction',
          p: 'Agents bid for announced tasks on capability, cost and latency, so work lands on the cheapest capable agent with no central planner.',
          li: [
            'Worked example: A100 node $0.20, ETA 3s; T4 node $0.05, ETA 10s; H100 node $0.40, ETA 1s',
            'Rule: cheapest bid under 5s wins - the job goes to the A100 node',
          ],
        },
        right: {
          h: 'Committee / debate',
          p: 'Agents propose and discuss, then a judge or vote resolves.',
          li: [
            'Failure mode: agreement without independence - same model and context means the same blind spot',
            'Market failure mode: bids are self-reported, so an agent can win by overstating what it can do',
          ],
        },
        notes:
          'Both are named as "this is the thing students get wrong": committees converge on the wrong answer for the same reason, and markets reward dishonest bids.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'The extremes',
        title: 'Swarm, dynamic topology, and the hybrid that is real',
        cards: [
          {
            h: 'Swarm',
            p: 'No permanent coordinator, so it needs protocols for discovery, addressing, synchronization, termination and trust. Communication complexity is O(n^2) and it is rarely used in products.',
          },
          {
            h: 'Dynamic topology',
            p: 'Adds, removes or rewires agents while the task runs - a support bot adding billing and log agents only on escalation. Capacity scales with difficulty, but failures are hard to reproduce.',
          },
          {
            h: 'The hybrid',
            p: 'Planner agent + Coder/Researcher/Tester/Reviewer + Shared Git + dynamic task DAG. It combines hierarchy, shared memory, pipeline and re-planning.',
          },
        ],
        notes:
          'A dense mesh is rarely the best default: more communication can increase context pressure without increasing useful information.',
      },
      {
        layout: 'twocol',
        kicker: 'Decomposition',
        title: 'Axes, specs, and modes',
        left: {
          h: 'Six axes to split on',
          li: ['Data', 'Expertise', 'Stage', 'Hypothesis', 'Tool', 'Authority'],
          p: 'Example: a 200-file PR split by data (files), then by expertise (security, perf).',
        },
        right: {
          h: 'Eight fields a sub-task spec needs',
          li: [
            'Objective',
            'Inputs and relevant context',
            'Boundaries and exclusions',
            'Available tools and permissions',
            'Expected output schema',
            'Completion test',
            'Budget and deadline',
            'Dependencies',
          ],
        },
        note: 'A poor sub-task: "Research storage systems". A better one: "identify storage-related papers published in 2026; return title, date, system contribution, evaluation scale and primary-source URL; exclude database query optimization". Decomposition can be static, dynamic, recursive or opportunistic.',
        notes:
          'Decomposition needs spawning limits, budgets, depth limits and termination conditions, or delegation explodes. That is the warning the slide carries.',
      },
      {
        layout: 'table',
        kicker: 'Granularity',
        title: 'Parallelism has to pay for itself',
        cols: ['Quantity', 'Value'],
        rows: [
          [
            'T_multi ~= T_planning + T_critical_path + T_communication + T_merge',
            'Parallelization only helps when the saved sequential work exceeds planning, communication and integration cost',
          ],
          ['Batching example', '20 one-line lookups batched into 4 subtasks'],
        ],
        note: 'Named decomposition failures: 01 Overlap, 02 Gap, 03 Hidden dependency, 04 Unmergeable outputs, 05 Lost global context, 06 Straggler. A gap example: "2020-2023" plus "2025-2026" skips 2024. A straggler example: six agents finish in 20s, 25s, 4 min - and one straggler sets the total.',
        notes:
          'The straggler example is the one that connects to Lecture 3: the slowest subtask sets the total time, which is why subagent parallelism buys elapsed time and not answer quality.',
      },
      {
        layout: 'table',
        kicker: 'Communication',
        title: 'Four dimensions, three media, six channels',
        cols: ['Dimension', 'Values'],
        rows: [
          ['Dimensions', 'Topology, medium, format and semantics, channel'],
          ['Media', 'Message passing, shared memory, files and artifacts including a database'],
          ['Channels', 'p2p, broadcast, pub-sub, shared blackboard, request-response, artifact passing'],
          ['Formats', 'Natural language - flexible but ambiguous; structured - easy to validate, less expressive'],
        ],
        note: 'A worked message: task_id "T17", type "result", status "complete", confidence 0.82, evidence ["log:2391", "commit:X"], artifact "analysis/T17.json".',
        notes:
          'Messages should carry semantics: natural language for content, structured protocol for coordination, so the runtime can route, retry and stop without asking an LLM what the message meant.',
      },
      {
        layout: 'twocol',
        kicker: 'Control messages',
        title: 'Nine runtime operations, and the failure they must survive',
        left: {
          h: 'The nine operations',
          li: [
            'DELEGATE, QUERY, REPORT, HANDOFF, UPDATE, CANCEL, ACK, ERROR, COMPLETE',
            'A worked control message: id "msg-381", task_id "t-17", from "planner", to "researcher", type "DELEGATE"',
          ],
        },
        right: {
          h: 'The failure scenario',
          p: 'The task is to "purchase 8 GPU instances". The network times out and no reply comes back.',
          li: [
            'At-most-once, at-least-once - and "is exactly-once even available here?"',
            'The answer is an idempotency key on the task_id',
          ],
        },
        notes:
          'This is taught as a distributed-systems problem, not an NLP problem. The timeout asks about exactly-once semantics and compensation, and structured control fields are what let the runtime act on its own.',
      },
      {
        layout: 'twocol',
        kicker: 'Inherited problems',
        title: 'What multi-agent inherits, and what black-box LLMs add',
        left: {
          h: 'From distributed systems',
          li: [
            'Partial failure',
            'Concurrency and non-determinism',
            'Consistency',
            'No global clock',
            'Unreliable network',
            'Debugging and observability',
          ],
        },
        right: {
          h: 'From the LLM layer',
          li: [
            'Scheduling, state management and resource allocation on top',
            'Information loss',
            'Context pollution',
            'Stale information',
            'Conflicting beliefs',
            'Lost ownership and communication loops',
          ],
        },
        notes:
          'The L6 memory deck names the same disease - information loss and context pollution - from the other side.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'A2A',
        title: 'The agent-to-agent protocol',
        cards: [
          {
            h: 'The shape',
            li: [
              'A machine-readable agent card at a well-known path - for example GET /.well-known/agent-card.json',
              'Three abstractions: Message, Task, Artifact',
              'A stateful task lifecycle with eight states: Submitted, Working, Input required, Auth required, Completed, Failed, Rejected, Canceled',
              'Three tracking modes: polling for short jobs, streaming for interactive, push notification for hours-long jobs',
            ],
          },
          {
            h: 'Worked example',
            li: [
              'Task: "Analyze whether company X should move its inference stack to GPUs Y."',
              'Peers: Research Agent, Finance Agent, Search Agent, Coding Agent',
              'Agent card: "Travel Agent", skill id "book-flight", capabilities streaming: true',
              'Task-42 moves working to completed; a follow-up "Which date?" is answered "Oct 3"',
            ],
          },
        ],
        note: 'A2A standardizes communication, not orchestration.',
        notes:
          'The memorable claim: one A2A remote agent may itself call twenty MCP servers. A2A is service-to-service RPC; MCP is device-to-API.',
      },
      {
        layout: 'table',
        kicker: 'MCP vs A2A',
        title: 'Two different boundaries',
        cols: ['', 'MCP', 'A2A'],
        rows: [
          ['Primary abstraction', 'Tools, resources, prompts', 'Message, Task, Artifact'],
          ['Relationship', 'One client speaks to many servers', 'Agent-to-agent'],
          ['Discovery', 'The host, not the model, decides what is exposed', 'Agent card at a well-known path'],
          ['Unit of work', 'A capability call', 'A task with a stateful lifecycle'],
          ['Internal state', 'The host holds it', 'The agent holds it'],
          ['Analogy', 'Device / API', 'Service-to-service RPC'],
        ],
        note: 'MCP is the agent-to-capability boundary; A2A is the agent-to-agent boundary. The two compose: an A2A remote agent may itself call twenty MCP servers.',
        notes:
          'This is the direct ancestor of the Lecture 8 harness comparison: MCP becomes one of the modular harness\'s providers, and the microkernel is the "A2A with services" shape.',
      },
      {
        layout: 'bullets',
        kicker: 'Closing',
        title: 'Four design principles',
        items: [
          { h: '1. Is multi-agent really necessary?' },
          { h: '2. Decide the topology.' },
          {
            h: '3. Identify the information-loss points.',
            p: 'A supervisor aggregating four workers\' results is where detail drops.',
          },
          {
            h: '4. Identify the failure-containment boundaries.',
            p: '"A dense mesh is rarely the best default. More communication can increase context pressure without increasing useful information."',
          },
        ],
        notes:
          'The deck closes on these four questions, and the next class is "Agent design III, Agent memory, Agent reliability, Agent evaluation".',
      },
    ],
  },
  /* ==================================================================== */
  /* 7. lecture-06                                                         */
  /* ==================================================================== */
  {
    id: 'lecture-06',
    slug: 'lecture-06',
    title: 'Lecture 6 - Agent memory and reliability',
    navTitle: 'Lecture 6 - Memory and reliability',
    navBlurb: 'Memory as a pipeline of policy decisions, then reliability as arithmetic and as failure attribution across five layers.',
    footerLabel: 'CS2680 · Lecture 6 · 6_agent_design_3.pdf',
    source: `${S}/slides/6_agent_design_3.pdf`,
    sources: [
      { url: `${S}/slides/6_agent_design_3.pdf`, label: 'Lecture 6 slide deck - 31 pages' },
      { url: 'https://cs2680.com/notes/agent-evaluation', label: 'reference note cited in the logistics slide' },
    ],
    slides: [
      {
        layout: 'cover',
        kicker: 'Lecture 6 · Sep 28, 2026 · 31 slides',
        title: 'Agents design III: agent memory and reliability',
        lede: 'The two long-horizon concerns: persistent state beyond the context window, and what to do when a 50-step run has nine chances to go wrong.',
        pills: ['6 policy questions', '7-stage pipeline', 'Reliability arithmetic', '5 fault origins'],
        meta: 'slides/6_agent_design_3.pdf',
        notes:
          'The deck title on the source slide carries a typo - "memory, and reliabiltiy" - and one product is spelled "supermemory" in lowercase. Both are preserved as printed.',
      },
      {
        layout: 'twocol',
        kicker: 'The definition',
        title: 'Memory is persistent state beyond the context window',
        left: {
          h: 'Context window',
          p: 'Temporary working state.',
          li: ['Dies with the session', 'Re-sent on every step'],
        },
        right: {
          h: 'Memory store',
          p: 'Persistent state across interactions.',
          li: ['Loaded at session start', 'Has its own lifecycle, cost and failure modes'],
        },
        note: 'The same navigation - Keeping? Format? Backend? Need it? Lesson? Valid? - runs on every slide of the memory half, so the design space stays visible.',
        notes:
          'Six policy questions, each with a named decision: keeping (WRITE OR SKIP), format (ENCODE / ORGANIZE), need (RETRIEVE), lesson (REFLECT / GENERALIZE), valid (KEEP / UPDATE / DELETE), backend (STORE). "Who owns the memory?" appears to be the lead-in answered on p15, not one of the six.',
      },
      {
        layout: 'twocol',
        kicker: 'The first question',
        title: 'Keeping: recall against noise',
        left: {
          h: 'Write every interaction',
          p: 'High recall, noisy.',
        },
        right: {
          h: 'Write selectively',
          p: 'High precision, through one of four routes.',
          li: ['Explicit user request', 'Deterministic rules (heuristics)', 'A small classifier', 'Periodic LLM review'],
        },
        notes:
          'The whole memory half is a set of policy decisions, not a database. Every stage - observe, select, encode, store, retrieve, reflect, forget - is a decision the designer has to make.',
      },
      {
        layout: 'table',
        kicker: 'The second question',
        title: 'Format: four memory representations',
        cols: ['Representation', 'Character', 'Example from the deck'],
        rows: [
          ['Raw events / episodes', 'High fidelity, large and redundant', 'Raw interaction log'],
          ['Unstructured summaries', 'Compact, may lose context', '"We moved serving from vLLM to SGLang."'],
          ['Structured state', 'Queryable, schema constrains', '{"serving_engine":"SGLang"}'],
          ['Knowledge graph', 'Linked entities that change over time', 'Project -> USES -> SGLang'],
        ],
        notes:
          'The format choice is the first thing that drives cost later, because the format decides what a retrieval has to scan.',
      },
      {
        layout: 'table',
        kicker: 'The third question',
        title: 'Backend: four storage classes',
        cols: ['Class', 'What it is for', 'Examples on the slide'],
        rows: [
          ['Plain files', 'Easy to inspect, diff, search', 'CLAUDE.md, scratchpad'],
          ['Key-value or relational', 'Exact lookup, filtering, transactions', 'Redis, SQLite, Postgres JSONB'],
          ['Vector store', 'Exact or approximate similarity search', 'pgvector, Chroma, Pinecone'],
          ['Graph database', 'Relationship queries, multi-hop traversal', 'Neo4j, FalkorDB (Graphiti)'],
        ],
        notes:
          'This is the storage half of the blackboard workspace Lecture 5 introduced, and it is where the memory benchmarks in the evaluation note bite.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'Usage policy',
        title: 'Three ways to decide when to use memory',
        cards: [
          {
            h: 'Automatic',
            p: 'Every turn: search, LLM, add. Predictable, but adds latency and irrelevant context.',
          },
          {
            h: 'Runtime-controlled',
            p: 'if memory_needed: search(); if memorable: add(). Selective, but needs rules or a classifier.',
          },
          {
            h: 'Model-controlled',
            p: 'search_memory(), add_memory(), update_memory(), forget_memory(). Demand-driven, but may miss useful reads or writes.',
          },
        ],
        note: 'Many systems use a hybrid, and the read policy and the write policy may differ.',
        notes:
          'The read and write policies being separable is the practical point: an agent can be told when to look without being told when to write.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'The fourth question',
        title: 'Retrieval needs more than semantic relevance',
        cards: [
          { h: 'Semantic match', p: 'Is it about the same thing?' },
          { h: 'Scope', p: 'Same user, project, entity or task.' },
          { h: 'Importance', p: 'The cost of missing it, or of including it.' },
          { h: 'Validity', p: 'Is it true for this task at this time?' },
          { h: 'Provenance', p: 'Source, confidence, evidence.' },
        ],
        notes:
          'Five retrieval signals. This is the point where the evaluation note\'s "memory recall and query latency" dimension gets its operational meaning.',
      },
      {
        layout: 'twocol',
        kicker: 'The fifth question',
        title: 'Lesson: consolidation and forgetting',
        left: {
          h: 'Generalise',
          p: 'Repeated questions about vLLM, SGLang, TRT-LLM and LLM scheduling become the hypothesis "frequent interest in LLM inference systems", at medium confidence.',
          li: [
            'Consolidate every N events or on context fill',
            'Consolidate when facts conflict or repeat',
            'Or consolidate in a background job',
          ],
        },
        right: {
          h: 'Forget',
          p: 'Forgetting is a first-class operation, not a missing feature.',
          li: [
            'Controls: mark invalid, erase permanently, expire after a TTL, tier and evict from active memory',
            'Reasons: stale information; incorrect or conflicting information; privacy and security; storage and retrieval cost',
          ],
        },
        notes:
          'This is the second "students get this wrong" point: a memory without a valid time silently overrides newer information.',
      },
      {
        layout: 'twocol',
        kicker: 'The sixth question',
        title: 'Valid time and provenance are part of the data model',
        left: {
          h: 'The same fact, twice',
          li: [
            'April 2026: the project serves models with vLLM - superseded',
            'June 2026: the project serves models with SGLang - current',
          ],
        },
        right: {
          h: 'The source',
          li: [
            'Episode 28 is the source of the fact',
            'The relation is written Project -> SERVES_WITH -> SGLang',
          ],
        },
        note: 'Validity time and provenance are not metadata you add later; they are part of what a memory is.',
        notes:
          'If you cannot say when a fact stopped being true and where it came from, you cannot expire it, and you will eventually act on a stale fact.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Ownership',
        title: 'Who owns the memory?',
        cards: [
          {
            h: 'Agent-owned memory',
            p: 'Files in the harness: CLAUDE.md, an agent scratchpad, task notes, persisted to disk by the harness.',
          },
          {
            h: 'A dedicated memory system the agent calls',
            p: 'Mem0 - fact-centric; messages scoped by user, agent and run; vector search with filters, plus optional graph memory.',
            li: [
              'Graphiti - temporal knowledge graph over episodes; hybrid semantic, keyword and graph search; facts valid from a date',
              'supermemory - maintains a user profile alongside memory and document, with conversations linked to source and time',
            ],
          },
        ],
        notes:
          'The three named systems differ in granularity: fact-centric, temporal graph, and profile-centric. That choice is the difference between a lookup table and a model of the user.',
      },
      {
        layout: 'flow',
        kicker: 'The pipeline',
        title: 'Seven stages, and eight ways it fails',
        lede: 'Memory checklist: Observe, Select, Encode/organize, Store, Retrieve, Reflect/consolidate, Forget.',
        nodes: [
          { h: 'Observe', p: 'stage 1' },
          { h: 'Select', p: 'stage 2' },
          { h: 'Encode', p: 'stage 3' },
          { h: 'Store', p: 'stage 4' },
          { h: 'Retrieve', p: 'stage 5' },
          { h: 'Reflect', p: 'stage 6' },
          { h: 'Forget', p: 'stage 7', hl: true },
        ],
        note: 'Memory failure modes, eight of them: retrieval miss, context pollution, memory hallucination, staleness, isolation failure, overgeneralization, persistent prompt injection, unbounded growth.',
        notes:
          'The deck reuses the same six navigation questions on every slide, so the design space stays visible while each stage is discussed.',
      },
      {
        layout: 'table',
        kicker: 'How memory is measured',
        title: 'Four evaluation axes, and four benchmarks',
        cols: ['Axis', 'Metrics'],
        rows: [
          ['Writes and update', 'Precision, recall, stale-memory rate'],
          ['Retrieval', 'Precision, recall'],
          ['System', 'Latency, token overhead, store growth'],
          ['Governance', 'Deletion compliance, scope isolation'],
        ],
        note: 'Named benchmarks: LoCoMo (ACL 2024) - 1,540 questions over 10 long dialogues; LongMemEval (ICLR 2025) - 500 questions over 5 memory abilities; BEAM (ICLR 2026) - 2,000 questions, up to 10M tokens; and LoCoMo-Refined.',
        notes:
          'These are the benchmarks the Lecture 7 component-level evaluation is built to measure. Memory is the component that usually gets measured first, because it is the easiest to isolate.',
      },
      {
        layout: 'table',
        kicker: 'Reliability, first as arithmetic',
        title: 'Errors compound',
        lede: 'With each step succeeding independently with probability 0.95, a long run is not likely to be clean.',
        cols: ['Steps in the trajectory', 'Chance of an error-free run'],
        rows: [
          ['1', '95%'],
          ['5', '77%'],
          ['10', '60%'],
          ['20', '36%'],
          ['50', '8%'],
        ],
        note: 'A 50-step run finishes error-free only about 1 in 13 times. The deck notes that error propagation makes real runs worse than this model.',
        notes:
          'This is the cheapest slide in the course and the most persuasive: bound the run, or accept the compounding.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Reliability, then as attribution',
        title: 'Five fault origins',
        cols: ['Layer', 'Failure modes', 'Example from the deck'],
        rows: [
          ['User / task spec', 'Specification failure: ambiguous goal, proxy objective, unstated constraint, no definition of done, conflicting goals', '5 modes'],
          ['Agent harness', 'Harness failure: context truncation, memory error, state corruption, control loop error, blocking fan-out', '"200 steps, no progress"'],
          ['LLM', 'Model failure: hallucination, instruction violation, faulty reasoning, reasoning-action mismatch, unverified success, long-horizon degradation', '"requests.fetch() exists"; "undid its own fix from step 12"'],
          ['Tool layer', 'Tool failure: truncated output, silent failure, ambiguous schema, flaky call, misleading error', 'The first 100 lines of a log missed an error on line 4,000; a date with no time zone scheduled a job 8 hours off; retried with sudo'],
          ['Environment', 'Environment failure: stale state, version mismatch, random failure, rate limit', 'Python 3.8, not 3.12; HTTP 429 after 50 calls; leap year; redesigned checkout page'],
        ],
        note: 'Each layer carries a table of concrete failure modes paired with a fix. The counts: 5 specification failures, 5 harness failures, 6 model failures, 5 tool failures, 4 environment failures.',
        notes:
          'Locate the fault layer before fixing anything. Most "the model is bad" reports are really layer two or layer five.',
      },
      {
        layout: 'quote',
        text: 'We do not yet understand agents at scale, and there is little formal best practice.',
        attribution: 'Lecture 6, PDF page 30 - the closing caveat',
        notes:
          'Because there is no formal best practice yet, the deliverable is a checklist of bounds - step, cost and time caps, checkpoints, typed schemas, pinned environments - rather than a recipe.',
      },
    ],
  },

  /* ==================================================================== */
  /* 8. lecture-07                                                         */
  /* ==================================================================== */
  {
    id: 'lecture-07',
    slug: 'lecture-07',
    title: 'Lecture 7 - Agent evaluation',
    navTitle: 'Lecture 7 - Agent evaluation',
    navBlurb: 'What to measure, which benchmarks exist, why leakage is not just a training problem, and why benchmarks saturate.',
    footerLabel: 'CS2680 · Lecture 7 · 7_agent_design_4.pdf',
    source: `${S}/slides/7_agent_design_4.pdf`,
    sources: [
      { url: `${S}/slides/7_agent_design_4.pdf`, label: 'Lecture 7 slide deck - 37 pages' },
      { url: `${S}/notes/agent-evaluation.html`, label: 'the reference note this lecture is built on' },
    ],
    slides: [
      {
        layout: 'cover',
        kicker: 'Lecture 7 · Sep 30, 2026 · 37 slides',
        title: 'Agent design IV: agent evaluation',
        lede: 'What a benchmark actually grades, where the numbers come from, and why a suite of six months old is a moving target.',
        pills: ['Component and end-to-end', '8 benchmark families', 'Leakage', 'Saturation'],
        meta: 'slides/7_agent_design_4.pdf',
        notes:
          'The lecture in one line: evaluation is an economics-of-time problem, and benchmarks are a consumable that has to be retired.',
      },
      {
        layout: 'twocol',
        kicker: 'Scope',
        title: 'Two levels of evaluation',
        left: {
          h: 'Component-level',
          p: 'Inside the agent.',
          li: [
            'Planning',
            'Task decomposition',
            'Tool use: discovery, selection, parameterization',
            'Memory',
            'Error recovery',
          ],
        },
        right: {
          h: 'End-to-end',
          p: 'Outside the agent.',
          li: ['Success rate', 'Cost', 'Latency'],
        },
        notes:
          'The Lecture 5 decomposition vocabulary is reused here: the same agent that Lecture 5 says should be decomposed gets evaluated at component level and end to end.',
      },
      {
        layout: 'timeline',
        kicker: 'History',
        title: 'Six eras of benchmarks',
        items: [
          { when: 'Before 2018', h: 'Language modeling', p: 'Narrow tasks' },
          { when: '2018-2019', h: 'Transfer learning', p: 'General NLU' },
          { when: '2020-2022', h: 'Foundation models', p: 'Capability' },
          { when: '2023-2024', h: 'Agents and tools', p: 'Context, modalities' },
          { when: '2024-2025', h: 'Difficulty and freshness', p: 'Robustness' },
          { when: '2025-2026', h: 'Larger scope', p: 'Less specific instructions, more realistic use cases' },
        ],
        note: 'Benchmarks named per era: before 2018 - Penn Treebank, WikiText, LAMBADA, SQuAD; 2018-2019 - GLUE, SuperGLUE, ARC, HellaSwag, WinoGrande; 2020-2022 - MMLU, BIG-bench, GSM8K, MATH, HumanEval, TruthfulQA, HELM; 2023-2024 - MT-Bench, Chatbot Arena, AlpacaEval, IFEval, LongBench, MMMU, GPQA, AgentBench, WebArena, GAIA, SWE-bench, OSWorld, tau-bench; 2024-2025 - MMLU-Pro, LiveBench, LiveCodeBench, MMMU-Pro, FrontierMath, Humanity\'s Last Exam; 2025-2026 - GDPval, BrowseComp, Terminal-Bench, ARC-AGI-3.',
        notes:
          'Six eras, and each era adds a demand rather than replacing the last. The era list is the reason the evaluation note is organised by task format rather than by difficulty.',
      },
      {
        layout: 'table',
        kicker: 'What we measure',
        title: 'Five evaluation objectives',
        cols: ['Objective', 'Representative benchmarks', 'Definition of success'],
        rows: [
          ['Predict text', 'PTB, WikiText', 'Perplexity'],
          ['Produce a correct answer', 'MMLU, GSM8K, GPQA, HLE', 'Answer accuracy'],
          ['Produce a preferred response', 'Arena, AlpacaEval, MT-Bench', 'Preference or win rate'],
          ['Produce functioning code', 'HumanEval, LiveCodeBench, SWE-bench', 'Tests pass'],
          ['Complete an interactive task', 'WebArena, OSWorld, tau-bench, Terminal-Bench', 'Task success'],
        ],
        notes:
          'Five objectives, each with its own definition of success. A number without a definition of success is not a measurement.',
      },
      {
        layout: 'table',
        kicker: 'Metrics',
        title: 'Four metric families',
        cols: ['Family', 'Metrics', 'Caveat on the slide'],
        rows: [
          ['Earlier benchmarks', 'Perplexity, accuracy or F1, preference or win rate', 'A composite hides uneven subject performance'],
          ['Capability', 'Pass@k, and Pass^k - all k solutions pass', 'Pass^k was introduced by tau-bench'],
          ['Cost', 'Mostly LLM cost', 'Tool calls and other overheads, such as an LLM cache miss, are "overlooked"'],
          ['Latency / duration', 'Not just the LLM', 'Tool time counts'],
        ],
        notes:
          'The reference note for this lecture is https://cs2680.com/notes/agent-evaluation, curated by the instructor and reviewed by the instructor and the TFs.',
      },
      {
        layout: 'steps',
        kicker: 'The generic loop',
        title: 'How a benchmark scores a run',
        lede: 'The same loop underlies most of the suites in the landscape.',
        steps: [
          { n: '1', h: 'Reset', p: 'Reset the environment to the task\'s initial state.' },
          { n: '2', h: 'Observe', p: 'The agent observes the environment.' },
          { n: '3', h: 'Act and execute', p: 'Repeat while not terminated and within budget.' },
          { n: '4', h: 'Score', p: 'Score the final answer, the final environment state and the trajectory.' },
        ],
        notes:
          'What gets scored is the thing that distinguishes the benchmarks: final answer, call sequence, database state, patch tests, final system state, or checkpoints.',
      },
      {
        layout: 'twocol',
        kicker: 'GAIA',
        title: 'Research-and-answer agents, end to end',
        left: {
          h: 'The setup',
          li: [
            '466 human-written questions over web browsing, spreadsheets, PDFs, images, audio and calculation',
            'No fixed tool API - each agent brings its own search, browser, Python and shell, so it tests the whole agent system rather than the LLM',
            'Only the final answer is scored',
            'Three difficulty levels scale steps and tool count: Level 1 is 5 steps or fewer with zero or one tool; Level 2 is 5-10 steps with multiple tools; Level 3 is arbitrarily long with many tools',
          ],
        },
        right: {
          h: 'The scoring rule',
          p: 'score = (1/N) * sum_i 1[ normalize(y_hat) = normalize(y) ]',
          li: [
            'Short answers: a number, a string or a list - for example 17.4 or 4,381',
            'It does not measure: send email, book a flight, modify a database, submit a form, update an issue',
            'Source: Mialon et al., GAIA, arXiv 2023',
          ],
        },
        notes:
          'The "does not measure" list is the point of the slide: GAIA is an answer benchmark, so every task that requires a side effect is out of scope.',
      },
      {
        layout: 'twocol',
        kicker: 'BFCL',
        title: 'Berkeley Function Calling Leaderboard',
        left: {
          h: 'What it probes',
          li: [
            'Whether the model picks the right calls',
            'Whether it avoids irrelevant ones',
            'Whether it asks for a missing parameter instead of inventing one',
            'Example tools: search_flights(origin="BOS", destination="CHI", date=...), book_flight(flight_id=..., passenger_id=...), get_weather(...)',
          ],
        },
        right: {
          h: 'How it scores',
          li: [
            'AST or execution based',
            'Multi-turn checks on state plus reply',
            'V4 adds web search and memory',
            'Read category scores individually, not the composite',
            'Source: Patil et al., Berkeley Function Calling Leaderboard, ICML 2025',
          ],
        },
        notes:
          'This is the tool-interface benchmark, and it is the one that most directly tests the tool-design rules from Lecture 4.',
      },
      {
        layout: 'twocol',
        kicker: 'WebArena',
        title: 'Web workflows',
        left: {
          h: 'The setup',
          li: [
            '812 tasks',
            'Self-hosted shopping, admin, Reddit, GitLab, maps and Wikipedia sites',
            'An accessibility tree observation, with click, type and stop actions',
            'A reset snapshot and a trajectory are recorded',
          ],
        },
        right: {
          h: 'The scoring',
          li: [
            'Functional checks',
            'Binary success, 1 or 0',
            'WebArena-Verified replaces LLM-as-a-judge with deterministic checks on HTTP traces',
            'Source: Zhou et al., WebArena, ICLR 2024; WebArena-Verified, ServiceNow, 2025',
          ],
        },
        notes:
          'The Verified variant is the important development: it removes the judge from the loop, which removes a whole class of measurement error.',
      },
      {
        layout: 'twocol',
        kicker: 'OSWorld',
        title: 'Desktop operation in pixels',
        left: {
          h: 'The setup',
          li: [
            '369 tasks in real applications',
            'Pixel observations - screenshots - and mouse and keyboard actions',
            'A setup logic, a trajectory, a final state and an evaluator producing a reward',
          ],
        },
        right: {
          h: 'OSWorld 2.0',
          li: [
            '108 long workflows, often 1 hour or more',
            'Hundreds of steps per workflow',
            'About 27 checkpoints, giving partial credit',
            'Source: Xie et al., OSWorld, NeurIPS 2024; os-world.github.io',
          ],
        },
        notes:
          'The move from an accessibility tree to pixels is what makes this a perception problem as well as a control problem.',
      },
      {
        layout: 'twocol',
        kicker: 'SWE-bench',
        title: 'A patch is scored by running the tests',
        left: {
          h: 'The rule',
          p: 'Score a patch by applying it to the repo and running the tests.',
        },
        right: {
          h: 'The variants',
          li: [
            'Verified - human-checked',
            'Lite - a 300-task subset',
            'Multilingual - 9 languages',
            'Multimodal - image issues',
            'Pro - harder, multi-file',
          ],
        },
        note: 'Sources: Jimenez et al., 2024; OpenAI, 2024; Deng et al., 2025; swebench.com',
        notes:
          'This is the benchmark Lecture 4 uses to argue the harness doubles accuracy - the same kind of measurement, so the comparison is like for like.',
      },
      {
        layout: 'twocol',
        kicker: 'tau-bench',
        title: 'A simulated user, a policy, and a database',
        left: {
          h: 'The setup',
          li: [
            'A simulated user - an LLM playing the customer',
            'The agent is bound by the airline policy: basic economy cannot be modified',
            'Tools and an airline database whose state really changes',
            'Source: Yao et al., tau-bench, arXiv 2024',
          ],
        },
        right: {
          h: 'The scoring',
          p: 'r = r_action * r_output',
          li: [
            'The action term: the final database matches the annotated goal state',
            'The output term: the user-facing response includes the required information',
            'Read-only calls may vary, but unintended writes cause failure',
            'Pass^k is deliberately stricter than Pass@k',
          ],
        },
        note: 'tau^3-bench adds corrected tasks, more domains, knowledge retrieval and voice evaluation.',
        notes:
          'tau-bench is where the multiplicative reward and Pass^k come from. It is also the clearest example of a benchmark that grades process and outcome together.',
      },
      {
        layout: 'twocol',
        kicker: 'Terminal-Bench and TheAgentCompany',
        title: 'Two suites that grade something other than an answer',
        left: {
          h: 'Terminal-Bench',
          li: [
            'A task is packaged as instruction.md, Dockerfile and tests/test.sh inside a container',
            'The final system state is graded with a test suite',
            'Domains: programming, sysadmin and server config, data processing, model training, security, scientific workflows',
            '89 tasks in TB 2.0, and 66 in TB 4.0',
            'Hidden human solutions, and an 8-hour timeout',
            'Positioned between SWE-bench and OSWorld: no GUI grounding',
          ],
        },
        right: {
          h: 'TheAgentCompany',
          li: [
            'A simulated company: GitLab, Plane tickets, ownCloud, RocketChat, and LLM-simulated coworkers',
            '175 tasks across software, PM, data science, HR and finance',
            'Partial progress is scored across a job with checkpoints, not just the final state',
            'S_partial = 0.5 * earned/total + 0.5 * S_full, so 4/8 incomplete is 0.25, 7/8 incomplete is 0.44, and 8/8 complete is 1.00',
            'Source: Xu et al., TheAgentCompany, arXiv 2024; the-agent-company.com',
          ],
        },
        notes:
          'Both suites exist because single-outcome scoring is not enough for long, multi-application work. That is the argument the next slides make in general terms.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'The landscape',
        title: 'Eight benchmarks, by what they grade',
        cols: ['Benchmark', 'Environment', 'Typical actions', 'What is graded'],
        rows: [
          ['GAIA', 'Web, spreadsheets, PDFs, images, audio', 'Search, browse, compute', 'The final answer only'],
          ['WebArena', 'Self-hosted web sites', 'Click, type, stop', 'Functional checks; binary success'],
          ['OSWorld', 'Real desktop applications', 'Mouse and keyboard on pixels', 'Final state via an evaluator, with reward'],
          ['SWE-bench', 'A repository', 'Read, edit, run tests', 'The patch, scored by running the tests'],
          ['BFCL', 'A tool interface', 'Call, or ask for a missing argument', 'AST or execution based, per category'],
          ['tau-bench', 'An airline database and a simulated user', 'Talk, then call APIs that change state', 'Database state and the response, multiplied'],
          ['Terminal-Bench', 'A container', 'Shell in a sandbox', 'The final system state, via a test suite'],
          ['TheAgentCompany', 'A simulated company', 'Work across apps', 'Weighted checkpoints plus full completion'],
        ],
        notes:
          'Read the suite as a matrix: the observation modality and the graded artifact are what actually differ. That is the same reading the reference note uses for its 48-entry directory.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Leakage',
        title: 'Four layers, not one',
        cards: [
          {
            h: 'The four layers',
            li: ['Training leakage', 'Eval-time leakage', 'Environment leakage', 'Benchmark overfitting'],
          },
          {
            h: 'Why the surface is bigger than it looks',
            p: 'Realistic tools enlarge the leakage surface, and a benchmark may be searchable.',
          },
        ],
        note: 'Leakage is not just a training-set problem: it runs through the whole stack.',
        notes:
          'This is the first of the two "students get this wrong" points in the lecture. A model that never saw the test set can still be reading a leaked file, a cached tool result, or a web page.',
      },
      {
        layout: 'flow',
        kicker: 'Leakage across the stack',
        title: 'Any component can carry benchmark information',
        lede: 'Modern agent performance is roughly P = f(LLM, prompt, scaffold, tools, retriever, memory, environment).',
        nodes: [
          { h: 'LLM', p: 'base model, fine-tuning' },
          { h: 'Prompt', p: 'the task text' },
          { h: 'Scaffold', p: 'the harness' },
          { h: 'Tools', p: 'and the retriever' },
          { h: 'Memory', p: 'and web search' },
          { h: 'Environment', p: 'and agent development', hl: true },
        ],
        note: 'Nine leakage entry points are marked on the components: base model, fine-tuning, prompt, retrieval, memory, web search, environment, scaffold and agent development. "The model was not trained on the test set" is nowhere near sufficient.',
        notes:
          'Scaffold and agent development are the two that catch people out, and they are exactly the parts this course asks students to build.',
      },
      {
        layout: 'twocol',
        kicker: 'Challenges',
        title: 'What single-turn scoring rewards',
        left: {
          h: 'The single user turn',
          p: 'Most benchmarks give one fully-specified instruction, with no user in the loop, while real work is ambiguous, revised and interrupted.',
          li: [
            'Single-turn scoring rewards confident guessing, because asking a clarifying question costs steps and earns no credit',
            'The three questions to ask instead: clarification, recovery and memory',
          ],
        },
        right: {
          h: 'Other weaknesses',
          li: [
            'Success rate alone is insufficient: a 200-step, $40 run against a 12-step, $0.30 run',
            'Non-determinism makes single-run scores noise rather than signal',
            'Outcome-only scoring passes lucky or unsafe runs, while trajectory matching fails valid ones',
          ],
        },
        notes:
          'The $40 run is the same argument the Assignment 3 leaderboard forces students to live with: capability, cost and time at once.',
      },
      {
        layout: 'table',
        kicker: 'Saturation',
        title: 'How fast the frontier reaches the human baseline',
        cols: ['Benchmark', 'Baseline', 'Months to reach it', 'Result'],
        rows: [
          ['GLUE (2018)', 'Human level (87.1)', '14', '91.1'],
          ['MMLU (2020)', 'Expert level (89.8)', '39', '92.3'],
          ['GPQA Diamond (2023)', 'PhD experts (69.7)', '10', '96.0'],
          ['SWE-bench Verified (2024)', '-', '22', '33% to 95%'],
          ['ARC-AGI-2 (2025)', 'Average human (60)', '11', '95.0'],
          ['ARC-AGI-3 (2026)', '-', '6*', '0.5% to 62.7%'],
        ],
        note: 'The ARC-AGI-3 row is marked "6 months*" on the slide, but the asterisk footnote is not present in the extracted text, so it is reproduced as printed and not reconstructed.',
        notes:
          'The asterisk is a loose end in the source. The saturation timeline runs from 2016 to 2025 plus "Sep 2026".',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Retirement',
        title: 'What a saturated benchmark list looks like',
        cards: [
          {
            h: 'Saturated',
            p: 'SQuAD 1.1, GLUE, SuperGLUE, ARC-AGI-1, MMLU, MATH, HumanEval, Chatbot Arena, MT-Bench, WebArena, SWE-bench -> Verified, GPQA Diamond, MMMU, OSWorld, FrontierMath, Humanity\'s Last Exam, ARC-AGI-2, Terminal-Bench, GDPval, SWE-bench Pro, Remote Labor Index, ARC-AGI-3, OSWorld 2.0.',
          },
          {
            h: 'The definition, and the shift',
            p: 'A benchmark is saturated when the frontier reached the human baseline or top models stopped separating.',
            li: [
              'Evaluation is still evolving toward stateful, long-horizon, multi-grader, contamination-aware measurement',
              'Six dimensions are tracked: objective evaluated, interaction, grader, dataset, main metric, primary concern',
            ],
          },
        ],
        notes:
          'The saturated list is a reading of the slide, not a judgement of the benchmarks. Keep it as a shopping list for what to avoid as a headline number.',
      },
      {
        layout: 'twocol',
        kicker: 'The real objective',
        title: 'A real agent has more than three dimensions',
        left: {
          h: 'Capability, cost, speed, and usability',
          li: [
            'Capability - higher is better',
            'Cost - lower is better',
            'Speed',
            'Agent usability',
          ],
        },
        right: {
          h: 'Pareto dominance',
          p: 'A dominates B if A is no worse on any metric and better on at least one.',
          li: [
            'Rank 1 is the Pareto frontier',
            'Speed is not drawn on the slide',
            'Assignment 3 is evaluated on all three metrics, using this rule',
          ],
        },
        notes:
          'This is the hinge into Assignment 3: the leaderboard ranks on capability, cost and time at once, with Pareto-style ranks.',
      },
    ],
  },

  /* ==================================================================== */
  /* 9. lecture-08                                                         */
  /* ==================================================================== */
  {
    id: 'lecture-08',
    slug: 'lecture-08',
    title: 'Lecture 8 - Cost and performance',
    navTitle: 'Lecture 8 - Cost and performance',
    navBlurb: 'The cost decomposition, one slide per lever, budget caps, speculative actions, and three harness architectures compared across eight real harnesses.',
    footerLabel: 'CS2680 · Lecture 8 · 8_agent_design_5.pdf',
    source: `${S}/slides/8_agent_design_5.pdf`,
    sources: [
      { url: `${S}/slides/8_agent_design_5.pdf`, label: 'Lecture 8 slide deck - 54 pages' },
      { url: `${S}/notes/cost-effective-agents.html`, label: 'the reference note on cost-effective agents' },
    ],
    slides: [
      {
        layout: 'cover',
        kicker: 'Lecture 8 · Oct 7, 2026 · 54 slides',
        title: 'Advanced agent design I: cost and performance',
        lede: 'Every lever is a term in one equation - and every lever has a counter-cost.',
        pills: ['Cost equation', '6 levers', 'Budget caps', 'Speculative actions', '3 harness architectures'],
        meta: 'slides/8_agent_design_5.pdf',
        notes:
          'The stated scope of the lecture: it focuses on LLM cost while ignoring other compute costs. The official schedule attaches two decks to this date - this one and the Assignment 3 briefing.',
      },
      {
        layout: 'flow',
        kicker: 'The spine',
        title: 'The cost equation',
        lede: 'Adoption and engagement grow the first two factors; agent trajectories and unit price are the shrinkable ones.',
        nodes: [
          { h: 'Users', p: 'factor 1' },
          { h: 'Sessions / User', p: 'factor 2' },
          { h: 'Turns / Session', p: 'factor 3' },
          { h: 'Steps / Turn', p: 'factor 4' },
          { h: 'Tokens / Step', p: 'factor 5', hl: true },
          { h: 'Price / Token', p: 'factor 6', hl: true },
        ],
        note: 'Cost = Users x Sessions/User x Turns/Session x Steps/Turn x Tokens/Step x Price/Token. A session is many turns and a turn is many steps: one user turn is multiple LLM and tool steps.',
        notes:
          'Every lever slide after this one moves exactly one factor, and repeats the progress bar so students can see which one they are moving.',
      },
      {
        layout: 'table',
        kicker: 'The measured instance',
        title: 'What the class\'s own agents actually did',
        cols: ['Quantity', 'Assignment 1', 'Assignment 2'],
        rows: [
          ['Single-prompt sessions', '68%', '75%'],
          ['Median steps per turn', '3', '4'],
        ],
        note: 'Marathons reach 100+ turns. Some turns run almost 1,000 steps, mostly because effort is set to medium or high.',
        notes:
          'The numbers come from the students\' own runs in the first two assignments, which is why the class is unusually well placed to talk about cost.',
      },
      {
        layout: 'table',
        kicker: 'Tokens',
        title: 'Where the tokens go',
        cols: ['Quantity', 'Value'],
        rows: [
          ['Main agent tokens per step', 'Median 200K-300K (chart medians 208K for Assignment 1, 301K for Assignment 2); p90 600K-700K'],
          ['Subagent tokens per step', 'Median ~80K; p90 ~200K'],
          ['Context at step ~500', '670K (Assignment 1); 650K (Assignment 2)'],
        ],
        notes:
          'A 300K-token context on every step is the reason the context work in Lecture 4 is a cost lever and not only a quality lever.',
      },
      {
        layout: 'twocol',
        kicker: 'Lever 1 · Turns',
        title: 'Turns cost quadratically',
        left: {
          h: 'The fact',
          p: 'Turn k re-reads turns 1..k-1, so total cost grows with the square of the turn count.',
        },
        right: {
          h: 'The levers',
          li: [
            'Front-load planning',
            'Structured task decomposition, with a done check per subtask',
            'Self-verification before handoff',
            'The goal: finish autonomously with no user check-ins',
          ],
        },
        notes:
          'The quadratic property is what makes turn reduction the most valuable lever: it is not a constant-factor win.',
      },
      {
        layout: 'twocol',
        kicker: 'Lever 2 · Steps',
        title: 'Fewer model calls for the same work',
        left: {
          h: 'The example on the slide',
          p: 'One call per action is 4 model calls. Plan-then-batch is 2 model calls, with 3 tools run in parallel.',
        },
        right: {
          h: 'How to get there',
          li: [
            'Batch independent calls',
            'Reuse plans and skills',
            'Load context up front, because every model call re-reads the full context, so fewer calls cost less',
          ],
        },
        notes:
          'This is the same batching idea as the parallel-agent work in Lecture 3, applied inside one agent.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Lever 3 · Tokens',
        title: 'Shrink what enters, and reduce what comes out',
        cards: [
          {
            h: 'Shrink what enters',
            li: [
              'Drop stale results',
              'Compact history into state',
              'Compress observations, keeping errors not full logs',
              'Offload big outputs to files',
              'Retrieve selectively',
              'Isolate exploration in a sub-agent that returns a summary',
            ],
          },
          {
            h: 'Reduce the output',
            li: [
              'Prompt-level constraints: "Answer in <= 100 words.", "Return only JSON.", "One sentence. Top 3 items."',
              'Output-token caps: max_tokens=300 / max_output_tokens=300, though reasoning can use up the cap',
              'Structured output schemas',
              'Adaptive reasoning effort: lookup uses effort="low", debug uses effort="high"',
            ],
          },
        ],
        note: 'The "shrink what enters" list is the Lecture 4 context ladder, restated as a cost lever.',
        notes:
          'Related work named on the slides: ACON (2025) cut peak context by 26-54%; Active Context Compression (2026) 23% fewer tokens; TRACE (2026) on summaries causing rework; MemGPT (2023) on context as fast memory; Scroll (2026) as a lossless external log; LLMLingua (2023) up to 20x fewer tokens, with LongLLMLingua and LLMLingua-2 (2024); and Prompt Compression in the Wild (2026), which pays off only on long prompts. On tool data out of context: code execution with MCP (2025) 150K to 2K tokens, Tool Search (2025) 85% fewer tool tokens, and Programmatic Tool Calling at 37% fewer.',
      },
      {
        layout: 'table',
        kicker: 'The token economics',
        title: 'Cache reads dominate the bill',
        cols: ['Relation', 'Value'],
        rows: [
          ['Output against fresh prefill', 'Output is 5x smaller'],
          ['Fresh prefill against cache reads', 'Fresh prefill is 100x smaller'],
          ['Typical price ratio', 'cache read : input : output = 1 : 10 : 50'],
          ['Share of tokens that were cache reads', '97.6% (Assignment 1)'],
        ],
        note: 'Tokens that stay in context are paid for again on every later step. A stable prefix is worth more than a shorter prompt.',
        notes:
          'This is the "students get this wrong" point of the lecture: cost is dominated by things other than raw output length.',
      },
      {
        layout: 'twocol',
        kicker: 'Lever 4 · Price',
        title: 'Three shapes of price reduction',
        left: {
          h: 'Caching and batching',
          li: [
            'Maintain stable prefixes',
            'Batch what can wait',
            'Batch plus cached input: 0.05x the base input price',
            'Cached input: 0.1x; batch input: 0.5x; base input token: 1x; output token: 5x',
          ],
        },
        right: {
          h: 'Routing and later-lecture levers',
          li: [
            'Model routing: choose up front, escalate on failure, re-route each step',
            'Model optimization: MoE and sparsity, quantization, pruning, distillation, workload-targeted fine-tuning',
            'Serving engine: speculative decoding, KV-cache optimization, better request scheduling',
            'Hardware: faster kernels, better kernel scheduling, specialized accelerators',
          ],
        },
        note: 'Related work on the slides: vLLM (2023) PagedAttention; SGLang (2024) RadixAttention prefix cache; Prompt Cache (2024) modular reuse; RouteLLM (2024) learned router; MasRouter (2025), which also picks agent roles; FrugalGPT (2023) learned cascade; AutoMix (2023) self-verification; EcoAssistant (2023) execution feedback; ToolOrchestra (2025) small orchestrator; BAAR and MTRouter (2026) budget-aware.',
        notes:
          'The price ratios are the Claude API prices as printed on the slide; they are the shape, not a promise about any particular model.',
      },
      {
        layout: 'quote',
        text: 'Net saving = gross saving - counter-cost, and both must be measured on the same tasks.',
        attribution: 'Lecture 8, PDF page 25',
        notes:
          'The counter-costs the deck lists: compaction against reconstruction, routing against longer failures, subagents against duplicated context, speculation against wasted work.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Budgets',
        title: 'Cap the task, and know when to stop',
        cards: [
          {
            h: 'The caps',
            li: [
              'Cap each task: dollars, model calls, tool time, retries per step',
              'Set limits from traced runs, for example 2x the p95 of successful tasks',
              'The illustrative per-task budget on the slide: $10, 80 calls, 15 min tool time, 2 retries per step',
            ],
          },
          {
            h: 'The stop conditions',
            li: [
              'The verifier passes',
              'No new passing test appears in N steps',
              'The same error repeats',
              'A limit is hit - then hand off with a summary',
            ],
          },
        ],
        note: 'A stopped task with a summary costs less than a runaway one.',
        notes:
          'This is the Lecture 6 lesson operationalised: bound every run. It is also the mechanic Assignment 3 enforces with its own limits.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Before the LLM',
        title: 'Does this step need reasoning at all?',
        cards: [
          {
            h: 'Replace the model with code',
            li: [
              'Same steps every time - write a script',
              'Fixed input format - parse with rules',
              'Narrow label or score - train a small classifier',
              'Fixed workflow with little reasoning - script the workflow and call the LLM only at the steps that need it',
            ],
          },
          {
            h: 'The measurement that follows',
            p: 'One of the slides on this topic carries the string "GBM or Jev!" for the small-classifier alternative. It is almost certainly a garbled extraction of a classifier name; it is reproduced as extracted and is not guessed at here.',
          },
        ],
        notes:
          'The most effective cost lever is often deleting the model call. The point of the slide is to make students check before they spend.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Speed',
        title: 'Completion time is the critical path',
        cards: [
          {
            h: 'The distinction',
            p: 'Serial execution costs about the sum of the steps; parallel execution costs about the critical path. Cheaper can be slower - small models may take more steps, and parallelism costs more tokens for less waiting.',
          },
          {
            h: 'Four speed levers',
            li: [
              'Speed up LLM serving - every cost technique also cuts latency',
              'Improve orchestration: async execution, persistent sessions, stream and pipeline, colocate services',
              'Speed up tool calls: cache tool results, faster hardware, better tools, fail fast. Measure tool time per step before tuning the model',
              'Parallelize work - the same work in a third of the wait',
            ],
          },
        ],
        notes:
          'Measure tool time per step before tuning the model. That ordering is the deck\'s advice and it is the one students most often get wrong.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Speculative actions',
        title: 'Guess early, verify later',
        cards: [
          {
            h: 'The mechanism',
            li: [
              'Predict the next action with a cheap model',
              'Run it early while the main model thinks',
              'Compare: a match skips the wait, a miss costs one wasted call',
              'It pays off when guesses are often right and actions can be undone',
            ],
          },
          {
            h: 'The design space',
            li: [
              'What can be speculated, from tool intent to tool call with arguments, to next action, to branches, to a whole multi-step trajectory',
              'Predictions come from a model, from an early fork of the same model, or from past traces',
              'Can be lossless (always verify) or lossy',
            ],
          },
        ],
        note: 'Sources on the slides: Speculative Actions (ICLR 2026), Speculative Tool Calls (arXiv 2025), SPAgent (arXiv 2025), PASTE (arXiv 2026), B-PASTE (arXiv 2026), SPORK (arXiv 2026), Speculate with Memory (arXiv 2026) and Speculative Macro Commit (arXiv 2026). The slides cite these with numeric keys, and two of the keys in that sequence are never defined in the extracted text. A worked example: SPORK thinks 2,000 tokens, then an early probe issues search(q).',
        notes:
          'The SPORK example shows the shape: spend a little on a probe to avoid a much larger wait.',
      },
      {
        layout: 'steps',
        kicker: 'The method',
        title: 'The optimization loop',
        lede: 'Four steps, and the same tasks every time.',
        steps: [
          { n: '1', h: 'Run and profile', p: 'Find the expensive path.' },
          { n: '2', h: 'Measure', p: 'Success, spend, p95 latency.' },
          { n: '3', h: 'Change one thing', p: 'One lever at a time.' },
          { n: '4', h: 'Re-evaluate', p: 'On the same tasks.' },
        ],
        note: 'The slide says to remember this for Assignment 4.',
        notes:
          'Change one thing, re-evaluate on the same tasks. This is the cheapest and the most-skipped discipline in the course.',
      },
      {
        layout: 'table',
        kicker: 'Architecture',
        title: 'Three harness architectures',
        cols: ['', 'Monolithic', 'Modular', 'Agent microkernel'],
        rows: [
          ['Design principle', 'The agent owns everything, in one runtime', 'One controller delegates through interfaces', 'A small runtime keeps state, coordination, scheduling and security'],
          ['Central controller', 'Inside the agent', 'The controller', 'The runtime coordinates'],
          ['Component replacement', 'Rewriting the agent', 'Swap the provider', 'Swap the service'],
          ['Execution isolation', 'In-process', 'A sandbox provider such as DockerSandbox, with a Docker to Firecracker swap', 'An execution service owns allocation, isolation and sandbox lifecycle'],
          ['Component deployment', 'Together', 'Providers RedisMemory, MCPTools, SlidingWindowContext, DockerSandbox', 'External services provide memory, tools and execution'],
          ['Fit', 'Standalone agents', 'Swappable providers under fixed evaluation', 'Multi-agent infrastructure'],
        ],
        note: 'The shift is responsibility moving out of the agent: from code, to interfaces, to services. The trade is simplicity and low overhead for isolation, sharing and scale. The comparison also tracks: central controller, component replacement, execution isolation, component deployment, independent scaling, communication cost, typical use case.',
        notes:
          'The one-Python-snippet test on the slides makes the trade-off concrete: monolithic executes locally, modular calls SandboxProvider.run(code), and the microkernel sends an execution request to an execution service that owns allocation, isolation and sandbox lifecycle.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'The gallery',
        title: 'Eight real harnesses',
        cols: ['Harness', 'Language', 'The distinctive idea'],
        rows: [
          ['Claude Code', 'Anthropic / TypeScript (closed)', 'A policy layer and typed hooks'],
          ['Codex CLI', 'OpenAI / Rust', 'A sandbox with no network access, and approval only to go out of the sandbox; a Lark patch grammar with hunks matched in four passes'],
          ['DeepSeek Harness', 'DeepSeek AI / TypeScript', 'The loop is a plugin; compare-and-swap edits'],
          ['OpenCode', 'Anomaly (SST) / TypeScript + Bun', 'The harness is a server - the TUI, SDKs and web app use the same OpenAPI HTTP server; nine replacers from exact to anchor match; a shadow git repository for /undo'],
          ['Pi', 'Mario Zechner / Earendil / TypeScript', 'A minimal core with four tools and no MCP, sub-agents or approvals; keep-alive requests only when the expected saving is $0.05 or more; pi-ai supports 42 providers on 10 wire APIs'],
          ['oh-my-pi', 'Can Boluk / Stencil Labs / TypeScript + Rust', 'A 4-hex file tag plus line numbers per edit; one shell stays open for all calls; snapcompact changes old history into images; TTSR stops and tries again when a regex matches'],
          ['OpenClaw', 'OpenClaw Foundation / TypeScript', 'A chat gateway with 27 channels and queue lanes, memory before compaction, and fences, taint and sentinels'],
          ['Hermes Agent', 'Nous Research / Python', 'A background fork edits the memory and the skills; compaction starts at 50% of the window, the earliest of the eight; tool-call rows are written to the session database before any side effect'],
        ],
        note: 'Three other projects use Pi code. Hermes Agent\'s threshold is described as the earliest of the eight, but the slides give no comparison values for the other seven.',
        notes:
          'Read this table as design vocabulary, not as a ranking. Each harness solves one problem differently, and Assignment 3 asks you to build your own.',
      },
    ],
  },
  /* ==================================================================== */
  /* 10. agent-evaluation                                                   */
  /* ==================================================================== */
  {
    id: 'agent-evaluation',
    slug: 'agent-evaluation',
    title: 'Reference note - Agent evaluation and benchmarks',
    navTitle: 'Agent evaluation and benchmarks',
    navBlurb: 'The instructor-curated method guide and benchmark directory: evaluation dimensions, the pass@k and pass^k contrast, and 48 benchmarks by task format.',
    footerLabel: 'CS2680 · Reference note · agent-evaluation',
    source: `${S}/notes/agent-evaluation.html`,
    sources: [
      { url: `${S}/notes/agent-evaluation.html`, label: 'the reference note' },
      { url: `${S}/slides/7_agent_design_4.pdf`, label: 'Lecture 7 - the lecture built on this note' },
      {
        url: `${S}/notes/transformers.html`,
        label: 'the optional transformers note - the source of the 96.4% judge-audit figure',
      },
      {
        url: `${S}/notes/cost-effective-agents.html`,
        label: 'the cost-effective agents note - the source of the report-together checklist',
      },
      {
        url: 'https://arxiv.org/abs/2507.02825',
        label: 'Agentic Benchmark Checklist, one of the note\'s method references',
      },
    ],
    slides: [
      {
        layout: 'cover',
        kicker: 'Reference note · curated by the instructor, reviewed by the instructor and the TFs',
        title: 'Agent evaluation and benchmarks',
        lede: 'A method guide in one half, a directory of 48 benchmarks in eight themes in the other.',
        pills: ['14 evaluation dimensions', 'pass@k vs pass^k', '48 benchmarks', '8 themes'],
        meta: 'notes/agent-evaluation.html',
        notes:
          'The note states that its examples are invented illustrations, not released test items, and that the directory is a reference for task formats and scoring rules - not a ranking of increasingly intelligent systems.',
      },
      {
        layout: 'twocol',
        kicker: 'Scope',
        title: 'Two halves, one argument',
        left: {
          h: 'Part one - a method guide',
          li: [
            'What an agent evaluation measures, versus a model evaluation',
            'The anatomy of one episode: task, trial, trajectory, outcome, with conceptual pseudocode',
            'Benchmark selection, grader types, the metrics table',
            'Cost and latency accounting, uncertainty',
            'METR time horizons',
            'A five-step design process',
            'Contamination versus grader gaming, and a reporting checklist',
          ],
        },
        right: {
          h: 'Part two - the directory',
          p: '48 numbered entries grouped into eight themes, each giving a representative task, scoring, what it measures, and source links.',
          li: [
            'Text prediction',
            'Language understanding',
            'Knowledge and reasoning',
            'Assistant quality',
            'Interactive agents',
            'Harder or fresher test sets',
            'Agent capabilities in isolation',
            'Workplace workflows',
          ],
        },
        note: 'The note\'s own framing: a score without its protocol is not a measurement. Benchmark version and split, permitted tools, budget and grader must travel with every number.',
        notes:
          'The directory is deliberately ordered by task format rather than by difficulty, which supports the course\'s thesis that a suite choice is an evaluation-design decision.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Evaluation dimensions · 1 of 2',
        title: 'Outcomes, cost and latency',
        cols: ['Dimension', 'What it measures', 'Notes and caveats'],
        rows: [
          [
            'Task success / resolution rate',
            'Fraction of tasks or runs meeting the benchmark\'s completion checks',
            'Report the denominator and the budget; checks may miss regressions',
          ],
          [
            'Outcome vs. procedural compliance',
            'Final state versus required process - for example confirmation before a write',
            'A correct end state cannot prove consent came first; it needs trajectory evidence',
          ],
          [
            'Cost per successful task',
            'Total runtime cost including failed attempts, divided by successful task trials',
            'Undefined when no trial succeeds; do not divide by distinct task IDs solved at least once',
          ],
          [
            'Cost per attempted task',
            'Total runtime cost divided by attempted trials',
            'A low cost-per-success can hide poor task coverage; grading expense is reported separately',
          ],
          [
            'Latency and parallelism',
            'Wall-clock to a usable final result, and elapsed time against aggregate compute',
            'Distinguish time-to-first-token; record timeouts and failures. Parallel agents cut elapsed time while raising total cost',
          ],
        ],
        notes:
          'The cost definitions are deliberately strict: dividing by distinct task IDs solved at least once is called out as wrong, because it hides the retries that made the solve possible.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Evaluation dimensions · 2 of 2',
        title: 'Consistency, tools, memory, safety and the graders themselves',
        cols: ['Dimension', 'What it measures', 'Notes and caveats'],
        rows: [
          [
            'pass@k vs. pass^k',
            'Probability at least one of k attempts succeeds, against the probability all k repeated trials succeed',
            'Different events; pass@k needs a deployable selector, pass^k measures consistency',
          ],
          [
            'Tool-call correctness and efficiency',
            'Function selection, argument grounding, call structure, turn count, milestones',
            'A well-formed call can still be wrong; turn count is separate from task success (BFCL, ToolSandbox)',
          ],
          [
            'Memory recall and query latency',
            'Answer correctness from retrieved evidence, and the cost of the memory system at that accuracy',
            'Retrieving an answer-bearing session is intermediate, not correctness; V2 measures an accuracy-latency frontier',
          ],
          [
            'Safety under attack',
            'Benign utility, utility under attack, and targeted attack success rate',
            'Refusing everything can cut attack success while making the agent useless',
          ],
          [
            'Coordination',
            'Team task outcome plus a separate coordination score',
            'Many messages do not imply useful division of work',
          ],
          [
            'Grader (judge) quality',
            'Whether the automatic judge is right',
            'Hand audit: the original judge was wrong in 96.4% of disagreements on Omni-MATH (the optional transformers note carries this figure)',
          ],
          [
            'Contamination and prompt sensitivity',
            'Whether a task or solution was visible to training or to the run, and how much of a score belongs to the harness',
            'A date after a claimed cutoff reduces one risk only; MMLU-Pro cut prompt sensitivity from 4-5% to 2% across 24 prompt styles',
          ],
          [
            'Uncertainty and calibration',
            'Variability across trials against task coverage; whether stated confidence tracks actual correctness',
            'Use paired per-task differences - overlap of two score intervals is not a test. Accuracy and calibration are different measurements (HLE)',
          ],
        ],
        notes:
          'The judge-quality row is the one that changes how you run a benchmark: if the judge is wrong in 96.4% of expert-audited disagreements, the judge is a component with its own failure rate, and it can saturate before the task does.',
      },
      {
        layout: 'twocol',
        kicker: 'The technical core',
        title: 'pass@k and pass^k are different events',
        left: {
          h: 'Population definitions',
          p: 'pass@k = 1 - (1 - p)^k ; pass^k = p^k',
          li: [
            'pass@k - at least one of k attempts succeeds',
            'pass^k - all k repeated trials succeed',
            'The definitions are the HumanEval and tau-bench ones',
          ],
        },
        right: {
          h: 'Finite-sample estimators',
          p: 'Estimated pass@k = 1 - C(n-c, k)/C(n, k) ; Estimated pass^k = C(c, k)/C(n, k)',
          li: ['Requires n >= k', 'C(a,k) = 0 when a < k'],
        },
        notes:
          'This is the most teachable technical core on the page: it shows how to get consistency out of repeated trials without inventing new tasks.',
      },
      {
        layout: 'twocol',
        kicker: 'Worked examples',
        title: 'What the two formulas give you',
        left: {
          h: 'Example (a)',
          p: 'p = 0.8, k = 3',
          li: ['pass@3 = 99.2%', 'pass^3 = 51.2%'],
        },
        right: {
          h: 'Example (b)',
          p: '3 successes in 5 trials',
          li: [
            'Estimated pass@2 = 1 - 1/10 = 90%',
            'Estimated pass^2 = 3/10 = 30%',
            'The plug-in formulas would give 84% and 36%',
          ],
        },
        note: 'The gap between the two is the whole point: a system that succeeds 80% of the time is far more likely to succeed at least once in three tries than to succeed three times running.',
        notes:
          'Example (b) is the one to use on the board. The plug-in numbers differ from the finite-sample ones, which is exactly why the note insists on the estimator.',
      },
      {
        layout: 'table',
        kicker: 'Paired comparison',
        title: 'A against B, run on the same tasks',
        cols: ['', 'A', 'B'],
        rows: [
          ['Both succeed', '65', '65'],
          ['Only A succeeds', '5', '-'],
          ['Only B succeeds', '-', '10'],
          ['Both fail', '20', '20'],
          ['Success rate', '70%', '75%'],
          ['Total spend', '$100', '$150'],
          ['Cost per attempt', '$1.00', '$1.50'],
          ['Cost per success', '~$1.43', '$2.00'],
        ],
        note: '$10 per net additional completion. The table is designed to stop the "one system dominates" reflex: B is better on the headline rate, worse on every cost measure, and the comparison only makes sense per task, paired.',
        notes:
          'Use paired per-task differences. A single unpaired average hides the five tasks where A wins and B loses.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Benchmark directory · 1 of 6',
        title: 'Text prediction and language understanding',
        cols: ['Benchmark', 'Task family', 'What it probes', 'Notes'],
        rows: [
          ['PTB (Penn Treebank)', 'Language modeling', 'Next-word probability in a narrow domain', 'Perplexity; WSJ-based processed split; corpus dates from 1993'],
          ['WikiText', 'Language modeling', 'Prediction with article context retained', 'Perplexity; WikiText-2 and -103; structure and punctuation preserved'],
          ['LAMBADA', 'Language modeling', 'Recovering the final word from discourse context', 'Final-word accuracy; 2016'],
          ['SQuAD / SQuAD 2.0', 'Reading comprehension', 'Span extraction from supplied evidence', 'Exact match + token F1; 2.0 adds unanswerable questions and abstention'],
          ['GLUE', 'Transfer across 9 short-text tasks', 'Sentence understanding transfer', 'Per-task metrics aggregated; a composite, not a percentage of questions'],
          ['SuperGLUE', '8 harder contextual tasks', 'Contextual reasoning with few labels', 'Task-average score; not one homogeneous success rate'],
          ['HellaSwag', 'Commonsense', 'Choosing a plausible next event (4 options)', 'Adversarially filtered distractors; still a recognition task'],
          ['WinoGrande', 'Commonsense coreference', 'Winograd-style reference resolution', '~44,000 items; binary choice permits guessing'],
        ],
        notes:
          'The note says explicitly that a composite is not a percentage of questions, and that a binary choice permits guessing. Both caveats matter when you quote a headline.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Benchmark directory · 2 of 6',
        title: 'Knowledge and reasoning',
        cols: ['Benchmark', 'Task family', 'What it probes', 'Notes'],
        rows: [
          ['AI2 ARC', 'School science QA', 'Knowledge and reasoning in exam format', '7,787 questions, Easy/Challenge; unrelated to ARC-AGI despite the acronym'],
          ['MMLU', 'Knowledge breadth', '57 academic/professional subjects', 'Answer accuracy; the aggregate hides uneven subject performance'],
          ['BIG-bench', 'Diverse task suite', 'Capabilities across 204 heterogeneous tasks', 'Task-dependent metrics; aggregation is not a universal reasoning percentage'],
          ['BBH', 'Constrained reasoning', '23 tasks models had not passed at introduction', 'The direct against chain-of-thought protocol must be named'],
          ['GSM8K', 'Math word problems', 'Multi-step arithmetic', '7,473 train / 1,319 test; final-answer accuracy'],
          ['MATH', 'Competition math', 'Technique selection and symbolic manipulation', '12,500 problems (7,500/5,000); the full test split is not MATH-500'],
          ['HumanEval', 'Code generation', 'Executable correctness of 164 Python problems', 'pass@k against pass@1; finite tests are not full correctness'],
          ['HELM', 'Evaluation framework', '7 dimensions over 16 core scenarios', 'Efficiency is one of the seven metrics; no universal task-success percentage'],
          ['TruthfulQA', 'Truthfulness', 'Reproducing tempting misconceptions', 'Generated-answer and multiple-choice variants are different measurements'],
        ],
        notes:
          'Note the care needed: ARC and ARC-AGI share an acronym and nothing else, and the full MATH test split is not MATH-500.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Benchmark directory · 3 of 6',
        title: 'Assistant quality',
        cols: ['Benchmark', 'Task family', 'What it probes', 'Notes'],
        rows: [
          ['MT-Bench', 'Multi-turn assistant', 'Multi-turn conversation quality', '80 two-turn conversations; LLM judge on a 1-10 scale; verbosity and position biases'],
          ['Chatbot Arena', 'User preference', 'Live pairwise votes', 'The rating is not a correctness or completion rate'],
          ['AlpacaEval', 'Automated preference', 'Pairwise win rate against a reference model', 'Raw against length-controlled; report version, reference and judge'],
          ['IFEval', 'Instruction compliance', 'Programmatically checkable constraints', 'Instruction-level and prompt-level, strict and loose'],
          ['LongBench', 'Long context', 'Long-context handling', '21 datasets, 6 categories, English and Chinese; F1/ROUGE/accuracy/code similarity; not a single success percentage'],
          ['MMMU', 'Multimodal reasoning', 'Multimodal questions across subjects', '~11,500 questions over 30 subjects; some questions are answerable from text alone'],
        ],
        notes:
          'Every judge-based benchmark carries its judge\'s biases with it. The MT-Bench row names verbosity and position bias explicitly; the Chatbot Arena row says a rating is not a correctness rate.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Benchmark directory · 4 of 6',
        title: 'Interactive agents',
        cols: ['Benchmark', 'Task family', 'What it probes', 'Notes'],
        rows: [
          ['AgentBench', 'Multi-environment acting', 'Acting across environments', '8 environments: OS, DB, KG, card game, puzzles, household, shopping, browsing; weighted rescale by reciprocal historical means; AgentBench FC (Oct 2025) is a different suite'],
          ['WebArena', 'Web workflow', 'Realistic web task completion', '812 self-hosted website tasks; the Verified variant replaces model-judge with deterministic type-aware checks; 258-task Hard subset'],
          ['GAIA', 'Research assistant', 'Reasoning, browsing, files and computation', '466 questions; type-dependent answer normalization; Gaia2 is a separate suite'],
          ['BrowseComp', 'Open-web search', 'Hard information search', '1,266 hard information-search questions; LLM grader for answer equivalence; a short answer says little about report quality'],
          ['SWE-bench', 'Repo repair', 'Fixing real issues in real repositories', '2,294 issues across 12 Python repositories; FAIL_TO_PASS + PASS_TO_PASS; Verified 500-instance subset; Lite/Multilingual/Multimodal variants'],
          ['SWE-Bench Pro', 'Larger repo changes', 'Larger, harder repository changes', 'Public, held-out and commercial splits; Public V2 (Sep 22, 2026) has 642 tasks, 11 repos, 50 min/task, web-fetch disabled, replacing the 731-task split; HARD-51 subset'],
          ['Terminal-Bench', 'Terminal task completion', 'Software engineering, config, data processing, scientific computing', '2.0 = 89 tasks; 4.0.0 (Aug 2026) recalibrates limits, with an 8-hour agent timeout, and requires new runs'],
          ['OSWorld', 'Desktop operation', 'Real desktop tasks in real applications', '369 original tasks; execution-based evaluators; OSWorld 2.0 (June 2026) = 108 longer workflows; 2.1 (Sep 16, 2026) recommended'],
          ['tau-bench', 'Customer dialogue and API', 'Tool use under a policy with a simulated user', 'Retail and airline policy work; DB outcome plus required response information; tau^2 (2025) adds telecom dual control; tau^3 (Mar 2026) adds banking and full-duplex voice'],
          ['ARC-AGI-3', 'Rule discovery', 'Learning an unfamiliar environment by acting', '2025 preview, 2026 full release; action efficiency against human baselines'],
        ],
        notes:
          'This is the theme the course actually uses for Assignment 2 and 3. SWE-bench Pro is the one Assignment 2 runs against, and tau-bench is the one that introduced Pass^k.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Benchmark directory · 5 of 6',
        title: 'Harder and fresher sets, and capabilities in isolation',
        cols: ['Benchmark', 'Task family', 'What it probes', 'Notes'],
        rows: [
          ['MMLU-Pro', 'Harder academic MCQ', 'Knowledge with less guessing', '4 options expanded toward 10; less guessing; no guarantee of absence from training'],
          ['LiveBench', 'Freshness', 'Regularly refreshed, objectively checkable questions', 'Snapshot-to-snapshot difficulty differs; not permanent contamination protection'],
          ['LiveCodeBench', 'Fresh code', 'New contest problems', 'LeetCode, AtCoder, Codeforces; pass rate or pass@k by scenario; the date window is part of the benchmark'],
          ['MMMU-Pro', 'Vision dependence', 'Whether the question actually needs the image', 'Filtering text-answerable items, vision-only setting; the score must name the input setting'],
          ['GPQA', 'Expert science QA', 'Expert-level science questions', '448-question main set with a Diamond subset; "Google-proof" describes validator difficulty, not immunity to help'],
          ['FrontierMath', 'Expert math', 'Auto-checkable expert-written problems', 'Answer checking is not proof verification'],
          ['Humanity\'s Last Exam', 'Broad academic difficulty', 'Breadth and difficulty', '2,500 questions across many fields; accuracy and calibration reported separately; tool-enabled and tool-free differ'],
          ['BFCL', 'Tool calling', 'Selection, arguments, parallel calls, withholding', 'V3 multi-turn; V4 (Jul 17, 2025) adds web search, memory and format sensitivity'],
          ['ToolSandbox', 'Stateful tool use', 'Dependencies between tools and recovery', 'Milestone similarity, with a forbidden minefield scored 0; MM-ToolSandBox (Jul 2026) adds 511 tools, 258 scenarios and 50 UI variants'],
          ['LongMemEval', 'Memory', 'Memory over long chat histories', '500 questions; LLM judge; V2 (May 2026) = 451 questions over recorded agent experience, with query latency'],
          ['AgentDojo', 'Injection robustness', 'Robustness to prompt injection', '97 user tasks, 629 security test cases; package v0.1.35 and task revision v1.2.2 are separate version axes'],
        ],
        notes:
          'The "fresher" half of the directory exists because of saturation: a benchmark that nobody has seen is worth more than a benchmark everybody has trained on.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Benchmark directory · 6 of 6',
        title: 'Workplace workflows',
        cols: ['Benchmark', 'Task family', 'What it probes', 'Notes'],
        rows: [
          ['MultiAgentBench', 'Team coordination', 'Team work', 'Proposal writing, Minecraft, DB diagnosis, coding, bargaining, Werewolf; task score and coordination score are separate; compare with a single agent at matched cost'],
          ['TheAgentCompany', 'Enterprise workflow', 'Long-horizon work across company tools', '175 tasks over GitLab, Plane, ownCloud and RocketChat; weighted checkpoints plus full completion; the partial score is a distinct number'],
          ['GDPval', 'Professional deliverable', 'Real professional work products', '44 occupations, 9 sectors; 1,320 tasks (220 gold); blind expert preference; automated grading is a separate setup; one-shot'],
          ['KernelBench', 'GPU kernels', 'Kernel correctness and speed', '250 core workloads; the fastp metric; v0.1 changes problem sizes and numerics'],
          ['MLE-bench', 'ML engineering', 'End-to-end ML engineering', '75 offline Kaggle competitions; bronze-medal threshold fraction; v2 described as upcoming (Sep 2026); submissions paused since Apr 24, 2026'],
        ],
        note: 'The directory has 49 rows because the note\'s 48 numbered entries include SWE-Bench Pro as a named sub-entry under SWE-bench; both are listed because the note names both.',
        notes:
          'The workplace-workflow theme is the closest match to the final project, and MultiAgentBench is the only benchmark in the note that scores coordination separately from the task.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Method',
        title: 'Graders, time horizons, and what to report together',
        cards: [
          {
            h: 'Graders and metrics',
            p: 'Metrics: perplexity, accuracy or exact match or F1, preference or win rate, task success or resolution rate, pass@k, pass^k.',
            li: ['Graders: code and execution, model judge, human review'],
          },
          {
            h: 'METR time horizons',
            li: [
              'Time Horizon 1.1 is the current suite as of Sep 27, 2026',
              'Released Jan 29, 2026; expanded 170 to 228 tasks',
              'Infrastructure moved from Vivaria to Inspect',
              '50% and 80% horizons; a March 2026 regularization correction',
              'Horizons above 16 human-hours are flagged unreliable',
            ],
          },
          {
            h: 'Contamination versus grader gaming',
            p: 'The note separates the two: contamination is what the task or solution exposes the run to, while grader gaming is the run exploiting the scorer. Both are reported, never just one.',
          },
          {
            h: 'A reporting checklist',
            p: 'Report the verified success rate, total spend divided by verified successful trials, cost per attempted trial, p50 and p95 time to a usable result, and the cost distribution across tasks - together, or the numbers do not mean anything.',
          },
        ],
        note: 'All release and version notes in the note were source-checked on September 27, 2026.',
        notes:
          'The reporting checklist is the practical takeaway: publish the six numbers together, or a reader cannot tell whether a cheaper run is a better one.',
      },
    ],
  },

  /* ==================================================================== */
  /* 11. cost-effective-agents                                              */
  /* ==================================================================== */
  {
    id: 'cost-effective-agents',
    slug: 'cost-effective-agents',
    title: 'Reference note - Cost-effective agents',
    navTitle: 'Cost-effective agents',
    navBlurb: 'A design guide rather than a paper list: thirteen techniques, each with its second-order cost, plus the break-even arithmetic.',
    footerLabel: 'CS2680 · Reference note · cost-effective-agents',
    source: `${S}/notes/cost-effective-agents.html`,
    sources: [
      { url: `${S}/notes/cost-effective-agents.html`, label: 'the reference note' },
      { url: `${S}/slides/8_agent_design_5.pdf`, label: 'Lecture 8 - cost and performance' },
    ],
    slides: [
      {
        layout: 'cover',
        kicker: 'Reference note · an organised design guide, not a paper list',
        title: 'Cost-effective agents',
        lede: 'The relevant unit is the complete task - planning, tool use, retries, verification, human correction - and every technique has a second-order cost.',
        pills: ['13 techniques', 'Measure, then lever', 'Break-even arithmetic', 'A six-step experiment protocol'],
        meta: 'notes/cost-effective-agents.html',
        notes:
          'The note is organised by "the cost it removes and the new costs it introduces", so every technique should be taught with its second-order cost, not only its saving.',
      },
      {
        layout: 'twocol',
        kicker: 'The thesis',
        title: 'Measure the episode, not the call',
        left: {
          h: 'The unit of cost',
          p: 'Episode cost = all model calls + tools + memory services + execution + human review.',
          li: [
            'Model calls include the main agent, planners, routers, compressors, workers and verifiers',
            'Priced as uncached input, cached input, output or reasoning tokens',
            'Plus tool fees, execution, memory storage and retrieval, and human review',
            'Self-hosted models use provisioned infrastructure cost',
          ],
        },
        right: {
          h: 'Two ledgers',
          p: 'The deployed policy ledger and the offline ledger are separate.',
          li: [
            'The deployed ledger is what a user experiences',
            'The offline ledger is teacher trajectories, fine-tuning, workflow search, evaluation and refresh',
            'Keeping them apart is what makes a cost claim honest',
          ],
        },
        notes:
          'The note also warns that the five measurements - token reduction, peak-context reduction, throughput, latency and dollars - are different, and that published savings cannot be compared without naming which one is meant.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Techniques · 1 of 4',
        title: 'Measurement and routing',
        cols: ['Technique', 'What it optimises', 'Mechanism', 'Cost or latency impact'],
        rows: [
          [
            'Measure the whole episode',
            'Making cost attributable',
            'A cost ledger over all model calls, priced uncached and cached input and output or reasoning tokens, plus tool fees, execution, memory storage and retrieval, and human review',
            'Adds bookkeeping; separates the deployed policy ledger from the offline ledger',
          ],
          [
            'Find the expensive path',
            'Targeting effort',
            'A per-step trace of model, role, input and output tokens, cache hits, tool calls, elapsed time, retries and outcome; group traces into successful, failed and timed-out',
            'Diagnostic only; the longest, most expensive and typical traces can have different bottlenecks',
          ],
          [
            'Route model calls by expected value',
            'Model price',
            'A prompt-only router, a cascade with verifier or confidence escalation, or a budget-aware controller that sees trajectory state and remaining spend',
            'Charge the router, the failed cheap attempts and the recovery work; estimate incremental benefit, not difficulty labels; swapped-answer evaluation can misprice a trajectory',
          ],
          [
            'Small-model specialists',
            'Cost of repeated narrow work',
            'Train a smaller model on verified trajectories for a stable role - classify the next tool, extract fields, summarize, plan a subgoal; a small orchestrator calls strong models for exceptions',
            'Setup costs: teacher calls, filtering, training, evaluation, hosting and refresh; break-even is lifetime per-call savings against setup, and mistakes can shift into later steps',
          ],
        ],
        notes:
          'The two decision tables on the page - observed cost to first lever, and store to cost avoided to check before use - are the most slide-ready objects in it, because they give a lookup rather than a principle.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Techniques · 2 of 4',
        title: 'Reasoning budget and context',
        cols: ['Technique', 'What it optimises', 'Mechanism', 'Cost or latency impact'],
        rows: [
          [
            'Budget reasoning, sampling and search',
            'Token and tool spend',
            'Set deliberation, candidate or search expansion from task and evidence; stop sampling when candidates will not change the decision; give the agent a remaining budget for tokens and tools',
            'A hard cap only ends work at the cap; more reasoning tokens can coexist with lower success; rerun on full tool-using trajectories before claiming savings',
          ],
          [
            'Remove model turns from routine control',
            'Model calls per task',
            'Put deterministic decisions in code; let plans refer to future tool outputs so independent branches run together; code actions combine several tool operations; fixed pipelines for stable phases; smaller tool menus',
            'Parallel work shortens the critical path only for independent branches and need not reduce total compute; blind batching can hide failures and force an expensive restart',
          ],
          [
            'Selective context (compression)',
            'Repeated prompt tokens',
            'Filter tool output to needed fields, retrieve instead of pasting, summarize finished branches, keep durable facts structured; preserve constraints, identifiers, unresolved errors, live state and original evidence',
            'Peak active context and cumulative billed input are different measures; discarded facts cost reacquisition calls; shortening a cached prefix can destroy a discount; the compressor\'s own calls belong in the ledger',
          ],
        ],
        notes:
          'Selective context is the same ladder Lecture 4 teaches, now with the prices attached. The caveat about shortening a cached prefix is the one students miss: a "shorter" prompt can be a more expensive one.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Techniques · 3 of 4',
        title: 'Reuse and collaboration',
        cols: ['Technique', 'What it optimises', 'Mechanism', 'Cost or latency impact'],
        rows: [
          [
            'Reuse facts, plans, executable skills',
            'Repeated work',
            'Choose the reusable object before the cache: a fact, a plan template, an executable skill or a cached answer, each with preconditions and freshness checks',
            'Memory writes, indexing, retrieval, consolidation and invalidation are real work; a long skill loaded every turn can cost more than on-demand retrieval; hit rate alone does not show correctness or payback',
          ],
          [
            'Pay only for useful collaboration',
            'Multi-agent overhead',
            'Reduce agents, messages or edges; narrow what each role receives; use a cheaper model for routine roles; invoke a specialist only when its contribution is distinct',
            'Fewer agents removes whole calls and sparse communication shortens prompts, but role assignment changes the per-call price; prune a role only after checking unique observation, independent check or needed action',
          ],
        ],
        notes:
          'The "Pay only for useful collaboration" row is the multi-agent cost argument from Lecture 5, priced. The condition on pruning - check for a unique observation, an independent check or a needed action first - is what keeps it from becoming a blind trim.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Techniques · 4 of 4',
        title: 'Serving, latency and rework',
        cols: ['Technique', 'What it optimises', 'Mechanism', 'Cost or latency impact'],
        rows: [
          [
            'Amortize workflow and prompt optimization',
            'Development cost',
            'Search over prompts, demonstrations, tool interfaces and executable workflows on development tasks',
            'Break-even is setup divided by net savings per deployed task: a $2,000 setup saving $0.02 per task needs roughly 100,000 tasks; keep optimization-set and final-test results separate',
          ],
          [
            'Lower serving cost',
            'Infrastructure cost',
            'API: a stable cached prefix, no timestamps or per-run state in it. Self-hosted: prefix and KV reuse, batching and scheduling, phase-aware serving, a retention policy for multi-turn tool gaps',
            'Quantization and speculative decoding improve throughput or latency but do not reduce logical tool calls; quantization can change decisions; a self-hosted speedup may not pass through to an API customer',
          ],
          [
            'Reduce waiting with a separate money budget',
            'Latency',
            'Run independent tools concurrently and schedule by dependency; speculate a likely next action and validate the draft before use',
            'Shortens the critical path but can raise total work; read-only or idempotent work is easier to cancel; 20% faster at 30% more expensive has bought latency, not saved cost',
          ],
          [
            'Prevent expensive rework',
            'Failure cost',
            'Clear task specs and model-facing tool interfaces; targeted verifiers catch cheap-to-fix errors before more work is built on them',
            'Verification pays when the expected cost of caught errors exceeds the cost of the check; count human minutes, waiting and review errors in the same ledger',
          ],
        ],
        notes:
          'This is the technique set that maps one-to-one onto the four assignments: routing and specialists for Assignment 2, budget and compaction for Assignment 3, serving for Assignment 4, and the whole stack for Assignment 5.',
      },
      {
        layout: 'twocol',
        kicker: 'The arithmetic',
        title: 'Three worked examples',
        left: {
          h: 'Break-even',
          p: 'Approximate break-even tasks = setup and refresh cost / net savings per deployed task.',
          li: [
            'A $2,000 discovery cost saving $0.02 per task needs roughly 100,000 tasks to repay',
          ],
        },
        right: {
          h: 'The ineligible candidate',
          p: 'The same 100 tasks: a baseline at $120 with 80 successes gives $1.50 per success; a candidate at $90 with 75 successes gives $1.20 per success.',
          li: [
            'The candidate loses five completions',
            'And is ineligible at a 80% minimum success requirement',
            '20% faster but 30% more expensive has purchased latency rather than reduced cost',
          ],
        },
        notes:
          'The middle example is the one that decides Assignment 3: a better cost-per-success number is worthless if the candidate drops below the success floor.',
      },
      {
        layout: 'steps',
        kicker: 'Method',
        title: 'A six-step protocol for a fair cost experiment',
        lede: 'The note ends with this, because a cost claim is only as good as the protocol behind it.',
        steps: [
          { n: '1', h: 'Fix the outcome', p: 'The task and its success test stay put.' },
          { n: '2', h: 'Trace the baseline', p: 'Per-step trace of the current policy.' },
          { n: '3', h: 'Use simple comparators', p: 'No clever baselines.' },
          { n: '4', h: 'Run the changed policy', p: 'Through the same environment.' },
          { n: '5', h: 'Compare several budgets', p: 'Not one point on the curve.' },
          { n: '6', h: 'Hold out final tasks', p: 'Keep the final tasks out of the loop.' },
        ],
        note: 'The report-together set: verified success rate, total spend divided by verified successful trials, cost per attempted trial, p50 and p95 time to a usable result, and the cost distribution across tasks.',
        notes:
          'The closing caveat on the page: published savings are demonstrations under particular models, prices, workloads and baselines. Reproduce the protocol before you reproduce the claim.',
      },
    ],
  },
  /* ==================================================================== */
  /* 12. assignments-and-project                                            */
  /* ==================================================================== */
  {
    id: 'assignments-and-project',
    slug: 'assignments-and-project',
    title: 'Assignments, final project, and policy',
    navTitle: 'Assignments, project and policy',
    navBlurb: 'The five Mads assignments with weights, dates and effort, the shared constraints, the final project spec, and the grading, late-day and AI-use rules.',
    footerLabel: 'CS2680 · Assignments and project',
    source: `${S}/assignments/index.html`,
    sources: [
      { url: `${S}/assignments/index.html`, label: 'the assignments index - codenames, weights, dates, effort' },
      { url: `${S}/assignments/assignment1.html`, label: 'Assignment 1 - Mads-Lens' },
      { url: `${S}/assignments/assignment2.html`, label: 'Assignment 2 - Mads-Loop' },
      { url: `${S}/assignments/assignment3.html`, label: 'Assignment 3 - Mads-Opt' },
      {
        url: `${S}/slides/8_assignment3.pdf`,
        label: 'the Assignment 3 briefing deck attached to the 2026-10-07 lecture',
      },
      { url: `${S}/project.html`, label: 'the final project specification' },
      { url: `${S}/policy.html`, label: 'the course policy' },
    ],
    slides: [
      {
        layout: 'cover',
        kicker: 'Course mechanics · assignments, project, policy',
        title: 'The five assignments and the final project',
        lede: 'One private repository, three artifacts per assignment, and a project that inverts the problem: you choose the evaluation.',
        pills: ['5 assignments', '70% of the grade', 'Project 20%', '4 late days', 'No exam'],
        meta: 'assignments/index.html · project.html · policy.html',
        notes:
          'The sequence walks down the stack: use an agent, replace the runtime with your own loop, optimize everything around a black-box API, remove the API and own the serving engine, then optimize the whole stack.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Deliverables',
        title: 'The five Mads assignments',
        lede: 'Mads abbreviates Modern Agent Design and Systems, and nods to Harvard\'s MaDSys group. All five are individual.',
        cols: ['#', 'Codename', 'Title', 'Weight', 'Out', 'Due', 'Effort', 'Spec'],
        rows: [
          ['1', 'Mads-Lens', 'Watch the agent work - build a web UI for Claude Code', '10%', 'Wed Sep 2', 'Sun Sep 20, 11:59pm', '4-6 hours', 'Published'],
          ['2', 'Mads-Loop', 'Build the loop - build an agent harness', '10%', 'Mon Sep 21', 'Sun Oct 4, 11:59pm', '10-12 hours', 'Published'],
          ['3', 'Mads-Opt', 'Make every token count - harness competition', '20%', 'Mon Oct 5', 'Tue Oct 20, 11:59pm', '10-15 hours', 'Published'],
          ['4', 'Mads-Serve', 'Own the serving engine - serve your own agent', '20%', 'Wed Oct 21', 'Tue Nov 10, 11:59pm', '10-14 hours', 'Not published'],
          ['5', 'Mads-Stack', 'Optimize the full stack', '10%', 'Wed Nov 11', 'Sun Nov 29, 11:59pm', '12-18 hours', 'Not published'],
        ],
        note: 'Only assignments 1 to 3 have a published full specification. For assignments 4 and 5 the index page publishes the date, weight, codename, one-paragraph summary and effort estimate, and links to a not-yet-released page.',
        notes:
          'The grading instrument changes with each assignment: a feature checklist for A1, hidden held-out tasks for A2, a leaderboard rank for A3 - each step removes more of the scaffolding the course provides.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Shared constraints',
        title: 'The same rules for all five',
        cards: [
          {
            h: 'One repository',
            li: [
              'One private GitHub repository serves the whole course - create it once',
              'Each assignment\'s code, writeup files, benchmark outputs and session archives live under assignmentN/, from assignment1/ to assignment5/',
              'Keep it private and add the instructor and the four TFs as collaborators',
            ],
          },
          {
            h: 'Three artifacts every time',
            li: [
              'Code',
              'A writeup',
              'An archive of Claude Code session files',
              'The session files carry no separate weight, but they are the record behind the writeup\'s process claims',
            ],
          },
          {
            h: 'AI use',
            p: 'AI use is encouraged, must be disclosed on every submitted artifact, and never replaces authorship. Writeups must be your own prose, and you must be able to explain your own work unaided.',
          },
          {
            h: 'Late days',
            li: [
              'Four for the semester, counted in whole days, spendable across assignments',
              'A submission one minute late consumes a full day',
              'Once exhausted, late work loses 20% of its value per day, to a floor of zero after five days',
              'They cannot be applied to student sharing sessions or the final project poster session',
            ],
          },
        ],
        notes:
          'Every assignment demands a record alongside the artifact, so the course grades the process and not only the output. That is why the session archives are mandatory even though they carry no points.',
      },
      {
        layout: 'twocol',
        kicker: 'Assignment 1 · Mads-Lens',
        title: 'Build a web page that drives Claude Code',
        left: {
          h: 'The build',
          li: [
            'A server spawns the headless command as a subprocess, forwards its events to the browser, and keeps the session id so a follow-up prompt can resume',
            'Part 1 first: run claude -p "<prompt>" --output-format stream-json --verbose in a terminal, read the events, and save one run to events.jsonl as the Part 2 test input',
            'The final result event carries total_cost_usd, duration_ms, num_turns and session_id',
            'Seven required features: submit a prompt; show the trajectory live; show tool results, deliberately cut down long outputs; show status per tool call and per run; continue the conversation via session resume; show the run\'s numbers; show the trajectory as a tree, nesting subagent events under their spawning call via parent_tool_use_id',
          ],
        },
        right: {
          h: 'Rules, deliverables, grading',
          li: [
            'Auto-accept permission prompts with --dangerously-skip-permissions or --allowedTools, and authenticate with the Harvard login',
            'Using the Agent SDK or an ANTHROPIC_API_KEY is explicitly wrong: the SDK needs Claude Console API keys the course does not provide, and an exported key takes precedence over the Harvard login and silently bills your own account',
            'Do not use an agent framework or reimplement the agent loop - that is Assignment 2. Any web stack is allowed, and serving on your own machine suffices; if you expose a public URL you must put a random access token in front of it',
            'Deliverables: code in assignment1/ with a README, the writeup at assignment1/writeup.md or .pdf, a 2-3 minute demo video on Canvas showing all seven features including a failing run and a subagent run, and the session-file archive committed to assignment1/',
            'Grading: 70% for the seven features at 10% each, 20% writeup, 10% visual design',
          ],
        },
        note: 'The writeup has no page limit and must not be padded: what you built, what you learned in three observations tied to specific moments in a session, and one thing you would change about how Claude Code works. A fully AI-generated writeup incurs a penalty.',
        notes:
          'Assignment 1 is the one assignment nothing later is measured against, which frees it to be exploratory and to be built with Claude Code itself.',
      },
      {
        layout: 'twocol',
        kicker: 'Assignment 2 · Mads-Loop',
        title: 'Build madsLoop, a minimal coding-agent harness',
        left: {
          h: 'The fixed parts',
          li: [
            'The model is fixed: qwen3.6-35b-a3b via the course proxy https://api.cs2680.com/v1, with the key exported as CS2680_API_KEY',
            'Interface: python madsLoop.py -p "<problem statement>" [--log] <workdir>',
            'The agent may read, search, edit and run commands only inside <workdir>, and the fix ends as unstaged changes, with later patches coming from git diff',
            'A workable minimal tool set is bash, read_file, edit_file and done',
            'Ten tasks are provided, and some are impossible even with a perfect harness',
          ],
        },
        right: {
          h: 'What you must supply',
          li: [
            'The harness: tool definitions with a name, a natural-language description and a JSON Schema for parameters; the agentic loop, appending the assistant message and exactly one tool-result message per call; and conversation state management, where an unpaired call is an API error',
            'A system prompt covering role, interface, reproduction protocol and context growth, and at minimum truncation of large tool outputs',
            'Logging with --log to ./madsLoop_logs/<run>.jsonl, one JSON object per line, with timestamp and event, and exactly the events run_start, api_request, api_retry, tool_call, tool_result and run_end',
            'mytest/: four tasks of your own, split into solved_after_change.json and unsolved.json, plus a verify.sh that prints RESOLVED only if every fail_to_pass test passes and no pass_to_pass test regresses',
          ],
        },
        note: 'Grading: hidden tasks 40%, writeup 40% - 20 for the unsolvable-and-why analysis, 10 for what you did differently from the handout, 10 for the mytest/ tasks - and a 3-minute video 20%. The writeup is a one-page hard-limit PDF and must be entirely your own work, with no AI-generated text.',
        notes:
          'The evaluation runs the official SWE-bench Pro evaluation, so editing tests cannot help: it applies your diff to a fresh checkout, restores the held-out test files and runs the tests.',
      },
      {
        layout: 'twocol',
        kicker: 'Assignment 3 · Mads-Opt',
        title: 'A leaderboard competition, not a prompt-writing exercise',
        left: {
          h: 'The contract',
          li: [
            'The grader takes only your src/, zipped as src.zip and uploaded to the leaderboard',
            'The same dispatcher/, madsOpt.py and evaluation_scripts/ as the starter code are run - do not modify them for local testing',
            'Your agent runs in an agent container built from dispatcher/agent.Dockerfile with src/ mounted; the starter_code folder is mounted read-only at /madsOpt, where you may write only .tasks/ and madsOpt_logs/',
            'Each task runs in its own container with the repo at /app. A tiny HTTP server, src/sandbox_server.py, exposes /health, /exec, /read and /write on port 8000 - everything you do to a repository goes through those calls',
            'Neither container reaches the internet: the agent container\'s only egress is a proxy to the course API at CS2680_BASE_URL, and Go task containers come with GOPROXY=off',
          ],
        },
        right: {
          h: 'The dispatcher API and the limits',
          li: [
            'next_task, extract_patch(k) and submit_patch(k, text), evaluate(k) returning tests_failed, tests_total and attempt, continue_task(k), done(k, reason, iterations), and logger(k), which the leaderboard reads your turn counts from',
            'At most 5 tasks live at once, and one attempt at a time per task',
            'A 35-minute grading time limit per task - a hanging suite counts as all its tests failing - and a 4-hour whole-run limit counted from opening the first task; unopened tasks count as failures',
            'Three model tiers priced per 1M tokens: expert at $2.00 input, $0.10 cached input, $10.00 output; standard at $0.08, $0.004, $0.28; starter at $0.01, $0.0005, $0.04. You may use any of them, as many as you like, in one run',
          ],
        },
        notes:
          'Log in to the leaderboard with your Harvard email and the initial password Cs2680-<your 8-digit student ID>, then change it.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Assignment 3 · Mads-Opt',
        title: 'How the leaderboard ranks and scores',
        cols: ['Rule', 'Detail'],
        rows: [
          ['The task set', '26 tasks, numbered 1 to 26. You choose how many - the first k - to grade. A run is cut at 4 hours.'],
          ['The three metrics', 'The number of tasks solved, the cost per solved task, and the time per solved task.'],
          ['The ranking rule', 'Each student is ranked by their best submission. Best submissions solving at least 7 tasks are ranked in skyline layers over the three metrics: submission A dominates B if it is at least as good on all three and better on one. Submissions solving fewer than 7 tasks rank below all of them, ordered by tasks solved alone.'],
          ['Ties', 'Equal ranks are ties - 1, 1, 1, 4... A new submission becomes your best only if it ranks strictly better.'],
          ['The budget', 'At most one submission queued or being graded at a time, with a Cancel button. $30 per day for leaderboard grading, with a $10 limit per submission. If either limit is reached, grading stops and what it completed is recorded. Cancelling a queued submission costs nothing; cancelling one being graded stops the run, deducts the cost so far, and records the three metrics as of that moment.'],
          ['The scoring formula', 'max(81 - r, 50) if any submission achieves the baseline, and 81 - r otherwise. Rank 1 scores 80, rank 12 scores 69, and rank 40 scores 50 if it beats the baseline and 41 if it does not. The baseline solves 16 tasks in 4 hours within a limit of $10.'],
          ['The point split', 'The leaderboard accounts for 80 points, with another 10 for the writeup and 10 for the video.'],
          ['The deadline', 'The leaderboard closes Tuesday, October 20, 11:59pm and accepts no late days; missing it scores 0 for the leaderboard. Late days apply only to the repo and the video.'],
        ],
        note: 'The policy page prints the same leaderboard formula differently - max(80 - rank, 50 if you beat the baseline), with the floor changing nothing inside the top 30. Both are published as written; the Assignment 3 page is the one tied to its own rubric, so the figures above are that page\'s.',
        notes:
          'The scoring structure teaches "clear the baseline, then compete on efficiency", not "maximize the raw score". And a cancelled submission still counts and consumes the daily budget.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Assignment 3 · Mads-Opt',
        title: 'What you submit, and what the writeup must answer',
        cards: [
          {
            h: 'The writeup and video',
            li: [
              'assignment3/writeup.pdf, entirely your own work with no AI-generated text',
              'Three questions: the main components of your harness (for example subagents, memory carried across tasks, which model tier does what); the optimizations and trade-offs you made (for example the policy for continuing versus abandoning a failing task, or how many tasks you keep open); and the pitfalls you hit and what helped',
              'The video is 3 minutes, your face visible and in your own voice, walking the code and showing where each writeup lesson lives',
            ],
          },
          {
            h: 'The session archive',
            li: [
              'Commit your Claude Code session files as assignment3/a3-sessions.tar.gz, produced by package_claude_sessions.py',
              'The session files carry no points of their own',
            ],
          },
          {
            h: 'Security and bonus',
            p: 'Reporting a security vulnerability can earn up to 3 bonus points toward the final course score; abusing a vulnerability forfeits the submission.',
          },
          {
            h: 'The index page disagrees about A3',
            p: 'The assignments index says assignments 3 and 5 are submitted as a published blog post, while the published A3 spec requires a writeup.pdf plus a video in the repository. The blog-post requirement appears only on the index page and is not backed by a published spec, so both are reported here.',
          },
        ],
        notes:
          'The "index page disagrees" card is a published conflict, not a choice. Do not quietly drop either statement.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Assignments 4 and 5',
        title: 'What is published, and what is not',
        cols: ['#', 'Codename', 'Published fields', 'Not published'],
        rows: [
          [
            '4',
            'Mads-Serve - "Serve your own agent"',
            'Weight 20%; out Wed Oct 21; due Tue Nov 10, 11:59pm; effort estimate 10-14 hours; a one-paragraph summary',
            'The full specification - parts, deliverables and grading breakdown - is marked "not published at time of capture". The assignments index links it to a not-yet-released page.',
          ],
          [
            '5',
            'Mads-Stack - "Optimize the full stack"',
            'Weight 10%; out Wed Nov 11; due Sun Nov 29, 11:59pm; effort estimate 12-18 hours; a one-paragraph summary',
            'The full specification is likewise not published. The to_release table marks assignments 1 to 3 as posted and leaves 4 and 5 without a spec link.',
          ],
        ],
        note: 'The 2026-10-07 slide deck (8_agent_design_5.pdf, PDF page 2) adds two further published statements: Assignment 3 is worth 20% of the grade and should be treated like a midterm, and Assignment 4 is now worth 20 points while Assignment 5 is worth 10 points - because A5 was judged too hard and overlapped with the course project and other courses\' projects.',
        notes:
          'No effort, date or weight for A4 or A5 was invented: only the fields the index page states. The "part-ii-status" deck covers the same ground from the schedule side.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Final project',
        title: 'Two tracks, one rubric, one claim',
        cards: [
          {
            h: 'The tracks',
            p: 'Product or research, named in the proposal and switchable later by emailing the instructor. Same deadlines, deliverables and rubric; the research track is held to a higher standard of novelty and evidence.',
          },
          {
            h: 'Product',
            p: 'Build an AI system that solves a real problem better than the strongest available alternative. The gap may come from missing context, poor reliability, high cost, slow response, privacy constraints, or an unsupported workflow.',
          },
          {
            h: 'Research',
            p: 'Requires an original, falsifiable claim about agents or the systems that run them: a result the closest published work does not provide, an explanation of why it occurs, and the conditions under which it holds. A polished implementation, a reproduction, a benchmark or a set of measurements does not meet the bar alone.',
          },
          {
            h: 'Contribution forms and sides',
            p: 'Forms: Measurement, Mechanism, Reproduction and boundary, Instrument. Sides: agent-side - planning, tool use, memory, context management, verification, multi-agent coordination, evaluation - or systems-side - inference, batching, scheduling, caching, routing, quantization, compression, kernels.',
          },
        ],
        notes:
          'The project is the same skill set as the assignments with the problem inverted: students must choose the evaluation rather than receive it.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Final project',
        title: 'Deliverables, milestones and the evidence bar',
        cols: ['Requirement', 'Detail'],
        rows: [
          ['Weight and format', 'Individual, 20% of the course grade; one proposal, one poster and demo, one blog post and repository.'],
          ['Proposal', 'Wed Oct 28, 11:59pm, 2% of the course grade, one PDF on Canvas, no page limit. Nine sections in order: title and summary, problem, existing work and the gap, claim, design, evaluation plan, goals, plan and resources, references.'],
          ['Poster and demo', 'Mon Dec 7, 9:00am-1:00pm, SEC 1.402, 10%, in person. A visitor should find problem, gap, system or experiment and main result in a few minutes; include at least one figure legible from two meters; a live demo should run reliably in about two minutes. Each student reviews several other projects, and peer scores count toward the grade. Reviews are anonymous to the presenter and signed to the instructor. Late days do not apply to the poster session.'],
          ['Blog post', 'Tue Dec 8, 11:59pm, 8%, a pull request to the course blog repository; the deadline is the moment the pull request is opened, with no need to merge it. Eight required items: problem and gap, design, evaluation method, results including comparisons where you did worse, limitations and threats to validity, which goal you reached, repository and demo links, and the AI use note.'],
          ['Repository', 'Must let another person reproduce the main result: installation and execution guide, raw measurements behind each figure, figure-generating scripts, hardware, software versions and workload for every reported number; label all axes and units; keep figures legible in print and in grayscale.'],
          ['The gap requirement', 'Product: run at least three of the closest commercial tools, open-source systems or research prototypes on your own task, give the same input directly to a frontier model, describe how each one fails, and end with the gap in one testable sentence. Research: cite the closest published work, state what it leaves unsettled, report what you reproduced so far, and state the result your experiment will establish that the closest published result does not.'],
          ['Baselines', 'Product: the strongest existing system run on your tasks, plus the current by-hand workflow timed before your tool changes it. Research: the unmodified agent or system, plus the strongest published method or result reproduced in your setup.'],
          ['The research evidence bar', 'State the hypothesis and fix the protocol before the main experiment; repeated trials; reported variation or uncertainty; an isolated proposed cause; at least one boundary condition tested; reproduction artifacts kept. A single benchmark score, one favorable prompt example, or one throughput number does not meet the bar.'],
          ['Goals', '75% is the minimum result you are confident you can deliver even if the main idea fails; 100% is the result you plan to deliver; 125% is an extension attempted if you reach 100% early. The blog post reports which goal you reached.'],
          ['Pacing', 'Five weeks: week 1 fixes the problem and records the baseline; week 2 runs an end-to-end prototype; weeks 3 and 4 improve and run controlled experiments; week 5 analyzes results and prepares the poster, demo, blog post and repository. Run the complete path once and take the first measurement before building more infrastructure.'],
          ['Grading dimensions', 'Weighted equally for both tracks: problem and motivation, technical execution, evaluation, reporting. A project whose main idea fails can still earn nearly full credit if the blog explains what you expected, what you measured, and why they differ.'],
        ],
        notes:
          'The project overlaps Assignment 4 (due Tue Nov 10) and Assignment 5 (due Sun Nov 29), so the poster and blog post must start before the final week. The rubric\'s hidden spine is "measure one level deeper" - breaking the 60-second result into the 40 seconds of tool calls.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Policy',
        title: 'Grading, bonus, integrity and computing',
        cards: [
          {
            h: 'Grading and the A policy',
            li: [
              'A1 10%, A2 10%, A3 20%, A4 20%, A5 10%, final project 20%, class participation 10%, bonus up to 10%',
              'No more than 20% of the class receives an A',
              'Each leaderboard-scored assignment is scored out of 100, scaling to its share of the grade: 80 points for system performance and 20 for the write-up and video. A3 ranks on task solve rate and cost; A5 on task solve rate, API and GPU cost, and latency',
            ],
            p: 'These are the weights the assignments index and the policy page publish, and the ones the Assignment 1 to 3 spec headers agree with. Lecture 1 printed a different split on 2026-09-02, before the change recorded in Lecture 2; the course-overview deck shows both readings side by side with their sources.',
          },
          {
            h: 'Bonus, capped at 10% overall',
            li: [
              'Optional presentations up to 4% each',
              'Course feedback up to 4% - the home page says up to 6%',
              'Problems current AI cannot solve at 2% each',
              'An AI-stumper submission needs the exact prompt, the responses from ChatGPT, Claude and Gemini with date and model version, the correct answer with evidence, and a sentence on why the models failed',
            ],
          },
          {
            h: 'Participation and lectures',
            li: [
              'Participation is 10% of the grade, earned for active participation; attendance is not tracked, and no participation means a participation score of zero',
              'Laptops are welcome for note-taking, closed during student presentations and guest lectures',
              'Lectures are not recorded',
              'Auditing is allowed if there is room, by emailing the instructor before the first class; auditors do the reading for sessions they attend, do not submit assignments, are not graded, and are not provided computing',
            ],
          },
          {
            h: 'Academic integrity',
            li: [
              'Discussing ideas, reading papers together and debugging are encouraged',
              'Not acceptable: submitting work you did not do, copying without attribution, fabricating experimental results, or misrepresenting a measurement',
              'Fabricated numbers are the one thing treated as a serious violation without exception',
              'Poster peer review adds score trading and retaliatory downgrades to the list',
              'Cite papers, blog posts, repositories and AI tools alike',
            ],
          },
        ],
        notes:
          'The 4% against 6% course-feedback cap is a published disagreement between the home page and the policy page, both inside the stated overall bonus cap of 10%. Both numbers are reported rather than one being chosen.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Computing',
        title: 'Where you run things',
        cols: ['Environment', 'What it is', 'Needed for'],
        rows: [
          ['Claude Code', 'Harvard FAS provides a Claude Code license; submit a request for access', 'Required for Assignment 1, and potentially throughout the course'],
          ['Model API access', 'OpenAI, Anthropic and Google models provided by Harvard FAS ATG, routed through the MaDSys hybridInference proxy. An account is created for every enrolled student and credentials are posted on Canvas, so there is nothing to register for - but be frugal', 'Required for Assignments 2 and 3'],
          ['Course HPC (Harvard ATG)', 'An interactive Slurm job for long runs, plus the course GPU partition (RTX PRO 6000 Blackwell)', 'Required for Assignments 4 and 5, and the default for most serving projects'],
          ['AWS', 'Registration is required of every student and the form closes after week one; use is optional - a small EC2 deployment with no GPU. Protect the endpoint, set a billing alarm before launch, and stop the instance when finished', 'Register in week one; use optional, for Assignment 1 hosting and project work'],
          ['CloudLab', 'Bare metal, kernel or network access, isolated from a shared cluster', 'Project work, when the research question depends on bare-metal control or isolation'],
        ],
        note: 'Supporting tips from the computing page: keep secrets out of agent sessions, because a transcript contains the files the agent read and the command output; describe your environment and experiment setup - GPU, driver, serving engine and version, model, workload - because latency or throughput without that context cannot be reproduced; release idle resources; and escalate access problems early.',
        notes:
          'The project page also lists FASRC (H100 and H200 research nodes, with access approval and queue time) and sets a data-handling rule: a hosted API sends data off your machine, so check lab rules and IRB conditions for unpublished results, collaborators\' data, human-subjects data or private communications.',
      },
    ],
  },

  /* ==================================================================== */
  /* 13. part-ii-status                                                    */
  /* ==================================================================== */
  {
    id: 'part-ii-status',
    slug: 'part-ii-status',
    title: 'Part II status - what is published and what is not',
    navTitle: 'Part II status',
    navBlurb: 'The Part II lectures from 2026-10-19 onward have no slide decks, and Assignments 4 and 5 have no published spec. This deck says so, precisely.',
    footerLabel: 'CS2680 · Part II status',
    source: `${S}/index.html`,
    sources: [
      { url: `${S}/index.html`, label: 'course home - the 14-week schedule' },
      { url: `${S}/assignments/index.html`, label: 'the assignments index, which links A4 and A5 to an unreleased page' },
      { url: `${S}/slides/8_agent_design_5.pdf`, label: 'the last published lecture deck, dated 2026-10-07' },
    ],
    slides: [
      {
        layout: 'cover',
        kicker: 'A deliberate, explicit state',
        title: 'Part II status: what is published, and what is not',
        lede: 'Nine slide PDFs are published and cover the course through 2026-10-07. Everything after that has dates and topics, but no material - and this deck does not fill the gap with guesses.',
        pills: ['8 lecture decks + 1 briefing', 'Part I: Sep 2 - Oct 14', 'Part II: Oct 19 - Dec 7', 'A4 and A5 specs unpublished'],
        meta: 'index.html · assignments/index.html',
        notes:
          'This is a real gap in the published material, and a study site that hides it is worse than one that names it. Nothing on the following slides is inferred.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'What exists',
        title: 'The published set',
        cards: [
          {
            h: 'Nine slide PDFs',
            li: [
              'Eight lecture decks: 1_intro, 2_agent_use_1, 3_agent_use_2, 4_agent_design_1, 5_agent_design_2, 6_agent_design_3, 7_agent_design_4 and 8_agent_design_5',
              'One extra deck, 8_assignment3.pdf, attached to the 2026-10-07 lecture',
            ],
          },
          {
            h: 'Reference notes',
            li: [
              'Two large reference notes: agent evaluation and benchmarks, and cost-effective agents',
              'Plus an optional transformers and LLM foundations note, assembled from the former October 19 LLM lecture',
            ],
          },
          {
            h: 'Assignment specifications',
            li: [
              'Assignments 1, 2 and 3 have published full specifications',
              'The to_release table marks 1 to 3 as posted',
            ],
          },
          {
            h: 'Course pages',
            li: [
              'The home page with the schedule and grading list, the project page, the policy page, the discussion page, the computing pages and the readings index',
            ],
          },
        ],
        notes:
          'The published set is what the mirror actually contains. Everything the decks on this site say comes from inside it.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'What does not exist',
        title: 'The unpublished set',
        cards: [
          {
            h: 'No slide deck for any Part II lecture',
            p: 'No PDF exists for any Part II lecture, any student-led session, any guest lecture, or any no-class row.',
            li: [
              'The first Part II lecture is 2026-10-19, Efficient LLM serving basics I',
              'The last is 2026-11-30, Efficient agentic systems: others',
            ],
          },
          {
            h: 'No specification for assignments 4 and 5',
            p: 'The assignments index links both to a not-yet-released page. Their date, weight, codename, one-paragraph summary and effort estimate are published; their full specifications are not.',
          },
          {
            h: 'No published reading for the Part II rows',
            p: 'The readings index carries six dated entries, all of them in Part I. The schedule row for 2026-11-30 has a readings cell that contains only HTML comments.',
          },
          {
            h: 'What this deck does instead',
            p: 'It states the gap, gives the published topic, date and session type for each unpublished lecture, and stops there. No content is invented, and no screenshot-only page is described.',
          },
        ],
        notes:
          'The distinction that matters for a study site: "not published" is a fact about the course, and it is a fact the student needs in order to plan.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'The unpublished half',
        title: 'The Part II schedule, as published',
        lede: 'Every row below is a row of the published course schedule. The topic and the date are published; the slides are not.',
        cols: ['Week', 'Date', 'Topic', 'Session type', 'Slides'],
        rows: [
          ['8', '2026-10-19', 'Efficient LLM serving basics I', 'Instructor lecture', 'No - Part II, slides not published'],
          ['8', '2026-10-21', 'Efficient LLM serving basics II', 'Instructor lecture', 'No - Part II, slides not published'],
          ['9', '2026-10-26', 'Assignment Feedback and Student sharing II', 'Instructor + students', 'No'],
          ['9', '2026-10-28', 'Efficient LLM serving basics III', 'Instructor lecture', 'No - Part II, slides not published'],
          ['10', '2026-11-02', 'Efficient LLM serving: speculative decoding', 'Instructor lecture', 'No - Part II, slides not published'],
          ['10', '2026-11-04', 'Efficient agentic systems: scheduling and prefix caching', 'Instructor lecture', 'No - Part II, slides not published'],
          ['11', '2026-11-09', 'Guest lecture: Why Infrastructure sets the pace of AI (Xianzheng Kou, Meta)', 'Guest lecture', 'No'],
          ['11', '2026-11-11', 'Efficient LLM serving: pruning and quantization', 'Instructor lecture', 'No - Part II, slides not published'],
          ['12', '2026-11-16', 'Efficient LLM serving: KV-cache optimization and model architectures', 'Student-led (paper discussion)', 'No'],
          ['12', '2026-11-18', 'Student sharing III (Assignment 4: agent-engine co-design)', 'Student-led', 'No'],
          ['13', '2026-11-23', 'Efficient agentic system: routing and load balancing', 'Instructor lecture', 'No - Part II, slides not published'],
          ['13', '2026-11-25', 'No class - Thanksgiving recess', 'No class', 'No'],
          ['14', '2026-11-30', 'Efficient agentic systems: others', 'Instructor lecture', 'No - Part II, slides not published'],
          ['14', '2026-12-02', 'Student sharing IV (Assignment 5: full stack optimizations)', 'Student-led', 'No'],
          ['14', '2026-12-07', 'Final project poster and demo (SEC 1.402, 9:00 AM to 1:00 PM)', 'Student-led', 'No'],
        ],
        note: 'Part I spans 2026-09-02 to 2026-10-14 and Part II spans 2026-10-19 to 2026-12-07. The last published slide deck is dated 2026-10-07.',
        notes:
          'The 2026-11-30 row is reconstructed from the published site because its readings cell contains only HTML comments - the topic is intact.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Readings',
        title: 'What the readings index actually carries',
        cards: [
          {
            h: 'Six dated entries, all in Part I',
            li: ['Sep 9', 'Sep 14', 'Sep 16', 'Sep 23', 'Sep 28', 'Oct 14'],
          },
          {
            h: 'The index is only an index',
            p: 'The readings page is a "Readings by Date" index. The full bibliography, at roughly 485 KB, was outside the scope of the courseware digest, so the per-lecture reading lists recorded here are the ones carried on the course home page.',
          },
          {
            h: 'The October 19 row',
            p: 'The schedule row for 2026-10-19 lists no readings link. The optional transformers and LLM foundations note is explicitly optional background, assembled from the former October 19 LLM lecture, and it has its own deck on this site.',
          },
          {
            h: 'Two paper discussions',
            p: 'Oct 14 on agent safety and self-evolving harnesses, and Nov 16 on KV-cache optimization and model architectures. Both are student-led, and both are marked "no slides" on the schedule.',
          },
        ],
        notes:
          'So the reader for a Part II lecture is not published on the course site. Saying that is more useful than leaving the impression that there is a reading list to be had.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Assignments 4 and 5',
        title: 'The published fields, and the missing one',
        cols: ['', 'Assignment 4', 'Assignment 5'],
        rows: [
          ['Codename', 'Mads-Serve', 'Mads-Stack'],
          ['Title', '"Serve your own agent"', '"Optimize the full stack"'],
          ['Weight', '20%', '10%'],
          ['Out', 'Wed Oct 21', 'Wed Nov 11'],
          ['Due', 'Tue Nov 10, 11:59pm', 'Sun Nov 29, 11:59pm'],
          ['Effort estimate', '10-14 hours', '12-18 hours'],
          ['Full specification', 'Not published at time of capture', 'Not published at time of capture'],
        ],
        note: 'The index page publishes a one-paragraph summary for each of the two, and links both to a not-yet-released page. The to_release table marks assignments 1 to 3 as posted and leaves 4 and 5 without a spec link.',
        notes:
          'For reference, the published summary of each is the title itself: serve your own agent, and optimize the full stack. The 2026-10-07 slide deck (8_agent_design_5.pdf, PDF page 2) states that A4 is now worth 20 points and A5 10 points, because A5 was judged too hard and overlapped with the course project and other courses\' projects.',
      },
      {
        layout: 'cards',
        cols: 3,
        kicker: 'Method',
        title: 'How this site handles an unpublished page',
        cards: [
          {
            h: 'No invented content',
            p: 'No deck describes a Part II lecture, because no Part II lecture has published material. The topic line on the schedule is not content, and this site does not expand it into one.',
          },
          {
            h: 'No described screenshots',
            p: 'Several published pages are image- or screenshot-based with no recoverable text. Those pages are not described here either - only their existence is recorded where it matters.',
          },
          {
            h: 'Conflicts are shown, not resolved',
            p: 'Where two published pages disagree - the grading split, the leaderboard formula, the bonus cap, the A3 deliverable - both readings are printed with their source, and the digest names which page is tied to which rubric.',
          },
        ],
        notes:
          'This deck is the site\'s honesty check. If a future release of the course publishes the Part II decks, this deck should be replaced by them, not amended.',
      },
    ],
  },

  /* ==================================================================== */
  /* 14. transformers-llm-foundations                                       */
  /* ==================================================================== */
  {
    id: 'transformers-llm-foundations',
    slug: 'transformers-llm-foundations',
    title: 'Reference note - Transformers and LLM foundations',
    navTitle: 'Transformers and LLM foundations',
    navBlurb: 'The optional background note: tokenization, architecture, sparse models, scaling laws, data, post-training, reasoning, evaluation and model reports.',
    footerLabel: 'CS2680 · Reference note · transformers',
    source: `${S}/notes/transformers.html`,
    sources: [
      { url: `${S}/notes/transformers.html`, label: 'the reference note - optional background readings' },
      { url: `${S}/index.html`, label: 'course home - the October 19 schedule row' },
    ],
    slides: [
      {
        layout: 'cover',
        kicker: 'Reference note · explicitly optional background',
        title: 'Transformers and LLM foundations',
        lede: 'A systems reading list, not a model list. Every entry answers: what does this change about the forward pass, the cache, or the bill?',
        pills: ['10 groups', 'Read it for shapes', 'Optional background'],
        meta: 'notes/transformers.html',
        notes:
          'The note is assembled from the former October 19 LLM lecture and its stated reading rule is "read it for shapes, not for BLEU scores". The October 19 schedule row lists no readings link for it.',
      },
      {
        layout: 'table',
        small: true,
        kicker: 'Scope',
        title: 'Ten groups of entries',
        cols: ['Group', 'Key ideas'],
        rows: [
          ['Foundations', 'Transformer (2017) replaces recurrence and convolution with self-attention plus a position-wise FFN; Illustrated and Annotated Transformer for shapes and mechanics; GPT-1 pretrain-then-fine-tune, GPT-2 one set of weights for many tasks, GPT-3 in-context learning; BERT bidirectional encoder; T5 unified text-to-text interface'],
          ['Tokenization', 'BPE merges frequent adjacent pairs; SentencePiece keeps whitespace in the vocabulary; Dolma releases 3T tokens with curation decisions; SuperBPE crosses word boundaries; BLT moves to byte patches; H-Net learns segmentation jointly. Fertility - tokens per word - is the conversion factor between text and served sequence length'],
          ['Architecture', 'RoPE encodes relative position by rotation and is embedded in KV entries; ALiBi extrapolates with a linear penalty and no position embedding; RMSNorm is a memory-bound op worth fusing; SwiGLU changes the MLP to three projections; MQA collapses KV heads; GQA makes group count a dial; DeepSeek-V2/MLA caches a low-rank latent; YaRN extends context by uneven frequency interpolation; Gated DeltaNet combines decay and delta rule for a fixed-size state'],
          ['Sparse and alternative architectures', 'GShard (MoE plus automatic sharding), Switch Transformer (top-1 routing, load-balancing loss, capacity factor), DeepSeekMoE (fine-grained experts plus shared experts), DeepSeek-V3 (671B/37B, FP8, auxiliary-loss-free balancing, MTP), Mamba (selective state spaces, no KV cache), MiniMax-01 (lightning attention plus 32-expert mixture), DeepSeek-V4 (1.6T and 284B previews, compressed hybrid attention, hyper-connections, Muon)'],
          ['The scaling-law argument', 'Kaplan-style power laws, Chinchilla\'s correction and its replication, over-training, data limits, precision as a scaling variable, test-time compute, observational scaling laws, ScaleRL, plus practitioner posts on fitting discipline and on post-training as the dial with slack'],
          ['Data', 'The Pile (825 GiB, 22 sources), C4 analysis (audit the artifact, not the filter), DataComp-LM (hold the recipe fixed, vary the data), OLMo (open the whole pipeline), Pythia (16 models, 154 checkpoints each), FineWeb and FineWeb-Edu, Nemotron-CC, Common Pile (8TB, license-clean), Olmo 3 (open post-training flow)'],
          ['Post-training', 'FLAN instruction tuning, T0 multitask prompted training, InstructGPT RLHF, Constitutional AI, DPO, GRPO, Tulu 3 (including methods that did not reliably help)'],
          ['Reasoning', 'Chain-of-thought, self-consistency, STaR, DeepSeek-R1, Qwen3\'s caller-set thinking budget, s1 budget forcing, and a 2026 post on exploitation - not exploration - as the test-time-scaling bottleneck'],
          ['Evaluation', 'MMLU, HELM, emergent abilities and the mirage critique, Chatbot Arena, benchmark contamination, LongBench, MMLU-Pro, RULER, HELMET, and "judges saturate first"'],
          ['Representative model reports', 'GPT-4 (withholds architecture, size, hardware, compute, dataset, method), LLaMA, Llama 2, Llama 3 (16K-GPU run and failure rates), Mistral 7B, Gemma 3, gpt-oss (harmony chat format), Kimi K2, GLM-4.5, GLM-5, Kimi K3, Gemma 4, Qwen3.5, MiniMax-M2.5, Claude Opus 4.6'],
        ],
        notes:
          'The note closes by saying the evaluation and model-report groups must be read together, and that the DeepSeek and Qwen3 reports sit with the mechanisms they introduced.',
      },
      {
        layout: 'twocol',
        kicker: 'Foundations and tokenization',
        title: 'The lineage and the conversion factor',
        left: {
          h: 'Foundations',
          li: [
            'The Transformer (2017) scored 28.4 BLEU on WMT 2014 En-De, more than 2 BLEU above the previous best including ensembles, and 41.8 BLEU En-Fr after 3.5 days on eight GPUs',
            'BERT (2018), T5 (2019), GPT-1 (2018), GPT-2 (2019) and GPT-3 (2020) map the decoder-only, encoder-only and encoder-decoder lineages',
            'No autoregressive decode means no KV cache for encoders',
          ],
        },
        right: {
          h: 'Tokenization',
          li: [
            'Byte-level BPE is the tokenizer for GPT-2 to GPT-4 and Llama 3; SentencePiece ships with T5, Llama 1/2, Mistral and Gemma',
            'Dolma releases 3 trillion tokens with 50,280 vocabulary entries, of which 223 never occur - about 0.4% - and fertility is highest on code',
            'SuperBPE (2025): a fixed 200k vocabulary, up to 33% fewer tokens than BPE, and an 8B model gaining 4.0 points across 30 downstream tasks at 27% less inference compute',
            'BLT (2024) is the first FLOP-controlled byte-level scaling study, to 8B parameters and 4T training bytes; H-Net (2025) is ~4x more data-efficient on DNA',
          ],
        },
        notes:
          'Tokenization, architecture and data are the three inputs that set the workload Part II must serve; fertility, KV entry shape and cache placement are the three levers that follow.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Architecture',
        title: 'What the model report changes in the serving stack',
        cards: [
          {
            h: 'Normalisation, MLP, attention',
            li: [
              'RMSNorm replaced LayerNorm in Llama, Qwen, Mistral, Gemma and DeepSeek',
              'SwiGLU appears in PaLM, Llama, Qwen, Mistral and Gemma',
              'MQA is the KV layout in PaLM, Falcon-7B and StarCoder',
              'GQA (2023) uses eight key/value groups with 5% of the original pretraining steps, keeps a seven-task score of 47.1 against 47.2, and cuts time per sample from 1.51s to 0.28s; it is used by Llama 2 70B, Llama 3, Qwen 2.5 and Mistral',
            ],
          },
          {
            h: 'Context extension and alternative state',
            li: [
              'DeepSeek-V2 / MLA (2024): a 93.3% smaller KV cache and 5.76x higher maximum generation throughput against DeepSeek 67B, with 236B total and 21B activated per token',
              'YaRN (2023) reaches the target context with 10x fewer tokens and 2.5x fewer training steps, and ships in Qwen 2.5 and DeepSeek-V3',
              'Gated DeltaNet (2024) beats Mamba2 and DeltaNet on in-context retrieval, and is interleaved by Qwen3-Next',
            ],
          },
        ],
        notes:
          'This is the "read it for shapes" instruction in practice: the question is never "how good is the model" but "what does this do to the cache and the forward pass".',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Sparse and alternative architectures',
        title: 'Three dense problems and three sparse answers',
        cards: [
          {
            h: 'Routing',
            li: [
              'Top-2 routing: Mixtral, Grok-1',
              'Top-1 routing with a load-balancing loss and a capacity factor: Megatron-LM, DeepSpeed-MoE',
              'Fine-grained experts plus shared experts: DeepSeekMoE',
              'DeepSeek-V3 is 671B total and 37B activated over 14.8T tokens and 2.788M H800 GPU hours, with MTP heads that became a speculative-decoding path in vLLM and SGLang, and kernels released as DeepGEMM and DeepEP',
            ],
          },
          {
            h: 'Fixed-size state',
            li: [
              'Mamba (2023) is a linear-time selective state space with a fixed-size state, so there is no KV cache to page, evict or share',
              'MiniMax-01 (2025) is 456B total and 45.9B activated with a 32-expert mixture and a 1M-token training context extrapolating to 4M at inference, with the team reverting to full attention for M2',
              'DeepSeek-V4 (2026) previews at 1.6T total and 49B activated and 284B and 13B, both 1M context over more than 32T tokens, reporting 27% of DeepSeek-V3.2 per-token inference FLOPs and 10% of its KV-cache footprint',
            ],
          },
        ],
        notes:
          'Mamba is the clearest statement of the cache problem: a model with no KV cache changes the serving stack from memory management into something else.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Scaling and data',
        title: 'The argument, and the corpus',
        cards: [
          {
            h: 'The scaling-law argument',
            li: [
              'Loss falls as a power law in parameters, data and compute; Chinchilla says the model should be much smaller and see far more data',
              'The roughly 20-tokens-per-parameter ratio survives replication, but the stated precision does not',
              'Loss stays predictable past the Chinchilla budget, and downstream error stays predictable as a function of loss',
              'One of the three scaling terms has a floor and the other two do not; adding bits per weight makes precision a budget variable',
              'Spending compute at generation can beat spending it on a larger model',
              'ScaleRL (2025) used more than 400,000 GPU-hours of controlled runs, found RL compute-performance curves to be sigmoidal, and extrapolated to a single 100,000 GPU-hour run',
              'The 2026 posts frame the disagreement as 5.5x the model for 10x the compute against doubling both, with GLM-5.3 as the controlled post-training test',
            ],
          },
          {
            h: 'Data',
            li: [
              'The Pile (2020) is 825 GiB from 22 sources, used by Cerebras-GPT; the C4 audit finds machine-generated text and evaluation examples inside the corpus, and disproportionate blocklist removal of minority-group text',
              'DataComp-LM holds the recipe fixed and varies the data; OLMo 2 and SmolLM2 use the DCLM baseline; OLMo releases weights, data, code and eval code; Pythia is 16 models from 70M to 12B with 154 checkpoints per model',
              'FineWeb (2024) is 15T tokens from 96 Common Crawl snapshots with every filter ablated, with a 1.3T-token FineWeb-Edu subset; aggressive filtering removes about 90% of data, but the full 6.3T-token set matches DCLM on MMLU with 4x more unique real tokens, and an 8B model trained on 15T tokens beats Llama 3.1 8B by 5 points on MMLU',
              'The Common Pile (2025) is 8TB from 30 openly licensed sources, with 7B models trained on 1T and 2T tokens performing near Llama 1 and Llama 2 7B at comparable compute',
            ],
          },
        ],
        notes:
          'The scaleRL and practitioner-post entries are the ones that matter for Part II: test-time compute is what turns a training-time argument into a serving-time problem.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Post-training and reasoning',
        title: 'Where the bill moves',
        cards: [
          {
            h: 'Post-training',
            li: [
              'FLAN (2021) fine-tunes a 137B model on more than 60 instruction tasks, beating zero-shot 175B GPT-3 on 20 of 25 tasks',
              'T0 beats zero-shot systems up to 16x its size on held-out task types',
              'InstructGPT is SFT plus a reward model plus policy optimization with a KL penalty (TRL, DeepSpeed-Chat, OpenRLHF, verl)',
              'Constitutional AI replaces human harmlessness labels with AI feedback, so the training job consumes generated tokens in bulk',
              'DPO makes preference training a classification loss with no reward model and no RL loop - Llama 3 and Zephyr used it instead of PPO',
              'GRPO removes PPO\'s value network; Tulu 3 writes out the whole pipeline including the methods that did not reliably help',
            ],
          },
          {
            h: 'Reasoning',
            li: [
              'Chain-of-thought (2022) is the first prompting technique to move the serving bill visibly, and it is paid for in decode tokens',
              'With PaLM-540B, self-consistency adds 17.9 points on GSM8K, 11.0 on SVAMP, 12.2 on AQuA, 6.4 on StrategyQA and 3.9 on ARC-Challenge',
              'STaR matches fine-tuning a model 30x larger on CommonsenseQA',
              'DeepSeek-R1 uses RL against checkable answers, and its long traces shift every Part II trade-off toward decode',
              'Qwen3 (2025) carries thinking and non-thinking modes in one model with a dense and MoE ladder from 0.6B to 235B and a caller-set thinking budget',
              's1 fine-tunes on 1,000 curated questions, then budget-forces AIME24 from 50% to 57% on the same weights; in the 2026 study reward models correlate at about 0.12 with true quality and cross-candidate synthesis recovers about 40% of the pool\'s quality',
            ],
          },
        ],
        notes:
          'The evaluation group and the model-report group are the ones to read together. A reasoning model that reports more tokens per answer is a different serving problem, and the note makes that point explicitly for R1.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Evaluation',
        title: 'The same skill the course grades',
        cards: [
          {
            h: 'MMLU, HELM and the mirage critique',
            li: [
              'MMLU is one multiple-choice test over 57 subjects with one aggregate accuracy',
              'HELM fixes 7 metrics over 16 core scenarios for 30 models; models had been evaluated on 17.9% of scenarios on average against 96.0% under HELM',
              'Discontinuous jumps can be produced by exact-match scoring, and a continuous metric smooths them away',
              'The Arena paper reports over 240K votes at the time of writing',
            ],
          },
          {
            h: 'Contamination, length and judges',
            li: [
              'Decontamination is now a routine pretraining step, and the Llama 3 and Qwen reports publish contamination analyses',
              'LongBench has 21 datasets over 6 categories in English and Chinese, averaging 6,711 words for English tasks',
              'MMLU-Pro accuracy falls 16-33% against MMLU and prompt sensitivity drops from 4-5% to 2% across 24 prompt styles',
              'In RULER all 17 evaluated models claim 32K tokens or more, but only about half still perform acceptably at that length',
              'HELMET uses 7 application-centric categories, controllable lengths to 128K, and 59 models',
              'On Omni-MATH the original automatic judge is wrong in 96.4% of expert-audited disagreements, well before benchmark saturation',
            ],
          },
        ],
        notes:
          'The recurring hinge: a number means nothing without its protocol, and the judge is a component that can saturate before the task does.',
      },
      {
        layout: 'cards',
        cols: 2,
        kicker: 'Model reports',
        title: 'What a report discloses, and what it withholds',
        cards: [
          {
            h: 'Disclosure',
            li: [
              'GPT-4 (2023) states that it withholds architecture, model size, hardware, training compute, dataset construction and training method',
              'The open-weight line the assignments run on: LLaMA (2023), Llama 2 (2023) and Llama 3 (2024); Llama 3 Section 3 documents a 16K-GPU training run and its failure rates',
              'Mistral 7B (2023) uses a sliding-window attention with a fixed-size rolling cache, in the exact size range Assignment 4 targets',
              'Gemma 3 (2025) runs 1B to 27B, multimodal, at least 128K tokens, with interleaved local and global attention layers to cap per-layer cache',
              'gpt-oss-120b and gpt-oss-20b under Apache 2.0 ship tool environments, tokenizers and the harmony chat format written down',
              'Kimi K2 is 1T total and 32B activated, and its 15.5T-token pretraining run completed with zero loss spikes using MuonClip QK-clip',
            ],
          },
          {
            h: 'Recent reports',
            li: [
              'GLM-4.5 (2025) is 355B total and 32B activated over 23T tokens plus a 106B Air variant, reporting 70.1% on TAU-Bench, 91.0% on AIME 24 and 64.2% on SWE-bench Verified, with the RL infrastructure shipped as slime',
              'GLM-5 (2026) uses an asynchronous RL stack, async agent RL for long-horizon interaction, and sparse attention descending from DeepSeek NSA, implemented in verl, slime and AReaL',
              'Kimi K3 (2026) is 2.8T total and 104B activated, routes 16 of 896 experts per token, uses Kimi Delta Attention, and attributes roughly 2.5x scaling efficiency over Kimi K2 to co-design',
              'Gemma 4 (2026) spans 2.3B to 31B, dense and MoE, natively multimodal, with a thinking mode, an encoder-free 12B variant and the Gemma 3n on-device line continued',
              'Qwen3.5 (2026), MiniMax-M2.5 (2026) and Claude Opus 4.6 (2026) are release and system reports whose usable content is the deployment and prompting contract, and the request shape: long interaction histories and tool use',
            ],
          },
        ],
        notes:
          'Reading several model reports side by side is presented as the fastest way to see what a report discloses and what it withholds - GPT-4 against Llama 3 against DeepSeek-V3.',
      },
    ],
  },
];
