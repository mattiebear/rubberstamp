import { InjectionValue } from '@/types';
import {
	camelCase,
	capitalCase,
	noCase,
	pascalCase,
	snakeCase,
} from 'change-case';

type CaseKeyLower = 'c' | 'k' | 'm' | 'p' | 's';

const noTransform = (n: string) => n;

const isCaseKeyLowerType = (string: string): string is CaseKeyLower =>
	/^[ckmps]$/.test(string);

const CaseTransformers = {
	c: capitalCase,
	k: (string: string) => noCase(string).split(' ').join('-'),
	m: camelCase,
	p: pascalCase,
	s: snakeCase,
};

export const getTransformer = (key: string) => {
	if (!key || typeof key !== 'string') {
		return noTransform;
	}

	const keyChar = key.replace(/^\$/, '').toLowerCase();

	if (isCaseKeyLowerType(keyChar)) {
		return CaseTransformers[keyChar];
	}

	return noTransform;
};

export const toString = (value: InjectionValue): string =>
	typeof value === 'number' ? value.toString() : value;
