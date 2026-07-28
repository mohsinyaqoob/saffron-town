# Deploying Saffron Town with Docker (droplet)

Self-hosted setup: the Next.js app + its **own** Postgres, both in Docker.
Manual deploys via SSH + `git pull`. No CI/CD.

## Layout
- **db** — Postgres 16, data in the named volume `saffron_pgdata`. Not exposed
  to the host, so it never collides with Imdaad's Postgres.
- **migrate** — one-shot; runs `prisma migrate deploy`, then exits. `web` waits
  for it, so schema changes apply automatically on every deploy.
- **web** — the Next.js standalone server on port 3000 (host `WEB_PORT`).

## First-time setup (on the droplet)
```bash
git clone <repo> saffron-town && cd saffron-town
cp .env.docker.example .env
nano .env                      # fill in real secrets; DATABASE_URL host is `db`
docker compose up -d --build   # builds images, runs migrations, starts the app
docker compose logs -f web     # watch it boot
```
App is now on `http://<droplet-ip>:3000`. Put Nginx/Caddy (or Cloudflare) in
front for your domain + TLS.

## Deploying an update
```bash
cd saffron-town
git pull
docker compose up -d --build   # rebuilds, re-runs migrations, restarts web
```
`docker compose up -d` only recreates what changed. Migrations run before
`web` restarts.

## Common commands
```bash
docker compose ps                       # status
docker compose logs -f web              # app logs
docker compose exec db psql -U saffron  # DB shell
docker compose run --rm migrate         # re-run migrations manually
docker compose down                     # stop (keeps the DB volume)
```

## Database backups (do this — you own the data now)
```bash
# Backup
docker compose exec -T db pg_dump -U saffron saffron | gzip > backup-$(date +%F).sql.gz
# Restore
gunzip -c backup-YYYY-MM-DD.sql.gz | docker compose exec -T db psql -U saffron saffron
```
Schedule the backup in the droplet's crontab and push copies off-box (e.g. DO Spaces).

## Cron (serviceability sweep — replaces the Vercel cron)
`vercel.json`'s cron does **not** run here. Add to the droplet crontab:
```
0 3 * * * curl -fsS -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/serviceability >/dev/null 2>&1
```
(Use the same `CRON_SECRET` value as in `.env`.)

## Notes
- `NEXT_PUBLIC_*` are baked at **build** time — after changing them you must
  rebuild (`--build`), not just restart.
- This does not touch the Vercel deploy. Cut over by pointing DNS at the droplet
  (ideally via Cloudflare) only when you're ready.
