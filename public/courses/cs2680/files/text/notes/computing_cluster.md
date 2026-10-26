---
title: The HPC cluster
source: https://cs2680.seas.harvard.edu/computing/cluster.html
fetched: 2026-10-19T16:28:00+00:00
source_kind: harvard-cs2680-official
---

# The HPC cluster
CS2680 Modern AI Systems — HPC

CS2680 Modern AI Systems: Agents and System Optimizations

HPC: running an agent in an interactive job

# The HPC cluster

Harvard FAS ATG provides a high-performance computing (HPC) cluster for this course. It has 72 CPU nodes and 50 GPU nodes. The cluster is managed by [Slurm](https://slurm.schedmd.com/).
The cluster is accessible via the [Open OnDemand portal](https://ood.huit.harvard.edu). ATG publishes the [OnDemand user documentation](https://harvard-atg.github.io/huit-ondemand-user-docs) for it.

**We will figure out how to add you to the cluster.**
The login host is
`academ-acade-iL73aitWT6xF-c83014867702e61e.elb.us-east-1.amazonaws.com`. The
[SSH config below](#ssh-config) gives it a short name. Still to be announced: how you get an account and get added to the CS2680 group. Those will be posted
here and on the [home page](../index.html). Registering an SSH key is not announced, because you
do it yourself: connect through the OnDemand portal once, and append your public key to
`~/.ssh/authorized_keys` from the browser terminal, as
[step 3 of first-time setup](#ssh-key) describes.

---

# Quick start

Once, ever, from an OnDemand terminal on the login node:

curl -fsSL https://claude.ai/install.sh | bash # installs to ~/.local/bin
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
claude # sign in, then /exit

Then every time you sit down to work:

srun -p general -c 4 --mem=16G -t 2:00:00 --pty bash # get a compute node
claude # work here

And when you need a GPU instead ([Assignment 4](../assignments/index.html#assignment-4) onward):

srun -p gpu-cs2680 --gres=gpu:rtxproserver6000:1 -c 8 --mem=60G -t 2:00:00 --pty bash

`exit` ends the job and releases the node. That is the whole workflow; the rest of this page is what to do when it does not go like that.

---

# How Slurm works

There are three machines in this story. **Your laptop**, where you type. The
**login node**, which is what you reach when you open an OnDemand terminal or SSH in, one small shared machine that everyone in the course lands on at once. And the **compute nodes**, which are the actual hardware: many CPUs, lots of memory, and in one partition, a GPU.

You are not allowed to just run things on a compute node. **Slurm**, the scheduler, owns them, and you ask it for a lease: *give me 4 CPUs and 16 GB for 2 hours*. When hardware is free it hands you a node and starts your shell on it. That lease is a **job**, and everything you run inside it is charged against it. When the time runs out, or you type `exit`, the lease ends.

**Do not run an agent on the login node.** The login node is capped at
**15 minutes of CPU time** and roughly **2 GB of memory**. An agent session will be killed there, usually in the middle of something, and often without a clear message. The login node is for submitting jobs, editing files, and moving data. Everything with real work in it belongs in a job.

The one thing that makes this pleasant is that **`/home` is shared**. The login node and every compute node see the same home directory, so anything you installed once is already there when a job starts — `claude` in `~/.local/bin`. Nothing to re-install per job, nothing to copy onto the node, and the login you did in week one still applies, because the credentials Claude Code writes live in your home directory too.

There are two types of job. An **interactive** job (`srun --pty`) gives you a shell and you work in it, which is what an agent session is. A **batch** job (`sbatch`) runs a script without you and writes its output to a file, which is what you want for [an overnight sweep](#batch).

---

# First-time setup

Seven steps, once. Do them on the login node, because they are all small and installing software is exactly what the login node is for.

1. **Get an account, and get into the CS2680 group.** Access instructions are TBD and will be announced; the group membership is what lets you submit to the [`gpu-cs2680` partition](#gpu).
2. **Open a terminal.** In the OnDemand portal, the shell is under the *Clusters* menu; it opens a terminal on the login node in a browser tab. Plain SSH to the login host works the same way and is nicer if you already live in a terminal — [the SSH config below](#ssh-config) reduces it to `ssh cs2680`.
3. **Register your SSH key.** There is no upload form for this, so you install
   the key yourself through the OnDemand terminal you just opened, which is the one way onto the cluster that
   does not need a key already. On your laptop, generate a key if you do not have one, then print the public
   half:

   ssh-keygen -t ed25519 -f ~/.ssh/id\_ed25519 # skip if that file already exists
   cat ~/.ssh/id\_ed25519.pub

   Copy the single line that prints. Note that the file to copy is `id_ed25519.pub`; the one
   without `.pub` is the private key, and it never leaves your laptop. Back in the OnDemand
   terminal, append that line to `~/.ssh/authorized_keys`:

   mkdir -p ~/.ssh && chmod 700 ~/.ssh
   echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... you@laptop' >> ~/.ssh/authorized\_keys
   chmod 600 ~/.ssh/authorized\_keys

   Paste your own key between the quotes, in place of the example, and keep it on one line. Pasting into the
   browser terminal is `Ctrl+Shift+V` rather than `Ctrl+V` on Linux and Windows, and
   `Cmd+V` on a Mac. The two `chmod` lines are not optional: sshd ignores a key file
   that the group or the world can write, which is the usual reason a newly added key is refused without
   explanation. While you are in that terminal, run `whoami` and write the username down, because
   [the SSH config below](#ssh-config) needs it. Then check the key from your laptop:

   ssh YOUR\_USERNAME@academ-acade-iL73aitWT6xF-c83014867702e61e.elb.us-east-1.amazonaws.com

   A shell prompt on the login node means the key is registered. If you are asked for a password instead, or
   told `Permission denied (publickey)`, re-open the OnDemand terminal and compare
   `cat ~/.ssh/authorized_keys` against `cat ~/.ssh/id_ed25519.pub` on your laptop,
   character for character. A key broken across two lines by the paste is the most common failure.
4. **Install Claude Code into your home directory:**

   curl -fsSL https://claude.ai/install.sh | bash

   This is the native installer, it puts the binary in `~/.local/bin`, and it keeps itself updated. Because `/home` is shared, you are also installing it on every compute node at the same time.
5. **Put it on your `PATH`:**

   echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   claude --version
6. **Log in.** Run `claude` and follow the prompts. In a browser-based terminal or
   over SSH you will get a *code* to paste back rather than a browser that returns to the terminal.
   That is expected, and the [Claude Code page](claude-code.html#login) walks through it.
   Confirm with `/status`, then `/exit`.
7. **Add the course telemetry block** to `~/.claude/settings.json` on this machine,
   per the [Claude Code page](claude-code.html#telemetry). That file is per-machine, and your HPC home is a different machine from your laptop as far as it is concerned.

**Sessions you run here are sessions you submit.** Claude Code keeps its transcripts under
`~/.claude/projects/` on whichever machine ran it, so the HPC has its own set. When you
[archive your session files](claude-code.html#export), include the HPC's.

---

# Interactive jobs: the everyday workflow

From an OnDemand terminal (or over SSH):

srun -p general -c 4 --mem=16G -t 2:00:00 --pty bash

Wait for the node to come up. The first job of the day can take a few minutes, because idle nodes are powered down. `sinfo` shows them as `idle~`, and Slurm has to boot one before your shell appears. Nothing is wrong; you can type `squeue -u $USER` in another terminal to see the job pending reason.

When the prompt comes back you are on the compute node. Then:

claude

That is the whole student workflow: **allocate a shell on a compute node, run the agent there.**
Work normally, and `exit` when you are done, which ends the job and returns the node.

## What the flags mean

| Flag | What it does | How to choose it |
| --- | --- | --- |
| `-p general` | Partition — which pool of nodes to run on. | `general` for anything that is not GPU work. See [GPUs](#gpu) for the other one. |
| `-c 4` | CPU cores. | 4 is plenty for an agent. More cores means a longer wait for a node with that many free. |
| `--mem=16G` | Memory for the whole job. Exceed it and the job is killed. | 16 GB is comfortable for agent work. Raise it if you are loading data or model weights. |
| `-t 2:00:00` | Wall-clock limit, `HH:MM:SS`. At the limit the job ends, mid-command if need be. | Ask for a working session, not a week. Check the partition's ceiling with `sinfo -p general -o "%P %l"`. |
| `--pty bash` | Attaches a terminal and runs a shell in it — this is what makes the job interactive. | Always, for this workflow. Swap `bash` for `tmux new -s agent` to make it [survive a closed tab](#tmux). |

---

# GPUs (Assignment 4, 5 and project)

The course has its own GPU partition:

srun -p gpu-cs2680 --gres=gpu:rtxproserver6000:1 -c 8 --mem=60G -t 2:00:00 --pty bash

Each node in it holds **one RTX PRO 6000 Blackwell**.

**Use `gpu-cs2680` and nothing else.** The cluster carries other GPU
partitions, and because only `gpu-cs2680` is group-restricted, some of them will accept a
job from you. However, using one for course work requires pre-approval from a TF. Ask first, and use
`gpu-cs2680` in the meantime.

Check the GPU is really yours, first thing inside the job:

nvidia-smi && echo $CUDA\_VISIBLE\_DEVICES

`nvidia-smi` should list one card with almost no memory in use, and
`CUDA_VISIBLE_DEVICES` should name the one device Slurm gave you. If `nvidia-smi`
reports no devices, you are not using the correct partition.

## Serving a model here (Assignments 4 and 5)

Two things will bite you, and both are about disk rather than the GPU.

* **Model weights are large and your home directory is not.** A 7–8B model in bf16 is
  roughly 15 GB, and Hugging Face downloads into `~/.cache/huggingface` by default, so the
  third model you try is where the quota error appears. Point the cache somewhere with room before you
  start (`export HF_HOME=/path/with/space/$USER/hf` in your `~/.bashrc`), and delete
  the models you were only curious about. The scratch filesystem to use for this is still to be announced.
* **Install the engine into an environment, not the system.** A virtualenv or a conda
  environment under your home works on every node, for the same shared-`/home` reason. Create
  it once, activate it in the job.

Ask for more of the node when you are serving rather than chatting. The `-c 8 --mem=60G` above
leaves the weights room to load, and a whole-node request only starts when a whole node is free. Kill the
server when you stop measuring: an engine holding the card in a job you have wandered away from is
invisible to you and obvious to everyone waiting.

**A GPU you are not using is a GPU nobody is using.** There is one card per node and a whole
class sharing them, so bound the job with `-t`, and `exit` when you stop working rather
than holding a four-hour allocation to read a paper. This bites hardest in the last week of the semester, which is
exactly when you will want a node at short notice.

---

# One command from your laptop: `ssh cs2680`

Once the workflow above is familiar, you can collapse it into a single command. SSH will run `srun` for you on connect, so `ssh cs2680` takes you from your laptop to a shell on a compute node with nothing typed in between. Put this in `~/.ssh/config` on your own machine (`C:\Users\you\.ssh\config` on Windows), with **your** username and key path:

Host cs2680 cs2680-cpu cs2680-gpu
Hostname academ-acade-iL73aitWT6xF-c83014867702e61e.elb.us-east-1.amazonaws.com
User YOUR\_USERNAME
IdentityFile ~/.ssh/YOUR\_KEY
ForwardAgent yes
ServerAliveInterval 30
ServerAliveCountMax 20
IdentitiesOnly yes
UserKnownHostsFile=/dev/null
StrictHostKeyChecking no
Host cs2680-cpu
ProxyCommand ssh -q cs2680 exec /shared/courseSharedFolders/176914outer/176914/cpu-tunnel.sh cpu
Host cs2680-gpu
ProxyCommand ssh -q cs2680 exec /shared/courseSharedFolders/176914outer/176914/cpu-tunnel.sh gpu

That gives you three names for the same machine:

* `ssh cs2680`. A plain shell on the **login node**. This is where you install things, move files, and check the queue.
* `ssh cs2680-cpu`. A **CPU compute node**: 4 cores, 16 GB, 2 hours. Agent work goes here.
* `ssh cs2680-gpu`. A **GPU compute node**: the same, plus one RTX PRO 6000 Blackwell.

All three names authenticate with the key you installed in
[step 3 of first-time setup](#ssh-key). If you skipped that step, do it now, because none of these
aliases will connect until the public key is in `~/.ssh/authorized_keys` on the cluster.
VS Code’s Remote-SSH accepts the same three names and behaves the same way a terminal does. Remember to
`scancel JOB_ID` once you are finished with a job, because otherwise it holds its node for the
whole allocation.

**Why host-key checking is off here.** The login address is a load balancer, so the host key you
reach can differ between connections and a pinned key would fail for reasons that have nothing to do with
your account. The two lines that disable the check are a deliberate trade for that, and they are scoped to
these three aliases: do not copy them into the rest of your `~/.ssh/config`, where they would
switch off the protection everywhere.

---

# Surviving a closed tab: wrap it in tmux

Recommended for this class. An `srun --pty` shell belongs to the terminal that started it, so a
closed browser tab, a laptop lid, or hotel wifi takes your agent with it, mid-edit, and the job dies
too. Start the job inside `tmux` instead:

srun -p general -c 4 --mem=16G -t 2:00:00 --pty tmux new -s agent
# inside tmux:
claude

Now the agent is a process inside a tmux session *on the compute node*, and losing your terminal only detaches it. To get back:

squeue -u $USER # find the node your job is on
srun --jobid=<jobid> --overlap --pty bash
tmux attach -t agent # if you are already on that node

Three things to keep straight:

* **Tmux session lives on one specific node.** You have to be on that node to attach, which is what `squeue -u $USER` tells you.
* **tmux does not extend the allocation.** When the walltime in `-t` runs out, Slurm ends the job and the tmux session with it. Nothing survives the lease.
* **Detach on purpose with `Ctrl-b d`.** That leaves everything running. `Ctrl-b c` opens another window in the same session, which is how you watch a log while the agent works. Those three bindings cover this workflow; any tmux cheat sheet covers the rest.

---

# Long and unattended runs

Interactive jobs are for working. For an evaluation sweep (the same agent over fifty tasks, the kind
of thing [Assignment 3](../to_release.html) onward asks for), you do not want to be present at
all. Write a script:

#!/bin/bash
#SBATCH -p general
#SBATCH -c 4
#SBATCH --mem=16G
#SBATCH -t 2:00:00
#SBATCH -J agent-eval
#SBATCH -o logs/eval-%j.out
cd "$HOME/cs2680/a3"
python run\_eval.py --tasks tasks.jsonl --out results/

Submit it with `sbatch run_eval.sh`, which prints a job id and returns immediately.
`squeue -u $USER` tracks it, `%j` in the output path expands to the job id so
concurrent runs do not overwrite each other, and everything the script prints lands in that file. Create the
`logs/` directory first, in the directory you run `sbatch` from rather than the one the
script `cd`s to, because Slurm resolves `-o` against the submit directory and opens the
file before the script runs. Slurm will not create it for you, and a job whose output file cannot be opened
fails instantly for a reason that is hard to see.

---

# Getting your code and data there

* **Use git for code.** Clone on the login node, commit and push from wherever you worked.
* **Use `rsync` for everything else.** From your laptop:

  rsync -avz ./data/ cs2680:~/cs2680/data/ # up
  rsync -avz cs2680:~/cs2680/results/ ./results/ # down
* **OnDemand has a file browser** for the one-off case (dragging a CSV in, pulling a plot out), without a terminal at all.
* **Keep results out of the node's local disk.** Write into your home directory or a shared filesystem. Anything a job leaves in `/tmp` on a compute node will not be available.

---

# Sharing the HPC

The cluster is small enough that one person’s habits are visible to everyone else, so please be mindful of
the rules below. We may cancel a job that is holding far more than its share, particularly in the days before a
deadline, so that everyone keeps access to at least one server.

* **Ask for what you need.** The course pays for the hardware at roughly $3.20 per GPU-hour, so
  an over-sized request costs money rather than merely lengthening a queue.
* **Use the resources responsibly.** There is no per-student limit, and you may hold several
  GPUs when nobody else wants them. However, 50 GPU nodes divided across the enrolled class comes to fewer
  than two each, so treat that as the share you are borrowing against.
* **Bound every job with `-t`**, and prefer a batch job over an interactive one you will not be watching.
* **`exit` when you stop working.** An idle allocation is invisible to you and expensive for everyone else, and the queue is longest in the week you most need it.
* **Nothing heavy on the login node.** It is shared by everyone at once, and the caps are there because someone always tries.

---

# Command reference

| Command | What it tells you |
| --- | --- |
| `squeue -u $USER` | Your jobs: id, partition, state (`PD` pending, `R` running), time used, and the node. The reason column explains a pending job. |
| `sinfo -p general` | Node states in a partition. `idle` free, `idle~` free but powered down, `alloc` taken, `mix` partly taken, `down`/`drain` unavailable. |
| `sinfo -p gpu-cs2680 -o "%P %l %D %c %m %G"` | What you are allowed to ask for: time limit, node count, cores, memory, GPUs. Run this before inventing flags. |
| `scancel <jobid>` | Ends a job. `scancel -u $USER` ends all of yours — useful after a lost terminal. |
| `sacct -j <jobid> --format=JobID,State,Elapsed,MaxRSS,ReqMem,ExitCode` | The post-mortem for a finished job. `TIMEOUT` means it hit `-t`; `OUT_OF_MEMORY`, or a `MaxRSS` at your `ReqMem`, means `--mem`. |
| `scontrol show job <jobid>` | Everything Slurm knows about a job that is still queued or running, including why it is waiting. |
| `hostname` | Whether you are on the login node or a compute node. Worth checking when something gets killed. |
| `nvidia-smi` | Inside a GPU job: the card, its memory, and what is using it. |

---

# Troubleshooting

| Symptom | What it is, and what to do |
| --- | --- |
| `Permission denied (publickey)`, or SSH asks for a password. | Your public key is not in `~/.ssh/authorized_keys` on the cluster, or the permissions on it are too loose. Get in through the [OnDemand portal](https://ood.huit.harvard.edu), which does not need a key, and redo [step 3 of first-time setup](#ssh-key). |
| Nothing happens for minutes after `srun`. | Normal for the first job — a powered-down node is booting. `squeue -u $USER` from another terminal shows it pending with a reason. |
| The job never starts. | You asked for more than a node has, or the partition is full. Compare your flags against `sinfo -p <partition> -o "%P %l %D %c %m %G"` and bring `-c`, `--mem`, `-t` and `--gres` inside it. |
| Your session was killed with no message. | Almost always the login node's 15-minute CPU cap — check `hostname`. Otherwise the job hit its `-t` walltime or its `--mem`; `sacct -j <jobid>` distinguishes them. |
| `claude: command not found` inside a job. | `PATH` is set in `~/.bash_profile`, which a non-login job shell never reads. Move the `export PATH` line into `~/.bashrc`, or run it as `~/.local/bin/claude`. |
| Claude Code asks you to log in again on the HPC. | Expected the first time: the credentials live in your home directory, not your laptop. Over SSH or a browser terminal you get a code to paste back rather than a browser redirect. See [logging in](claude-code.html#login). |
| Invalid partition, or an account/association error. | You are not in the CS2680 group yet, or you typed the partition name wrong. Only `gpu-cs2680` is group-restricted, and it is [the only GPU partition to use](#gpu) without pre-approval from a TF. |
| `nvidia-smi` reports no devices in a GPU job. | You are on the login node, or the job was allocated without `--gres`. Check `hostname` and re-submit with the `--gres` flag exactly as written [above](#gpu). |
| A VS Code Remote-SSH window dies, reconnects, and dies again. | You connected to `cs2680`, so VS Code installed its server on the login node, where it hits the 15-minute CPU cap, usually because a language server is indexing. Connect to `cs2680-cpu` instead, which puts the editor server inside a job. See [the SSH config](#ssh-config). |
| `cs2680-cpu` or `cs2680-gpu` will not connect, or hangs. | Test the two halves separately. `ssh cs2680` proves the login hop and your key; then `ssh cs2680 exec /shared/courseSharedFolders/176914outer/176914/cpu-tunnel.sh cpu` shows you what the tunnel script says, which a `ProxyCommand` otherwise swallows. A wait of a few minutes is normal when a node has to boot. |
| You have three jobs and you only wanted one. | Every `ssh cs2680-cpu` allocates a fresh job, and a reconnect does not reuse the old one. `squeue -u $USER`, then `scancel` the strays; use `srun --jobid=<jobid> --overlap --pty bash` from the login node to re-enter one that is still alive. |
| A job you forgot about is still running. | `squeue -u $USER` to find it, `scancel <jobid>` to release it. Do this before asking why nothing will start. |
| Out of disk, or a quota error while downloading a model. | Your home directory filled up, usually with `~/.cache/huggingface`. See [serving a model here](#gpu). |
| Something else. | Bring the exact command, the job id, and the error text to office hours or the course forum. A job id is enough for anyone to look up what actually happened. |

---
