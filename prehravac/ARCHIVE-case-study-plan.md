# Archive: Case Study Plan + Source Materials

## Original Case Study Plan (pre-rewrite)

**Angle**: "Design for yourself" — when you're both designer and user, you can challenge every convention because there's no client to convince.

**Format**: English only. Same HTML structure as existing case studies (dark theme, split before/after, insight section).

**Structure**: Hero "When the Designer Is the User" → Before "The Starting Point" (cover grid, Spotify clone) → After "Designed for How Readers Think" (rich list, pill controls, 30-min seek) → Insight "The Advantage of Designing for Yourself" → Footer

**Key decisions documented**: Typography over thumbnails, Series grouping (50→16 cards), 30-minute seek window, Everything is a link, Metadata is UX, Offline-first

**Insight box**: "Personal projects aren't portfolio filler. They're where you practice the hardest UX skill: killing your own ideas."

---

## User's Authentic Text (raw, unedited)

> actually my problem was that i had books on two platforms audiolibrix that i stopped using because i didnt like the way it is done - from my point of view key feature is to listen to book and it feels like the guys who made it are surprised with that use case so if you wanna play the book first thing after pushing play is popup bitching at you that you didnt download anything. the one i am using now - audioteka is better but im often out of internet and player is sensitive to that. yes, you can download the book but it requires actions and then you need to remember to delete the book. what im missing is filtering by narrator which is in some cases even more important than the author. i also dont like descriptions of the books as there is too much clutter around description itself, i dont like verzalky/capslock and it is also hard to find out what part of the series you are looking at or listening to, even it got better recently so you can see the list of books in serie.
>
> i wanted to find out what i can create with ai and i wanted to create and improve ux design skill on real project that is beyond my comprehension. even ai didnt want me to start such a thing, said i should use existing platform. but i didnt like the players.
>
> what was nice surprise first version of the player had progress bar with padding on both ends so that dot was grabbable. i also hate the players play chapters so sometimes progress bar represents 8 min and sometimes 3 hours. what chapter im listening to is meaningless as i want to know how long book takes and what time is left. well when i read book i need to know what page i ended reading on and im one of men who ohyba rohy, which is luckily unnecessary in electronic player.
>
> and im not the only one who uses sleep feature and once woke up i rewind (or i would like to) the exact time i set sleep to. but usually i cant because of chapters.
>
> i was really worry if ill be able to do at least something and technical problems were hardest or took longest time as i dont understand to technological problems but we got to the point that i have access to playable books from both platforms, of course ai helped with description of series and book itself and tagging. there are probably still discrepancies but if than in tag "romance" not in "sci fi" or "fantasy".
>
> after first day i went to bed with headphones on listening to adventures of cptn harrington and im telling you i almost broke into tears when i put airplane mode and i still played.
>
> after a good fight with myself i added profiles, mostly because my friends use the same platform so merging accounts and player that works sounded like fine combo. and as it is possible to listen on web and in app i hope it is fine that me and my girlfriend can listen to what i have, so some kind of profiles were needed from beginning.
>
> im not sure what ux principles we used and added. maybe in general i focused on key usecase and on what is important for me, so potlacene pictures, no speed options, sleep preset to 30 min, option to rewind 28 minutes - will be tested. whats maybe missing is rating the books and narrators (doesnt exist in apps or is hidden). sure rating will be 0-5, filtering allowed only for 4+ and you can bet Jakub Saic will have 6 hardcoded moreover anything read by him will be in recommended news even it was for 4 years olds

---

## UX Skill Evolution (from ~/.claude/file-history/)

Source: Claude Code session-based file versioning

### v1 — Feb 11 (Foundation, 16,950 bytes)
Started as "pure UI" — design system based on GitLab Pajamas. What was there from day one:
- **Design tokens**: colors (WCAG AA), spacing scale, typography, border radius
- **Forgiving Software**: no confirmation dialogs, reversible actions with undo toast, archive instead of delete
- **Data display**: cards vs lists, no tables
- **Forms**: input width = content hint (xs/sm/md), labels above, inline validation
- **Dropdown avoidance**: <5 options → pills/radio, 5+ → rich dropdown with subtext
- **Minimalist design**: no borders/lines (whitespace only), no icons/emoji unless functional
- **"Heading or Separator, Never Both"** — single visual boundary mechanism
- **AI-Assisted UX**: "User does minimum, AI does maximum" — the ONE principle added from the start
- **Exceptions**: inline "or" divider, drop zone, filter pills with dual meaning
- **Error messages**: polite tone, offer solutions not blame, always include format example

### v2 — Feb 12 (Accessibility + Responsive, 21,111 bytes)
Added as Claude built actual pages:
- **Accessibility**: keyboard nav, ARIA attributes, screen reader text (.sr-only)
- **Responsive design**: breakpoints, responsive grid, 44px touch targets

### v3 — Feb 12 (Minor refinements, 21,207 bytes)
Small text tweaks.

### v4 — Feb 13 (Content Browsing UX, 21,851 bytes) ← BIGGEST addition
Born directly from building the audiobook library. 7 principles:
1. **Rich List Items** — "Show enough to decide without navigating" (= library showing title, author, narrator, description, tags, series position instead of just covers)
2. **Interactive Metadata** — "Names are navigation" (= tap narrator → filter library)
3. **Series & Sequence Awareness** — "Must show position" (= "Díl 3 z 7")
4. **Content Preview** — "Describe what it's about" (= descriptions visible in list, not behind a tap)
5. **Contextual Suggestions** — "Discovery through context" (= related books in detail view)
6. **Active Filters with Dismissible Chips** — visible filter state
7. **Scroll Position Preservation** — "Stay where you were"

### v5 — Feb 15 (Authentication & Onboarding, 23,830 bytes)
Added when implementing Firebase Auth for multi-user access:
- **Lazy Registration**: don't block exploration with login wall, progressive access levels (Guest → Email → Linked)
- **Persistent Sessions**: once authenticated, keep logged in indefinitely, silent token refresh

### Also: components.md (28 versions, Feb 11-14)
Component library evolved rapidly — 28 versions as each feature added copy-paste-ready HTML/CSS patterns.
