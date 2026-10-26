---
title: CloudLab
source: https://cs2680.seas.harvard.edu/computing/cloudlab.html
fetched: 2026-10-19T16:28:00+00:00
source_kind: harvard-cs2680-official
---

# CloudLab
CS2680 Modern AI Systems — CloudLab

CS2680 Modern AI Systems: Agents and System Optimizations

CloudLab: a whole machine, when you need one

# CloudLab

[CloudLab](https://cloudlab.us) provides
**bare-metal machines** for research and teaching, free of charge, with full control over the
software stack. You get the physical node, root on it, and nobody else on it.

That makes it the right choice in two situations. First, when you need a machine that the public internet
can reach and that you hold root on, which is where the optional public deployment of
[Assignment 1](../assignments/assignment1.html)'s frontend goes (the course HPC's compute nodes
are not reachable from outside, and your laptop should not be). Second, when your [project](../project.html) needs to touch the kernel, the
network, or the storage layer, or needs reproducible isolation that a shared HPC cannot give you:
a latency measurement with no co-tenant, a scheduler you have to patch, a device you have to configure.
However, for compute alone it is the wrong choice: training on a GPU that the
[course HPC](cluster.html) would have handed you in one `srun` is slower to set up and
no better.

# Getting access

**Project name: TBD.** CloudLab organizes people into *projects*, and you want to
**join** the course project rather than start one of your own, because a new project needs a
faculty PI and an approval round. The course project name will be posted here.

Then, at [cloudlab.us](https://cloudlab.us):

1. Sign up with your Harvard email and request to join the course project.
2. Upload an **SSH public key**. CloudLab does not do passwords; the key you upload is the only
   way onto your nodes, and it is installed on every node you instantiate afterwards.
3. Wait for the join request to be approved. This is a person clicking a button, so it is not instant.

# How it works, in the four terms you need

* **Profile**. A reusable description of a topology: how many nodes, which hardware
  type, which disk image, what runs on boot. Start from an existing profile
  (`small-lan` and the Ubuntu single-node profiles cover most needs) and write your own once you
  know what you want. A profile is also how a result becomes reproducible: publishing yours lets a reader
  instantiate the same machines you measured on.
* **Experiment**. A running instance of a profile. You pick a cluster, it provisions
  real hardware, and a few minutes later you have SSH.
* **Cluster.** Utah, Wisconsin, Clemson, Massachusetts and others, each with different
  node types. Availability differs per cluster and per hardware type; the list shows what is free before you
  commit.
* **Expiration**. Experiments expire, by default in hours, and you extend them from
  the experiment page with a reason. Short extensions are approved automatically; longer ones require
  CloudLab staff.

**An expired experiment is wiped.** When the clock runs out the nodes are reclaimed and
reimaged, and whatever was on local disk is gone with them: measurements, logs, the one plot you had
not copied off yet. Push results to a repository or to your laptop as you go, and treat the node's disk as
scratch space.

Two more habits. **Extend before you need it**, because you cannot extend an experiment that
has already expired. And **terminate when you are done**: the hardware is genuinely scarce, it
is shared with researchers who are not in this course, and holding idle nodes is the one thing that gets a
project's access questioned.

# Related

* [Computing setup](index.html). The other environments this course uses.
* [HPC](cluster.html). The default for GPU and agent work.
* [Final project compute](../project.html#resources). Choosing between these for project
  work.
* [CloudLab documentation](https://docs.cloudlab.us/). The
  authoritative manual, including the profile language.
