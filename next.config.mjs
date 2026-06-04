/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.wbcontent.net" },
      { protocol: "https", hostname: "*.wbbasket.ru" }
    ]
  }
};

export default nextConfig;
