import {
	defaultCompilerOptions,
	type CompilerOptions,
} from "../../compiler/compiler-options.js";
import { resolve } from "node:path";
import { DEFAULT_OUTDIR } from "./defaults.js";
import type { ParaglideConfig } from "./config-schema.js";

/**
 * Merges configuration sources into a full set of compiler options.
 *
 * Precedence (highest last):
 * 1. built-in defaults — `project` defaults to `./project.inlang` and
 *    `outdir` to `./src/paraglide`
 * 2. `config` — values from a paraglide config file
 * 3. `overrides` — explicitly passed values, e.g. CLI flags or plugin options
 *
 * `undefined` values in `config` and `overrides` are ignored, so an absent
 * CLI flag or plugin option never shadows the config file.
 */

export function resolveCompilerOptions(args: {
	config: ParaglideConfig | undefined;
	/** Directory used to resolve relative paths. */
	root?: string | undefined;
	overrides: Partial<Omit<CompilerOptions, "project">> & {
		project: string;
	};
}): CompilerOptions {
	const clonedDefaults = structuredClone(defaultsTemplate);
	const options: Partial<CompilerOptions> = {
		...clonedDefaults,
		...omitUndefinedEntries(args.config ?? {}),
		...omitUndefinedEntries(args.overrides ?? {}),
	};

	const resolved = options as CompilerOptions;
	if (args.root !== undefined) {
		resolved.project = resolve(args.root, resolved.project);
		resolved.outdir = resolve(args.root, resolved.outdir);
	}
	return resolved;
}

// `outputStructure` is deliberately NOT pinned here: its default differs
// per surface — bundler plugins switch to "locale-modules" in development
// (#486), while the CLI always uses "message-modules". Surfaces that need
// a pinned value pass it explicitly as an override.
// `project` has no built-in default either: bundler plugins require it
// explicitly, and the CLI decides whether to apply (and announce) the
// conventional path.
const defaultsTemplate: Omit<CompilerOptions, "outputStructure" | "project"> =
	(() => {
		const { outputStructure: _outputStructure, ...rest } =
			defaultCompilerOptions;
		return { ...rest, outdir: DEFAULT_OUTDIR };
	})();

function omitUndefinedEntries<T extends object>(object: T): T {
	return Object.fromEntries(
		Object.entries(object).filter(([, value]) => value !== undefined)
	) as T;
}
