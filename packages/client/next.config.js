/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['chess.js', 'chessground'],
};

module.exports = nextConfig;