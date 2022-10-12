import { Injection } from '@/types';

import { getTransformer, toString } from './transform';

export const injectData = (
	source: string,
	data: Injection | undefined
): string => {
	if (!data) {
		return source;
	}

	return Object.entries(data).reduce((acc, [key, value]) => {
		return acc.replace(
			new RegExp(`__(${key}(\\$[ckmpsCKMPS])?)__`, 'g'),
			(...match) => {
				return getTransformer(match[2])(toString(value));
			}
		);
	}, source);
};
