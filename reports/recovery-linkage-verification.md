# Recovery and Linkage Verification

## Deleted-tree recovery status

| Tree | Exists | File count |
|---|---:|---:|
| src/components/wugweb | yes | 85 |
| src/imports | yes | 89 |
| src/components/ds | yes | 138 |
| src/components/blocks | yes | 8 |
| src/components/stayweb | yes | 1 |
| src/components/nav | yes | 2 |

## Mapping status (ui ↔ wugweb by component filename)

- overlap: **27**
- ui-only: **20**
- legacy-only: **57**

## Naming status (token keys with spaces)

- keys containing spaces detected: **55**
- src/lib/design-tokens.ts: Neutral 10
- src/lib/design-tokens.ts: Neutral 1
- src/lib/design-tokens.ts: Neutral 5
- src/lib/design-tokens.ts: Neutral 9
- src/lib/design-tokens.ts: Neutral 2
- src/lib/design-tokens.ts: Neutral 3
- src/lib/design-tokens.ts: Neutral 8
- src/lib/design-tokens.ts: Neutral 6
- src/lib/design-tokens.ts: Neutral 4
- src/lib/design-tokens.ts: Neutral 7
- src/lib/design-tokens.ts: Ash Black
- src/lib/design-tokens.ts: Yellow Primary
- src/lib/design-tokens.ts: logo Grey
- src/lib/design-tokens.ts: Grey - BG
- src/lib/design-tokens.ts: Website - BG
- src/lib/design-tokens.ts: Error 50
- src/lib/design-tokens.ts: Error 100
- src/lib/design-tokens.ts: Error 200
- src/lib/design-tokens.ts: Error 300
- src/lib/design-tokens.ts: Error 400
- src/lib/design-tokens.ts: Error 500
- src/lib/design-tokens.ts: Error 600
- src/lib/design-tokens.ts: Error 700
- src/lib/design-tokens.ts: Error 800
- src/lib/design-tokens.ts: Error 900
- src/lib/design-tokens.ts: Warning 50
- src/lib/design-tokens.ts: Warning 100
- src/lib/design-tokens.ts: Warning 200
- src/lib/design-tokens.ts: Warning 300
- src/lib/design-tokens.ts: Warning 400
- src/lib/design-tokens.ts: Warning 500
- src/lib/design-tokens.ts: Warning 600
- src/lib/design-tokens.ts: Warning 700
- src/lib/design-tokens.ts: Warning 800
- src/lib/design-tokens.ts: Warning 900
- src/lib/design-tokens.ts: Success 50
- src/lib/design-tokens.ts: Success 100
- src/lib/design-tokens.ts: Success 200
- src/lib/design-tokens.ts: Success 300
- src/lib/design-tokens.ts: Success 400
- src/lib/design-tokens.ts: Success 500
- src/lib/design-tokens.ts: Success 600
- src/lib/design-tokens.ts: Success 700
- src/lib/design-tokens.ts: Success 800
- src/lib/design-tokens.ts: Success 900
- src/lib/design-tokens.ts: Neutral 1
- src/lib/design-tokens.ts: Neutral 2
- src/lib/design-tokens.ts: Neutral 3
- src/lib/design-tokens.ts: Neutral 4
- src/lib/design-tokens.ts: Neutral 5

## Linkage status (cross-tree references found)

- total references found: **98**
- src/App.tsx -> /imports
- src/App.tsx -> components/ds
- src/CONTRIBUTING.md -> components/wugweb
- src/CONTRIBUTING.md -> /imports
- src/CONTRIBUTING.md -> components/ds
- src/README.md -> components/wugweb
- src/components/ds/pages/AccordionDoc.tsx -> components/wugweb
- src/components/ds/pages/AlertDialogDoc.tsx -> components/wugweb
- src/components/ds/pages/AlertDoc.tsx -> components/wugweb
- src/components/ds/pages/AreaChartDoc.tsx -> components/wugweb
- src/components/ds/pages/AvatarDoc.tsx -> components/wugweb
- src/components/ds/pages/BadgeDoc.tsx -> components/wugweb
- src/components/ds/pages/BannerDoc.tsx -> components/wugweb
- src/components/ds/pages/BarChartDoc.tsx -> components/wugweb
- src/components/ds/pages/BottomNavigationDoc.tsx -> components/wugweb
- src/components/ds/pages/BottomSheetDoc.tsx -> components/wugweb
- src/components/ds/pages/BreadcrumbDoc.tsx -> components/wugweb
- src/components/ds/pages/ButtonDoc.tsx -> components/wugweb
- src/components/ds/pages/ButtonGroupDoc.tsx -> components/wugweb
- src/components/ds/pages/CTABannerDoc.tsx -> components/wugweb
- src/components/ds/pages/CalendarDoc.tsx -> components/wugweb
- src/components/ds/pages/CardDoc.tsx -> components/wugweb
- src/components/ds/pages/ChartDoc.tsx -> components/wugweb
- src/components/ds/pages/ChartsOverview.tsx -> components/wugweb
- src/components/ds/pages/ChatBubbleDoc.tsx -> components/wugweb
- src/components/ds/pages/CheckboxDoc.tsx -> components/wugweb
- src/components/ds/pages/ChipDoc.tsx -> components/wugweb
- src/components/ds/pages/ClipboardDoc.tsx -> components/wugweb
- src/components/ds/pages/CollapsibleDoc.tsx -> components/wugweb
- src/components/ds/pages/ComboboxDoc.tsx -> components/wugweb
- src/components/ds/pages/DataTableDoc.tsx -> components/wugweb
- src/components/ds/pages/DatePickerDoc.tsx -> components/wugweb
- src/components/ds/pages/DeviceMockupDoc.tsx -> components/wugweb
- src/components/ds/pages/DialogDoc.tsx -> components/wugweb
- src/components/ds/pages/DividerDoc.tsx -> components/wugweb
- src/components/ds/pages/DrawerDoc.tsx -> components/wugweb
- src/components/ds/pages/DropdownDoc.tsx -> components/wugweb
- src/components/ds/pages/EmbedBadgesDoc.tsx -> components/wugweb
- src/components/ds/pages/EmptyStateDoc.tsx -> components/wugweb
- src/components/ds/pages/FileInputDoc.tsx -> components/wugweb
- src/components/ds/pages/FooterLinksDoc.tsx -> components/wugweb
- src/components/ds/pages/FormDoc.tsx -> components/wugweb
- src/components/ds/pages/GettingStartedDoc.tsx -> components/wugweb
- src/components/ds/pages/GridDoc.tsx -> components/wugweb
- src/components/ds/pages/HeaderDoc.tsx -> components/wugweb
- src/components/ds/pages/IndicatorDoc.tsx -> components/wugweb
- src/components/ds/pages/InputGroupDoc.tsx -> components/wugweb
- src/components/ds/pages/InputTextDoc.tsx -> components/wugweb
- src/components/ds/pages/InstallationDoc.tsx -> components/wugweb
- src/components/ds/pages/JumbotronDoc.tsx -> components/wugweb
- src/components/ds/pages/KbdDoc.tsx -> components/wugweb
- src/components/ds/pages/LineChartDoc.tsx -> components/wugweb
- src/components/ds/pages/ListGroupDoc.tsx -> components/wugweb
- src/components/ds/pages/LogoDoc.tsx -> components/wugweb
- src/components/ds/pages/LogoShowcase.tsx -> /imports
- src/components/ds/pages/MegaMenuDoc.tsx -> components/wugweb
- src/components/ds/pages/MenuItemDoc.tsx -> components/wugweb
- src/components/ds/pages/NativeSelectDoc.tsx -> components/wugweb
- src/components/ds/pages/NavigationMenuDoc.tsx -> components/wugweb
- src/components/ds/pages/NumberInputDoc.tsx -> components/wugweb
- src/components/ds/pages/PaginationDoc.tsx -> components/wugweb
- src/components/ds/pages/PhoneInputDoc.tsx -> components/wugweb
- src/components/ds/pages/PieChartDoc.tsx -> components/wugweb
- src/components/ds/pages/PopoverDoc.tsx -> components/wugweb
- src/components/ds/pages/ProgressDoc.tsx -> components/wugweb
- src/components/ds/pages/RadarChartDoc.tsx -> components/wugweb
- src/components/ds/pages/RadialChartDoc.tsx -> components/wugweb
- src/components/ds/pages/RadioGroupDoc.tsx -> components/wugweb
- src/components/ds/pages/RatingDoc.tsx -> components/wugweb
- src/components/ds/pages/SearchInputDoc.tsx -> components/wugweb
- src/components/ds/pages/SelectDoc.tsx -> components/wugweb
- src/components/ds/pages/SideMenuDoc.tsx -> components/wugweb
- src/components/ds/pages/SkeletonDoc.tsx -> components/wugweb
- src/components/ds/pages/SliderDoc.tsx -> components/wugweb
- src/components/ds/pages/SocialButtonDoc.tsx -> components/wugweb
- src/components/ds/pages/SpeedDialDoc.tsx -> components/wugweb
- src/components/ds/pages/SpinnerDoc.tsx -> components/wugweb
- src/components/ds/pages/StepperDoc.tsx -> components/wugweb
- src/components/ds/pages/SwitchDoc.tsx -> components/wugweb
- src/components/ds/pages/TableDoc.tsx -> components/wugweb
- ... 18 more