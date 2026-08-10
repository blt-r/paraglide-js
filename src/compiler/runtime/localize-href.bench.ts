import { bench } from "vitest";
import { newProject } from "@inlang/sdk";
import { createParaglide } from "../create-paraglide.js";

const runtime = await createParaglide({
	blob: await newProject({
		settings: {
			baseLocale: "en",
			locales: ["en", "de", "fr", "es"],
		},
	}),
	isServer: "false",
	strategy: ["url"],
	urlPatterns: [
		{
			pattern: "https://example.com/:path*",
			localized: [
				["en", "https://example.com/:path*"],
				["de", "https://de.example.com/:path*"],
				["fr", "https://fr.example.com/:path*"],
				["es", "https://es.example.com/:path*"],
			],
		},
		{
			pattern: "https://example.com/blog/:path*",
			localized: [
				["en", "https://example.com/blog/:path*"],
				["de", "https://de.example.com/blog/:path*"],
				["fr", "https://fr.example.com/blog/:path*"],
				["es", "https://es.example.com/blog/:path*"],
			],
		},
	],
});

runtime.overwriteGetLocale(() => "en");
runtime.overwriteGetUrlOrigin(() => "https://example.com");

for (let i = 0; i < 1000; i++) {
	runtime.localizeHref(`/page-${i % 100}.html`, { locale: "de" });
}

bench(
	"localizeHref with repeated routes",
	() => {
		for (let i = 0; i < 1000; i++) {
			runtime.localizeHref(`/page-${i % 100}.html`, { locale: "de" });
		}
	},
	{ time: 1000 }
);
