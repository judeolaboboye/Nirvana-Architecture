# CURATED.md — Admin-Curated Learning Sources

> **Admin only.** This is how you (Jude) feed hand-picked wisdom into the brain without waiting
> for forks to discover it. Paste a lesson below with `<!-- PENDING -->` on its heading line.
> On the next evolution cycle the bot weaves every PENDING item into `EVOLUTIONS.md` (as trusted,
> priority input) and flips the tag to `<!-- ABSORBED -->` so it is never re-processed.
>
> Sources worth mining regularly: Andrej Karpathy (context engineering, "LLM OS", nanoGPT-style
> minimalism), Anthropic's agent-building guides, Simon Willison's blog, HumanLayer/12-factor-agents.

---

## Lesson: Big Blocks of Autonomy Beat Constant Steering <!-- PENDING -->
From Karpathy's agent observations: agents produce their best work when given a complete,
verifiable objective and room to loop (act → check → correct), not when interrupted every step.
Structure tasks as: clear definition of done + tools + a verification command the agent can run itself.

## Lesson: The 12-Factor Agent <!-- PENDING -->
From HumanLayer's 12-factor-agents: own your prompts in version control, own your context window
construction, make tools deterministic functions, compact errors into context instead of raw dumps,
and keep the agent stateless between steps so any step can be resumed or replayed.

## Lesson: Small Context, Strong Files <!-- PENDING -->
A session's intelligence is bounded by what it can reliably load. Keep the constitution file lean
and point to detail files (`references/`, skills) that are read on demand. Every 1,000 tokens of
boilerplate in the always-loaded file is 1,000 tokens of working memory lost on every single task.
