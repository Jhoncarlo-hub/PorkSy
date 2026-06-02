# PorkFolio Mobile — Agriculture Friendly UI Design Spec

**Date:** 2026-06-01  
**Target:** Android (Capacitor APK) + PWA  
**Design Reference:** Option 3 — Agriculture Friendly (Lively)

---

## 1. Vision

Transform the existing desktop-first PigTrack Pro web app into a polished, mobile-first Android application with an "Agriculture Friendly (Lively)" aesthetic. The app should feel warm, approachable, and farm-themed while remaining professional enough for business use.

---

## 2. Design Language

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--agri-bg` | `#f0f7ee` | Page background (light sage) |
| `--agri-bg-hero` | `#e8f5e3` | Hero card backgrounds |
| `--agri-green` | `#2d6a4f` | Primary brand color |
| `--agri-green-mid` | `#52b788` | Accent / active states |
| `--agri-green-light` | `#b7e4c7` | Soft fills, borders |
| `--agri-green-pale` | `#d8f3dc` | Card backgrounds |
| `--agri-amber` | `#e9c46a` | Warning / low-stock indicators |
| `--agri-red` | `#e63946` | Danger / sold status |
| `--agri-text` | `#1b4332` | Primary text |
| `--agri-muted` | `#74a892` | Secondary text |
| `--agri-surface` | `#ffffff` | Card surfaces |
| `--agri-border` | `#c8e6c9` | Card/section borders |

### Typography
- Font: System default (`-apple-system, BlinkMacSystemFont, "Segoe UI"`)
- Page titles: 22px / 600
- Section headers: 16px / 600
- Body: 14px / 400
- Labels/meta: 12px / 400 muted

### Shape Language
- Cards: `border-radius: 16px`
- Buttons/badges: `border-radius: 24px` (pill)
- Icons: `border-radius: 12px` container
- Tab filter chips: `border-radius: 20px`

### Illustration Style
- Emoji-style pig SVG/PNG in hero cards (pink pig 🐷 artwork)
- Farm landscape banner SVG at top of Dashboard (rolling green hills + farmhouse silhouette)
- Pig avatar icons in list rows (pink pig outline, color-coded by status)

---

## 3. Layout Architecture

### Navigation: Bottom Tab Bar
Replace the existing sidebar with a fixed bottom tab bar (5 tabs):
1. **Home** — `house` icon
2. **Herd** — pig icon (goes to Pig Inventory)
3. **Tasks** — clipboard-list icon
4. **Health** — heart-rate icon
5. **More** — dots icon (drawer/sheet for remaining modules)

Tab bar specs:
- Height: 64px + safe-area-inset-bottom
- Active tab: green icon + green label, subtle green underline indicator
- Inactive: gray icon + gray label
- Background: white, top border 1px `--agri-border`

### "More" Drawer
Tapping "More" opens a bottom sheet with a grid of remaining modules:
- Pens, Weights, Breeding, Feeding, Feed Inventory, Sales, Expenses, Reports, Users, Breeds
- 3-column icon grid
- Each item: rounded icon container + label below

### FAB (Floating Action Button)
- Position: bottom-right, above tab bar (`bottom: 80px; right: 16px`)
- Size: 56px circle
- Color: `--agri-green` with white `+` icon
- Only shown on list/dashboard screens (hidden on forms)

---

## 4. Screen Designs

### 4.1 Dashboard (Home)

**Header:**
- White topbar: "PorkFolio" bold title + "Good morning, [Name] 👋" subtitle
- Right: notification bell icon + avatar circle (initials)

**Hero Card — Active Pigs:**
- Full-width card, `--agri-green-pale` background
- Left: "Active Pigs" label, large number (e.g. "142"), "+12 this month" in green
- Right: Pink pig illustration (emoji-style SVG, ~80px)
- `border-radius: 20px`, subtle green border

**2-Column Metric Cards:**
- Avg Weight: weight icon (green) + value + "+2 kg" trend
- Low Feed: warning icon (red/amber) + count + "Needs attention" in red

**2-Column Metric Cards Row 2:**
- Revenue: trending-up icon + ₱ value + "+15% vs last month"
- Health Score: heart icon + percentage + "Good" label in green

**Finance Snapshot:**
- Card with "Finance Snapshot" title + "₱24,500 net" right-aligned in green
- Three horizontal progress bars: Sales (green), Expenses (amber), Profit (green-light)
- Bar labels left, bars fill proportionally

**Alerts Section:**
- Section title "Alerts"
- Alert rows: icon (amber box for feed, clipboard for tasks) + title bold + subtitle muted + chevron-right
- Tappable rows (navigate to relevant module)

### 4.2 Pig Inventory (Herd)

**Header:**
- "Pig Inventory" title + "142 active animals" subtitle
- Right: search icon button + filter icon button

**Filter Chip Row:**
- Horizontal scroll chips: All | Sow | Boar | Grower | Gilt | Finisher | Piglet
- Active chip: `--agri-green` background + white text
- Inactive: white background + gray border + gray text
- Icons inside chips for Sow/Boar/Grower tabs (small pig icon variant)

**Pig List Rows:**
- Left: 40px pig avatar (pink pig SVG, color-coded — pink for active, muted for sold)
- Middle: Tag (bold) + "Type · Pen · Weight" meta line
- Right: Status badge pill (Active=green, Sold=red)
- Tappable row → detail view (future)

### 4.3 Tasks Screen

**Header:** "Tasks" + count subtitle + filter icon

**Section grouping:** Overdue (red accent) | Today | Upcoming

**Task rows:**
- Checkbox (tappable to mark done)
- Title + due date + priority badge
- Priority: High=red pill, Medium=amber pill, Low=green pill

### 4.4 Health Screen

**Header:** "Health Records"

**Filter chips:** All | Vaccinations | Treatment | Check-up

**Health rows:**
- Pig tag + health event type + date
- Status badge: Healthy=green, Treatment=amber, Critical=red

### 4.5 More Drawer

Bottom sheet sliding up from bottom:
- Handle bar at top
- Title "More Modules"
- 3-column grid of module tiles
- Each tile: colored icon container + module name below
- Modules: Pens, Weights, Breeding, Feeding, Feed Inventory, Sales, Expenses, Reports, Users, Breeds

---

## 5. Mobile-Specific CSS

### Safe Areas
```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

### Touch Targets
- All tappable elements minimum 44px height
- List rows: minimum 56px height
- FAB: 56px circle

### Scroll Behavior
- Main content scrolls under fixed header + fixed bottom nav
- Content area: `padding-bottom: calc(64px + env(safe-area-inset-bottom))`
- Smooth scrolling: `-webkit-overflow-scrolling: touch`

### No Sidebar
The desktop sidebar (`grid-template-columns: 288px 1fr`) is replaced entirely for mobile with bottom tab navigation. The `app-shell` becomes a single column with fixed top + bottom elements.

---

## 6. File Changes Overview

### New Files
- `src/components/mobile/BottomNav.tsx` — 5-tab bottom navigation
- `src/components/mobile/MoreDrawer.tsx` — bottom sheet for extra modules
- `src/components/mobile/HeroCard.tsx` — active pigs hero card with pig illustration
- `src/components/mobile/MetricCard.tsx` — reusable metric card component
- `src/components/mobile/AlertRow.tsx` — tappable alert list row
- `src/components/mobile/FilterChips.tsx` — horizontal scrollable filter chips
- `src/components/mobile/PigRow.tsx` — pig list row with avatar
- `src/components/mobile/FAB.tsx` — floating action button
- `src/components/mobile/FarmBanner.tsx` — SVG farm landscape illustration
- `src/pages/mobile/MobileDashboard.tsx` — full mobile dashboard
- `src/pages/mobile/MobileHerd.tsx` — mobile pig inventory
- `src/pages/mobile/MobileTasks.tsx` — mobile tasks page
- `src/pages/mobile/MobileHealth.tsx` — mobile health page
- `src/styles/mobile.css` — all mobile-specific styles (agri color tokens, layout, components)

### Modified Files
- `src/App.tsx` — add mobile layout detection + route to mobile pages
- `src/components/Layout.tsx` — wrap with `isMobile` check, render mobile shell or desktop shell
- `src/hooks/useIsMobile.ts` — new hook: returns true when `window.innerWidth < 768` (or Capacitor platform = android)

---

## 7. Capacitor / Android

- `capacitor.config.ts` already present — add Android entry
- Run `npx cap add android` to generate `android/` project folder
- `npm run mobile:sync` builds and syncs to Android
- Open in Android Studio via `npx cap open android`
- Target: APK signed for Play Store (release build)

---

## 8. Success Criteria

- [ ] Bottom tab nav works on all 5 tabs
- [ ] Dashboard shows hero card, 4 metric cards, finance bars, alerts
- [ ] Pig Inventory shows filterable list with pig avatars and status badges
- [ ] Tasks screen shows grouped task rows
- [ ] Health screen shows health record rows
- [ ] More drawer opens/closes with all remaining module links
- [ ] FAB visible on list screens
- [ ] Farm landscape SVG banner renders in Dashboard header area
- [ ] All colors match Option 3 palette (sage bg, green brand, pink pig)
- [ ] Safe area insets respected on notched/punch-hole Android screens
- [ ] Desktop layout still works unchanged at ≥768px
