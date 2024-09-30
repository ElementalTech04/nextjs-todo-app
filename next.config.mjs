/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,   // Enables React's Strict Mode, helping identify potential issues
    swcMinify: true,         // Enables the faster SWC compiler for minifying the code
    images: {
        domains: ['localhost', 'symphony-ts.com', 'symphonytechsolutions.com'],  // Allow images from external domains if needed
    },
    env: {
        MOCK_DATA_API_URL: process.env.MOCK_DATA_API_URL,
        CHRONICLE_API_GATEWAY: process.env.CHRONICLE_API_GATEWAY,
        NEXT_PUBLIC_AUTH_TOKEN_KEY: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY,
        AUTH_TOKEN_SECRET: process.env.AUTH_TOKEN_SECRET,
    }
};

export default nextConfig;