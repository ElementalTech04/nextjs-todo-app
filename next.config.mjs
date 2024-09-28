/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,   // Enables React's Strict Mode, helping identify potential issues
    swcMinify: true,         // Enables the faster SWC compiler for minifying the code
    images: {
        domains: ['localhost', 'symphony-ts.com', 'symphonytechsolutions.com'],  // Allow images from external domains if needed
    }
};

export default nextConfig;