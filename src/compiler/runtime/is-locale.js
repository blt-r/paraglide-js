import { locales } from "./variables.js";
/** @import {Locale} from "./type-definitions.js" */

// Because of a bug in tsc does not recognize that {locale is Locale} guard
// uses this type and complains that `Locale` type is unused.
// So we have to use it here.
// This is fixed in tsgo (typescript 7.0)
void (/**@type {readonly Locale[]}*/ (locales));

/**
 * Check if something is an available locale.
 *
 * @example
 *   if (isLocale(params.locale)) {
 *     setLocale(params.locale);
 *   } else {
 *     setLocale('en');
 *   }
 *
 *
 * @param {unknown} locale
 * @returns {locale is Locale}
 */
export function isLocale(locale) {
	if (typeof locale !== "string") return false;
	return !locale
		? false
		: locales.some((item) => item.toLowerCase() === locale.toLowerCase());
}
