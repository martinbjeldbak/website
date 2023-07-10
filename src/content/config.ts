import {z, defineCollection, reference} from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		tags: z.array(z.string()),
		publishDate: z.date(),
		relatedPosts: z.array(reference('blog')),
	}),
});

export const collections = {blog};
