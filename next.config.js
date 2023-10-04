/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { api_url: process.env.api_url, pms_api_url: process.env.pms_api_url }
};

module.exports = nextConfig;
