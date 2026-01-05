# Fluent UI Web Components - Instrukce pro použití

## 1. ZÁKLADNÍ INTEGRACE

### CDN Import (preferovaná metoda pro statické HTML)
Do `<head>` sekce každého HTML souboru přidat:

```html
<script type="module" src="https://unpkg.com/@fluentui/web-components"></script>
```

### Alternativa: npm instalace (pro build systémy)
```bash
npm install @fluentui/web-components
```

```javascript
import '@fluentui/web-components';
// nebo specifické komponenty:
import '@fluentui/web-components/button.js';
```

---

## 2. DOSTUPNÉ KOMPONENTY

### Tlačítka
```html
<!-- Varianty appearance: accent, neutral, outline, stealth -->
<fluent-button appearance="accent">Primary Action</fluent-button>
<fluent-button appearance="neutral">Secondary</fluent-button>
<fluent-button appearance="outline">Outline</fluent-button>
<fluent-button appearance="stealth">Stealth</fluent-button>
<fluent-button disabled>Disabled</fluent-button>
```

### Formulářové prvky
```html
<!-- Text Field -->
<fluent-text-field
    placeholder="Zadejte text"
    appearance="outline"
    required>
</fluent-text-field>

<!-- Email -->
<fluent-text-field
    type="email"
    placeholder="vas@email.cz"
    appearance="outline">
</fluent-text-field>

<!-- Number Field -->
<fluent-number-field
    placeholder="Číslo"
    min="0"
    max="100"
    appearance="outline">
</fluent-number-field>

<!-- Text Area -->
<fluent-text-area
    placeholder="Delší text..."
    rows="4"
    appearance="outline">
</fluent-text-area>

<!-- Select -->
<fluent-select appearance="outline">
    <fluent-option value="1">Možnost 1</fluent-option>
    <fluent-option value="2">Možnost 2</fluent-option>
    <fluent-option value="3">Možnost 3</fluent-option>
</fluent-select>

<!-- Combobox (searchable dropdown) -->
<fluent-combobox placeholder="Vyberte nebo zadejte">
    <fluent-option value="1">Možnost 1</fluent-option>
    <fluent-option value="2">Možnost 2</fluent-option>
</fluent-combobox>
```

### Výběrové prvky
```html
<!-- Checkbox -->
<fluent-checkbox checked>Zaškrtnuto</fluent-checkbox>
<fluent-checkbox>Nezaškrtnuto</fluent-checkbox>

<!-- Radio Group -->
<fluent-radio-group>
    <fluent-radio value="1" checked>Možnost 1</fluent-radio>
    <fluent-radio value="2">Možnost 2</fluent-radio>
    <fluent-radio value="3">Možnost 3</fluent-radio>
</fluent-radio-group>

<!-- Switch -->
<fluent-switch checked>Zapnuto</fluent-switch>
<fluent-switch>Vypnuto</fluent-switch>
```

### Karty
```html
<fluent-card>
    <h3>Nadpis karty</h3>
    <p>Obsah karty</p>
    <fluent-button appearance="accent">Akce</fluent-button>
</fluent-card>
```

### Dialog/Modal
```html
<fluent-button id="open-dialog">Otevřít dialog</fluent-button>

<fluent-dialog id="my-dialog" modal>
    <h3>Dialog nadpis</h3>
    <p>Obsah dialogu</p>
    <fluent-button id="close-dialog">Zavřít</fluent-button>
</fluent-dialog>

<script>
document.getElementById('open-dialog').addEventListener('click', () => {
    document.getElementById('my-dialog').hidden = false;
});
document.getElementById('close-dialog').addEventListener('click', () => {
    document.getElementById('my-dialog').hidden = true;
});
</script>
```

### Progress indikátory
```html
<!-- Progress Bar -->
<fluent-progress min="0" max="100" value="60"></fluent-progress>

<!-- Progress Ring (spinner) -->
<fluent-progress-ring></fluent-progress-ring>
<fluent-progress-ring value="75"></fluent-progress-ring>
```

### Oddělovače a Layout
```html
<!-- Divider -->
<fluent-divider></fluent-divider>

<!-- Tabs -->
<fluent-tabs>
    <fluent-tab>Tab 1</fluent-tab>
    <fluent-tab>Tab 2</fluent-tab>
    <fluent-tab-panel>Obsah Tab 1</fluent-tab-panel>
    <fluent-tab-panel>Obsah Tab 2</fluent-tab-panel>
</fluent-tabs>

<!-- Accordion -->
<fluent-accordion>
    <fluent-accordion-item>
        <span slot="heading">Sekce 1</span>
        Obsah sekce 1
    </fluent-accordion-item>
    <fluent-accordion-item>
        <span slot="heading">Sekce 2</span>
        Obsah sekce 2
    </fluent-accordion-item>
</fluent-accordion>
```

### Menu a Navigace
```html
<!-- Menu -->
<fluent-menu>
    <fluent-menu-item>Položka 1</fluent-menu-item>
    <fluent-menu-item>Položka 2</fluent-menu-item>
    <fluent-divider></fluent-divider>
    <fluent-menu-item>Položka 3</fluent-menu-item>
</fluent-menu>

<!-- Breadcrumb -->
<fluent-breadcrumb>
    <fluent-breadcrumb-item href="/">Home</fluent-breadcrumb-item>
    <fluent-breadcrumb-item href="/projekty">Projekty</fluent-breadcrumb-item>
    <fluent-breadcrumb-item>Aktuální stránka</fluent-breadcrumb-item>
</fluent-breadcrumb>
```

### Data Grid
```html
<fluent-data-grid>
    <fluent-data-grid-row row-type="header">
        <fluent-data-grid-cell cell-type="columnheader">Jméno</fluent-data-grid-cell>
        <fluent-data-grid-cell cell-type="columnheader">Email</fluent-data-grid-cell>
    </fluent-data-grid-row>
    <fluent-data-grid-row>
        <fluent-data-grid-cell>Jan Novák</fluent-data-grid-cell>
        <fluent-data-grid-cell>jan@example.com</fluent-data-grid-cell>
    </fluent-data-grid-row>
</fluent-data-grid>
```

### Badges a Avatary
```html
<!-- Badge -->
<fluent-badge appearance="filled">Nový</fluent-badge>
<fluent-badge appearance="ghost">5</fluent-badge>

<!-- Avatar -->
<fluent-avatar name="Jan Novák"></fluent-avatar>
<fluent-avatar
    name="Anna Nová"
    src="path/to/image.jpg">
</fluent-avatar>
```

---

## 3. DESIGN PRAVIDLA PRO TENTO PROJEKT

### Barvy (z CLAUDE.md)
```css
/* VŽDY používat tyto barvy místo čisté bílé/černé */
--background-color: #fafafa;  /* Off-white místo #ffffff */
--text-color: #1a1a1a;        /* Soft black místo #000000 */
--gray-text: #666;
--light-gray: #999;
--border-color: #e0e0e0;
```

### Styling Fluent komponent
```css
/* Fluent komponenty stylovat přes CSS custom properties nebo třídy */
fluent-button {
    /* Můžeme přepsat CSS vlastnosti */
}

fluent-card {
    padding: 24px;
    border-radius: 8px;
}

fluent-text-field,
fluent-text-area {
    width: 100%;
    max-width: 400px;
}
```

### Layout principy
- **Žádné bordery mezi sekcemi** - používat white space (margin/padding)
- **Čistý minimalistický design**
- **Žádné ikony/emoji v UI** (kromě explicitního významu)
- **U seznamů zobrazovat počet položek** - např. "Projekty (12)"
- **Místo borderů používat mezery** pro vizuální oddělení

---

## 4. PRAKTICKÉ VZORY A BEST PRACTICES

### Formulářový pattern s labels
```html
<div class="form-group">
    <label for="email-field">Email</label>
    <fluent-text-field
        id="email-field"
        type="email"
        placeholder="vas@email.cz"
        appearance="outline"
        required>
    </fluent-text-field>
</div>

<style>
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
}
</style>
```

### Card grid pattern
```html
<div class="card-grid">
    <fluent-card>
        <h3>Projekt 1</h3>
        <p>Popis projektu...</p>
        <fluent-button appearance="accent">Zobrazit</fluent-button>
    </fluent-card>
    <fluent-card>
        <h3>Projekt 2</h3>
        <p>Popis projektu...</p>
        <fluent-button appearance="accent">Zobrazit</fluent-button>
    </fluent-card>
</div>

<style>
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

fluent-card {
    padding: 24px;
}
</style>
```

### Button groups
```html
<div class="button-group">
    <fluent-button appearance="accent">Primární akce</fluent-button>
    <fluent-button appearance="neutral">Sekundární</fluent-button>
    <fluent-button appearance="outline">Zrušit</fluent-button>
</div>

<style>
.button-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}
</style>
```

### Responsive section pattern
```html
<div class="section">
    <h2>Nadpis sekce</h2>
    <p class="section-description">Popis sekce</p>

    <div class="section-content">
        <!-- Obsah -->
    </div>
</div>

<style>
.section {
    margin-bottom: 60px;
}

.section h2 {
    font-size: 28px;
    margin-bottom: 16px;
    color: #1a1a1a;
}

.section-description {
    color: #666;
    margin-bottom: 24px;
}
</style>
```

---

## 5. JAVASCRIPT INTERAKCE

### Event handling
```javascript
// Tlačítko
const button = document.querySelector('fluent-button');
button.addEventListener('click', () => {
    console.log('Clicked!');
});

// Input změny
const textField = document.querySelector('fluent-text-field');
textField.addEventListener('input', (e) => {
    console.log('Value:', e.target.value);
});

// Checkbox
const checkbox = document.querySelector('fluent-checkbox');
checkbox.addEventListener('change', (e) => {
    console.log('Checked:', e.target.checked);
});

// Radio group
const radioGroup = document.querySelector('fluent-radio-group');
radioGroup.addEventListener('change', (e) => {
    console.log('Selected:', e.target.value);
});
```

### Programatické nastavení hodnot
```javascript
// Nastavit hodnotu text fieldu
document.querySelector('fluent-text-field').value = 'Nová hodnota';

// Zaškrtnout checkbox
document.querySelector('fluent-checkbox').checked = true;

// Nastavit progress
document.querySelector('fluent-progress').value = 75;

// Zobrazit/skrýt dialog
const dialog = document.querySelector('fluent-dialog');
dialog.hidden = false; // zobrazit
dialog.hidden = true;  // skrýt
```

---

## 6. CHYBOVÉ HLÁŠKY A VALIDACE

Podle CLAUDE.md pravidel:

### Tón chybových hlášek
- **Vždy zdvořilý a milý** (používat "prosím", "zkontrolujte", "zdá se")
- **Nevyčítat chybu**, ale nabídnout řešení
- **Konkrétnost** - ukázat přesně co je potřeba opravit
- **Příklady** - vždy uvést konkrétní příklad správného formátu

### Implementace s Fluent UI
```html
<div class="form-group">
    <label for="email">Email</label>
    <fluent-text-field
        id="email"
        type="email"
        placeholder="vas@email.cz"
        appearance="outline"
        required>
    </fluent-text-field>
    <div class="error-message" id="email-error" style="display: none;">
        Zkontrolujte prosím @ a koncovku (např. jmeno@domena.cz)
    </div>
</div>

<style>
.error-message {
    color: #d13438;
    font-size: 14px;
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
}
</style>

<script>
const emailField = document.getElementById('email');
const errorMsg = document.getElementById('email-error');

emailField.addEventListener('blur', () => {
    if (!emailField.value.includes('@') || !emailField.value.includes('.')) {
        errorMsg.style.display = 'flex';
    } else {
        errorMsg.style.display = 'none';
    }
});
</script>
```

---

## 7. KOMPLETNÍ TEMPLATE PŘÍKLAD

```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Stránka s Fluent UI</title>

    <!-- Fluent UI Web Components -->
    <script type="module" src="https://unpkg.com/@fluentui/web-components"></script>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #fafafa;
            padding: 60px 20px;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
        }

        h1 {
            font-size: 42px;
            margin-bottom: 12px;
            color: #1a1a1a;
        }

        .subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 60px;
        }

        .section {
            margin-bottom: 60px;
        }

        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }

        fluent-card {
            padding: 24px;
        }

        .button-group {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Nadpis stránky</h1>
        <p class="subtitle">Podnadpis nebo popis</p>

        <div class="section">
            <h2>Sekce s kartami</h2>
            <div class="card-grid">
                <fluent-card>
                    <h3>Karta 1</h3>
                    <p>Obsah karty</p>
                    <fluent-button appearance="accent">Akce</fluent-button>
                </fluent-card>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## 8. RYCHLÁ REFERENCE

### Nejpoužívanější komponenty:
1. `<fluent-button>` - tlačítka
2. `<fluent-card>` - karty pro obsah
3. `<fluent-text-field>` - textové vstupy
4. `<fluent-checkbox>` - checkboxy
5. `<fluent-dialog>` - modální okna

### Nejpoužívanější attributes:
- `appearance` - vizuální styl (accent, neutral, outline, stealth)
- `disabled` - deaktivovat prvek
- `checked` - zaškrtnout (checkbox, radio, switch)
- `value` - hodnota prvku
- `placeholder` - placeholder text
- `required` - povinné pole

### CSS Custom Properties pro theming:
Fluent UI používá CSS custom properties, které můžete přepsat pro vlastní theming.

---

## 9. UŽITEČNÉ ODKAZY

- **Oficiální dokumentace**: https://learn.microsoft.com/en-us/fluent-ui/web-components/
- **Quickstart**: https://learn.microsoft.com/en-us/fluent-ui/web-components/getting-started/quick-start
- **Komponenty přehled**: https://learn.microsoft.com/en-us/fluent-ui/web-components/components/overview
- **GitHub**: https://github.com/microsoft/fluentui
- **Storybook**: https://storybooks.fluentui.dev/web-components/
- **npm**: https://www.npmjs.com/package/@fluentui/web-components

---

## 10. TROUBLESHOOTING

### Komponenty se nezobrazují
- Zkontrolovat, že je `<script type="module">` v `<head>`
- Zkontrolovat konzoli v DevTools pro chyby
- Ověřit, že používáte správné názvy tagů (např. `fluent-button`, ne `fluent-btn`)

### Styling nefunguje
- Fluent komponenty jsou Web Components (Shadow DOM)
- Některé CSS vlastnosti lze stylovat přes CSS custom properties
- Vnější padding/margin funguje normálně
- Pro vnitřní styling použít CSS custom properties nebo part attributes

### JavaScript události nefungují
- Používat standardní DOM události (`click`, `input`, `change`)
- Pro custom elementy používat `querySelector` nebo `getElementById`
- Ověřit, že element existuje v DOM před připojením event listeneru

---

## DŮLEŽITÉ POZNÁMKY

1. **Vždy používat CDN import** pro statické HTML projekty (jednodušší, žádný build)
2. **Dodržovat design pravidla** z CLAUDE.md (off-white, soft black, žádné bordery)
3. **Chybové hlášky vždy zdvořilé** a konstruktivní
4. **Vždy verifikovat v Chrome** pomocí DevTools před finalizací
5. **Komponenty jsou webové standardy** - fungují všude bez frameworku
