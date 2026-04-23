import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function normalizeSiteUrl(value: string | undefined) {
  return value?.trim().replace(/\/+$/, '') ?? ''
}

function siteUrlPlugin(siteUrl: string): Plugin {
  const siteImage = siteUrl ? `${siteUrl}/favicon.svg` : '/favicon.svg'

  return {
    name: 'site-url-meta',
    transformIndexHtml(html) {
      return html
        .replaceAll('__SITE_URL__', siteUrl)
        .replaceAll('__SITE_IMAGE__', siteImage)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL)

  return {
    plugins: [react(), siteUrlPlugin(siteUrl)],
  }
})
