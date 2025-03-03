/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lcj-educa.com', 'localhost'],
  },
  // Configuração para servir arquivos estáticos da pasta data
  async headers() {
    return [
      {
        source: '/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600', // Cache por 1 hora
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig