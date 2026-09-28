import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://learntok.in'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/sandbox/', '/api/', '/auth/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
