# F4ktur4 UX Design System

## Design Philosophy
Minimalist, functional invoice app. Focus on clarity and efficiency. Remove visual noise, work with whitespace.

---

## Color Palette

### Primary Colors
- **Primary Action**: `#FF4500` (Orange Red) - main buttons, CTAs
- **Link/Accent**: `#ff9000` (Gold Orange) - links, secondary actions
- **Focus State**: `#1a1eb2` (Blue) - input focus borders

### Text Colors
- **Text Primary**: `#333` - body text
- **Text Secondary**: `#777` - labels, helper text
- **Text Muted**: `#aaa` / `#999` - disabled states, hints

### Background Colors
- **Background**: `#fefefe` (Off-white) - main background
- **Card Background**: `#fafafa` - cards, sections
- **Overlay**: `rgba(0,0,0,0.5)` - modal backdrop

### Status Colors
- **Error**: `#ee0000` (Red) - validation errors
- **Success**: `#4CAF50` (Green) - confirmation actions

---

## Typography

### Font Stack
```css
font-family: Avenir Next, Open Sans, Helvetica, Arial, sans-serif;
```

### Sizes
| Element | Size | Line Height |
|---------|------|-------------|
| Base | 16px | 1 |
| Labels | 0.75em (12px) | - |
| Inputs | 1.25em (20px) | - |
| H2 | 1.5rem (24px) | - |
| H4 | 1.2em (19px) | - |
| Additional Info | 0.75em (12px) | 1.4em |

---

## Form Elements

### Input Fields
- **Style**: Borderless with bottom border only
- **Border**: `2px solid #aaa`
- **Focus**: `2px solid #1a1eb2`
- **Error**: `2px solid #ee0000`
- **Disabled**: `1px dotted #aaa`, color `#aaa`
- **Padding**: `0px 8px 0px 0px`
- **No outline** - rely on border color change

### Labels
- **Position**: Above input
- **Color**: `#777`
- **Size**: `0.75em`
- **Margin**: `36px 0px 8px 0px`

### Checkboxes
- **Size**: `14px × 14px`
- **Display**: Inline with label text
- **Cursor**: Pointer

---

## Buttons

### Primary Button
```css
background-color: #FF4500;
color: #fff;
width: 220px;
height: 60px;
border-radius: 4px;
box-shadow: 4px 4px lightgrey;
transition: background-color 0.3s ease;
```

### Button States
- **Hover**: `box-shadow: 2px 2px lightgrey`
- **Disabled/Progress**: `background: #FF6E39`, no shadow
- **Progress Bar**: 6px at bottom, `#C63500`

### Link Button
- **Color**: `#ff9000`
- **Font Weight**: 400
- **Text Decoration**: None
- **Secondary**: `#999`, `0.875em`

### Mini Button
```css
background-color: #444;
color: #eee;
padding: 8px 16px;
border-radius: 4px;
font-size: 0.8em;
font-weight: 500;
```

---

## Layout

### Container
- **Margin Left**: `88px`
- **Two-column layout**: 66% main / 30% sidebar

### Spacing Scale
- **Small**: `4px`, `8px`
- **Medium**: `16px`, `24px`
- **Large**: `36px`, `40px`
- **XL**: `80px`, `88px`

### Sidebar (My Info Box)
- **Border**: 1px vertical line on left (`#ddd`)
- **Padding Left**: `16px`
- **Font Size**: `0.875em`
- **Line Height**: `1.5em`

---

## Components

### Dropdown/List Panel
```css
background-color: #fff;
border: 1px solid #ddd;
border-radius: 4px;
box-shadow: 0 4px 12px rgba(0,0,0,0.15);
padding: 12px 16px 16px 16px;
max-height: 400px;
overflow-y: auto;
```

### List Item
```css
padding: 8px;
border-radius: 4px;
cursor: pointer;
```
- **Hover**: `background-color: #f5f5f5`

### Close Button (Round)
```css
width: 24px;
height: 24px;
background: #eee;
color: #666;
border-radius: 50%;
```
- **Hover**: `background: #ddd`, `color: #333`

### Archive/Action Button (Round)
- Same style as close button
- **Hover**: `background: #ff4500`, `color: #fff`

---

## Animations

### Transitions
- **Default**: `0.2s ease` - hover states
- **Button**: `0.3s ease` - background color

### Page Transitions
- **Bounce In/Out**: `280ms-400ms` with cubic-bezier easing
- **Zoom/Fade Out**: `600ms`

### Progress Animation
```css
@keyframes progressAnimation {
  0%   { width: 0; }
  20%  { width: 5%; }
  40%  { width: 20%; }
  60%  { width: 70%; }
  80%  { width: 75%; }
  100% { width: 100%; }
}
```

---

## Status Indicators

### Additional Info Text
- **Color**: `grey`
- **Size**: `0.75em`
- **Padding Top**: `8px`

### Status Bar (Error)
```css
background-color: #ee3333;
color: #fff;
padding: 4px 16px;
position: absolute;
```

---

## Print Styles
- Container padding: `24px`
- Hide navigation and buttons

---

## Best Practices

1. **No borders between sections** - use whitespace
2. **Labels always above inputs** - never inline
3. **Consistent 4px border-radius** for buttons and cards
4. **Orange for primary actions** - never for secondary
5. **Gray tones for hierarchy** - darker = more important
6. **Subtle shadows** - `4px 4px lightgrey` max
7. **Focus states visible** - blue border for accessibility
