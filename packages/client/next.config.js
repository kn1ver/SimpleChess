/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['chess.js', 'chessground'],
};

module.exports = nextConfig;