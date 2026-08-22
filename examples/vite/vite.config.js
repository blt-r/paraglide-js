import { defineConfig } from "vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";

export default defineConfig({
	plugins: [paraglideVitePlugin()],
	build: {
		// eases debugging
		minify: false,
	},
});
