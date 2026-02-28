import type { NextConfig } from "next";

const nextConfig = {
    output: "standalone",
    env: {
        API_HOST_URL: process.env.API_HOST_URL
    },
}

export default nextConfig;
