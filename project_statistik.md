# Projektnotizen: Statistik-Tutorial (Python/Pyodide)

**Letzte Aktualisierung:** 2026-04-21  
**Status:** Schritte 1–7 fertig. Schritt 8 läuft – zwei systemische Pyodide-Bugs entdeckt, noch nicht global gefixt.

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
- [x] **Schritt 7:** Aufgaben einbauen (10 Stück, Format siehe Aufgaben-Konzept)
- [ ] **Schritt 8:** Feinschliff – Theme, Navigation, Gesamttest
  - [ ] **8a (DRINGEND):** `palmerpenguins`-Import global fixen – in allen `{pyodide-python}`-Blöcken ersetzen durch `pyodide.http.open_url` + `pd.read_csv`
  - [ ] **8b (DRINGEND):** `plt.tight_layout()` aus allen `{pyodide-python}`-Blöcken entfernen (crasht in Pyodide)
  - [ ] **8c:** Aufgabenqualität prüfen – User sieht noch keine guten Aufgaben überall
  - [ ] **8d:** Theme, Navigation, Gesamttest

---

## Aufgaben-Implementierungsstand (Schritt 7)

**Strategie:**
- 1.1, 1.2, 1.3: Bestehende `# Aufgabe:` Kommentarblöcke upgraden (Lösung ausblenden, Tipps hinzufügen)
- 1.4, 1.5, 1.6, 2.1, 2.4, 2.5: Neue `.theorem .exercise` Blöcke einfügen (vor `## Zusammenfassung`)

**Achtung:** Die bestehenden `{#exr-...}` Crossref-Blöcke in 1.4, 1.5, 1.6 usw. zeigen Lösungen direkt – diese NICHT anfassen. Nur die `# Aufgabe:`-Blöcke upgraden und neue Blöcke hinzufügen.

### 1.1 statistische_untersuchung.qmd

**Einfügestelle:** Zeilen 281–299 – vorhandener `{pyodide-python}` Block mit `# Aufgabe:` Kommentar  
**Aktion:** Ersetzen durch `.theorem .exercise` Block (Lösung aus Block entfernen → in `callout-caution` verstecken)  
**Thema:** Schnabellänge klassieren mit `pd.cut()` in 3 Klassen: kurz=(30,40], mittel=(40,50], lang=(50,60]  
**Tipp 1:** `pd.cut()` nimmt `bins=` und `labels=` als Parameter  
**Tipp 2:** `value_counts().sort_index()` zeigt die Häufigkeiten geordnet  
**Lösung:**
```python
import pandas as pd
from palmerpenguins import load_penguins
penguins = load_penguins()
penguins["schnabelklasse"] = pd.cut(
    penguins["bill_length_mm"],
    bins=[30, 40, 50, 60],
    labels=["kurz", "mittel", "lang"]
)
print(penguins["schnabelklasse"].value_counts().sort_index())
```

### 1.2 haeufigkeitsverteilung.qmd

**Einfügestelle:** Zeilen 181–191 – vorhandener `{pyodide-python}` Block mit `# Aufgabe:` Kommentar  
**Aktion:** Ersetzen durch `.theorem .exercise` Block  
**Thema:** Absolute und relative Häufigkeiten für `island` berechnen  
**Tipp 1:** `value_counts()` für absolute, `value_counts(normalize=True)` für relative Häufigkeiten  
**Tipp 2:** Mit `.round(3)` auf 3 Nachkommastellen runden  
**Lösung:**
```python
from palmerpenguins import load_penguins
penguins = load_penguins()
print(penguins["island"].value_counts())
print(penguins["island"].value_counts(normalize=True).round(3))
```

### 1.3 grafische_darstellungen.qmd

**Einfügestelle:** Zeilen 111–129 – vorhandener `{pyodide-python}` Block mit `# Aufgabe:` Kommentar  
**Aktion:** Ersetzen durch `.theorem .exercise` Block  
**Thema:** Balkendiagramm für Merkmal `island` erstellen  
**Tipp 1:** Erst `value_counts()` aufrufen, dann `plt.bar(counts.index, counts.values)`  
**Tipp 2:** `plt.xlabel()`, `plt.ylabel()`, `plt.title()` für Beschriftung; `plt.tight_layout()` vor `plt.show()`  
**Lösung:**
```python
import matplotlib.pyplot as plt
from palmerpenguins import load_penguins
penguins = load_penguins()
counts = penguins["island"].value_counts()
plt.figure(figsize=(6, 4))
plt.bar(counts.index, counts.values, color=["steelblue","coral","seagreen"])
plt.xlabel("Insel"); plt.ylabel("Anzahl"); plt.title("Pinguine je Insel")
plt.tight_layout(); plt.show()
```

### 1.4 kennzahlen_lage.qmd

**Einfügestelle:** Vor `## Zusammenfassung` (ca. Zeile 744) – nach dem Boxplot-Block  
**Aktion:** 2 neue `.theorem .exercise` Blöcke einfügen  
**Aufgabe 1 – Lagemaße berechnen:**  
Thema: Für Schnabellänge (`bill_length_mm`) Mittelwert, Median und Modalwert berechnen, Ergebnisse vergleichen  
Tipp 1: `.mean()`, `.median()`, `.mode()[0]` für die drei Lagemaße  
Tipp 2: `groupby('species')` um artweise zu vergleichen  
**Aufgabe 2 – Mittelwert vs. Median:**  
Thema: Für Körpergewicht (`body_mass_g`) prüfen ob Mittelwert > Median (rechtsschiefe Verteilung). Gentoo-Pinguine rausfiltern und erneut vergleichen.  
Tipp 1: `penguins[penguins['species'] != 'Gentoo']` filtert Gentoo heraus  
Tipp 2: Bei rechtsschiefer Verteilung: Mittelwert > Median; bei linksschiefer: Mittelwert < Median

### 1.5 kennzahlen_streuung.qmd

**Einfügestelle:** Vor `## Zusammenfassung` (ca. Zeile 555) – nach Wölbungs-Abschnitt  
**Aktion:** 1 neuer `.theorem .exercise` Block  
**Thema:** Für `bill_length_mm`: Spannweite, IQR, Standardabweichung berechnen und interpretieren. Ist der IQR kleiner als die Spannweite – warum?  
Tipp 1: Spannweite = `max() - min()`, IQR = `.quantile(0.75) - .quantile(0.25)`, Std = `.std()`  
Tipp 2: `describe()` gibt alle Maße auf einen Blick

### 1.6 zweidimensional.qmd

**Einfügestelle:** Vor `## Zusammenfassung` (ca. Zeile 656) – nach dem Korrelation≠Kausalität-Abschnitt  
**Aktion:** 1 neuer `.theorem .exercise` Block  
**Thema:** Pearson-Korrelation zwischen Schnabellänge (`bill_length_mm`) und Schnabeltiefe (`bill_depth_mm`) berechnen – erst gesamt, dann nach Art (`species`). Simpson's Paradoxon erkennen.  
Tipp 1: `.corr()` oder `pearsonr()` für Korrelation; `groupby('species')` für gruppenweise Berechnung  
Tipp 2: Gesamt-r und art-spezifisches r können gegensätzliche Vorzeichen haben → das ist das Simpson-Paradoxon

### 2.1 schaetzer.qmd

**Einfügestelle:** Vor `## Zusammenfassung` (ca. Zeile 250)  
**Aktion:** 1 neuer `.theorem .exercise` Block  
**Thema:** Aus dem Pinguin-Datensatz (nur Chinstrap-Pinguine) die Parameter μ und σ des Körpergewichts schätzen. Dann 1000 simulierte Stichproben (n=20) ziehen und Histogramm der Schätzwerte erstellen.  
Tipp 1: `np.mean(x)` und `np.std(x, ddof=1)` für Punkt-Schätzer  
Tipp 2: `np.random.normal(mu_hat, sigma_hat, size=20)` für simulierte Stichproben; `.mean()` auf jede Stichprobe

### 2.4 konfidenzintervalle.qmd

**Einfügestelle:** Vor `## Zusammenfassung` (ca. Zeile 469)  
**Aktion:** 1 neuer `.theorem .exercise` Block  
**Thema:** 95%-Konfidenzintervall für die mittlere Schnabellänge (`bill_length_mm`) der Gentoo-Pinguine berechnen. Dann für 90% und 99% – wie verändert sich die Breite?  
Tipp 1: `stats.t.interval(confidence=0.95, df=n-1, loc=x_bar, scale=se)` mit `se = s/sqrt(n)`  
Tipp 2: `confidence=` Parameter ändern für verschiedene Niveaus; Breite = `hi - lo`

### 2.5 signifikanz_p_werte.qmd

**Einfügestelle:** Vor `## Zusammenfassung` (ca. Zeile 272)  
**Aktion:** 1 neuer `.theorem .exercise` Block  
**Thema:** Einstichproben-t-Test: Ist die mittlere Flossenlänge der Adélie-Pinguine signifikant verschieden von 190 mm? H0 formulieren, p-Wert berechnen, Entscheidung treffen.  
Tipp 1: `stats.ttest_1samp(daten, popmean=190)` gibt t-Statistik und p-Wert  
Tipp 2: `alpha = 0.05`; wenn `p <= alpha` → H0 ablehnen; Interpretation: "Die Daten liefern statistisch signifikante Evidenz, dass..."

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

## Aufgaben-Konzept (Schritt 8)

### Erkenntnisse aus Quellkursanalyse

**Matrizen-Tutorial** (Haupt-Stilreferenz):
- 1 Aufgabe pro Konzept, **nach** dem read-only Beispiel ("jetzt du")
- Schrittweise Anweisungen (1., 2., 3.)
- Collapse-Lösungen: `::: {.callout-caution title="Lösung" collapse="true"}`
- Collapse-Tipps: `::: {.callout-tip title="Tipp" collapse="true"}`
- Vorgabe-Code mit `# Dein Code hier`

**Kurvendiskussion-Tutorial**: 2-3 offene Aufgaben pro Seite, keine Musterlösungen, explorativer

**Statistik-Quellkurs (R)**: 4-6 formale Aufgaben, collapsible Tipps mit Code-Snippets

### Didaktisches Prinzip für dieses Tutorial

**Wo Aufgaben didaktisch wertvoll sind:**
1. Direkt nach einem read-only Demonstrationsblock → "jetzt dasselbe selbst"
2. Als Abschluss einer Seite → Konzepte synthetisieren
3. NICHT nach jeder kleinen Code-Demonstration

**Nicht wertvoll:**
- Mitten in laufenden Erklärungen (bricht den Fluss)
- Aufgaben die exakt das Beispiel wiederholen ohne Denkleistung
- Mehr als 2 Aufgaben pro Seite (wird lästig)

### Aufgaben-Format (festgelegt)

**Achtung:** `#| packages: ["palmerpenguins"]` funktioniert in Pyodide NICHT zuverlässig → stattdessen `pyodide.http.open_url` verwenden (Bug 8a). `plt.tight_layout()` crasht in Pyodide → weglassen (Bug 8b).

```markdown
:::: {.theorem .exercise}
#### Aufgabe: [Titel]

[1-2 Sätze Kontext, immer mit Palmer-Pinguinen]

**Aufgabe:**
1. Schritt 1...
2. Schritt 2...

```{pyodide-python}
import pandas as pd
from pyodide.http import open_url
penguins = pd.read_csv(open_url("https://raw.githubusercontent.com/allisonhorst/palmerpenguins/main/inst/extdata/penguins.csv"))

# Dein Code hier
```

::: {.callout-tip title="Tipp 1" collapse="true"}
[Richtungshinweis – welche Funktion/Ansatz]
:::

::: {.callout-tip title="Tipp 2" collapse="true"}
[Spezifischerer Hinweis – wie genau]
:::

::: {.callout-caution title="Minimale Lösung" collapse="true"}
```python
# Minimale Lösung
...
```
:::
::::
```

### Geplante Aufgaben pro Seite (10 gesamt – nicht lästig, aber präsent)

| Seite | Anzahl | Thema |
|-------|--------|-------|
| 1.1 Statistische Untersuchung | 1 | Merkmale klassifizieren & Häufigkeitsklassen bilden |
| 1.2 Häufigkeitsverteilung | 1 | Häufigkeitstabelle für neues Merkmal erstellen |
| 1.3 Grafische Darstellungen | 1 | Passenden Diagrammtyp wählen & erstellen |
| 1.4 Kennzahlen: Lage | 2 | Lagemaße berechnen + Mittelwert vs. Median vergleichen |
| 1.5 Kennzahlen: Streuung | 1 | Streuungsmaße berechnen + interpretieren |
| 1.6 Zweidimensional | 1 | Korrelation berechnen + einordnen |
| 2.1 Schätzer | 1 | μ und σ aus Stichprobe schätzen |
| 2.4 Konfidenzintervalle | 1 | KI für Schnabellänge berechnen |
| 2.5 Signifikanz | 1 | p-Werte interpretieren |

**Bestehende `# Aufgabe:`-Kommentarblöcke** in 1.1, 1.2, 1.3 werden auf das neue Format mit Tipps aufgewertet.

---

## Hinweise für neue Chat-Sessions

- Dieses Dokument vor jeder Arbeitssitzung lesen und danach aktualisieren
- Fertige Schritte in der Checkliste abhaken und unter "Aktueller Stand" dokumentieren
- Bei größeren Entscheidungen die Sektion "Technische Entscheidungen" ergänzen
