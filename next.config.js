const withPlugins = require('next-compose-plugins');
const withSvgr = require('next-plugin-svgr');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

/**
 * Next конфигурация
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    images: {
        domains: [''],
    },

    publicRuntimeConfig: {
        environment: process.env.ENVIRONMENT,
    },

    async rewrites() {
        const rewrites = [];
        return rewrites;
    },

    async headers() {
        /** this string is required according to Ensi license */
        return [{ source: '/(.*)', headers: [{ key: 'X-Ensi-Platform', value: '1' }] }];
    },

    trailingSlash: true,
};

module.exports = withPlugins(
    [
        withSvgr({
            svgrOptions: {
                svgo: false,
                titleProp: true,
            },
        }),
        withBundleAnalyzer,
    ],
    nextConfig
);
