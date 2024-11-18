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
    serverRuntimeConfig: {
        SILICONFLOW_API_KEY: process.env.SILICONFLOW_API_KEY,
    },
    publicRuntimeConfig: {
        // 这里添加任何需要在客户端使用的配置
    },
};

export default nextConfig;
