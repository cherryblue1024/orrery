import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { loadEnv } from 'vite'

const env = loadEnv('production', process.cwd(), '')
const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL)
const siteImage = `${siteUrl}/favicon.svg`

if (!siteUrl) {
  throw new Error('Missing VITE_SITE_URL. Set it in .env.production before running pnpm build.')
}

const distDir = path.resolve('dist')
const indexPath = path.join(distDir, 'index.html')
const sitemapPath = path.join(distDir, 'sitemap.xml')
const robotsPath = path.join(distDir, 'robots.txt')

const indexHtml = await readFile(indexPath, 'utf8')
const resolvedIndexHtml = indexHtml
  .replaceAll('__SITE_URL__', siteUrl)
  .replaceAll('__SITE_IMAGE__', siteImage)

await writeFile(indexPath, resolvedIndexHtml)
await writeFile(sitemapPath, buildSitemap(siteUrl))
await writeFile(robotsPath, buildRobots(siteUrl))

function normalizeSiteUrl(value) {
  return value?.trim().replace(/\/+$/, '') ?? ''
}

function buildSitemap(baseUrl) {
  const now = new Date().toISOString()
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
}

function buildRobots(baseUrl) {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`
}
