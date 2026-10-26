---
title: Computing resources you will use
source: https://cs2680.seas.harvard.edu/computing/index.html
fetched: 2026-10-19T16:28:00+00:00
source_kind: harvard-cs2680-official
---

# Computing resources you will use
CS2680 Modern AI Systems — Computing Setup

CS2680 Modern AI Systems: Agents and System Optimizations

Computing setup

# Computing resources you will use

You will use Claude Code in Assignment 1 (and potentially throughout the course).
You will need access to LLM inference APIs in Assignments 2 and 3. You will need access to GPUs for Assignments 4 and 5.
AWS provides additional computing resources, and every student registers an account in week one.

**Request the necessary resources in week one**: [Claude Code](claude-code.html), [HPC GPU](cluster.html), and [AWS](aws.html) accounts.

[Required · Assignment 1

Claude Code

Start here. Harvard FAS provides a Claude Code license, please submit a request to get access.](claude-code.html)
[Required · Assignments 2 and 3

Model API access

Access the OpenAI, Anthropic, and Google models, provided by Harvard FAS ATG and routed through the MaDSys hybridInference proxy. We create an account for every enrolled student and post the credentials on Canvas, so there is nothing to register for. Please be frugal with your usage, as the cost can add up quickly.](api.html)
[Required · Assignments 4 and 5

Harvard ATG course HPC

Use an interactive Slurm job when a job is too long for your laptop, and use the course GPU partition for Assignments 4 and 5.](cluster.html)
[Register in week one · use optional

AWS

Registration is required of every student and the form closes after week one. Using the account is optional: run a small deployment on an EC2 instance if you want one, with no GPU needed. Protect the endpoint, set a billing alarm before launch, and stop the instance when you are finished.](aws.html)

---

# Assignment by assignment

| Work | Use | Why |
| --- | --- | --- |
| [Assignment 1](../to_release.html) | Claude Code + [AWS](aws.html) | Build the web UI with the course agent account, and deploy it on EC2 if you want it reachable. No GPU required. |
| [Assignment 2](../to_release.html) and [Assignment 3](../to_release.html) | Laptop/HPC + [Harvard OpenAI/Gemini/Anthropic API](api.html) | The model runs behind a commercial API. Any machine is enough; use AWS or [HPC job](cluster.html#interactive) when the experiment should run for hours. |
| [Assignment 4](../to_release.html) | HPC GPU (RTX PRO 6000 Blackwell) | You serve the model yourself. Use the course [`gpu-cs2680` partition](cluster.html#gpu). |
| [Assignment 5](../to_release.html) | HPC and/or [API](api.html) + AWS/CloudLab | You serve the agent using the provided GPU, you will optimize your model and serving engine, but you can also use a small number of API calls. |
| [Final project](../project.html) | Laptop + [model API](api.html), or [HPC](cluster.html); [CloudLab](cloudlab.html) when necessary | Use the API for hosted models and the HPC when you need to serve or train a model. Use CloudLab only when the research question depends on bare-metal control or isolation. |

If a project needs hardware that none of these environments provides, ask the instructor while the scope can
still change. Compute can sometimes be arranged; last-minute capacity cannot be promised.

---

# Tips

* **Keep secrets out of agent sessions.** A transcript can contain files the agent read and
  output its commands printed, not just your prompts. Follow the
  [scan-before-you-archive checklist](claude-code.html#privacy) every time.
* **Describe your environment and experiment setup.** Report the GPU, driver, serving engine and version, model, and workload. Latency or throughput without that context cannot be reproduced or compared.
* **Release idle resources.** Exit the Slurm job, stop the EC2 instance, and terminate the CloudLab experiment. Shared hardware and paid instances should never sit idle by accident.
* **Escalate access problems early.** An account problem in week one is fixable. The same problem on the due date is still an account problem, not an extension plan.

---

# Related

* [Assignments](../assignments/index.html). The five specs these environments serve.
* [Final project compute](../project.html#resources). Choosing among the model API,
  the HPC, AWS, FASRC, and CloudLab for project work.
* [AI use policy](../policy.html#ai-policy). The agent requirement, disclosure, and the
  session-file submission rule.
