# ANNA — Issue 13 · Birthday Edition

Verjaardagswebsite voor Anna, 1 mei 2026.  
Plain HTML/CSS/JS — geen build-stap nodig.

---

## Bestandsstructuur

```
/
├── index.html      ← alle secties en placeholders
├── style.css       ← magazine-stijl, kleuren, grid
├── script.js       ← confetti, muziek, typewriter, animaties
├── images/         ← drop hier je foto's
└── audio/          ← drop hier je mp3
```

---

## 1. Tekst aanpassen

Open `index.html` in een teksteditor. Zoek op `<!-- VERVANG` (Ctrl+F / Cmd+F) — elke placeholder heeft zo'n comment direct erboven of erin.

| Wat | Waar in index.html |
|---|---|
| 13 redenen | `<section id="redenen">` → elke `<span class="reden-text">` |
| Familie-berichten | `<section id="familie">` → elke `<p class="kaart-bericht">` |
| Naam/rol van familielid | `.kaart-naam` en `.kaart-rol` in de extra kaarten |
| Hoi An reisdatum | `.hoian-pill` en `.hoian-body` |
| IFM quote | `<blockquote class="ifm-quote">` |
| Typewriter-zinnen | `script.js` → de array `typewriterLines` bovenaan |

---

## 2. Foto's toevoegen

1. Kopieer je foto's naar de `/images` map.  
   Gebruik namen zonder spaties, bijv. `anna-01.jpg`, `anna-02.jpg` …

2. Zoek in `index.html` op `<!-- VERVANG ▸ src=`.  
   Vervang de `<div class="foto-placeholder">` door een `<img>`-tag:

```html
<!-- vóór -->
<div class="foto-placeholder">…</div>

<!-- ná -->
<img src="images/anna-01.jpg" alt="Anna op de foto" />
```

   De CSS past de foto automatisch in het grid.

3. Bijschrift toevoegen: vul de lege `<div class="foto-caption">` in:

```html
<div class="foto-caption">Zomer 2023 · Zeeland</div>
```

**Moodboard (IFM-sectie):** zelfde werkwijze, maar de bestanden heten `mood-01.jpg` … `mood-06.jpg`.  
**Hoi An designs:** bestanden heten `design-01.jpg` … `design-03.jpg`.

---

## 3. Muziek toevoegen

1. Zet je mp3-bestand in de `/audio` map, bijv. `audio/happy-song.mp3`.

2. Open `index.html` en zoek op `jouw-nummer.mp3`.  
   Vervang de bestandsnaam:

```html
<source src="audio/happy-song.mp3" type="audio/mpeg" />
```

3. De play/pause-knop verschijnt linksonder. Als het bestand ontbreekt, verbergt de knop zichzelf automatisch.

> **Tip:** GitHub Pages biedt geen gratis audio-hosting voor grote bestanden.  
> Houd de mp3 onder ~5 MB, of gebruik een gecomprimeerde versie (128 kbps is voldoende).

---

## 4. Edit mode — direct in de browser bewerken

### Edit mode openen

| Situatie | Hoe |
|---|---|
| Op desktop | Kleine potlood-knop rechtsonder (subtiel grijs) |
| Op iPhone / tablet | Open de URL met `?edit=true` aan het einde: `https://…/index.html?edit=true` |

Klik op het potlood → **edit mode actief** (gele balk bovenaan, gestippelde kaders rond bewerkbare zones).  
Klik nogmaals → edit mode uit, alles weer schoon.

### Tekst aanpassen in edit mode

- Klik direct op **naam, rol, bericht, emoji** in de familiekaarten → typ
- Klik op een **reden** in de lijst → typ
- Klik op de **Hoi An tekst** of de **IFM-quote** → typ
- Wijzigingen worden **automatisch opgeslagen** in de browser (localStorage)

### Foto's toevoegen in edit mode

1. Zorg dat edit mode aan staat
2. Zweef over een foto-slot → je ziet een `＋ foto` hint
3. **Klik** op het slot → bestandskiezer opent
4. **Of sleep** een foto direct op het slot
5. Foto wordt automatisch verkleind naar max 1200 px en opgeslagen in de browser
6. Hover over een ingevuld slot → verschijnt een **×** knop om de foto te verwijderen

> Moodboard-foto's (IFM sectie) worden verkleind naar max 600 px zodat er meer in de opslag passen.

### Exporteren / publiceren

In edit mode (gele balk) verschijnen drie knoppen:

| Knop | Wat het doet |
|---|---|
| **Kopieer JSON** | Kopieert alle tekst + foto's (base64) als JSON naar je klembord. Bewaar dit als backup of om later te importeren via `localStorage.setItem('anna13-content', <json>)` in de browser console. |
| **Download HTML** | Genereert een `anna-birthday-published.html` met alles hard-coded. Dit bestand kun je committen naar GitHub Pages voor een permanente versie zonder localStorage. |
| **↺ Reset alles** | Verwijdert alle lokale bewerkingen. De standaard placeholder-teksten komen terug. ⚠ Niet ongedaan te maken. |

### localStorage resetten

Open de browser-console op de pagina (F12 → Console) en voer in:

```js
localStorage.removeItem('anna13-content')
```

Dan de pagina herladen (`F5`). Alles staat weer op de standaard placeholders.

---

## 5. Deployen op GitHub Pages

### Stap 1 — Maak een repository aan

1. Ga naar [github.com/new](https://github.com/new)
2. Naam bijv. `anna-birthday` (mag niet privé zijn voor gratis Pages)
3. Klik **Create repository**

### Stap 2 — Push de code

Open een terminal in de projectmap en voer uit:

```bash
git init
git add .
git commit -m "Anna's verjaardagswebsite"
git branch -M main
git remote add origin https://github.com/JOUW-GEBRUIKERSNAAM/anna-birthday.git
git push -u origin main
```

### Stap 3 — GitHub Pages inschakelen

1. Ga naar je repository → **Settings** → **Pages**
2. Onder *Source*: kies **Deploy from a branch**
3. Branch: `main` / Folder: `/ (root)`
4. Klik **Save**

Na ~60 seconden is de site live op:  
`https://JOUW-GEBRUIKERSNAAM.github.io/anna-birthday/`

---

## Kleurpalet (ter referentie)

| Naam | Hex |
|---|---|
| Crème achtergrond | `#F9F6F0` |
| Zwart | `#111111` |
| Paris-rood accent | `#C8102E` |
| Rosé goud | `#C9A96E` |
| Goud licht | `#EFE0C4` |
| Grijs (muted) | `#888888` |

---

*Made with ♥ by Tijn*
