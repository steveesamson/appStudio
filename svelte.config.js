import adapter from "@sveltejs/adapter-static";
import sveltePreprocess from "svelte-preprocess";
import { resolve } from "path";
const dev = process.env.NODE_ENV === "development";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sveltePreprocess({
    less: true,
  }),
  // outDir: "docs",
  kit: {
    adapter: adapter({
      // default options are shown
      out: "docs",
      pages: "docs",
      assets: "docs",
      fallback: null,
      precompress: false,
    }),
    prerender: {
      // This can be false if you're using a fallback (i.e. SPA mode)
      default: true,
    },
    paths: {
      // change below to your repo name
      base: dev ? "" : "/appStudio",
    },
    // appDir: 'internal',
    vite: {
      resolve: {
        alias: {
          components: resolve("./src/components"),
          utils: resolve("./src/utils"),
        },
      },
    },
  },
};

export default config;
