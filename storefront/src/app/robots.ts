import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/account', '/cart', '/checkout'],
        },
        sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tge-store-3.vercel.app'}/sitemap.xml`,
    }
}
