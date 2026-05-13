[![Apps Deployed](https://github.com/fly-hiring/[REPO_NAME]/actions/workflows/validate.yaml/badge.svg)](https://github.com/fly-hiring/[REPO_NAME]/actions/workflows/validate.yaml)

# Support Engineer Technical Challenge

The first part of the hiring process is a technical challenge.

We want you to build and deploy three small web apps to [Fly.io](https://fly.io) — one each using:

- [Elixir / Phoenix](https://www.phoenixframework.org/)
- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)

Each app should display information about the Fly Machine it's running on. The data should be fetched from within the app. **The solution must be unambiguous and clearly prove that the data displayed belongs to the underlying Machine serving the request.**

Your home page must include the following HTML structure:

```html
<dl>
  <dt>Machine ID</dt>
  <dd><!-- machine id --></dd>

  <dt>Machine Name</dt>
  <dd><!-- machine name --></dd>

  <dt>Image</dt>
  <dd><!-- docker image --></dd>

  <dt>Created At</dt>
  <dd><!-- creation timestamp --></dd>

  <dt>Region</dt>
  <dd><!-- region code --></dd>

  <dt>Private IP</dt>
  <dd><!-- private ip --></dd>

  <dt>State</dt>
  <dd><!-- machine state --></dd>
</dl>
```

You're starting from scratch. Build each app however you see fit, deploy all three, and write up what you did.

It's okay if you haven't used one or more of these frameworks before. Our customers work across all kinds of stacks and a big part of this job is figuring things out on the fly.

## Requirements and constraints

- **Time:** We're not timing you (but this should take a couple of hours, not days).
- **Help and questions:** We can't offer much help or answer many questions.
- Include an `EXPLAIN.md` to the root of this repo describing what you built, how you got the machine data, and anything else you think is relevant. This should be in your words, not an LLM's.
- We expect most of you to use coding agents to solve this. If you do, please record your prompts in `LLM_PROMPTS.md`.

## What we care about

We're looking for:

- The ability to reason about a problem and work through it
- Comfort navigating docs and figuring things out independently
- Clear writing that other developers would understand
- Enough technical skill to get the job done

Don't worry about:

- Making anything pretty
- Writing tests
- Perfect code or git history

## Submitting your work

> [!IMPORTANT]
> **Don't commit any sensitive secrets (like API tokens) to git!**

We'll invite you to a private GitHub repo based on this template.

Do all of your work in the `main` branch. Don't bother with PRs or tidy commits — we have software to help us review. Just don't force push over the initial commit or we can't generate a diff of your work.

Deploy your three apps to Fly.io with the following names:

| Framework | App name | URL |
|-----------|----------|-----|
| Phoenix   | `[REPO_NAME]-phoenix` | `https://[REPO_NAME]-phoenix.fly.dev` |
| Node      | `[REPO_NAME]-node`    | `https://[REPO_NAME]-node.fly.dev`    |
| Python    | `[REPO_NAME]-python`  | `https://[REPO_NAME]-python.fly.dev`  |


When you're ready, [create a new issue](https://github.com/fly-hiring/[REPO_NAME]/issues/new?template=submit.yaml) using the submission form. Then email us to let us know you're done.

We review submissions once a week. You'll hear back from us no matter what by the end of the following week, possibly sooner.

> [!IMPORTANT]
> Once you submit, we'll consider it final. You won't be able to make changes after that.

___________

## Reference material

[Fly.io Docs](https://fly.io/docs/)

[Fly.io Machines API Docs](https://fly.io/docs/machines/api/working-with-machines-api/)
