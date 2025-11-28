# Projekty uživatele

## Fakturační aplikace (komponentová)
**Stav:** Téměř hotová, funkční
**Struktura:** 
- index.html (hlavní stránka s komponentovým systémem)
- styles.css (centralizované styly všech komponentů)  
- script.js (AppState, ComponentSystem, utility funkce)
- components/ složka:
  - header.js (hlavička se statistikami)
  - navigation.js (menu přepínání sekcí)
  - invoice-form.js (formulář s popup pro klienty)
  - invoice-list.js (seznam faktur s filtrováním)
  - invoice-card.js (kartička jednotlivé faktury)

**Aktuální funkce:**
- CRUD operace s fakturami
- Automatické generování čísel faktur (formát: 12024, 22024...)
- Datum vystavení + checkbox "minulý měsíc"
- Popup formulář pro klienty (název, adresa, IČO, DIČ)
- Výběr klienta z dropdown s náhledem
- localStorage pro faktury i klienty
- Responsivní design

## Technické preference
- České komentáře a UI texty
- Komponentová architektura
- Vysvětlení "pro začátečníka" s detailními komentáři
- Postupné vylepšování místo velkých změn
- CSS v centrálním souboru (styles.css), ne v komponentech
- Praktické funkce před vizuálním designem

## Coding style
- Jednoduché formáty (bez lomítek, nul: 12024 místo 001/2024)
- Kompaktní pole s typickou délkou (form-control-short)
- Logické seskupování funkcí
- Event-driven komunikace mezi komponenty

## Vlastní UI komponenty

### Dvouřádkový dropdown komponent
Vytvořili jsme vlastní dropdown místo HTML select pro zobrazení komplexnějších informací:

**HTML struktura:**
```html
<div class="custom-dropdown">
    <div class="dropdown-selected" onclick="toggleDropdown()">
        <div class="client-main-line">Hlavní text (tučně)</div>
        <div class="client-sub-line">Podřízený text (menší, šedý)</div>
        <div class="dropdown-arrow">▼</div>
    </div>
    <div class="dropdown-options">
        <div class="dropdown-option">
            <div class="option-main-line">Název + IČO</div>
            <div class="option-sub-line">Adresa</div>
        </div>
    </div>
</div>
```

**Klíčové CSS třídy:**
- `.custom-dropdown` - relativní kontejner
- `.dropdown-selected` - zobrazen výběr (border, padding, hover)
- `.client-main-line` / `.option-main-line` - první řádek (tučně)
- `.client-sub-line` / `.option-sub-line` - druhý řádek (menší, šedý)
- `.dropdown-options` - absolutní pozice, max-height s scroll
- `.dropdown-arrow` - rotace při otevření

**JavaScript funkcionalita:**
- `toggleDropdown()` - otevře/zavře
- `selectClient(client)` - vybere a zavře
- Automatické předvyplnění posledního záznamu
- Event handlers pro klikání mimo dropdown

Tento pattern lze použít kdykoliv potřebujeme dropdown s více informacemi než umožňuje standardní select.

## UX principy (KLÍČOVÉ pro budoucí úpravy)
**Praktičnost před okrasou:**
- Formulář má jen to co uživatel skutečně potřebuje
- Žádná zbytečná tlačítka (eliminovali jsme 🔄 generování čísla)
- Kompaktní pole s rozumnou délkou

**Intuitivní workflow:**
- Výběr klienta → náhled údajů → pokračování
- Popup jen když je potřeba přidat nového klienta
- Logické pořadí polí

**Minimalizace práce uživatele:**
- Automatické generování čísel faktur
- Checkbox "minulý měsíc" pro rychlé nastavení
- Uložení klientů pro opakované použití
- Automatické prepočítání dat splatnosti

**Jasné zpětné vazby:**
- Náhled klienta po výběru
- Validační zprávy, notifikace o akcích

**Zásady pro budoucí úpravy:**
1. Každá změna musí zjednodušovat workflow
2. Méně klikání = lepší UX
3. Vizuální zpětná vazba vždy
4. Progresivní disclosure (zobrazuj jen co je potřeba)
5. Praktické > estetické
6. **NIKDY nepřidávat tlačítko "vymazat vše" do formulářů** - uživatel nechce
7. **NIKDY nepoužívat potvrzovací hlášky** (confirm dialogy) - uživatel je nechce

## Plány do budoucna
- IndexedDB místo localStorage
- Export faktur do PDF
- Git workflow
- Další komponenty pro knihovnu