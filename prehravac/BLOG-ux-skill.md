# Blog/LinkedIn Article: Teaching AI to Design

## Working Title
"I taught AI to design — and it got better at it than my first attempt"

Alternative: "How a personal project turned into a UX design skill for Claude"

## Audience
UX designers, product people, and AI-curious professionals on LinkedIn

## Tone
Personal, honest, practical. Not a tutorial — a story with takeaways.

---

## Structure

### Hook (2-3 sentences)
First time I asked Claude to build a UI, it gave me something pretty. Colors matched, spacing was fine, buttons were where you'd expect them. But it had zero UX thinking. It was a design system without opinions.

### The Problem: AI Does UI, Not UX
- AI generates visually correct interfaces out of the box
- But "visually correct" is not "well designed"
- Missing: principles, trade-offs, domain knowledge
- Example: AI will happily build a cover grid for an audiobook library — because that's what Spotify/Audible look like. But is a cover grid actually good for *readers*?

### My Approach: Start with a Foundation, Then Add Opinions
- Picked GitLab Pajamas as base (proven design system, documented, vanilla CSS)
- Created a "skill" — a markdown file Claude reads before building any UI
- v1 had tokens + patterns + one principle I added: **"User does minimum, AI does maximum"**
- That principle alone didn't change much in practice. It was too abstract.

### The Turning Point: A Real Project
- Built an audiobook player (PWA) — not for a client, for myself
- Had books on two platforms, didn't like either player
- This forced REAL design decisions, not hypothetical ones

### How Design Decisions Became Principles
Each problem I solved in the player became a reusable principle in the skill:

**"Names are navigation"** (Principle 2: Interactive Metadata)
- I wanted to filter my library by narrator — because sometimes the voice matters more than who wrote the book
- So I made narrator names tappable → filter by that narrator
- Then author names. Then genre tags. Then series names.
- Generalized: every entity in a list should be tappable to filter/browse by it
- Now Claude applies this to any content-browsing interface automatically

**"Show enough to decide"** (Principle 1: Rich List Items)
- Original library showed book covers in a grid. Looked nice.
- But to know what a book was about, I had to tap into it. Every. Single. Time.
- Replaced with rich list items: title, author, narrator, series position, description, genre tags
- Generalized: list items must provide enough context to decide WITHOUT navigating to the detail view
- "Don't just show title + thumbnail and force the user to tap to learn more. That's lazy UX."

**"Series make sense"** (Principle 3: Series Awareness)
- 50 books from various series scattered as individual items
- Collapsed into 16 series cards with position: "Díl 3 z 7"
- Generalized: items in a sequence must show their position

**Sleep timer rewind** → Forgiving Software
- Set sleep timer to 30 minutes. Fall asleep. Wake up.
- Player offers to rewind exactly those 30 minutes. One tap.
- This is the forgiving software pattern: system recovers from the user's "mistake" (falling asleep)

**Offline just works** → "System handles errors, user does nothing"
- Other apps make you manually download books and delete them after
- Built 5-tier URL resolution with auto-prefetch and LRU eviction
- User does nothing. System does everything.

### The Skill Grew Organically
- v1 (Feb 11): 17KB — tokens + basic patterns
- v4 (Feb 13): 22KB — added 7 Content Browsing principles from player experience
- v5 (Feb 15): 24KB — added Auth & Onboarding from multi-user implementation
- components.md went through 28 versions in 4 days

### The Proof: It Transfers
- When Claude builds UI for a DIFFERENT project now, it automatically:
  - Makes metadata tappable (names are navigation)
  - Shows enough info in list items to decide without tapping
  - Groups sequential items and shows position
  - Preserves scroll position on filter changes
  - Uses toast+undo instead of confirmation dialogs
- These aren't hard-coded behaviors — they're principles Claude reads and applies contextually

### The Meta Insight
You don't teach AI by writing documentation. You teach it by solving real problems together and documenting what you learned.

The skill file isn't a spec I wrote upfront. It's a journal of design decisions that worked — distilled into reusable principles. Every principle has a story behind it. Every story started with a frustration.

---

## Potential Visuals
- Before/after: cover grid → rich list items (same screenshots as case study)
- Skill file diff: v1 vs v4 showing the Content Browsing section added
- Player screenshot showing interactive metadata (tappable narrator name)
- Timeline: 17KB → 24KB over 5 days

## Key Quotes for Pull-quotes
- "First time I asked Claude to build UI, it was pretty. But pretty isn't well-designed."
- "You don't teach AI by writing documentation. You teach it by solving real problems together."
- "Every principle in the skill has a story. Every story started with a frustration."
- "AI will happily build a cover grid — because that's what Spotify looks like. But is a cover grid actually good for readers?"

## Call to Action
Link to the case study on alesbrom.cz for the full player story.
Potentially link to the skill file itself (if making it public).
