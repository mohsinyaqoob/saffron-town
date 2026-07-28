# Deploying Saffron Town to the DigitalOcean droplet

This is the **production** path for the shared droplet that also runs Imdaad.
Images are built in CI and only **pulled** on the box — nothing is built on the
droplet (1 GB RAM, no swap; an on-box Next.js build would OOM and could take
Imdaad down).

> For a standalone / local full-stack Docker run that builds locally, see
> `DEPLOY-DOCKER.md` + `docker-compose.yml`. The droplet uses
> `docker-compose.prod.yml` instead.

## How it fits the droplet
- Lives in **`/opt/saffron-town`** (sibling to `/opt/imdaad`).
- Joins the existing shared **`web`** Docker network so the running **Traefik**
  proxy routes to it and issues TLS automatically — same pattern as Imdaad.
  Nothing about Imdaad or the proxy changes.
- Its Postgres is on a private `internal` network, never exposed, so it can't
  clash with Imdaad's Postgres.
- Serves **https://beta.saffron.town** (Traefik `Host` label + Let's Encrypt).

## One-time setup

1. **DNS** — point `beta.saffron.town` (A record) at the droplet IP
   `142.93.121.109`. Traefik gets the cert automatically on first request.

2. **CI variables** (GitHub repo → Settings → Variables) — these are the
   non-secret, publishable `NEXT_PUBLIC_*` values inlined into the client
   bundle at build time:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID
   NEXT_PUBLIC_SANITY_DATASET
   NEXT_PUBLIC_SANITY_API_VERSION
   NEXT_PUBLIC_RAZORPAY_KEY_ID
   NEXT_PUBLIC_GA_MEASUREMENT_ID
   NEXT_PUBLIC_GOOGLE_ADS_ID
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
   ```
   Push to `main` (or run the **build-and-push** workflow) to publish the images
   to GHCR.

3. **On the droplet:**
   ```bash
   cd /opt
   git clone <repo> saffron-town && cd saffron-town
   cp .env.docker.example .env
   nano .env                       # real secrets; DATABASE_URL host is `db`
   # Log in to GHCR once (needs a PAT with read:packages if the package is private):
   echo "$GHCR_PAT" | docker login ghcr.io -u mohsinyaqoob --password-stdin
   GITHUB_OWNER=mohsinyaqoob IMAGE_TAG=latest \
     docker compose -f docker-compose.prod.yml pull
   GITHUB_OWNER=mohsinyaqoob IMAGE_TAG=latest \
     docker compose -f docker-compose.prod.yml up -d
   docker compose -f docker-compose.prod.yml logs -f web
   ```

## Deploying an update
CI builds + pushes on every push to `main`. Then on the droplet:
```bash
cd /opt/saffron-town && git pull
GITHUB_OWNER=mohsinyaqoob IMAGE_TAG=<sha-or-latest> \
  docker compose -f docker-compose.prod.yml pull
GITHUB_OWNER=mohsinyaqoob IMAGE_TAG=<sha-or-latest> \
  docker compose -f docker-compose.prod.yml up -d
```
`migrate` runs `prisma migrate deploy` and exits before `web` (re)starts.
Pin `IMAGE_TAG` to a commit SHA for reproducible/rollback-able deploys.

## Memory note (important on this 1 GB box)
Even at runtime, a second Next.js server (~100–150 MB) + Postgres (~60 MB) is
tight alongside Imdaad. Strongly consider a swapfile as a safety net:
```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
Or resize the droplet to 2 GB to remove the constraint entirely.

## Common commands
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f web
docker compose -f docker-compose.prod.yml exec db psql -U saffron   # DB shell
docker compose -f docker-compose.prod.yml run --rm migrate           # re-run migrations
```

## Cron (serviceability sweep — replaces the Vercel cron)
Add to the droplet crontab (uses the container, no host port needed):
```
0 3 * * * docker exec saffron-town-web-1 wget -qO- --header="Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/serviceability >/dev/null 2>&1
```
(Use the same `CRON_SECRET` as in `.env`.)
