import { trailingSlash } from "./variables.js";

/**
 * Matches a canonical URL while allowing configured patterns to retain their
 * existing trailing slash style.
 *
 * @param {URLPattern} pattern
 * @param {URL} url
 * @returns {any}
 */
export function execUrlPattern(pattern, url) {
	const match = pattern.exec(url.href);
	if (match || trailingSlash === undefined || url.pathname === "/") {
		return match;
	}

	const alias = new URL(url);
	if (trailingSlash === "always") {
		alias.pathname = alias.pathname.replace(/\/+$/, "") || "/";
	} else if (trailingSlash === "never") {
		alias.pathname = alias.pathname.replace(/\/+$/, "") + "/";
	}
	return pattern.exec(alias.href);
}
