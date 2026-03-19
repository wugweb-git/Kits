import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, '..');

function count(dir, recursive = false) {
  const fullDir = path.join(repoRoot, dir);
  if (!fs.existsSync(fullDir)) return 0;

  const visit = (current) => {
    let total = 0;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (recursive) total += visit(full);
      } else if (/\.tsx$/.test(entry.name)) {
        total += 1;
      }
    }
    return total;
  };

  return visit(fullDir);
}

const metrics = {
  generatedAt: new Date().toISOString(),
  systemComponents: count('src/components/wugweb'),
  blockPages: count('src/components/ds/pages/blocks'),
  templates: count('src/components/ds/pages/templates'),
  docsPages: count('src/components/ds/pages', true),
};
metrics.description = `${metrics.systemComponents} system components, ${metrics.blockPages} block pages, and ${metrics.templates} templates backed by a 4-layer token architecture.`;

fs.writeFileSync(path.join(repoRoot, 'system/inventory/system-metrics.json'), `${JSON.stringify(metrics, null, 2)}\n`);
fs.writeFileSync(path.join(repoRoot, 'src/lib/system-metrics.ts'), `export const systemMetrics = ${JSON.stringify(metrics, null, 2)} as const;\n`);

console.log('Generated system/inventory/system-metrics.json');
console.log('Generated src/lib/system-metrics.ts');
