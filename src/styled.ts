// Packages
import tw from 'tailwind-rn';

// Ours
import { config } from './configs';
import { Configuration, StyledVariant, ToggleVariants } from './types';
import {
	isDefaultVariant,
	getOrderedTokens,
	extractTokenInfo,
} from './utils';

function getStyle(stylename: string) {
	return tw(stylename);
}

/**
 * Resolve styles for given token(s) e.g. "dark:bg-white".
 */
export function createStyledVariants(
	tokens: string,
	config: Configuration
): StyledVariant[] {
	const { separator } = config;

	return getOrderedTokens(tokens, separator).map(
		(token) => {
			// Style Key is either the DEFAULT_VARIANT or a variant
			// e.g. "sm" or "dark:focus"
			// prettier-ignore
			const { styleName, variant } = extractTokenInfo(
				token,
				separator
			);

			return { variant, style: getStyle(styleName) };
		},
		{ default: [] }
	);
}

export function styled(
	tokens: string,
	variants?: ToggleVariants
): StyledVariant['style'][] {
	const styleList = createStyledVariants(tokens, config);

	const isVariantEnabled = ({ variant }: StyledVariant) => {
		// We always add the default styles
		if (isDefaultVariant(variant)) {
			return true;
		}

		// Variant name could possibly be nested e.g. dark:focus
		return variant
			.split(config.separator)
			.every((key) => Boolean(variants && variants[key]));
	};

	return styleList
		.filter(isVariantEnabled)
		.map((styledVariant) => styledVariant.style);
}