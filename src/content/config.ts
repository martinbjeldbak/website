import {defineCollection} from 'astro:content';
import {rssSchema} from '@astrojs/rss';

const blog = defineCollection({
  type: 'content',
  schema: rssSchema,
});

export const collections = {blog};
