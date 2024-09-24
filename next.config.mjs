/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,   // Enables React's Strict Mode, helping identify potential issues
    swcMinify: true,         // Enables the faster SWC compiler for minifying the code
    images: {
        domains: ['example.com'],  // Allow images from external domains if needed
    },
    env: {
        // Define your environment variables here for server-side access
        ENVIRONMENT: process.env.ENVIRONMENT,
    },
};

export default nextConfig;