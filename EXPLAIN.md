# EXPLAIN.md

## What I built

Three web apps — Node.js/Express, Python/Flask, and Elixir/Phoenix — each deployed to Fly.io and displaying information about the Fly Machine serving the request.

Each app exposes a single route (`/`) that renders an HTML page with the machine's ID, name, image, creation timestamp, region, private IP, and state.

## How I got the machine data

**Environment variables** — Fly injects several variables at runtime that I used directly: `FLY_MACHINE_ID` for the machine ID, `FLY_REGION` for the region, `FLY_APP_NAME` for the app name, and `FLY_IMAGE_REF` as a fallback for the image. The machine name is read from the system hostname, which Fly sets to the machine ID. The private IP is read from the network interfaces at runtime.

**Fly Machines API** — For `created_at`, `state`, and `image` (as the primary source), each app queries the internal Fly Machines API from within the machine itself:

http://_api.internal:4280/v1/apps/{app_name}/machines/{machine_id}

This endpoint is only reachable from inside the Fly private network. It requires a deploy token passed via the `FLY_API_TOKEN` secret. Because the app queries its own metadata using its own `FLY_MACHINE_ID`, the data is guaranteed to belong to the machine serving the request.

## Stack-specific notes

**Node.js**: Used the native `fetch` API introduced in Node 18 with Express 5. No additional HTTP client needed.

**Python**: Used the `requests` library with Flask and `gunicorn` as the production server. The `netifaces` package failed to compile on Python 3.13 Alpine due to a gcc incompatibility, so I replaced it with `psutil` to read network interfaces.

**Elixir/Phoenix**: The most involved of the three, having no prior Elixir experience.Erlang's `:httpc` module failed to resolve `_api.internal` because it doesn't use IPv6 by default. I worked around this by using `:inet_res` to resolve the hostname to its IPv6 address tuple, then opening a raw TCP connection with `:gen_tcp` using the `:inet6` option and sending an HTTP/1.0 request manually. I also found that the token scope matters — a deploy token scoped to the app is required; a generic token returns a 401 with a missing discharge token error.

## Secrets

Each app has `FLY_API_TOKEN` set via `fly secrets set`. No tokens are committed to the repository.