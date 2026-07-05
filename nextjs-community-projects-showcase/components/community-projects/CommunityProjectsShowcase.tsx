"use client";

import { useState } from 'react';
import { DEFAULT_PROJECTS_CSV_URL, DEFAULT_SUBMISSION_WEB_APP_URL } from '../../types/community-projects';
import { ExploreButton } from './ExploreButton';
import { ProjectsDashboardModal } from './ProjectsDashboardModal';

interface CommunityProjectsShowcaseProps {
  csvUrl?: string;
  submissionUrl?: string;
}

export function CommunityProjectsShowcase({
  csvUrl = DEFAULT_PROJECTS_CSV_URL,
  submissionUrl = DEFAULT_SUBMISSION_WEB_APP_URL
}: CommunityProjectsShowcaseProps) {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  return (
    <section className="flex w-full flex-col items-start gap-5 rounded-3xl border border-white/10 bg-[#121212]/80 p-6 shadow-[0_0_60px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:p-8">
      <ExploreButton onClick={() => setIsDashboardOpen(true)} />

      <ProjectsDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        csvUrl={csvUrl}
        submissionUrl={submissionUrl}
      />
    </section>
  );
}
