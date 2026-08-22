import { describe, expect, test } from "vitest";
import { resolveCompilerOptions } from "./resolve-compiler-options.js";

describe("resolveCompilerOptions", () => {
	test("falls back to the built-in defaults", () => {
		const options = resolveCompilerOptions();
		expect(options.project).toBe("./project.inlang");
		expect(options.outdir).toBe("./src/paraglide");
	});

	test("resolves the default paths against the supplied root", () => {
		const options = resolveCompilerOptions({ root: "/repo/app" });
		expect(options.project).toBe("/repo/app/project.inlang");
		expect(options.outdir).toBe("/repo/app/src/paraglide");
	});

	test("config values override the defaults", () => {
		const options = resolveCompilerOptions({
			config: { outdir: "./from-config" },
			root: "/base",
		});
		expect(options.outdir).toBe("/base/from-config");
	});

	test("overrides win over config values", () => {
		const options = resolveCompilerOptions({
			config: { outdir: "./from-config" },
			overrides: { outdir: "/from-override" },
			root: "/base",
		});
		expect(options.outdir).toBe("/from-override");
	});

	test("explicit relative paths are resolved against the root", () => {
		const options = resolveCompilerOptions({
			overrides: { project: "packages/app/project.inlang" },
			root: "/monorepo",
		});
		expect(options.project).toBe("/monorepo/packages/app/project.inlang");
	});

	test("undefined overrides do not shadow config values", () => {
		const options = resolveCompilerOptions({
			config: { strategy: ["url"] },
			overrides: { strategy: undefined },
		});
		expect(options.strategy).toEqual(["url"]);
	});

	test("absolute paths from the config survive root resolution", () => {
		const options = resolveCompilerOptions({
			config: { outdir: "/abs/out" },
			root: "/base",
		});
		expect(options.outdir).toBe("/abs/out");
	});
});
