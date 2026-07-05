"use client";

import type { CommunityProject } from '../../types/community-projects';

interface ProjectCardProps {
  project: CommunityProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#1a1a1a] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#00FFA3]/40 hover:shadow-[0_0_0_1px_rgba(0,255,163,0.1),0_16px_50px_rgba(0,255,163,0.08)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#00FFA3]">
          {project.name}
        </span>
        <span className="h-2 w-2 rounded-full bg-[#00FFA3] opacity-80 shadow-[0_0_16px_rgba(0,255,163,0.8)]" />
      </div>

      <h3 className="text-lg font-semibold leading-tight text-white">{project.title}</h3>

      <p className="mt-3 text-sm leading-6 text-gray-400 line-clamp-3">{project.description}</p>

      <div className="mt-6 border-t border-white/10 pt-4">
        {project.wokwiLink ? (
          <a
            href={project.wokwiLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm text-[#00FFA3] transition duration-200 hover:text-white"
          >
            View Project <span aria-hidden="true">-&gt;</span>
          </a>
        ) : (
          <span className="font-mono text-sm text-gray-500">No project link provided</span>
        )}
      </div>
    </article>
  );
}
