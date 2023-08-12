import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export async function get(context) {
  const blog = await getCollection('blog', ({data}) => {
    if (import.meta.env.DEV) {
      return true;
    }

    return data.draft !== true;
  });
  blog.sort((postA, postB) => postB.data.pubDate.valueOf() - postA.data.pubDate.valueOf());

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
      content: sanitizeHtml(parser.render(post.body)),
    })),
    stylesheet: '/rss/pretty-feed-v3.xsl',
  });
}
