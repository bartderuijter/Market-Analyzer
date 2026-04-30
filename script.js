/* ============================================================
   ANNA — Issue 13 Birthday Edition — script.js
   ============================================================ */

/* ── 1. TYPEWRITER EFFECT ─────────────────────────────────
   VERVANG ▸ voeg je eigen zinnen toe / verander de volgorde  */
const typewriterLines = [
  'Toekomstig fashion designer.',
  'De ster van het gezin.',
  'Paris wacht op haar.',
  'Gelukkige 13e verjaardag! 🎉',
];

let lineIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
let typeTimer;

function typewrite() {
  const el  = document.getElementById('typewriter');
  if (!el) return;

  const current = typewriterLines[lineIndex];

  if (isDeleting) {
    el.textContent = current.slice(0, charIndex - 1);
    charIndex--;
  } else {
    el.textContent = current.slice(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 45 : 80;

  if (!isDeleting && charIndex === current.length) {
    delay = 2200; // wacht even aan het einde
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    lineIndex = (lineIndex + 1) % typewriterLines.length;
    delay = 400;
  }

  typeTimer = setTimeout(typewrite, delay);
}

/* ── 2. CONFETTI ──────────────────────────────────────────
   Kleuren matchen het palet: crème, rood, goud            */
const confettiColors = ['#C8102E', '#C9A96E', '#F9F6F0', '#111111', '#EFE0C4'];

function launchConfetti() {
  // Burst vanuit het midden
  confetti({
    particleCount: 180,
    spread: 80,
    origin: { x: 0.5, y: 0.55 },
    colors: confettiColors,
    scalar: 1.1,
  });

  // Extra regen van bovenaf na 400ms
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.5 },
      colors: confettiColors,
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.5 },
      colors: confettiColors,
    });
  }, 400);
}

/* ── 3. MUZIEKSPELER ──────────────────────────────────────*/
function initMusicPlayer() {
  const player    = document.getElementById('music-player');
  const audio     = document.getElementById('bg-music');
  const playIcon  = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const label     = document.getElementById('music-label');

  if (!player || !audio) return;

  // Verberg speler als het audio-bestand ontbreekt
  audio.addEventListener('error', () => {
    player.style.display = 'none';
  });

  function toggleMusic() {
    if (audio.paused) {
      audio.play().then(() => {
        playIcon.style.display  = 'none';
        pauseIcon.style.display = 'block';
        label.textContent = '♪ Pauzeert';
      }).catch(() => {
        label.textContent = '⚠ Geen audio';
      });
    } else {
      audio.pause();
      playIcon.style.display  = 'block';
      pauseIcon.style.display = 'none';
      label.textContent = '♪ Speel muziek';
    }
  }

  player.addEventListener('click', toggleMusic);
  player.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMusic(); }
  });
}

/* ── 4. COVER-KNOP: confetti + muziek ────────────────────*/
function initCadeauButton() {
  const btn   = document.getElementById('btn-cadeau');
  const audio = document.getElementById('bg-music');
  if (!btn) return;

  btn.addEventListener('click', () => {
    launchConfetti();

    // Probeer muziek te starten (vereist gebruikersinteractie — dit is die interactie)
    if (audio && audio.paused) {
      audio.play().then(() => {
        const playIcon  = document.getElementById('play-icon');
        const pauseIcon = document.getElementById('pause-icon');
        const label     = document.getElementById('music-label');
        if (playIcon)  playIcon.style.display  = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (label)     label.textContent = '♪ Pauzeert';
      }).catch(() => {/* geen audio-bestand aanwezig */});
    }

    // Scroll naar de volgende sectie na de confetti-burst
    setTimeout(() => {
      document.getElementById('redenen')?.scrollIntoView({ behavior: 'smooth' });
    }, 1200);
  });
}

/* ── 5. SCROLL-FADE-UP ANIMATIES ─────────────────────────*/
function initFadeObserver() {
  const els = document.querySelectorAll('.fade-up');
  if (!('IntersectionObserver' in window)) {
    // Fallback: toon alles direct
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
}

/* ── 6. FOTO-PLACEHOLDERS → echte img ────────────────────
   Als je een foto in /images zet én het src-pad in index.html
   invult, vervangt dit automatisch de placeholder-div.       */
function activateFotoItems() {
  document.querySelectorAll('.foto-item').forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;

    const placeholder = item.querySelector('.foto-placeholder');

    img.onload = () => {
      if (placeholder) placeholder.style.display = 'none';
    };
    img.onerror = () => {
      img.style.display = 'none'; // placeholder blijft zichtbaar
    };
  });
}

/* ── 7. CONFETTI BIJ PAGE LOAD (kleine verrassing) ───────
   OPTIONEEL: verwijder of comment dit blok als je 't niet wil */
function confettiOnLoad() {
  // Wacht tot de pagina geladen is, gooi dan subtiel confetti
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { x: 0.5, y: 0.1 },
      colors: confettiColors,
      scalar: 0.8,
      gravity: 0.5,
    });
  }, 800);
}

/* ── INIT ─────────────────────────────────────────────────*/
document.addEventListener('DOMContentLoaded', () => {
  typewrite();
  initMusicPlayer();
  initCadeauButton();
  initFadeObserver();
  activateFotoItems();
  confettiOnLoad();
});
