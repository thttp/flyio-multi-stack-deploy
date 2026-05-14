# Fly.io Multi-Stack Deploy

A hands-on project where I built and deployed the same app three times — in Node.js,
Python, and Elixir/Phoenix — each running on Fly.io and displaying live information
about the machine serving the request.

## What each app does

Each app exposes a single route (`/`) that displays live information about the Fly Machine
serving the request:

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

## Live deploys

| Framework | App name         | URL                                    |
|-----------|------------------|----------------------------------------|
| Phoenix   | `179301-phoenix` | https://179301-phoenix.fly.dev         |
| Node      | `179301-node`    | https://179301-node.fly.dev            |
| Python    | `179301-python`  | https://179301-python.fly.dev          |

## How I built it

### Node.js

I started with the Node.js app since it was the stack I was most comfortable with.
My first decision was to use the native `fetch` API instead of libraries like Axios —
the project didn't need anything beyond a simple GET request, and avoiding unnecessary
dependencies keeps the image lean and the code straightforward.

For the machine data, most fields like `FLY_MACHINE_ID` and `FLY_REGION` are injected
directly by Fly as environment variables. For `created_at`, `state`, and `image`, I
needed to go further. Reading through the Fly docs on private networking and looking at
logs from inside the machine, I found the internal Machines API endpoint:

http://_api.internal:4280/v1/apps/{app_name}/machines/{machine_id}

This endpoint is only reachable from within the Fly private network, which means the
data is guaranteed to come from the machine actually serving the request. The app
queries its own metadata using its own `FLY_MACHINE_ID` — nothing hardcoded.

### Python

I chose Flask over FastAPI because of simplicity. The app has a single route with no
async requirements or complex validation, so FastAPI's strengths wouldn't add value here.
Flask gets the job done cleanly.

The logic mirrors the Node.js app: env vars for most fields, internal Machines API for
the rest, and network interfaces for the private IP. I initially used `netifaces` to
read the interfaces, but it failed to compile on Python 3.13/Alpine due to a gcc
incompatibility. I replaced it with `psutil`, which is better maintained and worked
without issues. I used `gunicorn` as the production server instead of Flask's built-in
dev server.

### Elixir/Phoenix

This was the most challenging part — I had no prior Elixir experience. I worked through
the Phoenix docs, generated a minimal app (no Ecto, no assets, no mailer), and
replicated the same logic from the other two apps.

The first issue was a naming conflict: I created the project with the name `phoenix`,
which clashed with the Phoenix dependency itself. I recreated it with the name `fly_info`
and moved it to the `phoenix/` directory.

The bigger challenge was the internal API call. Erlang's `:httpc` module doesn't use
IPv6 by default and couldn't resolve `_api.internal`. I debugged this from inside the
machine and found that `:inet_res` could resolve the hostname to an IPv6 address tuple.
From there, I made a raw HTTP/1.0 request using `:gen_tcp` with the `:inet6` option,
parsed the response manually, and decoded the JSON body with `Jason`.

I also ran into a token scope issue — a generic Fly token returns 401 with a
"missing discharge token" error. The fix was to generate a deploy token scoped
specifically to the app with `fly tokens create deploy`.

## Stack

- **Node.js** — Express 5, Node 22 Alpine
- **Python** — Flask, gunicorn, psutil, Python 3.13 Alpine
- **Elixir** — Phoenix 1.8, Elixir 1.18, Erlang 27

## Prior experience

Before this project I already had experience with Docker and networking, which helped
a lot with understanding how Fly's private network works, how the internal DNS resolves,
and how to debug connectivity issues from inside a running container.

## Reference

- [Fly.io Docs](https://fly.io/docs/)
- [Fly.io Machines API](https://fly.io/docs/machines/api/working-with-machines-api/)