/* ============================================================
   ANNA — Issue 13 Birthday Edition — script.js
   ============================================================ */

/* ── 1. TYPEWRITER ────────────────────────────────────────
   VERVANG ▸ voeg je eigen zinnen toe in dit array           */
const typewriterLines = [
  'Toekomstig fashion designer.',
  'De ster van het gezin.',
  'Paris wacht op haar.',
  'Gelukkige 13e verjaardag! 🎉',
];

let twLine  = 0;
let twChar  = 0;
let twDel   = false;

function typewrite() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const cur = typewriterLines[twLine];
  el.textContent = twDel ? cur.slice(0, twChar - 1) : cur.slice(0, twChar + 1);
  twDel ? twChar-- : twChar++;
  let delay = twDel ? 45 : 80;
  if (!twDel && twChar === cur.length)  { delay = 2200; twDel = true; }
  else if (twDel && twChar === 0)       { twDel = false; twLine = (twLine + 1) % typewriterLines.length; delay = 400; }
  setTimeout(typewrite, delay);
}

/* ── 2. CONFETTI ──────────────────────────────────────────*/
const confettiColors = ['#C8102E', '#C9A96E', '#F9F6F0', '#111111', '#EFE0C4'];

function launchConfetti() {
  confetti({ particleCount: 180, spread: 80, origin: { x: 0.5, y: 0.55 }, colors: confettiColors, scalar: 1.1 });
  setTimeout(() => {
    confetti({ particleCount: 80, angle: 60,  spread: 55, origin: { x: 0, y: 0.5 }, colors: confettiColors });
    confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.5 }, colors: confettiColors });
  }, 400);
}

/* ── 3. CADEAU-KNOP ───────────────────────────────────────*/
function initCadeauButton() {
  const btn = document.getElementById('btn-cadeau');
  if (!btn) return;
  btn.addEventListener('click', () => {
    launchConfetti();
    setTimeout(() => { document.getElementById('redenen')?.scrollIntoView({ behavior: 'smooth' }); }, 1200);
  });
}

/* ── 5. SCROLL-ANIMATIES ──────────────────────────────────*/
function initFadeObserver() {
  const els = document.querySelectorAll('.fade-up');
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

/* ── 6. CONFETTI BIJ LADEN ────────────────────────────────*/
function confettiOnLoad() {
  setTimeout(() => {
    confetti({ particleCount: 60, spread: 100, origin: { x: 0.5, y: 0.1 }, colors: confettiColors, scalar: 0.8, gravity: 0.5 });
  }, 800);
}


/* ════════════════════════════════════════════════════════════
   EDIT MODE
   ════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'anna13-content';
let editActive = false;
let pendingPhotoKey = null; // welke data-pk wordt gevuld via file picker

/* ── Autorisatie ──────────────────────────────────────────
   Toegestaan op desktop ALTIJD, op mobiel alleen met ?edit=true */
function editAllowed() {
  if (new URLSearchParams(location.search).has('edit')) return true;
  return !window.matchMedia('(pointer: coarse)').matches;
}

/* ── Toggle ───────────────────────────────────────────────*/
function toggleEditMode() {
  editActive = !editActive;
  document.body.classList.toggle('edit-mode', editActive);

  const bar = document.getElementById('edit-bar');
  bar.hidden = !editActive;

  const btn = document.getElementById('edit-toggle');
  btn.setAttribute('aria-pressed', String(editActive));
  btn.title = editActive ? 'Edit mode uit' : 'Edit mode aan';

  if (editActive) {
    enableTextEditing();
    enablePhotoEditing();
    showToast('Edit mode actief — klik op tekst of foto om te bewerken');
  } else {
    disableTextEditing();
    disablePhotoEditing();
  }
}

/* ── Tekst bewerken ───────────────────────────────────────*/
function enableTextEditing() {
  document.querySelectorAll('[data-ek]').forEach(el => {
    el.setAttribute('contenteditable', 'true');
    el.addEventListener('input', onTextInput);
    // Voorkom Enter = nieuwe block in sommige elementen
    el.addEventListener('keydown', onTextKeydown);
  });
}

function disableTextEditing() {
  document.querySelectorAll('[data-ek]').forEach(el => {
    el.removeAttribute('contenteditable');
    el.removeEventListener('input', onTextInput);
    el.removeEventListener('keydown', onTextKeydown);
  });
}

function onTextInput(e) {
  const key = e.currentTarget.dataset.ek;
  const data = loadData();
  data.texts[key] = e.currentTarget.innerHTML;
  saveData(data);
}

function onTextKeydown(e) {
  // Enter in single-line fields (naam, rol, emoji): naar volgende veld
  const multiline = ['kaart-0-bericht','kaart-1-bericht','kaart-2-bericht',
                     'kaart-3-bericht','kaart-4-bericht','kaart-5-bericht',
                     'hoian-tagline','hoian-body','ifm-quote'];
  if (e.key === 'Enter' && !multiline.includes(e.currentTarget.dataset.ek)) {
    e.preventDefault();
    e.currentTarget.blur();
  }
}

/* ── Foto bewerken ────────────────────────────────────────*/
function enablePhotoEditing() {
  document.querySelectorAll('[data-pk]').forEach(el => {
    el.classList.add('photo-editable');
    el.addEventListener('click', onPhotoClick);
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDrop);
    addRemoveButton(el);
  });
}

function disablePhotoEditing() {
  document.querySelectorAll('[data-pk]').forEach(el => {
    el.classList.remove('photo-editable', 'drag-over');
    el.removeEventListener('click', onPhotoClick);
    el.removeEventListener('dragover', onDragOver);
    el.removeEventListener('dragleave', onDragLeave);
    el.removeEventListener('drop', onDrop);
    el.querySelector('.photo-remove-btn')?.remove();
  });
}

function addRemoveButton(el) {
  if (el.querySelector('.photo-remove-btn')) return;
  const btn = document.createElement('button');
  btn.className = 'photo-remove-btn';
  btn.innerHTML = '×';
  btn.setAttribute('aria-label', 'Foto verwijderen');
  btn.addEventListener('click', e => { e.stopPropagation(); removePhoto(el.dataset.pk); });
  el.appendChild(btn);
  syncRemoveBtn(el);
}

function syncRemoveBtn(el) {
  const btn = el.querySelector('.photo-remove-btn');
  if (!btn) return;
  const hasPhoto = !!loadData().photos[el.dataset.pk];
  btn.style.display = hasPhoto ? '' : 'none';
}

function onPhotoClick(e) {
  if (e.target.classList.contains('photo-remove-btn')) return;
  pendingPhotoKey = this.dataset.pk;
  document.getElementById('photo-input').click();
}

function onDragOver(e) {
  e.preventDefault();
  this.classList.add('drag-over');
}

function onDragLeave() {
  this.classList.remove('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  this.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) processPhoto(this.dataset.pk, file);
}

/* ── Foto verwerken: resize → base64 → opslaan ───────────*/
async function processPhoto(photoKey, file) {
  const maxW    = photoKey.startsWith('mood') ? 600 : 1200;
  const quality = 0.72;

  try {
    const base64 = await resizeImage(file, maxW, quality);

    const data = loadData();
    data.photos[photoKey] = base64;

    try {
      saveData(data);
    } catch {
      showToast('Foto is te groot voor lokale opslag. Probeer een kleinere afbeelding.', 'error');
      return;
    }

    renderPhoto(photoKey, base64);
    syncRemoveBtn(document.querySelector(`[data-pk="${photoKey}"]`));
    showToast('Foto opgeslagen ✓');

  } catch {
    showToast('Kon de foto niet verwerken.', 'error');
  }
}

function resizeImage(file, maxW, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = e => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const ratio  = Math.min(1, maxW / img.width);
        const w      = Math.round(img.width  * ratio);
        const h      = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ── Foto renderen in de DOM ──────────────────────────────*/
function renderPhoto(photoKey, base64) {
  const el = document.querySelector(`[data-pk="${photoKey}"]`);
  if (!el) return;

  let img = el.querySelector('img.stored-photo');
  if (!img) {
    img = document.createElement('img');
    img.className = 'stored-photo';
    img.alt = '';
    el.insertBefore(img, el.firstChild);
  }
  img.src = base64;

  // Verberg placeholder-inhoud
  el.querySelector('.foto-placeholder')?.style.setProperty('display', 'none');
  el.querySelector('.design-slot-label')?.style.setProperty('display', 'none');
  el.querySelector('.design-slot-caption')?.style.setProperty('display', 'none');

  // Verberg tekst-nodes in mood-items
  if (el.classList.contains('mood-item')) {
    [...el.childNodes]
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .forEach(n => { n.textContent = ''; });
  }
}

function removePhoto(photoKey) {
  const data = loadData();
  delete data.photos[photoKey];
  saveData(data);

  const el = document.querySelector(`[data-pk="${photoKey}"]`);
  if (!el) return;

  el.querySelector('img.stored-photo')?.remove();
  el.querySelector('.foto-placeholder')?.style.removeProperty('display');
  el.querySelector('.design-slot-label')?.style.removeProperty('display');
  el.querySelector('.design-slot-caption')?.style.removeProperty('display');

  // Herstel tekst in mood-items (herlees van HTML — eenvoudigst: reload nemen we niet,
  // maar we zetten de key terug via de originele data-pk nummering)
  if (el.classList.contains('mood-item')) {
    const idx = parseInt(photoKey.replace('mood-', ''), 10) + 1;
    el.textContent = `Mood ${idx}`;
  }

  syncRemoveBtn(el);
  showToast('Foto verwijderd');
}

/* ── File input handler ───────────────────────────────────*/
function initPhotoInput() {
  const input = document.getElementById('photo-input');
  input.addEventListener('change', () => {
    if (input.files[0] && pendingPhotoKey) processPhoto(pendingPhotoKey, input.files[0]);
    input.value = ''; // reset zodat dezelfde foto opnieuw gekozen kan worden
    pendingPhotoKey = null;
  });
}

/* ── localStorage ─────────────────────────────────────────*/
function loadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { texts: {}, photos: {} };
  } catch {
    return { texts: {}, photos: {} };
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ── Toepassen bij pagina-load ────────────────────────────*/
function applyStoredContent() {
  const data = loadData();

  Object.entries(data.texts).forEach(([key, value]) => {
    const el = document.querySelector(`[data-ek="${key}"]`);
    if (el) el.innerHTML = value;
  });

  Object.entries(data.photos).forEach(([key, base64]) => {
    renderPhoto(key, base64);
  });
}

/* ── Export: Kopieer JSON ─────────────────────────────────*/
function copyJSON() {
  const json = JSON.stringify(loadData(), null, 2);
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(json)
      .then(() => showToast('JSON gekopieerd naar klembord ✓'))
      .catch(() => fallbackCopy(json));
  } else {
    fallbackCopy(json);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
  showToast('JSON gekopieerd ✓');
}

/* ── Export: Download HTML ────────────────────────────────*/
function downloadHTML() {
  const data = loadData();

  // Kloon het volledige document
  const clone = document.documentElement.cloneNode(true);

  // Verwijder edit-UI uit kloon
  clone.querySelector('#edit-toggle')?.remove();
  clone.querySelector('#edit-bar')?.remove();
  clone.querySelector('#photo-input')?.remove();
  clone.querySelectorAll('.photo-remove-btn').forEach(el => el.remove());
  clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
  clone.querySelectorAll('.photo-editable').forEach(el => el.classList.remove('photo-editable'));
  clone.querySelector('body')?.classList.remove('edit-mode');

  // Pas opgeslagen teksten toe
  Object.entries(data.texts).forEach(([key, value]) => {
    const el = clone.querySelector(`[data-ek="${key}"]`);
    if (el) el.innerHTML = value;
  });

  // Inlinen van foto's
  Object.entries(data.photos).forEach(([key, base64]) => {
    const el = clone.querySelector(`[data-pk="${key}"]`);
    if (!el) return;
    let img = el.querySelector('img.stored-photo');
    if (!img) {
      img = document.createElement('img');
      img.className = 'stored-photo';
      img.alt = '';
      el.insertBefore(img, el.firstChild);
    }
    img.src = base64;
    el.querySelector('.foto-placeholder')?.remove();
    el.querySelector('.design-slot-label')?.remove();
    el.querySelector('.design-slot-caption')?.remove();
    if (el.classList.contains('mood-item')) {
      [...el.childNodes]
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .forEach(n => { n.textContent = ''; });
    }
  });

  const html  = '<!DOCTYPE html>\n' + clone.outerHTML;
  const blob  = new Blob([html], { type: 'text/html;charset=utf-8' });
  const a     = document.createElement('a');
  a.href      = URL.createObjectURL(blob);
  a.download  = 'anna-birthday-published.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
  showToast('anna-birthday-published.html gedownload ✓');
}

/* ── Reset ────────────────────────────────────────────────*/
function resetContent() {
  if (!confirm('Weet je zeker dat je alle opgeslagen tekst en foto\'s wil verwijderen?\nDit kan niet ongedaan worden gemaakt.')) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

/* ── Toast ────────────────────────────────────────────────*/
function showToast(msg, type = 'success') {
  document.getElementById('edit-toast')?.remove();
  const t = document.createElement('div');
  t.id = 'edit-toast';
  t.className = `edit-toast edit-toast--${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  t.offsetHeight; // reflow voor animatie
  t.classList.add('edit-toast--visible');
  setTimeout(() => {
    t.classList.remove('edit-toast--visible');
    setTimeout(() => t.remove(), 300);
  }, 2800);
}

/* ── Init edit mode ───────────────────────────────────────*/
function initEditMode() {
  const toggleBtn = document.getElementById('edit-toggle');

  if (!editAllowed()) {
    toggleBtn?.remove();
    return;
  }

  toggleBtn?.addEventListener('click', toggleEditMode);
  toggleBtn?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleEditMode(); }
  });

  document.getElementById('btn-copy-json')?.addEventListener('click', copyJSON);
  document.getElementById('btn-download-html')?.addEventListener('click', downloadHTML);
  document.getElementById('btn-reset-content')?.addEventListener('click', resetContent);

  initPhotoInput();
}


/* ── INIT ─────────────────────────────────────────────────*/
document.addEventListener('DOMContentLoaded', () => {
  applyStoredContent(); // eerst content toepassen, dan de rest
  typewrite();
  initCadeauButton();
  initFadeObserver();
  confettiOnLoad();
  initEditMode();
});
