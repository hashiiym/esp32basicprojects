
const STORAGE_KEY = 'unlockedUpTo';
const COMPLETE_KEY = 'allProjectsComplete';
const LAST_PROJECT = 10;
const COMMUNITY_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8Rwen4Xf5Bjs3cTBDMIlnXhkf2BmWVzowk6csWB3bTa4OdU7GqHpN5QmQQOmDfaM-LO0on0_3kNiq/pub?output=csv';
const COMMUNITY_SUBMIT_URL = 'https://script.google.com/macros/s/AKfycbyKUuO4qJ1tmV9xYPuJ1NTNgFSxh_l_nRXKAfgDayTiGsQkU0vUmMHN3PlXg1-9qSp2/exec';
let communityProjects = [];
let communityLoaded = false;
let communityLoading = false;
let communityToastTimer = null;

function normalizeCommunityKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function getCommunityField(row, keys) {
  const normalizedEntries = Object.entries(row).map(([key, value]) => [normalizeCommunityKey(key), String(value || '').trim()]);
  const lookup = new Map(normalizedEntries);

  for (const key of keys) {
    const value = lookup.get(normalizeCommunityKey(key));
    if (value) {
      return value;
    }
  }

  return '';
}

function showCommunityToast(message) {
  const toast = document.getElementById('communityToast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(communityToastTimer);
  communityToastTimer = window.setTimeout(() => {
    toast.classList.remove('visible');
  }, 2400);
}

function escapeCommunityHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeCommunityLink(value) {
  const trimmed = String(value || '').trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return '';
}

function openCommunityProjects() {
  const overlay = document.getElementById('communityOverlay');
  if (!overlay) return;

  overlay.classList.add('visible');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (!communityLoaded) {
    loadCommunityProjects();
  }
}

function closeCommunityProjects() {
  const overlay = document.getElementById('communityOverlay');
  if (!overlay) return;

  overlay.classList.remove('visible');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  closeSubmitProject();
}

function openSubmitProject() {
  const overlay = document.getElementById('communitySubmitOverlay');
  if (!overlay) return;

  overlay.classList.add('visible');
  overlay.setAttribute('aria-hidden', 'false');
  const nameInput = document.getElementById('communityName');
  if (nameInput) {
    nameInput.focus();
  }
}

function closeSubmitProject() {
  const overlay = document.getElementById('communitySubmitOverlay');
  if (!overlay) return;

  overlay.classList.remove('visible');
  overlay.setAttribute('aria-hidden', 'true');
  const form = document.getElementById('communitySubmitForm');
  if (form) {
    form.reset();
  }
  const button = document.getElementById('communitySubmitBtn');
  if (button) {
    button.disabled = false;
    button.textContent = 'Submit Project';
  }
}

function renderCommunityProjects() {
  const grid = document.getElementById('communityGrid');
  const state = document.getElementById('communityState');
  if (!grid || !state) return;

  if (!communityProjects.length) {
    state.hidden = false;
    state.innerHTML = '<div class="community-state-box"><strong style="color:#fff">No projects found</strong><div style="margin-top:0.4rem;">Add the first entry from the submit form.</div></div>';
    grid.hidden = true;
    grid.innerHTML = '';
    return;
  }

  state.hidden = true;
  grid.hidden = false;
  grid.innerHTML = communityProjects.map((project) => `
    <article class="community-card">
      <div>
        <div class="community-card-tag">${escapeCommunityHtml(project.name || 'Anonymous')}</div>
        <h3 class="community-card-title">${escapeCommunityHtml(project.title || 'Untitled Project')}</h3>
        <p class="community-card-desc">${escapeCommunityHtml(project.description || 'No description provided.')}</p>
      </div>
      <div class="community-card-footer">
        ${normalizeCommunityLink(project.wokwiLink) ? `<a class="community-link" href="${escapeCommunityHtml(normalizeCommunityLink(project.wokwiLink))}" target="_blank" rel="noreferrer">View Project -&gt;</a>` : '<span class="community-link" style="color:#6b7280;">No project link provided</span>'}
      </div>
    </article>
  `).join('');
}

async function loadCommunityProjects() {
  if (communityLoading) return;
  communityLoading = true;

  const state = document.getElementById('communityState');
  if (state) {
    state.hidden = false;
    state.innerHTML = '<div class="community-state-box"><div style="display:flex;align-items:center;gap:0.75rem;"><span class="community-spinner"></span><span>Loading community projects...</span></div></div>';
  }

  try {
    const response = await fetch(COMMUNITY_CSV_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load community projects (${response.status})`);
    }

    const csvText = await response.text();
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    });

    if (parsed.errors && parsed.errors.length) {
      throw new Error(parsed.errors[0].message || 'CSV parse failed');
    }

    communityProjects = (parsed.data || []).map((row, index) => ({
      id: `${index}-${normalizeCommunityKey(getCommunityField(row, ['Name', 'Author', 'Submitted By']))}-${normalizeCommunityKey(getCommunityField(row, ['Project Title', 'Title', 'Project']))}`,
      name: getCommunityField(row, ['Name', 'Author', 'Submitted By', 'Creator']) || 'Anonymous',
      title: getCommunityField(row, ['Project Title', 'Title', 'Project', 'Name']) || `Project ${index + 1}`,
      description: getCommunityField(row, ['Description', 'Project Description', 'Summary']) || 'No description provided.',
      wokwiLink: getCommunityField(row, ['Wokwi Link', 'Wokwi', 'Link', 'URL', 'Project Link'])
    }));

    communityLoaded = true;
    renderCommunityProjects();
  } catch (error) {
    if (state) {
      const message = error instanceof Error ? error.message : 'Failed to load community projects';
      state.hidden = false;
      state.innerHTML = `<div class="community-state-box"><strong style="color:#fff">Unable to load projects</strong><div style="margin-top:0.4rem;">${message}</div><button class="community-add-btn" type="button" style="margin-top:0.85rem;" onclick="loadCommunityProjects()">Try Again</button></div>`;
    }
    const grid = document.getElementById('communityGrid');
    if (grid) {
      grid.hidden = true;
      grid.innerHTML = '';
    }
  } finally {
    communityLoading = false;
  }
}

async function submitCommunityProject(event) {
  event.preventDefault();
  const button = document.getElementById('communitySubmitBtn');
  const name = document.getElementById('communityName').value.trim();
  const title = document.getElementById('communityTitle').value.trim();
  const description = document.getElementById('communityDescription').value.trim();
  const wokwiLink = document.getElementById('communityLink').value.trim();

  if (button) {
    button.disabled = true;
    button.textContent = 'Submitting...';
  }

  try {
    await fetch(COMMUNITY_SUBMIT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({ name, title, description, wokwiLink })
    });

    showCommunityToast('Project submitted successfully');
    closeSubmitProject();
    await loadCommunityProjects();
  } catch (error) {
    showCommunityToast('Submission failed. Please try again.');
    if (button) {
      button.disabled = false;
      button.textContent = 'Submit Project';
    }
  }
}

function bindCommunityEvents() {
  const overlay = document.getElementById('communityOverlay');
  const submitOverlay = document.getElementById('communitySubmitOverlay');
  const submitForm = document.getElementById('communitySubmitForm');

  if (overlay) {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeCommunityProjects();
      }
    });
  }

  if (submitOverlay) {
    submitOverlay.addEventListener('click', (event) => {
      if (event.target === submitOverlay) {
        closeSubmitProject();
      }
    });
  }

  if (submitForm) {
    submitForm.addEventListener('submit', submitCommunityProject);
  }

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (submitOverlay && submitOverlay.classList.contains('visible')) {
        closeSubmitProject();
      } else if (overlay && overlay.classList.contains('visible')) {
        closeCommunityProjects();
      }
    }
  });
}

function getUnlockedUpTo() {
  return LAST_PROJECT;
}

function setUnlockedUpTo(value) {
  localStorage.setItem(STORAGE_KEY, String(Math.min(Math.max(value, 1), LAST_PROJECT)));
}

function closeAllProjects() {
  document.querySelectorAll('.project').forEach((project) => {
    project.classList.remove('open');
  });
}

function openProject(projectNumber, shouldScroll) {
  const project = document.getElementById(`p${projectNumber}`);
  if (!project) return;
  closeAllProjects();
  project.classList.add('open');
  if (shouldScroll) {
    project.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function setCompletionBannerVisible(visible) {
  const banner = document.getElementById('completionBanner');
  if (!banner) return;
  banner.classList.toggle('visible', visible);
}

function updateProjects() {
  const unlockedUpTo = getUnlockedUpTo();
  document.querySelectorAll('.project').forEach((project) => {
    const projectNumber = Number(project.dataset.project);
    const isUnlocked = projectNumber <= unlockedUpTo;
    project.classList.toggle('locked', !isUnlocked);
    if (!isUnlocked) {
      project.classList.remove('open');
    }
  });

  document.querySelectorAll('.nav-btn').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const projectNumber = Number(href.replace('#p', ''));
    link.classList.toggle('locked', projectNumber > unlockedUpTo);
  });
}

function toggle(header) {
  const project = header.parentElement;
  const projectNumber = Number(project.dataset.project);
  if (projectNumber > getUnlockedUpTo()) {
    return;
  }

  const isOpen = project.classList.contains('open');
  closeAllProjects();
  if (!isOpen) {
    project.classList.add('open');
  }
}

function goToNextProject(currentProject) {
  const nextProject = currentProject + 1;
  if (nextProject > LAST_PROJECT) {
    return;
  }

  if (nextProject > getUnlockedUpTo()) {
    setUnlockedUpTo(nextProject);
  }

  updateProjects();
  openProject(nextProject, true);
}

function markComplete() {
  localStorage.setItem(COMPLETE_KEY, 'true');
  setCompletionBannerVisible(true);
}

function ensureProjectMetadata() {
  document.querySelectorAll('.project').forEach((project, index) => {
    project.dataset.project = String(index + 1);
  });
}

function injectLockIndicators() {
  document.querySelectorAll('.project-header').forEach((header) => {
    if (header.querySelector('.lock-indicator')) return;
    const title = header.querySelector('.proj-title');
    if (!title) return;
    const indicator = document.createElement('span');
    indicator.className = 'lock-indicator';
    indicator.textContent = '\uD83D\uDD12 Locked';
    title.insertAdjacentElement('afterend', indicator);
  });
}

function injectPrerequisites() {
  if (document.getElementById('prerequisites')) return;
  const main = document.querySelector('main');
  const firstProject = document.getElementById('p1');
  if (!main || !firstProject) return;

  const section = document.createElement('section');
  section.className = 'prereq';
  section.id = 'prerequisites';
  section.innerHTML = `
    <div class="prereq-header">
      <p class="header-tag">Before You Start</p>
      <h2>What You Need</h2>
      <p class="prereq-copy">Components, software, and setup before you begin</p>
      <button class="prereq-toggle" type="button" onclick="togglePrerequisites()">
        <span class="prereq-toggle-icon">▾</span>
        <span class="prereq-toggle-label">See what you need</span>
      </button>
    </div>
    <div class="prereq-content">
      <div class="prereq-grid">
        <div class="prereq-block">
          <h3>Components Master List</h3>
          <ul class="prereq-list">
            <li>ESP32 development board</li>
            <li>LEDs, including red, yellow, and green</li>
            <li>220 ohm resistors</li>
            <li>Push button</li>
            <li>Potentiometer</li>
            <li>DHT11 temperature and humidity sensor</li>
            <li>HC-SR04 ultrasonic sensor</li>
            <li>Passive buzzer</li>
            <li>PIR motion sensor</li>
            <li>LDR light sensor</li>
            <li>10k ohm resistor</li>
            <li>Breadboard and jumper wires</li>
          </ul>
        </div>
        <div class="prereq-block">
          <h3>Software Needed</h3>
          <ul class="prereq-list">
            <li>A modern web browser</li>
            <li>A Wokwi account at wokwi.com</li>
            <li>Internet access to open the simulator projects</li>
          </ul>
        </div>
      </div>
      <div class="prereq-note">No physical hardware is required for this workshop. All 10 projects run inside the Wokwi simulator.</div>
    </div>
  `;
  main.insertBefore(section, firstProject);
}

function togglePrerequisites() {
  const section = document.getElementById('prerequisites');
  if (!section) return;
  const expanded = section.classList.toggle('expanded');
  const label = section.querySelector('.prereq-toggle-label');
  if (label) {
    label.textContent = expanded ? 'Hide' : 'See what you need';
  }
}

function injectProjectActions() {
  document.querySelectorAll('.project').forEach((project) => {
    const projectNumber = Number(project.dataset.project);
    const body = project.querySelector('.project-body');
    if (!body || body.querySelector('.project-actions')) return;

    if (projectNumber < LAST_PROJECT) {
      const actions = document.createElement('div');
      actions.className = 'project-actions';
      actions.innerHTML = `<button class="flow-btn next-btn" type="button" onclick="goToNextProject(${projectNumber})">Next Project &rarr;</button>`;
      body.appendChild(actions);
      return;
    }

    const banner = document.createElement('div');
    banner.id = 'completionBanner';
    banner.className = 'completion-banner';
    banner.textContent = "You've completed all 10 projects! Now build your own.";

    const completeWrap = document.createElement('div');
    completeWrap.className = 'project-actions';
    completeWrap.innerHTML = '<button class="flow-btn complete-btn" type="button" onclick="markComplete()">&#10003; Mark Complete</button>';

    const submitWrap = document.createElement('div');
    submitWrap.className = 'project-actions';
    submitWrap.innerHTML = '<a class="flow-btn submit-btn" href="https://forms.gle/PAMVbJvyYh7bgUSXA" target="_blank" rel="noopener noreferrer">Submit Your Project &rarr;</a>';

    body.appendChild(banner);
    body.appendChild(completeWrap);
    body.appendChild(submitWrap);
  });
}

function initializeWorkshop() {
  bindCommunityEvents();
  ensureProjectMetadata();
  injectLockIndicators();
  injectPrerequisites();
  injectProjectActions();
  updateProjects();

  const completed = localStorage.getItem(COMPLETE_KEY) === 'true';
  setCompletionBannerVisible(completed);

  if (completed) {
    openProject(LAST_PROJECT, false);
    return;
  }

  openProject(getUnlockedUpTo(), false);
}

function copyCode(btn) {
  const pre = btn.closest('.code-wrap').querySelector('pre');
  const text = pre.innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'copied!';
    btn.style.color = '#00e5a0';
    btn.style.borderColor = '#00e5a0';
    setTimeout(() => {
      btn.textContent = 'copy';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  });
}

initializeWorkshop();
