import { cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = fileURLToPath(new URL('..', import.meta.url));
const standaloneRoot = join(appRoot, '.next/standalone/apps/eatygo-website');
const standaloneNextRoot = join(standaloneRoot, '.next');

async function copyFresh(source, destination) {
  await rm(destination, { recursive: true, force: true });
  await cp(source, destination, { recursive: true });
}

await copyFresh(join(appRoot, 'public'), join(standaloneRoot, 'public'));
await copyFresh(join(appRoot, '.next/static'), join(standaloneNextRoot, 'static'));
