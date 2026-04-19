# Full System Parity Audit

## 1) Tree presence + file counts

| Tree | Exists | Files |
|---|---:|---:|
| src/components/wugweb | yes | 85 |
| src/imports | yes | 89 |
| src/components/ds | yes | 138 |
| src/components/blocks | yes | 8 |
| src/components/stayweb | yes | 1 |
| src/components/nav | yes | 2 |
| src/components/ui | yes | 49 |

## 2) ui vs wugweb overlap parity

- Overlapping component names: **27**
- Exact-source matches: **0**
- Non-identical overlaps: **27**

| Component | UI file | Legacy file | Exact source? | UI states | Legacy states | UI css vars | Legacy css vars | UI raw visual hits | Legacy raw visual hits |
|---|---|---|---|---|---|---:|---:|---:|---:|
| accordion | src/components/ui/accordion.tsx | src/components/wugweb/Accordion.tsx | no | hover, disabled, focus | hover, disabled | 0 | 22 | 1 | 4 |
| alert | src/components/ui/alert.tsx | src/components/wugweb/Alert.tsx | no | default | default, error, focus | 1 | 45 | 0 | 8 |
| avatar | src/components/ui/avatar.tsx | src/components/wugweb/Avatar.tsx | no | none | none | 0 | 21 | 0 | 6 |
| badge | src/components/ui/badge.tsx | src/components/wugweb/Badge.tsx | no | default, hover, focus | default | 0 | 60 | 1 | 50 |
| breadcrumb | src/components/ui/breadcrumb.tsx | src/components/wugweb/Breadcrumb.tsx | no | hover, disabled | default | 0 | 19 | 0 | 4 |
| button | src/components/ui/button.tsx | src/components/wugweb/Button.tsx | no | default, hover, disabled, focus | default, hover, active, disabled, loading, focus | 0 | 62 | 1 | 0 |
| calendar | src/components/ui/calendar.tsx | src/components/wugweb/Calendar.tsx | no | hover, focus | hover, disabled | 0 | 58 | 0 | 5 |
| card | src/components/ui/card.tsx | src/components/wugweb/Card.tsx | no | none | default, hover | 0 | 41 | 0 | 6 |
| chart | src/components/ui/chart.tsx | src/components/wugweb/Chart.tsx | no | active, error | none | 0 | 17 | 8 | 1 |
| checkbox | src/components/ui/checkbox.tsx | src/components/wugweb/Checkbox.tsx | no | disabled, focus | disabled, focus | 0 | 8 | 2 | 3 |
| collapsible | src/components/ui/collapsible.tsx | src/components/wugweb/Collapsible.tsx | no | none | disabled | 0 | 31 | 0 | 6 |
| dialog | src/components/ui/dialog.tsx | src/components/wugweb/Dialog.tsx | no | hover, disabled, focus | hover, disabled, focus | 0 | 19 | 0 | 0 |
| drawer | src/components/ui/drawer.tsx | src/components/wugweb/Drawer.tsx | no | none | hover | 0 | 32 | 1 | 5 |
| form | src/components/ui/form.tsx | src/components/wugweb/Form.tsx | no | error | default, disabled, loading, error, focus | 0 | 53 | 0 | 0 |
| input | src/components/ui/input.tsx | src/components/wugweb/Input.tsx | no | disabled, focus | disabled, error, focus | 0 | 14 | 1 | 6 |
| label | src/components/ui/label.tsx | src/components/wugweb/Label.tsx | no | disabled | disabled | 0 | 4 | 0 | 0 |
| pagination | src/components/ui/pagination.tsx | src/components/wugweb/Pagination.tsx | no | default, active | hover, active, disabled, focus | 0 | 56 | 0 | 42 |
| popover | src/components/ui/popover.tsx | src/components/wugweb/Popover.tsx | no | none | default, hover | 0 | 18 | 0 | 5 |
| progress | src/components/ui/progress.tsx | src/components/wugweb/Progress.tsx | no | none | none | 0 | 9 | 0 | 1 |
| select | src/components/ui/select.tsx | src/components/wugweb/Select.tsx | no | default, hover, disabled, focus | default, disabled, focus | 2 | 32 | 1 | 12 |
| skeleton | src/components/ui/skeleton.tsx | src/components/wugweb/Skeleton.tsx | no | none | default | 0 | 3 | 0 | 0 |
| slider | src/components/ui/slider.tsx | src/components/wugweb/Slider.tsx | no | hover, disabled, focus | hover, disabled | 0 | 16 | 0 | 15 |
| switch | src/components/ui/switch.tsx | src/components/wugweb/Switch.tsx | no | disabled, focus | disabled, focus | 0 | 9 | 2 | 6 |
| table | src/components/ui/table.tsx | src/components/wugweb/Table.tsx | no | hover | default, hover, loading | 0 | 32 | 2 | 3 |
| tabs | src/components/ui/tabs.tsx | src/components/wugweb/Tabs.tsx | no | active, disabled, focus | default, active, disabled | 0 | 24 | 3 | 16 |
| textarea | src/components/ui/textarea.tsx | src/components/wugweb/Textarea.tsx | no | disabled, focus | disabled, error, focus | 0 | 11 | 1 | 3 |
| tooltip | src/components/ui/tooltip.tsx | src/components/wugweb/Tooltip.tsx | no | none | disabled | 0 | 11 | 1 | 7 |

## 3) Cross-tree references still present in src

- Total reference hits: **98**

| File | Reference token |
|---|---|
| src/App.tsx | /imports |
| src/App.tsx | components/ds |
| src/CONTRIBUTING.md | components/wugweb |
| src/CONTRIBUTING.md | /imports |
| src/CONTRIBUTING.md | components/ds |
| src/README.md | components/wugweb |
| src/components/ds/pages/AccordionDoc.tsx | components/wugweb |
| src/components/ds/pages/AlertDialogDoc.tsx | components/wugweb |
| src/components/ds/pages/AlertDoc.tsx | components/wugweb |
| src/components/ds/pages/AreaChartDoc.tsx | components/wugweb |
| src/components/ds/pages/AvatarDoc.tsx | components/wugweb |
| src/components/ds/pages/BadgeDoc.tsx | components/wugweb |
| src/components/ds/pages/BannerDoc.tsx | components/wugweb |
| src/components/ds/pages/BarChartDoc.tsx | components/wugweb |
| src/components/ds/pages/BottomNavigationDoc.tsx | components/wugweb |
| src/components/ds/pages/BottomSheetDoc.tsx | components/wugweb |
| src/components/ds/pages/BreadcrumbDoc.tsx | components/wugweb |
| src/components/ds/pages/ButtonDoc.tsx | components/wugweb |
| src/components/ds/pages/ButtonGroupDoc.tsx | components/wugweb |
| src/components/ds/pages/CTABannerDoc.tsx | components/wugweb |
| src/components/ds/pages/CalendarDoc.tsx | components/wugweb |
| src/components/ds/pages/CardDoc.tsx | components/wugweb |
| src/components/ds/pages/ChartDoc.tsx | components/wugweb |
| src/components/ds/pages/ChartsOverview.tsx | components/wugweb |
| src/components/ds/pages/ChatBubbleDoc.tsx | components/wugweb |
| src/components/ds/pages/CheckboxDoc.tsx | components/wugweb |
| src/components/ds/pages/ChipDoc.tsx | components/wugweb |
| src/components/ds/pages/ClipboardDoc.tsx | components/wugweb |
| src/components/ds/pages/CollapsibleDoc.tsx | components/wugweb |
| src/components/ds/pages/ComboboxDoc.tsx | components/wugweb |
| src/components/ds/pages/DataTableDoc.tsx | components/wugweb |
| src/components/ds/pages/DatePickerDoc.tsx | components/wugweb |
| src/components/ds/pages/DeviceMockupDoc.tsx | components/wugweb |
| src/components/ds/pages/DialogDoc.tsx | components/wugweb |
| src/components/ds/pages/DividerDoc.tsx | components/wugweb |
| src/components/ds/pages/DrawerDoc.tsx | components/wugweb |
| src/components/ds/pages/DropdownDoc.tsx | components/wugweb |
| src/components/ds/pages/EmbedBadgesDoc.tsx | components/wugweb |
| src/components/ds/pages/EmptyStateDoc.tsx | components/wugweb |
| src/components/ds/pages/FileInputDoc.tsx | components/wugweb |
| src/components/ds/pages/FooterLinksDoc.tsx | components/wugweb |
| src/components/ds/pages/FormDoc.tsx | components/wugweb |
| src/components/ds/pages/GettingStartedDoc.tsx | components/wugweb |
| src/components/ds/pages/GridDoc.tsx | components/wugweb |
| src/components/ds/pages/HeaderDoc.tsx | components/wugweb |
| src/components/ds/pages/IndicatorDoc.tsx | components/wugweb |
| src/components/ds/pages/InputGroupDoc.tsx | components/wugweb |
| src/components/ds/pages/InputTextDoc.tsx | components/wugweb |
| src/components/ds/pages/InstallationDoc.tsx | components/wugweb |
| src/components/ds/pages/JumbotronDoc.tsx | components/wugweb |
| src/components/ds/pages/KbdDoc.tsx | components/wugweb |
| src/components/ds/pages/LineChartDoc.tsx | components/wugweb |
| src/components/ds/pages/ListGroupDoc.tsx | components/wugweb |
| src/components/ds/pages/LogoDoc.tsx | components/wugweb |
| src/components/ds/pages/LogoShowcase.tsx | /imports |
| src/components/ds/pages/MegaMenuDoc.tsx | components/wugweb |
| src/components/ds/pages/MenuItemDoc.tsx | components/wugweb |
| src/components/ds/pages/NativeSelectDoc.tsx | components/wugweb |
| src/components/ds/pages/NavigationMenuDoc.tsx | components/wugweb |
| src/components/ds/pages/NumberInputDoc.tsx | components/wugweb |
| src/components/ds/pages/PaginationDoc.tsx | components/wugweb |
| src/components/ds/pages/PhoneInputDoc.tsx | components/wugweb |
| src/components/ds/pages/PieChartDoc.tsx | components/wugweb |
| src/components/ds/pages/PopoverDoc.tsx | components/wugweb |
| src/components/ds/pages/ProgressDoc.tsx | components/wugweb |
| src/components/ds/pages/RadarChartDoc.tsx | components/wugweb |
| src/components/ds/pages/RadialChartDoc.tsx | components/wugweb |
| src/components/ds/pages/RadioGroupDoc.tsx | components/wugweb |
| src/components/ds/pages/RatingDoc.tsx | components/wugweb |
| src/components/ds/pages/SearchInputDoc.tsx | components/wugweb |
| src/components/ds/pages/SelectDoc.tsx | components/wugweb |
| src/components/ds/pages/SideMenuDoc.tsx | components/wugweb |
| src/components/ds/pages/SkeletonDoc.tsx | components/wugweb |
| src/components/ds/pages/SliderDoc.tsx | components/wugweb |
| src/components/ds/pages/SocialButtonDoc.tsx | components/wugweb |
| src/components/ds/pages/SpeedDialDoc.tsx | components/wugweb |
| src/components/ds/pages/SpinnerDoc.tsx | components/wugweb |
| src/components/ds/pages/StepperDoc.tsx | components/wugweb |
| src/components/ds/pages/SwitchDoc.tsx | components/wugweb |
| src/components/ds/pages/TableDoc.tsx | components/wugweb |
| src/components/ds/pages/TagDoc.tsx | components/wugweb |
| src/components/ds/pages/TeamCardDoc.tsx | components/wugweb |
| src/components/ds/pages/TextareaDoc.tsx | components/wugweb |
| src/components/ds/pages/TimePickerDoc.tsx | components/wugweb |
| src/components/ds/pages/TimelineDoc.tsx | components/wugweb |
| src/components/ds/pages/TokenArchitectureDoc.tsx | components/wugweb |
| src/components/ds/pages/TooltipDoc.tsx | components/wugweb |
| src/components/ds/pages/TopicTileDoc.tsx | components/wugweb |
| src/components/ds/pages/WYSIWYGDoc.tsx | components/wugweb |
| src/components/wugweb/Header.tsx | /imports |
| src/components/wugweb/Logo.tsx | /imports |
| src/components/wugweb/TopicTile.tsx | /imports |
| src/components/wugweb/internal/CompleteIconLibrary.tsx | /imports |
| src/components/wugweb/internal/IconLibrary.tsx | /imports |
| src/imports/pasted_text/INDEX.md | /imports |
| src/imports/pasted_text/INDEX.md | components/ds |
| src/lib/component-registry.ts | components/wugweb |
| src/styles/globals.css | components/wugweb |

## 4) Risk conclusion

- This repository still contains substantial non-identical overlap between `ui` and `wugweb`.
- Bulk deletion of legacy trees is unsafe until migration + visual/state parity checks are complete.
- Recommended next step: migrate 1 component at a time with explicit state checklist and snapshot/interaction verification.