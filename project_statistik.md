# Projektnotizen: Statistik-Tutorial (Python/Pyodide)

**Letzte Aktualisierung:** 2026-04-20  
**Status:** Schritte 1–6 fertig – Kapitel 1: index, 1.1–1.6 fertig; Kapitel 2: index, 2.1–2.4 fertig; Kapitel 3: index, 3.1–3.8 fertig

---

## Ziel

Ein auf Python basierendes Statistik-Tutorial im Quarto-Website-Stil erstellen.  
Zielordner: `D:\Whb\Git-Projekte\Claude Statikstik\`

---

## Quellmaterial

| Ordner | Inhalt |
|--------|--------|
| `D:\Whb\Git-Projekte\grundlagen-der-statistik-mit-r\` | Original R-basiertes Skript (vollständig, 5 Kapitelgruppen) |
| `D:\Whb\DigStat\` | Ergänzendes Quellmaterial (deskriptiv, regression, schätztheorie) |
| `D:\Whb\Git-Projekte\tutorials\Statistik\` | Bereits begonnene Python-Umsetzung (Quarto, Pyodide, unvollständig) |

### Kapitelstruktur Quelle (R-Skript)

- `kapitel_r/` – R-Grundlagen (r_0 bis r_4) → wird zu **Python-Grundlagen** (bereits als `grundlagen.qmd` vorhanden)
- `kapitel_deskriptiv/` – deskriptiv_0 bis deskriptiv_6 (7 Dateien)
- `kapitel_schaetztheorie/` – schaetztheorie_0 bis schaetztheorie_4 (5 Dateien)
- `kapitel_hypothesentests/` – hypothesentests_0 bis hypothesentests_9 (10 Dateien)
- `kapitel_regression/` – **wird erstmal weggelassen** (Fokus auf Schul-/Abi-Statistik)

---

## Vorhandenes im Statistik-Tutorial (`tutorials\Statistik`)

- `_quarto.yml` mit Website-Struktur (Kapitel 1 = Deskriptive Statistik, Kapitel 2 noch leer)
- `grundlagen.qmd` – Python-Grundlagen mit Pyodide-Codeblöcken (read-only)
- `Kapitel 1/` – deskriptiv_0 bis deskriptiv_6 (teilweise umgesetzt)
- Nutzt Pyodide (`filters: [pyodide, quizdown]`)
- Nutzt `Theme/morph_custom.scss` + `slate_custom.scss` (light/dark)
- crossref-Aliase: Definition, Beispiel, Aufgabe, Theorem

---

## Stilvorlagen

### Matrizen-Tutorial (`tutorials\Matrizen`)
- Quarto Website, floating sidebar mit `collapse-level: 1`
- Verschachtelte Sections (z.B. `section: "1. Vektoren"` mit Unterseiten `1.1`, `1.2` etc.)
- Theme: `morph` (light) / `slate` (dark), `respect-user-color-scheme: true`
- `reader-mode: true`, `search: true`, GitHub-Icon in Navbar
- `code-tools: true`, `toc: true`

### Kurvendiskussion-Tutorial (`tutorials\Kurvendiskussion`)
- Eigene SCSS-Dateien (`morph_custom.scss`, `slate_custom.scss`, `styles.css`)
- Ebenfalls Quarto Website, jede Sektion hat eigene `.qmd`-Datei

### Theme-Ordner (`Claude Statikstik\Theme\`)
- Enthält: `morph_custom.scss`, `slate_custom.scss`, `Icons/`
- `morph_custom.scss`: Navy-Fließtext (`#000080c1`), Überschriften gold (`#b8aa6e`), rote Blockquote-Ränder

---

## Zielstruktur

```
Claude Statikstik/
├── _quarto.yml                  ← Projektkonfiguration (output-dir: docs)
├── index.qmd                    ← Startseite (muss am Root bleiben für GitHub Pages)
├── Theme/
│   ├── morph_custom.scss
│   ├── slate_custom.scss
│   └── Icons/
├── _extensions/                 ← Pyodide, Quizdown, JSXGraph
├── docs/                        ← Build-Output (GitHub Pages)
└── qmd/                         ← ALLE anderen qmd-Dateien
    ├── grundlagen.qmd
    ├── kapitel_deskriptiv/
    │   ├── index.qmd
    │   ├── statistische_untersuchung.qmd
    │   ├── haeufigkeitsverteilung.qmd
    │   ├── grafische_darstellungen.qmd
    │   ├── kennzahlen_lage.qmd
    │   ├── kennzahlen_streuung.qmd
    │   └── zweidimensional.qmd
    ├── kapitel_schaetztheorie/
    │   ├── index.qmd
    │   ├── schaetzer.qmd
    │   ├── schaetzmethoden.qmd
    │   ├── guetekriterien.qmd
    │   └── konfidenzintervalle.qmd
    └── kapitel_hypothesentests/
        ├── index.qmd
        ├── signifikanz_p_werte.qmd
        ├── gauss_test.qmd
        ├── t_test_einstichprobe.qmd
        ├── t_test_unverbunden.qmd
        ├── t_test_verbunden.qmd
        ├── f_test.qmd
        ├── mann_whitney.qmd
        └── chi_quadrat.qmd
```
*Regression: weggelassen. `index.qmd` bleibt am Root – Quarto/GitHub Pages braucht `docs/index.html` als Einstiegspunkt.*

**Anmerkung:** Genaue Dateinamen/Unterstruktur wird beim Umsetzen pro Kapitel festgelegt.

---

## Technische Entscheidungen (festgelegt)

- **Quarto Website** (kein Book) – wie Matrizen-Tutorial
- **Pyodide** für interaktive Python-Codeblöcke der Studierenden. Pyodide kann grundsätzlich fast alles – Ausnahme: Animationen und ähnliche komplexe Ausgaben gehen nicht (wird fallweise geklärt).
- **Plots/Grafiken:** Für schöne/komplexe Darstellungen normales Python mit verstecktem Code (`echo: false`) rendern. Für einfache studentische Übungen auch Pyodide möglich.
- **KI-Feedback:** Feedback-Button bereits in der Pyodide-Extension eingebaut (wie in Matrizen/Kurvendiskussion). System-Prompt mit dem Seiten-Skript wird mitgeschickt. Keine zusätzliche Integration nötig.
- **Python-Einführung:** Eine eigene Grundlagenseite am Anfang (`grundlagen.qmd`), NICHT auf jeder Unterseite. Optionale Hilfe für Studis ohne Python-Vorkenntnisse.
- **Erklärungsstruktur:** Die Struktur der Quellen (R-Skript / DigStat) ist bereits gut und dient als Leitfaden. Inhalt wird übernommen und ggf. gestrafft, aber nicht komplett umstrukturiert.
- **Anfänger-freundlichkeit: EXTREM WICHTIG** – Schulniveau (Abi-Vorbereitung und etwas darüber hinaus), keine Vorannahmen außer Grundmathematik. Erklärungen immer zuerst inhaltlich, dann Python.
- **Sidebar** mit verschachtelten Sections (collapse-level: 1), wie Matrizen
- **Light/Dark** Theme: `morph` + `slate` mit Custom SCSS aus `Theme/`
- **crossref** Aliase wie im Original (Definition, Beispiel, Aufgabe, Theorem)
- **Sprache:** Deutsch (`lang: de`)
- **Quizdown** am Ende jedes Kapitels für Wissensüberprüfung (filters: quizdown in YAML)
- **JSXGraph** für interaktive mathematische Visualisierungen (Normalverteilungskurven, p-Wert-Illustration, Konfidenzintervalle etc.). Syntax: ` ```{.jsxgraph width="400"} `. Extension installiert unter `_extensions/jsxgraph/`.
- **Datensatz:** Palmer Penguins (bereits im Quellmaterial vorhanden)
- `execute: eval: false` für Pyodide-Seiten; für reine Darstellungsplots `eval: true, echo: false`

### Custom Callout-Typen (in SCSS definiert)

| Klasse | Icon | Verwendung |
|--------|------|------------|
| `.callout-python` | python.svg | Python-spezifische Tipps/Hinweise |
| `.callout-rechnen` | pencil.svg | Rechenhinweise, mathematische Schritte |
| `.callout-tip` | Quarto-builtin | Allgemeine Tipps |
| `.callout-caution` | Quarto-builtin | Häufige Fehler / Vorsicht |

---

## Arbeitsschritte

- [x] **Schritt 1:** `_quarto.yml` für den Zielordner anlegen (inkl. SCSS-Callouts, Extensions)
- [x] **Schritt 2:** `index.qmd` Startseite erstellen
- [x] **Schritt 3:** `grundlagen.qmd` – Python-Basics (aufklappbar) + Statistik-Bibliotheken (numpy, pandas, matplotlib, scipy)
- [x] **Schritt 4:** Kapitel 1 – Deskriptive Statistik umsetzen (R → Python, pro Unterkapitel)
  - [x] `kapitel_deskriptiv/index.qmd`
  - [x] `kapitel_deskriptiv/statistische_untersuchung.qmd` (1.1)
  - [x] `haeufigkeitsverteilung.qmd` (1.2)
  - [x] `grafische_darstellungen.qmd` (1.3)
  - [x] `kennzahlen_lage.qmd` (1.4)
  - [x] `kennzahlen_streuung.qmd` (1.5)
  - [x] `zweidimensional.qmd` (1.6)
- [x] **Schritt 5:** Kapitel 2 – Schätztheorie umsetzen
  - [x] `kapitel_schaetztheorie/index.qmd`
  - [x] `schaetzer.qmd` (2.1)
  - [x] `schaetzmethoden.qmd` (2.2)
  - [x] `guetekriterien.qmd` (2.3)
  - [x] `konfidenzintervalle.qmd` (2.4)
- [x] **Schritt 6:** Kapitel 3 – Hypothesentests umsetzen
  - [x] `kapitel_hypothesentests/index.qmd`
  - [x] `signifikanz_p_werte.qmd` (3.1)
  - [x] `gauss_test.qmd` (3.2)
  - [x] `t_test_einstichprobe.qmd` (3.3)
  - [x] `t_test_unverbunden.qmd` (3.4)
  - [x] `t_test_verbunden.qmd` (3.5)
  - [x] `f_test.qmd` (3.6)
  - [x] `mann_whitney.qmd` (3.7)
  - [x] `chi_quadrat.qmd` (3.8)
- [ ] **Schritt 7:** Feinschliff – Theme, Navigation, Gesamttest

---

## Datensatz

**Palmer Penguins** wird als roter Faden genutzt (liegt bereits im Quellmaterial vor: `kapitel_schaetztheorie/palmerpenguins.png`, `penguins.png` etc.).

---

## Quizdown-Syntax (Referenz)

Drei Fragetypen, alle in ` ```{quizdown} ` Blöcken:

**Multiple Choice** (mehrere richtig, ungeordnete Liste):
```markdown
### Frage?
- [x] Richtige Antwort
- [ ] Falsche Antwort
    > Kommentar zur falschen Antwort
```

**Single Choice** (genau eine richtig, geordnete Liste):
```markdown
### Frage?
1. [ ] Falsch
1. [x] Richtig
    > Kommentar zur richtigen Antwort
1. [ ] Falsch
```

**Sequence** (Reihenfolge per Drag&Drop):
```markdown
## Bringe in die richtige Reihenfolge!
1. Erster
2. Zweiter
3. Dritter
```

**Wichtig:** Blockquotes `>` nach einer Frage = aufklappbarer Hinweis. Blockquotes nach einer Antwort = Kommentar (erscheint auf Ergebnisseite). **Vor dem Hinweis muss ein Absatz (Leerzeile) stehen**, sonst wird er nicht korrekt gerendert. Zur Sicherheit zusätzlich doppeltes Leerzeichen am Ende der letzten Antwortzeile.

---

## Hinweise für neue Chat-Sessions

- Dieses Dokument vor jeder Arbeitssitzung lesen und danach aktualisieren
- Fertige Schritte in der Checkliste abhaken und unter "Aktueller Stand" dokumentieren
- Bei größeren Entscheidungen die Sektion "Technische Entscheidungen" ergänzen
