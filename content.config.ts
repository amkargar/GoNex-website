import { defineContentConfig, defineCollection, z } from '@nuxt/content'
export default defineContentConfig({ collections: {
  docs: defineCollection({ type: 'page', source: { include: 'docs/**/*.md', prefix: '/docs' }, schema: z.object({ order: z.number(), source: z.string().optional(), version: z.string(), section: z.enum(['build', 'contribute']), group: z.string() }) }),
  blog: defineCollection({ type: 'page', source: { include: 'blog/**/*.md', prefix: '/blog' }, schema: z.object({ date: z.string(), author: z.string(), category: z.string(), readingTime: z.number() }) })
} })
