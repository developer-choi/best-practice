/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      {
        source: '/',
        destination: '/channel/1/videos',
        permanent: false
      },
    ]
  },
};

export default nextConfig;
