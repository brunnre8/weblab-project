# TODO app

## Run it

### Docker

There's a docker compose file in the repo root.
Tested with podman but I hope it works for docker as well.

```
podman compose up .
```

It will print the admin creds to stdout, when it starts the first time (and only then).

Note: the compose file is only meant as a showcase and not as a means of deployment.

### Manual

Run both frontend and backens with:

```
npm run start
```

## Design docs

Architecture, design docs and worklog file [are here](https://github.com/brunnre8/weblab-project/tree/main/design)
