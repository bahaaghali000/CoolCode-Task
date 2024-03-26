/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // pathname: "dtvbuahbi/image/upload/*",
      },
    ],
  },
};

export default nextConfig;
