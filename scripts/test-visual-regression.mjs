import { existsSync, readFileSync } from 'node:fs';
const required = ['src/hooks/useMediaQuery.ts','src/utils/responsive.ts','src/components/ds/ContextualSidebar.tsx','src/components/ds/TopNavigation.tsx'];
for (const file of required) { if (!existsSync(file)) { console.error(`Missing responsive contract file: ${file}`); process.exit(1);} }
const hook = readFileSync('src/hooks/useMediaQuery.ts', 'utf8');
if (!hook.includes('isMobile') || !hook.includes('isTablet') || !hook.includes('isDesktop')) { console.error('Responsive hook contract is incomplete.'); process.exit(1); }
const app = readFileSync('src/App.tsx', 'utf8');
if (!app.includes('useBreakpoint') || !app.includes('isSidebarOpen')) { console.error('App responsive navigation contract missing.'); process.exit(1); }
console.log('Responsive UI contract checks passed.');
