import { CommunityProjectsShowcase } from '../components/community-projects/CommunityProjectsShowcase';

export default function Page() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,163,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_26%)]" />
      <div className="relative w-full max-w-4xl">
        <CommunityProjectsShowcase />
      </div>
    </main>
  );
}
