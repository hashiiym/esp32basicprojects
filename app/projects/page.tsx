import { CommunityProjectsShowcase } from "../../components/community-projects/CommunityProjectsShowcase";

export default function ProjectsPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,163,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_26%)]" />
      <div className="relative w-full max-w-4xl">
        <section className="flex w-full flex-col items-start gap-5 rounded-3xl border border-white/10 bg-[#121212]/80 p-6 shadow-[0_0_60px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:p-8">
          <CommunityProjectsShowcase />
        </section>
      </div>
    </main>
  );
}
