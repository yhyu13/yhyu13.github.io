---
title: Model API access
source: https://cs2680.seas.harvard.edu/computing/api.html
fetched: 2026-10-19T16:28:00+00:00
source_kind: harvard-cs2680-official
---

# Model API access
CS2680 Modern AI Systems — Model API access

CS2680 Modern AI Systems: Agents and System Optimizations

Model API access

# Model API access

You will need to access LLMs through API for Assignments 2 and 3. The course gives you API access to models from OpenAI, Anthropic, and Google. Harvard FAS
Academic Technology Group provides the access, and we run a proxy layer, which handles key distribution, model access control, and account management. You just need one key to access all three providers.

---

# Getting your account

We will create an account for every enrolled student and post the credentials on Canvas before [Assignment 2](../to_release.html) opens.

Two things to do, in order.

* **Read the Canvas announcement.** It carries your key, the base URL of the router, and the model names the router expects.
* **Keep the key out of your repository.** The key identifies you and bills to the course. Put it in an environment variable, never in a committed file, and never in a prompt or a transcript you are about to submit.

Accounts follow the enrolled roster. Therefore, if you enroll late, or you cannot find your credentials on Canvas, email the teaching staff.

---

# Start with the small model

The API is expensive, and an agent is the worst case for it. A model is stateless, so every step of an agent loop re-sends the whole context and pays for it again. The bill therefore grows with the number of steps multiplied by the context length, not with the number of questions you asked.

Consider a 50-step agent session that carries 20,000 tokens of context into each step and generates 500 tokens per step. That is 50 × 20,000 = 1,000,000 input tokens and 50 × 500 = 25,000 output tokens for a single run. On **Claude Haiku 4.5** the run costs 1.0 × $1.00 + 0.025 × $5.00 = **$1.13**. On **Claude Opus 5** the same run costs 1.0 × $5.00 + 0.025 × $25.00 = **$5.63**, or **5.0×** as much. One run of either is affordable. However, a 200-run sweep on Opus 5 is $1,125, which is not, and a parameter sweep is exactly what Assignment 3 asks you to do.

**Debug on the cheapest model, then measure on the one you are reporting.** Getting the plumbing right — the loop, the tool calls, the parsing — does not need a frontier model. Switch up only once the harness works, and say in your write-up which model produced which number.

Two other levers matter more than model choice for a fixed workload. First, **prompt caching** bills a repeated prefix far below the input rate (on the Anthropic models a cache hit costs 10% of the base input price, against a 25% surcharge on the write), and an agent loop that re-sends a stable system prompt and tool list is the case it was built for. Second, **context length** is a cost you control: trimming what you re-send each step reduces every subsequent step's bill, which is the measurement [Assignment 3](../to_release.html) is about.

---

# Available models and prices

Prices are US dollars per million tokens, at the standard (non-batch) rate, as published by each provider
on **2026-08-22**. Batch processing halves the rate at all three providers. Prices change, and
several rates below are explicitly temporary, so treat these tables as the starting point for your own
estimate and check the provider's page before you plan a large run.

Read across the three tables before you pick. The spread is wider than it looks: **Claude Fable 5
costs 50× as much per input token as GPT-5.6 Luna**, and 42× as much per output token.
The cheapest option overall is GPT-5.6 Luna, and the cheapest that still gives you a 1M-token context is
Gemini 3.5 Flash-Lite. Note also that only Claude Haiku 4.5 and the OpenAI models are below 1M context,
which matters once an agent loop starts accumulating history.

## OpenAI

| Model | Context | Input $/1M | Output $/1M | Notes |
| --- | --- | --- | --- | --- |
| GPT-5.6 Luna | 272K | $0.20 | $1.20 | The cheapest model the course provides. A sound default while the harness is still wrong. |
| GPT-5.6 Terra | 272K | $2.00 | $12.00 | Mid-tier of the GPT-5.6 family. |
| GPT-5.6 Sol | 272K | $4.00 | $20.00 | Promotional rate, held at least through 2026-11-21. |
| GPT-5.5 | 272K | $5.00 | $30.00 | The previous generation. |

Every OpenAI model here has a 272K context, and above a 128K prompt the rate roughly doubles.

## Anthropic

| Model | Context | Input $/1M | Output $/1M | Notes |
| --- | --- | --- | --- | --- |
| Claude Haiku 4.5 | 200K | $1.00 | $5.00 | The smallest Claude. Note the 200K context, 5× smaller than the rest of the family. |
| Claude Sonnet 5 | 1M | $2.00 | $10.00 | The usual middle choice for agent work. |
| Claude Opus 5 | 1M | $5.00 | $25.00 | Use for the final measurement, not for debugging. |
| Claude Fable 5 | 1M | $10.00 | $50.00 | The most expensive model the course provides. Justify it in your write-up before using it at scale. |

The Claude models are the ones where [prompt caching](#cost) is documented most precisely: a
cache hit costs 10% of the base input rate, against a 25% surcharge on the write.

## Google

| Model | Context | Input $/1M | Output $/1M | Notes |
| --- | --- | --- | --- | --- |
| Gemini 3.5 Flash-Lite | 1M | $0.30 | $2.50 | The cheapest model with a 1M context. |
| Gemini 3.7 Flash | 1M | $0.75 | $3.75 | Rate holds through 2026-12-31, then doubles. It will not change during the semester. |
| Gemini 3.1 Pro | 1M | $2.00 | $12.00 | Preview model. Above a 200K prompt the rate rises to $4.00 input and $18.00 output. |

Every Gemini model here has a 1M context, which makes this the cheapest family to hand a long prompt.

Sources (2026-08-22): [OpenAI API pricing](https://developers.openai.com/api/docs/pricing), [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing), and [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing).

---

# Four rules

* **The key is yours.** Do not share it, and do not use a classmate's. Usage is attributed per account, which is also how we notice a runaway loop before it becomes a large bill.
* **Keep the key out of your repository.** The rule from [getting your account](#account) applies for the rest of the semester, and a leaked key is billed to the course before anyone notices.
* **Cap your own spending.** Put a hard request ceiling in your harness before you launch a sweep. A loop with no stopping condition is the single most common way this budget gets spent.
* **Keep budget in mind**. The budget we allocate to each assignment should be sufficient. You need a good reason to request additional budget.

---

# Related

* [Computing setup](index.html). Which environment each assignment needs.
* [Claude Code](claude-code.html). The separate Harvard FAS agent license, required in Assignment 1 and optional afterwards.
* [Course HPC](cluster.html). Where you serve a model yourself, instead of calling an API.
* [Final project compute](../project.html#resources). When to use the model API or
  self-serve on the course HPC.
* [Assignment 3](../to_release.html). The cost and latency optimization this page's arithmetic is for.
* [AI use policy](../policy.html#ai-policy). Disclosure and the session-file submission rule.
