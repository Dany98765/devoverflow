/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost:3000',
        pathname: '/**',
      },
    ],
    remotePatterns: [new URL('https://assets.example.com/account123/**')],
    domains: ["lh3.googleusercontent.com",
    "avatars.githubusercontent.com",
    "res.cloudinary.com",],
  },
};

export default nextConfig;
