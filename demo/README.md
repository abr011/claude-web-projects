# Share Form Demo - Animated GIF Walkthrough

## Overview
This directory contains scripts to generate an animated GIF demonstrating the document sharing form functionality. The demo shows a 7-step user interaction flow with visual click indicators.

## What We Built
An automated screenshot capture and GIF generation system that:
- Captures 7 steps of user interaction with the share form
- Adds visual click indicators to show where user interacts
- Handles dynamic page heights (content grows as pills are added)
- Composites a modal overlay for the final step
- Generates a clean animated GIF (560px wide, 2 seconds per frame)

## File Structure

```
demo/
├── README.md                      # This documentation
├── capture-screenshots.js         # Puppeteer script to capture screenshots
├── add-click-indicators.py        # Adds red circle indicators to show clicks
├── composite-modal.py             # Composites modal overlay on base screenshot
├── create-gif.py                  # Combines all screenshots into animated GIF
├── step-01.png through step-07.png # Generated screenshots
├── step-07-base.png              # Base screenshot without modal
├── step-07-modal-full.png        # Full viewport screenshot with modal
└── share-form-demo.gif           # Final output
```

## The 7 Steps

1. **Empty state** - Focused input field (blue border), click indicator on input
2. **Typing** - "Anna" typed in search field
3. **Autocomplete** - Dropdown showing "Anna Svobodová", click indicator on item
4. **First selection** - Anna pill added, click indicator on "Petr Dvořák" card
5. **Second selection** - Both Anna and Petr pills showing, both cards selected
6. **Permissions** - Checkboxes checked, click indicator on "Upravit individuální oprávnění" link
7. **Modal** - Individual permissions modal overlay centered on page

## Key Problems Encountered & Solutions

### Problem 1: Cards Being Filtered/Hidden
**Issue:** When user typed "Anna" in the search field, the `renderPeopleCards()` function was filtering cards and hiding non-matching ones with a `.hidden` class (`display: none`). This resulted in only matching cards being visible in screenshots.

**Solution:** Modified `/Users/alesbrom/Documents/Projekty/osobni-web/prava/share-form-v7.html` line 715:
```javascript
// BEFORE: Cards were filtered based on search term
function renderPeopleCards(filter = '') {
    // ... code that added 'hidden' class to non-matching cards
}

// AFTER: Always show all cards - filtering only affects dropdown
function renderPeopleCards(filter = '') {
    cards.innerHTML = people.map(person => {
        return `
            <div class="person-card ${selectedPeople.has(person.id) ? 'selected' : ''}"
                 data-id="${person.id}">
            // No 'hidden' class applied
        `;
    }).join('');
    availableCount.textContent = `(${people.length})`; // Always show total count
}
```

### Problem 2: Bottom Cards Cropped After Pills Added
**Issue:** Initially used a fixed height (575px) for all screenshots. When pills were added (steps 4-6), the page grew vertically but screenshots were cropped to the same height, cutting off bottom cards.

**Solution:** Removed fixed height constraints - let each screenshot capture its actual full container height:
```javascript
// In capture-screenshots.js:
const takeContainerScreenshot = async (filename) => {
    const container = await page.$('.container');
    const box = await container.boundingBox();

    // Use actual container height, not fixed value
    const clipBox = {
        x: Math.max(0, box.x - paddingLeft),
        y: Math.max(0, box.y - paddingTop),
        width: box.width + paddingLeft + paddingRight,
        height: box.height + paddingTop + paddingBottom  // Dynamic height
    };

    await page.screenshot({ path: filename, clip: clipBox });
};
```

### Problem 3: No Visual Indication of User Interactions
**Issue:** Screenshots showed state changes but not WHERE the user clicked, making it hard to understand the interaction flow.

**Solution:** Created `add-click-indicators.py` to overlay semi-transparent red circles at click positions:
```python
click_indicators = [
    (1, 300, 167, "Click input field"),
    (3, 280, 243, "Click autocomplete item"),
    (4, 495, 352, "Click person card"),
    (6, 457, 218, "Click link"),
]

# Draws:
# - Outer circle: Red with transparency (radius 30px)
# - Inner dot: Solid red (radius 6px)
```

### Problem 4: Input Field Focus Border Not Blue
**Issue:** Input field had gray focus border instead of blue.

**Solution:** The CSS already had `--primary: #0078d4` (blue) defined, but the input wasn't focused in step 1. Fixed by explicitly clicking the field:
```javascript
// Step 1: Empty state with focused input
await page.click('#searchField');  // Focus the input to show blue border
await delay(300);
await takeContainerScreenshot('step-01.png');
```

### Problem 5: Modal Screenshot Showing Full Page
**Issue:** Modal screenshot needed to show a focused/cropped view, not the entire page with modal at the top.

**Solution:** Two-layer compositing approach:
1. Capture base page (full container) WITHOUT modal → `step-07-base.png`
2. Open modal and capture full viewport → `step-07-modal-full.png`
3. Use Python PIL to:
   - Add dark overlay (40% opacity) to base
   - Extract modal portion (520x450) from center of full viewport
   - Paste centered modal onto base
   - Result: Modal appears centered over the page content

### Problem 6: Captions Getting Cropped on Longer Frames
**Issue:** When adding text captions to screenshots with different heights (content grows when pills are added), captions on taller frames were getting cropped when creating the GIF. Each frame had different dimensions, so when resized for the GIF, caption bars were inconsistently positioned and often cut off.

**Why it happened:**
- Step 1-3: Page height ~575px (no pills)
- Step 4-7: Page height grows with each pill added
- Adding 60px caption bar to each frame resulted in different total heights
- When creating GIF, frames were resized inconsistently, cropping captions on taller frames

**Solution:** Normalize all frames to maximum height BEFORE adding captions:
```python
# 1. Find the tallest screenshot
max_height = 0
for screenshot in all_screenshots:
    if screenshot.height > max_height:
        max_height = screenshot.height

# 2. Normalize all frames to max height (pad shorter ones)
normalized = Image.new('RGB', (width, max_height), color=(250, 250, 250))
normalized.paste(original_screenshot, (0, 0))

# 3. THEN add caption bar at bottom
captioned = Image.new('RGB', (width, max_height + caption_height))
captioned.paste(normalized, (0, 0))
# Add caption bar at consistent position: max_height
```

**Result:** All frames have same dimensions (780x635), captions always at same position, no cropping.

**Caption styling:**
- Font: Helvetica Bold, 20px
- Background: Soft black (#1a1a1a) bar, 60px height
- Text: White, centered

**Script:** `add-captions-normalized.py`

## How to Regenerate

### Version WITHOUT Captions (Original)

Run these commands in sequence:

```bash
# 1. Capture all screenshots (steps 1-6 complete, step 7 creates base + modal-full)
node capture-screenshots.js

# 2. Add click indicators to steps 1, 3, 4, 6
python3 add-click-indicators.py

# 3. Composite modal (creates step-07.png from base + modal)
python3 composite-modal.py

# 4. Generate final GIF
python3 create-gif.py
```

Or run all at once:
```bash
node capture-screenshots.js && python3 add-click-indicators.py && python3 composite-modal.py && python3 create-gif.py
```

**Output:** `share-form-demo.gif` (no captions)

### Version WITH Captions (For Webpage)

After generating the base screenshots above, add captions:

```bash
# 5. Add text captions to all frames (normalized heights)
python3 add-captions-normalized.py
```

**Output:** `share-form-demo-captioned.gif` (with visible text captions)

### Complete Workflow

```bash
# Generate everything (both versions)
node capture-screenshots.js && \
python3 add-click-indicators.py && \
python3 composite-modal.py && \
python3 create-gif.py && \
python3 add-captions-normalized.py
```

## Important Configuration

### Puppeteer Settings
- Viewport: 1200x1400 (large enough to capture full page)
- Headless mode: 'new'
- Padding: 20px top/bottom/left, 60px right (for button visibility)

### Click Indicator Positions
Coordinates are hardcoded in `add-click-indicators.py`. If layout changes, update:
```python
click_indicators = [
    (step_number, x, y, description),
    # ...
]
```

### GIF Settings
- Frame duration: 2000ms (2 seconds)
- Output width: 560px (resized from 780px)
- Loop: infinite
- Two versions: with and without text captions

### Caption Settings (for captioned version)
- Caption bar height: 60px
- Background: Soft black (#1a1a1a)
- Font: Helvetica Bold, 20px
- Text color: White, centered
- All frames normalized to max height before adding captions

## Key Lessons

1. **Always show all content** - Don't filter/hide cards during search, only filter the dropdown
2. **Dynamic heights are essential** - Page content grows (pills), screenshots must accommodate
3. **Click indicators are crucial** - Visual cues make interaction flow clear and comprehensive
4. **Modal compositing** - Two-layer approach (base + overlay) gives better control than single screenshot
5. **Focus matters** - Explicitly focus elements to show proper interaction states (blue borders)
6. **Normalize before captioning** - When adding text captions, normalize all frames to max height first to prevent caption cropping on taller frames

## Dependencies

- **Node.js** with Puppeteer (`npm install puppeteer`)
- **Python 3** with Pillow (`pip install Pillow`)

## Related Files

- Main HTML: `/Users/alesbrom/Documents/Projekty/osobni-web/prava/share-form-v7.html`
- Output GIF: `share-form-demo.gif` (ready to embed in documentation)
