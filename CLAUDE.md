# Design pravidla pro tento projekt

## Kdo jsme
Jsme zkušení UX designéři - vtipní, profesionální, používající mozek. Řešíme správný problém správným způsobem. Hledáme co odstranit, ne co přidat.

## Barvy
- Nepoužívat čistě bílou (#ffffff) - používat off-white (#fafafa)
- Nepoužívat čistě černou (#000000) - používat soft black (#1a1a1a)
- Zachovat dobrý kontrast

## Layout
- Žádné čáry/bordery mezi sekcemi a položkami - pracovat s white space
- Čistý minimalistický design
- Žádné ikony/emoji v UI (kromě případů kdy to má explicitní význam)
- U seznamů vždy zobrazovat počet položek v závorce např. "Čeká na Váš podpis (5)"
- Místo borderů používat mezery (margin/padding) pro vizuální oddělení

## Krokování (Step Indicators)
- **Vizuální styl**: Subtilní kroužky s čísly + text, vše v jednom řádku
- **Aktivní krok**: Černý kroužek (#1a1a1a) s bílým textem, tučný název
- **Neaktivní krok**: Šedý kroužek (#e0e0e0) se šedým textem (#999)
- **Velikost**: Malé kroužky 20x20px, font 13px
- **Umístění**: Nahoře na stránce s paddingem 40px
- **Konzistence**: Stejný vizuální styl napříč celou aplikací

### Pojmenování kroků
- **Registrace**: "Základní údaje" → "Potvrzení SMS"
- **Podepisování**: "Podepsání" → "Odeslání"
- **Princip**: Stručné (max 2 slova), jasné akce nebo obsah

## Chybové hlášky a validace
- **Tón**: Vždy zdvořilý a milý (používat "prosím", "zkontrolujte", "zdá se")
- **Přístup**: Nevyčítat chybu, ale nabídnout řešení
- **Konkrétnost**: Ukázat přesně co je potřeba zkontrolovat nebo opravit
- **Příklady**: Vždy uvést konkrétní příklad správného formátu
- **Délka**: Krátká, ale dostatečně informativní
- **Pocit**: Působit jako nápověda/tip, ne jako kárání
- **Příklad dobré hlášky**: "Zkontrolujte prosím @ a koncovku (např. jmeno@domena.cz)"
- **Vyvarovat se**: Příkazům ("Zadejte!", "Opravte!"), negativním slovům ("Chyba!", "Špatně!")

## GitHub
- Automaticky pushovat změny na GitHub po větších úpravách
- Repo: https://github.com/abr011/claude-web-projects
- GitHub Pages: https://abr011.github.io/claude-web-projects/
- **GitHub API token**: Uložen v `~/Dropbox/osobni/Claude/.git/config` v remote URL
- **Použití**: Vždy používat GitHub pro verzování a deployment projektů

## Demo GIF Generation
- **Dokumentace**: Kompletní návod v `prava/demo/README.md`
- **Regenerace**: `cd prava/demo && node capture-screenshots.js && python3 add-click-indicators.py && python3 composite-modal.py && python3 create-gif.py`

### Kritické body (co se pokazilo a jak to opravit)
1. **Karty se schovávaly při vyhledávání** → Odstranit filtrování karet v `renderPeopleCards()`, zobrazovat všechny karty vždy
2. **Karty se ořezávaly po přidání pills** → Nepoužívat fixed height, každý screenshot má dynamickou výšku podle obsahu
3. **Nebylo vidět kde uživatel kliká** → Přidat červené kroužky (click indicators) pomocí `add-click-indicators.py`
4. **Input neměl modrý focus border** → Explicitně kliknout na input před screenshotem: `await page.click('#searchField')`
5. **Modal zobrazoval celou stránku** → Použít two-layer compositing (base + modal overlay)

### Důležité
- **Vždy zobrazovat všechny karty** - nedělat filtrování v card gridu, jen v dropdownu
- **Dynamické výšky** - obsah roste (pills), screenshoty musí růst s ním
- **Click indicators jsou nezbytné** - bez nich je demo nesrozumitelné
