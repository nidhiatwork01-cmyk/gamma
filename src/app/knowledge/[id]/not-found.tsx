import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell py-20">
      <article className="surface-card p-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Knowledge item not found</h1>
        <p className="muted mt-2">The item may have been deleted or the id is invalid.</p>
        <Link href="/" className="btn-primary mt-6 inline-flex no-underline">
          Return to Dashboard
        </Link>
      </article>
    </div>
  );
}
