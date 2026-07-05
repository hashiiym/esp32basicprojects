"use client";

import { useEffect, useState } from 'react';
import { fetchCommunityProjects } from '../../lib/community-projects';
import type { CommunityProject } from '../../types/community-projects';
import { ProjectCard } from './ProjectCard';
import { SubmitProjectModal } from './SubmitProjectModal';

interface ProjectsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  csvUrl: string;
  submissionUrl: string;
}

function LoadingSpinner() {
  return <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-[#00FFA3]" />;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function ProjectsDashboardModal({ isOpen, onClose, csvUrl, submissionUrl }: ProjectsDashboardModalProps) {
  const [projects, setProjects] = useState<CommunityProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isActive = true;

    async function loadProjects() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await fetchCommunityProjects(csvUrl);
        if (isActive) {
          setProjects(data);
        }
      } catch (error) {
        if (isActive) {
          const message = error instanceof Error ? error.message : 'Failed to load projects';
          setErrorMessage(message);
          setProjects([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      isActive = false;
    };
  }, [csvUrl, isOpen, refreshToken]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !showSubmitModal) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, showSubmitModal]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-3 py-4 sm:px-6" onClick={onClose}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
        <section
          className="relative z-10 flex h-[90vh] w-[90vw] max-w-[1600px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#121212] shadow-[0_0_100px_rgba(0,0,0,0.7)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="projects-dashboard-title"
          onClick={event => event.stopPropagation()}
        >
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-[#121212]/95 px-4 py-4 backdrop-blur-md sm:px-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00FFA3]">
                Community Projects
              </p>
              <h2 id="projects-dashboard-title" className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                SimSpark Community Projects
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="rounded-full bg-[#00FFA3] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#28ffb1]"
              >
                Add Project
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                aria-label="Close projects dashboard"
              >
                <CloseIcon />
              </button>
            </div>
          </header>

          <div className="projects-scrollbar flex-1 overflow-auto px-4 py-5 sm:px-6">
            {isLoading ? (
              <div className="flex h-full min-h-[40vh] items-center justify-center">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-gray-400">
                  <LoadingSpinner />
                  Loading community projects...
                </div>
              </div>
            ) : errorMessage ? (
              <div className="flex h-full min-h-[40vh] items-center justify-center">
                <div className="max-w-lg rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
                  <p className="font-semibold text-red-100">Unable to load projects</p>
                  <p className="mt-2 text-red-200/80">{errorMessage}</p>
                  <button
                    type="button"
                    onClick={() => setRefreshToken(token => token + 1)}
                    className="mt-4 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-50 transition hover:bg-red-500/20"
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex h-full min-h-[40vh] items-center justify-center">
                <div className="max-w-lg rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-gray-400">
                  <p className="font-semibold text-white">No projects yet</p>
                  <p className="mt-2 text-gray-400">Use Add Project to seed the showcase from the submission flow.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <SubmitProjectModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmitted={() => setRefreshToken(token => token + 1)}
        submissionUrl={submissionUrl}
      />
    </>
  );
}
