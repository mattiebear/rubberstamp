import { InjectionValue } from '@/types';

import { Case, CaseTransformer } from './CaseTransformer';

type CaseKeyLower = 'c' | 'k' | 'm' | 'p' | 's';

const noTransform = (n: string) => n;

const isCaseKeyLowerType = (string: string): string is CaseKeyLower =>
	/^[ckmps]$/.test(string);

const CaseTransformers = {
	c: Case.Capital,
	k: Case.Kebab,
	m: Case.Camel,
	p: Case.Pascal,
	s: Case.Snake,
};

export const getTransformer = (key: string) => {
	if (!key || typeof key !== 'string') {
		return noTransform;
	}

	const keyChar = key.replace(/^\$/, '').toLowerCase();

	if (isCaseKeyLowerType(keyChar)) {
		return (string: string) =>
			new CaseTransformer(string).toCase(CaseTransformers[keyChar]);
	}

	return noTransform;
};

export const toString = (value: InjectionValue): string =>
	typeof value === 'number' ? value.toString() : value;
