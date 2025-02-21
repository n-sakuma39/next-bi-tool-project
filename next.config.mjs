/** @type {import('next').NextConfig} */

// @see https://zenn.dev/duo3/articles/dbb8115309059e
import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')

import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withVanillaExtract = createVanillaExtractPlugin()

const nextConfig = {
  // @see https://github.com/mswjs/msw/issues/1877
  webpack: (config, { isServer }) => {
    if (isServer) {
      // next server build => ignore msw/browser
      if (Array.isArray(config.resolve.alias)) {
        // in Next the type is always object, so this branch isn't necessary. But to keep TS happy, avoid @ts-ignore and prevent possible future breaking changes it's good to have it
        config.resolve.alias.push({ name: 'msw/browser', alias: false })
      } else {
        config.resolve.alias['msw/browser'] = false
      }
    } else {
      // browser => ignore msw/node
      if (Array.isArray(config.resolve.alias)) {
        config.resolve.alias.push({ name: 'msw/node', alias: false })
      } else {
        config.resolve.alias['msw/node'] = false
      }
    }

    // キャッシュ設定を修正（絶対パスを使用）
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [path.resolve(__dirname, 'next.config.mjs')]
      },
      cacheDirectory: path.resolve(__dirname, '.next/cache')
    }

    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}
export default withVanillaExtract(nextConfig)
