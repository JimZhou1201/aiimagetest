/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.siliconflow.cn',
            },
            {
                protocol: 'https',
                hostname: 'sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com',
            }
        ],
    },
};

export default nextConfig;
