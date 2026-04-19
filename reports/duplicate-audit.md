# Component Duplicate Audit

- Compared UI source: `src/components/ui`
- Compared legacy source: `src/components/wugweb`
- Overlapping component names: **27**
- Exact duplicates: **0**
- Non-identical overlaps: **27**
- UI-only components: **20**
- Legacy-only components: **54**

## Overlap Details

| Component | ui file | wugweb file | Exact duplicate? | Legacy state keywords detected |
|---|---|---|---|---|
| accordion | accordion.tsx | Accordion.tsx | no | disabled, hover |
| alert | alert.tsx | Alert.tsx | no | error, focus |
| avatar | avatar.tsx | Avatar.tsx | no | none-detected |
| badge | badge.tsx | Badge.tsx | no | none-detected |
| breadcrumb | breadcrumb.tsx | Breadcrumb.tsx | no | none-detected |
| button | button.tsx | Button.tsx | no | disabled, loading, hover, active, focus |
| calendar | calendar.tsx | Calendar.tsx | no | disabled, hover |
| card | card.tsx | Card.tsx | no | hover |
| chart | chart.tsx | Chart.tsx | no | active |
| checkbox | checkbox.tsx | Checkbox.tsx | no | disabled, focus |
| collapsible | collapsible.tsx | Collapsible.tsx | no | disabled |
| dialog | dialog.tsx | Dialog.tsx | no | disabled, hover, focus |
| drawer | drawer.tsx | Drawer.tsx | no | hover |
| form | form.tsx | Form.tsx | no | disabled, loading, error, focus |
| input | input.tsx | Input.tsx | no | disabled, error, focus |
| label | label.tsx | Label.tsx | no | disabled |
| pagination | pagination.tsx | Pagination.tsx | no | disabled, hover, active, focus |
| popover | popover.tsx | Popover.tsx | no | hover |
| progress | progress.tsx | Progress.tsx | no | none-detected |
| select | select.tsx | Select.tsx | no | disabled, focus |
| skeleton | skeleton.tsx | Skeleton.tsx | no | none-detected |
| slider | slider.tsx | Slider.tsx | no | disabled, hover |
| switch | switch.tsx | Switch.tsx | no | disabled, focus |
| table | table.tsx | Table.tsx | no | loading, hover |
| tabs | tabs.tsx | Tabs.tsx | no | disabled, active |
| textarea | textarea.tsx | Textarea.tsx | no | disabled, error, focus |
| tooltip | tooltip.tsx | Tooltip.tsx | no | disabled |

## UI-only Components

- alert-dialog
- aspect-ratio
- carousel
- command
- context-menu
- dropdown-menu
- hover-card
- input-otp
- menubar
- navigation-menu
- radio-group
- resizable
- scroll-area
- separator
- sheet
- sidebar
- social-button
- sonner
- toggle
- toggle-group

## Legacy-only Components

- alertdialog
- areachart
- banner
- barchart
- bottomnavigation
- bottomsheet
- buttongroup
- chatbubble
- chip
- clipboard
- combobox
- ctabanner
- datatable
- datepicker
- devicemockup
- divider
- dropdown
- embedbadge
- emptystate
- fileinput
- footerlinks
- grid
- header
- indicator
- inputgroup
- jumbotron
- kbd
- linechart
- listgroup
- logo
- megamenu
- menuitem
- nativeselect
- navigationmenu
- numberinput
- phoneinput
- piechart
- radarchart
- radialchart
- radiogroup
- rating
- searchinput
- sidemenu
- socialbutton
- speeddial
- spinner
- stepper
- tag
- teamcard
- timeline
- timepicker
- toaster
- topictile
- wysiwyg

## Recommendation

Do not mass-delete legacy components until each non-identical overlap is migrated and state parity is validated.