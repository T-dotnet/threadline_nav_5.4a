import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const distRoot = join(process.cwd(), 'dist');
const indexPath = join(distRoot, 'index.html');
const html = readFileSync(indexPath, 'utf8');

const routeRelativeEntryPattern = /\b(?:src|href)=["'](?:\.\/)?assets\//g;
const brokenEntries = html.match(routeRelativeEntryPattern) ?? [];

if (brokenEntries.length > 0) {
  console.error(
    'Build asset paths must be root-absolute. Found route-relative entry assets in dist/index.html:',
  );
  for (const entry of brokenEntries) {
    console.error(`- ${entry}`);
  }
  process.exit(1);
}

const entryAssetPattern = /\b(?:src|href)=["']([^"']*assets\/[^"']+)["']/g;
const nonRootEntries = [];

for (const match of html.matchAll(entryAssetPattern)) {
  const url = match[1];
  if (!url.startsWith('/assets/') && !url.startsWith('http')) {
    nonRootEntries.push(url);
  }
}

if (nonRootEntries.length > 0) {
  console.error('Build asset paths must start with /assets/:');
  for (const url of nonRootEntries) {
    console.error(`- ${url}`);
  }
  process.exit(1);
}
