---
title: AWS
source: https://cs2680.seas.harvard.edu/computing/aws.html
fetched: 2026-10-19T16:28:00+00:00
source_kind: harvard-cs2680-official
---

# AWS
CS2680 Modern AI Systems — AWS

CS2680 Modern AI Systems: Agents and System Optimizations

AWS: if you deploy something

# AWS

**Every student registers an AWS account in week one.** The form closes at the end of the first week because accounts are approved in one batch, so a late registration cannot be processed. What you do with the account afterwards is up to you. No assignment forces you onto AWS, and this page is here for when you want a machine that is not your laptop: most often because the web UI you built in Assignment 1 is something you would rather have running somewhere real, or because you want a box that stays up between sessions. A small EC2 instance is the expected path.

**The bill is yours.** AWS charges the card on the account you registered, and the course does not reimburse an overrun. An instance you forgot to stop keeps billing every hour it is up, and the disk behind it, along with any Elastic IP you allocated, keeps billing even after you stop it. Read [what it costs](#cost) before you launch anything, and set a [budget alarm](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html) first.

# Register your account, then upload your account ID

Both steps are due in **week one**. We are not able to process requests after the deadline.

1. **Create an AWS account** at [aws.amazon.com](https://aws.amazon.com/) if you do not already have one. New accounts start on the AWS free plan, which grants an expiring credit balance rather than the twelve months of free instance-hours older accounts received, and `t3.small` is not free once those credits are gone. Read [what it costs](#cost) before you launch anything.
2. **Provide your name, email, and AWS account ID to the [Google form](https://forms.gle/CVPgwhgeZB8JnjF56)**.

Your account ID is the twelve-digit number in the console's account menu, or:

aws sts get-caller-identity --query Account --output text

# What it costs, and what a forgotten instance costs

Every rate below is the on-demand Linux price in `us-east-1`, taken from the [EC2](https://aws.amazon.com/ec2/pricing/on-demand/), [EBS](https://aws.amazon.com/ebs/pricing/), and [VPC](https://aws.amazon.com/vpc/pricing/) price lists on Aug 27, 2026. Other regions cost more. AWS changes these, so treat them as the order of magnitude rather than as a quote, and read your own bill in the [Cost Explorer](https://console.aws.amazon.com/costmanagement/).

| What is billed | Rate | What that comes to |
| --- | --- | --- |
| `t3.small`, 2 vCPU and 2 GiB, while running. The size a small web UI wants. | $0.0208 per hour | $3.49 for one week you forgot it (168 hours), $15.18 for a 730-hour month. |
| `g7e.2xlarge`, one GPU with 96 GB, while running. The size a served model wants. | $3.3631 per hour | $211.88 for one weekend you forgot it (Friday 6pm to Monday 9am, 63 hours), $2,455.06 for a 730-hour month. |
| A 30 GB gp3 root volume, running *or stopped*. | $0.08 per GB-month | $2.40 a month, and it does not stop when the instance does. |
| One public IPv4 address, attached to a running instance *or idle*. | $0.005 per hour | $3.65 a month per address, whether anything is using it or not. |
| Data out to the internet, past the 100 GB a month that is free across your whole account. | $0.09 per GB, for the first 10 TB a month | $16.20 to serve a 14 GB checkpoint 20 times (280 GB sent, 180 GB billable), $83.16 to send 1 TB in a month (924 GB billable). |

**Stop the instance when you are not using it.** Nothing on AWS turns itself off. A `g7e.2xlarge` left up over one weekend costs $211.88 and produces nothing, and the same instance left up for a month costs $2,455.06, which is more than the whole rest of this course will bill you several times over. Stopping is the everyday action: it ends the instance-hour charge and preserves the disk, so you pick up where you left off.

aws ec2 stop-instances --instance-ids i-0123456789abcdef0

Before you close the laptop, check that nothing is still up. This lists every running instance in the current region, and it should print nothing:

aws ec2 describe-instances --filters Name=instance-state-name,Values=running --query "Reservations[].Instances[].InstanceId" --output text

**Stopped is not free, and stopped is not terminated.** A stopped instance keeps its EBS volume and any Elastic IP you allocated, and both bill by the hour with nothing running. A stopped `t3.small` with a 30 GB root volume and one address therefore costs about $6.05 a month to do nothing: $2.40 for the volume plus $3.65 for the address. That is the right trade while you are still working on something. When the project is over, terminate the instance, delete the volume, and release the address, which takes the charge to zero. Deleting a volume destroys what is on it, so copy your work off first.

**Egress is the charge people do not see coming.** Bytes into AWS are free and bytes out are not. Your account gets the first 100 GB a month out to the internet at no charge, aggregated across every AWS service and region rather than per instance, and everything past that is $0.09 per GB. A web UI serving pages will never reach it. Moving model weights or datasets will: a 14 GB checkpoint pulled down 20 times is 280 GB, which is 180 GB over the allowance and $16.20. The same trap runs in the background, so watch three things in particular. First, a log or metrics shipper streaming out of the region. Second, an S3 bucket you made public and then linked somewhere. Third, an agent loop that re-downloads the same artifact on every iteration, which turns one careless `curl` into a bill that scales with your retry count. Pull large files down to the instance once and keep them on its disk.

**Set a budget alarm before you launch anything, not after.** A [zero-spend or low-dollar budget](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html) emails you when the account crosses a threshold you pick. It does not stop the charge, so it is a smoke detector rather than a sprinkler, but it is the difference between noticing on day two and noticing on the statement. Set it in week one, at a number small enough to be annoying.

# Related

* [Computing setup](index.html). The other environments this course uses.
* [Assignment 1](../to_release.html). The web UI this account can host.
* [Claude Code](claude-code.html). Account, install, login, session files.
* [EC2 getting-started guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html) and
  [creating a budget alarm](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html). The authoritative versions.
