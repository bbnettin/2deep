(function () {
  const SENSITIVITY = 0.8;

  /* ---------- Background video mouse scrubbing ---------- */
  function initVideoScrub() {
    const video = document.getElementById('bg-video');
    if (!video) return;

    let prevX = null;
    let targetTime = 0;
    let seeking = false;
    let queuedTargetTime = null;

    // When metadata is ready, pause and reset to first frame
    video.addEventListener('loadedmetadata', () => {
      video.pause();
      video.currentTime = 0;
    });

    // Log errors so you can see if the video failed to load
    video.addEventListener('error', (e) => {
      console.error('Video failed to load:', e);
    });

    window.addEventListener('mousemove', (event) => {
      if (prevX === null) {
        prevX = event.clientX;
        return;
      }

      const delta = event.clientX - prevX;
      prevX = event.clientX;

      if (!video.duration || Number.isNaN(video.duration)) return;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTime = Math.max(0, Math.min(video.duration, targetTime + timeOffset));

      if (seeking) {
        queuedTargetTime = targetTime;
      } else if (Math.abs(video.currentTime - targetTime) > 0.001) {
        seeking = true;
        video.currentTime = targetTime;
      }
    });

    video.addEventListener('seeked', () => {
      if (queuedTargetTime !== null) {
        const next = queuedTargetTime;
        queuedTargetTime = null;

        if (Math.abs(video.currentTime - next) > 0.001) {
          video.currentTime = next;
        } else {
          seeking = false;
        }
      } else {
        seeking = false;
      }
    });
  }

  /* ---------- Typewriter effect ---------- */
  function initTypewriter() {
    const textEl = document.getElementById('typewriter-text');
    const cursorEl = document.getElementById('typing-cursor');
    if (!textEl || !cursorEl) return;

    const text = "Glad you stopped in. Good taste tends to find us. Now, what are we building?";
    const speed = 38;
    const startDelay = 600;
    let displayed = '';
    let index = 0;

    setTimeout(() => {
      const interval = setInterval(() => {
        if (index <= text.length) {
          displayed = text.slice(0, index);
          textEl.textContent = displayed;

          if (index === text.length) {
            clearInterval(interval);
            cursorEl.remove();
          }

          index++;
        }
      }, speed);
    }, startDelay);
  }

  /* ---------- Action pills fade-in ---------- */
  function initActionPills() {
    const pills = document.getElementById('action-pills');
    if (!pills) return;

    setTimeout(() => {
      pills.classList.add('visible');
    }, 400);
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('mobile-overlay');
    if (!hamburger || !overlay) return;

    let open = false;

    function setMenuState(isOpen) {
      open = isOpen;
      hamburger.classList.toggle('open', isOpen);
      overlay.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    hamburger.addEventListener('click', () => {
      setMenuState(!open);
    });

    overlay.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        setMenuState(false);
      });
    });
  }

  /* ---------- Copy email to clipboard ---------- */
  function initCopyEmail() {
    const button = document.getElementById('copy-email');
    if (!button) return;

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('hello@mainframe.co');
      } catch (error) {
        console.error('Failed to copy email:', error);
      }
    });
  }

  /* ---------- Initialise everything ---------- */
  function init() {
    initVideoScrub();
    initTypewriter();
    initActionPills();
    initMenu();
    initCopyEmail();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
