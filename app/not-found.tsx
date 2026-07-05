export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 text-center text-white">
      <div className="max-w-md space-y-3 rounded-3xl border border-white/10 bg-[#121212] px-6 py-8 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#00FFA3]">404</p>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-sm leading-6 text-gray-400">
          The community showcase route does not exist.
        </p>
      </div>
    </main>
  );
}