export default function DashboardSettingsPage() {
  return (
    <div className="space-y-3">
      <h1 className="font-display text-2xl font-bold text-text-primary">
        Settings
      </h1>
      <p className="max-w-xl text-sm text-secondary font-body">
        Environment-backed options (dashboard password, receipt links, email)
        can be summarized here for operators. Configuration stays in{" "}
        <code className="rounded bg-surface-muted px-1.5 py-0.5 text-text-primary">
          .env
        </code>{" "}
        today.
      </p>
    </div>
  );
}
