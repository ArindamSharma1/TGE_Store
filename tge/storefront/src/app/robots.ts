import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/account', '/cart', '/checkout'],
        },
        sitemap: 'https://tgestore.com/sitemap.xml',
    }
}
