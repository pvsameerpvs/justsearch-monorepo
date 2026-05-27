import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fbfaf7] px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-lagoon">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">This table is empty</h1>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          Back to Eatygo
        </Link>
      </div>
    </main>
  );
}
