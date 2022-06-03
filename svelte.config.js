import adapter from '@sveltejs/adapter-static';
import sveltePreprocess from 'svelte-preprocess'


/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sveltePreprocess(),
	kit: {
		paths: {
			assets:
			  process.env.NODE_ENV === 'production' ? 'https://deaxmachina.github.io/kanji_radicals_viz/cdn' : '',
			base:
			  process.env.NODE_ENV === 'production'
				? '/kanji_radicals_viz'
				: '',
		},
		adapter: adapter({
			pages: 'docs',
			assets: 'docs/cdn',
			fallback: null,
		  }),
		trailingSlash: 'always',
		prerender: {
			default: true
		  },
		vite: {
			ssr: {
				noExternal: [],
			},
			optimizeDeps: {
				exclude: [],
				include: [],
			  },
		}
	}
};

export default config;