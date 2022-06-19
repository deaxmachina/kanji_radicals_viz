//import adapter from '@sveltejs/adapter-static';
import adapter from '@sveltejs/adapter-netlify';
import sveltePreprocess from 'svelte-preprocess'


/** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	preprocess: sveltePreprocess(),
// 	kit: {
// 		paths: {
// 			assets:
// 			  process.env.NODE_ENV === 'production' ? 'https://deaxmachina.github.io/kanji_radicals_viz/cdn' : '',
// 			base:
// 			  process.env.NODE_ENV === 'production'
// 				? ''
// 				: '',
// 		},
// 		adapter: adapter({
// 			pages: 'docs',
// 			assets: 'docs/cdn',
// 			fallback: null,
// 		  }),
// 		trailingSlash: 'always',
// 		prerender: {
// 			default: true
// 		  },
// 		vite: {
// 			ssr: {
// 				noExternal: [],
// 			},
// 			optimizeDeps: {
// 				exclude: [],
// 				include: [],
// 			  },
// 		}
// 	}
// };

export default {
  preprocess: sveltePreprocess(),
  kit: {
    // default options are shown
    adapter: adapter({
      // if true, will create a Netlify Edge Function rather
      // than using standard Node-based functions
      edge: false,

      // if true, will split your app into multiple functions
      // instead of creating a single one for the entire app.
      // if `edge` is true, this option cannot be used
      split: false
    }),
    vite: {
			ssr: {
				noExternal: ['d3', 'd3-appendselect'],
			},
			optimizeDeps: {
				exclude: [],
				include: ['hex-rgb'],
			  },
		}
  }
};

//export default config;