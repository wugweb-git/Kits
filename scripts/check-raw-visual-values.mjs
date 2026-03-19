import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const rawValuePattern = /#[0-9A-Fa-f]{3,8}|\b\d+(?:\.\d+)?px\b/g;

const allowlistedWugwebFiles = new Map([
  ['src/components/wugweb/Accordion.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Alert.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/AlertDialog.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/AreaChart.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Avatar.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Badge.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Banner.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/BarChart.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/BottomNavigation.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/BottomSheet.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Breadcrumb.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/CTABanner.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Calendar.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Card.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Chart.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Checkbox.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Chip.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Clipboard.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Collapsible.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Combobox.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/DataTable.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/DatePicker.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/DeviceMockup.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Drawer.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Dropdown.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/EmbedBadge.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/EmptyState.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/FileInput.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/FooterLinks.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Header.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Indicator.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Input.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/InputGroup.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Jumbotron.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/LineChart.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/ListGroup.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Logo.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/MegaMenu.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/MenuItem.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/NativeSelect.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Navbar.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/NavigationMenu.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/NumberInput.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Pagination.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/PhoneInput.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/PieChart.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Popover.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Progress.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/RadarChart.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/RadialChart.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/RadioGroup.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Rating.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/SearchInput.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Select.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/SideMenu.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Slider.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/SocialButton.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/SpeedDial.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Stepper.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Switch.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Table.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Tabs.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Tag.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/TeamCard.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Textarea.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/TimePicker.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Timeline.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Toaster.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/Tooltip.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/TopicTile.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
  ['src/components/wugweb/WYSIWYG.tsx', 'Legacy production component still being migrated to semantic/component tokens.'],
]);

function collectFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) out.push(...collectFiles(full));
    else if (full.endsWith('.ts') || full.endsWith('.tsx')) out.push(full);
  }
  return out;
}

function findViolations(file) {
  const rel = relative(root, file).replaceAll('\\', '/');
  const content = readFileSync(file, 'utf8');
  const violations = [];
  for (const match of content.matchAll(rawValuePattern)) {
    const before = content.slice(0, match.index);
    const line = before.split('\n').length;
    violations.push({ rel, line, value: match[0] });
  }
  return violations;
}

const targets = [
  { dir: join(root, 'src/components/wugweb'), allowlist: allowlistedWugwebFiles },
];

const problems = [];
for (const target of targets) {
  for (const file of collectFiles(target.dir)) {
    const rel = relative(root, file).replaceAll('\\', '/');
    if (target.allowlist.has(rel)) continue;
    problems.push(...findViolations(file));
  }
}

if (problems.length) {
  console.error('Raw visual values detected outside the approved allowlist:');
  for (const problem of problems) {
    console.error(`- ${problem.rel}:${problem.line} → ${problem.value}`);
  }
  process.exit(1);
}

console.log('Raw visual value check passed.');
console.log(`Allowlisted legacy wugweb files: ${allowlistedWugwebFiles.size}`);
