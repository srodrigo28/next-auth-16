/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // O coringa '**' permite QUALQUER hostname.
        hostname: '**',
      },
      // Opcional: Adicione este bloco se também precisar permitir imagens de links http (menos seguro)
      // {
      //   protocol: 'http',
      //   hostname: '**',
      // },
    ],
  },
};

module.exports = nextConfig; // ou export default nextConfig; se for .mjs