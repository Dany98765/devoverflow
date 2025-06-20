import PinoPretty from 'pino-pretty';

/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ["pino", "pino-pretty"]
};

export default nextConfig;
