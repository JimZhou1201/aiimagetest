/** @type {import('next').NextConfig} */
const nextConfig = {
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
    env: {
        SILICONFLOW_API_KEY: process.env.SILICONFLOW_API_KEY,
    },
};

export default nextConfig;
