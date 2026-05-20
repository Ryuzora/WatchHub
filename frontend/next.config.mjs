import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    // This strictly isolates Turbopack to the frontend folder
    // preventing it from reading the Laravel root
    root: __dirname,
  },
};

export default nextConfig;
