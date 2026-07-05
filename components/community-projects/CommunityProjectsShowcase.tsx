"use client";

import { DEFAULT_PROJECTS_CSV_URL, DEFAULT_SUBMISSION_WEB_APP_URL } from '../../types/community-projects';
import { ProjectsDashboard } from './ProjectsDashboard';

interface CommunityProjectsShowcaseProps {
  csvUrl?: string;
  submissionUrl?: string;
}

export function CommunityProjectsShowcase({
  csvUrl = DEFAULT_PROJECTS_CSV_URL,
  submissionUrl = DEFAULT_SUBMISSION_WEB_APP_URL
}: CommunityProjectsShowcaseProps) {
  return (
    <ProjectsDashboard
      csvUrl={csvUrl}
      submissionUrl={submissionUrl}
    />
  );
}
