import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// LibreTV keeps recommendation caches in memory and user data in the browser.
// No paid R2/KV resource is required for this deployment.
export default defineCloudflareConfig({});

