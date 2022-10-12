import { Injection, InjectionValue } from '@/types';

const toString = (value: InjectionValue): string =>
	typeof value === 'number' ? value.toString() : value;

export const injectData = (
	source: string,
	data: Injection | undefined
): string => {
	if (!data) {
		return source;
	}

	return Object.entries(data).reduce((acc, [key, value]) => {
		return acc.replace(new RegExp(`(__${key}__|<${key}>)`, 'g'), () =>
			toString(value)
		);
	}, source);
};
