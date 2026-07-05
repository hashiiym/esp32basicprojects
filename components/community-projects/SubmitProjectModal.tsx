"use client";

import { useEffect, useRef, useState } from 'react';
import { submitCommunityProject } from '../../lib/community-projects';
import type { CommunityProjectFormValues } from '../../types/community-projects';

interface SubmitProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  submissionUrl: string;
}

const initialValues: CommunityProjectFormValues = {
  name: '',
  title: '',
  description: '',
  wokwiLink: ''
};

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />;
}

export function SubmitProjectModal({ isOpen, onClose, onSubmitted, submissionUrl }: SubmitProjectModalProps) {
  const [form, setForm] = useState<CommunityProjectFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setForm(initialValues);
      setIsSubmitting(false);
      setStatusMessage(null);
      setErrorMessage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const updateField = (field: keyof CommunityProjectFormValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(current => ({
      ...current,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      await submitCommunityProject(submissionUrl, form);
      setStatusMessage('Project submitted successfully. Refreshing the showcase...');
      onSubmitted();

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }

      closeTimerRef.current = window.setTimeout(() => {
        setForm(initialValues);
        setIsSubmitting(false);
        setStatusMessage(null);
        onClose();
      }, 1100);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit project';
      setErrorMessage(message);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#121212] p-5 shadow-[0_0_80px_rgba(0,0,0,0.65)] sm:p-6"
        onClick={event => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-project-title"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#00FFA3]">Submit Project</p>
            <h2 id="submit-project-title" className="mt-2 text-2xl font-semibold text-white">
              Add a community project
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            aria-label="Close submit project modal"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {statusMessage ? (
          <div className="mb-4 rounded-2xl border border-[#00FFA3]/25 bg-[#00FFA3]/10 px-4 py-3 text-sm text-[#b9ffd9]">
            {statusMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">Name</span>
              <input
                value={form.name}
                onChange={updateField('name')}
                required
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-[#00FFA3] focus:ring-2 focus:ring-[#00FFA3]/20"
                placeholder="Your name"
              />
            </label>

            <label className="block space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">Project Title</span>
              <input
                value={form.title}
                onChange={updateField('title')}
                required
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-[#00FFA3] focus:ring-2 focus:ring-[#00FFA3]/20"
                placeholder="Project title"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">Description</span>
            <textarea
              value={form.description}
              onChange={updateField('description')}
              required
              rows={5}
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-[#00FFA3] focus:ring-2 focus:ring-[#00FFA3]/20"
              placeholder="Describe what your project does and what makes it interesting"
            />
          </label>

          <label className="block space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">Wokwi Link</span>
            <input
              value={form.wokwiLink}
              onChange={updateField('wokwiLink')}
              required
              type="url"
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-[#00FFA3] focus:ring-2 focus:ring-[#00FFA3]/20"
              placeholder="https://wokwi.com/..."
            />
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-300 transition hover:border-white/20 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-36 items-center justify-center gap-2 rounded-full bg-[#00FFA3] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#28ffb1] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? <Spinner /> : null}
              {isSubmitting ? 'Submitting...' : 'Submit Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
