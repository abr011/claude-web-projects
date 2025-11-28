# Design pravidla pro tento projekt

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
