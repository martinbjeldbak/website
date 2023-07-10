import rss from '@astrojs/rss';
import {getCollection} from 'astro:content';

export async function get(context) {
  const blog = await getCollection('blog');

  return rss({
    title: 'Martin Bjeldbak Madsen\'s personal blog',
    description: 'Martins\'s blog',
    site: context.site,
    items: blog.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      customData: post.data.customData,
      link: `/${post.slug}/`,
    })),
  });
}
