// next.config.js
/** @type {import('next').NextConfig} */
const DOMAIN = process.env.NEXT_PUBLIC_SERVER_DOMAIN;

module.exports = {
  images: DOMAIN
    ? { domains: [DOMAIN] }
    : {
        remotePatterns: [
          { protocol: "https", hostname: "ipfs.io" },
          { protocol: "https", hostname: "nftstorage.link" },
          { protocol: "https", hostname: "cloudflare-ipfs.com" },
          { protocol: "https", hostname: "**" },
        ],
      },
}; 
