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
    <>
      <ExploreButton onClick={() => setIsDashboardOpen(true)} />

      <ProjectsDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        csvUrl={csvUrl}
        submissionUrl={submissionUrl}
      />
    </>
  );
}
