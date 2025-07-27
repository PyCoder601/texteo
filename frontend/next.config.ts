import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8002',
                pathname: '/static/**',
            },
            {
                protocol: 'https',
                hostname: 'texteo-api.romeo-projects.online',
                pathname: '/static/**',
            },
        ],
    },
};

export default nextConfig;
