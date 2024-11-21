/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    async rewrites() {
        return [
            {
                source: '/api/.ory/:path*',
                destination: 'http://localhost:4433/:path*' // Point to Kratos URL
            }
        ];
    },
};

export default nextConfig;
