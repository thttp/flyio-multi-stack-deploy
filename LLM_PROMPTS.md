# LLM Prompts

I used Claude (claude.ai) as a coding assistant throughout this challenge.

## Node.js app

I built the Node.js app independently without LLM assistance.

## Python app

I built most of the Python app independently. I used Claude for a couple of specific
issues:

> netifaces fails to compile on Python 3.13/Alpine with a gcc error. [pasted build log]
> What's a drop-in replacement for reading network interfaces?

> Send me the complete updated app.py with psutil replacing netifaces.

## Phoenix app

> Generate a minimal Phoenix app (no ecto, no assets, no mailer, no dashboard) with
> a single route that fetches Fly Machine metadata from the internal Machines API and
> renders it as HTML. Same data as the Node.js app: machine ID, name, image,
> created_at, region, private IP, state.

> The app name "phoenix" conflicts with the Phoenix dependency. Recreate the project
> with a non-conflicting name and move it to the phoenix/ directory.

> _api.internal is not resolving via :httpc. Resolve the hostname using :inet_res and
> make the HTTP request using :gen_tcp with IPv6.

> fly tokens create deploy returns a token that gets 401 from the internal Machines API
> with "missing third-party discharge token". What is the correct way to generate a
> scoped deploy token for this app?