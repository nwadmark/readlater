# Empty States Specification

## Overview
This document defines the empty state designs for the ReadLater application.

---

## 1. Home Page - No Links Saved (✅ Implemented)

**Location:** Home page "Recently Saved" section

**Container:**
- Padding: 48px 24px
- Border: 1px dashed #E0E0E0
- Border-radius: 12px
- Background: #FAFAFA

**Icon:**
- Bookmark icon (minimal line-style)
- Size: 32px
- Color: #CCCCCC

**Text:**
- Primary: "No saved links yet" (#666666, 16px, font-weight 500)
- Secondary: "Paste a URL above to save your first link" (#999999, 14px)

**Status:** ✅ Implemented in `app/page.tsx`

---

## 2. Library Page - No Links Ever (✅ Implemented)

**Location:** Library page when user has never saved anything

**Container:**
- Max-width: 400px
- Margin: 80px auto
- Text-align: center

**Icon:**
- Open book icon (BookOpen)
- Size: 64px
- Color: #D4D4D4
- Stroke-width: 1.5

**Text:**
- Primary: "Your library is empty" (#444444, 18px, font-weight 500)
- Secondary: "Links you save will appear here. You can organize them by status and revisit them anytime." (#888888, 15px, line-height 1.5)

**CTA Button:**
- Text: "Save your first link"
- Padding: 12px 24px
- Background: white
- Border: 1px solid #E0E0E0
- Border-radius: 8px
- Font-size: 14px, font-weight 500
- Navigates to Home page

**Status:** ✅ Implemented in `app/library/page.tsx`

---

## 3. Library Page - No Filter/Search Results (📋 Future)

**Location:** Library page when user has items but filter/search returns nothing

**When to Use:** Only when search or filtering functionality exists

**Container:**
- Max-width: 360px
- Margin: 60px auto
- Text-align: center

**Icon:**
- Magnifying glass with subtle "x" or question mark
- Size: 40px
- Color: #CCCCCC

**Text:**
- Primary: "No matches found" (#444444, 16px, font-weight 500, margin-top: 16px)
- Secondary: "Try adjusting your search or filters" (#888888, 14px, margin-top: 6px)

**Action:**
- Text link: "Clear filters" (#2563EB, 14px)
- Margin-top: 16px
- On hover: underline
- On click: clears all active filters/search and shows full library

**Important:**
- NO "Save your first link" button
- Messaging acknowledges existing content
- Feels helpful, not empty
- Distinct from the "never saved anything" state

**Implementation Notes:**
- Implement when search/filtering is added
- Requires state management for active filters
- Clear filters action should reset to unfiltered view
- Consider smooth transition between filtered and unfiltered states

---

## Design Principles

All empty states follow these principles:

1. **Generous Whitespace:** Trust the whitespace—don't fill it unnecessarily
2. **Minimal Messaging:** Keep text concise and actionable
3. **Subtle Visual Hierarchy:** Use muted colors that don't compete with content
4. **Clear Next Steps:** Always guide users to their next action
5. **Contextual Awareness:** Different states for different scenarios (never saved vs. filtered vs. search)
6. **Emotional Tone:** Feel like potential, not absence
7. **Stripe/Apple Inspiration:** Clean, refined, purposeful design

---

## File References

- Home page empty state: `app/page.tsx` (lines 58-66)
- Library page empty state: `app/library/page.tsx` (lines 47-60)
- Future filter empty state: To be implemented
